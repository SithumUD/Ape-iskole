using System;

namespace ApeIskole.Application.DTOs;

public class PendingApprovalDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string AuthorName { get; set; } = string.Empty;
    public string School { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // Event, Story, Announcement, Donation
    public DateTime SubmittedDate { get; set; }
    public string Priority { get; set; } = "normal";
}
