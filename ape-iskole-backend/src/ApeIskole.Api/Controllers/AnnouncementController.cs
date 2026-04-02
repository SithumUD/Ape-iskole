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
public class AnnouncementController : ControllerBase
{
    private readonly IAnnouncementService _announcementService;
    private readonly IUserService _userService;

    public AnnouncementController(IAnnouncementService announcementService, IUserService userService)
    {
        _announcementService = announcementService;
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<AnnouncementDto>>> GetCommunityAnnouncements()
    {
        var announcements = await _announcementService.GetCommunityAsync();
        return Ok(announcements);
    }

    [HttpGet("school/{schoolId}")]
    public async Task<ActionResult<IEnumerable<AnnouncementDto>>> GetPublicAnnouncementsForSchool(Guid schoolId)
    {
        var announcements = await _announcementService.GetPublicForSchoolAsync(schoolId);
        return Ok(announcements);
    }

    [HttpGet("admin/{schoolId}")]
    [Authorize(Roles = $"{UserRoles.SchoolAdmin},{UserRoles.SuperAdmin}")]
    public async Task<ActionResult<IEnumerable<AnnouncementDto>>> GetAdminAnnouncements(Guid schoolId)
    {
        // Permission check: only school admin of this school or super admin
        var announcements = await _announcementService.GetBySchoolIdAsync(schoolId);
        return Ok(announcements);
    }

    [HttpGet("pending")]
    [Authorize(Roles = UserRoles.SuperAdmin)]
    public async Task<ActionResult<IEnumerable<AnnouncementDto>>> GetPendingAnnouncements()
    {
        var announcements = await _announcementService.GetPendingAsync();
        return Ok(announcements);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<AnnouncementDto>> GetAnnouncement(Guid id)
    {
        var announcement = await _announcementService.GetByIdAsync(id);
        if (announcement == null) return NotFound();
        return Ok(announcement);
    }

    [HttpPost]
    [Authorize(Roles = UserRoles.SchoolAdmin)]
    public async Task<ActionResult<AnnouncementDto>> CreateAnnouncement(CreateAnnouncementRequest request)
    {
        var userId = await GetInternalUserId();
        if (userId == Guid.Empty) return Unauthorized("User profile not found.");

        var announcement = await _announcementService.CreateAsync(request, userId);
        return CreatedAtAction(nameof(GetAnnouncement), new { id = announcement.Id }, announcement);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = $"{UserRoles.SchoolAdmin},{UserRoles.SuperAdmin}")]
    public async Task<ActionResult> DeleteAnnouncement(Guid id)
    {
        var userId = await GetInternalUserId();
        if (userId == Guid.Empty) return Unauthorized("User profile not found.");

        var result = await _announcementService.DeleteAsync(id, userId);
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpPatch("{id}/approve")]
    [Authorize(Roles = UserRoles.SuperAdmin)]
    public async Task<ActionResult> ApproveAnnouncement(Guid id, [FromBody] bool isApproved)
    {
        var result = await _announcementService.ApproveAsync(id, isApproved);
        if (!result) return NotFound();
        return Ok(new { message = isApproved ? "Announcement approved" : "Announcement rejected" });
    }

    private async Task<Guid> GetInternalUserId()
    {
        var keycloakId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(keycloakId)) return Guid.Empty;

        var user = await _userService.GetUserProfileAsync(keycloakId);
        return user?.Id ?? Guid.Empty;
    }
}
