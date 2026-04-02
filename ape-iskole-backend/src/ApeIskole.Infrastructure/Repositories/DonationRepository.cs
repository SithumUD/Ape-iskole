using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApeIskole.Application.Interfaces;
using ApeIskole.Domain.Entities;
using ApeIskole.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ApeIskole.Infrastructure.Repositories;

public class DonationRepository : BaseRepository<Donation>, IDonationRepository
{
    public DonationRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<(IEnumerable<Donation> Items, int TotalCount)> GetDonationsAsync(
        string? search = null,
        string? category = null,
        decimal? minGoal = null,
        decimal? maxGoal = null,
        string? sortBy = null,
        bool? isApproved = true,
        Guid? schoolId = null,
        int pageNumber = 1,
        int pageSize = 10)
    {
        var query = _dbSet
            .Include(d => d.School)
            .Include(d => d.Author)
            .AsQueryable();

        // Filters
        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(d => 
                d.Title.ToLower().Contains(search.ToLower()) || 
                d.Description.ToLower().Contains(search.ToLower()) ||
                d.School.Name.ToLower().Contains(search.ToLower()));
        }

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(d => d.Category == category);
        }

        if (minGoal.HasValue)
        {
            query = query.Where(d => d.GoalAmount >= minGoal.Value);
        }

        if (maxGoal.HasValue)
        {
            query = query.Where(d => d.GoalAmount <= maxGoal.Value);
        }

        if (isApproved.HasValue)
        {
            query = query.Where(d => d.IsApproved == isApproved.Value);
        }

        if (schoolId.HasValue)
        {
            query = query.Where(d => d.SchoolId == schoolId.Value);
        }

        query = query.Where(d => !d.IsDeleted);

        // Sorting
        query = sortBy?.ToLower() switch
        {
            "featured" => query.OrderByDescending(d => d.IsFeatured).ThenByDescending(d => d.CreatedAt),
            "goal_high" => query.OrderByDescending(d => d.GoalAmount),
            "goal_low" => query.OrderBy(d => d.GoalAmount),
            "raised_high" => query.OrderByDescending(d => d.RaisedAmount),
            "percentage_high" => query.OrderByDescending(d => d.RaisedAmount / d.GoalAmount),
            "donors_high" => query.OrderByDescending(d => d.DonorsCount),
            "days_asc" => query.OrderBy(d => d.ExpiryDate),
            _ => query.OrderByDescending(d => d.CreatedAt)
        };

        var totalCount = await query.CountAsync();
        var items = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public async Task<Donation?> GetDonationWithUpdatesAsync(Guid id)
    {
        return await _dbSet
            .Include(d => d.School)
            .Include(d => d.Author)
            .Include(d => d.DonationUpdates)
            .FirstOrDefaultAsync(d => d.Id == id && !d.IsDeleted);
    }
}
