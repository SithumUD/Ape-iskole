using System;
using System.Collections.Generic;

namespace ApeIskole.Application.DTOs;

public class DonationDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string LongDescription { get; set; } = string.Empty;
    public List<string> ImpactStatements { get; set; } = new();
    public string Category { get; set; } = string.Empty;
    public decimal GoalAmount { get; set; }
    public decimal RaisedAmount { get; set; }
    public int DonorsCount { get; set; }
    public string Image { get; set; } = string.Empty;
    public List<string> Gallery { get; set; } = new();
    
    public DateTime ExpiryDate { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsApproved { get; set; }
    public string Status { get; set; } = string.Empty;
    
    public Guid SchoolId { get; set; }
    public string SchoolName { get; set; } = string.Empty;
    
    public Guid AuthorId { get; set; }
    public string AuthorName { get; set; } = string.Empty;

    public bool EnableBankDetails { get; set; }
    public string? BankName { get; set; }
    public string? AccountName { get; set; }
    public string? AccountNumber { get; set; }
    public string? Branch { get; set; }
    public string? SwiftCode { get; set; }

    public List<DonationUpdateDto> Updates { get; set; } = new();
}

public class DonationUpdateDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string AuthorName { get; set; } = string.Empty;
}
