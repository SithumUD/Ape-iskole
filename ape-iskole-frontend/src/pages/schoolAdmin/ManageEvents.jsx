import { Link, useNavigate } from "react-router-dom";
import { useEffect, useCallback, useState, useMemo } from "react";
import ApiEvent from "../../services/ApiEvent";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import {
  PlusCircle, Search, SlidersHorizontal, X, Eye, Pencil, Trash2,
  CalendarDays, CheckCircle, Clock, AlertCircle, MapPin,
  Star, Ticket, RefreshCw, Users, Heart, Mail, Phone,
  ParkingSquare, UtensilsCrossed, Accessibility, Save,
  ImagePlus, FileText, Zap,
} from "lucide-react";

/* ─── constants ───────────────────────────────────────── */
const categories = [
  "Sports","Carnival","Art Competition","Anniversary","Concert",
  "Big Match","Donation","Science Fair","Cultural Event",
];

const EMPTY_EDIT_FORM = {
  title:"", category:"", date:"", time:"", location:"", venue:"",
  shortDescription:"", description:"", youtubeLink:"", isFree:true,
  participationDetails:"", enableDonation:false, donationGoal:"",
  donationDescription:"", isFeatured:false, contactEmail:"",
  contactPhone:"", ageRestriction:"", parkingAvailable:false,
  foodAvailable:false, wheelchairAccessible:false,
};

