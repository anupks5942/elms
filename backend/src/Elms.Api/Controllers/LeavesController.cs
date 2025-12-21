using Microsoft.AspNetCore.Mvc;
using Elms.Api.Services;
using Elms.Api.Dtos;

namespace Elms.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LeavesController : ControllerBase
    {
        private readonly ILeaveService _leaveService;
        private readonly ILogger<LeavesController> _logger;

        public LeavesController(ILeaveService leaveService, ILogger<LeavesController> logger)
        {
            _leaveService = leaveService;
            _logger = logger;
        }

        /// <summary>
        /// Apply for leave
        /// </summary>
        [HttpPost("apply")]
        public async Task<ActionResult> ApplyLeave([FromBody] ApplyLeaveDto dto)
        {
            try
            {
                var result = await _leaveService.ApplyLeaveAsync(dto);
                if (result)
                {
                    return Ok(new { message = "Leave applied successfully" });
                }
                return BadRequest(new { message = "Failed to apply for leave" });
            }
            catch (ArgumentException ex)
            {
                _logger.LogError(ex, "Invalid arguments when applying for leave");
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "Operation invalid when applying for leave");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred when applying for leave");
                return StatusCode(500, new { message = "An error occurred while processing your request" });
            }
        }

        /// <summary>
        /// Get all leaves for an employee
        /// </summary>
        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<LeaveResponseDto>>> GetMyLeaves([FromQuery] int employeeId)
        {
            try
            {
                var leaves = await _leaveService.GetEmployeeLeavesAsync(employeeId);
                return Ok(leaves);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred when retrieving employee leaves");
                return StatusCode(500, new { message = "An error occurred while processing your request" });
            }
        }

        /// <summary>
        /// Get all pending leave requests
        /// </summary>
        [HttpGet("pending")]
        public async Task<ActionResult<IEnumerable<LeaveResponseDto>>> GetPendingLeaves()
        {
            try
            {
                var pendingLeaves = await _leaveService.GetPendingLeavesAsync();
                return Ok(pendingLeaves);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred when retrieving pending leaves");
                return StatusCode(500, new { message = "An error occurred while processing your request" });
            }
        }

        /// <summary>
        /// Approve a leave request
        /// </summary>
        [HttpPut("approve/{id}")]
        public async Task<ActionResult> ApproveLeave(int id, [FromBody] UpdateLeaveStatusDto dto)
        {
            try
            {
                var result = await _leaveService.ApproveLeaveAsync(id, dto.EmployeeId);
                if (result)
                {
                    return Ok(new { message = "Leave approved successfully" });
                }
                return NotFound(new { message = "Leave request not found" });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "Operation invalid when approving leave");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred when approving leave");
                return StatusCode(500, new { message = "An error occurred while processing your request" });
            }
        }

        /// <summary>
        /// Reject a leave request
        /// </summary>
        [HttpPut("reject/{id}")]
        public async Task<ActionResult> RejectLeave(int id, [FromBody] UpdateLeaveStatusDto dto)
        {
            try
            {
                var result = await _leaveService.RejectLeaveAsync(id, dto.EmployeeId);
                if (result)
                {
                    return Ok(new { message = "Leave rejected successfully" });
                }
                return NotFound(new { message = "Leave request not found" });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogError(ex, "Operation invalid when rejecting leave");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred when rejecting leave");
                return StatusCode(500, new { message = "An error occurred while processing your request" });
            }
        }
    }
}