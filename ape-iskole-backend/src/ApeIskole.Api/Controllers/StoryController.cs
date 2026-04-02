using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ApeIskole.Application.DTOs;
using ApeIskole.Application.Interfaces;
using ApeIskole.Domain.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace ApeIskole.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StoryController : ControllerBase
{
    private readonly IStoryService _storyService;
    private readonly IUserService _userService;

    public StoryController(IStoryService storyService, IUserService userService)
    {
        _storyService = storyService;
        _userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<StoryDto>>> GetStories(
        [FromQuery] string? searchTerm,
        [FromQuery] string? category,
        [FromQuery] Guid? schoolId,
        [FromQuery] string? tag,
        [FromQuery] bool? isPublished,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var (items, totalCount) = await _storyService.GetPagedStoriesAsync(searchTerm, category, schoolId, tag, isPublished, pageNumber, pageSize);
        Response.Headers.Add("X-Total-Count", totalCount.ToString());
        return Ok(items);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<StoryDto>> GetStory(Guid id)
    {
        var story = await _storyService.GetStoryByIdAsync(id);
        if (story == null) return NotFound();
        
        await _storyService.IncrementViewsAsync(id);
        
        return Ok(story);
    }

    [HttpPost]
    [Authorize(Roles = $"{UserRoles.SuperAdmin},{UserRoles.SchoolAdmin}")]
    public async Task<ActionResult<StoryDto>> CreateStory([FromBody] CreateStoryRequest request)
    {
        var keycloakId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(keycloakId)) return Unauthorized();

        var userProfile = await _userService.GetUserProfileAsync(keycloakId);
        if (userProfile == null) return Unauthorized("User profile not found. Please sync first.");

        try
        {
            var result = await _storyService.CreateStoryAsync(userProfile.Id, request);
            return CreatedAtAction(nameof(GetStory), new { id = result.Id }, result);
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, ex.Message);
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = $"{UserRoles.SuperAdmin},{UserRoles.SchoolAdmin}")]
    public async Task<ActionResult<StoryDto>> UpdateStory(Guid id, [FromBody] UpdateStoryRequest request)
    {
        var keycloakId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(keycloakId)) return Unauthorized();

        var userProfile = await _userService.GetUserProfileAsync(keycloakId);
        if (userProfile == null) return Unauthorized("User profile not found. Please sync first.");

        try
        {
            var result = await _storyService.UpdateStoryAsync(id, userProfile.Id, request);
            return Ok(result);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, ex.Message);
        }
    }

    [HttpPatch("{id}/image")]
    [Authorize(Roles = $"{UserRoles.SuperAdmin},{UserRoles.SchoolAdmin}")]
    public async Task<ActionResult<string>> UpdateImage(Guid id, IFormFile image)
    {
        if (image == null) return BadRequest("No image provided.");

        try
        {
            var fileDto = new FileDto
            {
                FileName = image.FileName,
                ContentType = image.ContentType,
                Content = image.OpenReadStream()
            };

            var result = await _storyService.UpdateImageAsync(id, fileDto);
            if (result == null) return NotFound("Story not found or upload failed.");

            return Ok(new { imageUrl = result });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = $"{UserRoles.SuperAdmin},{UserRoles.SchoolAdmin}")]
    public async Task<IActionResult> DeleteStory(Guid id)
    {
        var keycloakId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(keycloakId)) return Unauthorized();

        var userProfile = await _userService.GetUserProfileAsync(keycloakId);
        if (userProfile == null) return Unauthorized("User profile not found. Please sync first.");

        try
        {
            var result = await _storyService.DeleteStoryAsync(id, userProfile.Id);
            if (!result) return NotFound();
            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, ex.Message);
        }
    }


    [HttpPost("{id}/like")]
    public async Task<IActionResult> LikeStory(Guid id)
    {
        var result = await _storyService.LikeStoryAsync(id);
        if (!result) return NotFound();
        return Ok();
    }
}
