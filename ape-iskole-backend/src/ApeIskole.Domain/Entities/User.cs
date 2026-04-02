using ApeIskole.Domain.Common;
using System;

namespace ApeIskole.Domain.Entities;

public class User : BaseEntity
{
    public string KeycloakId { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty; // e.g., SuperAdmin, SchoolAdmin, Moderator
    public Guid? SchoolId { get; set; }
    public School? School { get; set; }
    public bool IsVerified { get; set; } = false;
    public bool IsStudent { get; set; } = false;
}
