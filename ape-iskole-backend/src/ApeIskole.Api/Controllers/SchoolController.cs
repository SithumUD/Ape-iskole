using ApeIskole.Application.DTOs;
using ApeIskole.Application.Interfaces;
using ApeIskole.Domain.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApeIskole.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SchoolController : ControllerBase
{
    private readonly ISchoolService _schoolService;
    private readonly IEventService _eventService;
    private readonly IDonationService _donationService;
    private readonly IAnnouncementService _announcementService;
    private readonly IUserService _userService;

    public SchoolController(
        ISchoolService schoolService,
        IEventService eventService,
        IDonationService donationService,
        IAnnouncementService announcementService,
        IUserService userService)
    {
        _schoolService = schoolService;
        _eventService = eventService;
        _donationService = donationService;
        _announcementService = announcementService;
        _userService = userService;
    }

    [HttpPost]
    // [Authorize] - Removed to allow public registration
    public async Task<ActionResult<SchoolDto>> RegisterSchool([FromBody] CreateSchoolRequest request)
    {
        var result = await _schoolService.RegisterSchoolAsync(request);
        return CreatedAtAction(nameof(GetSchool), new { id = result.Id }, result);
    }

    [HttpGet]
    [Authorize(Roles = UserRoles.SuperAdmin)] // Only super admins can see all (including inactive)
    public async Task<ActionResult<IEnumerable<SchoolDto>>> GetSchools(
        [FromQuery] string? searchTerm,
        [FromQuery] string? type,
        [FromQuery] string? city,
        [FromQuery] bool? isActive,
        [FromQuery] bool? isApproved,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var (items, totalCount) = await _schoolService.GetSchoolsAsync(searchTerm, type, city, pageNumber, pageSize, isActive, isApproved);
        
        Response.Headers.Add("X-Total-Count", totalCount.ToString());
        return Ok(items);
    }

    [HttpGet("public")]
    public async Task<ActionResult<IEnumerable<SchoolDto>>> GetPublicSchools(
        [FromQuery] string? searchTerm,
        [FromQuery] string? type,
        [FromQuery] string? city,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        // Public endpoint only returns active schools
        var (items, totalCount) = await _schoolService.GetSchoolsAsync(searchTerm, type, city, pageNumber, pageSize, isActive: true, isApproved: true);
        
        Response.Headers.Add("X-Total-Count", totalCount.ToString());
        return Ok(items);
    }

    [HttpGet("home")]
    public async Task<ActionResult<HomeDataDto>> GetHomeData()
    {
        var result = await _schoolService.GetHomeDataAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SchoolDto>> GetSchool(Guid id)
    {
        var result = await _schoolService.GetSchoolByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<ActionResult<SchoolDto>> UpdateSchool(Guid id, [FromBody] UpdateSchoolRequest request)
    {
        try
        {
            var result = await _schoolService.UpdateSchoolAsync(id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpPatch("{id}/images")]
    // [Authorize] - Removed to allow initial document upload for pending schools
    public async Task<ActionResult<SchoolDto>> UpdateImages(
        Guid id,
        IFormFile? logo,
        IFormFile? cover,
        [FromForm] List<IFormFile>? gallery)
    {
        try
        {
            var logoDto = logo != null ? new FileDto
            {
                FileName = logo.FileName,
                ContentType = logo.ContentType,
                Content = logo.OpenReadStream()
            } : null;

            var coverDto = cover != null ? new FileDto
            {
                FileName = cover.FileName,
                ContentType = cover.ContentType,
                Content = cover.OpenReadStream()
            } : null;

            var galleryDtos = gallery?.Select(f => new FileDto
            {
                FileName = f.FileName,
                ContentType = f.ContentType,
                Content = f.OpenReadStream()
            }).ToList();

            var result = await _schoolService.UpdateImagesAsync(id, logoDto, coverDto, galleryDtos);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}/soft")]
    [Authorize]
    public async Task<IActionResult> SoftDeleteSchool(Guid id)
    {
        var result = await _schoolService.SoftDeleteSchoolAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpPatch("{id}/approve")]
    [Authorize(Roles = $"{UserRoles.SuperAdmin},{UserRoles.Staff}")]
    public async Task<IActionResult> ApproveSchool(Guid id)
    {
        var result = await _schoolService.ApproveSchoolAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpPatch("{id}/reject")]
    [Authorize(Roles = $"{UserRoles.SuperAdmin},{UserRoles.Staff}")]
    public async Task<IActionResult> RejectSchool(Guid id, [FromQuery] string reason)
    {
        var result = await _schoolService.RejectSchoolAsync(id, reason);
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpPost("{id}/users")]
    [Authorize(Roles = UserRoles.SuperAdmin)]
    public async Task<ActionResult<UserDto>> CreateSchoolUser(Guid id, [FromBody] CreateSchoolUserRequest request)
    {
        try
        {
            var result = await _schoolService.CreateSchoolUserAsync(id, request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpPatch("{id}/active")]
    [Authorize(Roles = UserRoles.SuperAdmin)]
    public async Task<IActionResult> ToggleActiveStatus(Guid id, [FromQuery] bool isActive)
    {
        var result = await _schoolService.ToggleActiveStatusAsync(id, isActive);
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpGet("dashboard/stats")]
    [Authorize(Roles = UserRoles.SchoolAdmin)]
    public async Task<ActionResult<SchoolDashboardStatsDto>> GetSchoolDashboardStats()
    {
        var schoolId = await GetCurrentSchoolId();
        if (schoolId == Guid.Empty) return Unauthorized("User is not associated with any school.");

        // 1. Fetch data
        var events = await _eventService.GetApprovedEventsAsync(null, null, null, null, null);
        var schoolEvents = events.Where(e => e.SchoolId == schoolId).ToList();
        
        var pendingEvents = await _eventService.GetPendingEventsAsync();
        var schoolPendingEvents = pendingEvents.Where(e => e.SchoolId == schoolId).ToList();

        var donations = await _donationService.GetDonationsAsync(null, null, null, null, null, true, null, 1, 1000);
        var schoolDonations = donations.Items.Where(d => d.SchoolId == schoolId).ToList();
        
        var pendingDonationResult = await _donationService.GetDonationsAsync(null, null, null, null, null, false, null, 1, 1000);
        var schoolPendingDonations = pendingDonationResult.Items.Where(d => d.SchoolId == schoolId).ToList();

        var announcements = await _announcementService.GetBySchoolIdAsync(schoolId);
        var recentAnnouncements = announcements.OrderByDescending(a => a.CreatedAt).Take(3).ToList();

        // 2. Calculate Stats
        var totalTicketsSold = schoolEvents.Sum(e => e.TicketTypes.Sum(tt => tt.TotalQuantity - tt.AvailableQuantity));
        var totalTicketsCapacity = schoolEvents.Sum(e => e.TicketTypes.Sum(tt => tt.TotalQuantity));
        
        var donationsRaised = schoolDonations.Sum(d => d.RaisedAmount) + schoolEvents.Sum(e => e.DonationRaised ?? 0);
        var donationGoal = schoolDonations.Sum(d => d.GoalAmount) + schoolEvents.Sum(e => e.DonationGoal ?? 0);

        var eventViews = 0; // Views not currently tracked on EventDto, using 0 or placeholder

        return Ok(new SchoolDashboardStatsDto
        {
            Stats = new SchoolOverallStats
            {
                TotalEvents = schoolEvents.Count,
                TicketsSold = totalTicketsSold,
                DonationsReceived = donationsRaised,
                PendingApprovals = schoolPendingEvents.Count + schoolPendingDonations.Count
            },
            RecentEvents = schoolEvents.OrderByDescending(e => e.Date).Take(3).ToList(),
            RecentAnnouncements = recentAnnouncements,
            ApprovalSummary = new SchoolApprovalSummary
            {
                PendingEvents = schoolPendingEvents.Count,
                PendingDonations = schoolPendingDonations.Count
            },
            Performance = new PerformanceSnapshot
            {
                EventViews = eventViews,
                TicketConversionRate = totalTicketsCapacity > 0 ? (int)((double)totalTicketsSold / totalTicketsCapacity * 100) : 0,
                DonationGoalPercentage = donationGoal > 0 ? (int)((double)donationsRaised / (double)donationGoal * 100) : 0
            }
        });
    }

    private async Task<Guid> GetCurrentSchoolId()
    {
        var keycloakId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(keycloakId)) return Guid.Empty;

        var user = await _userService.GetUserProfileAsync(keycloakId);
        return user?.SchoolId ?? Guid.Empty;
    }
}
