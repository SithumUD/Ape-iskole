import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ApiAdmin from "../../services/ApiAdmin";
import {
  School, Clock, Zap, TrendingUp, CheckCircle, AlertCircle,
  ArrowRight, BarChart2, Megaphone, RefreshCw, Star, Eye,
  Heart, Building2, Globe, Settings, ShieldCheck, Activity,
  Users, Landmark, Newspaper,
} from "lucide-react";

/* ─── static data ─────────────────────────────────────── */
const QUICK_ACTIONS = [
  { title: "Approve Content",     desc: "Review pending events, donations, and school registrations.", to: "/super-admin/approvals", color: "#2563eb", bg: "#eff6ff",  icon: CheckCircle },
  { title: "Manage Schools",      desc: "Approve new schools and manage registered institutions.",      to: "/super-admin/schools",   color: "#059669", bg: "#ecfdf5",  icon: School      },
  { title: "Ads Manager",         desc: "Create and manage ad placements across the platform.",         to: "/super-admin/ads",       color: "#7c3aed", bg: "#f5f3ff",  icon: Megaphone   },
  { title: "Platform Settings",   desc: "Control platform-wide configuration and feature settings.",   to: "/super-admin/settings",  color: "#d97706", bg: "#fffbeb",  icon: Settings    },
];

const ADS = [
  { id: 1, name: "Top Banner - Home",    placement: "Homepage",       status: "Active" },
  { id: 2, name: "Sidebar Ad - Events",  placement: "Events Page",    status: "Active" },
  { id: 3, name: "Inline Promo Banner",  placement: "School Details", status: "Draft"  },
];

const HEALTH = [
  { label: "Success Score",   value: "Healthy", pct: 100, color: "#059669" },
  { label: "Content Flow",    value: "Active",   pct: 85,  color: "#2563eb" },
  { label: "Server Response", value: "Optimal",  pct: 98,  color: "#7c3aed" },
];

