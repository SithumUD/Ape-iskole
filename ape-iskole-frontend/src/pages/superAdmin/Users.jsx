import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiUser from "../../services/ApiUser";
import ApiSchool from "../../services/ApiSchool";
import {
  Users as UsersIcon, Search, SlidersHorizontal, X, Eye, Pencil,
  Trash2, CheckCircle, Clock, AlertCircle, RefreshCw, Plus,
  Save, RotateCcw, Zap, School, Shield, UserCheck, Crown,
  ShieldCheck, Mail, Phone, Building2, GraduationCap,
  ChevronDown, ArrowRight, User
} from "lucide-react";

/* ─── static data ─────────────────────────────────────── */
const ROLES = [
  { value: "super_admin",  label: "Super Admin",    icon: Crown,       color: "#7c3aed", bg: "#f5f3ff", cls: "usr-bg-purple", desc: "Full system control"         },
  { value: "school_admin", label: "School Admin",   icon: School,      color: "#2563eb", bg: "#eff6ff", cls: "usr-bg-blue",   desc: "Manage school content"       },
  { value: "moderator",    label: "Moderator",      icon: ShieldCheck, color: "#d97706", bg: "#fffbeb", cls: "usr-bg-yellow", desc: "Review and approve content"  },
];

const getRoleMeta = (r) => ROLES.find(x => x.value === r) || { label: r || "Unknown", icon: User, color: "#6b7280", bg: "#f9fafb", cls: "usr-bg-gray", desc: "" };

const initialForm = {
  fullName: "", email: "", role: "", schoolId: "",
  isStudent: false, phone: "", department: "",
};

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

