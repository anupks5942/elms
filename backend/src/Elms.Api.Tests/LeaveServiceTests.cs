using Xunit;
using Microsoft.EntityFrameworkCore;
using Elms.Api.Data;
using Elms.Api.Models;
using Elms.Api.Services;
using System.Threading.Tasks;

namespace Elms.Api.Tests
{
    public class LeaveServiceTests
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;

        public LeaveServiceTests()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "TestElmsDb")
                .Options;
        }

        [Fact]
        public async Task ApplyLeave_ShouldCreateLeaveRequest_WhenValidInput()
        {
            // Arrange
            using var context = new ApplicationDbContext(_options);
            var service = new LeaveService(context);
            
            var dto = new ApplyLeaveDto
            {
                EmployeeId = 1,
                StartDate = DateTime.Now.AddDays(1),
                EndDate = DateTime.Now.AddDays(3)
            };
            
            // Pre-populate employee
            context.Employees.Add(new Employee { Id = 1, Name = "Test Employee", LeaveBalance = 10 });
            await context.SaveChangesAsync();

            // Act
            var result = await service.ApplyLeaveAsync(dto);

            // Assert
            Assert.True(result);
            Assert.Single(context.LeaveRequests);
        }

        [Fact]
        public async Task ApplyLeave_ShouldThrowException_WhenInsufficientBalance()
        {
            // Arrange
            using var context = new ApplicationDbContext(_options);
            var service = new LeaveService(context);
            
            var dto = new ApplyLeaveDto
            {
                EmployeeId = 1,
                StartDate = DateTime.Now.AddDays(1),
                EndDate = DateTime.Now.AddDays(15) // More than 10 days
            };
            
            // Pre-populate employee with low balance
            context.Employees.Add(new Employee { Id = 1, Name = "Test Employee", LeaveBalance = 5 });
            await context.SaveChangesAsync();

            // Act & Assert
            await Assert.ThrowsAsync<InvalidOperationException>(() => service.ApplyLeaveAsync(dto));
        }
    }
}