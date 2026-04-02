import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Menu, X, LogOut, LayoutGrid, School,
  Calendar, Heart, BookOpen, ChevronRight, User,
  PlusCircle, GraduationCap, LayoutDashboard, ShieldCheck
} from "lucide-react";

/* ─────────────────────────────────────────────
   Nav link definitions
───────────────────────────────────────────── */
const NAV_LINKS = [
  { path: "/",           label: "Home",       icon: LayoutGrid },
  { path: "/schools",    label: "Schools",    icon: School },
  { path: "/events",     label: "Events",     icon: Calendar },
  { path: "/donations",  label: "Donations",  icon: Heart },
  { path: "/stories",    label: "Stories",    icon: BookOpen },
  { path: "/promotions", label: "Promotions", icon: GraduationCap },
];

/* ─────────────────────────────────────────────
   Inline styles
───────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .pnav * { box-sizing: border-box; }
  .pnav { font-family: 'Plus Jakarta Sans', sans-serif; }

  /* ── Header shell ── */
  .pnav-header {
    position: fixed; top: 0; left: 0; right: 0; z-index: 60;
    transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
  }
  .pnav-header.solid {
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: 0 1px 0 0 rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.04);
  }
  .pnav-header.transparent {
    background: rgba(255,255,255,1);
    box-shadow: none;
    border-bottom: 1px solid rgba(0,0,0,0.04);
  }

  .pnav-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 68px;
    gap: 1rem;
  }

  /* ── Brand ── */
  .pnav-brand {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none; flex-shrink: 0;
    transition: opacity 0.2s;
  }
  .pnav-brand:hover { opacity: 0.85; }
  .pnav-brand-logo {
    width: 38px; height: 38px; border-radius: 10px;
    background: linear-gradient(135deg, var(--color-primary, #4f46e5), var(--color-secondary, #7c3aed));
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .pnav-brand-logo img { height: 24px; width: auto; object-fit: contain; }
  .pnav-brand-text { display: flex; flex-direction: column; }
  .pnav-brand-name {
    font-size: 17px; font-weight: 800; letter-spacing: -0.4px; line-height: 1;
    color: #0f0f0f;
  }
  .pnav-brand-name span { color: var(--color-primary, #4f46e5); }
  .pnav-brand-tagline {
    font-size: 9.5px; font-weight: 600; letter-spacing: 0.18em;
    text-transform: uppercase; color: #9ca3af; margin-top: 3px; line-height: 1;
  }

  /* ── Desktop nav ── */
  .pnav-desktop {
    display: none;
    align-items: center;
    gap: 2px;
    flex: 1;
    justify-content: center;
  }
  @media (min-width: 1024px) { .pnav-desktop { display: flex; } }

  .pnav-link {
    position: relative; display: flex; align-items: center; gap: 6px;
    padding: 8px 14px; border-radius: 10px;
    font-size: 13.5px; font-weight: 600; color: #6b7280;
    text-decoration: none;
    transition: all 0.2s ease;
    white-space: nowrap;
  }
  .pnav-link:hover { color: #111; background: #f3f4f6; }
  .pnav-link.active {
    color: var(--color-primary, #4f46e5);
    background: color-mix(in srgb, var(--color-primary, #4f46e5) 8%, transparent);
  }
  .pnav-link-indicator {
    position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%);
    width: 4px; height: 4px; border-radius: 50%;
    background: var(--color-primary, #4f46e5);
  }

  /* ── Actions ── */
  .pnav-actions {
    display: flex; align-items: center; gap: 8px; flex-shrink: 0;
  }

  .pnav-register-btn {
    display: none; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 50px;
    font-size: 12.5px; font-weight: 700;
    color: var(--color-primary, #4f46e5);
    background: color-mix(in srgb, var(--color-primary, #4f46e5) 7%, transparent);
    border: 1.5px solid color-mix(in srgb, var(--color-primary, #4f46e5) 20%, transparent);
    text-decoration: none; white-space: nowrap;
    transition: all 0.2s;
    cursor: pointer;
  }
  .pnav-register-btn:hover {
    background: color-mix(in srgb, var(--color-primary, #4f46e5) 14%, transparent);
    border-color: color-mix(in srgb, var(--color-primary, #4f46e5) 35%, transparent);
  }
  @media (min-width: 1180px) { .pnav-register-btn { display: flex; } }

  /* ── Admin panel button ── */
  .pnav-admin-btn {
    display: none; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 50px;
    font-size: 12.5px; font-weight: 700;
    color: #fff;
    background: linear-gradient(135deg, var(--color-primary, #4f46e5), var(--color-secondary, #7c3aed));
    border: none;
    text-decoration: none; white-space: nowrap;
    box-shadow: 0 3px 10px color-mix(in srgb, var(--color-primary, #4f46e5) 28%, transparent);
    transition: all 0.2s;
    cursor: pointer;
  }
  .pnav-admin-btn:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 5px 16px color-mix(in srgb, var(--color-primary, #4f46e5) 38%, transparent);
  }
  @media (min-width: 1024px) { .pnav-admin-btn { display: flex; } }

  /* Auth section */
  .pnav-auth-divider {
    display: flex; align-items: center; gap: 10px;
    padding-left: 10px;
    border-left: 1px solid #e5e7eb;
  }
  .pnav-user-meta { display: none; flex-direction: column; align-items: flex-end; }
  @media (min-width: 768px) { .pnav-user-meta { display: flex; } }
  .pnav-user-name {
    font-size: 13px; font-weight: 700; color: #111; line-height: 1.2;
    max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .pnav-user-role {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.12em; color: var(--color-primary, #4f46e5); line-height: 1;
  }

  .pnav-avatar {
    width: 36px; height: 36px; border-radius: 10px;
    background: #f3f4f6; border: 1.5px solid #e5e7eb;
    display: flex; align-items: center; justify-content: center;
    color: #6b7280; cursor: pointer; transition: all 0.2s;
  }
  .pnav-avatar:hover { border-color: var(--color-primary, #4f46e5); color: var(--color-primary, #4f46e5); }

  .pnav-logout {
    width: 36px; height: 36px; border-radius: 10px; border: none;
    background: transparent; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #9ca3af; transition: all 0.2s;
  }
  .pnav-logout:hover { background: #fef2f2; color: #ef4444; }

  .pnav-login-btn {
    padding: 8px 16px; border-radius: 50px; border: none; background: transparent;
    font-size: 13px; font-weight: 700; color: #4b5563; cursor: pointer;
    transition: color 0.2s; font-family: inherit;
  }
  .pnav-login-btn:hover { color: var(--color-primary, #4f46e5); }

  .pnav-join-btn {
    padding: 9px 22px; border-radius: 50px; border: none;
    background: linear-gradient(135deg, var(--color-primary, #4f46e5), var(--color-secondary, #7c3aed));
    font-size: 13px; font-weight: 800; color: #fff; cursor: pointer;
    box-shadow: 0 4px 12px color-mix(in srgb, var(--color-primary, #4f46e5) 35%, transparent);
    transition: all 0.25s; font-family: inherit; white-space: nowrap;
  }
  .pnav-join-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px color-mix(in srgb, var(--color-primary, #4f46e5) 45%, transparent);
  }
  .pnav-join-btn:active { transform: translateY(0); }

  /* ── Hamburger ── */
  .pnav-hamburger {
    display: flex; align-items: center; justify-content: center;
    width: 38px; height: 38px; border-radius: 10px; border: 1.5px solid #e5e7eb;
    background: transparent; cursor: pointer; color: #374151;
    transition: all 0.2s;
  }
  .pnav-hamburger:hover { background: #f3f4f6; border-color: #d1d5db; }
  @media (min-width: 1024px) { .pnav-hamburger { display: none; } }

  /* ── Spacer ── */
  .pnav-spacer { height: 68px; }

  /* ── Mobile overlay ── */
  .pnav-overlay {
    position: fixed; inset: 0; z-index: 100;
    pointer-events: none;
  }
  .pnav-overlay.open { pointer-events: all; }

  .pnav-backdrop {
    position: absolute; inset: 0;
    background: rgba(15,15,15,0.45);
    backdrop-filter: blur(4px);
    opacity: 0; transition: opacity 0.4s ease;
  }
  .pnav-overlay.open .pnav-backdrop { opacity: 1; }

  /* ── Mobile drawer ── */
  .pnav-drawer {
    position: absolute; right: 0; top: 0; bottom: 0;
    width: min(320px, 85vw);
    background: #fff;
    display: flex; flex-direction: column;
    transform: translateX(100%);
    transition: transform 0.4s cubic-bezier(0.4,0,0.2,1);
    box-shadow: -8px 0 40px rgba(0,0,0,0.12);
  }
  .pnav-overlay.open .pnav-drawer { transform: translateX(0); }

  .pnav-drawer-head {
    padding: 20px 20px 16px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid #f1f1f1;
  }
  .pnav-drawer-logo {
    display: flex; align-items: center; gap: 8px;
    font-size: 16px; font-weight: 800; color: #0f0f0f; letter-spacing: -0.3px;
  }
  .pnav-drawer-logo span { color: var(--color-primary, #4f46e5); }
  .pnav-drawer-logo-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: linear-gradient(135deg, var(--color-primary, #4f46e5), var(--color-secondary, #7c3aed));
    display: flex; align-items: center; justify-content: center;
  }
  .pnav-close {
    width: 34px; height: 34px; border-radius: 8px;
    background: #f5f5f5; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center; color: #6b7280;
    transition: all 0.2s;
  }
  .pnav-close:hover { background: #e5e7eb; color: #374151; }

  .pnav-drawer-nav {
    flex: 1; overflow-y: auto;
    padding: 12px 12px;
  }
  .pnav-drawer-link {
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 14px; border-radius: 12px;
    font-size: 14px; font-weight: 600; color: #4b5563;
    text-decoration: none; margin-bottom: 2px;
    transition: all 0.18s;
  }
  .pnav-drawer-link:hover { background: #f7f7f8; color: #111; }
  .pnav-drawer-link.active {
    background: color-mix(in srgb, var(--color-primary, #4f46e5) 8%, transparent);
    color: var(--color-primary, #4f46e5);
  }
  .pnav-drawer-link-left { display: flex; align-items: center; gap: 12px; }
  .pnav-drawer-link-icon {
    width: 34px; height: 34px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    background: #f3f4f6; color: #9ca3af; flex-shrink: 0;
    transition: all 0.18s;
  }
  .pnav-drawer-link.active .pnav-drawer-link-icon {
    background: color-mix(in srgb, var(--color-primary, #4f46e5) 12%, transparent);
    color: var(--color-primary, #4f46e5);
  }
  .pnav-drawer-chevron { color: #d1d5db; transition: all 0.18s; }
  .pnav-drawer-link.active .pnav-drawer-chevron { color: var(--color-primary, #4f46e5); }

  /* ── Drawer admin link ── */
  .pnav-drawer-admin-link {
    display: flex; align-items: center; justify-content: space-between;
    padding: 13px 14px; border-radius: 12px;
    font-size: 14px; font-weight: 700;
    text-decoration: none; margin-bottom: 2px;
    transition: all 0.18s;
    background: linear-gradient(135deg,
      color-mix(in srgb, var(--color-primary, #4f46e5) 10%, transparent),
      color-mix(in srgb, var(--color-secondary, #7c3aed) 7%, transparent)
    );
    border: 1.5px solid color-mix(in srgb, var(--color-primary, #4f46e5) 18%, transparent);
    color: var(--color-primary, #4f46e5);
  }
  .pnav-drawer-admin-link:hover {
    background: linear-gradient(135deg,
      color-mix(in srgb, var(--color-primary, #4f46e5) 16%, transparent),
      color-mix(in srgb, var(--color-secondary, #7c3aed) 12%, transparent)
    );
  }
  .pnav-drawer-admin-icon {
    width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, var(--color-primary, #4f46e5), var(--color-secondary, #7c3aed));
    color: #fff;
  }
  .pnav-drawer-admin-divider {
    height: 1px; background: #f0f0f0; margin: 8px 0;
  }

  .pnav-drawer-foot {
    padding: 16px 16px 20px;
    border-top: 1px solid #f1f1f1;
    background: #fafafa;
  }
  .pnav-drawer-user {
    display: flex; align-items: center; gap: 12px; margin-bottom: 14px;
    padding: 12px; background: #fff; border-radius: 12px;
    border: 1px solid #eee;
  }
  .pnav-drawer-avatar {
    width: 40px; height: 40px; border-radius: 10px;
    background: color-mix(in srgb, var(--color-primary, #4f46e5) 10%, transparent);
    display: flex; align-items: center; justify-content: center;
    color: var(--color-primary, #4f46e5); flex-shrink: 0;
  }
  .pnav-drawer-username {
    font-size: 14px; font-weight: 800; color: #111; line-height: 1.2;
  }
  .pnav-drawer-userrole {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.1em; color: var(--color-primary, #4f46e5); margin-top: 2px;
  }
  .pnav-drawer-logout {
    width: 100%; display: flex; align-items: center; justify-content: center;
    gap: 8px; padding: 12px; border-radius: 12px;
    border: 1.5px solid #fee2e2; background: #fff;
    font-size: 13.5px; font-weight: 700; color: #ef4444;
    cursor: pointer; transition: all 0.2s; font-family: inherit;
  }
  .pnav-drawer-logout:hover { background: #fef2f2; }

  .pnav-drawer-authbtns {
    display: flex; gap: 8px; margin-bottom: 12px;
  }
  .pnav-drawer-loginbtn {
    flex: 1; padding: 12px; border-radius: 12px;
    border: 1.5px solid #e5e7eb; background: #fff;
    font-size: 13.5px; font-weight: 700; color: #374151;
    cursor: pointer; transition: all 0.2s; font-family: inherit;
  }
  .pnav-drawer-loginbtn:hover { border-color: #d1d5db; background: #f9fafb; }
  .pnav-drawer-joinbtn {
    flex: 1; padding: 12px; border-radius: 12px; border: none;
    background: linear-gradient(135deg, var(--color-primary, #4f46e5), var(--color-secondary, #7c3aed));
    font-size: 13.5px; font-weight: 800; color: #fff;
    cursor: pointer; transition: all 0.2s; font-family: inherit;
    box-shadow: 0 4px 12px color-mix(in srgb, var(--color-primary, #4f46e5) 30%, transparent);
  }
  .pnav-drawer-joinbtn:hover { opacity: 0.92; }

  .pnav-drawer-register {
    display: flex; align-items: center; justify-content: center; gap: 6px;
    font-size: 12.5px; font-weight: 700; color: var(--color-primary, #4f46e5);
    text-decoration: none; padding: 8px;
    margin-bottom: 8px;
  }
  .pnav-drawer-copy {
    font-size: 10px; font-weight: 600; color: #d1d5db;
    text-align: center; letter-spacing: 0.15em; text-transform: uppercase;
    margin-top: 12px;
  }
`;

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
const PublicNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const {
    login, register, authenticated, logout,
    userProfile, isSuperAdmin, isSchoolAdmin, isModerator,
  } = useAuth();

  /* Derive admin panel destination */
  const adminPanelPath = isSuperAdmin?.() ? "/super-admin" : isSchoolAdmin?.() ? "/school-admin" : null;
  const isAdmin = !!adminPanelPath || isModerator?.();
  const adminLabel = isSuperAdmin?.() ? "Super Admin" : "Admin Panel";

  /* scroll detection */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* lock body scroll when drawer open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  /* close drawer on route change */
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <div className="pnav">
      <style>{styles}</style>

      {/* ── Header ── */}
      <header className={`pnav-header ${scrolled ? "solid" : "transparent"}`}>
        <div className="pnav-inner">

          {/* Brand */}
          <Link to="/" className="pnav-brand">
            <div className="pnav-brand-logo">
              <img src="/apeiskole-logo.png" alt="Ape Iskole" onError={e => { e.currentTarget.style.display = "none"; }} />
            </div>
            <div className="pnav-brand-text">
              <span className="pnav-brand-name">Ape<span>Iskole</span></span>
              <span className="pnav-brand-tagline">Empowering Education</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="pnav-desktop">
            {NAV_LINKS.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path} className={`pnav-link ${isActive(path) ? "active" : ""}`}>
                <Icon size={15} strokeWidth={2.2} />
                {label}
                {isActive(path) && <span className="pnav-link-indicator" />}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="pnav-actions">

            {/* Register School — only for non-admins */}
            {authenticated && !isAdmin && (
              <Link to="/register-school" className="pnav-register-btn">
                <PlusCircle size={14} strokeWidth={2.5} />
                Register School
              </Link>
            )}

            {/* Admin Panel button — only for admins */}
            {authenticated && adminPanelPath && (
              <Link to={adminPanelPath} className="pnav-admin-btn">
                {isSuperAdmin?.()
                  ? <ShieldCheck size={14} strokeWidth={2.5} />
                  : <LayoutDashboard size={14} strokeWidth={2.5} />
                }
                {adminLabel}
              </Link>
            )}

            {authenticated ? (
              <div className="pnav-auth-divider">
                <div className="pnav-user-meta">
                  <span className="pnav-user-name">{userProfile?.fullName || "Account"}</span>
                  <span className="pnav-user-role">{userProfile?.role?.replace("_", " ")}</span>
                </div>
                <div className="pnav-avatar" title="Profile">
                  <User size={17} strokeWidth={2.2} />
                </div>
                <button className="pnav-logout" onClick={logout} title="Logout">
                  <LogOut size={17} strokeWidth={2.2} />
                </button>
              </div>
            ) : (
              <>
                <button className="pnav-login-btn" onClick={login}>Login</button>
                <button className="pnav-join-btn"  onClick={register}>Join Now</button>
              </>
            )}

            {/* Hamburger */}
            <button
              className="pnav-hamburger"
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={20} strokeWidth={2.2} /> : <Menu size={20} strokeWidth={2.2} />}
            </button>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="pnav-spacer" />

      {/* ── Mobile Drawer ── */}
      <div className={`pnav-overlay ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <div className="pnav-backdrop" onClick={() => setMenuOpen(false)} />

        <div className="pnav-drawer" role="dialog" aria-modal="true" aria-label="Navigation menu">
          {/* Drawer header */}
          <div className="pnav-drawer-head">
            <div className="pnav-drawer-logo">
              <div className="pnav-drawer-logo-icon">
                <GraduationCap size={16} color="#fff" strokeWidth={2.5} />
              </div>
              Ape<span>Iskole</span>
            </div>
            <button className="pnav-close" onClick={() => setMenuOpen(false)} aria-label="Close">
              <X size={18} strokeWidth={2.2} />
            </button>
          </div>

          {/* Drawer nav links */}
          <nav className="pnav-drawer-nav">
            {/* Admin Panel link at the top — only for admins */}
            {authenticated && adminPanelPath && (
              <>
                <Link to={adminPanelPath} className="pnav-drawer-admin-link">
                  <div className="pnav-drawer-link-left">
                    <span className="pnav-drawer-admin-icon">
                      {isSuperAdmin?.()
                        ? <ShieldCheck size={16} strokeWidth={2.5} />
                        : <LayoutDashboard size={16} strokeWidth={2.5} />
                      }
                    </span>
                    {adminLabel}
                  </div>
                  <ChevronRight size={15} strokeWidth={2.5} style={{ color: "var(--color-primary,#4f46e5)" }} />
                </Link>
                <div className="pnav-drawer-admin-divider" />
              </>
            )}

            {NAV_LINKS.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`pnav-drawer-link ${isActive(path) ? "active" : ""}`}
              >
                <div className="pnav-drawer-link-left">
                  <span className="pnav-drawer-link-icon">
                    <Icon size={16} strokeWidth={2.2} />
                  </span>
                  {label}
                </div>
                <ChevronRight size={15} className="pnav-drawer-chevron" strokeWidth={2.5} />
              </Link>
            ))}
          </nav>

          {/* Drawer footer */}
          <div className="pnav-drawer-foot">
            {authenticated ? (
              <>
                <div className="pnav-drawer-user">
                  <div className="pnav-drawer-avatar">
                    <User size={18} strokeWidth={2.2} />
                  </div>
                  <div>
                    <p className="pnav-drawer-username">{userProfile?.fullName || "Account"}</p>
                    <p className="pnav-drawer-userrole">{userProfile?.role?.replace("_", " ")}</p>
                  </div>
                </div>
                <button className="pnav-drawer-logout" onClick={logout}>
                  <LogOut size={16} strokeWidth={2.2} /> Sign out
                </button>
              </>
            ) : (
              <>
                {!isAdmin && (
                  <Link to="/register-school" className="pnav-drawer-register">
                    <PlusCircle size={14} strokeWidth={2.5} />
                    Register Your School
                  </Link>
                )}
                <div className="pnav-drawer-authbtns">
                  <button className="pnav-drawer-loginbtn" onClick={login}>Login</button>
                  <button className="pnav-drawer-joinbtn"  onClick={register}>Join Now</button>
                </div>
              </>
            )}
            <p className="pnav-drawer-copy">© 2026 Ape Iskole</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicNavbar;