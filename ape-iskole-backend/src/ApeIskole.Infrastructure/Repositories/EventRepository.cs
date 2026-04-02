using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApeIskole.Application.Interfaces;
using ApeIskole.Domain.Entities;
using ApeIskole.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ApeIskole.Infrastructure.Repositories;

public class EventRepository : IEventRepository
{
    private readonly ApplicationDbContext _context;

    public EventRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Event?> GetByIdAsync(Guid id)
    {
        return await _context.Events
            .Include(e => e.School)
            .Include(e => e.TicketTypes)
            .FirstOrDefaultAsync(e => e.Id == id && !e.IsDeleted);
    }

    public async Task<IEnumerable<Event>> GetAllAsync()
    {
        return await _context.Events
            .Include(e => e.School)
            .Where(e => !e.IsDeleted)
            .ToListAsync();
    }

    public async Task<IEnumerable<Event>> GetBySchoolIdAsync(Guid schoolId)
    {
        return await _context.Events
            .Where(e => e.SchoolId == schoolId && !e.IsDeleted)
            .ToListAsync();
    }

    public async Task<IEnumerable<Event>> GetUpcomingEventsAsync(int count)
    {
        return await _context.Events
            .Include(e => e.School)
            .Where(e => e.IsApproved && e.Date >= DateTime.UtcNow && !e.IsDeleted)
            .OrderBy(e => e.Date)
            .Take(count)
            .ToListAsync();
    }

    public async Task<IEnumerable<Event>> GetFeaturedEventsAsync()
    {
        return await _context.Events
            .Include(e => e.School)
            .Where(e => e.IsApproved && e.IsFeatured && !e.IsDeleted)
            .ToListAsync();
    }

    public async Task<IEnumerable<Event>> GetPendingEventsAsync()
    {
        return await _context.Events
            .Include(e => e.School)
            .Where(e => !e.IsApproved && e.Status == "Pending" && !e.IsDeleted)
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Event>> SearchEventsAsync(string? searchTerm, string? category, DateTime? startDate, DateTime? endDate, Guid? schoolId = null)
    {
        var query = _context.Events
            .Include(e => e.School)
            .Where(e => e.IsApproved && !e.IsDeleted);

        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(e => e.Title.Contains(searchTerm) || e.Description.Contains(searchTerm));
        }

        if (schoolId.HasValue)
        {
            query = query.Where(e => e.SchoolId == schoolId.Value);
        }

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(e => e.Category == category);
        }

        if (startDate.HasValue)
        {
            query = query.Where(e => e.Date >= startDate.Value);
        }

        if (endDate.HasValue)
        {
            query = query.Where(e => e.Date <= endDate.Value);
        }

        return await query.OrderBy(e => e.Date).ToListAsync();
    }

    public async Task AddAsync(Event @event)
    {
        await _context.Events.AddAsync(@event);
    }

    public void Update(Event @event)
    {
        _context.Events.Update(@event);
    }

    public void Delete(Event @event)
    {
        @event.IsDeleted = true;
        _context.Events.Update(@event);
    }
}
