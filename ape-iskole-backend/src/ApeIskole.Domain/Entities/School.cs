using ApeIskole.Domain.Common;

namespace ApeIskole.Domain.Entities;

public class School : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // government, international, private
    public string Description { get; set; } = string.Empty;
    public int StartedYear { get; set; }
    public int StudentCount { get; set; }
    public int TeachersCount { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    
    // Images
    public string? LogoUrl { get; set; }
    public string? CoverImageUrl { get; set; }
    public List<string> PhotoGallery { get; set; } = new();

    // Contact Information
    public ContactInfo Contact { get; set; } = new();
    
    // Metadata Lists (Stored as JSON in DB)
    public List<LeadershipMember> Leadership { get; set; } = new();
    public List<string> AcademicStreams { get; set; } = new();
    public List<string> SchoolFacilities { get; set; } = new();
    public List<string> ClubsAndSocieties { get; set; } = new();
    public List<string> Achievements { get; set; } = new();
    public List<string> Sponsors { get; set; } = new();
    public List<string> SocialMediaUrls { get; set; } = new();

    public bool IsVerified { get; set; }
    public bool IsApproved { get; set; } = false;
    public bool IsActive { get; set; } = true;
    public bool IsFeatured { get; set; } = false;
    
    // Relationships
    public ICollection<User> Administrators { get; set; } = new List<User>();
    public ICollection<Announcement> Announcements { get; set; } = new List<Announcement>();
    public ICollection<Event> Events { get; set; } = new List<Event>();
}
