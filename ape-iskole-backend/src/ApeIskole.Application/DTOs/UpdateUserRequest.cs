namespace ApeIskole.Application.DTOs;

public class UpdateUserRequest
{
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public Guid? SchoolId { get; set; }
    public bool IsStudent { get; set; }
}
