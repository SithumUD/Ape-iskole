import React, { useState, useEffect } from "react";
import ApiPromotion from "../../services/ApiPromotion";
import { toast } from "react-hot-toast";
import {
  Plus, Pencil, Trash2, Tag, Star, CheckCircle, X,
  RefreshCw, AlertCircle, Search, Zap, Eye, EyeOff,
  Upload, Calendar, Link2, Hash, DollarSign, Layers,
  ShieldCheck, Loader2, Package, ToggleLeft, ToggleRight,
  Image as ImageIcon, FileText, Infinity
} from "lucide-react";

/* ─── static data ─────────────────────────────────────── */
const CATEGORIES = ["Education", "Supplies", "Sports", "Technology", "Apparel", "Other"];

/* ─── styles ──────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

  .pm*{box-sizing:border-box}
  .pm{font-family:'Plus Jakarta Sans',sans-serif;display:flex;flex-direction:column;gap:24px;animation:fadeUp .45s ease both}

  /* head */
  .pm-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap}
  .pm-title{font-size:22px;font-weight:900;color:#0f0f0f;letter-spacing:-.4px;margin:0 0 4px}
  .pm-sub{font-size:13px;color:#9ca3af;font-weight:500;margin:0}
  .pm-head-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}

  .pm-btn-refresh{display:flex;align-items:center;gap:7px;padding:10px 18px;border-radius:50px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:700;color:#374151;cursor:pointer;font-family:inherit;transition:all .18s;white-space:nowrap}
  .pm-btn-refresh:hover{background:#f7f7f8;border-color:#d1d5db}
  .pm-btn-primary{display:flex;align-items:center;gap:7px;padding:10px 20px;border-radius:50px;border:none;background:linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;box-shadow:0 4px 14px color-mix(in srgb,var(--color-primary,#4f46e5) 28%,transparent);transition:all .2s;white-space:nowrap}
  .pm-btn-primary:hover{opacity:.9;transform:translateY(-1px)}

  /* search */
  .pm-search-wrap{position:relative}
  .pm-search-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#9ca3af;pointer-events:none}
  .pm-search{width:100%;height:44px;padding:0 14px 0 42px;border-radius:14px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:500;color:#111;font-family:inherit;transition:border-color .18s;outline:none}
  .pm-search:focus{border-color:var(--color-primary,#4f46e5)}

  /* stats row */
  .pm-stats{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px}
  .pm-stat{background:#fff;border-radius:18px;border:1px solid #f0f0f0;padding:18px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .pm-stat-icon{width:44px;height:44px;border-radius:13px;flex-shrink:0;display:flex;align-items:center;justify-content:center}
  .pm-stat-label{font-size:11px;font-weight:600;color:#9ca3af;margin:0 0 3px}
  .pm-stat-value{font-size:22px;font-weight:900;letter-spacing:-.5px;margin:0;color:#0f0f0f}

  /* table card */
  .pm-card{background:#fff;border-radius:20px;border:1px solid #f0f0f0;box-shadow:0 1px 4px rgba(0,0,0,.04);overflow:hidden}
  .pm-table{width:100%;border-collapse:collapse}
  .pm-table thead{background:#fafafa}
  .pm-table th{padding:12px 16px;text-align:left;font-size:10.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:#9ca3af;border-bottom:1px solid #f0f0f0}
  .pm-table td{padding:14px 16px;font-size:13px;color:#374151;border-bottom:1px solid #f7f7f8;vertical-align:middle}
  .pm-table tbody tr{transition:background .15s}
  .pm-table tbody tr:hover{background:#fafafa}
  .pm-table tbody tr:last-child td{border-bottom:none}
  .pm-table-name{font-size:13.5px;font-weight:800;color:#0f0f0f;margin:0 0 2px}
  .pm-table-sub{font-size:11.5px;color:#9ca3af;margin:0}

  /* badges */
  .pm-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:50px;font-size:11px;font-weight:700;white-space:nowrap}
  .pm-bg-green {color:#065f46;background:#d1fae5}
  .pm-bg-gray  {color:#4b5563;background:#f3f4f6}
  .pm-bg-yellow{color:#92400e;background:#fef3c7}
  .pm-bg-blue  {color:#1e40af;background:#dbeafe}
  .pm-bg-red   {color:#ef4444;background:#fef2f2}
  .pm-bg-purple{color:#5b21b6;background:#ede9fe}

  /* action buttons */
  .pm-action-btn{display:inline-flex;align-items:center;gap:5px;padding:7px 12px;border-radius:9px;border:1.5px solid transparent;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;transition:all .18s}
  .pm-action-edit{border-color:#dbeafe;background:#eff6ff;color:#2563eb}
  .pm-action-edit:hover{background:#dbeafe}
  .pm-action-del{border-color:#fecaca;background:#fef2f2;color:#dc2626}
  .pm-action-del:hover{background:#fee2e2}

  /* empty */
  .pm-empty{text-align:center;padding:64px 24px}
  .pm-empty-ico{width:60px;height:60px;border-radius:16px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;margin:0 auto 16px}

  /* spinner */
  .pm-spin{width:44px;height:44px;border-radius:50%;border:3px solid #f0f0f0;border-top-color:var(--color-primary,#4f46e5);animation:spin .75s linear infinite}
  .pm-spin-sm{width:15px;height:15px;border-radius:50%;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;animation:spin .75s linear infinite;flex-shrink:0}

  /* ── MODAL ── */
  .pm-backdrop{position:fixed;inset:0;z-index:50;background:rgba(15,15,15,.65);backdrop-filter:blur(5px);display:flex;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto}
  .pm-modal{background:#fff;border-radius:22px;width:100%;max-width:820px;margin:auto;box-shadow:0 24px 64px rgba(0,0,0,.2);display:flex;flex-direction:column}
  .pm-modal::-webkit-scrollbar{width:4px}
  .pm-modal-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:22px 28px 18px;border-bottom:1px solid #f3f4f6;border-radius:22px 22px 0 0;background:#fafafa}
  .pm-modal-title{font-size:18px;font-weight:900;color:#0f0f0f;letter-spacing:-.3px;margin:0 0 2px}
  .pm-modal-sub{font-size:12px;color:#9ca3af;margin:0;font-weight:500}
  .pm-modal-x{width:32px;height:32px;border-radius:10px;border:none;background:#f0f0f0;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#6b7280;transition:all .18s;flex-shrink:0}
  .pm-modal-x:hover{background:#e5e7eb;color:#374151}
  .pm-modal-body{padding:24px 28px;display:flex;flex-direction:column;gap:20px}
  .pm-modal-foot{padding:18px 28px;border-top:1px solid #f3f4f6;display:flex;justify-content:flex-end;gap:10px;border-radius:0 0 22px 22px;background:#fafafa}

  /* form */
  .pm-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
  .pm-form-col{display:flex;flex-direction:column;gap:14px}
  .pm-field{display:flex;flex-direction:column;gap:5px}
  .pm-field-label{font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:.1em;display:flex;align-items:center;gap:5px}
  .pm-field-input{height:42px;padding:0 13px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:500;color:#111;font-family:inherit;transition:border-color .18s;outline:none;width:100%}
  .pm-field-input:focus{border-color:var(--color-primary,#4f46e5)}
  .pm-field-textarea{padding:10px 13px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:500;color:#111;font-family:inherit;transition:border-color .18s;outline:none;width:100%;resize:vertical;line-height:1.6}
  .pm-field-textarea:focus{border-color:var(--color-primary,#4f46e5)}
  .pm-field-select{height:42px;padding:0 13px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:600;color:#111;font-family:inherit;transition:border-color .18s;outline:none;width:100%;appearance:none;cursor:pointer}
  .pm-field-select:focus{border-color:var(--color-primary,#4f46e5)}

  .pm-section-divider{font-size:9.5px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#c4c4c4;padding:0;margin:4px 0 0}

  .pm-toggle-row{display:flex;align-items:center;gap:16px;padding:14px 16px;background:#fafafa;border-radius:13px;border:1px solid #f0f0f0}
  .pm-toggle-item{display:flex;align-items:center;gap:8px;cursor:pointer;padding:6px 14px;border-radius:10px;border:1.5px solid #e5e7eb;background:#fff;transition:all .18s;font-size:13px;font-weight:700;color:#374151}
  .pm-toggle-item.on{background:color-mix(in srgb,var(--color-primary,#4f46e5) 7%,transparent);border-color:color-mix(in srgb,var(--color-primary,#4f46e5) 25%,transparent);color:var(--color-primary,#4f46e5)}

  .pm-image-upload{border:2px dashed #e5e7eb;border-radius:14px;padding:20px;display:flex;align-items:center;gap:14px;cursor:pointer;transition:all .18s;background:#fafafa}
  .pm-image-upload:hover{border-color:var(--color-primary,#4f46e5);background:color-mix(in srgb,var(--color-primary,#4f46e5) 4%,transparent)}
  .pm-image-preview{width:64px;height:64px;border-radius:12px;object-fit:cover;border:1.5px solid #f0f0f0;flex-shrink:0}

  .pm-modal-cancel{padding:11px 22px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:700;color:#374151;cursor:pointer;font-family:inherit;transition:all .18s}
  .pm-modal-cancel:hover{background:#f7f7f8}
  .pm-modal-submit{padding:11px 26px;border-radius:12px;border:none;background:linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:7px;box-shadow:0 4px 14px color-mix(in srgb,var(--color-primary,#4f46e5) 28%,transparent);transition:all .2s}
  .pm-modal-submit:hover{opacity:.9}
  .pm-modal-submit:disabled{opacity:.6;cursor:not-allowed}
`;

/* ─── helpers ─────────────────────────────────────────── */
const formatLKR = (n) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(n || 0);

const formatDate = (d) => {
  if (!d) return "No expiry";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const CATEGORY_COLORS = {
  Education:  { color: "#2563eb", bg: "#eff6ff" },
  Supplies:   { color: "#7c3aed", bg: "#f5f3ff" },
  Sports:     { color: "#059669", bg: "#ecfdf5" },
  Technology: { color: "#0891b2", bg: "#ecfeff" },
  Apparel:    { color: "#db2777", bg: "#fdf2f8" },
  Other:      { color: "#6b7280", bg: "#f9fafb" },
};
const getCatStyle = (c) => CATEGORY_COLORS[c] || CATEGORY_COLORS.Other;

/* ─── initial form ─────────────────────────────────────── */
const INIT_FORM = {
  title: "", brand: "", category: "Education", discount: "",
  originalPrice: 0, discountedPrice: 0,
  description: "", longDescription: "",
  image: "", imageFile: null,
  validUntil: "", terms: "", code: "", url: "",
  featured: false, limit: null, isActive: true,
};

/* ═══════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════ */
const PromotionManage = () => {
  const [promotions,   setPromotions]   = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [search,       setSearch]       = useState("");
  const [isModalOpen,  setIsModalOpen]  = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [formData,     setFormData]     = useState(INIT_FORM);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting,   setSubmitting]   = useState(false);

  useEffect(() => { fetchPromotions(); }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ApiPromotion.getAllAdmin();
      setPromotions(res.data);
    } catch {
      setError("Failed to load promotions. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (promo = null) => {
    if (promo) {
      setEditingPromo(promo);
      const formattedDate = promo.validUntil ? new Date(promo.validUntil).toISOString().split("T")[0] : "";
      setFormData({ ...promo, validUntil: formattedDate, imageFile: null });
      setImagePreview(promo.image);
    } else {
      setEditingPromo(null);
      setFormData(INIT_FORM);
      setImagePreview(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPromo(null);
    setFormData(INIT_FORM);
    setImagePreview(null);
  };

  const handleInput = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : type === "number" ? parseFloat(value) : value,
      }));
    }
  };

  const handleToggle = (field) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === "imageFile" && formData[key]) { data.append(key, formData[key]); return; }
      if (key === "imageFile") return;
      const value = formData[key];
      if (value === null || value === undefined) {
        if (["longDescription", "terms", "image"].includes(key)) data.append(key, "");
        return;
      }
      if (["limit", "originalPrice", "discountedPrice"].includes(key) && value === "") return;
      data.append(key, value);
    });

    try {
      if (editingPromo) {
        await ApiPromotion.update(editingPromo.id, data);
        toast.success("Promotion updated successfully");
      } else {
        await ApiPromotion.create(data);
        toast.success("Promotion created successfully");
      }
      fetchPromotions();
      closeModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save promotion");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this promotion?")) return;
    try {
      await ApiPromotion.delete(id);
      toast.success("Promotion deleted");
      fetchPromotions();
    } catch {
      toast.error("Failed to delete promotion");
    }
  };

  const filtered = promotions.filter(p =>
    (p.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.brand || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.category || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalActive   = promotions.filter(p => p.isActive).length;
  const totalFeatured = promotions.filter(p => p.featured).length;
  const totalUses     = promotions.reduce((s, p) => s + (p.uses || 0), 0);

  return (
    <div className="pm">
      <style>{styles}</style>

      {/* ═══ HEAD ═══ */}
      <div className="pm-head">
        <div>
          <h1 className="pm-title">Manage Promotions</h1>
          <p className="pm-sub">Create and manage exclusive offers for students and schools.</p>
        </div>
        <div className="pm-head-actions">
          <button className="pm-btn-refresh" onClick={fetchPromotions}>
            <RefreshCw size={13} strokeWidth={2.5} /> Refresh
          </button>
          <button className="pm-btn-primary" onClick={() => openModal()}>
            <Plus size={14} strokeWidth={2.5} /> Add Promotion
          </button>
        </div>
      </div>

      {/* ═══ STATS ═══ */}
      <div className="pm-stats">
        {[
          { label: "Total Promotions", value: promotions.length, icon: Package,    bg: "#eff6ff",  color: "#2563eb" },
          { label: "Active",           value: totalActive,       icon: CheckCircle, bg: "#ecfdf5",  color: "#059669" },
          { label: "Featured",         value: totalFeatured,     icon: Star,        bg: "#fffbeb",  color: "#d97706" },
          { label: "Total Claims",     value: totalUses,         icon: Tag,         bg: "#f5f3ff",  color: "#7c3aed" },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="pm-stat">
            <div className="pm-stat-icon" style={{ background: bg, color }}>
              <Icon size={20} strokeWidth={2} />
            </div>
            <div>
              <p className="pm-stat-label">{label}</p>
              <p className="pm-stat-value">{value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ SEARCH ═══ */}
      <div className="pm-search-wrap">
        <Search size={15} strokeWidth={2.2} className="pm-search-icon" />
        <input
          className="pm-search"
          placeholder="Search by title, brand or category…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ═══ ERROR ═══ */}
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 16, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <AlertCircle size={18} color="#dc2626" strokeWidth={2} />
          <p style={{ fontSize: 13.5, color: "#dc2626", fontWeight: 600, margin: 0 }}>{error}</p>
        </div>
      )}

      {/* ═══ TABLE ═══ */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "64px 24px", gap: 14 }}>
          <div className="pm-spin" />
          <p style={{ fontSize: 13, color: "#9ca3af", fontWeight: 600 }}>Loading promotions…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="pm-card">
          <div className="pm-empty">
            <div className="pm-empty-ico">
              <Tag size={26} color="#9ca3af" strokeWidth={1.8} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 800, color: "#0f0f0f", margin: "0 0 6px" }}>No promotions found</p>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 20px" }}>
              {search ? "Try a different search term." : `Click "Add Promotion" to get started.`}
            </p>
            {!search && (
              <button className="pm-btn-primary" style={{ margin: "0 auto" }} onClick={() => openModal()}>
                <Plus size={14} strokeWidth={2.5} /> Add First Promotion
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="pm-card">
          <div style={{ overflowX: "auto" }}>
            <table className="pm-table">
              <thead>
                <tr>
                  <th>Offer</th>
                  <th>Discount</th>
                  <th>Pricing</th>
                  <th>Validity</th>
                  <th>Usage</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(promo => {
                  const catStyle = getCatStyle(promo.category);
                  return (
                    <tr key={promo.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          {promo.image ? (
                            <img src={promo.image} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", border: "1.5px solid #f0f0f0", flexShrink: 0 }} />
                          ) : (
                            <div style={{ width: 44, height: 44, borderRadius: 10, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <ImageIcon size={18} color="#9ca3af" strokeWidth={1.8} />
                            </div>
                          )}
                          <div>
                            <p className="pm-table-name">{promo.title}</p>
                            <p className="pm-table-sub">{promo.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                          <span style={{
                            display: "inline-flex", alignItems: "center", gap: 4,
                            fontSize: 13, fontWeight: 900, color: "#ef4444",
                          }}>
                            {promo.discount}
                          </span>
                          <span className="pm-badge" style={{ color: catStyle.color, background: catStyle.bg, display: "inline-flex" }}>
                            {promo.category}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <span style={{ fontSize: 13.5, fontWeight: 800, color: "var(--color-primary,#4f46e5)" }}>{formatLKR(promo.discountedPrice)}</span>
                          <span style={{ fontSize: 11.5, color: "#c4c4c4", fontWeight: 500, textDecoration: "line-through" }}>{formatLKR(promo.originalPrice)}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", fontFamily: "monospace", letterSpacing: "0.05em" }}>{promo.code}</span>
                          <span style={{ fontSize: 11.5, color: "#9ca3af", fontWeight: 500 }}>{formatDate(promo.validUntil)}</span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{(promo.uses || 0).toLocaleString()} used</span>
                          <span style={{ fontSize: 11.5, color: "#9ca3af", fontWeight: 500 }}>
                            Limit: {promo.limit ? promo.limit.toLocaleString() : "∞"}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                          <span className={`pm-badge ${promo.isActive ? "pm-bg-green" : "pm-bg-gray"}`}>
                            {promo.isActive ? <CheckCircle size={10} strokeWidth={2.5} /> : <EyeOff size={10} strokeWidth={2.5} />}
                            {promo.isActive ? "Active" : "Inactive"}
                          </span>
                          {promo.featured && (
                            <span className="pm-badge pm-bg-yellow">
                              <Star size={10} strokeWidth={2.5} /> Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
                          <button className="pm-action-btn pm-action-edit" onClick={() => openModal(promo)}>
                            <Pencil size={12} strokeWidth={2.5} /> Edit
                          </button>
                          <button className="pm-action-btn pm-action-del" onClick={() => handleDelete(promo.id)}>
                            <Trash2 size={12} strokeWidth={2.5} /> Delete
                          </button>
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

      {/* ═══ MODAL ═══ */}
      {isModalOpen && (
        <div className="pm-backdrop" onClick={closeModal}>
          <div className="pm-modal" onClick={e => e.stopPropagation()}>

            {/* Head */}
            <div className="pm-modal-head">
              <div>
                <p className="pm-modal-title">{editingPromo ? "Edit Promotion" : "Create New Promotion"}</p>
                <p className="pm-modal-sub">{editingPromo ? `Editing: ${editingPromo.title}` : "Fill in the details to publish a new promotion."}</p>
              </div>
              <button className="pm-modal-x" onClick={closeModal}><X size={15} strokeWidth={2.2} /></button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmit}>
              <div className="pm-modal-body">

                {/* Image upload */}
                <div>
                  <p className="pm-section-divider">Promotion Image</p>
                  <label className="pm-image-upload" style={{ marginTop: 10 }}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="pm-image-preview" />
                    ) : (
                      <div style={{ width: 64, height: 64, borderRadius: 12, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <ImageIcon size={24} color="#9ca3af" strokeWidth={1.8} />
                      </div>
                    )}
                    <div>
                      <p style={{ fontSize: 13.5, fontWeight: 700, color: "#374151", margin: "0 0 3px" }}>
                        {formData.imageFile ? formData.imageFile.name : "Click to upload an image"}
                      </p>
                      <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>JPG, PNG or WebP · Recommended 800×600px</p>
                    </div>
                    <input type="file" name="imageFile" accept="image/*" onChange={handleInput} style={{ display: "none" }} />
                  </label>
                </div>

                {/* Two-column form */}
                <div className="pm-form-grid">
                  {/* Left col */}
                  <div className="pm-form-col">
                    <p className="pm-section-divider">Basic Information</p>

                    <div className="pm-field">
                      <label className="pm-field-label"><FileText size={11} /> Title</label>
                      <input name="title" value={formData.title} onChange={handleInput} required className="pm-field-input" placeholder="e.g. 15% OFF School Books" />
                    </div>

                    <div className="pm-field">
                      <label className="pm-field-label"><Package size={11} /> Brand Name</label>
                      <input name="brand" value={formData.brand} onChange={handleInput} required className="pm-field-input" placeholder="e.g. ABC Bookshop" />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div className="pm-field">
                        <label className="pm-field-label"><Layers size={11} /> Category</label>
                        <select name="category" value={formData.category} onChange={handleInput} className="pm-field-select">
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="pm-field">
                        <label className="pm-field-label"><Tag size={11} /> Discount Tag</label>
                        <input name="discount" value={formData.discount} onChange={handleInput} required className="pm-field-input" placeholder="e.g. 15% OFF" />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div className="pm-field">
                        <label className="pm-field-label"><DollarSign size={11} /> Original Price (LKR)</label>
                        <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleInput} className="pm-field-input" min="0" />
                      </div>
                      <div className="pm-field">
                        <label className="pm-field-label"><DollarSign size={11} /> Discounted Price (LKR)</label>
                        <input type="number" name="discountedPrice" value={formData.discountedPrice} onChange={handleInput} className="pm-field-input" min="0" />
                      </div>
                    </div>

                    <div className="pm-field">
                      <label className="pm-field-label"><FileText size={11} /> Short Description</label>
                      <textarea name="description" value={formData.description} onChange={handleInput} rows={2} className="pm-field-textarea" placeholder="Brief offer summary…" />
                    </div>
                  </div>

                  {/* Right col */}
                  <div className="pm-form-col">
                    <p className="pm-section-divider">Claim & Validity</p>

                    <div className="pm-field">
                      <label className="pm-field-label"><Hash size={11} /> Promo Code</label>
                      <input name="code" value={formData.code} onChange={handleInput} required className="pm-field-input" placeholder="e.g. GRADE15" style={{ fontFamily: "monospace", letterSpacing: "0.08em", fontWeight: 700 }} />
                    </div>

                    <div className="pm-field">
                      <label className="pm-field-label"><Link2 size={11} /> Redirect URL (Claim Link)</label>
                      <input name="url" value={formData.url} onChange={handleInput} required className="pm-field-input" placeholder="https://…" />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <div className="pm-field">
                        <label className="pm-field-label"><Calendar size={11} /> Valid Until</label>
                        <input type="date" name="validUntil" value={formData.validUntil} onChange={handleInput} className="pm-field-input" />
                      </div>
                      <div className="pm-field">
                        <label className="pm-field-label"><Infinity size={11} /> Max Claims</label>
                        <input type="number" name="limit" value={formData.limit || ""} onChange={handleInput} className="pm-field-input" placeholder="Unlimited" min="1" />
                      </div>
                    </div>

                    <div className="pm-field">
                      <label className="pm-field-label"><FileText size={11} /> Terms & Conditions</label>
                      <textarea name="terms" value={formData.terms} onChange={handleInput} rows={3} className="pm-field-textarea" placeholder="Important details users should know…" />
                    </div>

                    {/* Toggles */}
                    <div>
                      <p className="pm-section-divider" style={{ marginBottom: 10 }}>Visibility</p>
                      <div className="pm-toggle-row">
                        <button type="button" className={`pm-toggle-item ${formData.isActive ? "on" : ""}`} onClick={() => handleToggle("isActive")}>
                          {formData.isActive ? <Eye size={13} strokeWidth={2} /> : <EyeOff size={13} strokeWidth={2} />}
                          {formData.isActive ? "Active" : "Inactive"}
                        </button>
                        <button type="button" className={`pm-toggle-item ${formData.featured ? "on" : ""}`} onClick={() => handleToggle("featured")}>
                          <Star size={13} strokeWidth={2} />
                          {formData.featured ? "Featured" : "Not Featured"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pm-modal-foot">
                <button type="button" className="pm-modal-cancel" onClick={closeModal} disabled={submitting}>Cancel</button>
                <button type="submit" className="pm-modal-submit" disabled={submitting}>
                  {submitting
                    ? <><div className="pm-spin-sm" /> Saving…</>
                    : <><ShieldCheck size={14} strokeWidth={2.5} /> {editingPromo ? "Save Changes" : "Create Promotion"}</>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionManage;