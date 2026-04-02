using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ApeIskole.Domain.Entities;

namespace ApeIskole.Application.Interfaces;

public interface IAnnouncementRepository
{
    Task<Announcement?> GetByIdAsync(Guid id);
    Task<IEnumerable<Announcement>> GetAllAsync();
    Task<IEnumerable<Announcement>> GetBySchoolIdAsync(Guid schoolId);

    // Public: returns Community announcements + Targeted ones for the given schoolId
    Task<IEnumerable<Announcement>> GetPublicAnnouncementsForSchoolAsync(Guid schoolId);

    // Public: only Community (all-schools) announcements
    Task<IEnumerable<Announcement>> GetCommunityAnnouncementsAsync();
    
    Task<IEnumerable<Announcement>> GetPendingAnnouncementsAsync();

    Task AddAsync(Announcement announcement);
    void Update(Announcement announcement);
    void Delete(Announcement announcement);
}
