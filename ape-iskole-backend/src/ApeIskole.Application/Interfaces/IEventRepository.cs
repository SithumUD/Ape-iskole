using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ApeIskole.Domain.Entities;

namespace ApeIskole.Application.Interfaces;

public interface IEventRepository
{
    Task<Event?> GetByIdAsync(Guid id);
    Task<IEnumerable<Event>> GetAllAsync();
    Task<IEnumerable<Event>> GetBySchoolIdAsync(Guid schoolId);
    Task<IEnumerable<Event>> GetUpcomingEventsAsync(int count);
    Task<IEnumerable<Event>> GetFeaturedEventsAsync();
    Task<IEnumerable<Event>> GetPendingEventsAsync();
    Task<IEnumerable<Event>> SearchEventsAsync(string? searchTerm, string? category, DateTime? startDate, DateTime? endDate, Guid? schoolId = null);
    Task AddAsync(Event @event);
    void Update(Event @event);
    void Delete(Event @event);
}
