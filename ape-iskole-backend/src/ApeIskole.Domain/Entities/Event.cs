using System;
using System.Collections.Generic;
using ApeIskole.Domain.Common;

namespace ApeIskole.Domain.Entities;

public class Event : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Time { get; set; } = string.Empty;
    public DateTime? EndDate { get; set; }
    public string EndTime { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public string Venue { get; set; } = string.Empty;
    public string ShortDescription { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public string YoutubeLink { get; set; } = string.Empty;
    
    public bool IsFree { get; set; } = true;
    public string ParticipationDetails { get; set; } = string.Empty;

    public bool EnableTickets { get; set; }
    public bool EnableDonation { get; set; }
    public decimal? DonationGoal { get; set; }
    public decimal? DonationRaised { get; set; }
    public string DonationDescription { get; set; } = string.Empty;
    
    public bool IsFeatured { get; set; }
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public string AgeRestriction { get; set; } = string.Empty;
    
    public bool ParkingAvailable { get; set; }
    public bool FoodAvailable { get; set; }
    public bool WheelchairAccessible { get; set; }
    
    public bool IsApproved { get; set; }
    public string Status { get; set; } = "Pending";
    public int ViewCount { get; set; } = 0;

    // Relationships
    public Guid SchoolId { get; set; }
    public virtual School School { get; set; } = null!;
    
    public Guid AuthorId { get; set; }
    public virtual User Author { get; set; } = null!;

    public virtual ICollection<TicketType> TicketTypes { get; set; } = new List<TicketType>();
}
