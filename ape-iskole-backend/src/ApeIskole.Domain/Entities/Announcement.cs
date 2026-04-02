using System;
using System.Collections.Generic;
using ApeIskole.Domain.Common;

namespace ApeIskole.Domain.Entities;

public class Announcement : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // Community / Targeted

    // Audience - null means Community (all), otherwise list of SchoolIds
    public List<Guid> TargetSchoolIds { get; set; } = new();

    public string Priority { get; set; } = "normal"; // normal, high, urgent
    public string Status { get; set; } = "Draft";    // Draft, Pending, Sent

    public DateTime? ScheduledAt { get; set; }
    public int Views { get; set; } = 0;

    public Guid SchoolId { get; set; }
    public virtual School School { get; set; } = null!;

    public Guid CreatedById { get; set; }
    public virtual User CreatedBy { get; set; } = null!;
}
