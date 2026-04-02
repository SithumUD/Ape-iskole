using System;
using System.Threading;
using System.Threading.Tasks;

namespace ApeIskole.Application.Interfaces;

public interface IUnitOfWork : IDisposable, IAsyncDisposable
{
    ISchoolRepository Schools { get; }
    IUserRepository Users { get; }
    IStoryRepository Stories { get; }
    ICommentRepository Comments { get; }
    IDonationRepository Donations { get; }
    IEventRepository Events { get; }
    ITicketPurchaseRepository TicketPurchases { get; }
    IAnnouncementRepository Announcements { get; }
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
