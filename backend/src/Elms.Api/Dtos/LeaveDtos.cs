using System.ComponentModel.DataAnnotations;

namespace Elms.Api.Dtos
{
    public class ApplyLeaveDto
    {
        [Required]
        public int EmployeeId { get; set; }
        
        [Required]
        public DateTime StartDate { get; set; }
        
        [Required]
        public DateTime EndDate { get; set; }
    }
    
    public class LeaveResponseDto
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int TotalDays { get; set; }
        public string Status { get; set; } = string.Empty;
    }
    
    public class UpdateLeaveStatusDto
    {
        [Required]
        public int EmployeeId { get; set; }
    }
}