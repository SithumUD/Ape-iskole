import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Menu, Bell, User, LogOut, LayoutDashboard,
  School, Settings, PlusCircle, ChevronDown,
} from "lucide-react";

/* ─── styles ─────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .aheader * { box-sizing: border-box; }
  .aheader { font-family: 'Plus Jakarta Sans', sans-serif; }

  /* Shell */
  .aheader-bar {
    position: sticky; top: 0; z-index: 30;
    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
    background: rgba(255,255,255,0.97);
    border-bottom: 1px solid #f0f0f0;
  }
  .aheader-bar.scrolled {
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: 0 1px 0 0 rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.04);
  }

  .aheader-inner {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px; height: 64px; gap: 16px;
  }

  /* Left */
  .aheader-left { display: flex; align-items: center; gap: 14px; }
  .aheader-menu-btn {
    width: 36px; height: 36px; border-radius: 10px;
    border: 1.5px solid #e5e7eb; background: transparent;
    display: flex; align-items: center; justify-content: center;
    color: #374151; cursor: pointer; transition: all 0.2s;
  }
  .aheader-menu-btn:hover { background: #f3f4f6; border-color: #d1d5db; }
  @media (min-width: 1024px) { .aheader-menu-btn { display: none; } }

  .aheader-page-title {
    font-size: 17px; font-weight: 800; color: #0f0f0f; letter-spacing: -0.3px; margin: 0;
  }
  .aheader-page-sub {
    font-size: 11.5px; font-weight: 500; color: #9ca3af; margin-top: 1px; line-height: 1;
  }

  /* Breadcrumb */
  .aheader-breadcrumb {
    display: none; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 600; color: #9ca3af;
  }
  @media (min-width: 640px) { .aheader-breadcrumb { display: flex; } }
  .aheader-breadcrumb span { color: #d1d5db; }

  /* Right */
  .aheader-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

  /* Create event btn */
  .aheader-create-btn {
    display: none; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 50px; border: none;
    background: linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));
    color: #fff; font-size: 12.5px; font-weight: 700;
    cursor: pointer; font-family: inherit;
    box-shadow: 0 4px 12px color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent);
    transition: all 0.25s; text-decoration: none;
  }
  .aheader-create-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px color-mix(in srgb,var(--color-primary,#4f46e5) 40%,transparent);
  }
  @media (min-width: 640px) { .aheader-create-btn { display: flex; } }

  /* Notification bell */
  .aheader-bell {
    position: relative;
    width: 36px; height: 36px; border-radius: 10px;
    border: 1.5px solid #e5e7eb; background: transparent;
    display: flex; align-items: center; justify-content: center;
    color: #6b7280; cursor: pointer; transition: all 0.2s;
  }
  .aheader-bell:hover { background: #f3f4f6; color: #374151; border-color: #d1d5db; }
  .aheader-bell-dot {
    position: absolute; top: 7px; right: 7px;
    width: 7px; height: 7px; border-radius: 50%;
    background: #ef4444; border: 1.5px solid #fff;
  }

  /* Divider */
  .aheader-divider {
    width: 1px; height: 28px; background: #e5e7eb; flex-shrink: 0;
  }

  /* User button */
  .aheader-user-btn {
    display: flex; align-items: center; gap: 8px;
    padding: 5px 10px 5px 5px; border-radius: 12px;
    border: 1.5px solid #e5e7eb; background: transparent;
    cursor: pointer; transition: all 0.2s; font-family: inherit;
  }
  .aheader-user-btn:hover { background: #f7f7f8; border-color: #d1d5db; }
  .aheader-avatar {
    width: 30px; height: 30px; border-radius: 9px; flex-shrink: 0;
    background: linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 800; color: #fff;
    box-shadow: 0 2px 8px color-mix(in srgb,var(--color-primary,#4f46e5) 25%,transparent);
  }
  .aheader-user-name {
    font-size: 13px; font-weight: 700; color: #111; line-height: 1.2;
    max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    display: none;
  }
  @media (min-width: 640px) { .aheader-user-name { display: block; } }
  .aheader-user-role {
    font-size: 9.5px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.12em; color: var(--color-primary,#4f46e5); line-height: 1;
    display: none;
  }
  @media (min-width: 640px) { .aheader-user-role { display: block; } }
  .aheader-chevron { color: #9ca3af; flex-shrink: 0; transition: transform 0.2s; }
  .aheader-chevron.open { transform: rotate(180deg); }

  /* Dropdown */
  .aheader-dropdown-wrap { position: relative; }
  .aheader-dropdown {
    position: absolute; right: 0; top: calc(100% + 8px);
    width: 220px;
    background: #fff; border-radius: 16px;
    border: 1px solid #f0f0f0;
    box-shadow: 0 16px 48px rgba(0,0,0,0.12);
    overflow: hidden; z-index: 100;
    opacity: 0; transform: translateY(-6px) scale(0.97);
    pointer-events: none;
    transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
  }
  .aheader-dropdown.open {
    opacity: 1; transform: translateY(0) scale(1);
    pointer-events: all;
  }

  .aheader-dd-user {
    padding: 16px 16px 12px;
    border-bottom: 1px solid #f3f4f6;
    background: color-mix(in srgb,var(--color-primary,#4f46e5) 4%,transparent);
  }
  .aheader-dd-avatar {
    width: 38px; height: 38px; border-radius: 11px; margin-bottom: 10px;
    background: linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; font-weight: 800; color: #fff;
  }
  .aheader-dd-name { font-size: 14px; font-weight: 800; color: #0f0f0f; line-height: 1.2; }
  .aheader-dd-role {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.12em; color: var(--color-primary,#4f46e5); margin-top: 3px;
  }

  .aheader-dd-items { padding: 8px; }
  .aheader-dd-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 10px;
    font-size: 13px; font-weight: 600; color: #4b5563;
    text-decoration: none; cursor: pointer;
    border: none; background: none; width: 100%;
    font-family: inherit; text-align: left;
    transition: all 0.18s;
  }
  .aheader-dd-item:hover { background: #f7f7f8; color: #111; }
  .aheader-dd-item.danger { color: #ef4444; }
  .aheader-dd-item.danger:hover { background: #fef2f2; color: #dc2626; }
  .aheader-dd-icon {
    width: 28px; height: 28px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: #f3f4f6; color: #9ca3af; transition: all 0.18s;
  }
  .aheader-dd-item:hover .aheader-dd-icon {
    background: color-mix(in srgb,var(--color-primary,#4f46e5) 10%,transparent);
    color: var(--color-primary,#4f46e5);
  }
  .aheader-dd-item.danger:hover .aheader-dd-icon { background: #fee2e2; color: #ef4444; }
  .aheader-dd-sep { height: 1px; background: #f3f4f6; margin: 6px 8px; }
`;

/* ─── page titles ────────────────────────────────────── */
const getPageInfo = (path) => {
  if (path.includes("/dashboard"))    return { title: "Dashboard",           sub: "Overview and key metrics" };
  if (path.includes("/schools"))      return { title: "Schools",             sub: "Manage registered schools" };
  if (path.includes("/approvals"))    return { title: "Approvals",           sub: "Review pending requests" };
  if (path.includes("/ads"))          return { title: "Ads Manager",         sub: "Manage advertisements" };
  if (path.includes("/sponsors"))     return { title: "Sponsors",            sub: "Manage platform sponsors" };
  if (path.includes("/users"))        return { title: "Users",               sub: "Manage platform users" };
  if (path.includes("/events/create"))return { title: "Create Event",        sub: "Set up a new school event" };
  if (path.includes("/events"))       return { title: "Events",              sub: "Manage school events" };
  if (path.includes("/announcements"))return { title: "Announcements",       sub: "Post school announcements" };
  if (path.includes("/tickets"))      return { title: "Tickets",             sub: "Manage event tickets" };
  if (path.includes("/donations"))    return { title: "Donations",           sub: "Manage donation campaigns" };
  if (path.includes("/stories"))      return { title: "Stories",             sub: "Manage school stories" };
  if (path.includes("/reports"))      return { title: "Reports",             sub: "Analytics and insights" };
  if (path.includes("/settings"))     return { title: "Settings",            sub: "Platform configuration" };
  if (path.includes("/profile"))      return { title: "Profile",             sub: "Your school profile" };
  if (path.includes("/promotions"))   return { title: "Promotions",          sub: "Manage promotions" };
  return { title: "Admin", sub: "Management panel" };
};

/* ─── component ──────────────────────────────────────── */
const AdminHeader = ({ setSidebarOpen }) => {
  const location = useLocation();
  const [scrolled, setScrolled]   = useState(false);
  const [dropOpen, setDropOpen]   = useState(false);
  const dropRef = useRef(null);
  const { userProfile, logout } = useAuth();

  const isSuperAdmin  = location.pathname.startsWith("/super-admin");
  const dashboardRoot = isSuperAdmin ? "/super-admin/dashboard" : "/school-admin/dashboard";
  const profilePath   = isSuperAdmin ? "/super-admin/profile"   : "/school-admin/profile";

  const { title, sub } = getPageInfo(location.pathname);
  const initials = (userProfile?.fullName || "U")
    .split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  /* scroll */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* click outside */
  useEffect(() => {
    const fn = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  /* close on route change */
  useEffect(() => { setDropOpen(false); }, [location.pathname]);

  return (
    <header className={`aheader aheader-bar ${scrolled ? "scrolled" : ""}`}>
      <style>{styles}</style>

      <div className="aheader-inner">

        {/* ── Left ── */}
        <div className="aheader-left">
          <button
            className="aheader-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={18} strokeWidth={2.2} />
          </button>

          <div>
            <h1 className="aheader-page-title">{title}</h1>
            <p className="aheader-page-sub">{sub}</p>
          </div>
        </div>

        {/* ── Right ── */}
        <div className="aheader-right">

          {/* Create event shortcut (school admin only) */}
          {!isSuperAdmin && (
            <Link to="/school-admin/events/create" className="aheader-create-btn">
              <PlusCircle size={14} strokeWidth={2.5} />
              Create Event
            </Link>
          )}

          {/* Notification bell */}
          {/*<button className="aheader-bell" aria-label="Notifications">
            <Bell size={17} strokeWidth={2.2} />
            <span className="aheader-bell-dot" />
          </button>*/}

          <div className="aheader-divider" />

          {/* User dropdown */}
          <div className="aheader-dropdown-wrap" ref={dropRef}>
            <button
              className="aheader-user-btn"
              onClick={() => setDropOpen(v => !v)}
              aria-label="User menu"
            >
              <div className="aheader-avatar">{initials}</div>
              <div style={{ textAlign: "left" }}>
                <p className="aheader-user-name">{userProfile?.fullName || "Account"}</p>
                <p className="aheader-user-role">{userProfile?.role?.replace("_", " ") || "Admin"}</p>
              </div>
              <ChevronDown size={14} strokeWidth={2.5} className={`aheader-chevron ${dropOpen ? "open" : ""}`} />
            </button>

            {/* Dropdown */}
            <div className={`aheader-dropdown ${dropOpen ? "open" : ""}`}>
              {/* User info */}
              <div className="aheader-dd-user">
                <div className="aheader-dd-avatar">{initials}</div>
                <p className="aheader-dd-name">{userProfile?.fullName || "Account"}</p>
                <p className="aheader-dd-role">{userProfile?.role?.replace("_", " ") || "Admin"}</p>
              </div>

              {/* Items */}
              <div className="aheader-dd-items">
                <Link
                  to={dashboardRoot}
                  className="aheader-dd-item"
                  onClick={() => setDropOpen(false)}
                >
                  <span className="aheader-dd-icon"><LayoutDashboard size={14} strokeWidth={2.2} /></span>
                  Dashboard
                </Link>

                <Link
                  to={profilePath}
                  className="aheader-dd-item"
                  onClick={() => setDropOpen(false)}
                >
                  <span className="aheader-dd-icon"><School size={14} strokeWidth={2.2} /></span>
                  School Profile
                </Link>

                <Link
                  to={isSuperAdmin ? "/super-admin/settings" : "/school-admin/settings"}
                  className="aheader-dd-item"
                  onClick={() => setDropOpen(false)}
                >
                  <span className="aheader-dd-icon"><Settings size={14} strokeWidth={2.2} /></span>
                  Settings
                </Link>

                <div className="aheader-dd-sep" />

                <button
                  className="aheader-dd-item danger"
                  onClick={() => { logout(); setDropOpen(false); }}
                >
                  <span className="aheader-dd-icon"><LogOut size={14} strokeWidth={2.2} /></span>
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;