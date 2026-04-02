using System;
using System.Collections.Generic;

namespace ApeIskole.Application.DTOs;

public class CreateStoryRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public List<string> Gallery { get; set; } = new();
    public List<string> Tags { get; set; } = new();
    public bool IsFeatured { get; set; }
    public bool IsPublished { get; set; } = true;
    public Guid SchoolId { get; set; }
}

public class UpdateStoryRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public List<string> Gallery { get; set; } = new();
    public List<string> Tags { get; set; } = new();
    public bool IsFeatured { get; set; }
    public bool IsPublished { get; set; }
}

public class CreateCommentRequest
{
    public string Content { get; set; } = string.Empty;
    public string? AnonymousName { get; set; }
}
