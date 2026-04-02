using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApeIskole.Application.DTOs;
using ApeIskole.Application.Interfaces;
using ApeIskole.Domain.Entities;

namespace ApeIskole.Infrastructure.Services;

public class StoryService : IStoryService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICloudinaryService _cloudinaryService;

    public StoryService(IUnitOfWork unitOfWork, ICloudinaryService cloudinaryService)
    {
        _unitOfWork = unitOfWork;
        _cloudinaryService = cloudinaryService;
    }

    public async Task<StoryDto> CreateStoryAsync(Guid authorId, CreateStoryRequest request)
    {
        var user = await _unitOfWork.Users.GetByIdAsync(authorId);
        if (user == null) throw new UnauthorizedAccessException("User not found");

        if (user.Role == "school_admin" && user.SchoolId != request.SchoolId)
        {
            throw new UnauthorizedAccessException("You can only create stories for your own school.");
        }

        var story = new Story
        {
            Title = request.Title,
            Description = request.Description,
            Content = request.Content,
            Category = request.Category,
            Image = request.Image,
            Gallery = request.Gallery,
            Tags = request.Tags,
            IsFeatured = request.IsFeatured,
            SchoolId = request.SchoolId,
            AuthorId = authorId,
            IsPublished = request.IsPublished
        };

        await _unitOfWork.Stories.AddAsync(story);
        await _unitOfWork.SaveChangesAsync();

        return await GetStoryByIdAsync(story.Id) ?? throw new Exception("Failed to retrieve created story");
    }

    public async Task<StoryDto> UpdateStoryAsync(Guid storyId, Guid userId, UpdateStoryRequest request)
    {
        var story = await _unitOfWork.Stories.GetByIdAsync(storyId);
        if (story == null || story.IsDeleted) throw new KeyNotFoundException("Story not found");

        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null) throw new UnauthorizedAccessException("User not found");

        if (user.Role != "super_admin" && story.AuthorId != userId && (user.Role != "school_admin" || user.SchoolId != story.SchoolId))
        {
            throw new UnauthorizedAccessException("You are not authorized to update this story.");
        }

        story.Title = request.Title;
        story.Description = request.Description;
        story.Content = request.Content;
        story.Category = request.Category;
        story.Image = request.Image;
        story.Gallery = request.Gallery;
        story.Tags = request.Tags;
        story.IsFeatured = request.IsFeatured;
        story.IsPublished = request.IsPublished;

        _unitOfWork.Stories.Update(story);
        await _unitOfWork.SaveChangesAsync();

        return await GetStoryByIdAsync(storyId) ?? throw new Exception("Failed to retrieve updated story");
    }

    public async Task<bool> DeleteStoryAsync(Guid storyId, Guid userId)
    {
        var story = await _unitOfWork.Stories.GetByIdAsync(storyId);
        if (story == null || story.IsDeleted) return false;

        var user = await _unitOfWork.Users.GetByIdAsync(userId);
        if (user == null) return false;

        if (user.Role != "super_admin" && story.AuthorId != userId && (user.Role != "school_admin" || user.SchoolId != story.SchoolId))
        {
            throw new UnauthorizedAccessException("You are not authorized to delete this story.");
        }

        story.IsDeleted = true;
        _unitOfWork.Stories.Update(story);
        return await _unitOfWork.SaveChangesAsync() > 0;
    }

    public async Task<StoryDto?> GetStoryByIdAsync(Guid id)
    {
        var story = await _unitOfWork.Stories.GetStoryWithDetailsAsync(id);
        if (story == null) return null;

        return MapToDto(story);
    }

    public async Task<(IEnumerable<StoryDto> Items, int TotalCount)> GetPagedStoriesAsync(
        string? searchTerm, 
        string? category, 
        Guid? schoolId, 
        string? tag,
        bool? isPublished,
        int pageNumber, 
        int pageSize)
    {
        var (items, totalCount) = await _unitOfWork.Stories.GetPagedStoriesAsync(searchTerm, category, schoolId, tag, isPublished, pageNumber, pageSize);
        return (items.Select(s => MapToDto(s)), totalCount);
    }

    public async Task<bool> ApproveStoryAsync(Guid id, bool isApproved)
    {
        // No longer needed as per user request to remove story moderation
        return false;
    }

    public async Task<bool> LikeStoryAsync(Guid id)
    {
        var story = await _unitOfWork.Stories.GetByIdAsync(id);
        if (story == null || story.IsDeleted) return false;

        story.Likes++;
        _unitOfWork.Stories.Update(story);
        return await _unitOfWork.SaveChangesAsync() > 0;
    }

    public async Task<bool> IncrementViewsAsync(Guid id)
    {
        var story = await _unitOfWork.Stories.GetByIdAsync(id);
        if (story == null || story.IsDeleted) return false;

        story.Views++;
        _unitOfWork.Stories.Update(story);
        return await _unitOfWork.SaveChangesAsync() > 0;
    }

    public async Task<string?> UpdateImageAsync(Guid storyId, FileDto image)
    {
        var story = await _unitOfWork.Stories.GetByIdAsync(storyId);
        if (story == null || story.IsDeleted) return null;

        // Upload to Cloudinary
        var imageUrl = await _cloudinaryService.UploadImageAsync(image, "stories");
        if (string.IsNullOrEmpty(imageUrl)) return null;

        // Delete old image if it exists and is a Cloudinary URL
        if (!string.IsNullOrEmpty(story.Image) && story.Image.Contains("cloudinary"))
        {
            await _cloudinaryService.DeleteImageAsync(story.Image);
        }

        story.Image = imageUrl;
        _unitOfWork.Stories.Update(story);
        await _unitOfWork.SaveChangesAsync();

        return imageUrl;
    }

    private static StoryDto MapToDto(Story s)
    {
        return new StoryDto
        {
            Id = s.Id,
            Title = s.Title,
            Description = s.Description,
            Content = s.Content,
            Category = s.Category,
            Image = s.Image,
            Gallery = s.Gallery,
            Tags = s.Tags,
            Views = s.Views,
            Likes = s.Likes,
            IsFeatured = s.IsFeatured,
            IsPublished = s.IsPublished,
            Status = s.Status,
            SchoolId = s.SchoolId,
            SchoolName = s.School?.Name ?? string.Empty,
            AuthorId = s.AuthorId,
            AuthorName = s.Author?.FullName ?? string.Empty,
            CreatedAt = s.CreatedAt,
            CommentCount = s.Comments?.Count ?? 0
        };
    }
}
