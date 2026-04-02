import React, { useMemo, useState, useEffect, useCallback } from "react";
import ApiStory from "../../services/ApiStory";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import {
  PlusCircle, Search, X, Eye, Pencil, Trash2,
  CheckCircle, Clock, BookOpen, Newspaper, Trophy,
  Megaphone, Star, Tag, ImagePlus, RefreshCw,
  Send, Save, RotateCcw, Zap, Hash, AlertCircle,
  Heart, MessageCircle, Calendar,
} from "lucide-react";

/* ─── constants ───────────────────────────────────────── */
const CATEGORIES = [
  { value: "News",        icon: Newspaper, color: "#2563eb", bg: "#eff6ff" },
  { value: "Achievement", icon: Trophy,    color: "#d97706", bg: "#fffbeb" },
  { value: "Event",       icon: Calendar,  color: "#7c3aed", bg: "#f5f3ff" },
  { value: "Notice",      icon: Megaphone, color: "#db2777", bg: "#fdf2f8" },
];

const INIT_FORM = {
  title: "", description: "", content: "",
  category: "News", imageFile: null, isPublished: false, tags: "",
};

/* ─── styles ──────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  .ms*{box-sizing:border-box}
  .ms{font-family:'Plus Jakarta Sans',sans-serif;display:flex;flex-direction:column;gap:24px;animation:fadeUp .45s ease both}

  /* head */
  .ms-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap}
  .ms-title{font-size:22px;font-weight:900;color:#0f0f0f;letter-spacing:-.4px;margin:0 0 4px}
  .ms-sub{font-size:13px;color:#9ca3af;font-weight:500;margin:0}
  .ms-new-btn{display:flex;align-items:center;gap:7px;padding:10px 22px;border-radius:50px;border:none;background:linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;box-shadow:0 4px 14px color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent);transition:all .22s;white-space:nowrap}
  .ms-new-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px color-mix(in srgb,var(--color-primary,#4f46e5) 40%,transparent)}

  /* stats */
  .ms-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px}
  .ms-stat{background:#fff;border-radius:18px;border:1px solid #f0f0f0;padding:18px 16px;display:flex;align-items:center;gap:13px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .ms-stat-icon{width:44px;height:44px;border-radius:13px;flex-shrink:0;display:flex;align-items:center;justify-content:center}
  .ms-stat-label{font-size:11px;font-weight:600;color:#9ca3af;margin:0 0 3px}
  .ms-stat-value{font-size:22px;font-weight:900;letter-spacing:-.5px;margin:0;color:#0f0f0f}

  /* filter panel */
  .ms-fp{background:#fff;border-radius:20px;border:1px solid #f0f0f0;padding:18px 20px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .ms-fp-row{display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end}
  .ms-fg{display:flex;flex-direction:column;gap:5px;flex:1;min-width:150px}
  .ms-flabel{font-size:10.5px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.1em}
  .ms-finput{height:40px;padding:0 13px;border-radius:11px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:500;color:#111;font-family:inherit;transition:border-color .18s;outline:none;width:100%}
  .ms-finput:focus{border-color:var(--color-primary,#4f46e5)}
  .ms-finput-wrap{position:relative}
  .ms-finput-wrap .ms-finput{padding-left:36px}
  .ms-finput-icon{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:#9ca3af;pointer-events:none}
  .ms-chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:14px;padding-top:14px;border-top:1px solid #f3f4f6;align-items:center}
  .ms-chip{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:50px;font-size:11.5px;font-weight:700;background:color-mix(in srgb,var(--color-primary,#4f46e5) 8%,transparent);color:var(--color-primary,#4f46e5);border:1px solid color-mix(in srgb,var(--color-primary,#4f46e5) 18%,transparent)}
  .ms-chip-x{cursor:pointer;background:none;border:none;padding:0;display:flex;align-items:center;color:inherit;opacity:.6}
  .ms-chip-x:hover{opacity:1}
  .ms-clear{font-size:12px;font-weight:700;color:#ef4444;cursor:pointer;background:none;border:none;font-family:inherit}

  /* results bar */
  .ms-resbar{display:flex;align-items:center;justify-content:space-between}
  .ms-rescnt{font-size:14px;font-weight:800;color:#0f0f0f}
  .ms-restot{font-size:12px;color:#9ca3af;font-weight:500}

  /* story grid */
  .ms-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}

  /* story card */
  .ms-card{background:#fff;border-radius:20px;border:1px solid #f0f0f0;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.05);transition:all .25s;display:flex;flex-direction:column}
  .ms-card:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,.1)}
  .ms-card-img{position:relative;height:190px;overflow:hidden;flex-shrink:0}
  .ms-card-img img{width:100%;height:100%;object-fit:cover;transition:transform .6s}
  .ms-card:hover .ms-card-img img{transform:scale(1.05)}
  .ms-card-ph{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,color-mix(in srgb,var(--color-primary,#4f46e5) 8%,#fff),color-mix(in srgb,var(--color-secondary,#7c3aed) 5%,#fff));color:var(--color-primary,#4f46e5)}
  .ms-card-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.45) 0%,transparent 55%)}
  .ms-card-body{padding:18px 20px 20px;display:flex;flex-direction:column;flex:1}

  /* badges */
  .ms-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:50px;font-size:11px;font-weight:700;white-space:nowrap}
  .ms-bg-green {color:#065f46;background:#d1fae5}
  .ms-bg-yellow{color:#92400e;background:#fef3c7}
  .ms-bg-blue  {color:#1e40af;background:#dbeafe}
  .ms-bg-gray  {color:#4b5563;background:#f3f4f6}

  /* card action buttons */
  .ms-card-acts{display:flex;gap:8px;margin-top:auto;padding-top:14px}
  .ms-act-edit{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:9px;border-radius:11px;border:1.5px solid #e5e7eb;background:#fff;font-size:12.5px;font-weight:700;color:#374151;cursor:pointer;font-family:inherit;transition:all .18s}
  .ms-act-edit:hover{background:#f7f7f8;border-color:#d1d5db}
  .ms-act-publish{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:9px;border-radius:11px;border:none;font-size:12.5px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .18s}
  .ms-act-publish.pub{background:#fef3c7;color:#92400e}
  .ms-act-publish.pub:hover{background:#fde68a}
  .ms-act-publish.draft{background:linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));color:#fff;box-shadow:0 3px 10px color-mix(in srgb,var(--color-primary,#4f46e5) 28%,transparent)}
  .ms-act-del{width:38px;height:38px;flex-shrink:0;border-radius:11px;border:1.5px solid #fecaca;background:#fef2f2;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#ef4444;transition:all .18s}
  .ms-act-del:hover{background:#ef4444;color:#fff;border-color:#ef4444}

  /* spinner */
  .ms-spin{width:44px;height:44px;border-radius:50%;border:3px solid #f0f0f0;border-top-color:var(--color-primary,#4f46e5);animation:spin .75s linear infinite}
  .ms-spin-sm{width:16px;height:16px;border-radius:50%;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;animation:spin .75s linear infinite;flex-shrink:0}

  /* empty */
  .ms-empty{text-align:center;padding:64px 24px;background:#fff;border-radius:20px;border:1px solid #f0f0f0;box-shadow:0 1px 4px rgba(0,0,0,.05)}
  .ms-empty-ico{width:60px;height:60px;border-radius:18px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;color:#9ca3af}

  /* error */
  .ms-error{background:#fef2f2;border:1px solid #fecaca;border-radius:18px;padding:32px;text-align:center}

  /* modal backdrop */
  .ms-backdrop{position:fixed;inset:0;z-index:50;background:rgba(15,15,15,.65);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:16px}
  .ms-modal{background:#fff;border-radius:22px;width:100%;max-width:660px;max-height:90vh;overflow-y:auto;box-shadow:0 24px 64px rgba(0,0,0,.18);animation:fadeUp .25s ease both}
  .ms-modal::-webkit-scrollbar{width:4px}
  .ms-modal::-webkit-scrollbar-thumb{background:#e5e7eb;border-radius:99px}
  .ms-modal-head{display:flex;align-items:center;justify-content:space-between;padding:20px 24px 16px;border-bottom:1px solid #f3f4f6;position:sticky;top:0;background:#fff;z-index:2;border-radius:22px 22px 0 0}
  .ms-modal-title{font-size:17px;font-weight:800;color:#0f0f0f;margin:0}
  .ms-modal-sub{font-size:11.5px;color:#9ca3af;font-weight:500;margin-top:2px}
  .ms-modal-x{width:30px;height:30px;border-radius:9px;border:none;background:#f5f5f5;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#6b7280;transition:all .18s}
  .ms-modal-x:hover{background:#e5e7eb;color:#374151}
  .ms-modal-body{padding:20px 24px}
  .ms-modal-foot{padding:16px 24px;border-top:1px solid #f3f4f6;display:flex;gap:10px}

  /* form fields */
  .ms-grid2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  @media(max-width:560px){.ms-grid2{grid-template-columns:1fr}}
  .ms-col2{grid-column:1/-1}
  .ms-field{display:flex;flex-direction:column;gap:5px}
  .ms-label{font-size:11.5px;font-weight:700;color:#374151}
  .ms-req{color:#ef4444}
  .ms-input{height:42px;padding:0 13px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:500;color:#111;font-family:inherit;transition:border-color .18s;outline:none;width:100%}
  .ms-input:focus{border-color:var(--color-primary,#4f46e5)}
  .ms-input.err{border-color:#ef4444}
  .ms-textarea{padding:11px 13px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:500;color:#111;font-family:inherit;transition:border-color .18s;outline:none;width:100%;resize:vertical;line-height:1.65;min-height:90px}
  .ms-textarea:focus{border-color:var(--color-primary,#4f46e5)}
  .ms-textarea.err{border-color:#ef4444}
  .ms-errmsg{font-size:11.5px;color:#ef4444;font-weight:600;margin-top:2px;display:flex;align-items:center;gap:4px}

  /* category tiles */
  .ms-cat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px}
  .ms-cat-opt{display:flex;align-items:center;gap:8px;padding:10px 13px;border-radius:11px;border:1.5px solid #e5e7eb;background:#fff;cursor:pointer;transition:all .18s;font-size:12.5px;font-weight:700;color:#374151}
  .ms-cat-opt.on{background:color-mix(in srgb,var(--color-primary,#4f46e5) 7%,transparent);border-color:color-mix(in srgb,var(--color-primary,#4f46e5) 22%,transparent);color:var(--color-primary,#4f46e5)}

  /* image upload */
  .ms-upload{border:2px dashed #e5e7eb;border-radius:13px;padding:22px 16px;text-align:center;cursor:pointer;transition:border-color .18s;position:relative;display:block}
  .ms-upload:hover{border-color:var(--color-primary,#4f46e5)}
  .ms-upload input{position:absolute;inset:0;opacity:0;cursor:pointer}
  .ms-upload-ico{width:44px;height:44px;border-radius:13px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;color:#9ca3af}
  .ms-preview{width:100%;height:140px;object-fit:cover;border-radius:12px;margin-bottom:12px;display:block}

  /* publish toggle */
  .ms-pub-wrap{display:flex;align-items:center;gap:12px;padding:14px 16px;background:#fafafa;border-radius:13px;border:1px solid #f0f0f0;cursor:pointer}
  .ms-pub-track{width:38px;height:22px;border-radius:50px;background:#e5e7eb;position:relative;transition:background .18s;flex-shrink:0}
  .ms-pub-track.on{background:var(--color-primary,#4f46e5)}
  .ms-pub-thumb{width:16px;height:16px;border-radius:50%;background:#fff;position:absolute;top:3px;left:3px;transition:left .18s;box-shadow:0 1px 4px rgba(0,0,0,.2)}
  .ms-pub-thumb.on{left:19px}

  /* section label */
  .ms-sec{font-size:9.5px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#c4c4c4;margin:18px 0 8px}

  /* modal buttons */
  .ms-btn-outline{flex:1;padding:11px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:700;color:#374151;cursor:pointer;font-family:inherit;transition:all .18s}
  .ms-btn-outline:hover{background:#f7f7f8}
  .ms-btn-outline:disabled{opacity:.5;cursor:not-allowed}
  .ms-btn-primary{flex:1;padding:11px;border-radius:12px;border:none;background:linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));font-size:13px;font-weight:700;color:#fff;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:7px;box-shadow:0 4px 14px color-mix(in srgb,var(--color-primary,#4f46e5) 28%,transparent);transition:opacity .18s}
  .ms-btn-primary:hover{opacity:.9}
  .ms-btn-primary:disabled{opacity:.6;cursor:not-allowed}
  .ms-btn-danger{flex:1;padding:11px;border-radius:12px;border:none;background:#ef4444;font-size:13px;font-weight:700;color:#fff;cursor:pointer;font-family:inherit;transition:opacity .18s}
  .ms-btn-danger:hover{opacity:.88}

  /* delete modal */
  .ms-del-modal{background:#fff;border-radius:22px;width:100%;max-width:400px;padding:32px;box-shadow:0 24px 64px rgba(0,0,0,.18);text-align:center;animation:fadeUp .25s ease both}
  .ms-del-icon{width:56px;height:56px;border-radius:18px;background:#fef2f2;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;color:#ef4444}
`;

/* ─── helpers ─────────────────────────────────────────── */
const fmtDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const getCatMeta = (v) => CATEGORIES.find(c => c.value === v) || CATEGORIES[0];

/* ─── Field wrapper ───────────────────────────────────── */
const Field = ({ label, required, error, children }) => (
  <div className="ms-field">
    <label className="ms-label">{label}{required && <span className="ms-req"> *</span>}</label>
    {children}
    {error && <p className="ms-errmsg"><AlertCircle size={11} /> {error}</p>}
  </div>
);

/* ═══════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════ */
const ManageStory = () => {
  const { userProfile, loading: authLoading } = useAuth();
  const [stories, setStories]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState("All");
  const [catFilter, setCatFilter]         = useState("All");

  const [showForm, setShowForm]           = useState(false);
  const [editingStory, setEditingStory]   = useState(null);
  const [formData, setFormData]           = useState(INIT_FORM);
  const [previewUrl, setPreviewUrl]       = useState("");
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [formErrors, setFormErrors]       = useState({});

  const [deleteTarget, setDeleteTarget]   = useState(null);

  /* ── fetch ── */
  const fetchStories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ApiStory.getStories({
        schoolId:   userProfile?.schoolId || undefined,
        searchTerm: search || undefined,
        isPublished: statusFilter === "All" ? undefined : (statusFilter === "Published"),
      });
      setStories(res.data || []);
      setError(null);
    } catch {
      setError("Failed to load stories. Please try again.");
      toast.error("Could not load your stories.");
    } finally { setLoading(false); }
  }, [userProfile, search, statusFilter]);

  useEffect(() => {
    if (authLoading) return;
    if (userProfile) fetchStories();
    else setLoading(false);
  }, [authLoading, userProfile, fetchStories]);

  /* ── filtered ── */
  const filtered = useMemo(() => stories.filter(s => {
    const matchCat = catFilter === "All" || s.category === catFilter;
    return matchCat;
  }), [stories, catFilter]);

  const hasFilters = search || statusFilter !== "All" || catFilter !== "All";
  const clearFilters = () => { setSearch(""); setStatusFilter("All"); setCatFilter("All"); };

  /* ── form helpers ── */
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "imageFile") {
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
    if (!formData.title.trim())   e.title   = "Title is required";
    if (!formData.content.trim()) e.content = "Content is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userProfile?.schoolId) { toast.error("Your account is not linked to a school."); return; }
    const errs = validate();
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    try {
      const base = {
        title:       formData.title,
        description: formData.description || formData.content.substring(0, 150) + "…",
        content:     formData.content,
        category:    formData.category,
        tags:        formData.tags ? formData.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
        isFeatured:  editingStory?.isFeatured || false,
        isPublished: formData.isPublished,
      };
      let saved;
      if (editingStory) {
        const res = await ApiStory.updateStory(editingStory.id, { ...base, image: editingStory.image || "", gallery: editingStory.gallery || [] });
        saved = res.data;
        toast.success("Story updated successfully!");
      } else {
        const res = await ApiStory.createStory({ ...base, image: "", gallery: [], schoolId: userProfile.schoolId });
        saved = res.data;
        toast.success("Story created successfully!");
      }
      if (formData.imageFile) {
        toast.loading("Uploading image…", { id: "img" });
        await ApiStory.uploadImage(saved.id, formData.imageFile);
        toast.success("Image uploaded!", { id: "img" });
      }
      closeForm();
      fetchStories();
    } catch (err) {
      const msg = err.response?.data?.errors
        ? Object.values(err.response.data.errors).flat().join(" ")
        : err.response?.data?.title || "Failed to save story.";
      toast.error(msg);
    } finally { setIsSubmitting(false); }
  };

  const closeForm = () => {
    setShowForm(false); setEditingStory(null);
    setFormData(INIT_FORM); setPreviewUrl(""); setFormErrors({});
  };

  const openEdit = (s) => {
    setEditingStory(s);
    setFormData({
      title: s.title, description: s.description, content: s.content,
      category: s.category || "News", imageFile: null,
      isPublished: s.isPublished,
      tags: s.tags ? s.tags.join(", ") : "",
    });
    setPreviewUrl(s.image || "");
    setShowForm(true);
  };

  const handleTogglePublish = async (s) => {
    try {
      await ApiStory.updateStory(s.id, {
        title: s.title, description: s.description, content: s.content,
        category: s.category, image: s.image || "", gallery: s.gallery || [],
        tags: s.tags || [], isFeatured: s.isFeatured || false,
        isPublished: !s.isPublished,
      });
      toast.success(!s.isPublished ? "Story published!" : "Story moved to drafts.");
      fetchStories();
    } catch { toast.error("Failed to update status."); }
  };

  const handleDeleteConfirm = async () => {
    try {
      await ApiStory.deleteStory(deleteTarget.id);
      toast.success("Story deleted.");
      setDeleteTarget(null);
      fetchStories();
    } catch { toast.error("Failed to delete story."); }
  };

  /* ── loading / error ── */
  if (authLoading || (loading && stories.length === 0)) {
    return (
      <div className="ms">
        <style>{styles}</style>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 320, gap: 14 }}>
          <div className="ms-spin" />
          <p style={{ fontSize: 13, color: "#9ca3af", fontWeight: 600 }}>Loading your stories…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ms">
        <style>{styles}</style>
        <div className="ms-error">
          <p style={{ color: "#dc2626", fontWeight: 600, margin: "0 0 14px" }}>{error}</p>
          <button onClick={fetchStories} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 20px", borderRadius: 50, border: "none", background: "#dc2626", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
            <RefreshCw size={13} strokeWidth={2.5} /> Retry
          </button>
        </div>
      </div>
    );
  }

  const publishedCnt = stories.filter(s => s.isPublished).length;
  const draftCnt     = stories.filter(s => !s.isPublished).length;

  return (
    <div className="ms">
      <style>{styles}</style>

      {/* ═══ HEAD ═══ */}
      <div className="ms-head">
        <div>
          <h1 className="ms-title">Manage Stories</h1>
          <p className="ms-sub">Share your school's achievements and updates with the community.</p>
        </div>
        <button className="ms-new-btn" onClick={() => { closeForm(); setShowForm(true); }}>
          <PlusCircle size={15} strokeWidth={2.5} /> New Story
        </button>
      </div>

      {/* ═══ STATS ═══ */}
      <div className="ms-stats">
        {[
          { label: "Total Stories",   value: stories.length, icon: BookOpen,  bg: "#eff6ff", color: "#2563eb" },
          { label: "Published",       value: publishedCnt,   icon: CheckCircle,bg: "#ecfdf5", color: "#059669" },
          { label: "Drafts",          value: draftCnt,       icon: Clock,      bg: "#fffbeb", color: "#d97706" },
          { label: "Total Views",     value: stories.reduce((s, x) => s + (x.views || 0), 0).toLocaleString(), icon: Eye, bg: "#f5f3ff", color: "#7c3aed" },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="ms-stat">
            <div className="ms-stat-icon" style={{ background: bg, color }}><Icon size={20} strokeWidth={2} /></div>
            <div>
              <p className="ms-stat-label">{label}</p>
              <p className="ms-stat-value">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ FILTERS ═══ */}
      <div className="ms-fp">
        <div className="ms-fp-row">
          <div className="ms-fg" style={{ flex: 2, minWidth: 200 }}>
            <span className="ms-flabel">Search</span>
            <div className="ms-finput-wrap">
              <Search size={14} className="ms-finput-icon" />
              <input className="ms-finput" placeholder="Search by title…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="ms-fg">
            <span className="ms-flabel">Status</span>
            <select className="ms-finput" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Drafts</option>
            </select>
          </div>
          <div className="ms-fg">
            <span className="ms-flabel">Category</span>
            <select className="ms-finput" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.value}</option>)}
            </select>
          </div>
          {hasFilters && (
            <button style={{ height: 40, padding: "0 14px", borderRadius: 11, border: "1.5px solid #fecaca", background: "#fef2f2", color: "#dc2626", fontWeight: 700, fontSize: 12.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "inherit", alignSelf: "flex-end" }} onClick={clearFilters}>
              <X size={13} strokeWidth={2.5} /> Clear
            </button>
          )}
        </div>
        {hasFilters && (
          <div className="ms-chips">
            <span style={{ fontSize: 11.5, fontWeight: 700, color: "#9ca3af" }}>Active:</span>
            {search && <span className="ms-chip">Search: {search}<button className="ms-chip-x" onClick={() => setSearch("")}><X size={11} /></button></span>}
            {statusFilter !== "All" && <span className="ms-chip">Status: {statusFilter}<button className="ms-chip-x" onClick={() => setStatusFilter("All")}><X size={11} /></button></span>}
            {catFilter !== "All" && <span className="ms-chip">Category: {catFilter}<button className="ms-chip-x" onClick={() => setCatFilter("All")}><X size={11} /></button></span>}
            <button className="ms-clear" onClick={clearFilters}>Clear all</button>
          </div>
        )}
      </div>

      {/* ═══ RESULTS BAR ═══ */}
      <div className="ms-resbar">
        <span className="ms-rescnt">{filtered.length} {filtered.length === 1 ? "Story" : "Stories"} Found</span>
        <span className="ms-restot">Showing {filtered.length} of {stories.length}</span>
      </div>

      {/* ═══ STORY GRID ═══ */}
      {filtered.length > 0 ? (
        <div className="ms-grid">
          {filtered.map(s => {
            const cat = getCatMeta(s.category);
            const CatIcon = cat.icon;
            return (
              <div key={s.id} className="ms-card">
                {/* Image */}
                <div className="ms-card-img">
                  {s.image
                    ? <img src={s.image} alt={s.title} />
                    : <div className="ms-card-ph"><BookOpen size={40} strokeWidth={1.5} /></div>
                  }
                  <div className="ms-card-overlay" />
                  {/* Badges */}
                  <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 7 }}>
                    <span className="ms-badge" style={{ color: cat.color, background: cat.bg }}>
                      <CatIcon size={11} strokeWidth={2.5} />{s.category}
                    </span>
                  </div>
                  <span className={`ms-badge ${s.isPublished ? "ms-bg-green" : "ms-bg-yellow"}`} style={{ position: "absolute", top: 14, right: 14 }}>
                    {s.isPublished ? <><CheckCircle size={11} strokeWidth={2.5} />Published</> : <><Clock size={11} strokeWidth={2.5} />Draft</>}
                  </span>
                </div>

                {/* Body */}
                <div className="ms-card-body">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: "#9ca3af" }}>{fmtDate(s.createdAt)}</span>
                    {s.isFeatured && (
                      <span className="ms-badge ms-bg-yellow"><Star size={10} strokeWidth={2.5} />Featured</span>
                    )}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f0f0f", lineHeight: 1.4, margin: "0 0 8px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.65, margin: "0 0 14px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {s.description}
                  </p>

                  {/* Engagement stats */}
                  <div style={{ display: "flex", gap: 14, marginBottom: 14, paddingBottom: 14, borderBottom: "1px solid #f3f4f6" }}>
                    {[
                      { Icon: Eye,           val: s.views   || 0 },
                      { Icon: Heart,         val: s.likes   || 0 },
                      { Icon: MessageCircle, val: s.commentCount || 0 },
                    ].map(({ Icon, val }, i) => (
                      <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>
                        <Icon size={12} strokeWidth={2} />{val.toLocaleString()}
                      </span>
                    ))}
                    {s.tags?.length > 0 && (
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#9ca3af", fontWeight: 600, marginLeft: "auto" }}>
                        <Tag size={11} strokeWidth={2} />{s.tags.slice(0, 2).join(", ")}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="ms-card-acts">
                    <button className="ms-act-edit" onClick={() => openEdit(s)}>
                      <Pencil size={13} strokeWidth={2.2} /> Edit
                    </button>
                    <button
                      className={`ms-act-publish ${s.isPublished ? "pub" : "draft"}`}
                      onClick={() => handleTogglePublish(s)}
                    >
                      {s.isPublished
                        ? <><RotateCcw size={13} strokeWidth={2.2} />Move to Draft</>
                        : <><Send size={13} strokeWidth={2.2} />Publish</>
                      }
                    </button>
                    <button className="ms-act-del" onClick={() => setDeleteTarget(s)}>
                      <Trash2 size={14} strokeWidth={2.2} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="ms-empty">
          <div className="ms-empty-ico"><BookOpen size={26} strokeWidth={1.8} /></div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f0f0f", margin: "0 0 8px" }}>
            {hasFilters ? "No stories found" : "No stories yet"}
          </h3>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 20px", maxWidth: 340, marginLeft: "auto", marginRight: "auto" }}>
            {hasFilters
              ? "Try adjusting your search or filter criteria."
              : "Start sharing your school's journey. Your stories inspire students and the community."}
          </p>
          {hasFilters
            ? <button style={{ padding: "10px 22px", borderRadius: 50, border: "none", background: "linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed))", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }} onClick={clearFilters}>Clear filters</button>
            : <button className="ms-new-btn" onClick={() => setShowForm(true)}>
                <PlusCircle size={14} strokeWidth={2.5} /> Create Your First Story
              </button>
          }
        </div>
      )}

      {/* ════ CREATE / EDIT MODAL ════ */}
      {showForm && (
        <div className="ms-backdrop" onClick={closeForm}>
          <div className="ms-modal" onClick={e => e.stopPropagation()}>

            <div className="ms-modal-head">
              <div>
                <p className="ms-modal-title">{editingStory ? "Edit Story" : "Create New Story"}</p>
                <p className="ms-modal-sub">{editingStory ? "Changes are saved immediately." : "Fill in the details below to publish a new story."}</p>
              </div>
              <button className="ms-modal-x" onClick={closeForm}><X size={15} strokeWidth={2.2} /></button>
            </div>

            <div className="ms-modal-body">
              <form onSubmit={handleSubmit}>

                {/* Title */}
                <div className="ms-field" style={{ marginBottom: 14 }}>
                  <Field label="Story Title" required error={formErrors.title}>
                    <input className={`ms-input ${formErrors.title ? "err" : ""}`} name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Annual Prize Giving Ceremony 2026" />
                  </Field>
                </div>

                {/* Category */}
                <p className="ms-sec">Category</p>
                <div className="ms-cat-grid" style={{ marginBottom: 14 }}>
                  {CATEGORIES.map(({ value, icon: Icon, color, bg }) => (
                    <label key={value} className={`ms-cat-opt ${formData.category === value ? "on" : ""}`}>
                      <input type="radio" style={{ display: "none" }} checked={formData.category === value} onChange={() => setFormData(p => ({ ...p, category: value }))} />
                      <div style={{ width: 26, height: 26, borderRadius: 7, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon size={13} color={color} strokeWidth={2} />
                      </div>
                      {value}
                    </label>
                  ))}
                </div>

                {/* Tags */}
                <div className="ms-field" style={{ marginBottom: 14 }}>
                  <label className="ms-label"><Hash size={11} strokeWidth={2.5} style={{ display: "inline", marginRight: 4 }} />Tags <span style={{ color: "#9ca3af", fontWeight: 500 }}>(comma separated)</span></label>
                  <input className="ms-input" name="tags" value={formData.tags} onChange={handleChange} placeholder="sports, award, 2026" />
                </div>

                {/* Content */}
                <p className="ms-sec">Story Content</p>
                <div className="ms-field" style={{ marginBottom: 14 }}>
                  <Field label="Full Story" required error={formErrors.content}>
                    <textarea className={`ms-textarea ${formErrors.content ? "err" : ""}`} name="content" value={formData.content} onChange={handleChange} rows={7} placeholder="Tell your story here — achievements, highlights, what made this moment special…" />
                  </Field>
                </div>

                {/* Image */}
                <p className="ms-sec">Featured Image</p>
                {previewUrl && <img src={previewUrl} alt="preview" className="ms-preview" />}
                <label className="ms-upload" style={{ marginBottom: 16 }}>
                  <input type="file" name="imageFile" accept="image/*" onChange={handleChange} />
                  <div className="ms-upload-ico"><ImagePlus size={20} strokeWidth={1.8} /></div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", margin: "0 0 3px" }}>
                    {previewUrl ? "Change image" : "Upload featured image"}
                  </p>
                  <p style={{ fontSize: 11.5, color: "#9ca3af", margin: 0 }}>PNG, JPG, WEBP — up to 5 MB</p>
                  {formData.imageFile && <p style={{ fontSize: 12, color: "#059669", fontWeight: 700, margin: "6px 0 0" }}>✓ {formData.imageFile.name}</p>}
                </label>

                {/* Publish toggle */}
                <label className="ms-pub-wrap">
                  <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleChange} style={{ display: "none" }} />
                  <div className={`ms-pub-track ${formData.isPublished ? "on" : ""}`}>
                    <div className={`ms-pub-thumb ${formData.isPublished ? "on" : ""}`} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13.5, fontWeight: 700, color: formData.isPublished ? "var(--color-primary,#4f46e5)" : "#374151", margin: 0 }}>
                      {formData.isPublished ? "Publish immediately" : "Save as draft"}
                    </p>
                    <p style={{ fontSize: 11.5, color: "#9ca3af", margin: "2px 0 0", fontWeight: 500 }}>
                      {formData.isPublished ? "Visible to all users right away" : "Only you can see this until published"}
                    </p>
                  </div>
                </label>

              </form>
            </div>

            <div className="ms-modal-foot">
              <button className="ms-btn-outline" onClick={closeForm} disabled={isSubmitting}>Cancel</button>
              <button className="ms-btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting
                  ? <><div className="ms-spin-sm" />{editingStory ? "Saving…" : "Creating…"}</>
                  : editingStory
                    ? <><Save size={14} strokeWidth={2.5} />Update Story</>
                    : <><Send size={14} strokeWidth={2.5} />Save Story</>
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════ DELETE MODAL ════ */}
      {deleteTarget && (
        <div className="ms-backdrop">
          <div className="ms-del-modal">
            <div className="ms-del-icon"><Trash2 size={24} strokeWidth={2} /></div>
            <p style={{ fontSize: 17, fontWeight: 800, color: "#0f0f0f", margin: "0 0 10px" }}>Delete Story?</p>
            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.65, margin: "0 0 24px" }}>
              Are you sure you want to delete <strong>"{deleteTarget.title}"</strong>? This will permanently remove the story and all associated comments.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="ms-btn-outline" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="ms-btn-danger" onClick={handleDeleteConfirm}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStory;