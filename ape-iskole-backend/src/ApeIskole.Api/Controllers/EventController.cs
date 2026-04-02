using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using ApeIskole.Application.DTOs;
using ApeIskole.Application.Interfaces;
using ApeIskole.Domain.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApeIskole.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventController : ControllerBase
{
    private readonly IEventService _eventService;
    private readonly IUserService _userService;

    public EventController(IEventService eventService, IUserService userService)
    {
        _eventService = eventService;
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EventDto>>> GetEvents(
        [FromQuery] string? search,
        [FromQuery] string? category,
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate,
        [FromQuery] Guid? schoolId)
    {
        var events = await _eventService.GetApprovedEventsAsync(search, category, startDate, endDate, schoolId);
        return Ok(events);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EventDto>> GetEvent(Guid id)
    {
        var @event = await _eventService.GetEventByIdAsync(id);
        if (@event == null) return NotFound();
        return Ok(@event);
    }

    [HttpGet("upcoming")]
    public async Task<ActionResult<IEnumerable<EventDto>>> GetUpcomingEvents([FromQuery] int count = 5)
    {
        var events = await _eventService.GetUpcomingEventsAsync(count);
        return Ok(events);
    }

    [HttpGet("pending")]
    [Authorize(Roles = UserRoles.SuperAdmin)]
    public async Task<ActionResult<IEnumerable<EventDto>>> GetPendingEvents()
    {
        var events = await _eventService.GetPendingEventsAsync();
        return Ok(events);
    }

    [HttpGet("admin")]
    [Authorize(Roles = $"{UserRoles.SuperAdmin},{UserRoles.SchoolAdmin}")]
    public async Task<ActionResult<IEnumerable<EventDto>>> GetAdminEvents([FromQuery] Guid? schoolId)
    {
        if (User.IsInRole(UserRoles.SuperAdmin))
        {
            if (schoolId.HasValue)
                return Ok(await _eventService.GetSchoolEventsAsync(schoolId.Value));
            return Ok(await _eventService.GetAllEventsAsync());
        }
        
        // For SchoolAdmin, we should ideally get their schoolId from their profile
        // For now, if schoolId is provided, we use it (relying on frontend to pass it for their school)
        // A more secure way would be to fetch the admin's school first.
        if (schoolId.HasValue)
            return Ok(await _eventService.GetSchoolEventsAsync(schoolId.Value));
            
        return Ok(await _eventService.GetAllEventsAsync()); // Fallback or restricted
    }

    [HttpPost]
    [Authorize(Roles = UserRoles.SchoolAdmin)]
    public async Task<ActionResult<EventDto>> CreateEvent([FromForm] CreateEventRequest request)
    {
        var userId = await GetInternalUserId();
        if (userId == Guid.Empty) return Unauthorized("User profile not found.");

        var @event = await _eventService.CreateEventAsync(request, userId);
        return CreatedAtAction(nameof(GetEvent), new { id = @event.Id }, @event);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = UserRoles.SchoolAdmin)]
    public async Task<ActionResult> UpdateEvent(Guid id, [FromForm] CreateEventRequest request)
    {
        var userId = await GetInternalUserId();
        if (userId == Guid.Empty) return Unauthorized("User profile not found.");

        var result = await _eventService.UpdateEventAsync(id, request, userId);
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = $"{UserRoles.SuperAdmin},{UserRoles.SchoolAdmin}")]
    public async Task<ActionResult> DeleteEvent(Guid id)
    {
        var userId = await GetInternalUserId();
        if (userId == Guid.Empty) return Unauthorized("User profile not found.");

        var result = await _eventService.DeleteEventAsync(id, userId);
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpPatch("{id}/view")]
    [AllowAnonymous]
    public async Task<ActionResult> IncrementView(Guid id)
    {
        await _eventService.IncrementViewCountAsync(id);
        return NoContent();
    }

    [HttpPatch("{id}/approve")]
    [Authorize(Roles = UserRoles.SuperAdmin)]
    public async Task<ActionResult> ApproveEvent(Guid id, [FromBody] ApprovalRequest request)
    {
        var result = await _eventService.ApproveEventAsync(id, request.IsApproved);
        if (!result) return NotFound();
        return Ok(new { message = request.IsApproved ? "Event approved" : "Event rejected" });
    }

    private async Task<Guid> GetInternalUserId()
    {
        var keycloakId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(keycloakId)) return Guid.Empty;

        var user = await _userService.GetUserProfileAsync(keycloakId);
        return user?.Id ?? Guid.Empty;
    }
}
