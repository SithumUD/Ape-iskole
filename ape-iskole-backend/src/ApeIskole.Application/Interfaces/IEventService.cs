using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ApeIskole.Application.DTOs;

namespace ApeIskole.Application.Interfaces;

public interface IEventService
{
    Task<EventDto?> GetEventByIdAsync(Guid id);
    Task<IEnumerable<EventDto>> GetAllEventsAsync();
    Task<IEnumerable<EventDto>> GetApprovedEventsAsync(string? searchTerm, string? category, DateTime? startDate, DateTime? endDate, Guid? schoolId = null);
    Task<IEnumerable<EventDto>> GetSchoolEventsAsync(Guid schoolId);
    Task<IEnumerable<EventDto>> GetUpcomingEventsAsync(int count);
    Task<IEnumerable<EventDto>> GetPendingEventsAsync();
    
    Task<EventDto> CreateEventAsync(CreateEventRequest request, Guid userId);
    Task<bool> UpdateEventAsync(Guid id, CreateEventRequest request, Guid userId);
    Task<bool> DeleteEventAsync(Guid id, Guid userId);
    Task<bool> ApproveEventAsync(Guid id, bool isApproved);
    Task<bool> IncrementViewCountAsync(Guid id);
    
    Task<TicketPurchaseDto> PurchaseTicketAsync(PurchaseTicketRequest request, Guid? userId);
    Task<bool> VerifyTicketPaymentAsync(Guid purchaseId, bool isApproved, Guid verifierId);
    Task<IEnumerable<TicketPurchaseDto>> GetPendingVerificationsAsync(Guid schoolId);
}