const getImageSrc = (url) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${import.meta.env.VITE_API_BASE_URL?.replace("/api","") || ""}${url}`;
};

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US",{ year:"numeric", month:"short", day:"numeric" });
};

/* ─── styles ──────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  .mev*{box-sizing:border-box}
  .mev{font-family:'Plus Jakarta Sans',sans-serif;display:flex;flex-direction:column;gap:24px;animation:fadeUp .45s ease both}

  /* head */
  .mev-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap}
  .mev-title{font-size:22px;font-weight:900;color:#0f0f0f;letter-spacing:-.4px;margin:0 0 4px}
  .mev-sub{font-size:13px;color:#9ca3af;font-weight:500;margin:0}
  .mev-new-btn{display:flex;align-items:center;gap:7px;padding:10px 22px;border-radius:50px;border:none;background:linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;box-shadow:0 4px 14px color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent);text-decoration:none;transition:all .22s;white-space:nowrap}
  .mev-new-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px color-mix(in srgb,var(--color-primary,#4f46e5) 40%,transparent)}

  /* stats */
  .mev-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px}
  .mev-stat{background:#fff;border-radius:18px;border:1px solid #f0f0f0;padding:18px 16px;display:flex;align-items:center;gap:13px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .mev-stat-icon{width:44px;height:44px;border-radius:13px;flex-shrink:0;display:flex;align-items:center;justify-content:center}
  .mev-stat-label{font-size:11px;font-weight:600;color:#9ca3af;margin:0 0 3px}
  .mev-stat-value{font-size:22px;font-weight:900;letter-spacing:-.5px;margin:0;color:#0f0f0f}

  /* filter panel */
  .mev-fp{background:#fff;border-radius:20px;border:1px solid #f0f0f0;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .mev-fp-row{display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end}
  .mev-fg{display:flex;flex-direction:column;gap:5px;flex:1;min-width:150px}
  .mev-flabel{font-size:10.5px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.1em}
  .mev-finput{height:40px;padding:0 13px;border-radius:11px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:500;color:#111;font-family:inherit;transition:border-color .18s;outline:none;width:100%}
  .mev-finput:focus{border-color:var(--color-primary,#4f46e5)}
  .mev-finput-wrap{position:relative}
  .mev-finput-wrap .mev-finput{padding-left:36px}
  .mev-finput-icon{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:#9ca3af;pointer-events:none}
  .mev-fbtn{height:40px;padding:0 15px;border-radius:11px;border:1.5px solid #e5e7eb;background:#fff;font-size:12.5px;font-weight:700;color:#374151;cursor:pointer;display:flex;align-items:center;gap:6px;font-family:inherit;transition:all .18s;white-space:nowrap}
  .mev-fbtn:hover{background:#f7f7f8;border-color:#d1d5db}
  .mev-fbtn.active{background:color-mix(in srgb,var(--color-primary,#4f46e5) 8%,transparent);border-color:color-mix(in srgb,var(--color-primary,#4f46e5) 25%,transparent);color:var(--color-primary,#4f46e5)}
  .mev-chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:14px;padding-top:14px;border-top:1px solid #f3f4f6;align-items:center}
  .mev-chip{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:50px;font-size:11.5px;font-weight:700;background:color-mix(in srgb,var(--color-primary,#4f46e5) 8%,transparent);color:var(--color-primary,#4f46e5);border:1px solid color-mix(in srgb,var(--color-primary,#4f46e5) 18%,transparent)}
  .mev-chip-x{cursor:pointer;background:none;border:none;padding:0;display:flex;align-items:center;color:inherit;opacity:.6}
  .mev-chip-x:hover{opacity:1}
  .mev-clear{font-size:12px;font-weight:700;color:#ef4444;cursor:pointer;background:none;border:none;font-family:inherit}

  /* selection bar */
  .mev-selbar{background:color-mix(in srgb,var(--color-primary,#4f46e5) 6%,transparent);border:1px solid color-mix(in srgb,var(--color-primary,#4f46e5) 18%,transparent);border-radius:14px;padding:11px 16px;display:flex;align-items:center;justify-content:space-between}
  .mev-seltext{font-size:13px;font-weight:700;color:var(--color-primary,#4f46e5)}
  .mev-desel{padding:6px 13px;border-radius:9px;border:none;background:#fff;color:#6b7280;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .18s}
  .mev-desel:hover{background:#f3f4f6}

  /* results bar */
  .mev-resbar{display:flex;align-items:center;justify-content:space-between}
  .mev-rescnt{font-size:14px;font-weight:800;color:#0f0f0f}
  .mev-restot{font-size:12px;color:#9ca3af;font-weight:500}

  /* table */
  .mev-tcard{background:#fff;border-radius:20px;border:1px solid #f0f0f0;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .mev-table{width:100%;border-collapse:collapse}
  .mev-table thead{background:#fafafa}
  .mev-table th{padding:12px 16px;text-align:left;font-size:10.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#9ca3af;border-bottom:1px solid #f0f0f0}
  .mev-table td{padding:13px 16px;border-bottom:1px solid #f7f7f8;vertical-align:middle}
  .mev-table tbody tr{transition:background .15s}
  .mev-table tbody tr:hover{background:#fafafa}
  .mev-table tbody tr:last-child td{border-bottom:none}
  .mev-ename{font-size:13.5px;font-weight:700;color:#0f0f0f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px}
  .mev-emeta{font-size:11.5px;color:#9ca3af;font-weight:500;margin-top:2px}
  .mev-thumb{width:38px;height:38px;border-radius:10px;object-fit:cover;flex-shrink:0}
  .mev-thumb-ph{width:38px;height:38px;border-radius:10px;flex-shrink:0;background:linear-gradient(135deg,color-mix(in srgb,var(--color-primary,#4f46e5) 10%,#fff),color-mix(in srgb,var(--color-secondary,#7c3aed) 8%,#fff));display:flex;align-items:center;justify-content:center;color:var(--color-primary,#4f46e5)}

  /* badges */
  .mev-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:50px;font-size:11px;font-weight:700;white-space:nowrap}
  .mev-bg-green {color:#065f46;background:#d1fae5}
  .mev-bg-yellow{color:#92400e;background:#fef3c7}
  .mev-bg-red   {color:#991b1b;background:#fee2e2}
  .mev-bg-blue  {color:#1e40af;background:#dbeafe}
  .mev-bg-gray  {color:#4b5563;background:#f3f4f6}
  .mev-bg-orange{color:#9a3412;background:#ffedd5}
  .mev-bg-purple{color:#5b21b6;background:#ede9fe}

  /* progress */
  .mev-prog-wrap{min-width:76px}
  .mev-prog-row{display:flex;justify-content:space-between;font-size:11px;margin-bottom:4px}
  .mev-prog-sold{font-weight:700;color:#374151}
  .mev-prog-cap{color:#9ca3af}
  .mev-prog-track{height:5px;border-radius:50px;background:#f3f4f6;overflow:hidden}
  .mev-prog-fill{height:100%;border-radius:50px;background:var(--color-primary,#4f46e5);transition:width .5s}
  .mev-prog-fill.hi{background:#ef4444}

  /* action buttons */
  .mev-acts{display:flex;align-items:center;justify-content:flex-end;gap:6px}
  .mev-act{width:32px;height:32px;border-radius:9px;border:1.5px solid #e5e7eb;background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#6b7280;transition:all .18s}
  .mev-act:hover{background:#f7f7f8;border-color:#d1d5db;color:#374151}
  .mev-act.v:hover{background:#eff6ff;border-color:#bfdbfe;color:#2563eb}
  .mev-act.e:hover{background:color-mix(in srgb,var(--color-primary,#4f46e5) 8%,transparent);border-color:color-mix(in srgb,var(--color-primary,#4f46e5) 22%,transparent);color:var(--color-primary,#4f46e5)}
  .mev-act.d:hover{background:#fef2f2;border-color:#fecaca;color:#ef4444}

  /* spinner / empty */
  .mev-spin{width:38px;height:38px;border-radius:50%;border:3px solid #f0f0f0;border-top-color:var(--color-primary,#4f46e5);animation:spin .75s linear infinite}
  .mev-empty{text-align:center;padding:56px 24px}
  .mev-empty-ico{width:52px;height:52px;border-radius:16px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;margin:0 auto 14px;color:#9ca3af}
  .mev-empty-t{font-size:15px;font-weight:800;color:#0f0f0f;margin:0 0 6px}
  .mev-empty-s{font-size:13px;color:#9ca3af;margin:0 0 20px}

  /* modals */
  .mev-backdrop{position:fixed;inset:0;z-index:50;background:rgba(15,15,15,.6);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:16px}
  .mev-modal{background:#fff;border-radius:22px;width:100%;max-width:640px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 64px rgba(0,0,0,.18)}
  .mev-modal::-webkit-scrollbar{width:4px}
  .mev-modal::-webkit-scrollbar-thumb{background:#e5e7eb;border-radius:99px}
  .mev-modal-head{display:flex;align-items:center;justify-content:space-between;padding:20px 24px 16px;border-bottom:1px solid #f3f4f6;position:sticky;top:0;background:#fff;z-index:2;border-radius:22px 22px 0 0}
  .mev-modal-title{font-size:17px;font-weight:800;color:#0f0f0f;margin:0}
  .mev-modal-sub{font-size:11.5px;color:#9ca3af;font-weight:500;margin-top:2px}
  .mev-modal-x{width:30px;height:30px;border-radius:9px;border:none;background:#f5f5f5;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#6b7280;transition:all .18s}
  .mev-modal-x:hover{background:#e5e7eb;color:#374151}
  .mev-modal-body{padding:20px 24px}
  .mev-modal-foot{padding:16px 24px;border-top:1px solid #f3f4f6;display:flex;gap:10px}

  /* view modal */
  .mev-view-img{width:100%;height:200px;object-fit:cover;border-radius:16px;margin-bottom:16px}
  .mev-view-ph{height:120px;border-radius:16px;background:linear-gradient(135deg,color-mix(in srgb,var(--color-primary,#4f46e5) 12%,#fff),color-mix(in srgb,var(--color-secondary,#7c3aed) 8%,#fff));display:flex;align-items:center;justify-content:center;color:var(--color-primary,#4f46e5);margin-bottom:16px;position:relative}
  .mev-view-badges{position:absolute;bottom:12px;left:12px;display:flex;gap:7px}
  .mev-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:14px 0}
  .mev-info-cell{background:#fafafa;border-radius:12px;padding:12px 14px}
  .mev-info-clabel{font-size:10px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.1em;margin:0 0 4px;display:flex;align-items:center;gap:5px}
  .mev-info-cval{font-size:13.5px;font-weight:700;color:#0f0f0f;margin:0}
  .mev-info-csub{font-size:11.5px;color:#9ca3af;margin:2px 0 0}
  .mev-desc-head{font-size:10px;font-weight:800;color:#9ca3af;text-transform:uppercase;letter-spacing:.12em;margin:0 0 6px}
  .mev-desc-text{font-size:13px;color:#374151;line-height:1.7;margin:0;white-space:pre-wrap}
  .mev-part-box{background:color-mix(in srgb,var(--color-primary,#4f46e5) 5%,transparent);border:1px solid color-mix(in srgb,var(--color-primary,#4f46e5) 14%,transparent);border-radius:13px;padding:14px}
  .mev-fac-chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px}
  .mev-fac-chip{display:inline-flex;align-items:center;gap:5px;padding:5px 11px;border-radius:50px;background:#f3f4f6;font-size:11.5px;font-weight:600;color:#374151}

  /* form fields */
  .mev-field{display:flex;flex-direction:column;gap:5px}
  .mev-label{font-size:12px;font-weight:700;color:#374151}
  .mev-req{color:#ef4444}
  .mev-finput2{height:40px;padding:0 13px;border-radius:11px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:500;color:#111;font-family:inherit;transition:border-color .18s;outline:none;width:100%}
  .mev-finput2:focus{border-color:var(--color-primary,#4f46e5)}
  .mev-finput2.err{border-color:#ef4444}
  .mev-textarea{min-height:90px;padding:10px 13px;border-radius:11px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:500;color:#111;font-family:inherit;transition:border-color .18s;outline:none;width:100%;resize:vertical;line-height:1.6}
  .mev-textarea:focus{border-color:var(--color-primary,#4f46e5)}
  .mev-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  @media(max-width:560px){.mev-form-grid{grid-template-columns:1fr}}
  .mev-col2{grid-column:1/-1}

  /* access toggle */
  .mev-access-toggle{background:#fafafa;border-radius:14px;padding:16px;border:1px solid #f0f0f0}
  .mev-access-option{flex:1;display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:11px;border:1.5px solid #e5e7eb;cursor:pointer;transition:all .18s;background:#fff}
  .mev-access-option.sel-free{background:#eff6ff;border-color:#93c5fd}
  .mev-access-option.sel-paid{background:#fff7ed;border-color:#fdba74}
  .mev-access-icon{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}

  /* facilities */
  .mev-fac-row{display:flex;flex-wrap:wrap;gap:10px}
  .mev-fac-opt{display:flex;align-items:center;gap:7px;padding:9px 14px;border-radius:10px;border:1.5px solid #e5e7eb;background:#fff;cursor:pointer;transition:all .18s;font-size:12.5px;font-weight:600;color:#4b5563;user-select:none}
  .mev-fac-opt.on{background:color-mix(in srgb,var(--color-primary,#4f46e5) 7%,transparent);border-color:color-mix(in srgb,var(--color-primary,#4f46e5) 22%,transparent);color:var(--color-primary,#4f46e5)}

  /* image upload preview */
  .mev-img-preview{width:100%;height:140px;object-fit:cover;border-radius:13px;margin-bottom:10px}
  .mev-img-upload{border:2px dashed #e5e7eb;border-radius:13px;padding:18px;text-align:center;cursor:pointer;transition:border-color .18s;position:relative}
  .mev-img-upload:hover{border-color:var(--color-primary,#4f46e5)}
  .mev-img-upload input{position:absolute;inset:0;opacity:0;cursor:pointer}

  /* modal action btns */
  .mev-btn-outline{flex:1;padding:11px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:700;color:#374151;cursor:pointer;font-family:inherit;transition:all .18s}
  .mev-btn-outline:hover{background:#f7f7f8}
  .mev-btn-outline:disabled{opacity:.5;cursor:not-allowed}
  .mev-btn-primary{flex:1;padding:11px;border-radius:12px;border:none;background:linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));font-size:13px;font-weight:700;color:#fff;cursor:pointer;font-family:inherit;transition:all .18s;display:flex;align-items:center;justify-content:center;gap:7px;box-shadow:0 4px 14px color-mix(in srgb,var(--color-primary,#4f46e5) 28%,transparent)}
  .mev-btn-primary:hover{opacity:.9}
  .mev-btn-primary:disabled{opacity:.6;cursor:not-allowed}
  .mev-btn-danger{flex:1;padding:11px;border-radius:12px;border:none;background:#ef4444;font-size:13px;font-weight:700;color:#fff;cursor:pointer;font-family:inherit;transition:opacity .18s}
  .mev-btn-danger:hover{opacity:.88}

  /* delete modal */
  .mev-del-modal{background:#fff;border-radius:22px;width:100%;max-width:420px;padding:32px;box-shadow:0 24px 64px rgba(0,0,0,.18);text-align:center}
  .mev-del-icon{width:56px;height:56px;border-radius:18px;background:#fef2f2;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;color:#ef4444}
  .mev-del-title{font-size:17px;font-weight:800;color:#0f0f0f;margin:0 0 10px}
  .mev-del-text{font-size:13px;color:#6b7280;line-height:1.65;margin:0 0 24px}

  /* section divider label */
  .mev-sec-label{font-size:9.5px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#c4c4c4;margin:18px 0 8px;padding:0}
`;

