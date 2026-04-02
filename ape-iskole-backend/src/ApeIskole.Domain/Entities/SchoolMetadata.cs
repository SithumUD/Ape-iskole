namespace ApeIskole.Domain.Entities;

public class LeadershipMember
{
    public string Name { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
}

public class ContactInfo
{
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Website { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
}
