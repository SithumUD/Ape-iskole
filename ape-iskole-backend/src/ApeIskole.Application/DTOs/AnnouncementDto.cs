using System;
using System.Collections.Generic;

namespace ApeIskole.Application.DTOs;

public class AnnouncementDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Priority { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public List<Guid> TargetSchoolIds { get; set; } = new();
    public DateTime? ScheduledAt { get; set; }
    public int Views { get; set; }
    public Guid SchoolId { get; set; }
    public string SchoolName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateAnnouncementRequest
{
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = "Community"; // Community or Targeted
    public List<Guid> TargetSchoolIds { get; set; } = new(); // empty = all schools
    public string Priority { get; set; } = "normal"; // normal, high, urgent
    public Guid SchoolId { get; set; }
    public DateTime? ScheduledAt { get; set; }
    public bool SaveAsDraft { get; set; }
}
