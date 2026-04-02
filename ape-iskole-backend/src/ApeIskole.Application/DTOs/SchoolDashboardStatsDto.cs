using System;
using System.Collections.Generic;

namespace ApeIskole.Application.DTOs;

public class SchoolDashboardStatsDto
{
    public SchoolOverallStats Stats { get; set; } = new();
    public List<EventDto> RecentEvents { get; set; } = new();
    public List<AnnouncementDto> RecentAnnouncements { get; set; } = new();
    public SchoolApprovalSummary ApprovalSummary { get; set; } = new();
    public PerformanceSnapshot Performance { get; set; } = new();
}

public class SchoolOverallStats
{
    public int TotalEvents { get; set; }
    public int TicketsSold { get; set; }
    public decimal DonationsReceived { get; set; }
    public int PendingApprovals { get; set; }
}

public class SchoolApprovalSummary
{
    public int PendingEvents { get; set; }
    public int PendingDonations { get; set; }
}

public class PerformanceSnapshot
{
    public int EventViews { get; set; }
    public int TicketConversionRate { get; set; }
    public int DonationGoalPercentage { get; set; }
}
