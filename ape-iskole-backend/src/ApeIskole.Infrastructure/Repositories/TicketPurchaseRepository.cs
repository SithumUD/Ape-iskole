using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApeIskole.Application.Interfaces;
using ApeIskole.Domain.Entities;
using ApeIskole.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ApeIskole.Infrastructure.Repositories;

public class TicketPurchaseRepository : ITicketPurchaseRepository
{
    private readonly ApplicationDbContext _context;

    public TicketPurchaseRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<TicketPurchase?> GetByIdAsync(Guid id)
    {
        return await _context.TicketPurchases
            .Include(p => p.TicketType)
                .ThenInclude(t => t.Event)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<IEnumerable<TicketPurchase>> GetByUserIdAsync(Guid userId)
    {
        return await _context.TicketPurchases
            .Include(p => p.TicketType)
                .ThenInclude(t => t.Event)
            .Where(p => p.UserId == userId)
            .ToListAsync();
    }

    public async Task<IEnumerable<TicketPurchase>> GetByEventIdAsync(Guid eventId)
    {
        return await _context.TicketPurchases
            .Include(p => p.TicketType)
            .Where(p => p.TicketType.EventId == eventId)
            .ToListAsync();
    }

    public async Task<IEnumerable<TicketPurchase>> GetPendingVerificationsBySchoolIdAsync(Guid schoolId)
    {
        return await _context.TicketPurchases
            .Include(p => p.TicketType)
                .ThenInclude(t => t.Event)
            .Where(p => p.TicketType.Event.SchoolId == schoolId && p.Status == "Pending")
            .ToListAsync();
    }

    public async Task AddAsync(TicketPurchase purchase)
    {
        await _context.TicketPurchases.AddAsync(purchase);
    }

    public void Update(TicketPurchase purchase)
    {
        _context.TicketPurchases.Update(purchase);
    }
}
