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
public class TicketController : ControllerBase
{
    private readonly IEventService _eventService;
    private readonly IUserService _userService;

    public TicketController(IEventService eventService, IUserService userService)
    {
        _eventService = eventService;
        _userService = userService;
    }

    [HttpPost("purchase")]
    public async Task<ActionResult<TicketPurchaseDto>> PurchaseTicket(PurchaseTicketRequest request)
    {
        var userId = await GetInternalUserId();
        // userId can be Guid.Empty here if public user, which is fine for the service

        var purchase = await _eventService.PurchaseTicketAsync(request, userId == Guid.Empty ? null : userId);
        return Ok(purchase);
    }

    [HttpGet("pending-verifications")]
    [Authorize(Roles = UserRoles.SchoolAdmin)]
    public async Task<ActionResult<IEnumerable<TicketPurchaseDto>>> GetPendingVerifications([FromQuery] Guid schoolId)
    {
        var purchases = await _eventService.GetPendingVerificationsAsync(schoolId);
        return Ok(purchases);
    }

    [HttpPatch("verify/{id}")]
    [Authorize(Roles = UserRoles.SchoolAdmin)]
    public async Task<ActionResult> VerifyPayment(Guid id, [FromBody] VerifyPaymentRequest request)
    {
        var userId = await GetInternalUserId();
        if (userId == Guid.Empty) return Unauthorized("User profile not found.");

        var result = await _eventService.VerifyTicketPaymentAsync(id, request.IsApproved, userId);
        if (!result) return NotFound();
        return Ok(new { message = request.IsApproved ? "Payment verified and ticket confirmed" : "Payment rejected" });
    }

    private async Task<Guid> GetInternalUserId()
    {
        var keycloakId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(keycloakId)) return Guid.Empty;

        var user = await _userService.GetUserProfileAsync(keycloakId);
        return user?.Id ?? Guid.Empty;
    }
}
