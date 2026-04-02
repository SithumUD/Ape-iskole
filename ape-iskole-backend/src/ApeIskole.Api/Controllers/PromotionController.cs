using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ApeIskole.Application.DTOs;
using ApeIskole.Application.Interfaces;
using ApeIskole.Domain.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApeIskole.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PromotionController : ControllerBase
{
    private readonly IPromotionService _promotionService;

    public PromotionController(IPromotionService promotionService)
    {
        _promotionService = promotionService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PromotionDto>>> GetActivePromotions()
    {
        var result = await _promotionService.GetAllActivePromotionsAsync();
        return Ok(result);
    }

    [HttpGet("admin")]
    [Authorize(Roles = UserRoles.SuperAdmin)]
    public async Task<ActionResult<IEnumerable<PromotionDto>>> GetAllAdminPromotions()
    {
        var result = await _promotionService.GetAllPromotionsAdminAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PromotionDto>> GetPromotion(Guid id)
    {
        var result = await _promotionService.GetPromotionByIdAsync(id);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpPost]
    [Authorize(Roles = UserRoles.SuperAdmin)]
    public async Task<ActionResult<PromotionDto>> CreatePromotion([FromForm] CreatePromotionRequest request)
    {
        var result = await _promotionService.CreatePromotionAsync(request);
        return CreatedAtAction(nameof(GetPromotion), new { id = result.Id }, result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = UserRoles.SuperAdmin)]
    public async Task<ActionResult<PromotionDto>> UpdatePromotion(Guid id, [FromForm] UpdatePromotionRequest request)
    {
        var result = await _promotionService.UpdatePromotionAsync(id, request);
        if (result == null) return NotFound();
        return Ok(result);
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = UserRoles.SuperAdmin)]
    public async Task<IActionResult> DeletePromotion(Guid id)
    {
        var result = await _promotionService.DeletePromotionAsync(id);
        if (!result) return NotFound();
        return NoContent();
    }

    [HttpPost("{id}/claim")]
    public async Task<IActionResult> ClaimPromotion(Guid id)
    {
        var result = await _promotionService.ClaimPromotionAsync(id);
        if (!result) return NotFound();
        return Ok();
    }
}
