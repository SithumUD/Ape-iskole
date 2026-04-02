using ApeIskole.Domain.Common;
using System.Collections.Generic;

namespace ApeIskole.Domain.Entities;

public class Story : BaseEntity
{
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
    public bool IsPublished { get; set; } = true;
    public string Status { get; set; } = "Active"; // Active, Draft

    // Foreign Keys
    public Guid SchoolId { get; set; }
    public School School { get; set; } = null!;
    
    public Guid AuthorId { get; set; }
    public User Author { get; set; } = null!;

    // Relationships
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
