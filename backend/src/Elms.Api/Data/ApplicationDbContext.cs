using Microsoft.EntityFrameworkCore;
using Elms.Api.Models;

namespace Elms.Api.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<LeaveRequest> LeaveRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed initial data
            modelBuilder.Entity<Employee>().HasData(
                new Employee { Id = 1, Name = "John Doe", LeaveBalance = 20 },
                new Employee { Id = 2, Name = "Jane Smith", LeaveBalance = 15 },
                new Employee { Id = 3, Name = "Bob Johnson", LeaveBalance = 18 }
            );
        }
    }
}