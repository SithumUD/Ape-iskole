using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApeIskole.Application.DTOs;
using ApeIskole.Application.Interfaces;
using ApeIskole.Domain.Common;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ApeIskole.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = UserRoles.SuperAdmin)]
public class AdminController : ControllerBase
{
    private readonly IEventService _eventService;
    private readonly IDonationService _donationService;
    private readonly ISchoolService _schoolService;
    private readonly IStoryService _storyService;

    public AdminController(
        IEventService eventService, 
        IDonationService donationService,
        ISchoolService schoolService,
        IStoryService storyService)
    {
        _eventService = eventService;
        _donationService = donationService;
        _schoolService = schoolService;
        _storyService = storyService;
    }

    [HttpGet("approvals/pending")]
    public async Task<ActionResult<IEnumerable<PendingApprovalDto>>> GetPendingApprovals()
    {
        var pendingApprovals = new List<PendingApprovalDto>();

        // 1. Pending Events
        var events = await _eventService.GetPendingEventsAsync();
        pendingApprovals.AddRange(events.Select(e => new PendingApprovalDto
        {
            Id = e.Id,
            Title = e.Title,
            Description = e.ShortDescription,
            AuthorName = e.SchoolName,
            School = e.SchoolName,
            Type = "Event",
            SubmittedDate = e.Date, // Or CreatedAt if available
            Priority = e.IsFeatured ? "high" : "normal"
        }));

        // 2. Pending Stories (Excluded as per user request)

        // 3. Pending Announcements (Excluded as per user request)

        // 4. Pending Donations
        var donationResult = await _donationService.GetDonationsAsync(null, null, null, null, null, false, null, 1, 100);
        pendingApprovals.AddRange(donationResult.Items.Select(d => new PendingApprovalDto
        {
            Id = d.Id,
            Title = d.Title,
            Description = d.Description, // Also have impact
            AuthorName = d.AuthorName,
            School = d.SchoolName,
            Type = "Donation",
            SubmittedDate = d.ExpiryDate, // Or CreatedAt if available
            Priority = d.IsFeatured ? "high" : "normal"
        }));

        return Ok(pendingApprovals.OrderByDescending(x => x.SubmittedDate));
    }

    [HttpGet("approvals/summary")]
    public async Task<ActionResult<object>> GetApprovalSummary()
    {
        var eventCount = (await _eventService.GetPendingEventsAsync()).Count();
        var donationResult = await _donationService.GetDonationsAsync(null, null, null, null, null, false, null, 1, 1);
        var donationCount = donationResult.TotalCount;

        return Ok(new
        {
            Events = eventCount,
            Donations = donationCount,
            Total = eventCount + donationCount
        });
    }

    [HttpGet("dashboard/stats")]
    public async Task<ActionResult<DashboardStatsDto>> GetDashboardStats()
    {
        // 1. Pending Queue (Same logic as GetPendingApprovals)
        var pendingApprovals = new List<PendingApprovalDto>();
        var pendingEvents = await _eventService.GetPendingEventsAsync();
        pendingApprovals.AddRange(pendingEvents.Select(e => new PendingApprovalDto { 
            Id = e.Id, Title = e.Title, Description = e.ShortDescription, School = e.SchoolName, Type = "Event" 
        }));
        
        var donationResult = await _donationService.GetDonationsAsync(null, null, null, null, null, false, null, 1, 100);
        pendingApprovals.AddRange(donationResult.Items.Select(d => new PendingApprovalDto { 
            Id = d.Id, Title = d.Title, Description = d.Description, School = d.SchoolName, Type = "Donation" 
        }));

        // 2. School Summary
        var schoolsResult = await _schoolService.GetSchoolsAsync(null, null, null, 1, 1000);
        var totalSchools = schoolsResult.TotalCount;
        var approvedSchools = schoolsResult.Items.Count(s => s.IsApproved);
        var pendingSchools = schoolsResult.Items.Count(s => !s.IsApproved); // Assuming IsApproved=false means pending
        var rejectedSchools = 0; // If Status is used for rejection, handle it. Assuming 0 for now or based on metadata.

        // 3. Overall Stats
        var activeDonationsCount = (await _donationService.GetDonationsAsync(null, null, null, null, null, true, null, 1, 1)).TotalCount;
        var activeEventsCount = (await _eventService.GetApprovedEventsAsync(null, null, null, null, null)).Count();
        
        // Sum total raised amounts (proxy for revenue for now)
        var allDonations = await _donationService.GetDonationsAsync(null, null, null, null, null, true, null, 1, 1000);
        var totalRevenue = allDonations.Items.Sum(d => d.RaisedAmount);

        // 4. Top Stories
        var storyResult = await _storyService.GetPagedStoriesAsync(null, null, null, null, true, 1, 10);
        var topStories = storyResult.Items.OrderByDescending(s => s.Views).Take(3).ToList();

        // 5. Recent Schools
        var recentSchools = schoolsResult.Items.OrderByDescending(s => s.Id).Take(5).ToList();

        return Ok(new DashboardStatsDto
        {
            Overall = new OverallStats
            {
                TotalSchools = totalSchools,
                PendingApprovals = pendingApprovals.Count,
                ActiveContent = activeDonationsCount + activeEventsCount,
                TotalRevenue = totalRevenue
            },
            SchoolSummary = new SchoolSummary
            {
                Approved = approvedSchools,
                Pending = pendingSchools,
                Rejected = rejectedSchools
            },
            PendingQueue = pendingApprovals.Take(5).ToList(),
            RecentSchools = recentSchools,
            TopStories = topStories
        });
    }
}
