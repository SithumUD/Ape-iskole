namespace ApeIskole.Application.DTOs;

public class SyncUserRequest
{
    public string KeycloakId { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public Guid? SchoolId { get; set; }
    public bool IsStudent { get; set; }
}
