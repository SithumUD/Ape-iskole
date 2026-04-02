using System;
using ApeIskole.Domain.Common;

namespace ApeIskole.Domain.Entities;

public class DonationUpdate : BaseEntity
{
    public Guid DonationId { get; set; }
    public virtual Donation Donation { get; set; } = null!;
    
    public string Title { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string AuthorName { get; set; } = string.Empty;
}
