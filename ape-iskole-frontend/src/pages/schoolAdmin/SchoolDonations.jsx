import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ApiDonation from "../../services/ApiDonation";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import {
  PlusCircle, Search, SlidersHorizontal, X, Eye, Pencil, Trash2,
  Heart, CheckCircle, Clock, AlertCircle, TrendingUp, Users,
  Target, ImagePlus, Save, RotateCcw, Send, Zap, RefreshCw,
  BookOpen, Building2, Dumbbell, GraduationCap, Star,
  CreditCard, Building, Hash, GitBranch, Globe2,
} from "lucide-react";

/* ─── constants ───────────────────────────────────────── */
const initialForm = {
  title: "", description: "", longDescription: "",
  impactStatements: [""], category: "", goalAmount: "", expiryDate: "",
  imageFile: null, enableBankDetails: false,
  bankName: "", accountName: "", accountNumber: "", branch: "", swiftCode: "",
};

const CATEGORIES = [
  { value: "Education",       label: "Education",       icon: BookOpen,      color: "#2563eb", bg: "#eff6ff" },
  { value: "Infrastructure",  label: "Infrastructure",  icon: Building2,     color: "#7c3aed", bg: "#f5f3ff" },
  { value: "Sports",          label: "Sports",          icon: Dumbbell,      color: "#059669", bg: "#ecfdf5" },
  { value: "Student Support", label: "Student Support", icon: GraduationCap, color: "#d97706", bg: "#fffbeb" },
];

const TABS = [
  { id: "create", label: "Create Campaign", icon: PlusCircle },
  { id: "list",   label: "Manage Campaigns", icon: Heart },
];

