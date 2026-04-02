using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace ApeIskole.Application.DTOs;

public class CreateDonationRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string LongDescription { get; set; } = string.Empty;
    public List<string> ImpactStatements { get; set; } = new();
    public string Category { get; set; } = string.Empty;
    public decimal GoalAmount { get; set; }
    public string Image { get; set; } = string.Empty;
    public IFormFile? ImageFile { get; set; }
    public List<string> Gallery { get; set; } = new();
    public List<string> ExistingGallery { get; set; } = new();
    public List<IFormFile> GalleryFiles { get; set; } = new();
    public DateTime ExpiryDate { get; set; }
    public Guid SchoolId { get; set; }

    public bool IsDraft { get; set; }

    public bool EnableBankDetails { get; set; }
    public string? BankName { get; set; }
    public string? AccountName { get; set; }
    public string? AccountNumber { get; set; }
    public string? Branch { get; set; }
    public string? SwiftCode { get; set; }
}

public class UpdateDonationRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string LongDescription { get; set; } = string.Empty;
    public List<string> ImpactStatements { get; set; } = new();
    public string Category { get; set; } = string.Empty;
    public decimal GoalAmount { get; set; }
    public string Image { get; set; } = string.Empty;
    public IFormFile? ImageFile { get; set; }
    public List<string> Gallery { get; set; } = new();
    public List<string> ExistingGallery { get; set; } = new();
    public List<IFormFile> GalleryFiles { get; set; } = new();
    public DateTime ExpiryDate { get; set; }

    public bool IsDraft { get; set; }

    // Bank Details Config
    public bool EnableBankDetails { get; set; }
    public string? BankName { get; set; }
    public string? AccountName { get; set; }
    public string? AccountNumber { get; set; }
    public string? Branch { get; set; }
    public string? SwiftCode { get; set; }
}

public class AddDonationUpdateRequest
{
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
}
