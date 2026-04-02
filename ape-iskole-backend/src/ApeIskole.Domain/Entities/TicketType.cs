using System;
using System.Collections.Generic;
using ApeIskole.Domain.Common;

namespace ApeIskole.Domain.Entities;

public class TicketType : BaseEntity
{
    public Guid EventId { get; set; }
    public virtual Event Event { get; set; } = null!;
    
    public string Name { get; set; } = string.Empty; // e.g. "VIP Pass"
    public string Type { get; set; } = string.Empty; // e.g. "VIP", "General", "Student"
    public decimal Price { get; set; }
    public int TotalQuantity { get; set; }
    public int AvailableQuantity { get; set; }
    public int MinOrder { get; set; } = 1;
    public int MaxOrder { get; set; } = 10;
    public string Description { get; set; } = string.Empty;
    public List<string> Benefits { get; set; } = new();
    
    public DateTime? SaleStartDate { get; set; }
    public DateTime? SaleEndDate { get; set; }

    public virtual ICollection<TicketPurchase> Purchases { get; set; } = new List<TicketPurchase>();
}
