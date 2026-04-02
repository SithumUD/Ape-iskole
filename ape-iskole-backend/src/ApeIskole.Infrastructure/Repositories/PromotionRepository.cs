using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApeIskole.Application.Interfaces;
using ApeIskole.Domain.Entities;
using ApeIskole.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ApeIskole.Infrastructure.Repositories;

public class PromotionRepository : BaseRepository<Promotion>, IPromotionRepository
{
    public PromotionRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }

    public async Task<IReadOnlyList<Promotion>> GetActivePromotionsAsync()
    {
        return await _context.Promotions
            .Where(p => p.IsActive)
            .OrderByDescending(p => p.Featured)
            .ThenByDescending(p => p.CreatedAt)
            .ToListAsync();
    }

    public async Task<bool> IncrementUsesAsync(Guid id)
    {
        var promotion = await _context.Promotions.FindAsync(id);
        if (promotion == null) return false;

        promotion.Uses += 1;
        _context.Promotions.Update(promotion);
        return true;
    }
}
