using System;

namespace ApeIskole.Application.DTOs;

public class CommentDto
{
    public Guid Id { get; set; }
    public Guid StoryId { get; set; }
    public string Content { get; set; } = string.Empty;
    public int Likes { get; set; }
    public Guid? UserId { get; set; }
    public string? AuthorName { get; set; } // Either from User or manual entry
    public DateTime CreatedAt { get; set; }
}
