import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiSchool from "../../services/ApiSchool";
import ApiAdmin from "../../services/ApiAdmin";
import {
  School, CheckCircle, X, Clock, AlertCircle, RefreshCw,
  Search, FileText, CalendarDays, Heart, Megaphone,
  Newspaper, MapPin, Phone, Mail, Users, GraduationCap,
  Zap, Star, ChevronRight, Save, Loader2, ShieldCheck,
} from "lucide-react";

/* ─── styles ──────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  .apr*{box-sizing:border-box}
  .apr{font-family:'Plus Jakarta Sans',sans-serif;display:flex;flex-direction:column;gap:24px;animation:fadeUp .45s ease both}

  /* head */
  .apr-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap}
  .apr-title{font-size:22px;font-weight:900;color:#0f0f0f;letter-spacing:-.4px;margin:0 0 4px}
  .apr-sub{font-size:13px;color:#9ca3af;font-weight:500;margin:0}
  .apr-refresh{display:flex;align-items:center;gap:7px;padding:10px 18px;border-radius:50px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:700;color:#374151;cursor:pointer;font-family:inherit;transition:all .18s;white-space:nowrap}
  .apr-refresh:hover{background:#f7f7f8;border-color:#d1d5db}

  /* tabs */
  .apr-tabs{background:#fff;border-radius:16px;border:1px solid #f0f0f0;padding:6px;display:flex;flex-wrap:wrap;gap:4px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .apr-tab{display:flex;align-items:center;gap:6px;padding:9px 16px;border-radius:11px;border:none;background:transparent;font-size:12.5px;font-weight:700;color:#6b7280;cursor:pointer;font-family:inherit;transition:all .18s;white-space:nowrap}
  .apr-tab:hover{background:#f7f7f8;color:#111}
  .apr-tab.active{background:linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));color:#fff;box-shadow:0 3px 10px color-mix(in srgb,var(--color-primary,#4f46e5) 28%,transparent)}

  /* search bar */
  .apr-search-wrap{position:relative}
  .apr-search-wrap .apr-search-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#9ca3af;pointer-events:none}
  .apr-search{width:100%;height:44px;padding:0 14px 0 42px;border-radius:14px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:500;color:#111;font-family:inherit;transition:border-color .18s;outline:none}
  .apr-search:focus{border-color:var(--color-primary,#4f46e5)}

  /* grid */
  .apr-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}

  /* item card */
  .apr-item{background:#fff;border-radius:20px;border:1px solid #f0f0f0;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,.04);display:flex;flex-direction:column;transition:all .22s}
  .apr-item:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,0,0,.08)}
  .apr-item-meta{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
  .apr-item-date{font-size:11px;color:#9ca3af;font-weight:500}
  .apr-item-name{font-size:15.5px;font-weight:800;color:#0f0f0f;margin:0 0 5px;line-height:1.35}
  .apr-item-sub{font-size:12.5px;color:#9ca3af;margin:0 0 14px;font-weight:500}
  .apr-item-footer{margin-top:auto;padding-top:14px;border-top:1px solid #f3f4f6}
  .apr-review-btn{width:100%;padding:11px;border-radius:12px;border:none;background:linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 4px 12px color-mix(in srgb,var(--color-primary,#4f46e5) 28%,transparent);transition:all .2s}
  .apr-review-btn:hover{opacity:.9;transform:translateY(-1px)}

  /* badges */
  .apr-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:50px;font-size:11px;font-weight:700;white-space:nowrap}
  .apr-bg-green {color:#065f46;background:#d1fae5}
  .apr-bg-yellow{color:#92400e;background:#fef3c7}
  .apr-bg-red   {color:#991b1b;background:#fee2e2}
  .apr-bg-blue  {color:#1e40af;background:#dbeafe}
  .apr-bg-gray  {color:#4b5563;background:#f3f4f6}
  .apr-bg-purple{color:#5b21b6;background:#ede9fe}
  .apr-bg-orange{color:#9a3412;background:#ffedd5}
  .apr-bg-cyan  {color:#0e7490;background:#ecfeff}

  /* empty */
  .apr-empty{text-align:center;padding:56px 24px;background:#fff;border-radius:20px;border:1px solid #f0f0f0}
  .apr-empty-ico{width:56px;height:56px;border-radius:16px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;color:#9ca3af}

  /* spinner */
  .apr-spin{width:44px;height:44px;border-radius:50%;border:3px solid #f0f0f0;border-top-color:var(--color-primary,#4f46e5);animation:spin .75s linear infinite}
  .apr-spin-sm{width:16px;height:16px;border-radius:50%;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;animation:spin .75s linear infinite;flex-shrink:0}

  /* ── MODALS ── */
  .apr-backdrop{position:fixed;inset:0;z-index:50;background:rgba(15,15,15,.65);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:16px}
  .apr-modal{background:#fff;border-radius:22px;width:100%;max-width:760px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 64px rgba(0,0,0,.2);display:flex;flex-direction:column}
  .apr-modal::-webkit-scrollbar{width:4px}
  .apr-modal::-webkit-scrollbar-thumb{background:#e5e7eb;border-radius:99px}
  .apr-modal-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:22px 28px 18px;border-bottom:1px solid #f3f4f6;position:sticky;top:0;background:#fff;z-index:2;border-radius:22px 22px 0 0}
  .apr-modal-title{font-size:18px;font-weight:900;color:#0f0f0f;margin:0 0 3px;letter-spacing:-.3px}
  .apr-modal-sub{font-size:12px;color:#9ca3af;margin:0;font-weight:500}
  .apr-modal-x{width:32px;height:32px;border-radius:10px;border:none;background:#f5f5f5;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#6b7280;transition:all .18s;flex-shrink:0}
  .apr-modal-x:hover{background:#e5e7eb;color:#374151}
  .apr-modal-body{padding:22px 28px;flex:1;overflow-y:auto}
  .apr-modal-foot{padding:18px 28px;border-top:1px solid #f3f4f6;display:flex;gap:10px;position:sticky;bottom:0;background:#fff;border-radius:0 0 22px 22px}

  /* modal content */
  .apr-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px}
  .apr-info-cell{background:#fafafa;border-radius:12px;padding:13px 15px;border:1px solid #f0f0f0}
  .apr-info-clabel{font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.1em;margin:0 0 4px;display:flex;align-items:center;gap:5px}
  .apr-info-cval{font-size:13.5px;font-weight:700;color:#0f0f0f;margin:0}
  .apr-section-label{font-size:9.5px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#c4c4c4;margin:20px 0 10px;padding:0}
  .apr-desc-box{background:color-mix(in srgb,var(--color-primary,#4f46e5) 5%,transparent);border:1px solid color-mix(in srgb,var(--color-primary,#4f46e5) 14%,transparent);border-radius:14px;padding:16px 18px}
  .apr-desc-head{font-size:10px;font-weight:800;color:var(--color-primary,#4f46e5);text-transform:uppercase;letter-spacing:.12em;margin:0 0 8px}
  .apr-desc-text{font-size:13.5px;color:#374151;line-height:1.75;margin:0;white-space:pre-wrap}
  .apr-contact-row{display:flex;align-items:center;gap:9px;padding:10px 14px;border-radius:12px;background:#fafafa;border:1px solid #f0f0f0;margin-bottom:8px;font-size:13px;color:#374151;font-weight:500}
  .apr-contact-row:last-child{margin-bottom:0}
  .apr-leader-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px}
  .apr-leader-card{display:flex;align-items:center;gap:10px;padding:11px 13px;border-radius:12px;background:#fafafa;border:1px solid #f0f0f0}
  .apr-leader-avatar{width:32px;height:32px;border-radius:10px;background:color-mix(in srgb,var(--color-primary,#4f46e5) 10%,transparent);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:var(--color-primary,#4f46e5);flex-shrink:0}
  .apr-doc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
  .apr-doc-item{aspect-ratio:1;border-radius:12px;overflow:hidden;border:1.5px solid #f0f0f0;display:flex;align-items:center;justify-content:center;background:#fafafa;cursor:pointer;transition:all .18s}
  .apr-doc-item:hover{border-color:var(--color-primary,#4f46e5);box-shadow:0 4px 14px color-mix(in srgb,var(--color-primary,#4f46e5) 20%,transparent)}
  .apr-info-banner{background:#fffbeb;border:1px solid #fef3c7;border-radius:13px;padding:14px 16px;display:flex;align-items:flex-start;gap:12px;margin-top:16px}

  /* modal action buttons */
  .apr-btn-close{flex:1;padding:12px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:700;color:#374151;cursor:pointer;font-family:inherit;transition:all .18s}
  .apr-btn-close:hover{background:#f7f7f8}
  .apr-btn-close:disabled{opacity:.5;cursor:not-allowed}
  .apr-btn-reject{padding:12px 22px;border-radius:12px;border:1.5px solid #fecaca;background:#fef2f2;font-size:13px;font-weight:700;color:#dc2626;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:6px;transition:all .18s}
  .apr-btn-reject:hover{background:#fee2e2}
  .apr-btn-reject:disabled{opacity:.5;cursor:not-allowed}
  .apr-btn-approve{padding:12px 24px;border-radius:12px;border:none;background:linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));font-size:13px;font-weight:700;color:#fff;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:6px;box-shadow:0 4px 14px color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent);transition:all .18s}
  .apr-btn-approve:hover{opacity:.9}
  .apr-btn-approve:disabled{opacity:.6;cursor:not-allowed}

  /* ── CONFIRM MODAL ── */
  .apr-confirm-modal{background:#fff;border-radius:22px;width:100%;max-width:440px;padding:36px;box-shadow:0 24px 64px rgba(0,0,0,.2);text-align:center}
  .apr-confirm-ico{width:64px;height:64px;border-radius:20px;background:#d1fae5;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;color:#059669}
  .apr-confirm-title{font-size:20px;font-weight:900;color:#0f0f0f;margin:0 0 10px}
  .apr-confirm-sub{font-size:13.5px;color:#6b7280;line-height:1.65;margin:0 0 24px}

  /* admin form */
  .apr-form-section{text-align:left;margin-bottom:20px}
  .apr-checkbox-label{display:flex;align-items:center;gap:14px;padding:16px;border-radius:14px;border:1.5px solid #e5e7eb;cursor:pointer;transition:all .18s;background:#fff;margin-bottom:14px}
  .apr-checkbox-label.checked{background:color-mix(in srgb,var(--color-primary,#4f46e5) 5%,transparent);border-color:color-mix(in srgb,var(--color-primary,#4f46e5) 25%,transparent)}
  .apr-admin-fields{display:flex;flex-direction:column;gap:12px;margin-top:4px;text-align:left}
  .apr-field-label{font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.1em;margin:0 0 5px;display:block}
  .apr-field-input{width:100%;height:42px;padding:0 13px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:500;color:#111;font-family:inherit;transition:border-color .18s;outline:none}
  .apr-field-input:focus{border-color:var(--color-primary,#4f46e5)}
  .apr-security-note{font-size:10.5px;color:#9ca3af;font-weight:600;letter-spacing:.12em;text-transform:uppercase;text-align:center;margin-top:20px;line-height:1.7}

  /* confirm buttons */
  .apr-confirm-btns{display:flex;flex-direction:column;gap:10px}
  .apr-confirm-btn-primary{width:100%;padding:14px;border-radius:13px;border:none;background:linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));color:#fff;font-size:14px;font-weight:800;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 6px 20px color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent);transition:all .2s}
  .apr-confirm-btn-primary:hover{opacity:.9;transform:translateY(-1px)}
  .apr-confirm-btn-primary:disabled{opacity:.65;cursor:not-allowed;transform:none}
  .apr-confirm-btn-ghost{width:100%;padding:12px;border-radius:13px;border:none;background:#f7f7f8;color:#6b7280;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;transition:background .18s}
  .apr-confirm-btn-ghost:hover{background:#f0f0f0}
  .apr-confirm-btn-ghost:disabled{opacity:.5;cursor:not-allowed}
`;

/* ─── helpers ─────────────────────────────────────────── */
const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const TYPE_META = {
  School:       { icon: School,      cls: "apr-bg-cyan",   color: "#0e7490" },
  Event:        { icon: CalendarDays,cls: "apr-bg-orange",  color: "#9a3412" },
  Story:        { icon: Newspaper,   cls: "apr-bg-blue",   color: "#1e40af" },
  Announcement: { icon: Megaphone,   cls: "apr-bg-purple", color: "#5b21b6" },
  Donation:     { icon: Heart,       cls: "apr-bg-red",    color: "#991b1b" },
};
const getTypeMeta = (t) => TYPE_META[t] || { icon: FileText, cls: "apr-bg-gray", color: "#4b5563" };

/* ═══════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════ */
const Approvals = () => {
  const [activeTab,     setActiveTab]     = useState("school");
  const [schools,       setSchools]       = useState([]);
  const [otherItems,    setOtherItems]    = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState("");
  const [error,         setError]         = useState(null);

  const [selected,        setSelected]        = useState(null);
  const [showReview,      setShowReview]      = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [createAdmin,     setCreateAdmin]     = useState(true);
  const [adminData,       setAdminData]       = useState({ fullName: "", email: "", role: "school_admin" });
  const [isSubmitting,    setIsSubmitting]    = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [schoolRes, adminRes] = await Promise.all([
        ApiSchool.getSchools({ isApproved: false }),
        ApiAdmin.getPendingApprovals(),
      ]);
      setSchools(schoolRes.data || []);
      setOtherItems(adminRes.data || []);
    } catch {
      setError("Failed to fetch pending requests. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async () => {
    if (!selected) return;
    setIsSubmitting(true);
    try {
      if (activeTab === "school") {
        await ApiSchool.approveSchool(selected.id);
        if (createAdmin) await ApiSchool.createSchoolUser(selected.id, adminData);
      } else {
        const { id, type } = selected;
        if (type === "Event")        await ApiAdmin.approveEvent(id, true);
        else if (type === "Story")   await ApiAdmin.approveStory(id, true);
        else if (type === "Announcement") await ApiAdmin.approveAnnouncement(id, true);
        else if (type === "Donation")await ApiAdmin.approveDonation(id, true);
      }
      await fetchData();
      setShowConfirm(false);
      setShowReview(false);
      setSelected(null);
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false); }
  };

  const handleReject = async () => {
    if (!selected) return;
    const reason = prompt("Please provide a reason for rejection:");
    if (reason === null) return;
    setIsSubmitting(true);
    try {
      if (activeTab === "school") {
        await ApiSchool.rejectSchool(selected.id, reason);
      } else {
        const { id, type } = selected;
        if (type === "Event")        await ApiAdmin.approveEvent(id, false);
        else if (type === "Story")   await ApiAdmin.approveStory(id, false);
        else if (type === "Announcement") await ApiAdmin.approveAnnouncement(id, false);
        else if (type === "Donation")await ApiAdmin.approveDonation(id, false);
      }
      await fetchData();
      setShowReview(false);
      setSelected(null);
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false); }
  };

  const openReview = (item) => {
    setSelected(item);
    if (activeTab === "school") {
      setAdminData({ fullName: item.leadership?.[0]?.name || "", email: item.contact?.email || "", role: "school_admin" });
    }
    setShowReview(true);
  };

  const list = activeTab === "school" ? schools : otherItems;
  const filtered = useMemo(() => list.filter(item =>
    (item.name || item.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (item.school || "").toLowerCase().includes(search.toLowerCase())
  ), [list, search]);

  return (
    <div className="apr">
      <style>{styles}</style>

      {/* ═══ HEAD ═══ */}
      <div className="apr-head">
        <div>
          <h1 className="apr-title">Approvals Dashboard</h1>
          <p className="apr-sub">Review and approve school registrations and content submissions.</p>
        </div>
        <button className="apr-refresh" onClick={fetchData}>
          <RefreshCw size={14} strokeWidth={2.5}/> Refresh
        </button>
      </div>

      {/* ═══ TABS ═══ */}
      <div className="apr-tabs">
        {[
          { id: "school", label: `School Registrations`, count: schools.length,   icon: School     },
          { id: "other",  label: `Content Approvals`,    count: otherItems.length, icon: FileText   },
        ].map(({ id, label, count, icon: Icon }) => (
          <button key={id} className={`apr-tab ${activeTab === id ? "active" : ""}`} onClick={() => setActiveTab(id)}>
            <Icon size={13} strokeWidth={2.2}/>{label}
            <span style={{
              padding: "2px 8px", borderRadius: 50, fontSize: 10.5, fontWeight: 800,
              background: activeTab === id ? "rgba(255,255,255,0.22)" : "#f3f4f6",
              color: activeTab === id ? "#fff" : "#6b7280",
            }}>{count}</span>
          </button>
        ))}
      </div>

      {/* ═══ SEARCH ═══ */}
      <div className="apr-search-wrap">
        <Search size={15} strokeWidth={2.2} className="apr-search-icon"/>
        <input className="apr-search" placeholder="Search by name or school…" value={search} onChange={e => setSearch(e.target.value)}/>
      </div>

      {/* ═══ ERROR ═══ */}
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <AlertCircle size={18} color="#dc2626" strokeWidth={2}/>
          <p style={{ fontSize: 13.5, color: "#dc2626", fontWeight: 600, margin: 0 }}>{error}</p>
        </div>
      )}

      {/* ═══ GRID ═══ */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "64px 24px", gap: 14 }}>
          <div className="apr-spin"/>
          <p style={{ fontSize: 13, color: "#9ca3af", fontWeight: 600 }}>Loading pending requests…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="apr-empty">
          <div className="apr-empty-ico">
            <CheckCircle size={24} strokeWidth={1.8}/>
          </div>
          <p style={{ fontSize: 15, fontWeight: 800, color: "#0f0f0f", margin: "0 0 6px" }}>All caught up!</p>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
            No pending {activeTab === "school" ? "school registrations" : "content submissions"} found.
          </p>
        </div>
      ) : (
        <div className="apr-grid">
          {filtered.map(item => {
            const meta = getTypeMeta(activeTab === "school" ? "School" : item.type);
            const Icon = meta.icon;
            return (
              <div key={item.id} className="apr-item">
                <div className="apr-item-meta">
                  <span className={`apr-badge ${meta.cls}`}>
                    <Icon size={11} strokeWidth={2.5}/>
                    {activeTab === "school" ? "School" : item.type}
                  </span>
                  <span className="apr-item-date">{formatDate(item.createdAt || item.submittedDate)}</span>
                </div>
                <h3 className="apr-item-name">{item.name || item.title}</h3>
                <p className="apr-item-sub">
                  {activeTab === "school"
                    ? `${item.type} · ${item.contact?.address || item.contact?.city || "Sri Lanka"}`
                    : `${item.type} · ${item.school || ""}`
                  }
                </p>
                <div className="apr-item-footer">
                  <button className="apr-review-btn" onClick={() => openReview(item)}>
                    <FileText size={14} strokeWidth={2.5}/> Review & Decide
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ════ REVIEW MODAL ════ */}
      {showReview && selected && (
        <div className="apr-backdrop" onClick={() => setShowReview(false)}>
          <div className="apr-modal" onClick={e => e.stopPropagation()}>

            {/* head */}
            <div className="apr-modal-head">
              <div>
                <p className="apr-modal-title">{selected.name || selected.title}</p>
                <p className="apr-modal-sub">ID: {selected.id} · Submitted {formatDate(selected.createdAt || selected.submittedDate)}</p>
              </div>
              <button className="apr-modal-x" onClick={() => setShowReview(false)}><X size={15} strokeWidth={2.2}/></button>
            </div>

            {/* body */}
            <div className="apr-modal-body">
              {activeTab === "school" ? (
                <>
                  {/* School info */}
                  <p className="apr-section-label">School Information</p>
                  <div className="apr-info-grid">
                    <div className="apr-info-cell">
                      <p className="apr-info-clabel">Type</p>
                      <p className="apr-info-cval">{selected.type}</p>
                    </div>
                    <div className="apr-info-cell">
                      <p className="apr-info-clabel">Est. Year</p>
                      <p className="apr-info-cval">{selected.startedYear || "—"}</p>
                    </div>
                    <div className="apr-info-cell">
                      <p className="apr-info-clabel"><Users size={11}/>Students</p>
                      <p className="apr-info-cval">{selected.studentCount?.toLocaleString() || "—"}</p>
                    </div>
                    <div className="apr-info-cell">
                      <p className="apr-info-clabel"><GraduationCap size={11}/>Teachers</p>
                      <p className="apr-info-cval">{selected.teachersCount || "—"}</p>
                    </div>
                  </div>

                  {selected.description && (
                    <div className="apr-desc-box" style={{ marginBottom: 20 }}>
                      <p className="apr-desc-head">Description</p>
                      <p className="apr-desc-text">{selected.description}</p>
                    </div>
                  )}

                  {/* Contact */}
                  <p className="apr-section-label">Contact Information</p>
                  <div style={{ marginBottom: 20 }}>
                    {selected.contact?.email   && <div className="apr-contact-row"><Mail size={14} color="var(--color-primary,#4f46e5)" strokeWidth={2}/>{selected.contact.email}</div>}
                    {selected.contact?.phone   && <div className="apr-contact-row"><Phone size={14} color="var(--color-primary,#4f46e5)" strokeWidth={2}/>{selected.contact.phone}</div>}
                    {selected.contact?.address && <div className="apr-contact-row"><MapPin size={14} color="var(--color-primary,#4f46e5)" strokeWidth={2}/>{selected.contact.address}</div>}
                  </div>

                  {/* Leadership */}
                  {selected.leadership?.length > 0 && (
                    <>
                      <p className="apr-section-label">Leadership Team</p>
                      <div className="apr-leader-grid" style={{ marginBottom: 20 }}>
                        {selected.leadership.map((m, i) => (
                          <div key={i} className="apr-leader-card">
                            <div className="apr-leader-avatar">{m.name?.[0] || "?"}</div>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 700, color: "#0f0f0f", margin: 0 }}>{m.name}</p>
                              <p style={{ fontSize: 11.5, color: "#9ca3af", margin: 0 }}>{m.position}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Documents */}
                  <p className="apr-section-label">Verification Documents</p>
                  <div className="apr-doc-grid">
                    {selected.logoUrl ? (
                      <div className="apr-doc-item" style={{ overflow: "hidden" }}>
                        <img src={selected.logoUrl} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                      </div>
                    ) : (
                      <div className="apr-doc-item" style={{ flexDirection: "column", gap: 4 }}>
                        <School size={20} color="#d1d5db" strokeWidth={1.5}/>
                        <span style={{ fontSize: 10.5, color: "#d1d5db", fontWeight: 600 }}>No Logo</span>
                      </div>
                    )}
                    <div className="apr-doc-item" style={{ flexDirection: "column", gap: 4 }}>
                      <FileText size={20} color="#9ca3af" strokeWidth={1.5}/>
                      <span style={{ fontSize: 10.5, color: "#9ca3af", fontWeight: 600 }}>Identity</span>
                    </div>
                    <div className="apr-doc-item" style={{ flexDirection: "column", gap: 4 }}>
                      <FileText size={20} color="#9ca3af" strokeWidth={1.5}/>
                      <span style={{ fontSize: 10.5, color: "#9ca3af", fontWeight: 600 }}>Letter</span>
                    </div>
                  </div>
                </>
              ) : (
                /* Content approval */
                <>
                  {(() => { const meta = getTypeMeta(selected.type); const Icon = meta.icon; return (
                    <span className={`apr-badge ${meta.cls}`} style={{ marginBottom: 14, display: "inline-flex" }}>
                      <Icon size={11} strokeWidth={2.5}/>{selected.type}
                    </span>
                  ); })()}

                  <p className="apr-section-label">Content Title</p>
                  <div className="apr-info-grid" style={{ marginBottom: 4 }}>
                    <div className="apr-info-cell" style={{ gridColumn: "1/-1" }}>
                      <p className="apr-info-cval" style={{ fontSize: 17 }}>{selected.title}</p>
                    </div>
                    <div className="apr-info-cell">
                      <p className="apr-info-clabel">Author</p>
                      <p className="apr-info-cval">{selected.authorName || "—"}</p>
                    </div>
                    <div className="apr-info-cell">
                      <p className="apr-info-clabel">School</p>
                      <p className="apr-info-cval">{selected.school || "—"}</p>
                    </div>
                    <div className="apr-info-cell">
                      <p className="apr-info-clabel">Submitted</p>
                      <p className="apr-info-cval">{formatDate(selected.submittedDate || selected.createdAt)}</p>
                    </div>
                  </div>

                  {(selected.description || selected.content) && (
                    <div className="apr-desc-box" style={{ marginTop: 14 }}>
                      <p className="apr-desc-head">Description / Summary</p>
                      <p className="apr-desc-text">{selected.description || selected.content || "No description provided."}</p>
                    </div>
                  )}

                  <div className="apr-info-banner">
                    <ShieldCheck size={18} color="#d97706" strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }}/>
                    <p style={{ fontSize: 13, color: "#92400e", fontWeight: 500, margin: 0, lineHeight: 1.6 }}>
                      Review carefully before approving. Once approved, this content will be visible across the platform.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* foot */}
            <div className="apr-modal-foot">
              <button className="apr-btn-close" onClick={() => setShowReview(false)} disabled={isSubmitting}>Close</button>
              <button className="apr-btn-reject" onClick={handleReject} disabled={isSubmitting}>
                {isSubmitting ? <div className="apr-spin-sm"/> : <X size={14} strokeWidth={2.5}/>}
                Reject
              </button>
              <button
                className="apr-btn-approve"
                disabled={isSubmitting}
                onClick={() => activeTab === "school" ? setShowConfirm(true) : handleApprove()}
              >
                {isSubmitting ? <div className="apr-spin-sm"/> : <CheckCircle size={14} strokeWidth={2.5}/>}
                {activeTab === "school" ? "Approve School" : "Approve Content"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════ CONFIRM / ADMIN CREATION MODAL ════ */}
      {showConfirm && selected && (
        <div className="apr-backdrop">
          <div className="apr-confirm-modal">
            <div className="apr-confirm-ico">
              <ShieldCheck size={28} strokeWidth={2}/>
            </div>
            <p className="apr-confirm-title">Final Confirmation</p>
            <p className="apr-confirm-sub">
              Approving <strong>{selected.name}</strong> will activate their profile on the public website.
            </p>

            <div className="apr-form-section">
              <label className={`apr-checkbox-label ${createAdmin ? "checked" : ""}`}>
                <input
                  type="checkbox" checked={createAdmin} onChange={e => setCreateAdmin(e.target.checked)}
                  style={{ accentColor: "var(--color-primary,#4f46e5)", width: 18, height: 18, flexShrink: 0 }}
                />
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0f0f0f", margin: "0 0 3px" }}>Create Admin Account</p>
                  <p style={{ fontSize: 12, color: "#9ca3af", margin: 0, fontWeight: 400 }}>Automatically create an onboarding account for the school admin.</p>
                </div>
              </label>

              {createAdmin && (
                <div className="apr-admin-fields">
                  <div>
                    <label className="apr-field-label">Full Name</label>
                    <input
                      type="text" className="apr-field-input"
                      value={adminData.fullName} placeholder="e.g. Mr. S.R. Perera"
                      onChange={e => setAdminData({ ...adminData, fullName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="apr-field-label">Admin Email</label>
                    <input
                      type="email" className="apr-field-input"
                      value={adminData.email} placeholder="admin@school.com"
                      onChange={e => setAdminData({ ...adminData, email: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="apr-confirm-btns">
              <button className="apr-confirm-btn-primary" onClick={handleApprove} disabled={isSubmitting}>
                {isSubmitting
                  ? <><div className="apr-spin-sm"/>Processing…</>
                  : <><CheckCircle size={16} strokeWidth={2.5}/>Confirm & Approve</>
                }
              </button>
              <button className="apr-confirm-btn-ghost" onClick={() => setShowConfirm(false)} disabled={isSubmitting}>Go Back</button>
            </div>

            <p className="apr-security-note">
              Security Notice: Email verification link<br/>will be sent via Keycloak infrastructure.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approvals;