/* ─── styles ──────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  .sa*{box-sizing:border-box}
  .sa{font-family:'Plus Jakarta Sans',sans-serif;display:flex;flex-direction:column;gap:28px;animation:fadeUp .5s ease both}

  /* hero */
  .sa-hero{border-radius:24px;overflow:hidden;position:relative;background:linear-gradient(135deg,#1e1b4b 0%,var(--color-primary,#4f46e5) 45%,var(--color-secondary,#7c3aed) 100%);padding:44px 48px;color:#fff}
  .sa-hero-deco{position:absolute;border-radius:50%;pointer-events:none}
  .sa-hero-label{display:inline-flex;align-items:center;gap:6px;margin-bottom:14px;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#c7d2fe;background:rgba(255,255,255,.12);padding:4px 13px;border-radius:50px}
  .sa-hero-title{font-size:clamp(24px,3vw,36px);font-weight:900;letter-spacing:-.6px;line-height:1.18;margin:0 0 12px}
  .sa-hero-sub{font-size:14.5px;color:rgba(255,255,255,.74);line-height:1.75;margin:0 0 28px;max-width:520px;font-weight:400}
  .sa-hero-actions{display:flex;flex-wrap:wrap;gap:10px}
  .sa-hero-btn-primary{display:flex;align-items:center;gap:6px;padding:11px 22px;border-radius:50px;border:none;background:#fff;color:var(--color-primary,#4f46e5);font-weight:800;font-size:13px;cursor:pointer;font-family:inherit;box-shadow:0 4px 16px rgba(0,0,0,.18);transition:all .2s;text-decoration:none}
  .sa-hero-btn-primary:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,0,0,.22)}
  .sa-hero-btn-outline{display:flex;align-items:center;gap:6px;padding:11px 20px;border-radius:50px;border:2px solid rgba(255,255,255,.3);background:transparent;color:#fff;font-weight:700;font-size:13px;cursor:pointer;font-family:inherit;transition:background .2s;text-decoration:none}
  .sa-hero-btn-outline:hover{background:rgba(255,255,255,.1)}

  /* stats strip */
  .sa-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:14px}
  .sa-stat{background:#fff;border-radius:18px;border:1px solid #f0f0f0;padding:20px 18px;display:flex;align-items:center;gap:14px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .sa-stat-icon{width:48px;height:48px;border-radius:14px;flex-shrink:0;display:flex;align-items:center;justify-content:center}
  .sa-stat-label{font-size:11.5px;font-weight:600;color:#9ca3af;margin:0 0 4px}
  .sa-stat-value{font-size:24px;font-weight:900;letter-spacing:-.6px;margin:0;color:#0f0f0f}
  .sa-stat-note{font-size:11.5px;color:#c4c4c4;font-weight:500;margin:3px 0 0}

  /* section head */
  .sa-section-head{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:18px}
  .sa-section-label{display:inline-flex;align-items:center;gap:5px;font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--color-primary,#4f46e5);background:color-mix(in srgb,var(--color-primary,#4f46e5) 9%,transparent);padding:3px 9px;border-radius:50px;margin-bottom:6px}
  .sa-section-title{font-size:18px;font-weight:800;color:#0f0f0f;letter-spacing:-.3px;margin:0}
  .sa-section-sub{font-size:12.5px;color:#9ca3af;font-weight:500;margin-top:3px}
  .sa-view-all{display:flex;align-items:center;gap:4px;font-size:12.5px;font-weight:700;color:var(--color-primary,#4f46e5);text-decoration:none;white-space:nowrap;transition:gap .18s}
  .sa-view-all:hover{gap:7px}

  /* quick action cards */
  .sa-actions-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:14px}
  .sa-action-card{background:#fff;border-radius:18px;border:1px solid #f0f0f0;padding:22px 20px;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,.04);transition:all .22s;text-decoration:none;display:block}
  .sa-action-card:hover{transform:translateY(-3px);box-shadow:0 10px 28px rgba(0,0,0,.09);border-color:color-mix(in srgb,var(--color-primary,#4f46e5) 20%,transparent)}
  .sa-action-icon{width:44px;height:44px;border-radius:14px;margin-bottom:14px;display:flex;align-items:center;justify-content:center;transition:all .22s}
  .sa-action-card:hover .sa-action-icon{background:color-mix(in srgb,var(--color-primary,#4f46e5) 12%,transparent)!important;color:var(--color-primary,#4f46e5)!important}
  .sa-action-title{font-size:14px;font-weight:800;color:#0f0f0f;margin:0 0 5px}
  .sa-action-desc{font-size:12px;color:#9ca3af;line-height:1.6;margin:0 0 14px}
  .sa-action-arrow{display:flex;align-items:center;gap:4px;font-size:12px;font-weight:700;color:var(--color-primary,#4f46e5);transition:gap .18s}
  .sa-action-card:hover .sa-action-arrow{gap:7px}

  /* two-col layout */
  .sa-grid-2-1{display:grid;grid-template-columns:1fr;gap:20px}
  @media(min-width:1024px){.sa-grid-2-1{grid-template-columns:2fr 1fr}}
  .sa-grid-2{display:grid;grid-template-columns:1fr;gap:20px}
  @media(min-width:1024px){.sa-grid-2{grid-template-columns:1fr 1fr}}
  .sa-grid-3-1{display:grid;grid-template-columns:1fr;gap:20px}
  @media(min-width:1024px){.sa-grid-3-1{grid-template-columns:2fr 1fr}}

  /* card */
  .sa-card{background:#fff;border-radius:20px;border:1px solid #f0f0f0;padding:24px;box-shadow:0 1px 4px rgba(0,0,0,.04)}

  /* table */
  .sa-table{width:100%;border-collapse:collapse}
  .sa-table thead{background:#fafafa}
  .sa-table th{padding:11px 14px;text-align:left;font-size:10.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#9ca3af;border-bottom:1px solid #f0f0f0}
  .sa-table td{padding:13px 14px;font-size:13px;color:#374151;border-bottom:1px solid #f7f7f8}
  .sa-table tbody tr{transition:background .15s;cursor:default}
  .sa-table tbody tr:hover{background:#fafafa}
  .sa-table tbody tr:last-child td{border-bottom:none}
  .sa-table-name{font-size:13.5px;font-weight:700;color:#0f0f0f}
  .sa-table-sub{font-size:11.5px;color:#9ca3af;margin-top:2px}

  /* badges */
  .sa-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:50px;font-size:11px;font-weight:700;white-space:nowrap}
  .sa-bg-green {color:#065f46;background:#d1fae5}
  .sa-bg-yellow{color:#92400e;background:#fef3c7}
  .sa-bg-red   {color:#991b1b;background:#fee2e2}
  .sa-bg-blue  {color:#1e40af;background:#dbeafe}
  .sa-bg-gray  {color:#4b5563;background:#f3f4f6}
  .sa-bg-purple{color:#5b21b6;background:#ede9fe}
  .sa-bg-orange{color:#9a3412;background:#ffedd5}

  /* summary cells */
  .sa-summary-item{background:#fafafa;border-radius:14px;padding:16px;border:1px solid #f0f0f0;margin-bottom:12px}
  .sa-summary-item:last-child{margin-bottom:0}
  .sa-summary-label{font-size:12.5px;font-weight:600;color:#6b7280;margin:0 0 4px}
  .sa-summary-value{font-size:24px;font-weight:900;letter-spacing:-.5px;color:#0f0f0f;margin:0}

  /* story bar */
  .sa-story-item{border-radius:14px;padding:16px;margin-bottom:12px;background:#fafafa;border:1px solid #f0f0f0;transition:box-shadow .2s}
  .sa-story-item:hover{box-shadow:0 4px 14px rgba(0,0,0,.07)}
  .sa-story-item:last-child{margin-bottom:0}
  .sa-story-name{font-size:13.5px;font-weight:700;color:#0f0f0f;margin:0 0 3px}
  .sa-story-meta{font-size:11.5px;color:#9ca3af;margin:0 0 10px}
  .sa-progress-track{height:5px;border-radius:50px;background:#f3f4f6;overflow:hidden}
  .sa-progress-fill{height:100%;border-radius:50px;background:linear-gradient(90deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));transition:width .6s}

  /* health bar */
  .sa-health-item{background:#fafafa;border-radius:13px;padding:14px;margin-bottom:10px;border:1px solid #f0f0f0}
  .sa-health-item:last-child{margin-bottom:0}
  .sa-health-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
  .sa-health-label{font-size:12.5px;font-weight:600;color:#4b5563}
  .sa-health-value{font-size:13px;font-weight:800;color:#0f0f0f}

  /* ad items */
  .sa-ad-item{border-radius:14px;padding:16px;margin-bottom:10px;background:#fafafa;border:1px solid #f0f0f0}
  .sa-ad-item:last-child{margin-bottom:0}
  .sa-ad-name{font-size:13.5px;font-weight:700;color:#0f0f0f;margin:0 0 3px}
  .sa-ad-meta{font-size:12px;color:#9ca3af;margin:0}

  /* spinner */
  .sa-spin{width:44px;height:44px;border-radius:50%;border:3px solid #f0f0f0;border-top-color:var(--color-primary,#4f46e5);animation:spin .75s linear infinite}

  /* open settings link */
  .sa-open-link{display:flex;align-items:center;justify-content:center;gap:7px;width:100%;padding:12px;border-radius:13px;border:none;margin-top:16px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;text-decoration:none;transition:all .18s}
  .sa-open-primary{background:linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));color:#fff;box-shadow:0 4px 14px color-mix(in srgb,var(--color-primary,#4f46e5) 28%,transparent)}
  .sa-open-primary:hover{opacity:.9;transform:translateY(-1px)}
  .sa-open-soft{background:color-mix(in srgb,var(--color-primary,#4f46e5) 7%,transparent);color:var(--color-primary,#4f46e5);border:1.5px solid color-mix(in srgb,var(--color-primary,#4f46e5) 18%,transparent)}
  .sa-open-soft:hover{background:color-mix(in srgb,var(--color-primary,#4f46e5) 12%,transparent)}
`;

/* ─── helpers ─────────────────────────────────────────── */
const SectionHead = ({ label, title, sub, viewTo, viewLabel = "View all" }) => (
  <div className="sa-section-head">
    <div>
      {label && <span className="sa-section-label"><Zap size={10} strokeWidth={2.5}/>{label}</span>}
      <h2 className="sa-section-title">{title}</h2>
      {sub && <p className="sa-section-sub">{sub}</p>}
    </div>
    {viewTo && (
      <Link to={viewTo} className="sa-view-all">
        {viewLabel} <ArrowRight size={14} strokeWidth={2.5}/>
      </Link>
    )}
  </div>
);

const StatusBadge = ({ status }) => {
  if (status === "Approved" || status === "Active")
    return <span className="sa-badge sa-bg-green"><CheckCircle size={11} strokeWidth={2.5}/>{status}</span>;
  if (status === "Pending")
    return <span className="sa-badge sa-bg-yellow"><Clock size={11} strokeWidth={2.5}/>Pending</span>;
  if (status === "Rejected")
    return <span className="sa-badge sa-bg-red"><AlertCircle size={11} strokeWidth={2.5}/>Rejected</span>;
  if (status === "Draft")
    return <span className="sa-badge sa-bg-gray">Draft</span>;
  return <span className="sa-badge sa-bg-gray">{status}</span>;
};

/* ═══════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════ */
const SuperAdminDashboard = () => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await ApiAdmin.getDashboardStats();
      setData(res.data);
      setError(null);
    } catch {
      setError("Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  /* ── Loading ── */
  if (loading) return (
    <div className="sa">
      <style>{styles}</style>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 320, gap: 14 }}>
        <div className="sa-spin"/>
        <p style={{ fontSize: 13, color: "#9ca3af", fontWeight: 600, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Loading platform data…</p>
      </div>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div className="sa">
      <style>{styles}</style>
      <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 18, padding: "40px 24px", textAlign: "center" }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <AlertCircle size={22} color="#ef4444" strokeWidth={2}/>
        </div>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#dc2626", margin: "0 0 14px" }}>{error}</p>
        <button onClick={fetchStats} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "10px 22px", borderRadius: 50, border: "none",
          background: "#ef4444", color: "#fff", fontWeight: 700, fontSize: 13,
          cursor: "pointer", fontFamily: "inherit",
        }}>
          <RefreshCw size={14} strokeWidth={2.5}/> Retry
        </button>
      </div>
    </div>
  );

  const { overall, schoolSummary, pendingQueue, recentSchools, topStories } = data;
  const maxViews = Math.max(...(topStories?.map(s => s.views) || [1]), 1);

  const STATS = [
    { label: "Total Schools",      value: overall.totalSchools,                             note: "All registered",   icon: School,      bg: "#eff6ff", color: "#2563eb" },
    { label: "Pending Approvals",  value: overall.pendingApprovals,                         note: "Items to review",  icon: Clock,       bg: "#fffbeb", color: "#d97706" },
    { label: "Active Content",     value: overall.activeContent,                            note: "Events & Donations",icon: Activity,   bg: "#f5f3ff", color: "#7c3aed" },
    { label: "Platform Impact",    value: `LKR ${overall.totalRevenue.toLocaleString()}`,   note: "Total Raised",     icon: TrendingUp,  bg: "#ecfdf5", color: "#059669" },
  ];

  return (
    <div className="sa">
      <style>{styles}</style>

      {/* ═══ HERO ═══ */}
      <div className="sa-hero">
        <div className="sa-hero-deco" style={{ top: -80, right: -80, width: 320, height: 320, background: "rgba(255,255,255,0.06)" }}/>
        <div className="sa-hero-deco" style={{ bottom: -60, left: -60, width: 240, height: 240, background: "rgba(255,255,255,0.04)" }}/>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="sa-hero-label"><Zap size={11} strokeWidth={2.5}/>Platform Overview</div>
          <h1 className="sa-hero-title">Welcome back, Super Admin</h1>
          <p className="sa-hero-sub">
            Monitor school registrations, control public content, manage ads, approvals, and platform performance from one place.
          </p>
          <div className="sa-hero-actions">
            <Link to="/super-admin/approvals" className="sa-hero-btn-primary">
              <CheckCircle size={15} strokeWidth={2.5}/> Review Approvals
            </Link>
            <Link to="/super-admin/schools" className="sa-hero-btn-outline">
              <School size={15} strokeWidth={2.5}/> Manage Schools
            </Link>
          </div>
        </div>
      </div>

      {/* ═══ STATS ═══ */}
      <div className="sa-stats">
        {STATS.map(({ label, value, note, icon: Icon, bg, color }) => (
          <div key={label} className="sa-stat">
            <div className="sa-stat-icon" style={{ background: bg, color }}>
              <Icon size={22} strokeWidth={2}/>
            </div>
            <div>
              <p className="sa-stat-label">{label}</p>
              <p className="sa-stat-value">{value}</p>
              <p className="sa-stat-note">{note}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ QUICK ACTIONS ═══ */}
      <section>
        <SectionHead label="Shortcuts" title="Quick Actions" sub="Jump into the most important platform administration tasks." />
        <div className="sa-actions-grid">
          {QUICK_ACTIONS.map(({ title, desc, to, icon: Icon, bg, color }) => (
            <Link key={to} to={to} className="sa-action-card">
              <div className="sa-action-icon" style={{ background: bg, color }}>
                <Icon size={20} strokeWidth={2}/>
              </div>
              <p className="sa-action-title">{title}</p>
              <p className="sa-action-desc">{desc}</p>
              <span className="sa-action-arrow">Open <ArrowRight size={13} strokeWidth={2.5}/></span>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ PENDING QUEUE + SCHOOL SUMMARY ═══ */}
      <div className="sa-grid-2-1">

        {/* Pending queue table */}
        <div className="sa-card">
          <SectionHead label="Review" title="Pending Approval Queue" sub="Items waiting for review before publishing." viewTo="/super-admin/approvals" />
          <div style={{ overflowX: "auto" }}>
            <table className="sa-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>School</th>
                  <th>Type</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {pendingQueue.length === 0 && (
                  <tr><td colSpan="4" style={{ textAlign: "center", padding: "24px", color: "#9ca3af", fontSize: 13, fontStyle: "italic" }}>No pending items to review</td></tr>
                )}
                {pendingQueue.map(item => (
                  <tr key={item.id}>
                    <td>
                      <p className="sa-table-name">{item.title}</p>
                      <p className="sa-table-sub">{item.type}</p>
                    </td>
                    <td style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>{item.school}</td>
                    <td>
                      <span className="sa-badge sa-bg-blue">{item.type}</span>
                    </td>
                    <td>
                      <span className={`sa-badge ${item.priority === "high" ? "sa-bg-red" : "sa-bg-gray"}`}>
                        {item.priority === "high" ? <AlertCircle size={10} strokeWidth={2.5}/> : null}
                        {item.priority || "Normal"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* School summary */}
        <div className="sa-card">
          <SectionHead label="Overview" title="School Summary" />
          {[
            { label: "Approved Schools",       value: schoolSummary.approved, color: "#059669", bg: "#ecfdf5", icon: CheckCircle },
            { label: "Pending Registrations",  value: schoolSummary.pending,  color: "#d97706", bg: "#fffbeb", icon: Clock       },
            { label: "Rejected Requests",      value: schoolSummary.rejected, color: "#ef4444", bg: "#fef2f2", icon: AlertCircle },
          ].map(({ label, value, color, bg, icon: Icon }) => (
            <div key={label} className="sa-summary-item">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 9, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={13} color={color} strokeWidth={2.2}/>
                  </div>
                  <p className="sa-summary-label" style={{ margin: 0 }}>{label}</p>
                </div>
                <p className="sa-summary-value" style={{ color }}>{value}</p>
              </div>
            </div>
          ))}
          <Link to="/super-admin/schools" className="sa-open-link sa-open-primary">
            <School size={15} strokeWidth={2.5}/> Open School Management
          </Link>
        </div>
      </div>

      {/* ═══ RECENT SCHOOLS + ADS ═══ */}
      <div className="sa-grid-2">

        {/* Recent schools */}
        <div className="sa-card">
          <SectionHead label="Latest" title="Recent Schools" sub="Latest school registrations and approval state." />
          <div style={{ overflowX: "auto" }}>
            <table className="sa-table">
              <thead>
                <tr>
                  <th>School</th>
                  <th>City</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentSchools.map(school => (
                  <tr key={school.id}>
                    <td>
                      <p className="sa-table-name">{school.name}</p>
                    </td>
                    <td style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>{school.contact?.city || "—"}</td>
                    <td style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>{school.type}</td>
                    <td><StatusBadge status={school.isApproved ? "Approved" : "Pending"}/></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ads */}
        <div className="sa-card">
          <SectionHead label="Advertising" title="Advertisement Overview" sub="Monitor current ad placements." viewTo="/super-admin/ads" viewLabel="Manage Ads" />
          {ADS.map(ad => (
            <div key={ad.id} className="sa-ad-item">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <p className="sa-ad-name">{ad.name}</p>
                  <p className="sa-ad-meta">{ad.placement}</p>
                </div>
                <StatusBadge status={ad.status}/>
              </div>
            </div>
          ))}
          <Link to="/super-admin/ads" className="sa-open-link sa-open-soft" style={{ marginTop: 12 }}>
            <Megaphone size={14} strokeWidth={2.5}/> Manage All Ads
          </Link>
        </div>
      </div>

      {/* ═══ TOP STORIES + PLATFORM HEALTH ═══ */}
      <div className="sa-grid-3-1">

        {/* Top stories */}
        <div className="sa-card">
          <SectionHead label="Engagement" title="Top Stories Performance" sub="Highest viewed stories on the platform." />
          {topStories.length === 0 && (
            <p style={{ textAlign: "center", padding: "32px 0", color: "#9ca3af", fontSize: 13, fontStyle: "italic" }}>No featured stories yet.</p>
          )}
          {topStories.map(story => (
            <div key={story.id} className="sa-story-item">
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <p className="sa-story-name">{story.title}</p>
                  <p className="sa-story-meta">{story.schoolName || story.category}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <span className="sa-badge sa-bg-blue"><Eye size={11} strokeWidth={2}/>{story.views.toLocaleString()} views</span>
                  <p style={{ fontSize: 11.5, color: "#9ca3af", fontWeight: 500, marginTop: 4, display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                    <Heart size={11} strokeWidth={2}/>{story.likes} likes
                  </p>
                </div>
              </div>
              <div className="sa-progress-track">
                <div className="sa-progress-fill" style={{ width: `${Math.round((story.views / maxViews) * 100)}%` }}/>
              </div>
            </div>
          ))}
        </div>

        {/* Platform health */}
        <div className="sa-card">
          <SectionHead label="System" title="Platform Health" />
          {HEALTH.map(({ label, value, pct, color }) => (
            <div key={label} className="sa-health-item">
              <div className="sa-health-row">
                <span className="sa-health-label">{label}</span>
                <span className="sa-health-value">{value}</span>
              </div>
              <div className="sa-progress-track">
                <div style={{ height: "100%", borderRadius: 50, background: color, width: `${pct}%`, transition: "width .6s" }}/>
              </div>
            </div>
          ))}
          <Link to="/super-admin/settings" className="sa-open-link sa-open-soft">
            <Settings size={14} strokeWidth={2.5}/> Open Platform Settings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;