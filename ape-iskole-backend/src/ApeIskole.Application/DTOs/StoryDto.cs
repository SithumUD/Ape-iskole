using System;
using System.Collections.Generic;

namespace ApeIskole.Application.DTOs;

public class StoryDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public List<string> Gallery { get; set; } = new();
    public List<string> Tags { get; set; } = new();
    public int Views { get; set; }
    public int Likes { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsPublished { get; set; }
    public string Status { get; set; } = string.Empty;
    public Guid SchoolId { get; set; }
    public string SchoolName { get; set; } = string.Empty;
    public Guid AuthorId { get; set; }
    public string AuthorName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public int CommentCount { get; set; }
}
