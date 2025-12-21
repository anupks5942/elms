using Elms.Api.Models;
using Elms.Api.Dtos;

namespace Elms.Api.Services
{
    public interface ILeaveService
    {
        Task<bool> ApplyLeaveAsync(ApplyLeaveDto dto);
        Task<IEnumerable<LeaveResponseDto>> GetEmployeeLeavesAsync(int employeeId);
        Task<IEnumerable<LeaveResponseDto>> GetPendingLeavesAsync();
        Task<bool> ApproveLeaveAsync(int leaveId, int managerId);
        Task<bool> RejectLeaveAsync(int leaveId, int managerId);
    }
}