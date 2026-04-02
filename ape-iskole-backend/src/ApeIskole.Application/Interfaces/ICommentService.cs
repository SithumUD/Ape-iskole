using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ApeIskole.Application.DTOs;

namespace ApeIskole.Application.Interfaces;

public interface ICommentService
{
    Task<CommentDto> AddCommentAsync(Guid storyId, Guid? userId, CreateCommentRequest request);
    Task<IEnumerable<CommentDto>> GetCommentsByStoryIdAsync(Guid storyId);
    Task<bool> DeleteCommentAsync(Guid commentId, Guid userId, bool isSuperAdmin);
    Task<bool> LikeCommentAsync(Guid id);
}
