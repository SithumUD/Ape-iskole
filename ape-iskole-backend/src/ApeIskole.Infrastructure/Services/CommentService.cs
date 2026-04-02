using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApeIskole.Application.DTOs;
using ApeIskole.Application.Interfaces;
using ApeIskole.Domain.Entities;

namespace ApeIskole.Infrastructure.Services;

public class CommentService : ICommentService
{
    private readonly IUnitOfWork _unitOfWork;

    public CommentService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<CommentDto> AddCommentAsync(Guid storyId, Guid? userId, CreateCommentRequest request)
    {
        var story = await _unitOfWork.Stories.GetByIdAsync(storyId);
        if (story == null || story.IsDeleted) throw new KeyNotFoundException("Story not found");

        var comment = new Comment
        {
            StoryId = storyId,
            UserId = userId,
            Content = request.Content,
            AuthorName = request.AnonymousName,
            Likes = 0
        };

        // If registered user, use their name if not provided
        if (userId.HasValue && string.IsNullOrEmpty(comment.AuthorName))
        {
            var user = await _unitOfWork.Users.GetByIdAsync(userId.Value);
            comment.AuthorName = user?.FullName;
        }

        await _unitOfWork.Comments.AddAsync(comment);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(comment);
    }

    public async Task<IEnumerable<CommentDto>> GetCommentsByStoryIdAsync(Guid storyId)
    {
        var comments = await _unitOfWork.Comments.GetCommentsByStoryIdAsync(storyId);
        return comments.Select(MapToDto);
    }

    public async Task<bool> DeleteCommentAsync(Guid commentId, Guid userId, bool isSuperAdmin)
    {
        var comment = await _unitOfWork.Comments.GetByIdAsync(commentId);
        if (comment == null || comment.IsDeleted) return false;

        // Only author or super admin can delete
        if (!isSuperAdmin && comment.UserId != userId)
        {
            throw new UnauthorizedAccessException("Not authorized to delete this comment");
        }

        comment.IsDeleted = true;
        _unitOfWork.Comments.Update(comment);
        return await _unitOfWork.SaveChangesAsync() > 0;
    }

    public async Task<bool> LikeCommentAsync(Guid id)
    {
        var comment = await _unitOfWork.Comments.GetByIdAsync(id);
        if (comment == null || comment.IsDeleted) return false;

        comment.Likes++;
        _unitOfWork.Comments.Update(comment);
        return await _unitOfWork.SaveChangesAsync() > 0;
    }

    private static CommentDto MapToDto(Comment c)
    {
        return new CommentDto
        {
            Id = c.Id,
            StoryId = c.StoryId,
            Content = c.Content,
            Likes = c.Likes,
            UserId = c.UserId,
            AuthorName = c.AuthorName,
            CreatedAt = c.CreatedAt
        };
    }
}
