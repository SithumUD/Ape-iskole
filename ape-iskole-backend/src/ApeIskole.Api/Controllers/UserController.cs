using ApeIskole.Application.DTOs;
using ApeIskole.Application.Interfaces;
using ApeIskole.Domain.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ApeIskole.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Requires Keycloak JWT by default
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("sync")]
    public async Task<ActionResult<UserDto>> SyncUser([FromBody] SyncUserRequest request)
    {
        // Get Keycloak ID from the token to ensure the user is syncing their own account
        var keycloakId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(keycloakId) || keycloakId != request.KeycloakId)
        {
            return BadRequest("Invalid Keycloak ID in request or token mismatch.");
        }

        var result = await _userService.SyncUserAsync(request);
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = UserRoles.SuperAdmin)]
    public async Task<ActionResult<UserDto>> CreateUser([FromBody] CreateUserRequest request)
    {
        var result = await _userService.CreateUserAsync(request);
        return CreatedAtAction(nameof(GetUser), new { id = result.Id }, result);
    }

    [HttpGet("me")]
    public async Task<ActionResult<UserDto>> GetCurrentUser()
    {
        var keycloakId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (string.IsNullOrEmpty(keycloakId))
        {
            return Unauthorized("User identity not found in token.");
        }

        var user = await _userService.GetUserProfileAsync(keycloakId);
        if (user == null)
        {
            return NotFound("User profile not found in database. Please sync first.");
        }

        return Ok(user);
    }

    [HttpGet]
    [Authorize(Roles = UserRoles.SuperAdmin)]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers(
        [FromQuery] string? searchTerm,
        [FromQuery] string? role,
        [FromQuery] Guid? schoolId,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var (items, totalCount) = await _userService.GetPagedUsersAsync(searchTerm, role, schoolId, pageNumber, pageSize);
        Response.Headers.Add("X-Total-Count", totalCount.ToString());
        return Ok(items);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = UserRoles.SuperAdmin)]
    public async Task<ActionResult<UserDto>> GetUser(Guid id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null) return NotFound();
        return Ok(user);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = UserRoles.SuperAdmin)]
    public async Task<ActionResult<UserDto>> UpdateUser(Guid id, [FromBody] UpdateUserRequest request)
    {
        try
        {
            var result = await _userService.UpdateUserAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = UserRoles.SuperAdmin)]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var result = await _userService.DeleteUserAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpPatch("{id}/verify")]
    [Authorize(Roles = UserRoles.SuperAdmin)]
    public async Task<IActionResult> VerifyUser(Guid id, [FromQuery] bool isVerified)
    {
        var result = await _userService.VerifyUserAsync(id, isVerified);
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpPatch("{id}/student")]
    public async Task<IActionResult> ToggleStudentStatus(Guid id, [FromQuery] bool isStudent)
    {
        // Allow super admin OR the user themselves
        var currentKeycloakId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var user = await _userService.GetUserByIdAsync(id);
        
        if (user == null) return NotFound();

        if (!User.IsInRole(UserRoles.SuperAdmin) && user.KeycloakId != currentKeycloakId)
        {
            return Forbid();
        }

        var result = await _userService.ToggleStudentStatusAsync(id, isStudent);
        return NoContent();
    }
}
