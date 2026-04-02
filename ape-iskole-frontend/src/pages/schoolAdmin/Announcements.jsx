import React, { useMemo, useState, useEffect, useCallback } from "react";
import ApiAnnouncement from "../../services/ApiAnnouncement";
import ApiSchool from "../../services/ApiSchool";
import ApiUser from "../../services/ApiUser";
import { toast } from "react-hot-toast";
import {
  Megaphone, Send, Save, RotateCcw, Eye, Search,
  SlidersHorizontal, X, Globe, Target, CheckCircle,
  Clock, AlertCircle, Zap, Users, Star, FileText,
  ChevronDown, RefreshCw, Inbox, History, PlusCircle,
} from "lucide-react";

/* ─── styles ──────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  .ann*{box-sizing:border-box}
  .ann{font-family:'Plus Jakarta Sans',sans-serif;display:flex;flex-direction:column;gap:24px;animation:fadeUp .45s ease both}

  /* head */
  .ann-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap}
  .ann-title{font-size:22px;font-weight:900;color:#0f0f0f;letter-spacing:-.4px;margin:0 0 4px}
  .ann-sub{font-size:13px;color:#9ca3af;font-weight:500;margin:0}

  /* stats */
  .ann-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px}
  .ann-stat{background:#fff;border-radius:18px;border:1px solid #f0f0f0;padding:18px 16px;display:flex;align-items:center;gap:13px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .ann-stat-icon{width:44px;height:44px;border-radius:13px;flex-shrink:0;display:flex;align-items:center;justify-content:center}
  .ann-stat-label{font-size:11px;font-weight:600;color:#9ca3af;margin:0 0 3px}
  .ann-stat-value{font-size:22px;font-weight:900;letter-spacing:-.5px;margin:0;color:#0f0f0f}

  /* tabs */
  .ann-tabs{background:#fff;border-radius:16px;border:1px solid #f0f0f0;padding:6px;display:flex;flex-wrap:wrap;gap:4px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .ann-tab{display:flex;align-items:center;gap:6px;padding:9px 16px;border-radius:11px;border:none;background:transparent;font-size:12.5px;font-weight:700;color:#6b7280;cursor:pointer;font-family:inherit;transition:all .18s;white-space:nowrap}
  .ann-tab:hover{background:#f7f7f8;color:#111}
  .ann-tab.active{background:linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));color:#fff;box-shadow:0 3px 10px color-mix(in srgb,var(--color-primary,#4f46e5) 28%,transparent)}

  /* layout */
  .ann-layout{display:grid;grid-template-columns:1fr;gap:20px}
  @media(min-width:1024px){.ann-layout{grid-template-columns:1fr 300px}}

  /* card */
  .ann-card{background:#fff;border-radius:20px;border:1px solid #f0f0f0;padding:24px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .ann-card-title{font-size:16px;font-weight:800;color:#0f0f0f;margin:0 0 18px;letter-spacing:-.2px}

  /* section label */
  .ann-sec{font-size:9.5px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#c4c4c4;margin:20px 0 10px;padding:0}

  /* form fields */
  .ann-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  @media(max-width:560px){.ann-grid{grid-template-columns:1fr}}
  .ann-col2{grid-column:1/-1}
  .ann-field{display:flex;flex-direction:column;gap:5px}
  .ann-label{font-size:11.5px;font-weight:700;color:#374151}
  .ann-req{color:#ef4444}
  .ann-input{height:42px;padding:0 13px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:500;color:#111;font-family:inherit;transition:border-color .18s;outline:none;width:100%}
  .ann-input:focus{border-color:var(--color-primary,#4f46e5)}
  .ann-input.err{border-color:#ef4444}
  .ann-textarea{padding:11px 13px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:500;color:#111;font-family:inherit;transition:border-color .18s;outline:none;width:100%;resize:vertical;line-height:1.65;min-height:110px}
  .ann-textarea:focus{border-color:var(--color-primary,#4f46e5)}
  .ann-textarea.err{border-color:#ef4444}
  .ann-errmsg{font-size:11.5px;color:#ef4444;font-weight:600;margin-top:2px;display:flex;align-items:center;gap:4px}
  .ann-hint{font-size:11.5px;color:#9ca3af;margin-top:3px}
  .ann-char{font-size:11px;color:#9ca3af;text-align:right;margin-top:3px}

  /* audience type cards */
  .ann-aud-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px}
  .ann-aud-opt{display:flex;align-items:center;gap:10px;padding:14px;border-radius:13px;border:1.5px solid #e5e7eb;cursor:pointer;transition:all .18s;background:#fff}
  .ann-aud-opt.community{background:#eff6ff;border-color:#93c5fd}
  .ann-aud-opt.targeted{background:#f5f3ff;border-color:#c4b5fd}
  .ann-aud-icon{width:36px;height:36px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0}

  /* priority pills */
  .ann-pri-row{display:flex;flex-wrap:wrap;gap:9px}
  .ann-pri-opt{display:flex;align-items:center;gap:7px;padding:8px 14px;border-radius:11px;border:1.5px solid #e5e7eb;background:#fff;cursor:pointer;transition:all .18s;font-size:12.5px;font-weight:700;color:#374151;user-select:none}
  .ann-pri-opt.on-normal{background:#eff6ff;border-color:#93c5fd;color:#1e40af}
  .ann-pri-opt.on-high{background:#fffbeb;border-color:#fde68a;color:#92400e}
  .ann-pri-opt.on-urgent{background:#fef2f2;border-color:#fecaca;color:#991b1b}

  /* school checkbox list */
  .ann-school-list{border:1.5px solid #e5e7eb;border-radius:13px;padding:14px;max-height:200px;overflow-y:auto}
  .ann-school-list::-webkit-scrollbar{width:4px}
  .ann-school-list::-webkit-scrollbar-thumb{background:#e5e7eb;border-radius:99px}
  .ann-school-opt{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:10px;cursor:pointer;transition:background .15s;font-size:13px;font-weight:500;color:#374151}
  .ann-school-opt:hover{background:#f7f7f8}
  .ann-school-opt.sel{background:color-mix(in srgb,var(--color-primary,#4f46e5) 7%,transparent)}

  /* success banner */
  .ann-success{background:#ecfdf5;border:1px solid #a7f3d0;border-radius:16px;padding:16px 20px;display:flex;align-items:center;gap:12px;margin-bottom:20px}
  .ann-success-ico{width:38px;height:38px;border-radius:12px;background:#d1fae5;display:flex;align-items:center;justify-content:center;color:#059669;flex-shrink:0}

  /* action buttons */
  .ann-btn-submit{width:100%;padding:13px;border-radius:13px;border:none;background:linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));color:#fff;font-size:13.5px;font-weight:800;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 5px 16px color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent);transition:all .22s}
  .ann-btn-submit:hover{transform:translateY(-1px);opacity:.9}
  .ann-btn-submit:disabled{opacity:.6;cursor:not-allowed;transform:none}
  .ann-btn-outline{width:100%;padding:12px;border-radius:13px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:700;color:#374151;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:7px;transition:all .18s}
  .ann-btn-outline:hover{background:#f7f7f8;border-color:#d1d5db}
  .ann-btn-outline:disabled{opacity:.5;cursor:not-allowed}
  .ann-btn-ghost{width:100%;padding:12px;border-radius:13px;border:none;background:color-mix(in srgb,var(--color-primary,#4f46e5) 7%,transparent);font-size:13px;font-weight:700;color:var(--color-primary,#4f46e5);cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:7px;transition:all .18s}
  .ann-btn-ghost:hover{background:color-mix(in srgb,var(--color-primary,#4f46e5) 12%,transparent)}

  /* sidebar */
  .ann-sidebar{display:flex;flex-direction:column;gap:16px}

  /* filter panel */
  .ann-fp{background:#fff;border-radius:20px;border:1px solid #f0f0f0;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .ann-fp-row{display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end}
  .ann-fg{display:flex;flex-direction:column;gap:5px;flex:1;min-width:150px}
  .ann-flabel{font-size:10.5px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.1em}
  .ann-finput{height:40px;padding:0 13px;border-radius:11px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:500;color:#111;font-family:inherit;transition:border-color .18s;outline:none;width:100%}
  .ann-finput:focus{border-color:var(--color-primary,#4f46e5)}
  .ann-finput-wrap{position:relative}
  .ann-finput-wrap .ann-finput{padding-left:36px}
  .ann-finput-icon{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:#9ca3af;pointer-events:none}
  .ann-fbtn{height:40px;padding:0 15px;border-radius:11px;border:1.5px solid #e5e7eb;background:#fff;font-size:12.5px;font-weight:700;color:#374151;cursor:pointer;display:flex;align-items:center;gap:6px;font-family:inherit;transition:all .18s;white-space:nowrap}
  .ann-fbtn:hover{background:#f7f7f8;border-color:#d1d5db}
  .ann-fbtn.active{background:color-mix(in srgb,var(--color-primary,#4f46e5) 8%,transparent);border-color:color-mix(in srgb,var(--color-primary,#4f46e5) 25%,transparent);color:var(--color-primary,#4f46e5)}
  .ann-chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:14px;padding-top:14px;border-top:1px solid #f3f4f6;align-items:center}
  .ann-chip{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:50px;font-size:11.5px;font-weight:700;background:color-mix(in srgb,var(--color-primary,#4f46e5) 8%,transparent);color:var(--color-primary,#4f46e5);border:1px solid color-mix(in srgb,var(--color-primary,#4f46e5) 18%,transparent)}
  .ann-chip-x{cursor:pointer;background:none;border:none;padding:0;display:flex;align-items:center;color:inherit;opacity:.6}
  .ann-chip-x:hover{opacity:1}
  .ann-clear{font-size:12px;font-weight:700;color:#ef4444;cursor:pointer;background:none;border:none;font-family:inherit}

  /* results bar */
  .ann-resbar{display:flex;align-items:center;justify-content:space-between}
  .ann-rescnt{font-size:14px;font-weight:800;color:#0f0f0f}
  .ann-restot{font-size:12px;color:#9ca3af;font-weight:500}

  /* table */
  .ann-tcard{background:#fff;border-radius:20px;border:1px solid #f0f0f0;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .ann-table{width:100%;border-collapse:collapse}
  .ann-table thead{background:#fafafa}
  .ann-table th{padding:12px 16px;text-align:left;font-size:10.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#9ca3af;border-bottom:1px solid #f0f0f0}
  .ann-table td{padding:14px 16px;border-bottom:1px solid #f7f7f8;vertical-align:middle}
  .ann-table tbody tr{transition:background .15s}
  .ann-table tbody tr:hover{background:#fafafa}
  .ann-table tbody tr:last-child td{border-bottom:none}
  .ann-aname{font-size:13.5px;font-weight:700;color:#0f0f0f}
  .ann-ameta{font-size:11.5px;color:#9ca3af;font-weight:500;margin-top:2px;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;overflow:hidden}

  /* badges */
  .ann-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:50px;font-size:11px;font-weight:700;white-space:nowrap}
  .ann-bg-green {color:#065f46;background:#d1fae5}
  .ann-bg-yellow{color:#92400e;background:#fef3c7}
  .ann-bg-red   {color:#991b1b;background:#fee2e2}
  .ann-bg-blue  {color:#1e40af;background:#dbeafe}
  .ann-bg-gray  {color:#4b5563;background:#f3f4f6}
  .ann-bg-purple{color:#5b21b6;background:#ede9fe}
  .ann-bg-orange{color:#9a3412;background:#ffedd5}

  /* spinner */
  .ann-spin{width:16px;height:16px;border-radius:50%;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;animation:spin .75s linear infinite;flex-shrink:0}
  .ann-spin-lg{width:44px;height:44px;border-radius:50%;border:3px solid #f0f0f0;border-top-color:var(--color-primary,#4f46e5);animation:spin .75s linear infinite}

  /* empty state */
  .ann-empty{text-align:center;padding:56px 24px}
  .ann-empty-ico{width:52px;height:52px;border-radius:16px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;color:#9ca3af}

  /* preview modal */
  .ann-backdrop{position:fixed;inset:0;z-index:50;background:rgba(15,15,15,.6);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:16px}
  .ann-modal{background:#fff;border-radius:22px;width:100%;max-width:560px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 64px rgba(0,0,0,.18)}
  .ann-modal::-webkit-scrollbar{width:4px}
  .ann-modal::-webkit-scrollbar-thumb{background:#e5e7eb;border-radius:99px}
  .ann-modal-head{display:flex;align-items:center;justify-content:space-between;padding:20px 24px 16px;border-bottom:1px solid #f3f4f6;position:sticky;top:0;background:#fff;z-index:2;border-radius:22px 22px 0 0}
  .ann-modal-title{font-size:17px;font-weight:800;color:#0f0f0f;margin:0}
  .ann-modal-sub{font-size:11.5px;color:#9ca3af;font-weight:500;margin-top:2px}
  .ann-modal-x{width:30px;height:30px;border-radius:9px;border:none;background:#f5f5f5;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#6b7280;transition:all .18s}
  .ann-modal-x:hover{background:#e5e7eb;color:#374151}
  .ann-modal-body{padding:20px 24px}
  .ann-modal-foot{padding:16px 24px;border-top:1px solid #f3f4f6;display:flex;gap:10px}
  .ann-modal-btn-outline{flex:1;padding:11px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:700;color:#374151;cursor:pointer;font-family:inherit;transition:all .18s}
  .ann-modal-btn-outline:hover{background:#f7f7f8}
  .ann-modal-btn-primary{flex:1;padding:11px;border-radius:12px;border:none;background:linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));font-size:13px;font-weight:700;color:#fff;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:7px;box-shadow:0 4px 14px color-mix(in srgb,var(--color-primary,#4f46e5) 28%,transparent)}
`;

/* ─── helpers ─────────────────────────────────────────── */
const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};
const formatTime = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const PRIORITY_META = {
  normal: { label: "Normal", cls: "ann-bg-blue",   icon: FileText,   activeCls: "on-normal" },
  high:   { label: "High",   cls: "ann-bg-yellow",  icon: Star,       activeCls: "on-high"   },
  urgent: { label: "Urgent", cls: "ann-bg-red",     icon: AlertCircle,activeCls: "on-urgent"  },
};
const getPriMeta = (p) => PRIORITY_META[p?.toLowerCase()] || PRIORITY_META.normal;

const StatusBadge = ({ status }) => {
  if (status === "Sent" || status === "Active" || status === "Approved")
    return <span className="ann-badge ann-bg-green"><CheckCircle size={11} strokeWidth={2.5}/>Sent</span>;
  if (status === "Draft")
    return <span className="ann-badge ann-bg-gray"><FileText size={11} strokeWidth={2.5}/>Draft</span>;
  if (status === "Pending")
    return <span className="ann-badge ann-bg-yellow"><Clock size={11} strokeWidth={2.5}/>Pending</span>;
  return <span className="ann-badge ann-bg-gray">{status}</span>;
};

const Field = ({ label, required, error, hint, children }) => (
  <div className="ann-field">
    <label className="ann-label">{label}{required && <span className="ann-req"> *</span>}</label>
    {children}
    {error && <p className="ann-errmsg"><AlertCircle size={11}/> {error}</p>}
    {hint && !error && <p className="ann-hint">{hint}</p>}
  </div>
);

const initForm = {
  title: "", message: "", audienceType: "Community", audience: [],
  priority: "normal", scheduleDate: "", scheduleTime: "",
};

/* ═══════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════ */
const Announcements = () => {
  const [activeTab,   setActiveTab]   = useState("list");
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const [user,      setUser]      = useState(null);
  const [schools,   setSchools]   = useState([]);
  const [sent,      setSent]      = useState([]);
  const [received,  setReceived]  = useState([]);
  const [loading,   setLoading]   = useState(true);

  const [formData,     setFormData]     = useState(initForm);
  const [errors,       setErrors]       = useState({});
  const [submitted,    setSubmitted]    = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [search,        setSearch]        = useState("");
  const [typeFilter,    setTypeFilter]    = useState("All");
  const [statusFilter,  setStatusFilter]  = useState("All");
  const [dateRange,     setDateRange]     = useState({ start: "", end: "" });
  const [showFilters,   setShowFilters]   = useState(false);

  /* ── fetch ── */
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [userRes, schoolsRes] = await Promise.all([ApiUser.getCurrentUser(), ApiSchool.getPublicSchools()]);
      setUser(userRes.data);
      setSchools(schoolsRes.data);
      const schoolId = userRes.data.schoolId;
      if (schoolId) {
        const [sentRes, recvRes] = await Promise.all([
          ApiAnnouncement.getAdminAnnouncements(schoolId),
          ApiAnnouncement.getPublicForSchool(schoolId),
        ]);
        setSent(sentRes.data);
        setReceived(recvRes.data.filter(a => a.schoolId !== schoolId));
      }
    } catch {
      toast.error("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── stats ── */
  const stats = useMemo(() => ({
    totalSent:     sent.length,
    totalReceived: received.length,
    drafts:        sent.filter(a => a.status === "Draft").length,
    totalViews:    sent.reduce((s, a) => s + (a.views || 0), 0),
  }), [sent, received]);

  /* ── filtered list ── */
  const list = activeTab === "received" ? received : sent;
  const filtered = useMemo(() => list.filter(item => {
    const q = search.toLowerCase();
    const matchSearch = !search || item.title?.toLowerCase().includes(q) || item.message?.toLowerCase().includes(q);
    const matchType   = typeFilter   === "All" || item.type === typeFilter;
    const matchStatus = statusFilter === "All" || item.status === statusFilter;
    const d = item.createdAt?.split("T")[0] || "";
    const matchDate = (!dateRange.start || d >= dateRange.start) && (!dateRange.end || d <= dateRange.end);
    return matchSearch && matchType && matchStatus && matchDate;
  }), [list, search, typeFilter, statusFilter, dateRange]);

  const hasFilters = search || typeFilter !== "All" || statusFilter !== "All" || dateRange.start || dateRange.end;
  const clearFilters = () => { setSearch(""); setTypeFilter("All"); setStatusFilter("All"); setDateRange({ start: "", end: "" }); };

  /* ── form ── */
  const resetForm = () => { setFormData(initForm); setErrors({}); setSubmitted(false); };

  const validate = () => {
    const e = {};
    if (!formData.title.trim())   e.title   = "Title is required";
    if (!formData.message.trim()) e.message = "Message is required";
    if (formData.audienceType === "Targeted" && formData.audience.length === 0)
      e.audience = "Please select at least one school";
    return e;
  };

  const handleSubmit = async (e, isDraft = false) => {
    if (e) e.preventDefault();
    if (!user?.schoolId) { toast.error("School context not found"); return; }
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    setIsSubmitting(true);
    try {
      let scheduledAt = null;
      if (formData.scheduleDate && formData.scheduleTime)
        scheduledAt = new Date(`${formData.scheduleDate}T${formData.scheduleTime}`).toISOString();

      await ApiAnnouncement.createAnnouncement({
        title: formData.title, message: formData.message,
        type: formData.audienceType, targetSchoolIds: formData.audience,
        priority: formData.priority, schoolId: user.schoolId,
        scheduledAt, saveAsDraft: isDraft,
      });

      toast.success(isDraft ? "Draft saved!" : "Announcement sent successfully!");
      setSubmitted(true);
      resetForm();
      fetchData();
      setTimeout(() => { setSubmitted(false); setActiveTab("list"); }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.title || "Failed to send announcement");
    } finally { setIsSubmitting(false); }
  };

  const handleSchoolSelect = (id) =>
    setFormData(p => ({
      ...p,
      audience: p.audience.includes(id) ? p.audience.filter(x => x !== id) : [...p.audience, id],
    }));

  const handlePreview = () => {
    setPreviewData({
      ...formData,
      audienceLabel: formData.audienceType === "Community"
        ? "All Schools (Community)"
        : `${formData.audience.length} Selected Schools`,
    });
    setShowPreview(true);
  };

  /* ─────────────────────────────────────────────── */
  return (
    <div className="ann">
      <style>{styles}</style>

      {/* ═══ HEAD ═══ */}
      <div className="ann-head">
        <div>
          <h1 className="ann-title">Announcements</h1>
          <p className="ann-sub">Send updates to all schools or target specific institutions in your network.</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span className="ann-badge ann-bg-blue"><Globe size={11} strokeWidth={2.5}/>Community</span>
          <span className="ann-badge ann-bg-purple"><Target size={11} strokeWidth={2.5}/>Targeted</span>
        </div>
      </div>

      {/* ═══ STATS ═══ */}
      <div className="ann-stats">
        {[
          { label: "Sent",          value: stats.totalSent,     icon: Send,     bg: "#eff6ff", color: "#2563eb" },
          { label: "Received",      value: stats.totalReceived, icon: Inbox,    bg: "#ecfdf5", color: "#059669" },
          { label: "Drafts",        value: stats.drafts,        icon: FileText, bg: "#fffbeb", color: "#d97706" },
          { label: "Total Views",   value: stats.totalViews.toLocaleString(), icon: Eye, bg: "#f5f3ff", color: "#7c3aed" },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="ann-stat">
            <div className="ann-stat-icon" style={{ background: bg, color }}>
              <Icon size={20} strokeWidth={2}/>
            </div>
            <div>
              <p className="ann-stat-label">{label}</p>
              <p className="ann-stat-value">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ TABS ═══ */}
      <div className="ann-tabs">
        {[
          { id: "list",     label: "Sent History",  icon: History     },
          { id: "received", label: "Received Inbox", icon: Inbox       },
          { id: "create",   label: "Create New",    icon: PlusCircle  },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`ann-tab ${activeTab === id ? "active" : ""}`}
            onClick={() => { if (id === "create") resetForm(); setActiveTab(id); }}
          >
            <Icon size={13} strokeWidth={2.2}/>{label}
          </button>
        ))}
      </div>

      {/* ═══ CREATE FORM ═══ */}
      {activeTab === "create" && (
        <div className="ann-layout">

          {/* MAIN */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {submitted && (
              <div className="ann-success">
                <div className="ann-success-ico"><CheckCircle size={20} strokeWidth={2.5}/></div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: "#065f46", margin: "0 0 2px" }}>Announcement sent!</p>
                  <p style={{ fontSize: 12, color: "#047857", margin: 0 }}>Your announcement has been processed. Redirecting…</p>
                </div>
              </div>
            )}

            {/* Core content */}
            <div className="ann-card">
              <p className="ann-card-title">Announcement Content</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Field label="Title" required error={errors.title}>
                  <input className={`ann-input ${errors.title ? "err" : ""}`} name="title" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} placeholder="Enter a clear, descriptive title"/>
                </Field>
                <Field label="Message" required error={errors.message}>
                  <textarea
                    className={`ann-textarea ${errors.message ? "err" : ""}`}
                    name="message" value={formData.message} rows={5}
                    onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                    placeholder="Write your announcement message…"
                  />
                  <p className="ann-char">{formData.message.length} characters</p>
                </Field>
              </div>
            </div>

            {/* Audience */}
            <div className="ann-card">
              <p className="ann-card-title">Audience</p>
              <div className="ann-aud-row">
                <label className={`ann-aud-opt ${formData.audienceType === "Community" ? "community" : ""}`}>
                  <input type="radio" style={{ display: "none" }} checked={formData.audienceType === "Community"} onChange={() => setFormData(p => ({ ...p, audienceType: "Community", audience: [] }))}/>
                  <div className="ann-aud-icon" style={{ background: formData.audienceType === "Community" ? "#dbeafe" : "#f3f4f6" }}>
                    <Globe size={18} color={formData.audienceType === "Community" ? "#2563eb" : "#9ca3af"} strokeWidth={2}/>
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: formData.audienceType === "Community" ? "#1e40af" : "#374151", margin: 0 }}>Community</p>
                    <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0" }}>Broadcast to all schools</p>
                  </div>
                </label>
                <label className={`ann-aud-opt ${formData.audienceType === "Targeted" ? "targeted" : ""}`}>
                  <input type="radio" style={{ display: "none" }} checked={formData.audienceType === "Targeted"} onChange={() => setFormData(p => ({ ...p, audienceType: "Targeted" }))}/>
                  <div className="ann-aud-icon" style={{ background: formData.audienceType === "Targeted" ? "#ede9fe" : "#f3f4f6" }}>
                    <Target size={18} color={formData.audienceType === "Targeted" ? "#7c3aed" : "#9ca3af"} strokeWidth={2}/>
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: formData.audienceType === "Targeted" ? "#5b21b6" : "#374151", margin: 0 }}>Targeted</p>
                    <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0" }}>Send to specific schools</p>
                  </div>
                </label>
              </div>

              {formData.audienceType === "Targeted" && (
                <div>
                  <p className="ann-sec">Select Schools</p>
                  {errors.audience && <p className="ann-errmsg" style={{ marginBottom: 8 }}><AlertCircle size={11}/> {errors.audience}</p>}
                  <div className="ann-school-list">
                    {schools.filter(s => s.id !== user?.schoolId).map(s => (
                      <label key={s.id} className={`ann-school-opt ${formData.audience.includes(s.id) ? "sel" : ""}`}>
                        <input
                          type="checkbox"
                          checked={formData.audience.includes(s.id)}
                          onChange={() => handleSchoolSelect(s.id)}
                          style={{ accentColor: "var(--color-primary,#4f46e5)", width: 14, height: 14 }}
                        />
                        {s.name}
                      </label>
                    ))}
                  </div>
                  {formData.audience.length > 0 && (
                    <p style={{ fontSize: 12, color: "var(--color-primary,#4f46e5)", fontWeight: 700, marginTop: 8 }}>
                      {formData.audience.length} school{formData.audience.length > 1 ? "s" : ""} selected
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Priority & Schedule */}
            <div className="ann-card">
              <p className="ann-card-title">Priority & Scheduling</p>

              <p className="ann-sec">Priority Level</p>
              <div className="ann-pri-row" style={{ marginBottom: 20 }}>
                {Object.entries(PRIORITY_META).map(([val, { label, icon: Icon, activeCls }]) => (
                  <label key={val} className={`ann-pri-opt ${formData.priority === val ? activeCls : ""}`}>
                    <input type="radio" style={{ display: "none" }} checked={formData.priority === val} onChange={() => setFormData(p => ({ ...p, priority: val }))}/>
                    <Icon size={13} strokeWidth={2.2}/>{label}
                  </label>
                ))}
              </div>

              <p className="ann-sec">Schedule for Later (Optional)</p>
              <div className="ann-grid">
                <Field label="Date" hint="Leave blank to send immediately">
                  <input type="date" className="ann-input" value={formData.scheduleDate} min={new Date().toISOString().split("T")[0]} onChange={e => setFormData(p => ({ ...p, scheduleDate: e.target.value }))}/>
                </Field>
                <Field label="Time">
                  <input type="time" className="ann-input" value={formData.scheduleTime} onChange={e => setFormData(p => ({ ...p, scheduleTime: e.target.value }))}/>
                </Field>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="ann-sidebar">

            {/* Publish info */}
            <div className="ann-card">
              <p className="ann-card-title" style={{ marginBottom: 14 }}>Delivery Settings</p>
              {[
                { bg: "#eff6ff", iconColor: "#2563eb", Icon: Globe,       title: "Reach",        sub: formData.audienceType === "Community" ? "All schools in network" : `${formData.audience.length} targeted schools` },
                { bg: "#ecfdf5", iconColor: "#059669", Icon: CheckCircle, title: "Delivery",     sub: formData.scheduleDate ? `Scheduled: ${formData.scheduleDate}` : "Sent immediately" },
              ].map(({ bg, iconColor, Icon, title, sub }, i) => (
                <div key={i} style={{ background: bg, borderRadius: 13, padding: 14, marginBottom: i === 0 ? 10 : 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                    <Icon size={13} color={iconColor} strokeWidth={2.2}/>
                    <span style={{ fontSize: 12, fontWeight: 800, color: iconColor }}>{title}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#374151", fontWeight: 500, margin: 0 }}>{sub}</p>
                </div>
              ))}

              {/* Priority preview */}
              <div style={{ marginTop: 12, padding: "12px 14px", borderRadius: 12, background: "#fafafa", border: "1px solid #f0f0f0" }}>
                <p style={{ fontSize: 10, fontWeight: 800, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 6px" }}>Priority</p>
                {(() => { const m = getPriMeta(formData.priority); const Icon = m.icon; return (
                  <span className={`ann-badge ${m.cls}`}><Icon size={11} strokeWidth={2.5}/>{m.label}</span>
                ); })()}
              </div>
            </div>

            {/* Preview card */}
            <div className="ann-card">
              <p className="ann-card-title" style={{ marginBottom: 14 }}>Preview</p>
              <p style={{ fontSize: 14, fontWeight: 800, color: "#0f0f0f", margin: "0 0 6px" }}>{formData.title || "Announcement Title"}</p>
              <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.65, margin: "0 0 12px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {formData.message || "Announcement message will appear here…"}
              </p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span className="ann-badge ann-bg-gray" style={{ fontSize: 10.5 }}>
                  {formData.audienceType === "Community" ? "Community" : `${formData.audience.length} Schools`}
                </span>
                {(() => { const m = getPriMeta(formData.priority); const Icon = m.icon; return (
                  <span className={`ann-badge ${m.cls}`} style={{ fontSize: 10.5 }}><Icon size={10} strokeWidth={2.5}/>{m.label}</span>
                ); })()}
              </div>
            </div>

            {/* Actions */}
            <div className="ann-card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button className="ann-btn-submit" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting
                  ? <><div className="ann-spin"/>Sending…</>
                  : <><Send size={15} strokeWidth={2.5}/>Send Announcement</>
                }
              </button>
              <button className="ann-btn-outline" onClick={() => handleSubmit(null, true)} disabled={isSubmitting}>
                <Save size={14} strokeWidth={2.5}/> Save as Draft
              </button>
              <button className="ann-btn-outline" onClick={handlePreview} style={{ borderColor: "color-mix(in srgb,var(--color-primary,#4f46e5) 25%,transparent)", color: "var(--color-primary,#4f46e5)" }}>
                <Eye size={14} strokeWidth={2.5}/> Preview
              </button>
              <button className="ann-btn-ghost" onClick={resetForm}>
                <RotateCcw size={14} strokeWidth={2.5}/> Reset Form
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ LIST / RECEIVED ═══ */}
      {(activeTab === "list" || activeTab === "received") && (
        <>
          {/* Filters */}
          <div className="ann-fp">
            <div className="ann-fp-row">
              <div className="ann-fg" style={{ flex: 2, minWidth: 200 }}>
                <span className="ann-flabel">Search</span>
                <div className="ann-finput-wrap">
                  <Search size={14} className="ann-finput-icon"/>
                  <input className="ann-finput" placeholder="Search by title or message…" value={search} onChange={e => setSearch(e.target.value)}/>
                </div>
              </div>
              <div className="ann-fg">
                <span className="ann-flabel">Type</span>
                <select className="ann-finput" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                  <option value="All">All Types</option>
                  <option value="Community">Community</option>
                  <option value="Targeted">Targeted</option>
                </select>
              </div>
              <div className="ann-fg">
                <span className="ann-flabel">Status</span>
                <select className="ann-finput" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
              <button className={`ann-fbtn ${showFilters ? "active" : ""}`} onClick={() => setShowFilters(v => !v)}>
                <SlidersHorizontal size={14} strokeWidth={2.2}/>
                {showFilters ? "Less" : "More"} Filters
              </button>
              {hasFilters && (
                <button className="ann-fbtn" style={{ color: "#ef4444", borderColor: "#fecaca", background: "#fef2f2" }} onClick={clearFilters}>
                  <X size={13} strokeWidth={2.5}/> Clear
                </button>
              )}
            </div>

            {showFilters && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #f3f4f6", display: "flex", gap: 12, flexWrap: "wrap" }}>
                <div className="ann-fg" style={{ maxWidth: 260 }}>
                  <span className="ann-flabel">Date From</span>
                  <input type="date" className="ann-finput" value={dateRange.start} onChange={e => setDateRange(d => ({ ...d, start: e.target.value }))}/>
                </div>
                <div className="ann-fg" style={{ maxWidth: 260 }}>
                  <span className="ann-flabel">Date To</span>
                  <input type="date" className="ann-finput" value={dateRange.end} onChange={e => setDateRange(d => ({ ...d, end: e.target.value }))}/>
                </div>
              </div>
            )}

            {hasFilters && (
              <div className="ann-chips">
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#9ca3af" }}>Active:</span>
                {search        && <span className="ann-chip">Search: {search}<button className="ann-chip-x" onClick={() => setSearch("")}><X size={11}/></button></span>}
                {typeFilter !== "All" && <span className="ann-chip">Type: {typeFilter}<button className="ann-chip-x" onClick={() => setTypeFilter("All")}><X size={11}/></button></span>}
                {statusFilter !== "All" && <span className="ann-chip">Status: {statusFilter}<button className="ann-chip-x" onClick={() => setStatusFilter("All")}><X size={11}/></button></span>}
                {(dateRange.start || dateRange.end) && <span className="ann-chip">Date: {dateRange.start || "Any"} – {dateRange.end || "Any"}<button className="ann-chip-x" onClick={() => setDateRange({ start: "", end: "" })}><X size={11}/></button></span>}
                <button className="ann-clear" onClick={clearFilters}>Clear all</button>
              </div>
            )}
          </div>

          {/* Results bar */}
          <div className="ann-resbar">
            <span className="ann-rescnt">{filtered.length} Announcement{filtered.length !== 1 ? "s" : ""}</span>
            <span className="ann-restot">Showing {filtered.length} of {list.length}</span>
          </div>

          {/* Table */}
          <div className="ann-tcard">
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "56px 24px", gap: 14 }}>
                <div className="ann-spin-lg"/>
                <p style={{ fontSize: 13, color: "#9ca3af", fontWeight: 600 }}>Loading announcements…</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="ann-table">
                  <thead>
                    <tr>
                      <th>Announcement</th>
                      <th>{activeTab === "received" ? "From School" : "Recipients"}</th>
                      <th>Type</th>
                      <th>Priority</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(item => {
                      const pm  = getPriMeta(item.priority);
                      const PIcon = pm.icon;
                      return (
                        <tr key={item.id}>
                          <td>
                            <p className="ann-aname">{item.title}</p>
                            <p className="ann-ameta">{item.message}</p>
                          </td>
                          <td style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>
                            {activeTab === "received"
                              ? item.schoolName || "External School"
                              : item.type === "Community" ? "All Schools" : `${item.targetSchoolIds?.length || 0} Schools`
                            }
                          </td>
                          <td>
                            <span className={`ann-badge ${item.type === "Community" ? "ann-bg-blue" : "ann-bg-purple"}`}>
                              {item.type === "Community" ? <Globe size={11} strokeWidth={2.5}/> : <Target size={11} strokeWidth={2.5}/>}
                              {item.type}
                            </span>
                          </td>
                          <td>
                            <span className={`ann-badge ${pm.cls}`}>
                              <PIcon size={11} strokeWidth={2.5}/>{pm.label}
                            </span>
                          </td>
                          <td>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", margin: 0 }}>{formatDate(item.createdAt)}</p>
                            <p style={{ fontSize: 11.5, color: "#9ca3af", margin: "2px 0 0" }}>{formatTime(item.createdAt)}</p>
                          </td>
                          <td><StatusBadge status={item.status}/></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {filtered.length === 0 && (
                  <div className="ann-empty">
                    <div className="ann-empty-ico"><Megaphone size={22} strokeWidth={1.8}/></div>
                    <p style={{ fontSize: 15, fontWeight: 800, color: "#0f0f0f", margin: "0 0 6px" }}>No announcements found</p>
                    <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 18px" }}>
                      {activeTab === "list" ? "You haven't sent any announcements yet." : "Your inbox is empty."}
                    </p>
                    {hasFilters
                      ? <button className="ann-fbtn" style={{ margin: "0 auto" }} onClick={clearFilters}>Clear filters</button>
                      : <button className="ann-fbtn" style={{ margin: "0 auto" }} onClick={fetchData}><RefreshCw size={13} strokeWidth={2.5}/> Refresh</button>
                    }
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* ═══ PREVIEW MODAL ═══ */}
      {showPreview && previewData && (
        <div className="ann-backdrop" onClick={() => setShowPreview(false)}>
          <div className="ann-modal" onClick={e => e.stopPropagation()}>
            <div className="ann-modal-head">
              <div>
                <p className="ann-modal-title">Announcement Preview</p>
                <p className="ann-modal-sub">This is how your announcement will appear to recipients.</p>
              </div>
              <button className="ann-modal-x" onClick={() => setShowPreview(false)}><X size={15} strokeWidth={2.2}/></button>
            </div>
            <div className="ann-modal-body">
              {/* preview header */}
              <div style={{
                borderRadius: 16, overflow: "hidden", marginBottom: 16,
                background: "linear-gradient(135deg, color-mix(in srgb,var(--color-primary,#4f46e5) 8%,#fff), color-mix(in srgb,var(--color-secondary,#7c3aed) 6%,#fff))",
                border: "1px solid color-mix(in srgb,var(--color-primary,#4f46e5) 12%,transparent)",
                padding: "20px",
              }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                  {(() => { const m = getPriMeta(previewData.priority); const Icon = m.icon; return <span className={`ann-badge ${m.cls}`}><Icon size={11} strokeWidth={2.5}/>{m.label}</span>; })()}
                  <span className="ann-badge ann-bg-blue">Preview</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f0f0f", margin: "0 0 8px" }}>
                  {previewData.title || "Announcement Title"}
                </h3>
                <p style={{ fontSize: 12.5, color: "#6b7280", fontWeight: 500, margin: 0 }}>
                  To: {previewData.audienceLabel} · {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <div style={{ padding: "4px 0" }}>
                <p style={{ fontSize: 10, fontWeight: 800, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 8px" }}>Message</p>
                <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.8, margin: 0, whiteSpace: "pre-wrap" }}>
                  {previewData.message || "No message content."}
                </p>
              </div>
              {(previewData.scheduleDate || previewData.scheduleTime) && (
                <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 12, background: "#fffbeb", border: "1px solid #fef3c7" }}>
                  <p style={{ fontSize: 12.5, fontWeight: 700, color: "#92400e", margin: 0 }}>
                    Scheduled: {previewData.scheduleDate} {previewData.scheduleTime && `at ${previewData.scheduleTime}`}
                  </p>
                </div>
              )}
            </div>
            <div className="ann-modal-foot">
              <button className="ann-modal-btn-outline" onClick={() => setShowPreview(false)}>Close</button>
              <button className="ann-modal-btn-primary" onClick={() => { setShowPreview(false); handleSubmit(null, false); }}>
                <Send size={13} strokeWidth={2.5}/> Send Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;