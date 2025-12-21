using Microsoft.EntityFrameworkCore;
using Elms.Api.Data;
using Elms.Api.Models;
using Elms.Api.Dtos;

namespace Elms.Api.Services
{
    public class LeaveService : ILeaveService
    {
        private readonly ApplicationDbContext _context;

        public LeaveService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ApplyLeaveAsync(ApplyLeaveDto dto)
        {
            // Validate dates
            if (dto.EndDate < dto.StartDate)
            {
                throw new ArgumentException("End date must be greater than or equal to start date");
            }

            // Get employee
            var employee = await _context.Employees.FindAsync(dto.EmployeeId);
            if (employee == null)
            {
                throw new ArgumentException("Employee not found");
            }

            // Calculate leave days
            var leaveRequest = new LeaveRequest
            {
                EmployeeId = dto.EmployeeId,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Status = LeaveStatus.Pending
            };

            var totalDays = leaveRequest.TotalDays;

            // Check if employee has enough leave balance
            if (totalDays > employee.LeaveBalance)
            {
                throw new InvalidOperationException($"Insufficient leave balance. Requested: {totalDays}, Available: {employee.LeaveBalance}");
            }

            // Check for overlapping leave requests
            var overlappingRequests = await _context.LeaveRequests
                .Where(lr => lr.EmployeeId == dto.EmployeeId &&
                             lr.Status != LeaveStatus.Rejected &&
                             ((lr.StartDate <= dto.EndDate && lr.EndDate >= dto.StartDate)))
                .ToListAsync();

            if (overlappingRequests.Any())
            {
                throw new InvalidOperationException("Overlapping leave request exists");
            }

            // Add the leave request
            _context.LeaveRequests.Add(leaveRequest);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<LeaveResponseDto>> GetEmployeeLeavesAsync(int employeeId)
        {
            var leaves = await _context.LeaveRequests
                .Where(lr => lr.EmployeeId == employeeId)
                .Include(lr => lr.Employee)
                .Select(lr => new LeaveResponseDto
                {
                    Id = lr.Id,
                    LeaveId = lr.Id,
                    EmployeeId = lr.EmployeeId,
                    EmployeeName = lr.Employee!.Name,
                    StartDate = lr.StartDate,
                    EndDate = lr.EndDate,
                    TotalDays = lr.TotalDays,
                    Status = lr.Status.ToString()
                })
                .ToListAsync();

            return leaves;
        }

        public async Task<IEnumerable<LeaveResponseDto>> GetPendingLeavesAsync()
        {
            var pendingLeaves = await _context.LeaveRequests
                .Where(lr => lr.Status == LeaveStatus.Pending)
                .Include(lr => lr.Employee)
                .Select(lr => new LeaveResponseDto
                {
                    Id = lr.Id,
                    LeaveId = lr.Id,
                    EmployeeId = lr.EmployeeId,
                    EmployeeName = lr.Employee!.Name,
                    StartDate = lr.StartDate,
                    EndDate = lr.EndDate,
                    TotalDays = lr.TotalDays,
                    Status = lr.Status.ToString()
                })
                .ToListAsync();

            return pendingLeaves;
        }

        public async Task<bool> ApproveLeaveAsync(int leaveId, int managerId)
        {
            var leaveRequest = await _context.LeaveRequests
                .Include(lr => lr.Employee)
                .FirstOrDefaultAsync(lr => lr.Id == leaveId);

            if (leaveRequest == null || leaveRequest.Employee == null)
            {
                return false;
            }

            if (leaveRequest.Status != LeaveStatus.Pending)
            {
                throw new InvalidOperationException("Only pending leave requests can be approved");
            }

            // Reduce employee's leave balance
            leaveRequest.Employee.LeaveBalance -= leaveRequest.TotalDays;
            leaveRequest.Status = LeaveStatus.Approved;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RejectLeaveAsync(int leaveId, int managerId)
        {
            var leaveRequest = await _context.LeaveRequests.FindAsync(leaveId);
            if (leaveRequest == null)
            {
                return false;
            }

            if (leaveRequest.Status != LeaveStatus.Pending)
            {
                throw new InvalidOperationException("Only pending leave requests can be rejected");
            }

            leaveRequest.Status = LeaveStatus.Rejected;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}