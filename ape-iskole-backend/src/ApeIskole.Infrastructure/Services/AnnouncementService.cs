using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ApeIskole.Application.DTOs;
using ApeIskole.Application.Interfaces;
using ApeIskole.Domain.Entities;

namespace ApeIskole.Infrastructure.Services;

public class AnnouncementService : IAnnouncementService
{
    private readonly IUnitOfWork _unitOfWork;

    public AnnouncementService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<AnnouncementDto?> GetByIdAsync(Guid id)
    {
        var announcement = await _unitOfWork.Announcements.GetByIdAsync(id);
        return announcement == null ? null : MapToDto(announcement);
    }

    public async Task<IEnumerable<AnnouncementDto>> GetAllAsync()
    {
        var announcements = await _unitOfWork.Announcements.GetAllAsync();
        return announcements.Select(MapToDto);
    }

    public async Task<IEnumerable<AnnouncementDto>> GetBySchoolIdAsync(Guid schoolId)
    {
        var announcements = await _unitOfWork.Announcements.GetBySchoolIdAsync(schoolId);
        return announcements.Select(MapToDto);
    }

    public async Task<IEnumerable<AnnouncementDto>> GetPublicForSchoolAsync(Guid schoolId)
    {
        var announcements = await _unitOfWork.Announcements.GetPublicAnnouncementsForSchoolAsync(schoolId);
        return announcements.Select(MapToDto);
    }

    public async Task<IEnumerable<AnnouncementDto>> GetCommunityAsync()
    {
        var announcements = await _unitOfWork.Announcements.GetCommunityAnnouncementsAsync();
        return announcements.Select(MapToDto);
    }

    public async Task<IEnumerable<AnnouncementDto>> GetPendingAsync()
    {
        var announcements = await _unitOfWork.Announcements.GetPendingAnnouncementsAsync();
        return announcements.Select(MapToDto);
    }

    public async Task<AnnouncementDto> CreateAsync(CreateAnnouncementRequest request, Guid userId)
    {
        var announcement = new Announcement
        {
            Title = request.Title,
            Message = request.Message,
            Type = request.Type,
            TargetSchoolIds = request.TargetSchoolIds,
            Priority = request.Priority,
            Status = request.SaveAsDraft ? "Draft" : (request.ScheduledAt > DateTime.UtcNow ? "Pending" : "Sent"),
            ScheduledAt = request.ScheduledAt,
            SchoolId = request.SchoolId,
            CreatedById = userId
        };

        await _unitOfWork.Announcements.AddAsync(announcement);
        await _unitOfWork.SaveChangesAsync();

        return MapToDto(announcement);
    }

    public async Task<bool> ApproveAsync(Guid id, bool isApproved)
    {
        var announcement = await _unitOfWork.Announcements.GetByIdAsync(id);
        if (announcement == null) return false;

        announcement.Status = isApproved ? "Sent" : "Rejected";
        _unitOfWork.Announcements.Update(announcement);
        return await _unitOfWork.SaveChangesAsync() > 0;
    }

    public async Task<bool> DeleteAsync(Guid id, Guid userId)
    {
        var announcement = await _unitOfWork.Announcements.GetByIdAsync(id);
        if (announcement == null) return false;

        // Permission check could be added here
        _unitOfWork.Announcements.Delete(announcement);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    private AnnouncementDto MapToDto(Announcement a)
    {
        return new AnnouncementDto
        {
            Id = a.Id,
            Title = a.Title,
            Message = a.Message,
            Type = a.Type,
            Priority = a.Priority,
            Status = a.Status,
            TargetSchoolIds = a.TargetSchoolIds,
            ScheduledAt = a.ScheduledAt,
            Views = a.Views,
            SchoolId = a.SchoolId,
            SchoolName = a.School?.Name ?? string.Empty,
            CreatedAt = a.CreatedAt
        };
    }
}
