using ApeIskole.Domain.Common;
using System;

namespace ApeIskole.Domain.Entities;

public class Promotion : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Discount { get; set; } = string.Empty;
    
    public decimal OriginalPrice { get; set; }
    public decimal DiscountedPrice { get; set; }
    
    public string Description { get; set; } = string.Empty;
    public string? LongDescription { get; set; }
    public string? Image { get; set; }
    public DateTime? ValidUntil { get; set; }
    public string? Terms { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    
    public bool Featured { get; set; }
    public int Uses { get; set; }
    public int? Limit { get; set; }
    
    public bool IsActive { get; set; } = true;
}
