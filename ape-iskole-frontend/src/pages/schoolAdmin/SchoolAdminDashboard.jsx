import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApiSchool from "../../services/ApiSchool";
import {
  PlusCircle, Megaphone, Ticket, BarChart2,
  CalendarDays, CheckCircle, Clock, Heart,
  ArrowRight, Eye, TrendingUp, Zap, ChevronRight,
  RefreshCw, Users, Star,
} from "lucide-react";

/* ─── helpers ─────────────────────────────────────────── */
const formatDate = (d) => {
  if (!d) return "N/A";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const getHour = () => new Date().getHours();
const greetingText = () => {
  const h = getHour();
  if (h < 12) return "Good Morning";
  if (h < 18) return "Good Afternoon";
  return "Good Evening";
};

/* ─── inline styles ───────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: none; }
  }

  .sad * { box-sizing: border-box; }
  .sad {
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex; flex-direction: column; gap: 28px;
    animation: fadeUp 0.5s ease both;
  }

  /* ── Skeleton ── */
  .sad-skeleton {
    background: linear-gradient(90deg,#f3f4f6 25%,#eaebec 50%,#f3f4f6 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 10px;
  }

  /* ── Section head ── */
  .sad-section-head {
    display: flex; align-items: flex-end; justify-content: space-between;
    margin-bottom: 18px;
  }
  .sad-label {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 10.5px; font-weight: 700; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--color-primary,#4f46e5);
    background: color-mix(in srgb,var(--color-primary,#4f46e5) 9%,transparent);
    padding: 3px 9px; border-radius: 50px; margin-bottom: 6px;
  }
  .sad-section-title {
    font-size: 18px; font-weight: 800; color: #0f0f0f;
    letter-spacing: -0.3px; margin: 0;
  }
  .sad-section-sub {
    font-size: 12.5px; color: #9ca3af; font-weight: 500; margin-top: 3px;
  }
  .sad-view-all {
    display: flex; align-items: center; gap: 4px;
    font-size: 12.5px; font-weight: 700; color: var(--color-primary,#4f46e5);
    text-decoration: none; white-space: nowrap;
    transition: gap 0.18s;
  }
  .sad-view-all:hover { gap: 7px; }

  /* ── Cards ── */
  .sad-card {
    background: #fff; border-radius: 20px; border: 1px solid #f0f0f0;
    box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  }

  /* ── Hero ── */
  .sad-hero {
    border-radius: 24px; overflow: hidden; position: relative;
    background: linear-gradient(135deg,#1e1b4b 0%,var(--color-primary,#4f46e5) 45%,var(--color-secondary,#7c3aed) 100%);
    padding: 36px 40px; color: #fff;
  }
  .sad-hero-deco {
    position: absolute; border-radius: 50%; pointer-events: none;
  }
  .sad-hero-greeting {
    display: inline-flex; align-items: center; gap: 6px; margin-bottom: 12px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
    color: #c7d2fe; background: rgba(255,255,255,0.12);
    padding: 4px 12px; border-radius: 50px;
  }
  .sad-hero-title {
    font-size: clamp(22px,3vw,32px); font-weight: 900;
    letter-spacing: -0.6px; line-height: 1.2; margin: 0 0 10px;
  }
  .sad-hero-sub {
    font-size: 14px; color: rgba(255,255,255,0.72); line-height: 1.7;
    margin: 0 0 28px; max-width: 520px; font-weight: 400;
  }
  .sad-hero-actions { display: flex; flex-wrap: wrap; gap: 10px; }
  .sad-hero-btn-primary {
    display: flex; align-items: center; gap: 6px;
    padding: 11px 22px; border-radius: 50px; border: none;
    background: #fff; color: var(--color-primary,#4f46e5);
    font-weight: 800; font-size: 13px; cursor: pointer; font-family: inherit;
    box-shadow: 0 4px 16px rgba(0,0,0,0.18); transition: all 0.2s;
    text-decoration: none;
  }
  .sad-hero-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,0.22); }
  .sad-hero-btn-outline {
    display: flex; align-items: center; gap: 6px;
    padding: 11px 20px; border-radius: 50px;
    border: 2px solid rgba(255,255,255,0.3); background: transparent;
    color: #fff; font-weight: 700; font-size: 13px; cursor: pointer;
    font-family: inherit; transition: background 0.2s; text-decoration: none;
  }
  .sad-hero-btn-outline:hover { background: rgba(255,255,255,0.1); }

  /* Stats strip inside hero */
  .sad-hero-stats {
    display: grid; grid-template-columns: repeat(auto-fit,minmax(130px,1fr));
    gap: 2px; margin-top: 32px;
    background: rgba(255,255,255,0.1); border-radius: 16px;
    backdrop-filter: blur(8px); overflow: hidden;
  }
  .sad-hero-stat {
    padding: 18px 20px;
    border-right: 1px solid rgba(255,255,255,0.1);
  }
  .sad-hero-stat:last-child { border-right: none; }
  .sad-hero-stat-label {
    font-size: 10.5px; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; color: rgba(255,255,255,0.55); margin-bottom: 5px;
    display: flex; align-items: center; gap: 6px;
  }
  .sad-hero-stat-value {
    font-size: 22px; font-weight: 900; letter-spacing: -0.5px;
  }

  /* ── Quick Actions ── */
  .sad-actions-grid {
    display: grid; grid-template-columns: repeat(auto-fill,minmax(210px,1fr)); gap: 14px;
  }
  .sad-action-card {
    background: #fff; border-radius: 18px; border: 1px solid #f0f0f0;
    padding: 22px 20px; cursor: pointer;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    transition: all 0.22s;
    text-decoration: none; display: block;
  }
  .sad-action-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 28px rgba(0,0,0,0.09);
    border-color: color-mix(in srgb,var(--color-primary,#4f46e5) 20%,transparent);
  }
  .sad-action-icon {
    width: 44px; height: 44px; border-radius: 14px; margin-bottom: 14px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.22s;
  }
  .sad-action-card:hover .sad-action-icon {
    background: color-mix(in srgb,var(--color-primary,#4f46e5) 12%,transparent) !important;
    color: var(--color-primary,#4f46e5) !important;
  }
  .sad-action-title {
    font-size: 14px; font-weight: 800; color: #0f0f0f; margin: 0 0 5px;
  }
  .sad-action-desc {
    font-size: 12px; color: #9ca3af; line-height: 1.6; margin: 0 0 14px;
  }
  .sad-action-arrow {
    display: flex; align-items: center; gap: 4px;
    font-size: 12px; font-weight: 700; color: var(--color-primary,#4f46e5);
    transition: gap 0.18s;
  }
  .sad-action-card:hover .sad-action-arrow { gap: 7px; }

  /* ── Two-col grid ── */
  .sad-grid-2-1 {
    display: grid; grid-template-columns: 1fr; gap: 20px;
  }
  @media (min-width: 1024px) {
    .sad-grid-2-1 { grid-template-columns: 2fr 1fr; }
  }

  /* ── Table ── */
  .sad-table { width: 100%; border-collapse: collapse; }
  .sad-table thead tr { background: #fafafa; }
  .sad-table th {
    padding: 11px 14px; text-align: left;
    font-size: 10.5px; font-weight: 800; letter-spacing: 0.1em;
    text-transform: uppercase; color: #9ca3af;
    border-bottom: 1px solid #f0f0f0;
  }
  .sad-table th:first-child { border-radius: 10px 0 0 10px; }
  .sad-table th:last-child  { border-radius: 0 10px 10px 0; }
  .sad-table td {
    padding: 13px 14px; font-size: 13px; color: #374151;
    border-bottom: 1px solid #f7f7f8;
  }
  .sad-table tbody tr { transition: background 0.15s; cursor: pointer; }
  .sad-table tbody tr:hover { background: #fafafa; }
  .sad-table tbody tr:last-child td { border-bottom: none; }
  .sad-table-name { font-size: 13.5px; font-weight: 700; color: #0f0f0f; }
  .sad-table-sub  { font-size: 11px; color: #9ca3af; font-weight: 500; margin-top: 2px; }

  /* Progress bar */
  .sad-progress-wrap { min-width: 80px; }
  .sad-progress-labels {
    display: flex; justify-content: space-between;
    font-size: 11px; margin-bottom: 4px;
  }
  .sad-progress-sold  { font-weight: 700; color: #374151; }
  .sad-progress-total { color: #9ca3af; }
  .sad-progress-track {
    height: 5px; border-radius: 50px; background: #f3f4f6; overflow: hidden;
  }
  .sad-progress-fill {
    height: 100%; border-radius: 50px;
    background: var(--color-primary,#4f46e5);
    transition: width 0.5s;
  }
  .sad-progress-fill.danger { background: #ef4444; }

  /* Badge */
  .sad-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 4px 10px; border-radius: 50px;
    font-size: 11px; font-weight: 700; white-space: nowrap;
  }
  .sad-badge-green  { color: #065f46; background: #d1fae5; }
  .sad-badge-yellow { color: #92400e; background: #fef3c7; }
  .sad-badge-red    { color: #991b1b; background: #fee2e2; }
  .sad-badge-blue   { color: #1e40af; background: #dbeafe; }
  .sad-badge-gray   { color: #4b5563; background: #f3f4f6; }

  /* ── Approval summary cards ── */
  .sad-approval-item {
    border-radius: 14px; padding: 16px;
    margin-bottom: 12px;
  }
  .sad-approval-row {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  }
  .sad-approval-label {
    font-size: 12.5px; font-weight: 600; display: flex; align-items: center; gap: 7px;
  }
  .sad-approval-count {
    font-size: 22px; font-weight: 900; letter-spacing: -0.5px;
  }
  .sad-approval-track {
    height: 5px; border-radius: 50px; overflow: hidden;
  }
  .sad-approval-fill { height: 100%; border-radius: 50px; }

  /* ── Announcement items ── */
  .sad-announce-item {
    border: 1px solid #f0f0f0; border-radius: 14px; padding: 16px;
    margin-bottom: 10px; cursor: pointer; transition: all 0.18s;
  }
  .sad-announce-item:hover {
    border-color: color-mix(in srgb,var(--color-primary,#4f46e5) 20%,transparent);
    box-shadow: 0 4px 14px rgba(0,0,0,0.06);
  }
  .sad-announce-item:last-child { margin-bottom: 0; }
  .sad-announce-title { font-size: 13.5px; font-weight: 700; color: #0f0f0f; }
  .sad-announce-meta  { font-size: 11px; color: #9ca3af; margin-top: 4px; }

  /* ── Performance bars ── */
  .sad-perf-item {
    background: #fafafa; border-radius: 14px; padding: 16px; margin-bottom: 12px;
  }
  .sad-perf-row {
    display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
  }
  .sad-perf-label-group { display: flex; align-items: center; gap: 8px; }
  .sad-perf-icon {
    width: 30px; height: 30px; border-radius: 9px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: #f0f0f0;
  }
  .sad-perf-label { font-size: 12.5px; font-weight: 600; color: #4b5563; }
  .sad-perf-value { font-size: 14px; font-weight: 800; color: #0f0f0f; }
  .sad-perf-track {
    height: 6px; border-radius: 50px; background: #ebebeb; overflow: hidden;
  }
  .sad-perf-fill { height: 100%; border-radius: 50px; transition: width 0.6s; }
  .sad-perf-note { font-size: 11px; color: #9ca3af; margin-top: 6px; }

  /* ── Activity timeline ── */
  .sad-timeline { display: flex; flex-direction: column; gap: 16px; }
  .sad-timeline-item { display: flex; align-items: flex-start; gap: 12px; }
  .sad-timeline-dot {
    width: 34px; height: 34px; border-radius: 11px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .sad-timeline-text { font-size: 13px; font-weight: 600; color: #374151; line-height: 1.5; }
  .sad-timeline-time { font-size: 11px; color: #9ca3af; margin-top: 3px; }

  /* ── CTA button ── */
  .sad-cta-btn {
    display: flex; align-items: center; justify-content: center; gap: 7px;
    width: 100%; padding: 12px; border-radius: 12px; border: none;
    font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit;
    transition: all 0.2s; text-decoration: none; margin-top: 16px;
  }
  .sad-cta-primary {
    background: linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));
    color: #fff;
    box-shadow: 0 4px 14px color-mix(in srgb,var(--color-primary,#4f46e5) 28%,transparent);
  }
  .sad-cta-primary:hover { opacity: 0.9; transform: translateY(-1px); }
  .sad-cta-soft {
    background: color-mix(in srgb,var(--color-primary,#4f46e5) 7%,transparent);
    color: var(--color-primary,#4f46e5);
    border: 1.5px solid color-mix(in srgb,var(--color-primary,#4f46e5) 18%,transparent);
  }
  .sad-cta-soft:hover {
    background: color-mix(in srgb,var(--color-primary,#4f46e5) 12%,transparent);
  }

  /* ── Empty ── */
  .sad-empty {
    text-align: center; padding: 32px 20px;
    color: #9ca3af; font-size: 13px; font-weight: 500;
  }

  /* ── Error ── */
  .sad-error {
    background: #fef2f2; border: 1px solid #fecaca;
    border-radius: 18px; padding: 40px 24px; text-align: center;
  }
  .sad-error-text { color: #dc2626; font-weight: 600; font-size: 14px; margin: 0 0 14px; }
  .sad-retry-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 10px 22px; border-radius: 50px; border: none;
    background: #dc2626; color: #fff; font-weight: 700; font-size: 13px;
    cursor: pointer; font-family: inherit; transition: opacity 0.2s;
  }
  .sad-retry-btn:hover { opacity: 0.88; }

  /* ── Loading ── */
  .sad-loading {
    display: flex; align-items: center; justify-content: center;
    min-height: 320px; flex-direction: column; gap: 14px;
  }
  .sad-spinner {
    width: 44px; height: 44px; border-radius: 50%;
    border: 3px solid #f0f0f0;
    border-top-color: var(--color-primary,#4f46e5);
    animation: spin 0.75s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .sad-loading-text { font-size: 13px; color: #9ca3af; font-weight: 600; }
`;

/* ─── Sub-components ──────────────────────────────────── */
const SectionHead = ({ label, title, sub, viewTo, viewLabel = "View all" }) => (
  <div className="sad-section-head">
    <div>
      {label && <span className="sad-label"><Zap size={10} strokeWidth={2.5} />{label}</span>}
      <h2 className="sad-section-title">{title}</h2>
      {sub && <p className="sad-section-sub">{sub}</p>}
    </div>
    {viewTo && (
      <Link to={viewTo} className="sad-view-all">
        {viewLabel} <ArrowRight size={14} strokeWidth={2.5} />
      </Link>
    )}
  </div>
);

const statusBadge = (status) => {
  if (status === "Approved") return <span className="sad-badge sad-badge-green"><CheckCircle size={11} strokeWidth={2.5} />Approved</span>;
  if (status === "Pending")  return <span className="sad-badge sad-badge-yellow"><Clock size={11} strokeWidth={2.5} />Pending</span>;
  if (status === "Sent")     return <span className="sad-badge sad-badge-blue"><Megaphone size={11} strokeWidth={2.5} />Sent</span>;
  return <span className="sad-badge sad-badge-gray">{status}</span>;
};

/* ─── Quick action definitions ────────────────────────── */
const QUICK_ACTIONS = [
  { title: "Create Event",     desc: "Add a new school event and submit for approval.",  to: "/school-admin/events/create",   icon: PlusCircle,  iconBg: "#eff6ff",  iconColor: "#2563eb" },
  { title: "Post Announcement",desc: "Send updates to classes or selected schools.",      to: "/school-admin/announcements",   icon: Megaphone,   iconBg: "#fdf2f8",  iconColor: "#db2777" },
  { title: "Manage Tickets",   desc: "Create tickets and monitor ticket sales.",          to: "/school-admin/tickets",         icon: Ticket,      iconBg: "#f5f3ff",  iconColor: "#7c3aed" },
  { title: "View Reports",     desc: "Check sales, donation, and engagement reports.",    to: "/school-admin/reports",         icon: BarChart2,   iconBg: "#ecfdf5",  iconColor: "#059669" },
];

/* ═══════════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════════ */
const SchoolAdminDashboard = () => {
  const navigate = useNavigate();
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  );

  useEffect(() => {
    fetchStats();
    const id = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    }, 60000);
    return () => clearInterval(id);
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await ApiSchool.getDashboardStats();
      setData(res.data);
      setError(null);
    } catch {
      setError("Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Loading ── */
  if (loading) return (
    <div className="sad">
      <style>{styles}</style>
      <div className="sad-loading">
        <div className="sad-spinner" />
        <p className="sad-loading-text">Loading your dashboard…</p>
      </div>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div className="sad">
      <style>{styles}</style>
      <div className="sad-error">
        <p className="sad-error-text">{error}</p>
        <button className="sad-retry-btn" onClick={fetchStats}>
          <RefreshCw size={14} strokeWidth={2.5} /> Retry
        </button>
      </div>
    </div>
  );

  const { stats: bs, recentEvents, recentAnnouncements, approvalSummary, performance } = data;

  const STATS = [
    { label: "Total Events",       value: bs.totalEvents,                                icon: CalendarDays, color: "#2563eb", bg: "#eff6ff",  note: "Active events" },
    { label: "Tickets Sold",       value: bs.ticketsSold,                                icon: Ticket,       color: "#059669", bg: "#ecfdf5",  note: "Total sold" },
    { label: "Donations Raised",   value: `LKR ${bs.donationsReceived.toLocaleString()}`,icon: Heart,        color: "#db2777", bg: "#fdf2f8",  note: "Total raised" },
    { label: "Pending Approvals",  value: bs.pendingApprovals,                           icon: Clock,        color: "#d97706", bg: "#fffbeb",  note: "Needs review" },
  ];

  return (
    <div className="sad">
      <style>{styles}</style>

      {/* ═══ HERO ═══ */}
      <div className="sad-hero">
        {/* decorations */}
        <div className="sad-hero-deco" style={{ top:-80,right:-80,width:320,height:320,background:"rgba(255,255,255,0.06)" }} />
        <div className="sad-hero-deco" style={{ bottom:-60,left:-60,width:240,height:240,background:"rgba(255,255,255,0.04)" }} />

        <div style={{ position:"relative", zIndex:1 }}>
          <div className="sad-hero-greeting">
            <span>👋</span> {greetingText()}, Administrator
            <span style={{ opacity:0.6, fontWeight:500, letterSpacing:"normal", textTransform:"none" }}>· {currentTime}</span>
          </div>
          <h1 className="sad-hero-title">Welcome to Your Dashboard</h1>
          <p className="sad-hero-sub">
            Manage events, announcements, donations, and tickets from one place.
            Track approvals and monitor your school's performance in real time.
          </p>
          <div className="sad-hero-actions">
            <Link to="/school-admin/events/create" className="sad-hero-btn-primary">
              <PlusCircle size={15} strokeWidth={2.5} /> Create Event
            </Link>
            <Link to="/school-admin/announcements" className="sad-hero-btn-outline">
              <Megaphone size={15} strokeWidth={2.5} /> New Announcement
            </Link>
          </div>

          {/* Stats strip */}
          <div className="sad-hero-stats">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div className="sad-hero-stat" key={label}>
                <div className="sad-hero-stat-label">
                  <Icon size={13} strokeWidth={2} color="rgba(255,255,255,0.55)" />
                  {label}
                </div>
                <div className="sad-hero-stat-value">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ QUICK ACTIONS ═══ */}
      <section>
        <SectionHead label="Shortcuts" title="Quick Actions" sub="Jump straight to the most common tasks" />
        <div className="sad-actions-grid">
          {QUICK_ACTIONS.map(({ title, desc, to, icon: Icon, iconBg, iconColor }) => (
            <Link key={to} to={to} className="sad-action-card">
              <div className="sad-action-icon" style={{ background: iconBg, color: iconColor }}>
                <Icon size={20} strokeWidth={2} />
              </div>
              <p className="sad-action-title">{title}</p>
              <p className="sad-action-desc">{desc}</p>
              <span className="sad-action-arrow">
                Go <ArrowRight size={13} strokeWidth={2.5} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ EVENTS + APPROVALS ═══ */}
      <div className="sad-grid-2-1">

        {/* Recent Events */}
        <div className="sad-card" style={{ padding:"24px" }}>
          <SectionHead label="Latest" title="Recent Events" sub="Latest event posts and approval status" viewTo="/school-admin/events" />
          <div style={{ overflowX:"auto" }}>
            <table className="sad-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Tickets</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.length === 0 && (
                  <tr><td colSpan="5" className="sad-empty">No recent events found.</td></tr>
                )}
                {recentEvents.map((ev) => {
                  const total    = ev.ticketTypes?.reduce((s,t) => s + t.totalQuantity, 0) || 0;
                  const avail    = ev.ticketTypes?.reduce((s,t) => s + t.availableQuantity, 0) || 0;
                  const sold     = total - avail;
                  const pct      = total > 0 ? (sold / total) * 100 : 0;
                  const approved = ev.isApproved;
                  return (
                    <tr key={ev.id} onClick={() => navigate(`/school-admin/events/${ev.id}`)}>
                      <td>
                        <div className="sad-table-name">{ev.title}</div>
                        <div className="sad-table-sub">{ev.time}</div>
                      </td>
                      <td style={{ color:"#6b7280", fontWeight:500 }}>{ev.category}</td>
                      <td style={{ whiteSpace:"nowrap" }}>{formatDate(ev.date)}</td>
                      <td>
                        <div className="sad-progress-wrap">
                          <div className="sad-progress-labels">
                            <span className="sad-progress-sold">{sold}</span>
                            <span className="sad-progress-total">/{total}</span>
                          </div>
                          <div className="sad-progress-track">
                            <div className={`sad-progress-fill ${pct > 85 ? "danger" : ""}`} style={{ width:`${pct}%` }} />
                          </div>
                        </div>
                      </td>
                      <td>{statusBadge(approved ? "Approved" : "Pending")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Approval summary */}
        <div className="sad-card" style={{ padding:"24px" }}>
          <SectionHead label="Review" title="Approvals" sub="Items awaiting review" />

          {[
            { label:"Pending Events",       count: approvalSummary.pendingEvents,    bg:"#eff6ff", track:"#bfdbfe", fill:"#2563eb", textColor:"#1d4ed8", icon: CalendarDays },
            { label:"Pending Donations",    count: approvalSummary.pendingDonations, bg:"#fffbeb", track:"#fde68a", fill:"#d97706", textColor:"#b45309", icon: Heart },
            { label:"Pending Announcements",count: 1,                                bg:"#f5f3ff", track:"#ddd6fe", fill:"#7c3aed", textColor:"#6d28d9", icon: Megaphone },
          ].map(({ label, count, bg, track, fill, textColor, icon: Icon }) => (
            <div key={label} className="sad-approval-item" style={{ background: bg }}>
              <div className="sad-approval-row">
                <span className="sad-approval-label" style={{ color: textColor }}>
                  <Icon size={14} strokeWidth={2} />{label}
                </span>
                <span className="sad-approval-count" style={{ color: textColor }}>{count}</span>
              </div>
              <div className="sad-approval-track" style={{ background: track }}>
                <div className="sad-approval-fill" style={{ width:`${Math.min(100,(count/10)*100)}%`, background: fill }} />
              </div>
            </div>
          ))}

          <Link to="/school-admin/events?status=pending" className="sad-cta-btn sad-cta-primary">
            <CheckCircle size={15} strokeWidth={2.5} /> Review Pending Items
          </Link>
        </div>
      </div>

      {/* ═══ ANNOUNCEMENTS + PERFORMANCE ═══ */}
      <div className="sad-grid-2-1">

        {/* Announcements */}
        <div className="sad-card" style={{ padding:"24px" }}>
          <SectionHead label="Communications" title="Recent Announcements" sub="Track internal communication and engagement" viewTo="/school-admin/announcements" viewLabel="Manage all" />
          {recentAnnouncements.length === 0 && <p className="sad-empty">No recent announcements.</p>}
          {recentAnnouncements.map((item) => (
            <div key={item.id} className="sad-announce-item" onClick={() => navigate(`/school-admin/announcements/${item.id}`)}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
                <div style={{ flex:1 }}>
                  <p className="sad-announce-title">{item.title}</p>
                  <p className="sad-announce-meta">
                    Audience: {item.targetSchools?.includes("Community") ? "Community" : "School"} · {formatDate(item.createdAt)}
                  </p>
                </div>
                {statusBadge("Sent")}
              </div>
            </div>
          ))}
        </div>

        {/* Performance */}
        <div className="sad-card" style={{ padding:"24px" }}>
          <SectionHead label="Insights" title="Performance" sub="Key metrics at a glance" />

          {[
            { label:"Event Engagement",    value:"Optimal", pct:85, fill:"var(--color-primary,#4f46e5)", icon: Eye,      note:"" },
            { label:"Ticket Conversion",   value:`${performance.ticketConversionRate}%`, pct:performance.ticketConversionRate, fill:"#059669", icon: Ticket,   note:`${bs.ticketsSold} tickets sold across all events` },
            { label:"Donation Goal",       value:`${performance.donationGoalPercentage}%`, pct:performance.donationGoalPercentage, fill:"#db2777", icon: Heart,    note:`LKR ${bs.donationsReceived.toLocaleString()} raised to date` },
          ].map(({ label, value, pct, fill, icon: Icon, note }) => (
            <div key={label} className="sad-perf-item">
              <div className="sad-perf-row">
                <div className="sad-perf-label-group">
                  <span className="sad-perf-icon" style={{ color: fill, background:`${fill}18` }}>
                    <Icon size={15} strokeWidth={2} />
                  </span>
                  <span className="sad-perf-label">{label}</span>
                </div>
                <span className="sad-perf-value">{value}</span>
              </div>
              <div className="sad-perf-track">
                <div className="sad-perf-fill" style={{ width:`${pct}%`, background: fill }} />
              </div>
              {note && <p className="sad-perf-note">{note}</p>}
            </div>
          ))}

          <Link to="/school-admin/reports" className="sad-cta-btn sad-cta-soft">
            <BarChart2 size={15} strokeWidth={2.5} /> View Detailed Reports
          </Link>
        </div>
      </div>

      {/* ═══ RECENT ACTIVITY ═══ */}
      <div className="sad-card" style={{ padding:"24px" }}>
        <SectionHead label="Timeline" title="Recent Activity" sub="Latest updates across your school account" />
        <div className="sad-timeline">
          {[
            { icon: CheckCircle, bg:"#ecfdf5", color:"#059669", text:'Event "Annual Sports Meet" was approved', time:"2 hours ago" },
            { icon: Ticket,      bg:"#eff6ff", color:"#2563eb", text:'324 tickets sold for "Annual Sports Meet"',                    time:"Yesterday" },
            { icon: Heart,       bg:"#fdf2f8", color:"#db2777", text:'New donation received for "Library Development Fund"',          time:"2 days ago" },
            { icon: Megaphone,   bg:"#fffbeb", color:"#d97706", text:'Announcement "Big Match Tickets Now Available" sent to 1,250 students', time:"3 days ago" },
          ].map(({ icon: Icon, bg, color, text, time }, i) => (
            <div key={i} className="sad-timeline-item">
              <div className="sad-timeline-dot" style={{ background: bg, color }}>
                <Icon size={16} strokeWidth={2.2} />
              </div>
              <div>
                <p className="sad-timeline-text">{text}</p>
                <p className="sad-timeline-time">{time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SchoolAdminDashboard;