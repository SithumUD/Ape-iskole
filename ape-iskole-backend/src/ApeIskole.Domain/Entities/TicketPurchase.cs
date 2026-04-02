using System;
using ApeIskole.Domain.Common;

namespace ApeIskole.Domain.Entities;

public class TicketPurchase : BaseEntity
{
    public Guid TicketTypeId { get; set; }
    public virtual TicketType TicketType { get; set; } = null!;
    
    public Guid? UserId { get; set; }
    public virtual User? User { get; set; }
    
    public int Quantity { get; set; }
    public decimal TotalPrice { get; set; }
    
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string NIC { get; set; } = string.Empty;
    public string SpecialRequests { get; set; } = string.Empty;
    
    public string PaymentMethod { get; set; } = "Bank Transfer";
    public string ReceiptUrl { get; set; } = string.Empty;
    public bool IsPaymentApproved { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Approved, Rejected
    
    public DateTime? VerificationDate { get; set; }
    public Guid? VerifiedBy { get; set; }
    public virtual User? Verifier { get; set; }
}
