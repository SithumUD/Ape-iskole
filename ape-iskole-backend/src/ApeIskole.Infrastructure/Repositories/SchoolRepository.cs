using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApeIskole.Application.Interfaces;
using ApeIskole.Domain.Entities;
using ApeIskole.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ApeIskole.Infrastructure.Repositories;

public class SchoolRepository : BaseRepository<School>, ISchoolRepository
{
    public SchoolRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<School?> GetSchoolWithDetailsAsync(Guid id)
    {
        return await _dbSet
            .Include(s => s.Administrators)
            .FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);
    }

    public async Task<(IEnumerable<School> Items, int TotalCount)> GetPagedSchoolsAsync(string? searchTerm, string? type, string? city, int pageNumber, int pageSize, bool? isActive = null, bool? isApproved = null)
    {
        var query = _dbSet.Where(s => !s.IsDeleted).AsQueryable();

        if (isActive.HasValue)
        {
            query = query.Where(s => s.IsActive == isActive.Value);
        }

        if (isApproved.HasValue)
        {
            query = query.Where(s => s.IsApproved == isApproved.Value);
        }

        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(s => s.Name.Contains(searchTerm) || (s.Description != null && s.Description.Contains(searchTerm)));
        }

        if (!string.IsNullOrEmpty(type))
        {
            query = query.Where(s => s.Type == type);
        }
        
        if (!string.IsNullOrEmpty(city))
        {
            query = query.Where(s => s.Contact.City == city);
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderBy(s => s.Name)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }
}
