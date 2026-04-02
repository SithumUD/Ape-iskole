namespace ApeIskole.Application.DTOs;

public class SchoolDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int StartedYear { get; set; }
    public int StudentCount { get; set; }
    public int TeachersCount { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string? LogoUrl { get; set; }
    public string? CoverImageUrl { get; set; }
    public List<string> PhotoGallery { get; set; } = new();
    public ContactInfoDto Contact { get; set; } = new();
    public List<LeadershipMemberDto> Leadership { get; set; } = new();
    public List<string> AcademicStreams { get; set; } = new();
    public List<string> SchoolFacilities { get; set; } = new();
    public List<string> ClubsAndSocieties { get; set; } = new();
    public List<string> Achievements { get; set; } = new();
    public List<string> Sponsors { get; set; } = new();
    public List<string> SocialMediaUrls { get; set; } = new();
    public bool IsVerified { get; set; }
    public bool IsApproved { get; set; }
    public bool IsActive { get; set; }
    public bool IsFeatured { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class LeadershipMemberDto
{
    public string Name { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
}

public class ContactInfoDto
{
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Website { get; set; } = string.Empty;
    public string District { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
}

public class CreateSchoolRequest
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int StartedYear { get; set; }
    public int StudentCount { get; set; }
    public int TeachersCount { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public ContactInfoDto Contact { get; set; } = new();
    public List<LeadershipMemberDto> Leadership { get; set; } = new();
    public List<string> AcademicStreams { get; set; } = new();
    public List<string> SchoolFacilities { get; set; } = new();
    public List<string> ClubsAndSocieties { get; set; } = new();
    public List<string> Achievements { get; set; } = new();
    public List<string> Sponsors { get; set; } = new();
    public List<string> SocialMediaUrls { get; set; } = new();
}

public class UpdateSchoolRequest : CreateSchoolRequest
{
}
