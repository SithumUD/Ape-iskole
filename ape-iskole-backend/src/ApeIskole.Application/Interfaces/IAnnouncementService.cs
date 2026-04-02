using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ApeIskole.Application.DTOs;

namespace ApeIskole.Application.Interfaces;

public interface IAnnouncementService
{
    Task<AnnouncementDto?> GetByIdAsync(Guid id);
    Task<IEnumerable<AnnouncementDto>> GetAllAsync();
    Task<IEnumerable<AnnouncementDto>> GetBySchoolIdAsync(Guid schoolId);
    Task<IEnumerable<AnnouncementDto>> GetPublicForSchoolAsync(Guid schoolId);
    Task<IEnumerable<AnnouncementDto>> GetCommunityAsync();
    Task<IEnumerable<AnnouncementDto>> GetPendingAsync();
    Task<AnnouncementDto> CreateAsync(CreateAnnouncementRequest request, Guid userId);
    Task<bool> ApproveAsync(Guid id, bool isApproved);
    Task<bool> DeleteAsync(Guid id, Guid userId);
}
