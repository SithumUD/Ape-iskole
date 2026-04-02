namespace ApeIskole.Application.DTOs;

public class CreateSchoolUserRequest
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = "school_admin";
}
