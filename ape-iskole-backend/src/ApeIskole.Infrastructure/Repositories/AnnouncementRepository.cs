using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApeIskole.Application.Interfaces;
using ApeIskole.Domain.Entities;
using ApeIskole.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ApeIskole.Infrastructure.Repositories;

public class AnnouncementRepository : IAnnouncementRepository
{
    private readonly ApplicationDbContext _context;

    public AnnouncementRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Announcement?> GetByIdAsync(Guid id)
    {
        return await _context.Announcements
            .Include(a => a.School)
            .Include(a => a.CreatedBy)
            .FirstOrDefaultAsync(a => a.Id == id && !a.IsDeleted);
    }

    public async Task<IEnumerable<Announcement>> GetAllAsync()
    {
        return await _context.Announcements
            .Include(a => a.School)
            .Where(a => !a.IsDeleted)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Announcement>> GetBySchoolIdAsync(Guid schoolId)
    {
        return await _context.Announcements
            .Include(a => a.School)
            .Where(a => a.SchoolId == schoolId && !a.IsDeleted)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Announcement>> GetPublicAnnouncementsForSchoolAsync(Guid schoolId)
    {
        // Combined logic: 
        // 1. Type is Community (public to all)
        // 2. Type is Targeted AND TargetSchoolIds contains this schoolId
        return await _context.Announcements
            .Include(a => a.School)
            .Where(a => !a.IsDeleted && 
                       a.Status == "Sent" && 
                       (a.Type == "Community" || 
                        (a.Type == "Targeted" && a.TargetSchoolIds.Contains(schoolId))))
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Announcement>> GetCommunityAnnouncementsAsync()
    {
        return await _context.Announcements
            .Include(a => a.School)
            .Where(a => a.Type == "Community" && a.Status == "Sent" && !a.IsDeleted)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task<IEnumerable<Announcement>> GetPendingAnnouncementsAsync()
    {
        return await _context.Announcements
            .Include(a => a.School)
            .Where(a => a.Status == "Pending" && !a.IsDeleted)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public async Task AddAsync(Announcement announcement)
    {
        await _context.Announcements.AddAsync(announcement);
    }

    public void Update(Announcement announcement)
    {
        _context.Announcements.Update(announcement);
    }

    public void Delete(Announcement announcement)
    {
        announcement.IsDeleted = true;
        _context.Announcements.Update(announcement);
    }
}
