using ApeIskole.Application.Interfaces;
using ApeIskole.Infrastructure.Persistence;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace ApeIskole.Infrastructure.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;
    private IUserRepository? _users;
    private ISchoolRepository? _schools;
    private IStoryRepository? _stories;
    private ICommentRepository? _comments;
    private IDonationRepository? _donations;
    private IEventRepository? _events;
    private ITicketPurchaseRepository? _ticketPurchases;
    private IAnnouncementRepository? _announcements;

    public UnitOfWork(ApplicationDbContext context)
    {
        _context = context;
    }

    public IUserRepository Users => _users ??= new UserRepository(_context);
    public ISchoolRepository Schools => _schools ??= new SchoolRepository(_context);
    public IStoryRepository Stories => _stories ??= new StoryRepository(_context);
    public ICommentRepository Comments => _comments ??= new CommentRepository(_context);
    public IDonationRepository Donations => _donations ??= new DonationRepository(_context);
    public IEventRepository Events => _events ??= new EventRepository(_context);
    public ITicketPurchaseRepository TicketPurchases => _ticketPurchases ??= new TicketPurchaseRepository(_context);
    public IAnnouncementRepository Announcements => _announcements ??= new AnnouncementRepository(_context);

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (disposing)
        {
            _context.Dispose();
        }
    }

    public async ValueTask DisposeAsync()
    {
        await _context.DisposeAsync();
        Dispose(false);
        GC.SuppressFinalize(this);
    }
}
