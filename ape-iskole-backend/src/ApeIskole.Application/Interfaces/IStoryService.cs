using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ApeIskole.Application.DTOs;

namespace ApeIskole.Application.Interfaces;

public interface IStoryService
{
    Task<StoryDto> CreateStoryAsync(Guid authorId, CreateStoryRequest request);
    Task<StoryDto> UpdateStoryAsync(Guid storyId, Guid userId, UpdateStoryRequest request);
    Task<bool> DeleteStoryAsync(Guid storyId, Guid userId);
    Task<StoryDto?> GetStoryByIdAsync(Guid id);
    Task<(IEnumerable<StoryDto> Items, int TotalCount)> GetPagedStoriesAsync(
        string? searchTerm, 
        string? category, 
        Guid? schoolId, 
        string? tag,
        bool? isPublished,
        int pageNumber, 
        int pageSize);
    Task<bool> ApproveStoryAsync(Guid id, bool isApproved);
    Task<bool> LikeStoryAsync(Guid id);
    Task<bool> IncrementViewsAsync(Guid id);
    Task<string?> UpdateImageAsync(Guid storyId, FileDto image);
}