/* ─── styles ──────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  .usr*{box-sizing:border-box}
  .usr{font-family:'Plus Jakarta Sans',sans-serif;display:flex;flex-direction:column;gap:24px;animation:fadeUp .45s ease both}

  /* head */
  .usr-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap}
  .usr-title{font-size:22px;font-weight:900;color:#0f0f0f;letter-spacing:-.4px;margin:0 0 4px}
  .usr-sub{font-size:13px;color:#9ca3af;font-weight:500;margin:0}
  .usr-head-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}

  /* buttons */
  .usr-btn-refresh{display:flex;align-items:center;gap:7px;padding:10px 18px;border-radius:50px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:700;color:#374151;cursor:pointer;font-family:inherit;transition:all .18s;white-space:nowrap}
  .usr-btn-refresh:hover{background:#f7f7f8;border-color:#d1d5db}
  .usr-btn-primary{display:flex;align-items:center;gap:7px;padding:10px 20px;border-radius:50px;border:none;background:linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;box-shadow:0 4px 14px color-mix(in srgb,var(--color-primary,#4f46e5) 28%,transparent);transition:all .2s;white-space:nowrap}
  .usr-btn-primary:hover{opacity:.9;transform:translateY(-1px)}
  .usr-btn-primary:disabled{opacity:.6;cursor:not-allowed;transform:none}

  /* stats */
  .usr-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px}
  .usr-stat{background:#fff;border-radius:18px;border:1px solid #f0f0f0;padding:18px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .usr-stat-icon{width:44px;height:44px;border-radius:13px;flex-shrink:0;display:flex;align-items:center;justify-content:center}
  .usr-stat-label{font-size:11px;font-weight:600;color:#9ca3af;margin:0 0 3px}
  .usr-stat-value{font-size:22px;font-weight:900;letter-spacing:-.5px;margin:0;color:#0f0f0f}

  /* tabs */
  .usr-tabs{background:#fff;border-radius:16px;border:1px solid #f0f0f0;padding:6px;display:flex;flex-wrap:wrap;gap:4px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .usr-tab{display:flex;align-items:center;gap:6px;padding:9px 18px;border-radius:11px;border:none;background:transparent;font-size:13px;font-weight:700;color:#6b7280;cursor:pointer;font-family:inherit;transition:all .18s}
  .usr-tab:hover{background:#f7f7f8;color:#111}
  .usr-tab.active{background:linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));color:#fff;box-shadow:0 3px 10px color-mix(in srgb,var(--color-primary,#4f46e5) 28%,transparent)}

  /* role distribution */
  .usr-role-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px}
  .usr-role-card{border-radius:18px;padding:20px;display:flex;align-items:center;justify-content:space-between}

  /* filter bar */
  .usr-filters{background:#fff;border-radius:18px;border:1px solid #f0f0f0;padding:20px 24px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .usr-filter-row{display:flex;flex-wrap:wrap;gap:14px;align-items:flex-end}
  .usr-filter-field{display:flex;flex-direction:column;gap:5px}
  .usr-filter-label{font-size:11px;font-weight:700;color:#9ca3af;letter-spacing:.1em;text-transform:uppercase}
  .usr-filter-input{height:42px;padding:0 13px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:500;color:#111;font-family:inherit;transition:border-color .18s;outline:none;width:100%}
  .usr-filter-input:focus{border-color:var(--color-primary,#4f46e5)}
  .usr-search-wrap{position:relative}
  .usr-search-icon{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:#9ca3af;pointer-events:none}
  .usr-filter-select{height:42px;padding:0 36px 0 13px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:600;color:#111;font-family:inherit;transition:border-color .18s;outline:none;appearance:none;cursor:pointer;min-width:150px}
  .usr-filter-select:focus{border-color:var(--color-primary,#4f46e5)}
  .usr-select-wrap{position:relative}
  .usr-select-arrow{position:absolute;right:11px;top:50%;transform:translateY(-50%);pointer-events:none}
  .usr-adv-toggle{display:flex;align-items:center;gap:6px;align-self:flex-end;padding:10px 15px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:700;color:#374151;cursor:pointer;font-family:inherit;transition:all .18s}
  .usr-adv-toggle:hover{background:#f7f7f8}
  .usr-adv-toggle.on{border-color:color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent);background:color-mix(in srgb,var(--color-primary,#4f46e5) 6%,transparent);color:var(--color-primary,#4f46e5)}
  .usr-clear-btn{display:flex;align-items:center;gap:5px;align-self:flex-end;padding:10px 14px;border-radius:12px;border:1.5px solid #fecaca;background:#fef2f2;font-size:13px;font-weight:700;color:#dc2626;cursor:pointer;font-family:inherit;transition:all .18s;white-space:nowrap}
  .usr-clear-btn:hover{background:#fee2e2}
  .usr-adv-panel{margin-top:16px;padding-top:16px;border-top:1px solid #f3f4f6;display:flex;flex-wrap:wrap;gap:14px}
  .usr-filter-tag{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:50px;font-size:11.5px;font-weight:700;background:#f3f4f6;color:#374151;cursor:default}
  .usr-filter-tag-x{background:none;border:none;cursor:pointer;color:#9ca3af;padding:1px;display:flex;align-items:center;transition:color .15s}
  .usr-filter-tag-x:hover{color:#dc2626}

  /* result row */
  .usr-result-row{display:flex;align-items:center;justify-content:space-between;gap:12px}
  .usr-result-count{font-size:18px;font-weight:800;color:#0f0f0f;letter-spacing:-.3px;margin:0}
  .usr-result-sub{font-size:12.5px;color:#9ca3af;font-weight:500}

  /* table card */
  .usr-card{background:#fff;border-radius:20px;border:1px solid #f0f0f0;box-shadow:0 1px 4px rgba(0,0,0,.04);overflow:hidden}
  .usr-table{width:100%;border-collapse:collapse}
  .usr-table thead{background:#fafafa}
  .usr-table th{padding:12px 16px;text-align:left;font-size:10.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#9ca3af;border-bottom:1px solid #f0f0f0}
  .usr-table td{padding:14px 16px;font-size:13px;color:#374151;border-bottom:1px solid #f7f7f8;vertical-align:middle}
  .usr-table tbody tr{transition:background .15s}
  .usr-table tbody tr:hover{background:#fafafa}
  .usr-table tbody tr:last-child td{border-bottom:none}
  .usr-table-name{font-size:13.5px;font-weight:800;color:#0f0f0f;margin:0 0 2px}
  .usr-table-sub{font-size:11.5px;color:#9ca3af;margin:0}

  /* badges */
  .usr-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:50px;font-size:11px;font-weight:700;white-space:nowrap}
  .usr-bg-green {color:#065f46;background:#d1fae5}
  .usr-bg-yellow{color:#92400e;background:#fef3c7}
  .usr-bg-red   {color:#991b1b;background:#fee2e2}
  .usr-bg-blue  {color:#1e40af;background:#dbeafe}
  .usr-bg-gray  {color:#4b5563;background:#f3f4f6}
  .usr-bg-purple{color:#5b21b6;background:#ede9fe}
  .usr-bg-orange{color:#9a3412;background:#ffedd5}

  /* avatar */
  .usr-avatar{width:38px;height:38px;border-radius:11px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#fff}

  /* action buttons */
  .usr-action-btn{display:inline-flex;align-items:center;gap:5px;padding:6px 11px;border-radius:9px;border:1.5px solid transparent;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .18s}
  .usr-action-view{border-color:#e5e7eb;background:#f7f7f8;color:#374151}
  .usr-action-view:hover{background:#e5e7eb}
  .usr-action-edit{border-color:#dbeafe;background:#eff6ff;color:#2563eb}
  .usr-action-edit:hover{background:#dbeafe}
  .usr-action-delete{border-color:#fecaca;background:#fef2f2;color:#dc2626}
  .usr-action-delete:hover{background:#fee2e2}

  /* spinner */
  .usr-spin{width:44px;height:44px;border-radius:50%;border:3px solid #f0f0f0;border-top-color:var(--color-primary,#4f46e5);animation:spin .75s linear infinite}
  .usr-spin-sm{width:15px;height:15px;border-radius:50%;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;animation:spin .75s linear infinite;flex-shrink:0}

  /* empty */
  .usr-empty{text-align:center;padding:64px 24px}
  .usr-empty-ico{width:60px;height:60px;border-radius:16px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;margin:0 auto 16px}

  /* register grid */
  .usr-register-grid{display:grid;grid-template-columns:1fr;gap:20px}
  @media(min-width:1024px){.usr-register-grid{grid-template-columns:2fr 1fr}}
  .usr-form-card{background:#fff;border-radius:20px;border:1px solid #f0f0f0;padding:28px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .usr-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .usr-field{display:flex;flex-direction:column;gap:5px}
  .usr-field-label{font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.1em}
  .usr-field-req{color:#ef4444}
  .usr-field-input{height:42px;padding:0 13px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:500;color:#111;font-family:inherit;transition:border-color .18s;outline:none;width:100%}
  .usr-field-input:focus{border-color:var(--color-primary,#4f46e5)}
  .usr-field-select{height:42px;padding:0 13px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:600;color:#111;font-family:inherit;transition:border-color .18s;outline:none;width:100%;appearance:none;cursor:pointer}
  .usr-field-select:focus{border-color:var(--color-primary,#4f46e5)}
  .usr-col-2{grid-column:1/-1}
  .usr-section-sep{font-size:9.5px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#c4c4c4;margin:4px 0 0;grid-column:1/-1}
  .usr-success-banner{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:14px;padding:14px 18px;display:flex;align-items:center;gap:12px;margin-bottom:20px}

  /* tip card */
  .usr-tip-card{background:#fff;border-radius:18px;border:1px solid #f0f0f0;padding:22px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .usr-tip-title{font-size:14px;font-weight:800;color:#0f0f0f;margin:0 0 14px;letter-spacing:-.2px}
  .usr-tip-item{display:flex;align-items:flex-start;gap:9px;font-size:13px;color:#4b5563;margin-bottom:10px;font-weight:500;line-height:1.55}
  .usr-tip-item:last-child{margin-bottom:0}
  .usr-tip-dot{width:6px;height:6px;border-radius:50%;background:var(--color-primary,#4f46e5);flex-shrink:0;margin-top:6px}
  .usr-role-info-item{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:12px;background:#fafafa;border:1px solid #f0f0f0;margin-bottom:10px}
  .usr-role-info-item:last-child{margin-bottom:0}
  .usr-role-info-icon{width:32px;height:32px;border-radius:9px;flex-shrink:0;display:flex;align-items:center;justify-content:center}

  /* modals */
  .usr-backdrop{position:fixed;inset:0;z-index:50;background:rgba(15,15,15,.65);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto}
  .usr-modal{background:#fff;border-radius:22px;width:100%;max-width:560px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 64px rgba(0,0,0,.2);display:flex;flex-direction:column;margin:auto}
  .usr-modal::-webkit-scrollbar{width:4px}
  .usr-modal::-webkit-scrollbar-thumb{background:#e5e7eb;border-radius:99px}
  .usr-modal-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:22px 28px 18px;border-bottom:1px solid #f3f4f6;position:sticky;top:0;background:#fafafa;z-index:2;border-radius:22px 22px 0 0}
  .usr-modal-title{font-size:17px;font-weight:900;color:#0f0f0f;margin:0 0 3px;letter-spacing:-.3px}
  .usr-modal-sub{font-size:12px;color:#9ca3af;margin:0;font-weight:500}
  .usr-modal-x{width:32px;height:32px;border-radius:10px;border:none;background:#f0f0f0;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#6b7280;transition:all .18s;flex-shrink:0}
  .usr-modal-x:hover{background:#e5e7eb;color:#374151}
  .usr-modal-body{padding:24px 28px;flex:1}
  .usr-modal-foot{padding:18px 28px;border-top:1px solid #f3f4f6;display:flex;gap:10px;position:sticky;bottom:0;background:#fff;border-radius:0 0 22px 22px}
  .usr-modal-cancel{flex:1;padding:11px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:700;color:#374151;cursor:pointer;font-family:inherit;transition:all .18s}
  .usr-modal-cancel:hover{background:#f7f7f8}
  .usr-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
  .usr-info-cell{background:#fafafa;border-radius:12px;padding:12px 14px;border:1px solid #f0f0f0}
  .usr-info-clabel{font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.1em;margin:0 0 4px}
  .usr-info-cval{font-size:14px;font-weight:800;color:#0f0f0f;margin:0}
  .usr-contact-row{display:flex;align-items:center;gap:9px;padding:10px 13px;border-radius:11px;background:#fafafa;border:1px solid #f0f0f0;margin-bottom:8px;font-size:13px;color:#374151;font-weight:500}

  /* confirm/delete */
  .usr-confirm-modal{background:#fff;border-radius:22px;width:100%;max-width:420px;padding:36px;box-shadow:0 24px 64px rgba(0,0,0,.2);text-align:center;margin:auto}
  .usr-confirm-ico{width:64px;height:64px;border-radius:20px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}
  .usr-confirm-title{font-size:20px;font-weight:900;color:#0f0f0f;margin:0 0 10px}
  .usr-confirm-sub{font-size:13.5px;color:#6b7280;line-height:1.65;margin:0 0 24px}
  .usr-confirm-btns{display:flex;gap:10px}
  .usr-confirm-cancel{flex:1;padding:12px;border-radius:13px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:700;color:#374151;cursor:pointer;font-family:inherit;transition:all .18s}
  .usr-confirm-cancel:hover{background:#f7f7f8}
  .usr-confirm-delete{flex:2;padding:12px;border-radius:13px;border:none;background:linear-gradient(135deg,#dc2626,#ef4444);color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 4px 14px rgba(220,38,38,.3)}

  /* section label */
  .usr-section-head{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:18px}
  .usr-section-label{display:inline-flex;align-items:center;gap:5px;font-size:10.5px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--color-primary,#4f46e5);background:color-mix(in srgb,var(--color-primary,#4f46e5) 9%,transparent);padding:3px 9px;border-radius:50px;margin-bottom:6px}
  .usr-section-title{font-size:18px;font-weight:800;color:#0f0f0f;letter-spacing:-.3px;margin:0}
  .usr-section-sub{font-size:12.5px;color:#9ca3af;font-weight:500;margin-top:3px}
`;

/* ─── helpers ─────────────────────────────────────────── */
const SectionHead = ({ label, title, sub }) => (
  <div className="usr-section-head">
    <div>
      {label && <span className="usr-section-label"><Zap size={10} strokeWidth={2.5}/>{label}</span>}
      <h2 className="usr-section-title">{title}</h2>
      {sub && <p className="usr-section-sub">{sub}</p>}
    </div>
  </div>
);

const StatusBadge = ({ user }) => {
  if (user.isVerified)
    return <span className="usr-badge usr-bg-green"><CheckCircle size={11} strokeWidth={2.5}/>Active</span>;
  return <span className="usr-badge usr-bg-yellow"><Clock size={11} strokeWidth={2.5}/>Pending</span>;
};

const RoleBadge = ({ role }) => {
  const meta = getRoleMeta(role);
  const Icon = meta.icon;
  return <span className={`usr-badge ${meta.cls}`}><Icon size={11} strokeWidth={2.5}/>{meta.label}</span>;
};

const SelectWrap = ({ value, onChange, children, style = {} }) => (
  <div className="usr-select-wrap" style={{ position: "relative", ...style }}>
    <select className="usr-filter-select" value={value} onChange={onChange}>{children}</select>
    <ChevronDown size={13} color="#9ca3af" strokeWidth={2.5} className="usr-select-arrow" />
  </div>
);

const Field = ({ label, required, children, col2 = false }) => (
  <div className={`usr-field${col2 ? " usr-col-2" : ""}`}>
    <label className="usr-field-label">{label}{required && <span className="usr-field-req"> *</span>}</label>
    {children}
  </div>
);

const getAvatarColor = (name = "") => {
  const colors = ["#4f46e5","#7c3aed","#059669","#d97706","#2563eb","#db2777","#0891b2"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
};

const getInitials = (name = "") => {
  const parts = name.trim().split(" ");
  return parts.length >= 2 ? parts[0][0] + parts[1][0] : name.slice(0, 2);
};

/* ═══════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════ */
const UsersManagement = () => {
  const navigate = useNavigate();
  const [formData,       setFormData]       = useState(initialForm);
  const [submitted,      setSubmitted]       = useState(false);
  const [isSubmitting,   setIsSubmitting]    = useState(false);
  const [search,         setSearch]          = useState("");
  const [roleFilter,     setRoleFilter]      = useState("All");
  const [statusFilter,   setStatusFilter]    = useState("All");
  const [schoolFilter,   setSchoolFilter]    = useState("All");
  const [showFilters,    setShowFilters]     = useState(false);
  const [activeTab,      setActiveTab]       = useState("list");
  const [users,          setUsers]           = useState([]);
  const [schools,        setSchools]         = useState([]);
  const [isLoading,      setIsLoading]       = useState(true);
  const [selectedUser,   setSelectedUser]    = useState(null);
  const [showViewModal,  setShowViewModal]   = useState(false);
  const [showDeleteModal,setShowDeleteModal] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await ApiUser.getUsers({
        searchTerm: search || null,
        role:       roleFilter === "All" ? null : roleFilter,
        schoolId:   schoolFilter === "All" ? null : schoolFilter,
      });
      setUsers(res.data);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const fetchSchools = async () => {
    try { const res = await ApiSchool.getSchools(); setSchools(res.data); }
    catch (e) { console.error(e); }
  };

  useEffect(() => { fetchUsers(); }, [search, roleFilter, statusFilter, schoolFilter]);
  useEffect(() => { fetchSchools(); }, []);

  const counts = useMemo(() => ({
    total:       users.length,
    active:      users.filter(u => u.isVerified).length,
    pending:     users.filter(u => !u.isVerified).length,
    superAdmins: users.filter(u => u.role === "super_admin").length,
    schoolAdmins:users.filter(u => u.role === "school_admin").length,
    moderators:  users.filter(u => u.role === "moderator").length,
  }), [users]);

  const hasFilters = search || roleFilter !== "All" || statusFilter !== "All" || schoolFilter !== "All";

  const clearFilters = () => {
    setSearch(""); setRoleFilter("All"); setStatusFilter("All"); setSchoolFilter("All");
  };

  /* form */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.role) {
      alert("Please fill in all required fields"); return;
    }
    if (formData.role === "school_admin" && !formData.schoolId) {
      alert("School is required for School Admin role"); return;
    }
    setIsSubmitting(true);
    try {
      await ApiUser.createUser(formData);
      setSubmitted(true);
      setFormData(initialForm);
      fetchUsers();
      setTimeout(() => setSubmitted(false), 3000);
    } catch { alert("Creation failed. Please try again."); }
    finally { setIsSubmitting(false); }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    try {
      await ApiUser.deleteUser(selectedUser.id);
      fetchUsers(); setShowDeleteModal(false); setSelectedUser(null);
    } catch { console.error("Failed to delete user"); }
  };

  return (
    <div className="usr">
      <style>{styles}</style>

      {/* ═══ HEAD ═══ */}
      <div className="usr-head">
        <div>
          <h1 className="usr-title">Users Management</h1>
          <p className="usr-sub">Manage platform users, assign roles, and control access for school admins and moderators.</p>
        </div>
        <div className="usr-head-actions">
          <button className="usr-btn-refresh" onClick={fetchUsers}>
            <RefreshCw size={13} strokeWidth={2.5}/> Refresh
          </button>
          <button className="usr-btn-primary" onClick={() => setActiveTab("create")}>
            <Plus size={14} strokeWidth={2.5}/> Add New User
          </button>
        </div>
      </div>

      {/* ═══ STATS ═══ */}
      <div className="usr-stats">
        {[
          { label: "Total Users",   value: counts.total,       icon: UsersIcon,  bg: "#eff6ff", color: "#2563eb" },
          { label: "Active Users",  value: counts.active,      icon: CheckCircle,bg: "#ecfdf5", color: "#059669" },
          { label: "Pending",       value: counts.pending,     icon: Clock,      bg: "#fffbeb", color: "#d97706" },
          { label: "School Admins", value: counts.schoolAdmins,icon: School,     bg: "#f5f3ff", color: "#7c3aed" },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="usr-stat">
            <div className="usr-stat-icon" style={{ background: bg, color }}>
              <Icon size={20} strokeWidth={2}/>
            </div>
            <div>
              <p className="usr-stat-label">{label}</p>
              <p className="usr-stat-value">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ ROLE DISTRIBUTION ═══ */}
      <div className="usr-role-grid">
        {[
          { label: "Super Administrators", value: counts.superAdmins,  color: "#7c3aed", bg: "linear-gradient(135deg,#f5f3ff,#ede9fe)", border: "#ddd6fe", icon: Crown      },
          { label: "School Administrators",value: counts.schoolAdmins, color: "#2563eb", bg: "linear-gradient(135deg,#eff6ff,#dbeafe)", border: "#bfdbfe", icon: School     },
          { label: "Content Moderators",   value: counts.moderators,   color: "#d97706", bg: "linear-gradient(135deg,#fffbeb,#fef3c7)", border: "#fde68a", icon: ShieldCheck},
        ].map(({ label, value, color, bg, border, icon: Icon }) => (
          <div key={label} className="usr-role-card" style={{ background: bg, border: `1px solid ${border}` }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color, margin: "0 0 5px" }}>{label}</p>
              <p style={{ fontSize: 26, fontWeight: 900, color, margin: 0, letterSpacing: "-.5px" }}>{value}</p>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `color-mix(in srgb,${color} 12%,transparent)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={22} color={color} strokeWidth={2}/>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ TABS ═══ */}
      <div className="usr-tabs">
        {[
          { id: "list",   label: "Manage Users",  icon: UsersIcon },
          { id: "create", label: "Add New User",  icon: Plus      },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} className={`usr-tab ${activeTab === id ? "active" : ""}`} onClick={() => setActiveTab(id)}>
            <Icon size={13} strokeWidth={2.2}/>{label}
          </button>
        ))}
      </div>

      {/* ═══ CREATE TAB ═══ */}
      {activeTab === "create" && (
        <div className="usr-register-grid">
          <div className="usr-form-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10.5, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--color-primary,#4f46e5)", background: "color-mix(in srgb,var(--color-primary,#4f46e5) 9%,transparent)", padding: "3px 9px", borderRadius: 50, marginBottom: 6 }}>
                  <Zap size={10} strokeWidth={2.5}/>Create User
                </span>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f0f0f", margin: 0, letterSpacing: "-.3px" }}>Add New Platform User</h2>
              </div>
              <span className="usr-badge usr-bg-green"><ShieldCheck size={10} strokeWidth={2.5}/>Admin Only</span>
            </div>

            {submitted && (
              <div className="usr-success-banner">
                <CheckCircle size={18} color="#059669" strokeWidth={2}/>
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 700, color: "#065f46", margin: "0 0 2px" }}>User created successfully!</p>
                  <p style={{ fontSize: 12, color: "#059669", margin: 0 }}>An invitation email has been dispatched to the user.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="usr-form-grid">
                <Field label="Full Name" required col2>
                  <input name="fullName" value={formData.fullName} onChange={handleChange} className="usr-field-input" placeholder="Enter full name"/>
                </Field>

                <p className="usr-section-sep">Contact</p>

                <Field label="Email" required>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="usr-field-input" placeholder="user@email.com"/>
                </Field>
                <Field label="Phone">
                  <input name="phone" value={formData.phone} onChange={handleChange} className="usr-field-input" placeholder="+94 xx xxx xxxx"/>
                </Field>

                <p className="usr-section-sep">Role & Access</p>

                <Field label="Role" required>
                  <select name="role" value={formData.role} onChange={handleChange} className="usr-field-select">
                    <option value="">Select role</option>
                    {ROLES.map(r => <option key={r.value} value={r.value}>{r.label} — {r.desc}</option>)}
                  </select>
                </Field>
                <Field label="Assigned School">
                  <select name="schoolId" value={formData.schoolId} onChange={handleChange} className="usr-field-select">
                    <option value="">Select school</option>
                    <option value="Platform">Platform (Global)</option>
                    {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </Field>
                <Field label="Department" col2>
                  <input name="department" value={formData.department} onChange={handleChange} className="usr-field-input" placeholder="e.g. Administration, Content Team"/>
                </Field>

                <div className="usr-col-2" style={{ display: "flex", gap: 10, paddingTop: 8, borderTop: "1px solid #f3f4f6", marginTop: 4 }}>
                  <button type="submit" disabled={isSubmitting} className="usr-btn-primary" style={{ borderRadius: 12, padding: "11px 24px" }}>
                    {isSubmitting
                      ? <><div className="usr-spin-sm"/>Creating…</>
                      : <><UserCheck size={14} strokeWidth={2.5}/>Create User</>
                    }
                  </button>
                  <button type="button" onClick={() => setFormData(initialForm)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 18px", borderRadius: 12, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 13, fontWeight: 700, color: "#374151", cursor: "pointer", fontFamily: "inherit" }}>
                    <RotateCcw size={13} strokeWidth={2.5}/>Reset
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="usr-tip-card">
              <p className="usr-tip-title">Role Overview</p>
              {ROLES.map(({ value, label, icon: Icon, color, bg, desc }) => (
                <div key={value} className="usr-role-info-item">
                  <div className="usr-role-info-icon" style={{ background: bg, color }}>
                    <Icon size={15} strokeWidth={2}/>
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 800, color: "#0f0f0f", margin: "0 0 2px" }}>{label}</p>
                    <p style={{ fontSize: 11.5, color: "#9ca3af", margin: 0 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="usr-tip-card">
              <p className="usr-tip-title">Best Practices</p>
              {[
                "Assign roles based on user responsibilities",
                "School admins must be linked to their school",
                "Regularly review and deactivate inactive accounts",
                "Users receive invitation emails upon creation",
              ].map((tip, i) => (
                <div key={i} className="usr-tip-item"><span className="usr-tip-dot"/>{tip}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ LIST TAB ═══ */}
      {activeTab === "list" && (
        <>
          {/* Filters */}
          <div className="usr-filters">
            <div className="usr-filter-row">
              <div className="usr-filter-field" style={{ flex: "1 1 240px" }}>
                <label className="usr-filter-label">Search</label>
                <div className="usr-search-wrap">
                  <Search size={14} strokeWidth={2.2} className="usr-search-icon"/>
                  <input
                    className="usr-filter-input" style={{ paddingLeft: 38 }}
                    placeholder="Name, email or school…"
                    value={search} onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="usr-filter-field">
                <label className="usr-filter-label">Role</label>
                <SelectWrap value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
                  <option value="All">All Roles</option>
                  {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </SelectWrap>
              </div>

              <div className="usr-filter-field">
                <label className="usr-filter-label">Status</label>
                <SelectWrap value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                </SelectWrap>
              </div>

              <button className={`usr-adv-toggle ${showFilters ? "on" : ""}`} onClick={() => setShowFilters(v => !v)}>
                <SlidersHorizontal size={13} strokeWidth={2.2}/> Filters
              </button>

              {hasFilters && (
                <button className="usr-clear-btn" onClick={clearFilters}>
                  <X size={13} strokeWidth={2.5}/> Clear
                </button>
              )}
            </div>

            {/* Advanced panel */}
            {showFilters && (
              <div className="usr-adv-panel">
                <div className="usr-filter-field">
                  <label className="usr-filter-label">School</label>
                  <SelectWrap value={schoolFilter} onChange={e => setSchoolFilter(e.target.value)}>
                    <option value="All">All Schools</option>
                    <option value="Platform">Platform (Global)</option>
                    {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </SelectWrap>
                </div>
              </div>
            )}

            {/* Active filter tags */}
            {hasFilters && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14, paddingTop: 14, borderTop: "1px solid #f3f4f6" }}>
                {search && (
                  <span className="usr-filter-tag">Search: {search}
                    <button className="usr-filter-tag-x" onClick={() => setSearch("")}><X size={10} strokeWidth={2.5}/></button>
                  </span>
                )}
                {roleFilter !== "All" && (
                  <span className="usr-filter-tag">Role: {getRoleMeta(roleFilter).label}
                    <button className="usr-filter-tag-x" onClick={() => setRoleFilter("All")}><X size={10} strokeWidth={2.5}/></button>
                  </span>
                )}
                {statusFilter !== "All" && (
                  <span className="usr-filter-tag">Status: {statusFilter}
                    <button className="usr-filter-tag-x" onClick={() => setStatusFilter("All")}><X size={10} strokeWidth={2.5}/></button>
                  </span>
                )}
                {schoolFilter !== "All" && (
                  <span className="usr-filter-tag">School: {schoolFilter}
                    <button className="usr-filter-tag-x" onClick={() => setSchoolFilter("All")}><X size={10} strokeWidth={2.5}/></button>
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Result count */}
          <div className="usr-result-row">
            <p className="usr-result-count">{users.length} {users.length === 1 ? "User" : "Users"}</p>
            <span className="usr-result-sub">Total platform users</span>
          </div>

          {/* Table */}
          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "64px 24px", gap: 14 }}>
              <div className="usr-spin"/>
              <p style={{ fontSize: 13, color: "#9ca3af", fontWeight: 600 }}>Loading users…</p>
            </div>
          ) : users.length === 0 ? (
            <div className="usr-card">
              <div className="usr-empty">
                <div className="usr-empty-ico"><UsersIcon size={26} color="#9ca3af" strokeWidth={1.8}/></div>
                <p style={{ fontSize: 15, fontWeight: 800, color: "#0f0f0f", margin: "0 0 6px" }}>No users found</p>
                <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 20px" }}>Try adjusting your filters or search term.</p>
                <button className="usr-btn-primary" style={{ margin: "0 auto", borderRadius: 12 }} onClick={clearFilters}>
                  <RotateCcw size={13} strokeWidth={2.5}/> Clear Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="usr-card">
              <div style={{ overflowX: "auto" }}>
                <table className="usr-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>School</th>
                      <th>Status</th>
                      <th>Joined</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        {/* User */}
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div
                              className="usr-avatar"
                              style={{ background: getAvatarColor(user.fullName) }}
                            >
                              {getInitials(user.fullName || "?")}
                            </div>
                            <div>
                              <p className="usr-table-name">{user.fullName}</p>
                              <p className="usr-table-sub">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        {/* Role */}
                        <td><RoleBadge role={user.role}/></td>
                        {/* School */}
                        <td style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>
                          {user.schoolName || "Platform"}
                        </td>
                        {/* Status */}
                        <td><StatusBadge user={user}/></td>
                        {/* Joined */}
                        <td style={{ fontSize: 12.5, color: "#9ca3af", fontWeight: 500 }}>
                          {formatDate(user.createdAt)}
                        </td>
                        {/* Actions */}
                        <td style={{ textAlign: "right" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                            <button
                              className="usr-action-btn usr-action-view"
                              onClick={() => { setSelectedUser(user); setShowViewModal(true); }}
                            >
                              <Eye size={12} strokeWidth={2.5}/> View
                            </button>
                            <button
                              className="usr-action-btn usr-action-edit"
                              onClick={() => navigate(`/super-admin/users/edit/${user.id}`)}
                            >
                              <Pencil size={12} strokeWidth={2.5}/> Edit
                            </button>
                            <button
                              className="usr-action-btn usr-action-delete"
                              onClick={() => { setSelectedUser(user); setShowDeleteModal(true); }}
                            >
                              <Trash2 size={12} strokeWidth={2.5}/> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ═══ VIEW MODAL ═══ */}
      {showViewModal && selectedUser && (() => {
        const meta = getRoleMeta(selectedUser.role);
        const RoleIcon = meta.icon;
        return (
          <div className="usr-backdrop" onClick={() => setShowViewModal(false)}>
            <div className="usr-modal" onClick={e => e.stopPropagation()}>
              <div className="usr-modal-head">
                <div>
                  <p className="usr-modal-title">User Profile</p>
                  <p className="usr-modal-sub">{selectedUser.email}</p>
                </div>
                <button className="usr-modal-x" onClick={() => setShowViewModal(false)}><X size={15} strokeWidth={2.2}/></button>
              </div>

              <div className="usr-modal-body">
                {/* Avatar + name */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                  <div style={{ width: 64, height: 64, borderRadius: 18, background: getAvatarColor(selectedUser.fullName), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, color: "#fff", flexShrink: 0 }}>
                    {getInitials(selectedUser.fullName || "?")}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 18, fontWeight: 900, color: "#0f0f0f", margin: "0 0 6px", letterSpacing: "-.3px" }}>{selectedUser.fullName}</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      <RoleBadge role={selectedUser.role}/>
                      <StatusBadge user={selectedUser}/>
                    </div>
                  </div>
                </div>

                {/* Info grid */}
                <div className="usr-info-grid">
                  <div className="usr-info-cell">
                    <p className="usr-info-clabel">Joined</p>
                    <p className="usr-info-cval" style={{ fontSize: 13 }}>{formatDate(selectedUser.createdAt)}</p>
                  </div>
                  <div className="usr-info-cell">
                    <p className="usr-info-clabel">School</p>
                    <p className="usr-info-cval" style={{ fontSize: 13 }}>{selectedUser.schoolName || "Platform"}</p>
                  </div>
                  {selectedUser.department && (
                    <div className="usr-info-cell">
                      <p className="usr-info-clabel">Department</p>
                      <p className="usr-info-cval" style={{ fontSize: 13 }}>{selectedUser.department}</p>
                    </div>
                  )}
                  <div className="usr-info-cell">
                    <p className="usr-info-clabel">Verification</p>
                    <p className="usr-info-cval" style={{ fontSize: 13 }}>{selectedUser.isVerified ? "Verified" : "Unverified"}</p>
                  </div>
                </div>

                {/* Contact */}
                <p style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: ".16em", textTransform: "uppercase", color: "#c4c4c4", margin: "0 0 10px" }}>Contact</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    { icon: Mail,  val: selectedUser.email },
                    { icon: Phone, val: selectedUser.phone },
                  ].filter(r => r.val).map(({ icon: Icon, val }, i) => (
                    <div key={i} className="usr-contact-row">
                      <Icon size={13} color="var(--color-primary,#4f46e5)" strokeWidth={2}/>
                      <span>{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="usr-modal-foot">
                <button className="usr-modal-cancel" onClick={() => setShowViewModal(false)}>Close</button>
                <button
                  className="usr-btn-primary"
                  style={{ borderRadius: 12 }}
                  onClick={() => { setShowViewModal(false); navigate(`/super-admin/users/edit/${selectedUser.id}`); }}
                >
                  <Pencil size={13} strokeWidth={2.5}/> Edit User
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ═══ DELETE MODAL ═══ */}
      {showDeleteModal && selectedUser && (
        <div className="usr-backdrop">
          <div className="usr-confirm-modal">
            <div className="usr-confirm-ico" style={{ background: "#fee2e2", color: "#dc2626" }}>
              <Trash2 size={28} strokeWidth={2}/>
            </div>
            <p className="usr-confirm-title">Delete User</p>
            <p className="usr-confirm-sub">
              Are you sure you want to delete <strong>{selectedUser.fullName}</strong>?
              This will permanently remove their access and profile data.
            </p>
            <div className="usr-confirm-btns">
              <button className="usr-confirm-cancel" onClick={() => { setShowDeleteModal(false); setSelectedUser(null); }}>
                Cancel
              </button>
              <button className="usr-confirm-delete" onClick={handleDeleteConfirm}>
                <Trash2 size={14} strokeWidth={2.5}/> Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;