using System;
using System.Collections.Generic;

namespace ApeIskole.Application.DTOs;

public class EventDto
{
    public Guid Id { get; set; }
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
    public string Status { get; set; } = string.Empty;
    public bool IsDeleted { get; set; }
    public int ViewCount { get; set; }
    
    public Guid SchoolId { get; set; }
    public string SchoolName { get; set; } = string.Empty;
    
    public List<TicketTypeDto> TicketTypes { get; set; } = new();
}

public class TicketTypeDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int TotalQuantity { get; set; }
    public int AvailableQuantity { get; set; }
    public int MinOrder { get; set; }
    public int MaxOrder { get; set; }
    public string Description { get; set; } = string.Empty;
    public List<string> Benefits { get; set; } = new();
}

public class TicketPurchaseDto
{
    public Guid Id { get; set; }
    public Guid TicketTypeId { get; set; }
    public string TicketTypeName { get; set; } = string.Empty;
    public string EventTitle { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal TotalPrice { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string ReceiptUrl { get; set; } = string.Empty;
    public bool IsPaymentApproved { get; set; }
}
