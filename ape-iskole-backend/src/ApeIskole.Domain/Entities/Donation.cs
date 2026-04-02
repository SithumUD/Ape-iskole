using System;
using System.Collections.Generic;
using ApeIskole.Domain.Common;

namespace ApeIskole.Domain.Entities;

public class Donation : BaseEntity
{
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
    public string Status { get; set; } = "Pending"; // Pending, Active, Completed, Cancelled

    // Relationships
    public Guid SchoolId { get; set; }
    public virtual School School { get; set; } = null!;
    
    public Guid AuthorId { get; set; }
    public virtual User Author { get; set; } = null!;

    // Bank Details (Flat for now, can be extracted if needed)
    public bool EnableBankDetails { get; set; }
    public string? BankName { get; set; }
    public string? AccountName { get; set; }
    public string? AccountNumber { get; set; }
    public string? Branch { get; set; }
    public string? SwiftCode { get; set; }

    public virtual ICollection<DonationUpdate> DonationUpdates { get; set; } = new List<DonationUpdate>();
}
