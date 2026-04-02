using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApeIskole.Application.Interfaces;
using ApeIskole.Domain.Entities;
using ApeIskole.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ApeIskole.Infrastructure.Repositories;

public class StoryRepository : BaseRepository<Story>, IStoryRepository
{
    public StoryRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<Story?> GetStoryWithDetailsAsync(Guid id)
    {
        return await _dbSet
            .Include(s => s.School)
            .Include(s => s.Author)
            .Include(s => s.Comments)
                .ThenInclude(c => c.User)
            .FirstOrDefaultAsync(s => s.Id == id && !s.IsDeleted);
    }

    public async Task<(IEnumerable<Story> Items, int TotalCount)> GetPagedStoriesAsync(
        string? searchTerm, 
        string? category, 
        Guid? schoolId, 
        string? tag,
        bool? isPublished,
        int pageNumber, 
        int pageSize)
    {
        var query = _dbSet
            .Include(s => s.School)
            .Include(s => s.Author)
            .Where(s => !s.IsDeleted)
            .AsQueryable();

        // Status Filter
        if (isPublished.HasValue)
        {
            query = query.Where(s => s.IsPublished == isPublished.Value);
        }

        if (!string.IsNullOrEmpty(searchTerm))
        {
            query = query.Where(s => s.Title.Contains(searchTerm) || s.Description.Contains(searchTerm));
        }

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(s => s.Category == category);
        }

        if (schoolId.HasValue)
        {
            query = query.Where(s => s.SchoolId == schoolId.Value);
        }

        if (!string.IsNullOrEmpty(tag))
        {
            query = query.Where(s => s.Tags.Contains(tag));
        }

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderByDescending(s => s.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }
}
