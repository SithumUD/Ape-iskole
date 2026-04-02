using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApeIskole.Application.Interfaces;
using ApeIskole.Domain.Entities;
using ApeIskole.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ApeIskole.Infrastructure.Repositories;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<User?> GetByKeycloakIdAsync(string keycloakId)
    {
        return await _dbSet
            .Include(u => u.School)
            .FirstOrDefaultAsync(u => u.KeycloakId == keycloakId);
    }

    public async Task<User?> GetUserWithSchoolAsync(Guid id)
    {
        return await _dbSet
            .Include(u => u.School)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<(IEnumerable<User> Items, int TotalCount)> GetPagedUsersAsync(string? searchTerm, string? role, Guid? schoolId, int pageNumber, int pageSize)
    {
        var query = _dbSet
            .Include(u => u.School)
            .AsQueryable();

        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(u => u.FullName.Contains(searchTerm) || u.Email.Contains(searchTerm));
        }

        if (!string.IsNullOrEmpty(role))
        {
            query = query.Where(u => u.Role == role);
        }

        if (schoolId.HasValue)
        {
            query = query.Where(u => u.SchoolId == schoolId.Value);
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderBy(u => u.FullName)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }

    public override async Task<User?> GetByIdAsync(Guid id)
    {
        return await _dbSet
            .Include(u => u.School)
            .FirstOrDefaultAsync(u => u.Id == id);
    }
}
