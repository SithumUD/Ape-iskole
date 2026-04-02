using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace ApeIskole.Application.DTOs;

public class CreateEventRequest
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
    public IFormFile? ImageFile { get; set; }
    public string? YoutubeLink { get; set; }
    
    public bool IsFree { get; set; } = true;
    public string ParticipationDetails { get; set; } = string.Empty;

    public bool EnableTickets { get; set; }
    public bool EnableDonation { get; set; }
    public decimal? DonationGoal { get; set; }
    public string? DonationDescription { get; set; }
    
    public bool IsFeatured { get; set; }
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public string? AgeRestriction { get; set; }
    
    public bool ParkingAvailable { get; set; }
    public bool FoodAvailable { get; set; }
    public bool WheelchairAccessible { get; set; }
    
    public Guid SchoolId { get; set; }
    public List<CreateTicketTypeRequest> TicketTypes { get; set; } = new();
}

public class CreateTicketTypeRequest
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int TotalQuantity { get; set; }
    public int MinOrder { get; set; } = 1;
    public int MaxOrder { get; set; } = 10;
    public string Description { get; set; } = string.Empty;
    public List<string> Benefits { get; set; } = new();
}

public class PurchaseTicketRequest
{
    public Guid TicketTypeId { get; set; }
    public int Quantity { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string NIC { get; set; } = string.Empty;
    public string SpecialRequests { get; set; } = string.Empty;
    public string ReceiptUrl { get; set; } = string.Empty;
}

public class VerifyPaymentRequest
{
    public bool IsApproved { get; set; }
}
