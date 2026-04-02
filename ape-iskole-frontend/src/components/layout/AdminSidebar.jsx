import React, { useMemo } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard, School, CheckSquare, Megaphone, Handshake,
  Users, GraduationCap, BarChart2, Settings, CalendarDays,
  PlusCircle, Ticket, Heart, BookOpen, X, Globe,
  ShieldCheck,
} from "lucide-react";

/* ─── styles ─────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .asidebar * { box-sizing: border-box; }
  .asidebar { font-family: 'Plus Jakarta Sans', sans-serif; }

  /* overlay */
  .asidebar-backdrop {
    position: fixed; inset: 0; z-index: 40;
    background: rgba(15,15,15,0.45);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    opacity: 0; pointer-events: none;
    transition: opacity 0.35s ease;
  }
  .asidebar-backdrop.open { opacity: 1; pointer-events: all; }

  /* sidebar shell
     — flex column, full height, never shrinks or scrolls itself */
  .asidebar-panel {
    position: fixed; inset-y: 0; left: 0; top: 0; bottom: 0;
    z-index: 50; width: 268px;
    background: #fff;
    display: flex;
    flex-direction: column;
    overflow: hidden;           /* panel itself never scrolls */
    box-shadow: 4px 0 32px rgba(0,0,0,0.08);
    border-right: 1px solid #f0f0f0;
    transform: translateX(-100%);
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
  }
  .asidebar-panel.open { transform: translateX(0); }

  @media (min-width: 1024px) {
    .asidebar-panel {
      position: relative;
      transform: translateX(0) !important;
      box-shadow: none;
      height: 100%;             /* fill the sticky sidebar column */
    }
    .asidebar-backdrop { display: none !important; }
  }

  /* ── TOP BLOCK (brand + role badge) — never scrolls ── */
  .asidebar-top {
    flex-shrink: 0;             /* stays put */
    border-bottom: 1px solid #f3f4f6;
  }

  /* header */
  .asidebar-head {
    padding: 20px 18px 16px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .asidebar-brand {
    display: flex; align-items: center; gap: 10px; text-decoration: none;
    transition: opacity 0.2s;
  }
  .asidebar-brand:hover { opacity: 0.85; }
  .asidebar-logo-icon {
    width: 38px; height: 38px; border-radius: 11px; flex-shrink: 0;
    background: linear-gradient(135deg, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed));
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 12px color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent);
  }
  .asidebar-logo-icon img { height: 22px; width: auto; object-fit: contain; }
  .asidebar-brand-text { display: flex; flex-direction: column; }
  .asidebar-brand-name {
    font-size: 16px; font-weight: 800; letter-spacing: -0.3px; line-height: 1;
    color: #0f0f0f;
  }
  .asidebar-brand-name span { color: var(--color-primary,#4f46e5); }
  .asidebar-brand-sub {
    font-size: 9.5px; font-weight: 700; letter-spacing: 0.14em;
    text-transform: uppercase; color: #9ca3af; margin-top: 3px; line-height: 1;
  }
  .asidebar-close-btn {
    width: 30px; height: 30px; border-radius: 8px;
    background: #f5f5f5; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center; color: #6b7280;
    transition: all 0.2s;
  }
  .asidebar-close-btn:hover { background: #e5e7eb; color: #374151; }

  /* role badge */
  .asidebar-role-badge {
    margin: 0 14px 14px;
    padding: 10px 14px;
    border-radius: 12px;
    background: color-mix(in srgb,var(--color-primary,#4f46e5) 6%,transparent);
    border: 1px solid color-mix(in srgb,var(--color-primary,#4f46e5) 14%,transparent);
    display: flex; align-items: center; gap: 10px;
  }
  .asidebar-role-icon {
    width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
    background: color-mix(in srgb,var(--color-primary,#4f46e5) 12%,transparent);
    display: flex; align-items: center; justify-content: center;
    color: var(--color-primary,#4f46e5);
  }
  .asidebar-role-label {
    font-size: 9.5px; font-weight: 800; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--color-primary,#4f46e5);
  }
  .asidebar-role-name {
    font-size: 12px; font-weight: 700; color: #374151; margin-top: 1px;
  }

  /* nav section label */
  .asidebar-section-label {
    font-size: 9.5px; font-weight: 800; letter-spacing: 0.16em;
    text-transform: uppercase; color: #c4c4c4;
    padding: 0 16px; margin: 14px 0 6px;
  }

  /* ── NAV — the only scrollable region ── */
  .asidebar-nav {
    flex: 1;                    /* takes all remaining height */
    overflow-y: auto;           /* scrolls when items overflow */
    overflow-x: hidden;
    padding: 4px 10px 8px;
  }

  /* custom scrollbar */
  .asidebar-nav::-webkit-scrollbar { width: 4px; }
  .asidebar-nav::-webkit-scrollbar-track { background: transparent; }
  .asidebar-nav::-webkit-scrollbar-thumb {
    background: #e5e7eb; border-radius: 99px;
  }
  .asidebar-nav::-webkit-scrollbar-thumb:hover { background: #d1d5db; }

  .asidebar-link {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 13px; border-radius: 12px;
    font-size: 13.5px; font-weight: 600; color: #6b7280;
    text-decoration: none; margin-bottom: 2px;
    transition: all 0.18s;
    position: relative;
  }
  .asidebar-link:hover { background: #f7f7f8; color: #111; }
  .asidebar-link.active {
    background: linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));
    color: #fff;
    box-shadow: 0 4px 14px color-mix(in srgb,var(--color-primary,#4f46e5) 28%,transparent);
  }
  .asidebar-link-icon {
    width: 30px; height: 30px; border-radius: 9px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: #f3f4f6; color: #9ca3af;
    transition: all 0.18s;
  }
  .asidebar-link:hover .asidebar-link-icon {
    background: color-mix(in srgb,var(--color-primary,#4f46e5) 10%,transparent);
    color: var(--color-primary,#4f46e5);
  }
  .asidebar-link.active .asidebar-link-icon {
    background: rgba(255,255,255,0.18);
    color: #fff;
  }

  /* ── FOOTER — never scrolls ── */
  .asidebar-foot {
    flex-shrink: 0;             /* stays put */
    border-top: 1px solid #f3f4f6;
    padding: 14px 12px;
  }
  .asidebar-back-btn {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 13px; border-radius: 12px;
    font-size: 13px; font-weight: 600; color: #6b7280;
    text-decoration: none;
    transition: all 0.18s;
    cursor: pointer;
  }
  .asidebar-back-btn:hover { background: #f7f7f8; color: #111; }
  .asidebar-back-icon {
    width: 30px; height: 30px; border-radius: 9px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: #f3f4f6; color: #9ca3af;
    transition: all 0.18s;
  }
  .asidebar-back-btn:hover .asidebar-back-icon {
    background: #e5e7eb; color: #374151;
  }
`;

/* ─── nav definitions ────────────────────────────────── */
const SUPER_ADMIN_NAV = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard",   path: "/super-admin/dashboard",  icon: LayoutDashboard },
    ],
  },
  {
    section: "Manage",
    items: [
      { label: "Schools",     path: "/super-admin/schools",    icon: School },
      { label: "Approvals",   path: "/super-admin/approvals",  icon: CheckSquare },
      { label: "Users",       path: "/super-admin/users",      icon: Users },
      { label: "Promotions",  path: "/super-admin/promotions", icon: GraduationCap },
    ],
  },
  {
    section: "Marketing",
    items: [
      { label: "Ads Manager", path: "/super-admin/ads",        icon: Megaphone },
      { label: "Sponsors",    path: "/super-admin/sponsors",   icon: Handshake },
    ],
  },
  {
    section: "System",
    items: [
      { label: "Reports",     path: "/super-admin/reports",    icon: BarChart2 },
      { label: "Settings",    path: "/super-admin/settings",   icon: Settings },
    ],
  },
];

const SCHOOL_ADMIN_NAV = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard",     path: "/school-admin/dashboard",     icon: LayoutDashboard },
    ],
  },
  {
    section: "Events",
    items: [
      { label: "Manage Events", path: "/school-admin/events",        icon: CalendarDays },
      { label: "Create Event",  path: "/school-admin/events/create", icon: PlusCircle },
      //{ label: "Tickets",       path: "/school-admin/tickets",       icon: Ticket },
    ],
  },
  {
    section: "Content",
    items: [
      { label: "Announcements", path: "/school-admin/announcements", icon: Megaphone },
      { label: "Stories",       path: "/school-admin/stories",       icon: BookOpen },
      { label: "Donations",     path: "/school-admin/donations",     icon: Heart },
    ],
  },
  {
    section: "System",
    items: [
      //{ label: "Reports",       path: "/school-admin/reports",       icon: BarChart2 },
      //{ label: "Settings",      path: "/school-admin/settings",      icon: Settings },
    ],
  },
];

/* ─── component ──────────────────────────────────────── */
const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { isSuperAdmin: checkSuperAdmin } = useAuth();
  const isSuperAdmin = checkSuperAdmin();

  const navGroups = isSuperAdmin ? SUPER_ADMIN_NAV : SCHOOL_ADMIN_NAV;
  const roleLabel = isSuperAdmin ? "Super Admin" : "School Admin";
  const roleDesc  = isSuperAdmin ? "Platform Management" : "School Management";

  return (
    <div className="asidebar">
      <style>{styles}</style>

      {/* Backdrop (mobile only) */}
      <div
        className={`asidebar-backdrop ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Panel */}
      <aside className={`asidebar-panel ${sidebarOpen ? "open" : ""}`}>

        {/* ── TOP BLOCK: brand + role badge — fixed, never scrolls ── */}
        <div className="asidebar-top">
          <div className="asidebar-head">
            <Link to="/" className="asidebar-brand" onClick={() => setSidebarOpen(false)}>
              <div className="asidebar-logo-icon">
                <img
                  src="/apeiskole-logo.png"
                  alt="Ape Iskole"
                  onError={e => { e.currentTarget.style.display = "none"; }}
                />
              </div>
              <div className="asidebar-brand-text">
                <span className="asidebar-brand-name">Ape<span>Iskole</span></span>
                <span className="asidebar-brand-sub">Admin Panel</span>
              </div>
            </Link>
            <button
              className="asidebar-close-btn"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={16} strokeWidth={2.2} />
            </button>
          </div>

          <div className="asidebar-role-badge">
            <div className="asidebar-role-icon">
              {isSuperAdmin
                ? <ShieldCheck size={16} strokeWidth={2.2} />
                : <School size={16} strokeWidth={2.2} />
              }
            </div>
            <div>
              <p className="asidebar-role-label">{roleLabel}</p>
              <p className="asidebar-role-name">{roleDesc}</p>
            </div>
          </div>
        </div>

        {/* ── NAV: only this region scrolls ── */}
        <nav className="asidebar-nav">
          {navGroups.map(({ section, items }) => (
            <div key={section}>
              <p className="asidebar-section-label">{section}</p>
              {items.map(({ label, path, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `asidebar-link ${isActive ? "active" : ""}`
                  }
                >
                  <span className="asidebar-link-icon">
                    <Icon size={15} strokeWidth={2.2} />
                  </span>
                  {label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* ── FOOTER: fixed, never scrolls ── */}
        <div className="asidebar-foot">
          <Link to="/" className="asidebar-back-btn" onClick={() => setSidebarOpen(false)}>
            <span className="asidebar-back-icon">
              <Globe size={15} strokeWidth={2.2} />
            </span>
            Back to Website
          </Link>
        </div>

      </aside>
    </div>
  );
};

export default AdminSidebar;