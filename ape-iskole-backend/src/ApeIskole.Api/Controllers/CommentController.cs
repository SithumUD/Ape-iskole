using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ApeIskole.Application.DTOs;
using ApeIskole.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ApeIskole.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CommentController : ControllerBase
{
    private readonly ICommentService _commentService;
    private readonly IUserService _userService;

    public CommentController(ICommentService commentService, IUserService userService)
    {
        _commentService = commentService;
        _userService = userService;
    }

    [HttpGet("story/{storyId}")]
    public async Task<ActionResult<IEnumerable<CommentDto>>> GetComments(Guid storyId)
    {
        var result = await _commentService.GetCommentsByStoryIdAsync(storyId);
        return Ok(result);
    }

    [HttpPost("story/{storyId}")]
    public async Task<ActionResult<CommentDto>> AddComment(Guid storyId, [FromBody] CreateCommentRequest request)
    {
        Guid? internalUserId = null;
        var keycloakId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        if (!string.IsNullOrEmpty(keycloakId))
        {
            var userProfile = await _userService.GetUserProfileAsync(keycloakId);
            if (userProfile != null)
            {
                internalUserId = userProfile.Id;
            }
        }

        try
        {
            var result = await _commentService.AddCommentAsync(storyId, internalUserId, request);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteComment(Guid id)
    {
        var keycloakId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(keycloakId)) return Unauthorized();

        var userProfile = await _userService.GetUserProfileAsync(keycloakId);
        if (userProfile == null) return Unauthorized("User profile not found. Please sync first.");

        var isSuperAdmin = User.IsInRole("super_admin");

        try
        {
            var result = await _commentService.DeleteCommentAsync(id, userProfile.Id, isSuperAdmin);
            if (!result) return NotFound();
            return NoContent();
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpPost("{id}/like")]
    public async Task<IActionResult> LikeComment(Guid id)
    {
        var result = await _commentService.LikeCommentAsync(id);
        if (!result) return NotFound();
        return Ok();
    }
}
