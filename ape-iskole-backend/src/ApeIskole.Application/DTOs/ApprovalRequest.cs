using System;

namespace ApeIskole.Application.DTOs;

public class ApprovalRequest
{
    public bool IsApproved { get; set; }
    public string? Reason { get; set; }
}