/* ─── styles ──────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.4} }

  .sd*{box-sizing:border-box}
  .sd{font-family:'Plus Jakarta Sans',sans-serif;display:flex;flex-direction:column;gap:24px;animation:fadeUp .45s ease both}

  /* head */
  .sd-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap}
  .sd-title{font-size:22px;font-weight:900;color:#0f0f0f;letter-spacing:-.4px;margin:0 0 4px}
  .sd-sub{font-size:13px;color:#9ca3af;font-weight:500;margin:0}

  /* stats */
  .sd-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px}
  .sd-stat{background:#fff;border-radius:18px;border:1px solid #f0f0f0;padding:18px 16px;display:flex;align-items:center;gap:13px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .sd-stat-icon{width:44px;height:44px;border-radius:13px;flex-shrink:0;display:flex;align-items:center;justify-content:center}
  .sd-stat-label{font-size:11px;font-weight:600;color:#9ca3af;margin:0 0 3px}
  .sd-stat-value{font-size:20px;font-weight:900;letter-spacing:-.5px;margin:0;color:#0f0f0f}

  /* tabs */
  .sd-tabs{background:#fff;border-radius:16px;border:1px solid #f0f0f0;padding:6px;display:flex;flex-wrap:wrap;gap:4px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .sd-tab{display:flex;align-items:center;gap:6px;padding:9px 16px;border-radius:11px;border:none;background:transparent;font-size:12.5px;font-weight:700;color:#6b7280;cursor:pointer;font-family:inherit;transition:all .18s;white-space:nowrap}
  .sd-tab:hover{background:#f7f7f8;color:#111}
  .sd-tab.active{background:linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));color:#fff;box-shadow:0 3px 10px color-mix(in srgb,var(--color-primary,#4f46e5) 28%,transparent)}

  /* layout */
  .sd-layout{display:grid;grid-template-columns:1fr;gap:20px}
  @media(min-width:1024px){.sd-layout{grid-template-columns:1fr 300px}}

  /* card */
  .sd-card{background:#fff;border-radius:20px;border:1px solid #f0f0f0;padding:24px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .sd-card-title{font-size:16px;font-weight:800;color:#0f0f0f;margin:0 0 18px;letter-spacing:-.2px}

  /* section label */
  .sd-sec{font-size:9.5px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#c4c4c4;margin:20px 0 10px;padding:0}

  /* form fields */
  .sd-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  @media(max-width:560px){.sd-grid{grid-template-columns:1fr}}
  .sd-col2{grid-column:1/-1}
  .sd-field{display:flex;flex-direction:column;gap:5px}
  .sd-label{font-size:11.5px;font-weight:700;color:#374151}
  .sd-req{color:#ef4444}
  .sd-input{height:42px;padding:0 13px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:500;color:#111;font-family:inherit;transition:border-color .18s;outline:none;width:100%}
  .sd-input:focus{border-color:var(--color-primary,#4f46e5)}
  .sd-input.err{border-color:#ef4444}
  .sd-textarea{padding:11px 13px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:500;color:#111;font-family:inherit;transition:border-color .18s;outline:none;width:100%;resize:vertical;line-height:1.65;min-height:90px}
  .sd-textarea:focus{border-color:var(--color-primary,#4f46e5)}
  .sd-textarea.err{border-color:#ef4444}
  .sd-errmsg{font-size:11.5px;color:#ef4444;font-weight:600;margin-top:2px;display:flex;align-items:center;gap:4px}
  .sd-hint{font-size:11.5px;color:#9ca3af;margin-top:3px}

  /* image upload */
  .sd-upload{border:2px dashed #e5e7eb;border-radius:14px;padding:24px 20px;text-align:center;cursor:pointer;transition:border-color .18s;position:relative;display:block}
  .sd-upload:hover{border-color:var(--color-primary,#4f46e5)}
  .sd-upload input{position:absolute;inset:0;opacity:0;cursor:pointer}
  .sd-upload-ico{width:44px;height:44px;border-radius:13px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;color:#9ca3af}
  .sd-preview{width:100%;height:160px;object-fit:cover;border-radius:14px;margin-bottom:12px;display:block}

  /* category grid */
  .sd-cat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:9px}
  .sd-cat-opt{display:flex;align-items:center;gap:8px;padding:11px 14px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;cursor:pointer;transition:all .18s;font-size:12.5px;font-weight:700;color:#374151}
  .sd-cat-opt.on{background:color-mix(in srgb,var(--color-primary,#4f46e5) 7%,transparent);border-color:color-mix(in srgb,var(--color-primary,#4f46e5) 22%,transparent);color:var(--color-primary,#4f46e5)}

  /* toggle */
  .sd-toggle-wrap{display:flex;align-items:center;justify-content:space-between;padding:13px 16px;border-radius:13px;border:1.5px solid #e5e7eb;background:#fff;cursor:pointer;transition:border-color .18s}
  .sd-toggle-wrap.on{background:color-mix(in srgb,#059669 5%,transparent);border-color:color-mix(in srgb,#059669 22%,transparent)}
  .sd-toggle-track{width:38px;height:22px;border-radius:50px;background:#e5e7eb;position:relative;transition:background .18s;flex-shrink:0}
  .sd-toggle-track.on{background:#059669}
  .sd-toggle-thumb{width:16px;height:16px;border-radius:50%;background:#fff;position:absolute;top:3px;left:3px;transition:left .18s;box-shadow:0 1px 4px rgba(0,0,0,.2)}
  .sd-toggle-thumb.on{left:19px}

  /* bank details disabled */
  .sd-bank-off{background:#fafafa;border-radius:14px;padding:32px 20px;text-align:center;border:1px dashed #e5e7eb}

  /* impact rows */
  .sd-impact-row{display:flex;align-items:center;gap:8px;margin-bottom:8px}
  .sd-impact-row:last-child{margin-bottom:0}
  .sd-impact-del{width:32px;height:32px;border-radius:9px;border:1.5px solid #fecaca;background:#fef2f2;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#ef4444;flex-shrink:0;transition:all .18s}
  .sd-impact-del:hover{background:#fee2e2}
  .sd-add-impact{display:inline-flex;align-items:center;gap:6px;margin-top:10px;font-size:12.5px;font-weight:700;color:var(--color-primary,#4f46e5);background:none;border:none;cursor:pointer;font-family:inherit;transition:opacity .18s}
  .sd-add-impact:hover{opacity:.75}

  /* success banner */
  .sd-success{background:#ecfdf5;border:1px solid #a7f3d0;border-radius:16px;padding:16px 20px;display:flex;align-items:center;gap:12px;margin-bottom:20px}
  .sd-success-ico{width:38px;height:38px;border-radius:12px;background:#d1fae5;display:flex;align-items:center;justify-content:center;color:#059669;flex-shrink:0}

  /* action buttons */
  .sd-btn-submit{width:100%;padding:13px;border-radius:13px;border:none;background:linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));color:#fff;font-size:13.5px;font-weight:800;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 5px 16px color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent);transition:all .22s}
  .sd-btn-submit:hover{transform:translateY(-1px);opacity:.9}
  .sd-btn-submit:disabled{opacity:.6;cursor:not-allowed;transform:none}
  .sd-btn-outline{width:100%;padding:12px;border-radius:13px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:700;color:#374151;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:7px;transition:all .18s}
  .sd-btn-outline:hover{background:#f7f7f8;border-color:#d1d5db}
  .sd-btn-outline:disabled{opacity:.5;cursor:not-allowed}
  .sd-btn-ghost{width:100%;padding:12px;border-radius:13px;border:none;background:color-mix(in srgb,var(--color-primary,#4f46e5) 7%,transparent);font-size:13px;font-weight:700;color:var(--color-primary,#4f46e5);cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:7px;transition:all .18s}
  .sd-btn-ghost:hover{background:color-mix(in srgb,var(--color-primary,#4f46e5) 12%,transparent)}

  /* sidebar */
  .sd-sidebar{display:flex;flex-direction:column;gap:16px}

  /* preview card */
  .sd-preview-img{width:100%;height:110px;object-fit:cover;border-radius:12px;margin-bottom:12px}
  .sd-preview-ph{height:110px;border-radius:12px;background:linear-gradient(135deg,color-mix(in srgb,var(--color-primary,#4f46e5) 8%,#fff),color-mix(in srgb,var(--color-secondary,#7c3aed) 6%,#fff));display:flex;align-items:center;justify-content:center;margin-bottom:12px;color:var(--color-primary,#4f46e5)}

  /* filter panel */
  .sd-fp{background:#fff;border-radius:20px;border:1px solid #f0f0f0;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .sd-fp-row{display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end}
  .sd-fg{display:flex;flex-direction:column;gap:5px;flex:1;min-width:150px}
  .sd-flabel{font-size:10.5px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.1em}
  .sd-finput{height:40px;padding:0 13px;border-radius:11px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:500;color:#111;font-family:inherit;transition:border-color .18s;outline:none;width:100%}
  .sd-finput:focus{border-color:var(--color-primary,#4f46e5)}
  .sd-finput-wrap{position:relative}
  .sd-finput-wrap .sd-finput{padding-left:36px}
  .sd-finput-icon{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:#9ca3af;pointer-events:none}
  .sd-fbtn{height:40px;padding:0 15px;border-radius:11px;border:1.5px solid #e5e7eb;background:#fff;font-size:12.5px;font-weight:700;color:#374151;cursor:pointer;display:flex;align-items:center;gap:6px;font-family:inherit;transition:all .18s;white-space:nowrap}
  .sd-fbtn:hover{background:#f7f7f8;border-color:#d1d5db}
  .sd-fbtn.active{background:color-mix(in srgb,var(--color-primary,#4f46e5) 8%,transparent);border-color:color-mix(in srgb,var(--color-primary,#4f46e5) 25%,transparent);color:var(--color-primary,#4f46e5)}
  .sd-chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:14px;padding-top:14px;border-top:1px solid #f3f4f6;align-items:center}
  .sd-chip{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:50px;font-size:11.5px;font-weight:700;background:color-mix(in srgb,var(--color-primary,#4f46e5) 8%,transparent);color:var(--color-primary,#4f46e5);border:1px solid color-mix(in srgb,var(--color-primary,#4f46e5) 18%,transparent)}
  .sd-chip-x{cursor:pointer;background:none;border:none;padding:0;display:flex;align-items:center;color:inherit;opacity:.6}
  .sd-chip-x:hover{opacity:1}
  .sd-clear{font-size:12px;font-weight:700;color:#ef4444;cursor:pointer;background:none;border:none;font-family:inherit}

  /* results bar */
  .sd-resbar{display:flex;align-items:center;justify-content:space-between}
  .sd-rescnt{font-size:14px;font-weight:800;color:#0f0f0f}
  .sd-restot{font-size:12px;color:#9ca3af;font-weight:500}

  /* table */
  .sd-tcard{background:#fff;border-radius:20px;border:1px solid #f0f0f0;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .sd-table{width:100%;border-collapse:collapse}
  .sd-table thead{background:#fafafa}
  .sd-table th{padding:12px 16px;text-align:left;font-size:10.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#9ca3af;border-bottom:1px solid #f0f0f0}
  .sd-table td{padding:14px 16px;border-bottom:1px solid #f7f7f8;vertical-align:middle}
  .sd-table tbody tr{transition:background .15s;cursor:pointer}
  .sd-table tbody tr:hover{background:#fafafa}
  .sd-table tbody tr:last-child td{border-bottom:none}
  .sd-cname{font-size:13.5px;font-weight:700;color:#0f0f0f}
  .sd-cmeta{font-size:11.5px;color:#9ca3af;font-weight:500;margin-top:2px}

  /* badges */
  .sd-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:50px;font-size:11px;font-weight:700;white-space:nowrap}
  .sd-bg-green {color:#065f46;background:#d1fae5}
  .sd-bg-yellow{color:#92400e;background:#fef3c7}
  .sd-bg-red   {color:#991b1b;background:#fee2e2}
  .sd-bg-blue  {color:#1e40af;background:#dbeafe}
  .sd-bg-gray  {color:#4b5563;background:#f3f4f6}
  .sd-bg-purple{color:#5b21b6;background:#ede9fe}

  /* progress */
  .sd-prog-wrap{min-width:100px}
  .sd-prog-row{display:flex;justify-content:space-between;font-size:11px;margin-bottom:4px}
  .sd-prog-val{font-weight:700;color:#374151}
  .sd-prog-pct{color:#9ca3af}
  .sd-prog-track{height:5px;border-radius:50px;background:#f3f4f6;overflow:hidden}
  .sd-prog-fill{height:100%;border-radius:50px;background:var(--color-primary,#4f46e5);transition:width .5s}
  .sd-prog-fill.done{background:#059669}

  /* action buttons */
  .sd-acts{display:flex;align-items:center;justify-content:flex-end;gap:6px}
  .sd-act{width:32px;height:32px;border-radius:9px;border:1.5px solid #e5e7eb;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#6b7280;transition:all .18s}
  .sd-act:hover{background:#f7f7f8;border-color:#d1d5db}
  .sd-act.v:hover{background:#eff6ff;border-color:#bfdbfe;color:#2563eb}
  .sd-act.e:hover{background:color-mix(in srgb,var(--color-primary,#4f46e5) 8%,transparent);border-color:color-mix(in srgb,var(--color-primary,#4f46e5) 22%,transparent);color:var(--color-primary,#4f46e5)}
  .sd-act.d:hover{background:#fef2f2;border-color:#fecaca;color:#ef4444}

  /* spinner */
  .sd-spin{width:16px;height:16px;border-radius:50%;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;animation:spin .75s linear infinite;flex-shrink:0}
  .sd-spin-lg{width:44px;height:44px;border-radius:50%;border:3px solid #f0f0f0;border-top-color:var(--color-primary,#4f46e5);animation:spin .75s linear infinite}

  /* empty */
  .sd-empty{text-align:center;padding:56px 24px}
  .sd-empty-ico{width:52px;height:52px;border-radius:16px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;color:#9ca3af}

  /* modals */
  .sd-backdrop{position:fixed;inset:0;z-index:50;background:rgba(15,15,15,.6);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:16px}
  .sd-modal{background:#fff;border-radius:22px;width:100%;max-width:620px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 64px rgba(0,0,0,.18)}
  .sd-modal::-webkit-scrollbar{width:4px}
  .sd-modal::-webkit-scrollbar-thumb{background:#e5e7eb;border-radius:99px}
  .sd-modal-head{display:flex;align-items:center;justify-content:space-between;padding:20px 24px 16px;border-bottom:1px solid #f3f4f6;position:sticky;top:0;background:#fff;z-index:2;border-radius:22px 22px 0 0}
  .sd-modal-title{font-size:17px;font-weight:800;color:#0f0f0f;margin:0}
  .sd-modal-sub{font-size:11.5px;color:#9ca3af;font-weight:500;margin-top:2px}
  .sd-modal-x{width:30px;height:30px;border-radius:9px;border:none;background:#f5f5f5;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#6b7280;transition:all .18s}
  .sd-modal-x:hover{background:#e5e7eb;color:#374151}
  .sd-modal-body{padding:20px 24px}
  .sd-modal-foot{padding:16px 24px;border-top:1px solid #f3f4f6;display:flex;gap:10px}
  .sd-modal-btn-outline{flex:1;padding:11px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:700;color:#374151;cursor:pointer;font-family:inherit;transition:all .18s}
  .sd-modal-btn-outline:hover{background:#f7f7f8}
  .sd-modal-btn-primary{flex:1;padding:11px;border-radius:12px;border:none;background:linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));font-size:13px;font-weight:700;color:#fff;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:7px;box-shadow:0 4px 14px color-mix(in srgb,var(--color-primary,#4f46e5) 28%,transparent)}
  .sd-modal-btn-danger{flex:1;padding:11px;border-radius:12px;border:none;background:#ef4444;font-size:13px;font-weight:700;color:#fff;cursor:pointer;font-family:inherit;transition:opacity .18s}
  .sd-modal-btn-danger:hover{opacity:.88}

  /* view modal */
  .sd-view-img{width:100%;height:190px;object-fit:cover;border-radius:16px;margin-bottom:16px}
  .sd-view-ph{height:120px;border-radius:16px;background:linear-gradient(135deg,color-mix(in srgb,var(--color-primary,#4f46e5) 12%,#fff),color-mix(in srgb,var(--color-secondary,#7c3aed) 8%,#fff));display:flex;align-items:center;justify-content:center;color:var(--color-primary,#4f46e5);margin-bottom:16px}
  .sd-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0}
  .sd-info-cell{background:#fafafa;border-radius:12px;padding:12px 14px}
  .sd-info-clabel{font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.1em;margin:0 0 4px;display:flex;align-items:center;gap:5px}
  .sd-info-cval{font-size:13.5px;font-weight:700;color:#0f0f0f;margin:0}
  .sd-info-csub{font-size:11.5px;color:#9ca3af;margin:2px 0 0}

  /* delete modal */
  .sd-del-modal{background:#fff;border-radius:22px;width:100%;max-width:400px;padding:32px;box-shadow:0 24px 64px rgba(0,0,0,.18);text-align:center}
  .sd-del-icon{width:56px;height:56px;border-radius:18px;background:#fef2f2;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;color:#ef4444}

  /* tips list */
  .sd-tips{display:flex;flex-direction:column;gap:9px}
  .sd-tip{display:flex;align-items:flex-start;gap:9px;font-size:12.5px;color:#4b5563;font-weight:500;line-height:1.55}
  .sd-tip-dot{width:6px;height:6px;border-radius:50%;background:var(--color-primary,#4f46e5);flex-shrink:0;margin-top:5px}
`;

/* ─── helpers ─────────────────────────────────────────── */
const formatLKR = (n) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(n || 0);

const getDaysLeft = (d) => {
  if (!d) return 0;
  return Math.max(0, Math.ceil((new Date(d) - new Date()) / 86400000));
};

const getProgress = (raised, goal) =>
  goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0;

const getStatusInfo = (isApproved, status) => {
  if (isApproved === true  && status !== "Completed") return { label: "Active",    cls: "sd-bg-green"  };
  if (isApproved === false)                            return { label: "Rejected",  cls: "sd-bg-red"    };
  if (status === "Completed")                          return { label: "Completed", cls: "sd-bg-blue"   };
  return                                                      { label: "Pending",   cls: "sd-bg-yellow" };
};

const getCatMeta = (v) =>
  CATEGORIES.find(c => c.value === v) || { icon: Heart, color: "#6b7280", bg: "#f9fafb" };

/* ─── badge helper ────────────────────────────────────── */
const StatusBadge = ({ isApproved, status }) => {
  const { label, cls } = getStatusInfo(isApproved, status);
  const Icon = label === "Active"    ? CheckCircle
             : label === "Rejected"  ? AlertCircle
             : label === "Completed" ? Star
             :                         Clock;
  return (
    <span className={`sd-badge ${cls}`}>
      <Icon size={11} strokeWidth={2.5} />{label}
    </span>
  );
};

/* ─── Field wrapper ───────────────────────────────────── */
const Field = ({ label, required, error, hint, children }) => (
  <div className="sd-field">
    <label className="sd-label">
      {label}{required && <span className="sd-req"> *</span>}
    </label>
    {children}
    {error && <p className="sd-errmsg"><AlertCircle size={11} /> {error}</p>}
    {hint && !error && <p className="sd-hint">{hint}</p>}
  </div>
);

/* ═══════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════ */
const SchoolDonations = () => {
  const { userProfile, authLoading } = useAuth();
  const [formData, setFormData]     = useState(initialForm);
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitted, setSubmitted]   = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors]         = useState({});
  const [activeTab, setActiveTab]   = useState("create");
  const [isEditing, setIsEditing]   = useState(false);
  const [editingId, setEditingId]   = useState(null);

  const [campaigns, setCampaigns]   = useState([]);
  const [loading, setLoading]       = useState(true);

  const [search, setSearch]                 = useState("");
  const [statusFilter, setStatusFilter]     = useState("All");
  const [catFilter, setCatFilter]           = useState("All");
  const [showFilters, setShowFilters]       = useState(false);

  const [viewCampaign, setViewCampaign]     = useState(null);
  const [deleteTarget, setDeleteTarget]     = useState(null);

  /* ── fetch ── */
  const fetchCampaigns = useCallback(async () => {
    if (!userProfile?.schoolId) return;
    setLoading(true);
    try {
      const res = await ApiDonation.getAdminDonations({ schoolId: userProfile.schoolId });
      setCampaigns(res.data || []);
    } catch { toast.error("Failed to load campaigns"); }
    finally { setLoading(false); }
  }, [userProfile?.schoolId]);

  useEffect(() => { fetchCampaigns(); }, [fetchCampaigns]);

  /* ── stats ── */
  const totalGoal      = campaigns.reduce((s, c) => s + (c.goalAmount   || 0), 0);
  const totalRaised    = campaigns.reduce((s, c) => s + (c.raisedAmount  || 0), 0);
  const totalDonors    = campaigns.reduce((s, c) => s + (c.donorCount    || 0), 0);
  const activeCnt      = campaigns.filter(c => c.isApproved === true && c.status !== "Completed").length;

  const STATS = [
    { label: "Total Goal",    value: formatLKR(totalGoal),   icon: Target,     bg: "#eff6ff", color: "#2563eb" },
    { label: "Total Raised",  value: formatLKR(totalRaised), icon: TrendingUp, bg: "#ecfdf5", color: "#059669" },
    { label: "Total Donors",  value: totalDonors,            icon: Users,      bg: "#f5f3ff", color: "#7c3aed" },
    { label: "Active",        value: activeCnt,              icon: Heart,      bg: "#fdf2f8", color: "#db2777" },
  ];

  /* ── filtered list ── */
  const filtered = useMemo(() => campaigns.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !search || c.title?.toLowerCase().includes(q) || c.category?.toLowerCase().includes(q);
    const { label } = getStatusInfo(c.isApproved, c.status);
    const matchStatus = statusFilter === "All" || label === statusFilter;
    const matchCat    = catFilter === "All"    || c.category === catFilter;
    return matchSearch && matchStatus && matchCat;
  }), [campaigns, search, statusFilter, catFilter]);

  const hasFilters = search || statusFilter !== "All" || catFilter !== "All";
  const clearFilters = () => { setSearch(""); setStatusFilter("All"); setCatFilter("All"); };

  /* ── form helpers ── */
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const f = files?.[0] || null;
      setFormData(p => ({ ...p, imageFile: f }));
      setPreviewUrl(f ? URL.createObjectURL(f) : "");
      return;
    }
    if (type === "checkbox") { setFormData(p => ({ ...p, [name]: checked })); return; }
    setFormData(p => ({ ...p, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!formData.title?.trim())           e.title           = "Campaign title is required";
    if (!formData.category)                e.category        = "Please select a category";
    if (!formData.goalAmount || +formData.goalAmount <= 0) e.goalAmount = "A valid goal amount is required";
    if (!formData.expiryDate)              e.expiryDate      = "End date is required";
    if (!formData.description?.trim())     e.description     = "Short description is required";
    if (!formData.longDescription?.trim()) e.longDescription = "Full description is required";
    if (formData.enableBankDetails) {
      if (!formData.bankName?.trim())      e.bankName        = "Bank name is required";
      if (!formData.accountName?.trim())   e.accountName     = "Account name is required";
      if (!formData.accountNumber?.trim()) e.accountNumber   = "Account number is required";
    }
    return e;
  };

  const handleSubmit = async (e, isDraft = false) => {
    if (e) e.preventDefault();
    if (!userProfile?.schoolId) { toast.error("No school assigned to your account."); return; }
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("title",            formData.title);
      fd.append("description",      formData.description);
      fd.append("longDescription",  formData.longDescription);
      formData.impactStatements.filter(s => s.trim()).forEach(s => fd.append("impactStatements", s.trim()));
      fd.append("category",         formData.category);
      fd.append("goalAmount",       parseFloat(formData.goalAmount));
      fd.append("expiryDate",       new Date(formData.expiryDate).toISOString());
      fd.append("schoolId",         userProfile.schoolId);
      fd.append("enableBankDetails",formData.enableBankDetails);
      fd.append("isDraft",          isDraft);
      if (formData.enableBankDetails) {
        fd.append("bankName",      formData.bankName);
        fd.append("accountName",   formData.accountName);
        fd.append("accountNumber", formData.accountNumber);
        fd.append("branch",        formData.branch || "");
        fd.append("swiftCode",     formData.swiftCode || "");
      }
      if (formData.imageFile) fd.append("imageFile", formData.imageFile);
      if (isEditing) {
        await ApiDonation.updateDonation(editingId, fd);
        toast.success(isDraft ? "Draft updated!" : "Campaign updated!");
      } else {
        await ApiDonation.createDonation(fd);
        toast.success(isDraft ? "Draft saved!" : "Campaign submitted for review!");
      }
      resetForm();
      setActiveTab("list");
      fetchCampaigns();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save campaign");
    } finally { setIsSubmitting(false); }
  };

  const resetForm = () => {
    setFormData(initialForm); setPreviewUrl("");
    setErrors({}); setSubmitted(false);
    setIsEditing(false); setEditingId(null);
  };

  const handleEdit = (c) => {
    setIsEditing(true); setEditingId(c.id);
    setFormData({
      title: c.title || "", description: c.description || "",
      longDescription: c.longDescription || "",
      impactStatements: c.impactStatements?.length ? c.impactStatements : [""],
      category: c.category || "", goalAmount: c.goalAmount || "",
      expiryDate: c.expiryDate ? new Date(c.expiryDate).toISOString().split("T")[0] : "",
      imageFile: null, enableBankDetails: c.enableBankDetails || false,
      bankName: c.bankName || "", accountName: c.accountName || "",
      accountNumber: c.accountNumber || "", branch: c.branch || "",
      swiftCode: c.swiftCode || "",
    });
    setPreviewUrl(c.image || "");
    setActiveTab("create");
    setViewCampaign(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteConfirm = async () => {
    try {
      await ApiDonation.deleteDonation(deleteTarget.id);
      toast.success("Campaign deleted");
      fetchCampaigns();
    } catch { toast.error("Failed to delete campaign"); }
    finally { setDeleteTarget(null); }
  };

  if (authLoading || (loading && campaigns.length === 0)) {
    return (
      <div className="sd">
        <style>{styles}</style>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 320, gap: 14 }}>
          <div className="sd-spin-lg" />
          <p style={{ fontSize: 13, color: "#9ca3af", fontWeight: 600 }}>Loading your campaigns…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sd">
      <style>{styles}</style>

      {/* ═══ HEAD ═══ */}
      <div className="sd-head">
        <div>
          <h1 className="sd-title">{isEditing ? "Edit Campaign" : "Donation Campaigns"}</h1>
          <p className="sd-sub">Create and manage fundraising campaigns for your school projects.</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span className="sd-badge sd-bg-green"><CheckCircle size={11} strokeWidth={2.5} />Secure Module</span>
          <span className="sd-badge sd-bg-purple"><Star size={11} strokeWidth={2.5} />Verified</span>
        </div>
      </div>

      {/* ═══ STATS ═══ */}
      <div className="sd-stats">
        {STATS.map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="sd-stat">
            <div className="sd-stat-icon" style={{ background: bg, color }}>
              <Icon size={20} strokeWidth={2} />
            </div>
            <div>
              <p className="sd-stat-label">{label}</p>
              <p className="sd-stat-value">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ TABS ═══ */}
      <div className="sd-tabs">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`sd-tab ${activeTab === id ? "active" : ""}`}
            onClick={() => { if (id === "create") resetForm(); setActiveTab(id); }}
          >
            <Icon size={13} strokeWidth={2.2} />
            {id === "create" && isEditing ? "Edit Campaign" : label}
          </button>
        ))}
      </div>

      {/* ═══ CREATE / EDIT FORM ═══ */}
      {activeTab === "create" && (
        <div className="sd-layout">

          {/* MAIN FORM */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Success */}
            {submitted && (
              <div className="sd-success">
                <div className="sd-success-ico"><CheckCircle size={20} strokeWidth={2.5} /></div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: "#065f46", margin: "0 0 2px" }}>
                    {isEditing ? "Campaign updated!" : "Campaign submitted for review!"}
                  </p>
                  <p style={{ fontSize: 12, color: "#047857", margin: 0 }}>Our team will review it shortly.</p>
                </div>
              </div>
            )}

            {/* Basic details */}
            <div className="sd-card">
              <p className="sd-card-title">Basic Information</p>
              <div className="sd-grid">
                <div className="sd-col2">
                  <Field label="Campaign Title" required error={errors.title}>
                    <input className={`sd-input ${errors.title ? "err" : ""}`} name="title" value={formData.title} onChange={handleChange} placeholder="Enter a clear, compelling title" />
                  </Field>
                </div>
                <Field label="Goal Amount (LKR)" required error={errors.goalAmount}>
                  <input type="number" className={`sd-input ${errors.goalAmount ? "err" : ""}`} name="goalAmount" value={formData.goalAmount} onChange={handleChange} placeholder="e.g. 500000" min="0" step="1000" />
                </Field>
                <Field label="End Date" required error={errors.expiryDate}>
                  <input type="date" className={`sd-input ${errors.expiryDate ? "err" : ""}`} name="expiryDate" value={formData.expiryDate} onChange={handleChange} min={new Date().toISOString().split("T")[0]} />
                </Field>
                <div className="sd-col2">
                  <Field label="Short Description" required error={errors.description}>
                    <input className={`sd-input ${errors.description ? "err" : ""}`} name="description" value={formData.description} onChange={handleChange} placeholder="One-line summary of your campaign" />
                  </Field>
                </div>
                <div className="sd-col2">
                  <Field label="Full Description" required error={errors.longDescription}>
                    <textarea className={`sd-textarea ${errors.longDescription ? "err" : ""}`} name="longDescription" value={formData.longDescription} onChange={handleChange} rows={5} placeholder="Explain the purpose, goals, and how funds will be used…" />
                  </Field>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="sd-card">
              <p className="sd-card-title">Category</p>
              {errors.category && <p className="sd-errmsg" style={{ marginBottom: 10 }}><AlertCircle size={11} /> {errors.category}</p>}
              <div className="sd-cat-grid">
                {CATEGORIES.map(({ value, label, icon: Icon, color, bg }) => (
                  <label key={value} className={`sd-cat-opt ${formData.category === value ? "on" : ""}`}>
                    <input type="radio" style={{ display: "none" }} checked={formData.category === value} onChange={() => setFormData(p => ({ ...p, category: value }))} />
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={14} color={color} strokeWidth={2} />
                    </div>
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="sd-card">
              <p className="sd-card-title">Campaign Banner</p>
              {previewUrl && <img src={previewUrl} alt="preview" className="sd-preview" />}
              <label className="sd-upload">
                <input type="file" accept="image/*" onChange={handleChange} />
                <div className="sd-upload-ico"><ImagePlus size={20} strokeWidth={1.8} /></div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", margin: "0 0 4px" }}>
                  {previewUrl ? "Change banner image" : "Upload banner image"}
                </p>
                <p style={{ fontSize: 11.5, color: "#9ca3af", margin: 0 }}>PNG, JPG, WEBP — up to 5 MB</p>
              </label>
            </div>

            {/* Impact Statements */}
            <div className="sd-card">
              <p className="sd-card-title">Impact Statements</p>
              <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 16px", fontWeight: 400 }}>
                Show donors the tangible difference their contribution makes.
              </p>
              {formData.impactStatements.map((stmt, i) => (
                <div key={i} className="sd-impact-row">
                  <input
                    className="sd-input"
                    value={stmt}
                    onChange={e => {
                      const arr = [...formData.impactStatements];
                      arr[i] = e.target.value;
                      setFormData(p => ({ ...p, impactStatements: arr }));
                    }}
                    placeholder={`e.g., Provide ${i === 0 ? "500 books for students" : "scholarships for 10 students"}`}
                  />
                  {formData.impactStatements.length > 1 && (
                    <button className="sd-impact-del" onClick={() => setFormData(p => ({ ...p, impactStatements: p.impactStatements.filter((_, j) => j !== i) }))}>
                      <X size={13} strokeWidth={2.5} />
                    </button>
                  )}
                </div>
              ))}
              {errors.impactStatements && <p className="sd-errmsg"><AlertCircle size={11} /> {errors.impactStatements}</p>}
              <button
                type="button"
                className="sd-add-impact"
                onClick={() => setFormData(p => ({ ...p, impactStatements: [...p.impactStatements, ""] }))}
              >
                <PlusCircle size={13} strokeWidth={2.5} /> Add statement
              </button>
            </div>

            {/* Bank Details */}
            <div className="sd-card">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <div>
                  <p className="sd-card-title" style={{ margin: 0 }}>Bank Account Details</p>
                  <p style={{ fontSize: 12.5, color: "#9ca3af", margin: "3px 0 0", fontWeight: 500 }}>Enable to accept direct bank transfers.</p>
                </div>
                <label className={`sd-toggle-wrap ${formData.enableBankDetails ? "on" : ""}`} style={{ width: "auto", padding: "8px 12px" }}>
                  <input type="checkbox" name="enableBankDetails" checked={formData.enableBankDetails} onChange={handleChange} style={{ display: "none" }} />
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: formData.enableBankDetails ? "#065f46" : "#6b7280", marginRight: 10 }}>
                    {formData.enableBankDetails ? "Enabled" : "Disabled"}
                  </span>
                  <div className={`sd-toggle-track ${formData.enableBankDetails ? "on" : ""}`}>
                    <div className={`sd-toggle-thumb ${formData.enableBankDetails ? "on" : ""}`} />
                  </div>
                </label>
              </div>

              {formData.enableBankDetails ? (
                <div className="sd-grid">
                  <Field label="Bank Name" required error={errors.bankName}>
                    <input className={`sd-input ${errors.bankName ? "err" : ""}`} name="bankName" value={formData.bankName} onChange={handleChange} placeholder="e.g. Bank of Ceylon" />
                  </Field>
                  <Field label="Account Name" required error={errors.accountName}>
                    <input className={`sd-input ${errors.accountName ? "err" : ""}`} name="accountName" value={formData.accountName} onChange={handleChange} placeholder="Account holder name" />
                  </Field>
                  <Field label="Account Number" required error={errors.accountNumber}>
                    <input className={`sd-input ${errors.accountNumber ? "err" : ""}`} name="accountNumber" value={formData.accountNumber} onChange={handleChange} placeholder="Account number" />
                  </Field>
                  <Field label="Branch">
                    <input className="sd-input" name="branch" value={formData.branch} onChange={handleChange} placeholder="Branch name" />
                  </Field>
                  <Field label="SWIFT Code">
                    <input className="sd-input" name="swiftCode" value={formData.swiftCode} onChange={handleChange} placeholder="SWIFT / BIC code" />
                  </Field>
                </div>
              ) : (
                <div className="sd-bank-off">
                  <CreditCard size={28} strokeWidth={1.5} color="#d1d5db" style={{ margin: "0 auto 10px", display: "block" }} />
                  <p style={{ fontSize: 13.5, fontWeight: 700, color: "#9ca3af", margin: "0 0 4px" }}>Bank transfers disabled</p>
                  <p style={{ fontSize: 12, color: "#c4c4c4", margin: 0 }}>Toggle above to enable direct bank transfers for donors.</p>
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="sd-sidebar">

            {/* Publish settings */}
            <div className="sd-card">
              <p className="sd-card-title" style={{ marginBottom: 14 }}>Publish Settings</p>
              {[
                { bg: "#eff6ff", iconColor: "#2563eb", Icon: Zap,          title: "Submitted for Review", sub: "Admin must approve before going live" },
                { bg: "#ecfdf5", iconColor: "#059669", Icon: CheckCircle,  title: "Public after approval", sub: "Visible to all donors once approved" },
              ].map(({ bg, iconColor, Icon, title, sub }, i) => (
                <div key={i} style={{ background: bg, borderRadius: 13, padding: 14, marginBottom: i === 0 ? 10 : 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                    <Icon size={13} color={iconColor} strokeWidth={2.2} />
                    <span style={{ fontSize: 12, fontWeight: 800, color: iconColor }}>Status</span>
                  </div>
                  <p style={{ fontSize: 13.5, fontWeight: 800, color: "#0f0f0f", margin: "0 0 2px" }}>{title}</p>
                  <p style={{ fontSize: 11.5, color: "#6b7280", margin: 0 }}>{sub}</p>
                </div>
              ))}
            </div>

            {/* Preview */}
            <div className="sd-card">
              <p className="sd-card-title" style={{ marginBottom: 14 }}>Preview</p>
              {previewUrl
                ? <img src={previewUrl} alt="preview" className="sd-preview-img" />
                : <div className="sd-preview-ph"><ImagePlus size={26} strokeWidth={1.5} /></div>
              }
              {formData.category && (() => {
                const m = getCatMeta(formData.category);
                const CatIcon = m.icon;
                return (
                  <span className="sd-badge" style={{ color: m.color, background: m.bg, marginBottom: 8, display: "inline-flex" }}>
                    <CatIcon size={11} strokeWidth={2.5} />{formData.category}
                  </span>
                );
              })()}
              <p style={{ fontSize: 14, fontWeight: 800, color: "#0f0f0f", margin: "6px 0 4px" }}>
                {formData.title || "Campaign Title"}
              </p>
              <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 5px", fontWeight: 500 }}>
                Goal: {formData.goalAmount ? formatLKR(+formData.goalAmount) : "LKR 0"}
              </p>
              <p style={{ fontSize: 12, color: "#6b7280", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {formData.description || "Campaign description…"}
              </p>
            </div>

            {/* Actions */}
            <div className="sd-card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button className="sd-btn-submit" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting
                  ? <><div className="sd-spin" />Submitting…</>
                  : <><Send size={15} strokeWidth={2.5} />{isEditing ? "Update Campaign" : "Submit for Review"}</>
                }
              </button>
              <button className="sd-btn-outline" onClick={(e) => handleSubmit(e, true)} disabled={isSubmitting}>
                <Save size={14} strokeWidth={2.5} /> Save as Draft
              </button>
              <button className="sd-btn-ghost" onClick={resetForm}>
                <RotateCcw size={14} strokeWidth={2.5} /> Reset Form
              </button>
            </div>

            {/* Tips */}
            <div className="sd-card">
              <p className="sd-card-title" style={{ marginBottom: 14 }}>Tips for Success</p>
              <div className="sd-tips">
                {[
                  "Set a realistic goal based on actual project needs.",
                  "Add a compelling banner image to attract donors.",
                  "Be specific about how funds will be used.",
                  "Include impact statements to inspire giving.",
                  "Share regular updates to keep donors engaged.",
                ].map((t, i) => (
                  <div key={i} className="sd-tip">
                    <div className="sd-tip-dot" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MANAGE LIST ═══ */}
      {activeTab === "list" && (
        <>
          {/* Filter panel */}
          <div className="sd-fp">
            <div className="sd-fp-row">
              <div className="sd-fg" style={{ flex: 2, minWidth: 200 }}>
                <span className="sd-flabel">Search</span>
                <div className="sd-finput-wrap">
                  <Search size={14} className="sd-finput-icon" />
                  <input className="sd-finput" placeholder="Search by title or category…" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
              </div>
              <div className="sd-fg">
                <span className="sd-flabel">Status</span>
                <select className="sd-finput" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="sd-fg">
                <span className="sd-flabel">Category</span>
                <select className="sd-finput" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
                  <option value="All">All Categories</option>
                  {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              {hasFilters && (
                <button className="sd-fbtn" style={{ color: "#ef4444", borderColor: "#fecaca", background: "#fef2f2", alignSelf: "flex-end" }} onClick={clearFilters}>
                  <X size={13} strokeWidth={2.5} /> Clear
                </button>
              )}
            </div>

            {hasFilters && (
              <div className="sd-chips">
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "#9ca3af" }}>Active:</span>
                {search && <span className="sd-chip">Search: {search}<button className="sd-chip-x" onClick={() => setSearch("")}><X size={11} /></button></span>}
                {statusFilter !== "All" && <span className="sd-chip">Status: {statusFilter}<button className="sd-chip-x" onClick={() => setStatusFilter("All")}><X size={11} /></button></span>}
                {catFilter !== "All" && <span className="sd-chip">Category: {catFilter}<button className="sd-chip-x" onClick={() => setCatFilter("All")}><X size={11} /></button></span>}
                <button className="sd-clear" onClick={clearFilters}>Clear all</button>
              </div>
            )}
          </div>

          {/* Results bar */}
          <div className="sd-resbar">
            <span className="sd-rescnt">{filtered.length} Campaign{filtered.length !== 1 ? "s" : ""} Found</span>
            <span className="sd-restot">Showing {filtered.length} of {campaigns.length}</span>
          </div>

          {/* Table */}
          <div className="sd-tcard">
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "56px 24px", gap: 14 }}>
                <div className="sd-spin-lg" />
                <p style={{ fontSize: 13, color: "#9ca3af", fontWeight: 600 }}>Loading campaigns…</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="sd-table">
                  <thead>
                    <tr>
                      <th>Campaign</th>
                      <th>Goal</th>
                      <th>Raised</th>
                      <th>Donors</th>
                      <th>Days Left</th>
                      <th>Progress</th>
                      <th>Status</th>
                      <th style={{ textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(c => {
                      const pct = getProgress(c.raisedAmount || 0, c.goalAmount || 0);
                      const days = getDaysLeft(c.expiryDate);
                      const catMeta = getCatMeta(c.category);
                      const CatIcon = catMeta.icon;
                      return (
                        <tr key={c.id} onClick={() => setViewCampaign(c)}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <div style={{ width: 38, height: 38, borderRadius: 10, background: catMeta.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                {c.image
                                  ? <img src={c.image.startsWith("http") ? c.image : `${import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || ""}${c.image}`} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10 }} />
                                  : <CatIcon size={16} color={catMeta.color} strokeWidth={2} />
                                }
                              </div>
                              <div>
                                <p className="sd-cname">{c.title}</p>
                                <p className="sd-cmeta">{c.category}</p>
                              </div>
                            </div>
                          </td>
                          <td style={{ fontSize: 13, fontWeight: 700, color: "#0f0f0f" }}>{formatLKR(c.goalAmount)}</td>
                          <td style={{ fontSize: 13, fontWeight: 700, color: "#059669" }}>{formatLKR(c.raisedAmount)}</td>
                          <td>
                            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, fontWeight: 600, color: "#6b7280" }}>
                              <Users size={12} strokeWidth={2} />{c.donorCount || 0}
                            </span>
                          </td>
                          <td>
                            {days > 0
                              ? <span style={{ fontSize: 12.5, fontWeight: 700, color: days <= 7 ? "#ef4444" : "#374151" }}>{days}d</span>
                              : <span style={{ fontSize: 12, color: "#9ca3af" }}>—</span>
                            }
                          </td>
                          <td>
                            <div className="sd-prog-wrap">
                              <div className="sd-prog-row">
                                <span className="sd-prog-val">{pct}%</span>
                                <span className="sd-prog-pct">{formatLKR(c.raisedAmount)}</span>
                              </div>
                              <div className="sd-prog-track">
                                <div className={`sd-prog-fill ${pct >= 100 ? "done" : ""}`} style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          </td>
                          <td><StatusBadge isApproved={c.isApproved} status={c.status} /></td>
                          <td onClick={e => e.stopPropagation()}>
                            <div className="sd-acts">
                              <button className="sd-act v" title="View" onClick={() => setViewCampaign(c)}><Eye size={14} strokeWidth={2.2} /></button>
                              <button className="sd-act e" title="Edit" onClick={() => handleEdit(c)}><Pencil size={14} strokeWidth={2.2} /></button>
                              <button className="sd-act d" title="Delete" onClick={() => setDeleteTarget(c)}><Trash2 size={14} strokeWidth={2.2} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="sd-empty">
                    <div className="sd-empty-ico"><Heart size={22} strokeWidth={1.8} /></div>
                    <p style={{ fontSize: 15, fontWeight: 800, color: "#0f0f0f", margin: "0 0 6px" }}>No campaigns found</p>
                    <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 18px" }}>Try adjusting your filters</p>
                    <button className="sd-fbtn" style={{ margin: "0 auto" }} onClick={clearFilters}>Clear filters</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {/* ════ VIEW MODAL ════ */}
      {viewCampaign && (
        <div className="sd-backdrop" onClick={() => setViewCampaign(null)}>
          <div className="sd-modal" onClick={e => e.stopPropagation()}>
            <div className="sd-modal-head">
              <div>
                <p className="sd-modal-title">{viewCampaign.title}</p>
                <p className="sd-modal-sub">{viewCampaign.category}</p>
              </div>
              <button className="sd-modal-x" onClick={() => setViewCampaign(null)}><X size={15} strokeWidth={2.2} /></button>
            </div>
            <div className="sd-modal-body">
              {viewCampaign.image
                ? <img src={viewCampaign.image.startsWith("http") ? viewCampaign.image : `${import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || ""}${viewCampaign.image}`} alt="" className="sd-view-img" />
                : <div className="sd-view-ph"><Heart size={36} strokeWidth={1.5} /></div>
              }
              <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
                <StatusBadge isApproved={viewCampaign.isApproved} status={viewCampaign.status} />
                {(() => { const m = getCatMeta(viewCampaign.category); const I = m.icon; return <span className="sd-badge" style={{ color: m.color, background: m.bg }}><I size={11} strokeWidth={2.5} />{viewCampaign.category}</span>; })()}
              </div>
              <div className="sd-info-grid">
                <div className="sd-info-cell">
                  <p className="sd-info-clabel"><Target size={11} />Goal</p>
                  <p className="sd-info-cval">{formatLKR(viewCampaign.goalAmount)}</p>
                </div>
                <div className="sd-info-cell">
                  <p className="sd-info-clabel"><TrendingUp size={11} />Raised</p>
                  <p className="sd-info-cval" style={{ color: "#059669" }}>{formatLKR(viewCampaign.raisedAmount)}</p>
                  <p className="sd-info-csub">{getProgress(viewCampaign.raisedAmount, viewCampaign.goalAmount)}% of goal</p>
                </div>
                <div className="sd-info-cell">
                  <p className="sd-info-clabel"><Users size={11} />Donors</p>
                  <p className="sd-info-cval">{viewCampaign.donorCount || 0}</p>
                </div>
                <div className="sd-info-cell">
                  <p className="sd-info-clabel"><Clock size={11} />End Date</p>
                  <p className="sd-info-cval">{viewCampaign.expiryDate ? new Date(viewCampaign.expiryDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}</p>
                  {getDaysLeft(viewCampaign.expiryDate) > 0 && <p className="sd-info-csub">{getDaysLeft(viewCampaign.expiryDate)} days left</p>}
                </div>
              </div>
              {viewCampaign.longDescription && (
                <div style={{ marginBottom: 14 }}>
                  <p style={{ fontSize: 10, fontWeight: 800, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 6px" }}>Description</p>
                  <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{viewCampaign.longDescription}</p>
                </div>
              )}
              {viewCampaign.impactStatements?.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <p style={{ fontSize: 10, fontWeight: 800, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 8px" }}>Impact</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {viewCampaign.impactStatements.map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#374151", fontWeight: 500 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-primary,#4f46e5)", flexShrink: 0, marginTop: 6 }} />
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {viewCampaign.enableBankDetails && (
                <div style={{ background: "#fafafa", borderRadius: 14, padding: "16px", border: "1px solid #f0f0f0" }}>
                  <p style={{ fontSize: 10, fontWeight: 800, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 10px", display: "flex", alignItems: "center", gap: 6 }}>
                    <CreditCard size={11} strokeWidth={2} /> Bank Details
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px" }}>
                    {[
                      ["Bank", viewCampaign.bankName],
                      ["Account Name", viewCampaign.accountName],
                      ["Account No.", viewCampaign.accountNumber],
                      ["Branch", viewCampaign.branch || "—"],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <p style={{ fontSize: 10.5, color: "#9ca3af", fontWeight: 600, margin: "0 0 2px" }}>{k}</p>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#0f0f0f", margin: 0 }}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="sd-modal-foot">
              <button className="sd-modal-btn-outline" onClick={() => setViewCampaign(null)}>Close</button>
              <button className="sd-modal-btn-primary" onClick={() => handleEdit(viewCampaign)}>
                <Pencil size={13} strokeWidth={2.5} /> Edit Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════ DELETE MODAL ════ */}
      {deleteTarget && (
        <div className="sd-backdrop">
          <div className="sd-del-modal">
            <div className="sd-del-icon"><Trash2 size={24} strokeWidth={2} /></div>
            <p style={{ fontSize: 17, fontWeight: 800, color: "#0f0f0f", margin: "0 0 10px" }}>Delete Campaign</p>
            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.65, margin: "0 0 24px" }}>
              Are you sure you want to delete <strong>"{deleteTarget.title}"</strong>? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="sd-modal-btn-outline" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="sd-modal-btn-danger" onClick={handleDeleteConfirm}>Delete Campaign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolDonations;