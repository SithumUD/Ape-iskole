using System.Collections.Generic;

namespace ApeIskole.Application.DTOs;

public class HomeDataDto
{
    public HomeStatsDto Stats { get; set; } = new();
    public List<StoryDto> TopStories { get; set; } = new();
    public List<EventDto> UpcomingEvents { get; set; } = new();
    public List<SchoolDto> FeaturedSchools { get; set; } = new();
}

public class HomeStatsDto
{
    public int TotalSchools { get; set; }
    public int TotalStudents { get; set; }
    public int TotalEvents { get; set; }
    public decimal TotalDonationsRaised { get; set; }
}
