using System;
using System.Collections.Generic;

namespace ApeIskole.Application.DTOs;

public class DashboardStatsDto
{
    public OverallStats Overall { get; set; } = new();
    public SchoolSummary SchoolSummary { get; set; } = new();
    public List<PendingApprovalDto> PendingQueue { get; set; } = new();
    public List<SchoolDto> RecentSchools { get; set; } = new();
    public List<StoryDto> TopStories { get; set; } = new();
}

public class OverallStats
{
    public int TotalSchools { get; set; }
    public int PendingApprovals { get; set; }
    public int ActiveContent { get; set; } // Events + Donations
    public decimal TotalRevenue { get; set; } // Sum of all donation raised amounts
}

public class SchoolSummary
{
    public int Approved { get; set; }
    public int Pending { get; set; }
    public int Rejected { get; set; }
}
