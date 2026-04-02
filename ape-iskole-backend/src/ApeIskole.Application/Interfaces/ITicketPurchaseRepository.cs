using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ApeIskole.Domain.Entities;

namespace ApeIskole.Application.Interfaces;

public interface ITicketPurchaseRepository
{
    Task<TicketPurchase?> GetByIdAsync(Guid id);
    Task<IEnumerable<TicketPurchase>> GetByUserIdAsync(Guid userId);
    Task<IEnumerable<TicketPurchase>> GetByEventIdAsync(Guid eventId);
    Task<IEnumerable<TicketPurchase>> GetPendingVerificationsBySchoolIdAsync(Guid schoolId);
    Task AddAsync(TicketPurchase purchase);
    void Update(TicketPurchase purchase);
}
