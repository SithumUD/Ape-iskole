namespace ApeIskole.Application.DTOs;

public class UserDto
{
    public Guid Id { get; set; }
    public string KeycloakId { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public Guid? SchoolId { get; set; }
    public string? SchoolName { get; set; }
    public bool IsVerified { get; set; }
    public bool IsStudent { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
