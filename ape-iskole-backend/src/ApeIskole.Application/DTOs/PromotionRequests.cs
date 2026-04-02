using System;
using Microsoft.AspNetCore.Http;

namespace ApeIskole.Application.DTOs;

public class CreatePromotionRequest
{
    public string Title { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Discount { get; set; } = string.Empty;
    public decimal OriginalPrice { get; set; }
    public decimal DiscountedPrice { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? LongDescription { get; set; } = string.Empty;
    public string? Image { get; set; } = string.Empty;
    public IFormFile? ImageFile { get; set; }
    public DateTime? ValidUntil { get; set; }
    public string? Terms { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public bool Featured { get; set; }
    public int? Limit { get; set; }
    public bool IsActive { get; set; } = true;
}

public class UpdatePromotionRequest : CreatePromotionRequest
{
}

public class PromotionDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Discount { get; set; } = string.Empty;
    public decimal OriginalPrice { get; set; }
    public decimal DiscountedPrice { get; set; }
    public string Description { get; set; } = string.Empty;
    public string? LongDescription { get; set; } = string.Empty;
    public string? Image { get; set; } = string.Empty;
    public DateTime? ValidUntil { get; set; }
    public string? Terms { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public bool Featured { get; set; }
    public int Uses { get; set; }
    public int? Limit { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}