/* ─── badge helper ────────────────────────────────────── */
const Badge = ({ status }) => {
  if (status === "Approved") return <span className="mev-badge mev-bg-green"><CheckCircle size={11} strokeWidth={2.5}/>Approved</span>;
  if (status === "Pending")  return <span className="mev-badge mev-bg-yellow"><Clock size={11} strokeWidth={2.5}/>Pending</span>;
  if (status === "Rejected") return <span className="mev-badge mev-bg-red"><AlertCircle size={11} strokeWidth={2.5}/>Rejected</span>;
  return <span className="mev-badge mev-bg-gray">{status}</span>;
};

/* ─── section label helper ────────────────────────────── */
const SecLabel = ({ children }) => <p className="mev-sec-label">{children}</p>;

/* ═══════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════ */
const ManageEvents = () => {
  const navigate = useNavigate();
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [catFilter, setCatFilter]       = useState("All");
  const [dateRange, setDateRange]       = useState({ start:"", end:"" });
  const [showFilters, setShowFilters]   = useState(false);
  const [selectedEvents, setSelectedEvents] = useState([]);

  const [events, setEvents]   = useState([]);
  const [loading, setLoading] = useState(true);
  const { userProfile } = useAuth();

  const [viewEvent, setViewEvent]     = useState(null);
  const [editEventId, setEditEventId] = useState(null);
  const [editForm, setEditForm]       = useState(EMPTY_EDIT_FORM);
  const [editImage, setEditImage]     = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const [isSaving, setIsSaving]       = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete]     = useState(null);

  /* fetch */
  const fetchEvents = useCallback(async () => {
    if (!userProfile?.schoolId) return;
    setLoading(true);
    try {
      const res = await ApiEvent.getAdminEvents(userProfile.schoolId);
      setEvents(res.data);
    } catch { toast.error("Failed to fetch events"); }
    finally { setLoading(false); }
  }, [userProfile?.schoolId]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const clearAll = () => { setSearch(""); setStatusFilter("All"); setCatFilter("All"); setDateRange({ start:"", end:"" }); };

  const filteredEvents = useMemo(() => events.filter(ev => {
    const q = search.toLowerCase();
    return (
      !ev.isDeleted &&
      (ev.title.toLowerCase().includes(q) || ev.location.toLowerCase().includes(q)) &&
      (statusFilter === "All" || ev.status === statusFilter) &&
      (catFilter === "All" || ev.category === catFilter) &&
      (!dateRange.start || ev.date >= dateRange.start) &&
      (!dateRange.end   || ev.date <= dateRange.end)
    );
  }), [events, search, statusFilter, catFilter, dateRange]);

  /* view */
  const handleView = async (ev) => {
    setViewEvent(ev);
    try {
      await ApiEvent.incrementView(ev.id);
      setEvents(prev => prev.map(e => e.id === ev.id ? { ...e, viewCount:(e.viewCount||0)+1 } : e));
    } catch {}
  };

  /* edit */
  const handleOpenEdit = (ev) => {
    setEditEventId(ev.id);
    setEditForm({
      title: ev.title||"", category: ev.category||"",
      date: new Date(ev.date).toISOString().split("T")[0],
      time: ev.time||"", location: ev.location||"", venue: ev.venue||"",
      shortDescription: ev.shortDescription||"", description: ev.description||"",
      youtubeLink: ev.youtubeLink||"", isFree: ev.isFree??true,
      participationDetails: ev.participationDetails||"",
      enableDonation: ev.enableDonation||false, donationGoal: ev.donationGoal||"",
      donationDescription: ev.donationDescription||"", isFeatured: ev.isFeatured||false,
      contactEmail: ev.contactEmail||"", contactPhone: ev.contactPhone||"",
      ageRestriction: ev.ageRestriction||"", parkingAvailable: ev.parkingAvailable||false,
      foodAvailable: ev.foodAvailable||false, wheelchairAccessible: ev.wheelchairAccessible||false,
    });
    setEditImage(null);
    setEditPreview(ev.image ? getImageSrc(ev.image) : null);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSaveEdit = async () => {
    if (!editForm.title.trim() || !editForm.category || !editForm.date || !editForm.location.trim()) {
      toast.error("Please fill in all required fields"); return;
    }
    setIsSaving(true);
    try {
      const fd = new FormData();
      Object.entries({
        Title: editForm.title, Category: editForm.category,
        Date: new Date(editForm.date).toISOString(), Time: editForm.time||"",
        Location: editForm.location, Venue: editForm.venue||"",
        ShortDescription: editForm.shortDescription, Description: editForm.description,
        YoutubeLink: editForm.youtubeLink||"", IsFree: editForm.isFree,
        ParticipationDetails: editForm.participationDetails||"", EnableTickets: false,
        EnableDonation: editForm.enableDonation, DonationGoal: editForm.donationGoal||0,
        DonationDescription: editForm.donationDescription||"", IsFeatured: editForm.isFeatured,
        ContactEmail: editForm.contactEmail||"", ContactPhone: editForm.contactPhone||"",
        AgeRestriction: editForm.ageRestriction||"", ParkingAvailable: editForm.parkingAvailable,
        FoodAvailable: editForm.foodAvailable, WheelchairAccessible: editForm.wheelchairAccessible,
        SchoolId: userProfile?.schoolId||"",
      }).forEach(([k,v]) => fd.append(k, v));
      if (editImage) fd.append("ImageFile", editImage);
      await ApiEvent.updateEvent(editEventId, fd);
      toast.success("Event updated — re-submitted for approval.");
      setEditEventId(null); fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update event");
    } finally { setIsSaving(false); }
  };

  /* delete */
  const handleDeleteConfirm = async () => {
    try {
      await ApiEvent.deleteEvent(eventToDelete.id);
      toast.success("Event deleted");
      fetchEvents();
    } catch { toast.error("Failed to delete event"); }
    finally { setShowDeleteModal(false); setEventToDelete(null); }
  };

  /* select all */
  const handleSelectAll = (e) => setSelectedEvents(e.target.checked ? filteredEvents.map(ev => ev.id) : []);
  const handleSelect    = (id) => setSelectedEvents(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  /* active filter chips */
  const hasFilters = search || statusFilter !== "All" || catFilter !== "All" || dateRange.start || dateRange.end;

  return (
    <div className="mev">
      <style>{styles}</style>

      {/* ── PAGE HEAD ── */}
      <div className="mev-head">
        <div>
          <h1 className="mev-title">Manage Events</h1>
          <p className="mev-sub">Create, edit, and manage all your school events in one place.</p>
        </div>
        <Link to="/school-admin/events/create" className="mev-new-btn">
          <PlusCircle size={15} strokeWidth={2.5}/> Create New Event
        </Link>
      </div>

      {/* ── STATS ── */}
      <div className="mev-stats">
        {[
          { label:"Total Events",     value:events.length,                                  icon:CalendarDays, bg:"#eff6ff", color:"#2563eb" },
          { label:"Approved",         value:events.filter(e=>e.status==="Approved").length, icon:CheckCircle,  bg:"#ecfdf5", color:"#059669" },
          { label:"Pending Approval", value:events.filter(e=>e.status==="Pending").length,  icon:Clock,        bg:"#fffbeb", color:"#d97706" },
          { label:"Free Events",      value:events.filter(e=>e.isFree).length,              icon:Ticket,       bg:"#f5f3ff", color:"#7c3aed" },
        ].map(({ label, value, icon:Icon, bg, color }) => (
          <div key={label} className="mev-stat">
            <div className="mev-stat-icon" style={{ background:bg, color }}>
              <Icon size={20} strokeWidth={2}/>
            </div>
            <div>
              <p className="mev-stat-label">{label}</p>
              <p className="mev-stat-value">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── FILTERS ── */}
      <div className="mev-fp">
        <div className="mev-fp-row">
          {/* search */}
          <div className="mev-fg" style={{ flex:2, minWidth:200 }}>
            <span className="mev-flabel">Search</span>
            <div className="mev-finput-wrap">
              <Search size={14} className="mev-finput-icon"/>
              <input className="mev-finput" placeholder="Search by name or location…" value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
          </div>
          {/* status */}
          <div className="mev-fg">
            <span className="mev-flabel">Status</span>
            <select className="mev-finput" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          {/* category */}
          <div className="mev-fg">
            <span className="mev-flabel">Category</span>
            <select className="mev-finput" value={catFilter} onChange={e=>setCatFilter(e.target.value)}>
              <option value="All">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {/* more filters toggle */}
          <button className={`mev-fbtn ${showFilters?"active":""}`} onClick={()=>setShowFilters(v=>!v)}>
            <SlidersHorizontal size={14} strokeWidth={2.2}/>
            {showFilters ? "Less" : "More"} Filters
          </button>
        </div>

        {/* expanded date range */}
        {showFilters && (
          <div style={{ marginTop:14, paddingTop:14, borderTop:"1px solid #f3f4f6", display:"flex", gap:12, flexWrap:"wrap" }}>
            <div className="mev-fg" style={{ maxWidth:280 }}>
              <span className="mev-flabel">Date From</span>
              <input type="date" className="mev-finput" value={dateRange.start} onChange={e=>setDateRange(d=>({...d,start:e.target.value}))}/>
            </div>
            <div className="mev-fg" style={{ maxWidth:280 }}>
              <span className="mev-flabel">Date To</span>
              <input type="date" className="mev-finput" value={dateRange.end} onChange={e=>setDateRange(d=>({...d,end:e.target.value}))}/>
            </div>
          </div>
        )}

        {/* active filter chips */}
        {hasFilters && (
          <div className="mev-chips">
            <span style={{ fontSize:11.5, fontWeight:700, color:"#9ca3af" }}>Active:</span>
            {search && <span className="mev-chip">Search: {search}<button className="mev-chip-x" onClick={()=>setSearch("")}><X size={11}/></button></span>}
            {statusFilter !== "All" && <span className="mev-chip">Status: {statusFilter}<button className="mev-chip-x" onClick={()=>setStatusFilter("All")}><X size={11}/></button></span>}
            {catFilter !== "All" && <span className="mev-chip">Category: {catFilter}<button className="mev-chip-x" onClick={()=>setCatFilter("All")}><X size={11}/></button></span>}
            {(dateRange.start||dateRange.end) && <span className="mev-chip">Date: {dateRange.start||"Any"} – {dateRange.end||"Any"}<button className="mev-chip-x" onClick={()=>setDateRange({start:"",end:""})}><X size={11}/></button></span>}
            <button className="mev-clear" onClick={clearAll}>Clear all</button>
          </div>
        )}
      </div>

      {/* ── SELECTION BAR ── */}
      {selectedEvents.length > 0 && (
        <div className="mev-selbar">
          <span className="mev-seltext">{selectedEvents.length} event{selectedEvents.length>1?"s":""} selected</span>
          <button className="mev-desel" onClick={()=>setSelectedEvents([])}>Clear selection</button>
        </div>
      )}

      {/* ── RESULTS BAR ── */}
      <div className="mev-resbar">
        <span className="mev-rescnt">{filteredEvents.length} Event{filteredEvents.length!==1?"s":""} Found</span>
        <span className="mev-restot">Showing {filteredEvents.length} of {events.length}</span>
      </div>

      {/* ── TABLE ── */}
      <div className="mev-tcard">
        {loading ? (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"56px 24px", gap:14 }}>
            <div className="mev-spin"/>
            <p style={{ fontSize:13, color:"#9ca3af", fontWeight:600 }}>Loading events…</p>
          </div>
        ) : (
          <div style={{ overflowX:"auto" }}>
            <table className="mev-table">
              <thead>
                <tr>
                  <th style={{ width:42 }}>
                    <input type="checkbox" checked={selectedEvents.length===filteredEvents.length&&filteredEvents.length>0} onChange={handleSelectAll} style={{ accentColor:"var(--color-primary,#4f46e5)" }}/>
                  </th>
                  <th>Event</th>
                  <th>Date & Time</th>
                  <th>Access</th>
                  <th>Views</th>
                  <th>Status</th>
                  <th style={{ textAlign:"right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map(ev => (
                  <tr key={ev.id}>
                    <td><input type="checkbox" checked={selectedEvents.includes(ev.id)} onChange={()=>handleSelect(ev.id)} style={{ accentColor:"var(--color-primary,#4f46e5)" }}/></td>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        {ev.image
                          ? <img src={getImageSrc(ev.image)} alt={ev.title} className="mev-thumb"/>
                          : <div className="mev-thumb-ph"><CalendarDays size={16} strokeWidth={2}/></div>
                        }
                        <div>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <p className="mev-ename">{ev.title}</p>
                            {ev.isFeatured && <span className="mev-badge mev-bg-yellow"><Star size={10} strokeWidth={2.5}/>Featured</span>}
                          </div>
                          <p className="mev-emeta">{ev.category} · {ev.location}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p style={{ fontSize:13, fontWeight:600, color:"#374151", margin:0 }}>{fmtDate(ev.date)}</p>
                      <p style={{ fontSize:11.5, color:"#9ca3af", margin:"2px 0 0" }}>{ev.time}</p>
                    </td>
                    <td>
                      {ev.isFree
                        ? <span className="mev-badge mev-bg-blue">Free</span>
                        : <span className="mev-badge mev-bg-orange"><Ticket size={10} strokeWidth={2.5}/>Paid</span>
                      }
                    </td>
                    <td>
                      <span style={{ fontSize:12.5, fontWeight:600, color:"#6b7280", display:"flex", alignItems:"center", gap:5 }}>
                        <Eye size={13} strokeWidth={2}/>{(ev.viewCount||0).toLocaleString()}
                      </span>
                    </td>
                    <td><Badge status={ev.status}/></td>
                    <td>
                      <div className="mev-acts">
                        <button className="mev-act v" title="View" onClick={()=>handleView(ev)}><Eye size={14} strokeWidth={2.2}/></button>
                        <button className="mev-act e" title="Edit" onClick={()=>handleOpenEdit(ev)}><Pencil size={14} strokeWidth={2.2}/></button>
                        <button className="mev-act d" title="Delete" onClick={()=>{ setEventToDelete(ev); setShowDeleteModal(true); }}><Trash2 size={14} strokeWidth={2.2}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredEvents.length === 0 && (
              <div className="mev-empty">
                <div className="mev-empty-ico"><CalendarDays size={24} strokeWidth={1.8}/></div>
                <p className="mev-empty-t">No events found</p>
                <p className="mev-empty-s">Try adjusting your search or filter criteria</p>
                <button className="mev-fbtn" style={{ margin:"0 auto" }} onClick={clearAll}>Clear all filters</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ════ VIEW MODAL ════ */}
      {viewEvent && (
        <div className="mev-backdrop" onClick={()=>setViewEvent(null)}>
          <div className="mev-modal" onClick={e=>e.stopPropagation()}>
            <div className="mev-modal-head">
              <div>
                <p className="mev-modal-title">{viewEvent.title}</p>
                <p className="mev-modal-sub">{viewEvent.category} · {viewEvent.location}</p>
              </div>
              <button className="mev-modal-x" onClick={()=>setViewEvent(null)}><X size={15} strokeWidth={2.2}/></button>
            </div>
            <div className="mev-modal-body">
              {/* image */}
              {viewEvent.image
                ? <img src={getImageSrc(viewEvent.image)} alt="" className="mev-view-img"/>
                : (
                  <div className="mev-view-ph">
                    <div className="mev-view-badges">
                      <Badge status={viewEvent.status}/>
                      {viewEvent.isFree
                        ? <span className="mev-badge mev-bg-blue">Free</span>
                        : <span className="mev-badge mev-bg-orange"><Ticket size={10} strokeWidth={2.5}/>Paid</span>
                      }
                    </div>
                    <CalendarDays size={36} strokeWidth={1.5}/>
                  </div>
                )
              }
              {/* badges row */}
              <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:14, flexWrap:"wrap" }}>
                <Badge status={viewEvent.status}/>
                {viewEvent.isFree ? <span className="mev-badge mev-bg-blue">Free</span> : <span className="mev-badge mev-bg-orange"><Ticket size={10}/>Paid</span>}
                {viewEvent.isFeatured && <span className="mev-badge mev-bg-yellow"><Star size={10}/>Featured</span>}
              </div>

              {/* info grid */}
              <div className="mev-info-grid">
                <div className="mev-info-cell">
                  <p className="mev-info-clabel"><CalendarDays size={11}/>Date & Time</p>
                  <p className="mev-info-cval">{fmtDate(viewEvent.date)}</p>
                  <p className="mev-info-csub">{viewEvent.time}</p>
                </div>
                <div className="mev-info-cell">
                  <p className="mev-info-clabel"><MapPin size={11}/>Venue</p>
                  <p className="mev-info-cval">{viewEvent.location}</p>
                  {viewEvent.venue && <p className="mev-info-csub">{viewEvent.venue}</p>}
                </div>
                {viewEvent.contactEmail && (
                  <div className="mev-info-cell">
                    <p className="mev-info-clabel"><Mail size={11}/>Contact Email</p>
                    <p className="mev-info-cval" style={{ fontSize:12 }}>{viewEvent.contactEmail}</p>
                  </div>
                )}
                {viewEvent.contactPhone && (
                  <div className="mev-info-cell">
                    <p className="mev-info-clabel"><Phone size={11}/>Contact Phone</p>
                    <p className="mev-info-cval">{viewEvent.contactPhone}</p>
                  </div>
                )}
                <div className="mev-info-cell">
                  <p className="mev-info-clabel"><Eye size={11}/>Total Views</p>
                  <p className="mev-info-cval">{(viewEvent.viewCount||0).toLocaleString()}</p>
                </div>
                {viewEvent.ageRestriction && (
                  <div className="mev-info-cell">
                    <p className="mev-info-clabel">Age Restriction</p>
                    <p className="mev-info-cval">{viewEvent.ageRestriction}</p>
                  </div>
                )}
              </div>

              {viewEvent.shortDescription && (
                <div style={{ marginBottom:14 }}>
                  <p className="mev-desc-head">Short Description</p>
                  <p className="mev-desc-text">{viewEvent.shortDescription}</p>
                </div>
              )}
              {viewEvent.description && (
                <div style={{ marginBottom:14 }}>
                  <p className="mev-desc-head">Full Description</p>
                  <p className="mev-desc-text">{viewEvent.description}</p>
                </div>
              )}
              {viewEvent.participationDetails && (
                <div className="mev-part-box" style={{ marginBottom:14 }}>
                  <p className="mev-desc-head" style={{ color:"var(--color-primary,#4f46e5)", marginBottom:6 }}>How to Participate</p>
                  <p className="mev-desc-text" style={{ color:"#374151" }}>{viewEvent.participationDetails}</p>
                </div>
              )}
              {/* facilities */}
              {(viewEvent.parkingAvailable || viewEvent.foodAvailable || viewEvent.wheelchairAccessible) && (
                <div className="mev-fac-chips">
                  {viewEvent.parkingAvailable && <span className="mev-fac-chip"><ParkingSquare size={13} strokeWidth={2}/>Parking</span>}
                  {viewEvent.foodAvailable    && <span className="mev-fac-chip"><UtensilsCrossed size={13} strokeWidth={2}/>Food</span>}
                  {viewEvent.wheelchairAccessible && <span className="mev-fac-chip"><Accessibility size={13} strokeWidth={2}/>Accessible</span>}
                </div>
              )}
            </div>
            <div className="mev-modal-foot">
              <button className="mev-btn-outline" onClick={()=>{ setViewEvent(null); handleOpenEdit(viewEvent); }}>
                <Pencil size={13} strokeWidth={2.5}/> Edit Event
              </button>
              <button className="mev-btn-primary" onClick={()=>setViewEvent(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ════ EDIT MODAL ════ */}
      {editEventId && (
        <div className="mev-backdrop">
          <div className="mev-modal">
            <div className="mev-modal-head">
              <div>
                <p className="mev-modal-title">Edit Event</p>
                <p className="mev-modal-sub">Changes will re-submit the event for approval.</p>
              </div>
              <button className="mev-modal-x" onClick={()=>setEditEventId(null)}><X size={15} strokeWidth={2.2}/></button>
            </div>
            <div className="mev-modal-body">
              {/* image */}
              {editPreview && <img src={editPreview} alt="preview" className="mev-img-preview"/>}
              <label className="mev-img-upload" style={{ marginBottom:18 }}>
                <input type="file" accept="image/*" onChange={e=>{ const f=e.target.files[0]; if(f){ setEditImage(f); setEditPreview(URL.createObjectURL(f)); } }}/>
                <ImagePlus size={20} strokeWidth={1.8} color="#9ca3af" style={{ margin:"0 auto 6px" }}/>
                <p style={{ fontSize:12.5, color:"#9ca3af", fontWeight:600, margin:0 }}>{editPreview ? "Change image" : "Upload event image"}</p>
              </label>

              <SecLabel>Basic Info</SecLabel>
              <div className="mev-form-grid">
                <div className="mev-field mev-col2">
                  <label className="mev-label">Event Title <span className="mev-req">*</span></label>
                  <input className="mev-finput2" name="title" value={editForm.title} onChange={handleEditChange} placeholder="Event title"/>
                </div>
                <div className="mev-field">
                  <label className="mev-label">Category <span className="mev-req">*</span></label>
                  <select className="mev-finput2" name="category" value={editForm.category} onChange={handleEditChange}>
                    <option value="">Select category</option>
                    {categories.map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="mev-field">
                  <label className="mev-label">Location <span className="mev-req">*</span></label>
                  <input className="mev-finput2" name="location" value={editForm.location} onChange={handleEditChange}/>
                </div>
                <div className="mev-field">
                  <label className="mev-label">Date <span className="mev-req">*</span></label>
                  <input type="date" className="mev-finput2" name="date" value={editForm.date} onChange={handleEditChange}/>
                </div>
                <div className="mev-field">
                  <label className="mev-label">Time</label>
                  <input type="time" className="mev-finput2" name="time" value={editForm.time} onChange={handleEditChange}/>
                </div>
                <div className="mev-field">
                  <label className="mev-label">Venue Name</label>
                  <input className="mev-finput2" name="venue" value={editForm.venue} onChange={handleEditChange} placeholder="e.g. Main Hall"/>
                </div>
                <div className="mev-field">
                  <label className="mev-label">Contact Email</label>
                  <input type="email" className="mev-finput2" name="contactEmail" value={editForm.contactEmail} onChange={handleEditChange}/>
                </div>
                <div className="mev-field mev-col2">
                  <label className="mev-label">Short Description</label>
                  <input className="mev-finput2" name="shortDescription" value={editForm.shortDescription} onChange={handleEditChange} maxLength={150}/>
                </div>
                <div className="mev-field mev-col2">
                  <label className="mev-label">Full Description</label>
                  <textarea className="mev-textarea" name="description" value={editForm.description} onChange={handleEditChange} rows={4}/>
                </div>
              </div>

              <SecLabel>Access Type</SecLabel>
              <div className="mev-access-toggle" style={{ marginBottom:14 }}>
                <div style={{ display:"flex", gap:10 }}>
                  <label className={`mev-access-option ${editForm.isFree?"sel-free":""}`}>
                    <input type="radio" style={{ display:"none" }} checked={editForm.isFree===true} onChange={()=>setEditForm(p=>({...p,isFree:true}))}/>
                    <div className="mev-access-icon" style={{ background: editForm.isFree?"#dbeafe":"#f3f4f6" }}>🆓</div>
                    <div>
                      <p style={{ fontSize:13, fontWeight:700, color: editForm.isFree?"#1e40af":"#374151", margin:0 }}>Free Event</p>
                      <p style={{ fontSize:11, color:"#9ca3af", margin:"2px 0 0" }}>No fees required</p>
                    </div>
                  </label>
                  <label className={`mev-access-option ${!editForm.isFree?"sel-paid":""}`}>
                    <input type="radio" style={{ display:"none" }} checked={editForm.isFree===false} onChange={()=>setEditForm(p=>({...p,isFree:false}))}/>
                    <div className="mev-access-icon" style={{ background: !editForm.isFree?"#ffedd5":"#f3f4f6" }}>🎟️</div>
                    <div>
                      <p style={{ fontSize:13, fontWeight:700, color: !editForm.isFree?"#9a3412":"#374151", margin:0 }}>Paid / RSVP</p>
                      <p style={{ fontSize:11, color:"#9ca3af", margin:"2px 0 0" }}>Requires payment</p>
                    </div>
                  </label>
                </div>
              </div>

              <SecLabel>Participation Instructions</SecLabel>
              <div className="mev-field" style={{ marginBottom:14 }}>
                <textarea className="mev-textarea" name="participationDetails" value={editForm.participationDetails} onChange={handleEditChange} rows={3} placeholder="How can users join this event?"/>
              </div>

              <SecLabel>Facilities</SecLabel>
              <div className="mev-fac-row" style={{ marginBottom:4 }}>
                {[
                  { name:"parkingAvailable",    icon:<ParkingSquare size={14} strokeWidth={2}/>,   label:"Parking" },
                  { name:"foodAvailable",        icon:<UtensilsCrossed size={14} strokeWidth={2}/>, label:"Food" },
                  { name:"wheelchairAccessible", icon:<Accessibility size={14} strokeWidth={2}/>,   label:"Accessible" },
                  { name:"isFeatured",           icon:<Star size={14} strokeWidth={2}/>,             label:"Request Featured" },
                ].map(({ name, icon, label }) => (
                  <label key={name} className={`mev-fac-opt ${editForm[name]?"on":""}`}>
                    <input type="checkbox" name={name} checked={!!editForm[name]} onChange={handleEditChange} style={{ display:"none" }}/>
                    {icon}{label}
                  </label>
                ))}
              </div>
            </div>
            <div className="mev-modal-foot">
              <button className="mev-btn-outline" onClick={()=>setEditEventId(null)} disabled={isSaving}>Cancel</button>
              <button className="mev-btn-primary" onClick={handleSaveEdit} disabled={isSaving}>
                {isSaving ? <><div className="mev-spin" style={{ width:16,height:16,borderWidth:2 }}/>Saving…</> : <><Save size={14} strokeWidth={2.5}/>Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════ DELETE MODAL ════ */}
      {showDeleteModal && eventToDelete && (
        <div className="mev-backdrop">
          <div className="mev-del-modal">
            <div className="mev-del-icon"><Trash2 size={24} strokeWidth={2}/></div>
            <p className="mev-del-title">Delete Event</p>
            <p className="mev-del-text">Are you sure you want to delete <strong>"{eventToDelete.title}"</strong>? This action cannot be undone.</p>
            <div style={{ display:"flex", gap:10 }}>
              <button className="mev-btn-outline" onClick={()=>setShowDeleteModal(false)}>Cancel</button>
              <button className="mev-btn-danger" onClick={handleDeleteConfirm}>Delete Event</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;