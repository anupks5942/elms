using System.ComponentModel.DataAnnotations;

namespace Elms.Api.Models
{
    public enum LeaveStatus
    {
        Pending,
        Approved,
        Rejected
    }

    public class LeaveRequest
    {
        public int Id { get; set; }
        
        public int EmployeeId { get; set; }
        public Employee? Employee { get; set; }
        
        [Required]
        public DateTime StartDate { get; set; }
        
        [Required]
        public DateTime EndDate { get; set; }
        
        public LeaveStatus Status { get; set; } = LeaveStatus.Pending;
        
        public int TotalDays => CalculateTotalDays();
        
        private int CalculateTotalDays()
        {
            if (EndDate < StartDate)
                return 0;
            
            // Calculate the number of days excluding weekends
            var totalDays = 0;
            var currentDate = StartDate.Date;
            
            while (currentDate <= EndDate.Date)
            {
                if (currentDate.DayOfWeek != DayOfWeek.Saturday && 
                    currentDate.DayOfWeek != DayOfWeek.Sunday)
                {
                    totalDays++;
                }
                currentDate = currentDate.AddDays(1);
            }
            
            return totalDays;
        }
    }
}