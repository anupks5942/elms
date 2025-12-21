using System.ComponentModel.DataAnnotations;

namespace Elms.Api.Models
{
    public class Employee
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;
        
        public int LeaveBalance { get; set; }
    }
}