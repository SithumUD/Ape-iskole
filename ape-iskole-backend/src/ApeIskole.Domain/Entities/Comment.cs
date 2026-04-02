using ApeIskole.Domain.Common;
using System.Collections.Generic;

namespace ApeIskole.Domain.Entities;

public class Comment : BaseEntity
{
    public Guid StoryId { get; set; }
    public Story Story { get; set; } = null!;

    public string Content { get; set; } = string.Empty;
    public int Likes { get; set; }

    // Optional: For registered users
    public Guid? UserId { get; set; }
    public User? User { get; set; }

    // Optional: For anonymous/public users
    public string? AuthorName { get; set; }
}
