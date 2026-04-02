import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiSchool from "../../services/ApiSchool";
import {
  School, CheckCircle, X, Clock, AlertCircle, RefreshCw,
  Search, MapPin, Phone, Mail, Users, GraduationCap,
  Zap, Plus, Pencil, Eye, SlidersHorizontal, ChevronDown,
  Landmark, Building2, Globe2, FileText, Save, Loader2,
  ShieldCheck, Star, Trophy, Image as ImageIcon, Globe,
  RotateCcw, ArrowRight
} from "lucide-react";

/* ─── static data ─────────────────────────────────────── */
const DISTRICTS = ["All", "Colombo", "Gampaha", "Kalutara", "Kandy", "Galle"];

const initialForm = {
  name: "", type: "", description: "", registrationNumber: "",
  contact: { email: "", phone: "", district: "", city: "", address: "", website: "" },
  startedYear: "", studentCount: "", teachersCount: "",
  latitude: 0, longitude: 0,
  leadership: [{ name: "", position: "Principal" }],
  academicStreams: [], schoolFacilities: [], clubsAndSocieties: [],
  achievements: [], sponsors: [], socialMediaUrls: [],
};

/* ─── styles ──────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  .sm*{box-sizing:border-box}
  .sm{font-family:'Plus Jakarta Sans',sans-serif;display:flex;flex-direction:column;gap:24px;animation:fadeUp .45s ease both}

  /* head */
  .sm-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap}
  .sm-title{font-size:22px;font-weight:900;color:#0f0f0f;letter-spacing:-.4px;margin:0 0 4px}
  .sm-sub{font-size:13px;color:#9ca3af;font-weight:500;margin:0}
  .sm-head-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}

  /* buttons */
  .sm-btn-refresh{display:flex;align-items:center;gap:7px;padding:10px 18px;border-radius:50px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:700;color:#374151;cursor:pointer;font-family:inherit;transition:all .18s;white-space:nowrap}
  .sm-btn-refresh:hover{background:#f7f7f8;border-color:#d1d5db}
  .sm-btn-primary{display:flex;align-items:center;gap:7px;padding:10px 20px;border-radius:50px;border:none;background:linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;box-shadow:0 4px 14px color-mix(in srgb,var(--color-primary,#4f46e5) 28%,transparent);transition:all .2s;white-space:nowrap}
  .sm-btn-primary:hover{opacity:.9;transform:translateY(-1px)}
  .sm-btn-primary:disabled{opacity:.6;cursor:not-allowed;transform:none}

  /* stats */
  .sm-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px}
  .sm-stat{background:#fff;border-radius:18px;border:1px solid #f0f0f0;padding:18px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .sm-stat-icon{width:44px;height:44px;border-radius:13px;flex-shrink:0;display:flex;align-items:center;justify-content:center}
  .sm-stat-label{font-size:11px;font-weight:600;color:#9ca3af;margin:0 0 3px}
  .sm-stat-value{font-size:22px;font-weight:900;letter-spacing:-.5px;margin:0;color:#0f0f0f}

  /* tabs */
  .sm-tabs{background:#fff;border-radius:16px;border:1px solid #f0f0f0;padding:6px;display:flex;flex-wrap:wrap;gap:4px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .sm-tab{display:flex;align-items:center;gap:6px;padding:9px 18px;border-radius:11px;border:none;background:transparent;font-size:13px;font-weight:700;color:#6b7280;cursor:pointer;font-family:inherit;transition:all .18s}
  .sm-tab:hover{background:#f7f7f8;color:#111}
  .sm-tab.active{background:linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));color:#fff;box-shadow:0 3px 10px color-mix(in srgb,var(--color-primary,#4f46e5) 28%,transparent)}

  /* filter bar */
  .sm-filters{background:#fff;border-radius:18px;border:1px solid #f0f0f0;padding:20px 24px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .sm-filter-row{display:flex;flex-wrap:wrap;gap:14px;align-items:flex-end}
  .sm-filter-field{display:flex;flex-direction:column;gap:5px}
  .sm-filter-label{font-size:11px;font-weight:700;color:#9ca3af;letter-spacing:.1em;text-transform:uppercase}
  .sm-filter-input{height:42px;padding:0 14px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:500;color:#111;font-family:inherit;transition:border-color .18s;outline:none}
  .sm-filter-input:focus{border-color:var(--color-primary,#4f46e5)}
  .sm-search-wrap{position:relative}
  .sm-search-icon{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:#9ca3af;pointer-events:none}
  .sm-filter-select{height:42px;padding:0 36px 0 13px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:600;color:#111;font-family:inherit;transition:border-color .18s;outline:none;appearance:none;cursor:pointer;min-width:150px}
  .sm-filter-select:focus{border-color:var(--color-primary,#4f46e5)}
  .sm-select-wrap{position:relative}
  .sm-select-arrow{position:absolute;right:11px;top:50%;transform:translateY(-50%);pointer-events:none}
  .sm-adv-toggle{display:flex;align-items:center;gap:6px;align-self:flex-end;padding:10px 15px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:700;color:#374151;cursor:pointer;font-family:inherit;transition:all .18s}
  .sm-adv-toggle:hover{background:#f7f7f8}
  .sm-adv-toggle.on{border-color:color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent);background:color-mix(in srgb,var(--color-primary,#4f46e5) 6%,transparent);color:var(--color-primary,#4f46e5)}
  .sm-clear-btn{display:flex;align-items:center;gap:5px;align-self:flex-end;padding:10px 14px;border-radius:12px;border:1.5px solid #fecaca;background:#fef2f2;font-size:13px;font-weight:700;color:#dc2626;cursor:pointer;font-family:inherit;transition:all .18s;white-space:nowrap}
  .sm-clear-btn:hover{background:#fee2e2}
  .sm-adv-panel{margin-top:16px;padding-top:16px;border-top:1px solid #f3f4f6;display:flex;flex-wrap:wrap;gap:14px}
  .sm-filter-tag{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:50px;font-size:11.5px;font-weight:700;background:#f3f4f6;color:#374151;cursor:default}
  .sm-filter-tag-x{background:none;border:none;cursor:pointer;color:#9ca3af;padding:1px;display:flex;align-items:center;transition:color .15s}
  .sm-filter-tag-x:hover{color:#dc2626}

  /* result count */
  .sm-result-row{display:flex;align-items:center;justify-content:space-between;gap:12px}
  .sm-result-count{font-size:18px;font-weight:800;color:#0f0f0f;letter-spacing:-.3px;margin:0}
  .sm-result-sub{font-size:12.5px;color:#9ca3af;font-weight:500}

  /* card */
  .sm-card{background:#fff;border-radius:20px;border:1px solid #f0f0f0;box-shadow:0 1px 4px rgba(0,0,0,.04);overflow:hidden}

  /* table */
  .sm-table{width:100%;border-collapse:collapse}
  .sm-table thead{background:#fafafa}
  .sm-table th{padding:12px 16px;text-align:left;font-size:10.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#9ca3af;border-bottom:1px solid #f0f0f0}
  .sm-table td{padding:14px 16px;font-size:13px;color:#374151;border-bottom:1px solid #f7f7f8;vertical-align:middle}
  .sm-table tbody tr{transition:background .15s}
  .sm-table tbody tr:hover{background:#fafafa}
  .sm-table tbody tr:last-child td{border-bottom:none}
  .sm-table-name{font-size:13.5px;font-weight:800;color:#0f0f0f;margin:0 0 2px}
  .sm-table-sub{font-size:11.5px;color:#9ca3af;margin:0}

  /* badges */
  .sm-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:50px;font-size:11px;font-weight:700;white-space:nowrap}
  .sm-bg-green {color:#065f46;background:#d1fae5}
  .sm-bg-yellow{color:#92400e;background:#fef3c7}
  .sm-bg-red   {color:#991b1b;background:#fee2e2}
  .sm-bg-blue  {color:#1e40af;background:#dbeafe}
  .sm-bg-gray  {color:#4b5563;background:#f3f4f6}
  .sm-bg-purple{color:#5b21b6;background:#ede9fe}
  .sm-bg-cyan  {color:#0e7490;background:#ecfeff}

  /* action buttons */
  .sm-action-btn{display:inline-flex;align-items:center;gap:5px;padding:6px 11px;border-radius:9px;border:1.5px solid transparent;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .18s}
  .sm-action-view{border-color:#e5e7eb;background:#f7f7f8;color:#374151}
  .sm-action-view:hover{background:#e5e7eb}
  .sm-action-edit{border-color:#dbeafe;background:#eff6ff;color:#2563eb}
  .sm-action-edit:hover{background:#dbeafe}
  .sm-action-approve{border-color:#bbf7d0;background:#f0fdf4;color:#059669}
  .sm-action-approve:hover{background:#dcfce7}
  .sm-action-reject{border-color:#fecaca;background:#fef2f2;color:#dc2626}
  .sm-action-reject:hover{background:#fee2e2}

  /* spinner */
  .sm-spin{width:44px;height:44px;border-radius:50%;border:3px solid #f0f0f0;border-top-color:var(--color-primary,#4f46e5);animation:spin .75s linear infinite}
  .sm-spin-sm{width:15px;height:15px;border-radius:50%;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;animation:spin .75s linear infinite;flex-shrink:0}

  /* type dist cards */
  .sm-type-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px}
  .sm-type-card{border-radius:18px;padding:20px;display:flex;align-items:center;justify-content:space-between}

  /* empty */
  .sm-empty{text-align:center;padding:64px 24px}
  .sm-empty-ico{width:60px;height:60px;border-radius:16px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;margin:0 auto 16px}

  /* register form */
  .sm-register-grid{display:grid;grid-template-columns:1fr;gap:20px}
  @media(min-width:1024px){.sm-register-grid{grid-template-columns:2fr 1fr}}
  .sm-form-card{background:#fff;border-radius:20px;border:1px solid #f0f0f0;padding:28px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .sm-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  .sm-field{display:flex;flex-direction:column;gap:5px}
  .sm-field-label{font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.1em;display:flex;align-items:center;gap:5px}
  .sm-field-input{height:42px;padding:0 13px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:500;color:#111;font-family:inherit;transition:border-color .18s;outline:none;width:100%}
  .sm-field-input:focus{border-color:var(--color-primary,#4f46e5)}
  .sm-field-textarea{padding:10px 13px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:500;color:#111;font-family:inherit;transition:border-color .18s;outline:none;width:100%;resize:vertical;line-height:1.6}
  .sm-field-textarea:focus{border-color:var(--color-primary,#4f46e5)}
  .sm-field-select{height:42px;padding:0 13px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:600;color:#111;font-family:inherit;transition:border-color .18s;outline:none;width:100%;appearance:none;cursor:pointer}
  .sm-field-select:focus{border-color:var(--color-primary,#4f46e5)}
  .sm-col-2{grid-column:1/-1}
  .sm-section-sep{font-size:9.5px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#c4c4c4;margin:4px 0 0;grid-column:1/-1}
  .sm-success-banner{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:14px;padding:14px 18px;display:flex;align-items:center;gap:12px;margin-bottom:20px}

  /* tip card */
  .sm-tip-card{background:#fff;border-radius:18px;border:1px solid #f0f0f0;padding:22px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .sm-tip-title{font-size:14px;font-weight:800;color:#0f0f0f;margin:0 0 14px;letter-spacing:-.2px}
  .sm-tip-item{display:flex;align-items:flex-start;gap:9px;font-size:13px;color:#4b5563;margin-bottom:10px;font-weight:500;line-height:1.55}
  .sm-tip-item:last-child{margin-bottom:0}
  .sm-tip-dot{width:6px;height:6px;border-radius:50%;background:var(--color-primary,#4f46e5);flex-shrink:0;margin-top:6px}
  .sm-doc-item{display:flex;align-items:center;gap:9px;font-size:13px;color:#4b5563;margin-bottom:10px;font-weight:500}
  .sm-doc-icon{width:28px;height:28px;border-radius:8px;background:color-mix(in srgb,var(--color-primary,#4f46e5) 9%,transparent);display:flex;align-items:center;justify-content:center;flex-shrink:0}

  /* ── MODALS ── */
  .sm-backdrop{position:fixed;inset:0;z-index:50;background:rgba(15,15,15,.65);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto}
  .sm-modal{background:#fff;border-radius:22px;width:100%;max-width:680px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 64px rgba(0,0,0,.2);display:flex;flex-direction:column;margin:auto}
  .sm-modal-lg{max-width:860px}
  .sm-modal::-webkit-scrollbar{width:4px}
  .sm-modal::-webkit-scrollbar-thumb{background:#e5e7eb;border-radius:99px}
  .sm-modal-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:22px 28px 18px;border-bottom:1px solid #f3f4f6;position:sticky;top:0;background:#fff;z-index:2;border-radius:22px 22px 0 0;background:#fafafa}
  .sm-modal-title{font-size:18px;font-weight:900;color:#0f0f0f;margin:0 0 3px;letter-spacing:-.3px}
  .sm-modal-sub{font-size:12px;color:#9ca3af;margin:0;font-weight:500}
  .sm-modal-x{width:32px;height:32px;border-radius:10px;border:none;background:#f0f0f0;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#6b7280;transition:all .18s;flex-shrink:0}
  .sm-modal-x:hover{background:#e5e7eb;color:#374151}
  .sm-modal-body{padding:24px 28px;flex:1}
  .sm-modal-foot{padding:18px 28px;border-top:1px solid #f3f4f6;display:flex;gap:10px;position:sticky;bottom:0;background:#fff;border-radius:0 0 22px 22px}

  /* view modal */
  .sm-view-cover{height:200px;position:relative;overflow:hidden;border-radius:22px 22px 0 0}
  .sm-view-logo{position:absolute;bottom:-20px;left:24px;width:72px;height:72px;border-radius:16px;background:#fff;border:3px solid #fff;box-shadow:0 4px 16px rgba(0,0,0,.12);display:flex;align-items:center;justify-content:center;overflow:hidden}
  .sm-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
  .sm-info-cell{background:#fafafa;border-radius:12px;padding:12px 14px;border:1px solid #f0f0f0}
  .sm-info-clabel{font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.1em;margin:0 0 3px}
  .sm-info-cval{font-size:14px;font-weight:800;color:#0f0f0f;margin:0}
  .sm-contact-row{display:flex;align-items:center;gap:9px;padding:10px 13px;border-radius:11px;background:#fafafa;border:1px solid #f0f0f0;margin-bottom:8px;font-size:13px;color:#374151;font-weight:500}
  .sm-contact-row:last-child{margin-bottom:0}
  .sm-leader-card{display:flex;align-items:center;gap:10px;padding:10px 13px;border-radius:11px;background:#fafafa;border:1px solid #f0f0f0;margin-bottom:8px}
  .sm-leader-avatar{width:32px;height:32px;border-radius:9px;background:color-mix(in srgb,var(--color-primary,#4f46e5) 10%,transparent);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:var(--color-primary,#4f46e5);flex-shrink:0}
  .sm-section-label{font-size:9.5px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#c4c4c4;margin:20px 0 10px}
  .sm-gallery-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
  .sm-gallery-item{aspect-ratio:16/9;border-radius:12px;overflow:hidden;border:1.5px solid #f0f0f0;cursor:pointer;position:relative}
  .sm-gallery-item img{width:100%;height:100%;object-fit:cover;transition:transform .4s}
  .sm-gallery-item:hover img{transform:scale(1.07)}

  /* confirm modals */
  .sm-confirm-modal{background:#fff;border-radius:22px;width:100%;max-width:440px;padding:36px;box-shadow:0 24px 64px rgba(0,0,0,.2);text-align:center;margin:auto}
  .sm-confirm-ico{width:64px;height:64px;border-radius:20px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}
  .sm-confirm-title{font-size:20px;font-weight:900;color:#0f0f0f;margin:0 0 10px}
  .sm-confirm-sub{font-size:13.5px;color:#6b7280;line-height:1.65;margin:0 0 24px}
  .sm-confirm-btns{display:flex;gap:10px}
  .sm-confirm-cancel{flex:1;padding:12px;border-radius:13px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:700;color:#374151;cursor:pointer;font-family:inherit;transition:all .18s}
  .sm-confirm-cancel:hover{background:#f7f7f8}
  .sm-confirm-approve{flex:2;padding:12px;border-radius:13px;border:none;background:linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 4px 14px color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent)}
  .sm-confirm-reject{flex:2;padding:12px;border-radius:13px;border:none;background:linear-gradient(135deg,#dc2626,#ef4444);color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 4px 14px rgba(220,38,38,.3)}
  .sm-reject-textarea{width:100%;padding:10px 13px;border-radius:12px;border:1.5px solid #e5e7eb;font-size:13px;font-weight:500;color:#111;font-family:inherit;outline:none;resize:vertical;line-height:1.6;margin-bottom:16px}
  .sm-reject-textarea:focus{border-color:#ef4444}

  /* modal form */
  .sm-modal-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .sm-modal-cancel{flex:1;padding:11px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:700;color:#374151;cursor:pointer;font-family:inherit;transition:all .18s}
  .sm-modal-cancel:hover{background:#f7f7f8}
  .sm-modal-submit{padding:11px 24px;border-radius:12px;border:none;background:linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:7px;box-shadow:0 4px 14px color-mix(in srgb,var(--color-primary,#4f46e5) 28%,transparent)}
  .sm-modal-submit:disabled{opacity:.6;cursor:not-allowed}
`;

/* ─── helpers ─────────────────────────────────────────── */
const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const getStatus = (school) => school.isApproved ? "Approved" : school.isRejected ? "Rejected" : "Pending";
const getStatusCls = (school) => {
  const s = getStatus(school);
  return s === "Approved" ? "sm-bg-green" : s === "Rejected" ? "sm-bg-red" : "sm-bg-yellow";
};
const getStatusIcon = (school) => {
  const s = getStatus(school);
  return s === "Approved" ? CheckCircle : s === "Rejected" ? AlertCircle : Clock;
};

const TYPE_META = {
  Government:    { icon: Landmark,  color: "#059669", bg: "#ecfdf5", cls: "sm-bg-green"  },
  Private:       { icon: Building2, color: "#2563eb", bg: "#eff6ff", cls: "sm-bg-blue"   },
  International: { icon: Globe2,    color: "#7c3aed", bg: "#f5f3ff", cls: "sm-bg-purple" },
};
const getTypeMeta = (t) => TYPE_META[t] || { icon: School, color: "#6b7280", bg: "#f9fafb", cls: "sm-bg-gray" };

const getPrincipalName = (school) =>
  school.leadership?.find(l => l.position === "Principal")?.name || "Not assigned";

/* ─── sub-components ─────────────────────────────────── */
const SelectWrap = ({ value, onChange, children, style = {} }) => (
  <div className="sm-select-wrap" style={{ position: "relative", ...style }}>
    <select className="sm-filter-select" value={value} onChange={onChange}>{children}</select>
    <ChevronDown size={13} color="#9ca3af" strokeWidth={2.5} className="sm-select-arrow" />
  </div>
);

const Field = ({ label, children, col2 = false }) => (
  <div className={`sm-field${col2 ? " sm-col-2" : ""}`}>
    <label className="sm-field-label">{label}</label>
    {children}
  </div>
);

/* ═══════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════ */
const SchoolsManagement = () => {
  const [formData,        setFormData]        = useState(initialForm);
  const [submitted,       setSubmitted]        = useState(false);
  const [isSubmitting,    setIsSubmitting]     = useState(false);
  const [search,          setSearch]           = useState("");
  const [statusFilter,    setStatusFilter]     = useState("All");
  const [typeFilter,      setTypeFilter]       = useState("All");
  const [districtFilter,  setDistrictFilter]   = useState("All");
  const [showFilters,     setShowFilters]      = useState(false);
  const [activeTab,       setActiveTab]        = useState("list");
  const [schools,         setSchools]          = useState([]);
  const [isLoading,       setIsLoading]        = useState(true);
  const [selectedSchool,  setSelectedSchool]   = useState(null);
  const [showViewModal,   setShowViewModal]    = useState(false);
  const [showEditModal,   setShowEditModal]    = useState(false);
  const [showApproveModal,setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal]  = useState(false);
  const [rejectionReason, setRejectionReason]  = useState("");
  const [editFormData,    setEditFormData]     = useState(initialForm);

  const fetchSchools = async () => {
    setIsLoading(true);
    try {
      const res = await ApiSchool.getSchools({
        searchTerm: search || null,
        type: typeFilter === "All" ? null : typeFilter,
      });
      setSchools(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchSchools(); }, [search, statusFilter, typeFilter, districtFilter]);

  const statusCounts = useMemo(() => ({
    total:         schools.length,
    approved:      schools.filter(s => s.isApproved).length,
    pending:       schools.filter(s => !s.isApproved && !s.isRejected).length,
    rejected:      schools.filter(s => s.isRejected).length,
    government:    schools.filter(s => s.type === "Government").length,
    private:       schools.filter(s => s.type === "Private").length,
    international: schools.filter(s => s.type === "International").length,
  }), [schools]);

  const filteredSchools = useMemo(() => schools.filter(s => {
    const matchStatus   = statusFilter   === "All" || getStatus(s) === statusFilter;
    const matchDistrict = districtFilter === "All" || s.contact?.district === districtFilter;
    return matchStatus && matchDistrict;
  }), [schools, statusFilter, districtFilter]);

  const hasFilters = search || statusFilter !== "All" || typeFilter !== "All" || districtFilter !== "All";

  const clearFilters = () => { setSearch(""); setStatusFilter("All"); setTypeFilter("All"); setDistrictFilter("All"); };

  /* form handlers */
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("contact.")) {
      const f = name.split(".")[1];
      setFormData(p => ({ ...p, contact: { ...p.contact, [f]: value } }));
    } else if (name === "principalName") {
      setFormData(p => ({ ...p, leadership: [{ name: value, position: "Principal" }] }));
    } else {
      setFormData(p => ({ ...p, [name]: value }));
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("contact.")) {
      const f = name.split(".")[1];
      setEditFormData(p => ({ ...p, contact: { ...p.contact, [f]: value } }));
    } else if (name === "principalName") {
      setEditFormData(p => ({ ...p, leadership: [{ name: value, position: "Principal" }] }));
    } else {
      setEditFormData(p => ({ ...p, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.contact.email || !formData.contact.phone) {
      alert("Please fill in all required fields"); return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        startedYear:   parseInt(formData.startedYear)   || 0,
        studentCount:  parseInt(formData.studentCount)  || 0,
        teachersCount: parseInt(formData.teachersCount) || 0,
        leadership:    formData.leadership.filter(l => l.name.trim()),
      };
      await ApiSchool.registerSchool(payload);
      setSubmitted(true);
      setFormData(initialForm);
      fetchSchools();
      setTimeout(() => setSubmitted(false), 3000);
    } catch { alert("Registration failed. Please try again."); }
    finally { setIsSubmitting(false); }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editFormData.name || !editFormData.type || !editFormData.contact.email || !editFormData.contact.phone) {
      alert("Please fill in all required fields"); return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        ...editFormData,
        startedYear:   parseInt(editFormData.startedYear)   || 0,
        studentCount:  parseInt(editFormData.studentCount)  || 0,
        teachersCount: parseInt(editFormData.teachersCount) || 0,
        leadership:    editFormData.leadership.filter(l => l.name.trim()),
      };
      await ApiSchool.updateSchool(selectedSchool.id, payload);
      setShowEditModal(false);
      fetchSchools();
    } catch { alert("Update failed. Please try again."); }
    finally { setIsSubmitting(false); }
  };

  const confirmApprove = async () => {
    try { await ApiSchool.approveSchool(selectedSchool.id); fetchSchools(); setShowApproveModal(false); setSelectedSchool(null); }
    catch { alert("Failed to approve school."); }
  };

  const confirmReject = async () => {
    if (!rejectionReason.trim()) { alert("Please provide a reason."); return; }
    try {
      await ApiSchool.rejectSchool(selectedSchool.id, rejectionReason);
      fetchSchools(); setShowRejectModal(false); setSelectedSchool(null); setRejectionReason("");
    } catch { alert("Failed to reject school."); }
  };

  return (
    <div className="sm">
      <style>{styles}</style>

      {/* ═══ HEAD ═══ */}
      <div className="sm-head">
        <div>
          <h1 className="sm-title">Schools Management</h1>
          <p className="sm-sub">Register, review and manage school profiles across the platform.</p>
        </div>
        <div className="sm-head-actions">
          <button className="sm-btn-refresh" onClick={fetchSchools}>
            <RefreshCw size={13} strokeWidth={2.5} /> Refresh
          </button>
          <button className="sm-btn-primary" onClick={() => setActiveTab("register")}>
            <Plus size={14} strokeWidth={2.5} /> Register School
          </button>
        </div>
      </div>

      {/* ═══ STATS ═══ */}
      <div className="sm-stats">
        {[
          { label: "Total Schools",  value: statusCounts.total,    icon: School,       bg: "#eff6ff", color: "#2563eb" },
          { label: "Approved",       value: statusCounts.approved,  icon: CheckCircle,  bg: "#ecfdf5", color: "#059669" },
          { label: "Pending Review", value: statusCounts.pending,   icon: Clock,        bg: "#fffbeb", color: "#d97706" },
          { label: "Rejected",       value: statusCounts.rejected,  icon: AlertCircle,  bg: "#fef2f2", color: "#ef4444" },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="sm-stat">
            <div className="sm-stat-icon" style={{ background: bg, color }}>
              <Icon size={20} strokeWidth={2} />
            </div>
            <div>
              <p className="sm-stat-label">{label}</p>
              <p className="sm-stat-value">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ TABS ═══ */}
      <div className="sm-tabs">
        {[
          { id: "list",     label: "Manage Schools",    icon: School    },
          { id: "register", label: "Register New School", icon: Plus    },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} className={`sm-tab ${activeTab === id ? "active" : ""}`} onClick={() => setActiveTab(id)}>
            <Icon size={13} strokeWidth={2.2} />{label}
          </button>
        ))}
      </div>

      {/* ═══ REGISTER TAB ═══ */}
      {activeTab === "register" && (
        <div className="sm-register-grid">
          <div className="sm-form-card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10.5, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--color-primary,#4f46e5)", background: "color-mix(in srgb,var(--color-primary,#4f46e5) 9%,transparent)", padding: "3px 9px", borderRadius: 50, marginBottom: 6 }}>
                  <Zap size={10} strokeWidth={2.5} />Manual Registration
                </span>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f0f0f", margin: 0, letterSpacing: "-.3px" }}>Register New School</h2>
              </div>
              <span className="sm-badge sm-bg-green"><CheckCircle size={10} strokeWidth={2.5} />Admin Only</span>
            </div>

            {submitted && (
              <div className="sm-success-banner">
                <CheckCircle size={18} color="#059669" strokeWidth={2} />
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 700, color: "#065f46", margin: "0 0 2px" }}>School registered successfully!</p>
                  <p style={{ fontSize: 12, color: "#059669", margin: 0 }}>The school has been added and is pending review.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="sm-form-grid">
                <Field label="School Name *" col2><input name="name" value={formData.name} onChange={handleChange} className="sm-field-input" placeholder="Enter school name" /></Field>

                <p className="sm-section-sep">Classification</p>

                <Field label="School Type *">
                  <select name="type" value={formData.type} onChange={handleChange} className="sm-field-select">
                    <option value="">Select type</option>
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                    <option value="International">International</option>
                  </select>
                </Field>
                <Field label="Registration Number">
                  <input name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className="sm-field-input" placeholder="GOV/COL/001" />
                </Field>

                <Field label="Description" col2>
                  <textarea name="description" value={formData.description} onChange={handleChange} className="sm-field-textarea" rows={3} placeholder="Brief school description…" />
                </Field>

                <p className="sm-section-sep">Contact</p>

                <Field label="Email *"><input type="email" name="contact.email" value={formData.contact.email} onChange={handleChange} className="sm-field-input" placeholder="school@email.com" /></Field>
                <Field label="Phone *"><input name="contact.phone" value={formData.contact.phone} onChange={handleChange} className="sm-field-input" placeholder="+94 xx xxx xxxx" /></Field>
                <Field label="District">
                  <select name="contact.district" value={formData.contact.district} onChange={handleChange} className="sm-field-select">
                    <option value="">Select district</option>
                    {DISTRICTS.filter(d => d !== "All").map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </Field>
                <Field label="City"><input name="contact.city" value={formData.contact.city} onChange={handleChange} className="sm-field-input" placeholder="City" /></Field>
                <Field label="Website"><input name="contact.website" value={formData.contact.website} onChange={handleChange} className="sm-field-input" placeholder="https://…" /></Field>
                <Field label="Address" col2><textarea name="contact.address" value={formData.contact.address} onChange={handleChange} className="sm-field-textarea" rows={2} placeholder="School address…" /></Field>

                <p className="sm-section-sep">Details</p>

                <Field label="Principal Name"><input name="principalName" value={formData.leadership[0]?.name || ""} onChange={handleChange} className="sm-field-input" placeholder="Full name" /></Field>
                <Field label="Established Year"><input type="number" name="startedYear" value={formData.startedYear} onChange={handleChange} className="sm-field-input" placeholder="e.g. 1895" /></Field>
                <Field label="Total Students"><input type="number" name="studentCount" value={formData.studentCount} onChange={handleChange} className="sm-field-input" placeholder="Number" /></Field>
                <Field label="Total Teachers"><input type="number" name="teachersCount" value={formData.teachersCount} onChange={handleChange} className="sm-field-input" placeholder="Number" /></Field>

                <div className="sm-col-2" style={{ display: "flex", gap: 10, paddingTop: 8, borderTop: "1px solid #f3f4f6", marginTop: 4 }}>
                  <button type="submit" disabled={isSubmitting} className="sm-btn-primary" style={{ borderRadius: 12, padding: "11px 24px" }}>
                    {isSubmitting ? <><div className="sm-spin-sm" />Registering…</> : <><Save size={14} strokeWidth={2.5} />Register School</>}
                  </button>
                  <button type="button" onClick={() => setFormData(initialForm)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "11px 18px", borderRadius: 12, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 13, fontWeight: 700, color: "#374151", cursor: "pointer", fontFamily: "inherit" }}>
                    <RotateCcw size={13} strokeWidth={2.5} />Reset
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Tips sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="sm-tip-card">
              <p className="sm-tip-title">Registration Tips</p>
              {["Verify school documents before registration", "Ensure accurate contact information", "Add principal details for admin access", "Complete all required fields marked with *"].map((tip, i) => (
                <div key={i} className="sm-tip-item"><span className="sm-tip-dot" />{tip}</div>
              ))}
            </div>
            <div className="sm-tip-card">
              <p className="sm-tip-title">Required Documents</p>
              {[
                { icon: FileText, label: "School registration certificate" },
                { icon: GraduationCap, label: "Principal's ID copy" },
                { icon: School, label: "School profile / brochure" },
                { icon: Mail, label: "Official school email proof" },
              ].map(({ icon: Icon, label }, i) => (
                <div key={i} className="sm-doc-item">
                  <div className="sm-doc-icon"><Icon size={13} color="var(--color-primary,#4f46e5)" strokeWidth={2} /></div>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ LIST TAB ═══ */}
      {activeTab === "list" && (
        <>
          {/* Filters */}
          <div className="sm-filters">
            <div className="sm-filter-row">
              <div className="sm-filter-field" style={{ flex: "1 1 240px" }}>
                <label className="sm-filter-label">Search</label>
                <div className="sm-search-wrap">
                  <Search size={14} strokeWidth={2.2} className="sm-search-icon" />
                  <input className="sm-filter-input" style={{ paddingLeft: 38 }} placeholder="Search schools…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
              <div className="sm-filter-field">
                <label className="sm-filter-label">Status</label>
                <SelectWrap value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="All">All Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </SelectWrap>
              </div>
              <div className="sm-filter-field">
                <label className="sm-filter-label">Type</label>
                <SelectWrap value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                  <option value="All">All Types</option>
                  <option value="Government">Government</option>
                  <option value="Private">Private</option>
                  <option value="International">International</option>
                </SelectWrap>
              </div>
              <button className={`sm-adv-toggle ${showFilters ? "on" : ""}`} onClick={() => setShowFilters(v => !v)}>
                <SlidersHorizontal size={13} strokeWidth={2.2} /> Filters
              </button>
              {hasFilters && (
                <button className="sm-clear-btn" onClick={clearFilters}>
                  <X size={13} strokeWidth={2.5} /> Clear
                </button>
              )}
            </div>

            {showFilters && (
              <div className="sm-adv-panel">
                <div className="sm-filter-field">
                  <label className="sm-filter-label">District</label>
                  <SelectWrap value={districtFilter} onChange={e => setDistrictFilter(e.target.value)}>
                    {DISTRICTS.map(d => <option key={d} value={d}>{d === "All" ? "All Districts" : d}</option>)}
                  </SelectWrap>
                </div>
              </div>
            )}

            {hasFilters && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14, paddingTop: 14, borderTop: "1px solid #f3f4f6" }}>
                {search && <span className="sm-filter-tag">Search: {search}<button className="sm-filter-tag-x" onClick={() => setSearch("")}><X size={10} strokeWidth={2.5} /></button></span>}
                {statusFilter !== "All" && <span className="sm-filter-tag">Status: {statusFilter}<button className="sm-filter-tag-x" onClick={() => setStatusFilter("All")}><X size={10} strokeWidth={2.5} /></button></span>}
                {typeFilter !== "All" && <span className="sm-filter-tag">Type: {typeFilter}<button className="sm-filter-tag-x" onClick={() => setTypeFilter("All")}><X size={10} strokeWidth={2.5} /></button></span>}
                {districtFilter !== "All" && <span className="sm-filter-tag">District: {districtFilter}<button className="sm-filter-tag-x" onClick={() => setDistrictFilter("All")}><X size={10} strokeWidth={2.5} /></button></span>}
              </div>
            )}
          </div>

          {/* Result count */}
          <div className="sm-result-row">
            <p className="sm-result-count">{filteredSchools.length} {filteredSchools.length === 1 ? "School" : "Schools"}</p>
            <span className="sm-result-sub">Showing {filteredSchools.length} of {schools.length}</span>
          </div>

          {/* Table */}
          {isLoading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "64px 24px", gap: 14 }}>
              <div className="sm-spin" />
              <p style={{ fontSize: 13, color: "#9ca3af", fontWeight: 600 }}>Loading schools…</p>
            </div>
          ) : filteredSchools.length === 0 ? (
            <div className="sm-card">
              <div className="sm-empty">
                <div className="sm-empty-ico"><School size={26} color="#9ca3af" strokeWidth={1.8} /></div>
                <p style={{ fontSize: 15, fontWeight: 800, color: "#0f0f0f", margin: "0 0 6px" }}>No schools found</p>
                <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 20px" }}>Try adjusting your filters or search term.</p>
                <button className="sm-btn-primary" style={{ margin: "0 auto", borderRadius: 12 }} onClick={clearFilters}>
                  <RotateCcw size={13} strokeWidth={2.5} /> Clear Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="sm-card">
              <div style={{ overflowX: "auto" }}>
                <table className="sm-table">
                  <thead>
                    <tr>
                      <th>School</th>
                      <th>Type</th>
                      <th>Location</th>
                      <th>Principal</th>
                      <th>Contact</th>
                      <th>Status</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSchools.map(school => {
                      const typeMeta = getTypeMeta(school.type);
                      const TypeIcon = typeMeta.icon;
                      const StatusIcon = getStatusIcon(school);
                      return (
                        <tr key={school.id}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 38, height: 38, borderRadius: 10, background: typeMeta.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden", border: "1.5px solid #f0f0f0" }}>
                                {school.logoUrl
                                  ? <img src={school.logoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                  : <TypeIcon size={17} color={typeMeta.color} strokeWidth={2} />
                                }
                              </div>
                              <div>
                                <p className="sm-table-name">{school.name}</p>
                                <p className="sm-table-sub">Est. {school.startedYear || "—"}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                              <span className={`sm-badge ${typeMeta.cls}`}><TypeIcon size={10} strokeWidth={2.5} />{school.type}</span>
                              <span style={{ fontSize: 11.5, color: "#9ca3af", fontWeight: 500 }}><Users size={10} strokeWidth={2} style={{ display: "inline", marginRight: 3 }} />{(school.studentCount || 0).toLocaleString()} students</span>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{school.contact?.city || "—"}</div>
                            <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{school.contact?.district || "—"}</div>
                          </td>
                          <td>
                            <div style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{getPrincipalName(school)}</div>
                          </td>
                          <td>
                            <div style={{ fontSize: 12.5, color: "#374151" }}>{school.contact?.phone || "—"}</div>
                            <div style={{ fontSize: 11.5, color: "#9ca3af" }}>{school.contact?.email || "—"}</div>
                          </td>
                          <td>
                            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                              <span className={`sm-badge ${getStatusCls(school)}`}><StatusIcon size={10} strokeWidth={2.5} />{getStatus(school)}</span>
                              <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>{formatDate(school.createdAt)}</span>
                            </div>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 5, flexWrap: "wrap" }}>
                              <button className="sm-action-btn sm-action-view" onClick={() => { setSelectedSchool(school); setShowViewModal(true); }}>
                                <Eye size={12} strokeWidth={2.5} /> View
                              </button>
                              <button className="sm-action-btn sm-action-edit" onClick={() => { setSelectedSchool(school); setEditFormData({ ...school, contact: school.contact || initialForm.contact, leadership: school.leadership || initialForm.leadership }); setShowEditModal(true); }}>
                                <Pencil size={12} strokeWidth={2.5} /> Edit
                              </button>
                              {getStatus(school) === "Pending" && (
                                <>
                                  <button className="sm-action-btn sm-action-approve" onClick={() => { setSelectedSchool(school); setShowApproveModal(true); }}>
                                    <CheckCircle size={12} strokeWidth={2.5} /> Approve
                                  </button>
                                  <button className="sm-action-btn sm-action-reject" onClick={() => { setSelectedSchool(school); setShowRejectModal(true); }}>
                                    <X size={12} strokeWidth={2.5} /> Reject
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Type distribution */}
          <div className="sm-type-grid">
            {[
              { label: "Government Schools",    value: statusCounts.government,    color: "#059669", bg: "linear-gradient(135deg,#f0fdf4,#ecfdf5)", border: "#bbf7d0", icon: Landmark  },
              { label: "Private Schools",       value: statusCounts.private,       color: "#2563eb", bg: "linear-gradient(135deg,#eff6ff,#dbeafe)",  border: "#bfdbfe", icon: Building2 },
              { label: "International Schools", value: statusCounts.international, color: "#7c3aed", bg: "linear-gradient(135deg,#f5f3ff,#ede9fe)",  border: "#ddd6fe", icon: Globe2    },
            ].map(({ label, value, color, bg, border, icon: Icon }) => (
              <div key={label} className="sm-type-card" style={{ background: bg, border: `1px solid ${border}` }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color, margin: "0 0 5px" }}>{label}</p>
                  <p style={{ fontSize: 26, fontWeight: 900, color, margin: 0, letterSpacing: "-.5px" }}>{value}</p>
                </div>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `color-mix(in srgb,${color} 12%,transparent)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={22} color={color} strokeWidth={2} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ═══ VIEW MODAL ═══ */}
      {showViewModal && selectedSchool && (
        <div className="sm-backdrop" onClick={() => setShowViewModal(false)}>
          <div className="sm-modal sm-modal-lg" onClick={e => e.stopPropagation()}>
            {/* Cover */}
            <div className="sm-view-cover">
              {selectedSchool.coverImageUrl
                ? <img src={selectedSchool.coverImageUrl} alt="Cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg,#1e1b4b,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed))" }} />
              }
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,.5) 0%,transparent 60%)" }} />
              <button className="sm-modal-x" style={{ position: "absolute", top: 14, right: 14 }} onClick={() => setShowViewModal(false)}><X size={15} strokeWidth={2.2} /></button>
              <div className="sm-view-logo">
                {selectedSchool.logoUrl
                  ? <img src={selectedSchool.logoUrl} alt="Logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : (() => { const { icon: Icon, color, bg } = getTypeMeta(selectedSchool.type); return <div style={{ width: "100%", height: "100%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 13 }}><Icon size={28} color={color} strokeWidth={1.8} /></div>; })()
                }
              </div>
            </div>

            <div style={{ padding: "28px 28px 0", paddingTop: 36 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: "#0f0f0f", margin: "0 0 8px", letterSpacing: "-.4px" }}>{selectedSchool.name}</h2>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {(() => { const { cls, icon: Icon, color } = getTypeMeta(selectedSchool.type); return <span className={`sm-badge ${cls}`}><Icon size={10} strokeWidth={2.5} />{selectedSchool.type}</span>; })()}
                    {(() => { const s = getStatus(selectedSchool); const StatusIcon = getStatusIcon(selectedSchool); return <span className={`sm-badge ${getStatusCls(selectedSchool)}`}><StatusIcon size={10} strokeWidth={2.5} />{s}</span>; })()}
                    {selectedSchool.isVerified && <span className="sm-badge sm-bg-green"><ShieldCheck size={10} strokeWidth={2.5} />Verified</span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
                  <button className="sm-action-btn sm-action-edit" onClick={() => { setShowViewModal(false); setEditFormData({ ...selectedSchool, contact: selectedSchool.contact || initialForm.contact, leadership: selectedSchool.leadership || initialForm.leadership }); setShowEditModal(true); }}>
                    <Pencil size={12} strokeWidth={2.5} /> Edit
                  </button>
                  {getStatus(selectedSchool) === "Pending" && (
                    <button className="sm-action-btn sm-action-approve" onClick={() => { setShowViewModal(false); setShowApproveModal(true); }}>
                      <CheckCircle size={12} strokeWidth={2.5} /> Approve
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="sm-modal-body" style={{ paddingTop: 4 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  {selectedSchool.description && (
                    <>
                      <p className="sm-section-label">About</p>
                      <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.75, margin: "0 0 16px" }}>{selectedSchool.description}</p>
                    </>
                  )}
                  <p className="sm-section-label">School Info</p>
                  <div className="sm-info-grid">
                    <div className="sm-info-cell"><p className="sm-info-clabel">Est. Year</p><p className="sm-info-cval">{selectedSchool.startedYear || "—"}</p></div>
                    <div className="sm-info-cell"><p className="sm-info-clabel">Students</p><p className="sm-info-cval">{(selectedSchool.studentCount || 0).toLocaleString()}</p></div>
                    <div className="sm-info-cell"><p className="sm-info-clabel">Teachers</p><p className="sm-info-cval">{selectedSchool.teachersCount || "—"}</p></div>
                    <div className="sm-info-cell"><p className="sm-info-clabel">Registered</p><p className="sm-info-cval">{formatDate(selectedSchool.createdAt)}</p></div>
                  </div>
                  {selectedSchool.leadership?.length > 0 && (
                    <>
                      <p className="sm-section-label">Leadership</p>
                      {selectedSchool.leadership.map((l, i) => (
                        <div key={i} className="sm-leader-card">
                          <div className="sm-leader-avatar">{l.name?.[0] || "?"}</div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "#0f0f0f", margin: 0 }}>{l.name}</p>
                            <p style={{ fontSize: 11.5, color: "#9ca3af", margin: 0 }}>{l.position}</p>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
                <div>
                  <p className="sm-section-label">Contact Information</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { icon: MapPin, val: selectedSchool.contact?.address ? `${selectedSchool.contact.address}, ${selectedSchool.contact.city || ""}, ${selectedSchool.contact.district || ""}` : null },
                      { icon: Phone, val: selectedSchool.contact?.phone },
                      { icon: Mail,  val: selectedSchool.contact?.email },
                      { icon: Globe, val: selectedSchool.contact?.website },
                    ].filter(r => r.val).map(({ icon: Icon, val }, i) => (
                      <div key={i} className="sm-contact-row">
                        <Icon size={13} color="var(--color-primary,#4f46e5)" strokeWidth={2} />
                        <span style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedSchool.photoGallery?.length > 0 && (
                <>
                  <p className="sm-section-label">Photo Gallery</p>
                  <div className="sm-gallery-grid">
                    {selectedSchool.photoGallery.map((img, i) => (
                      <div key={i} className="sm-gallery-item"><img src={img} alt={`Gallery ${i + 1}`} /></div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ EDIT MODAL ═══ */}
      {showEditModal && selectedSchool && (
        <div className="sm-backdrop" onClick={() => setShowEditModal(false)}>
          <div className="sm-modal sm-modal-lg" onClick={e => e.stopPropagation()}>
            <div className="sm-modal-head">
              <div>
                <p className="sm-modal-title">Edit School Profile</p>
                <p className="sm-modal-sub">Update organization details for {selectedSchool.name}</p>
              </div>
              <button className="sm-modal-x" onClick={() => setShowEditModal(false)}><X size={15} strokeWidth={2.2} /></button>
            </div>
            <form onSubmit={handleUpdateSubmit}>
              <div className="sm-modal-body">
                <div className="sm-modal-form-grid">
                  <Field label="School Name *" col2><input name="name" value={editFormData.name} onChange={handleEditChange} className="sm-field-input" /></Field>
                  <Field label="Type *">
                    <select name="type" value={editFormData.type} onChange={handleEditChange} className="sm-field-select">
                      <option value="Government">Government</option>
                      <option value="Private">Private</option>
                      <option value="International">International</option>
                    </select>
                  </Field>
                  <Field label="Registration No"><input name="registrationNumber" value={editFormData.registrationNumber} onChange={handleEditChange} className="sm-field-input" /></Field>
                  <Field label="Description" col2><textarea name="description" value={editFormData.description} onChange={handleEditChange} className="sm-field-textarea" rows={3} /></Field>
                  <Field label="Email *"><input type="email" name="contact.email" value={editFormData.contact?.email || ""} onChange={handleEditChange} className="sm-field-input" /></Field>
                  <Field label="Phone *"><input name="contact.phone" value={editFormData.contact?.phone || ""} onChange={handleEditChange} className="sm-field-input" /></Field>
                  <Field label="District">
                    <select name="contact.district" value={editFormData.contact?.district || ""} onChange={handleEditChange} className="sm-field-select">
                      {DISTRICTS.filter(d => d !== "All").map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </Field>
                  <Field label="City"><input name="contact.city" value={editFormData.contact?.city || ""} onChange={handleEditChange} className="sm-field-input" /></Field>
                  <Field label="Principal Name"><input name="principalName" value={editFormData.leadership?.[0]?.name || ""} onChange={handleEditChange} className="sm-field-input" /></Field>
                  <Field label="Website"><input name="contact.website" value={editFormData.contact?.website || ""} onChange={handleEditChange} className="sm-field-input" /></Field>
                  <Field label="Est. Year"><input type="number" name="startedYear" value={editFormData.startedYear} onChange={handleEditChange} className="sm-field-input" /></Field>
                  <Field label="Students"><input type="number" name="studentCount" value={editFormData.studentCount} onChange={handleEditChange} className="sm-field-input" /></Field>
                  <Field label="Teachers"><input type="number" name="teachersCount" value={editFormData.teachersCount} onChange={handleEditChange} className="sm-field-input" /></Field>
                  <Field label="Address" col2><textarea name="contact.address" value={editFormData.contact?.address || ""} onChange={handleEditChange} className="sm-field-textarea" rows={2} /></Field>
                </div>
              </div>
              <div className="sm-modal-foot">
                <button type="button" className="sm-modal-cancel" onClick={() => setShowEditModal(false)} disabled={isSubmitting}>Discard</button>
                <button type="submit" className="sm-modal-submit" disabled={isSubmitting}>
                  {isSubmitting ? <><div className="sm-spin-sm" />Saving…</> : <><Save size={14} strokeWidth={2.5} />Save Changes</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ APPROVE MODAL ═══ */}
      {showApproveModal && selectedSchool && (
        <div className="sm-backdrop">
          <div className="sm-confirm-modal">
            <div className="sm-confirm-ico" style={{ background: "#d1fae5", color: "#059669" }}>
              <CheckCircle size={28} strokeWidth={2} />
            </div>
            <p className="sm-confirm-title">Approve School</p>
            <p className="sm-confirm-sub">
              Approving <strong>{selectedSchool.name}</strong> will activate their profile and grant them access to publish content on the platform.
            </p>
            <div className="sm-confirm-btns">
              <button className="sm-confirm-cancel" onClick={() => setShowApproveModal(false)}>Cancel</button>
              <button className="sm-confirm-approve" onClick={confirmApprove}>
                <CheckCircle size={14} strokeWidth={2.5} /> Approve School
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ REJECT MODAL ═══ */}
      {showRejectModal && selectedSchool && (
        <div className="sm-backdrop">
          <div className="sm-confirm-modal">
            <div className="sm-confirm-ico" style={{ background: "#fee2e2", color: "#dc2626" }}>
              <AlertCircle size={28} strokeWidth={2} />
            </div>
            <p className="sm-confirm-title">Reject School</p>
            <p className="sm-confirm-sub">
              Rejecting <strong>{selectedSchool.name}</strong> will deny their access request. Please provide a reason below.
            </p>
            <textarea
              className="sm-reject-textarea"
              rows={3}
              placeholder="Reason for rejection…"
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
            />
            <div className="sm-confirm-btns">
              <button className="sm-confirm-cancel" onClick={() => { setShowRejectModal(false); setRejectionReason(""); }}>Cancel</button>
              <button className="sm-confirm-reject" onClick={confirmReject}>
                <X size={14} strokeWidth={2.5} /> Reject School
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolsManagement;