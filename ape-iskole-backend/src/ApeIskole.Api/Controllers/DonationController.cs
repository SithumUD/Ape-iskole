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
public class DonationController : ControllerBase
{
    private readonly IDonationService _donationService;
    private readonly IUserService _userService;

    public DonationController(IDonationService donationService, IUserService userService)
    {
        _donationService = donationService;
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DonationDto>>> GetDonations(
        [FromQuery] string? search,
        [FromQuery] string? category,
        [FromQuery] Guid? schoolId,
        [FromQuery] decimal? minGoal,
        [FromQuery] decimal? maxGoal,
        [FromQuery] string? sortBy,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var (items, totalCount) = await _donationService.GetDonationsAsync(
            search, category, minGoal, maxGoal, sortBy, true, schoolId, pageNumber, pageSize);

        Response.Headers.Add("X-Total-Count", totalCount.ToString());
        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<DonationDto>> GetDonation(Guid id)
    {
        var donation = await _donationService.GetDonationByIdAsync(id);
        if (donation == null) return NotFound();
        return Ok(donation);
    }

    [HttpGet("admin")]
    [Authorize(Roles = $"{UserRoles.SuperAdmin},{UserRoles.SchoolAdmin}")]
    public async Task<ActionResult<IEnumerable<DonationDto>>> GetAdminDonations(
        [FromQuery] string? search,
        [FromQuery] string? category,
        [FromQuery] Guid? schoolId,
        [FromQuery] bool? isApproved,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userIdStr)) return Unauthorized();

        var isSuperAdmin = User.IsInRole("SuperAdmin");
        
        // If SchoolAdmin, they should probably only see their own school's donations
        // But for now, let's filter by schoolId if provided, or return all if SuperAdmin
        
        var (items, totalCount) = await _donationService.GetDonationsAsync(
            search, category, null, null, null, isApproved, schoolId, pageNumber, pageSize);

        Response.Headers.Add("X-Total-Count", totalCount.ToString());
        return Ok(items);
    }

    [HttpPost]
    [Authorize(Roles = UserRoles.SchoolAdmin)]
    public async Task<ActionResult<DonationDto>> CreateDonation([FromForm] CreateDonationRequest request)
    {
        var userId = await GetInternalUserId();
        if (userId == Guid.Empty) return Unauthorized("User profile not found.");

        var donation = await _donationService.CreateDonationAsync(request, userId);
        return CreatedAtAction(nameof(GetDonation), new { id = donation.Id }, donation);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = UserRoles.SchoolAdmin)]
    public async Task<ActionResult<DonationDto>> UpdateDonation(Guid id, [FromForm] UpdateDonationRequest request)
    {
        var userId = await GetInternalUserId();
        if (userId == Guid.Empty) return Unauthorized("User profile not found.");

        try
        {
            var donation = await _donationService.UpdateDonationAsync(id, request, userId);
            return Ok(donation);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = $"{UserRoles.SuperAdmin},{UserRoles.SchoolAdmin}")]
    public async Task<IActionResult> DeleteDonation(Guid id)
    {
        var userId = await GetInternalUserId();
        if (userId == Guid.Empty) return Unauthorized("User profile not found.");
        var isSuperAdmin = User.IsInRole(UserRoles.SuperAdmin);

        try
        {
            var result = await _donationService.DeleteDonationAsync(id, userId, isSuperAdmin);
            if (!result) return NotFound();
            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPatch("{id}/approve")]
    [Authorize(Roles = UserRoles.SuperAdmin)]
    public async Task<IActionResult> ApproveDonation(Guid id, [FromBody] ApprovalRequest request)
    {
        var result = await _donationService.ApproveDonationAsync(id, request.IsApproved);
        if (!result) return NotFound();
        return Ok(new { message = request.IsApproved ? "Donation approved" : "Donation rejected" });
    }

    [HttpPatch("{id}/featured")]
    [Authorize(Roles = UserRoles.SuperAdmin)]
    public async Task<IActionResult> ToggleFeatured(Guid id)
    {
        var result = await _donationService.ToggleFeaturedAsync(id);
        if (!result) return NotFound();
        return Ok(new { message = "Featured status toggled successfully" });
    }

    [HttpPost("{id}/updates")]
    [Authorize(Roles = UserRoles.SchoolAdmin)]
    public async Task<ActionResult<DonationDto>> AddUpdate(Guid id, AddDonationUpdateRequest request)
    {
        var userId = await GetInternalUserId();
        if (userId == Guid.Empty) return Unauthorized("User profile not found.");

        try
        {
            var donation = await _donationService.AddDonationUpdateAsync(id, request, userId);
            return Ok(donation);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    private async Task<Guid> GetInternalUserId()
    {
        var keycloakId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(keycloakId)) return Guid.Empty;

        var user = await _userService.GetUserProfileAsync(keycloakId);
        return user?.Id ?? Guid.Empty;
    }
}
