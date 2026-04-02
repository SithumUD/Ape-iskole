import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ApiSchool from "../../services/ApiSchool";
import {
  School, Phone, Mail, Globe, MapPin, Users, GraduationCap,
  BookOpen, Trophy, Palette, Link2, FileText, Upload, Image,
  Plus, X, CheckCircle, AlertCircle, Loader2, Zap, ArrowRight,
  ArrowLeft, Shield, Sparkles, Building2, Landmark, Globe2,
  Star, ChevronRight
} from "lucide-react";

/* ── Shared input style helper ── */
const inputStyle = (hasError = false) => ({
  width: "100%",
  padding: "11px 14px",
  borderRadius: 12,
  border: `1.5px solid ${hasError ? "#fca5a5" : "#e5e7eb"}`,
  background: hasError ? "#fff5f5" : "#fff",
  fontSize: 13.5,
  fontWeight: 500,
  color: "#374151",
  outline: "none",
  fontFamily: "inherit",
  transition: "border-color 0.18s",
  boxSizing: "border-box",
});

const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  color: "#374151",
  marginBottom: 6,
  letterSpacing: "0.01em",
};

const errorStyle = {
  fontSize: 11.5,
  color: "#dc2626",
  fontWeight: 600,
  marginTop: 5,
  display: "flex",
  alignItems: "center",
  gap: 4,
};

/* ── Card ── */
const Card = ({ children, style = {} }) => (
  <div style={{
    background: "#fff", borderRadius: 20, border: "1px solid #f0f0f0",
    padding: "28px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    ...style,
  }}>
    {children}
  </div>
);

/* ── Section head ── */
const SectionHead = ({ label, title, sub }) => (
  <div style={{ marginBottom: 24 }}>
    {label && (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
        color: "var(--color-primary,#4f46e5)",
        background: "color-mix(in srgb,var(--color-primary,#4f46e5) 9%,transparent)",
        padding: "4px 10px", borderRadius: 50, marginBottom: 8,
      }}>
        <Zap size={11} strokeWidth={2.5} />{label}
      </span>
    )}
    <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f0f0f", letterSpacing: "-0.3px", margin: 0 }}>{title}</h2>
    {sub && <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4, fontWeight: 500 }}>{sub}</p>}
  </div>
);

/* ── Array field builder ── */
const ArrayField = ({ items, onChange, onAdd, onRemove, placeholder, label, icon: Icon }) => (
  <div>
    <label style={labelStyle}>
      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {Icon && <Icon size={13} strokeWidth={2} color="#6b7280" />}{label}
      </span>
    </label>
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((val, i) => (
        <div key={i} style={{ display: "flex", gap: 8 }}>
          <input
            value={val}
            onChange={e => onChange(i, e.target.value)}
            placeholder={placeholder}
            style={{ ...inputStyle(), flex: 1 }}
            onFocus={e => e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"}
            onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
          />
          <button
            type="button"
            onClick={() => onRemove(i)}
            style={{
              width: 40, height: 40, borderRadius: 10, border: "1.5px solid #fecaca",
              background: "#fff5f5", cursor: "pointer", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.18s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.querySelector("*").style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff5f5"; }}
          >
            <X size={14} color="#ef4444" strokeWidth={2.5} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={onAdd}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6, alignSelf: "flex-start",
          padding: "7px 16px", borderRadius: 50,
          border: "1.5px solid color-mix(in srgb,var(--color-primary,#4f46e5) 25%,transparent)",
          background: "color-mix(in srgb,var(--color-primary,#4f46e5) 6%,transparent)",
          color: "var(--color-primary,#4f46e5)", fontWeight: 700, fontSize: 12.5,
          cursor: "pointer", fontFamily: "inherit",
        }}
      >
        <Plus size={13} strokeWidth={2.5} /> Add More
      </button>
    </div>
  </div>
);

/* ── File upload tile ── */
const FileUploadTile = ({ label, sub, required, previewUrl, fileName, inputId, name, onChange, error, icon: Icon }) => (
  <div>
    <label style={{ ...labelStyle, marginBottom: 8 }}>
      {label}{required && <span style={{ color: "#ef4444" }}> *</span>}
    </label>
    <label
      htmlFor={inputId}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "20px 16px", borderRadius: 14, cursor: "pointer", textAlign: "center",
        border: `2px dashed ${error ? "#fca5a5" : previewUrl ? "color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent)" : "#e5e7eb"}`,
        background: error ? "#fff5f5" : previewUrl ? "color-mix(in srgb,var(--color-primary,#4f46e5) 4%,transparent)" : "#fafafa",
        transition: "all 0.2s", minHeight: 120,
      }}
      onMouseEnter={e => { if (!previewUrl) { e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"; e.currentTarget.style.background = "color-mix(in srgb,var(--color-primary,#4f46e5) 4%,transparent)"; }}}
      onMouseLeave={e => { if (!previewUrl) { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#fafafa"; }}}
    >
      <input type="file" id={inputId} name={name} accept="image/*,.pdf" onChange={onChange} style={{ display: "none" }} />
      {previewUrl ? (
        <>
          <img src={previewUrl} alt="Preview" style={{ maxHeight: 80, objectFit: "contain", borderRadius: 8, marginBottom: 8 }} />
          <span style={{ fontSize: 12, color: "#374151", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>{fileName}</span>
          <span style={{ fontSize: 11, color: "var(--color-primary,#4f46e5)", fontWeight: 600, marginTop: 4 }}>Click to change</span>
        </>
      ) : (
        <>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
            <Icon size={20} color="#9ca3af" strokeWidth={1.8} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 3 }}>{sub}</span>
          <span style={{ fontSize: 11.5, color: "#9ca3af", fontWeight: 500 }}>Click to browse</span>
        </>
      )}
    </label>
    {error && (
      <p style={errorStyle}><AlertCircle size={11} strokeWidth={2.5} />{error}</p>
    )}
  </div>
);

/* ═══════════════════════════════════
   REGISTER SCHOOL PAGE
═══════════════════════════════════ */
const RegisterSchool = () => {
  const navigate = useNavigate();
  const { authenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: "", type: "Government", description: "",
    startedYear: "", studentCount: "", teachersCount: "",
    contact: { phone: "", email: "", website: "", address: "" },
    leadership: [{ name: "", position: "" }],
    academicStreams: [""], schoolFacilities: [""],
    clubsAndSocieties: [""], achievements: [""],
    sponsors: [""], socialMediaUrls: [""],
    logoFile: null, coverImageFile: null,
    photoGallery: [],
  });

  const [submitted,    setSubmitted]    = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab,    setActiveTab]    = useState("basic");
  const [errors,       setErrors]       = useState({});
  const [apiError,     setApiError]     = useState(null);
  const [previews,     setPreviews]     = useState({ logo: null, cover: null, gallery: [] });

  useEffect(() => {
    return () => {
      if (previews.logo)   URL.revokeObjectURL(previews.logo);
      if (previews.cover)  URL.revokeObjectURL(previews.cover);
      previews.gallery.forEach(u => URL.revokeObjectURL(u));
    };
  }, []);

  const TABS = [
    { id: "basic",      label: "Basic Info",   icon: School        },
    { id: "contact",    label: "Contact",      icon: Phone         },
    { id: "leadership", label: "Leadership",   icon: Users         },
    { id: "features",   label: "Features",     icon: Sparkles      },
    { id: "documents",  label: "Documents",    icon: FileText      },
  ];
  const tabIndex = TABS.findIndex(t => t.id === activeTab);
  const progress = ((tabIndex + 1) / TABS.length) * 100;

  /* ── handlers ── */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      if (name === "photoGallery") {
        const newFiles = [...formData.photoGallery, ...Array.from(files)];
        const newPrevs = [...previews.gallery, ...Array.from(files).map(f => URL.createObjectURL(f))];
        setFormData(p => ({ ...p, photoGallery: newFiles }));
        setPreviews(p => ({ ...p, gallery: newPrevs }));
      } else {
        const file = files[0];
        setFormData(p => ({ ...p, [name]: file }));
        if (file?.type.startsWith("image/")) {
          const url = URL.createObjectURL(file);
          const key = name.replace("File", "");
          setPreviews(p => ({ ...p, [key]: url }));
        }
      }
      return;
    }
    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleContactChange = (field, value) =>
    setFormData(p => ({ ...p, contact: { ...p.contact, [field]: value } }));

  const handleArrayChange = (field, idx, value) => {
    const arr = [...formData[field]]; arr[idx] = value;
    setFormData(p => ({ ...p, [field]: arr }));
  };
  const addArrayItem    = (field) => setFormData(p => ({ ...p, [field]: [...p[field], ""] }));
  const removeArrayItem = (field, idx) => setFormData(p => ({ ...p, [field]: p[field].filter((_, i) => i !== idx) }));

  const handleLeadershipChange = (idx, field, value) => {
    const arr = [...formData.leadership]; arr[idx] = { ...arr[idx], [field]: value };
    setFormData(p => ({ ...p, leadership: arr }));
  };
  const addLeadership    = () => setFormData(p => ({ ...p, leadership: [...p.leadership, { name: "", position: "" }] }));
  const removeLeadership = (idx) => setFormData(p => ({ ...p, leadership: p.leadership.filter((_, i) => i !== idx) }));

  const validate = () => {
    const e = {};
    if (!formData.name.trim())               e.name       = "School name is required";
    if (!formData.contact.email.trim())       e.email      = "Email is required";
    if (!formData.contact.phone.trim())       e.phone      = "Phone is required";
    if (!formData.contact.address.trim())     e.address    = "Address is required";
    if (!formData.leadership[0]?.name.trim()) e.leadership = "At least one leader is required";
    if (!formData.logoFile)                   e.logo       = "School logo is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name, type: formData.type,
        description: formData.description || "",
        startedYear: parseInt(formData.startedYear) || 0,
        studentCount: parseInt(formData.studentCount) || 0,
        teachersCount: parseInt(formData.teachersCount) || 0,
        contact: formData.contact,
        leadership:        formData.leadership.filter(m => m.name && m.position),
        academicStreams:    formData.academicStreams.filter(s => s.trim()),
        schoolFacilities:  formData.schoolFacilities.filter(f => f.trim()),
        clubsAndSocieties: formData.clubsAndSocieties.filter(c => c.trim()),
        achievements:      formData.achievements.filter(a => a.trim()),
        sponsors:          formData.sponsors.filter(s => s.trim()),
        socialMediaUrls:   formData.socialMediaUrls.filter(u => u.trim()),
      };
      const res = await ApiSchool.registerSchool(payload);
      const schoolId = res.data.id;
      if (formData.logoFile || formData.coverImageFile || formData.photoGallery.length > 0) {
        const fd = new FormData();
        if (formData.logoFile)       fd.append("logo",    formData.logoFile);
        if (formData.coverImageFile) fd.append("cover",   formData.coverImageFile);
        formData.photoGallery.forEach(f => fd.append("gallery", f));
        await ApiSchool.updateImages(schoolId, fd);
      }
      setSubmitted(true);
      setTimeout(() => navigate("/schools"), 3000);
    } catch (err) {
      setApiError(err.response?.data?.message || err.response?.data || "Failed to register school. Please try again.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ─────────────────────────────────────────────── */

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        .rs-page * { box-sizing: border-box; }
        .rs-page { font-family: 'Plus Jakarta Sans', sans-serif; }
        .rs-input:focus { border-color: var(--color-primary,#4f46e5) !important; }
      `}</style>

      <div className="rs-page" style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* ═══ HERO ═══ */}
        <div style={{
          position: "relative", borderRadius: 24, overflow: "hidden",
          background: "linear-gradient(135deg, #1e1b4b 0%, var(--color-primary,#4f46e5) 45%, var(--color-secondary,#7c3aed) 100%)",
          padding: "52px 48px", marginBottom: 32, color: "#fff",
          animation: "fadeUp 0.6s ease both",
        }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, left: -40, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 18,
              fontSize: 11.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#c7d2fe", background: "rgba(255,255,255,0.12)", padding: "5px 14px", borderRadius: 50,
            }}>
              <School size={12} strokeWidth={2.5} /> School Registration
            </span>
            <h1 style={{ fontSize: "clamp(26px,3.5vw,40px)", fontWeight: 900, letterSpacing: "-0.8px", lineHeight: 1.15, margin: "0 0 14px" }}>
              Register Your School
            </h1>
            <p style={{ fontSize: 15.5, color: "rgba(255,255,255,0.78)", lineHeight: 1.7, margin: "0 0 32px", fontWeight: 400, maxWidth: 480 }}>
              Join the Ape Iskole platform and connect with students, parents, and the wider community across Sri Lanka.
            </p>
            <div style={{
              display: "inline-flex", flexWrap: "wrap", gap: 2,
              background: "rgba(255,255,255,0.1)", borderRadius: 16,
              backdropFilter: "blur(8px)", overflow: "hidden",
            }}>
              {[
                { icon: CheckCircle, label: "Free Registration",   sub: "No hidden fees"       },
                { icon: Zap,         label: "Quick Approval",      sub: "24–48 hours"          },
                { icon: Shield,      label: "Secure Verification", sub: "Your data is safe"    },
              ].map(({ icon: Icon, label, sub }, i) => (
                <div key={i} style={{ padding: "16px 24px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.12)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                    <Icon size={14} strokeWidth={2} color="rgba(255,255,255,0.6)" />
                    <span style={{ fontSize: 13.5, fontWeight: 800 }}>{label}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ API ERROR ═══ */}
        {apiError && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 16,
            padding: "16px 20px", marginBottom: 24,
            display: "flex", alignItems: "flex-start", gap: 12,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <AlertCircle size={16} color="#dc2626" strokeWidth={2} />
            </div>
            <div>
              <p style={{ fontSize: 13.5, fontWeight: 800, color: "#991b1b", margin: "0 0 3px" }}>Submission Error</p>
              <p style={{ fontSize: 13, color: "#dc2626", margin: 0, fontWeight: 500 }}>{apiError}</p>
            </div>
          </div>
        )}

        {/* ═══ SUCCESS ═══ */}
        {submitted && (
          <div style={{
            background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 16,
            padding: "16px 20px", marginBottom: 24,
            display: "flex", alignItems: "flex-start", gap: 12,
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <CheckCircle size={16} color="#059669" strokeWidth={2} />
            </div>
            <div>
              <p style={{ fontSize: 13.5, fontWeight: 800, color: "#065f46", margin: "0 0 3px" }}>Registration Submitted!</p>
              <p style={{ fontSize: 13, color: "#059669", margin: 0, fontWeight: 500 }}>
                Your school has been submitted for review. You'll receive an email once approved. Redirecting…
              </p>
            </div>
          </div>
        )}

        {/* ═══ TAB NAV ═══ */}
        <div style={{
          background: "#fff", borderRadius: 18, border: "1px solid #f0f0f0",
          padding: "8px 10px", marginBottom: 28,
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
            {TABS.map(({ id, label, icon: Icon }, idx) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "9px 16px", borderRadius: 12, border: "none",
                  background: activeTab === id
                    ? "linear-gradient(135deg, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))"
                    : "transparent",
                  color: activeTab === id ? "#fff" : "#6b7280",
                  fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                  boxShadow: activeTab === id ? "0 4px 12px color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent)" : "none",
                  transition: "all 0.18s",
                }}
              >
                <Icon size={14} strokeWidth={2.2} />
                <span>{label}</span>
                {idx < TABS.length - 1 && <ChevronRight size={12} strokeWidth={2} style={{ opacity: 0.35, marginLeft: 2 }} />}
              </button>
            ))}
          </div>
          {/* Progress bar */}
          <div style={{ height: 4, borderRadius: 50, background: "#f3f4f6", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 50, width: `${progress}%`,
              background: "linear-gradient(90deg, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))",
              transition: "width 0.35s ease",
            }} />
          </div>
        </div>

        {/* ═══ FORM ═══ */}
        <form onSubmit={handleSubmit}>

          {/* ── BASIC INFO ── */}
          {activeTab === "basic" && (
            <Card>
              <SectionHead label="Step 1" title="Basic Information" sub="Tell us about your school" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>

                {/* School name – full width */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>School Name <span style={{ color: "#ef4444" }}>*</span></label>
                  <input
                    name="name" value={formData.name} onChange={handleChange}
                    placeholder="Enter full school name"
                    style={inputStyle(!!errors.name)}
                    onFocus={e => e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"}
                    onBlur={e => e.currentTarget.style.borderColor = errors.name ? "#fca5a5" : "#e5e7eb"}
                  />
                  {errors.name && <p style={errorStyle}><AlertCircle size={11} strokeWidth={2.5} />{errors.name}</p>}
                </div>

                {/* Type */}
                <div>
                  <label style={labelStyle}>School Type <span style={{ color: "#ef4444" }}>*</span></label>
                  <div style={{ position: "relative" }}>
                    <select
                      name="type" value={formData.type} onChange={handleChange}
                      style={{ ...inputStyle(), appearance: "none", WebkitAppearance: "none", cursor: "pointer", paddingRight: 36 }}
                      onFocus={e => e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"}
                      onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
                    >
                      <option value="Government">Government</option>
                      <option value="Private">Private</option>
                      <option value="International">International</option>
                    </select>
                    <ChevronRight size={14} color="#9ca3af" strokeWidth={2.5} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%) rotate(90deg)", pointerEvents: "none" }} />
                  </div>
                </div>

                {/* Established year */}
                <div>
                  <label style={labelStyle}>Established Year</label>
                  <input
                    name="startedYear" type="number" value={formData.startedYear} onChange={handleChange}
                    placeholder="e.g. 1985"
                    style={inputStyle()}
                    onFocus={e => e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"}
                    onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
                  />
                </div>

                {/* Students */}
                <div>
                  <label style={labelStyle}>Number of Students</label>
                  <input
                    name="studentCount" type="number" value={formData.studentCount} onChange={handleChange}
                    placeholder="Approx. student count"
                    style={inputStyle()}
                    onFocus={e => e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"}
                    onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
                  />
                </div>

                {/* Teachers */}
                <div>
                  <label style={labelStyle}>Number of Teachers</label>
                  <input
                    name="teachersCount" type="number" value={formData.teachersCount} onChange={handleChange}
                    placeholder="Approx. teacher count"
                    style={inputStyle()}
                    onFocus={e => e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"}
                    onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
                  />
                </div>

                {/* Description – full width */}
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>School Description</label>
                  <textarea
                    name="description" value={formData.description} onChange={handleChange}
                    placeholder="Describe your school's history, mission and vision…"
                    rows={4}
                    style={{ ...inputStyle(), resize: "none" }}
                    onFocus={e => e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"}
                    onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* ── CONTACT ── */}
          {activeTab === "contact" && (
            <Card>
              <SectionHead label="Step 2" title="Contact Information" sub="How can people reach your school?" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>

                <div>
                  <label style={labelStyle}>Phone Number <span style={{ color: "#ef4444" }}>*</span></label>
                  <input
                    value={formData.contact.phone} onChange={e => handleContactChange("phone", e.target.value)}
                    placeholder="+94 XX XXX XXXX"
                    style={inputStyle(!!errors.phone)}
                    onFocus={e => e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"}
                    onBlur={e => e.currentTarget.style.borderColor = errors.phone ? "#fca5a5" : "#e5e7eb"}
                  />
                  {errors.phone && <p style={errorStyle}><AlertCircle size={11} strokeWidth={2.5} />{errors.phone}</p>}
                </div>

                <div>
                  <label style={labelStyle}>Email Address <span style={{ color: "#ef4444" }}>*</span></label>
                  <input
                    type="email"
                    value={formData.contact.email} onChange={e => handleContactChange("email", e.target.value)}
                    placeholder="school@example.com"
                    style={inputStyle(!!errors.email)}
                    onFocus={e => e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"}
                    onBlur={e => e.currentTarget.style.borderColor = errors.email ? "#fca5a5" : "#e5e7eb"}
                  />
                  {errors.email && <p style={errorStyle}><AlertCircle size={11} strokeWidth={2.5} />{errors.email}</p>}
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Website</label>
                  <input
                    value={formData.contact.website} onChange={e => handleContactChange("website", e.target.value)}
                    placeholder="https://www.yourschool.lk"
                    style={inputStyle()}
                    onFocus={e => e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"}
                    onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
                  />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Address <span style={{ color: "#ef4444" }}>*</span></label>
                  <textarea
                    value={formData.contact.address} onChange={e => handleContactChange("address", e.target.value)}
                    placeholder="School address, city, district"
                    rows={2}
                    style={{ ...inputStyle(!!errors.address), resize: "none" }}
                    onFocus={e => e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"}
                    onBlur={e => e.currentTarget.style.borderColor = errors.address ? "#fca5a5" : "#e5e7eb"}
                  />
                  {errors.address && <p style={errorStyle}><AlertCircle size={11} strokeWidth={2.5} />{errors.address}</p>}
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <ArrayField
                    label="Social Media Links"
                    icon={Link2}
                    items={formData.socialMediaUrls}
                    onChange={(i, v) => handleArrayChange("socialMediaUrls", i, v)}
                    onAdd={() => addArrayItem("socialMediaUrls")}
                    onRemove={(i) => removeArrayItem("socialMediaUrls", i)}
                    placeholder="Facebook, Instagram, LinkedIn URL"
                  />
                </div>
              </div>
            </Card>
          )}

          {/* ── LEADERSHIP ── */}
          {activeTab === "leadership" && (
            <Card>
              <SectionHead label="Step 3" title="Leadership Team" sub="Key personnel managing the school" />
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {formData.leadership.map((member, idx) => (
                  <div
                    key={idx}
                    style={{
                      borderRadius: 14, border: "1px solid #f0f0f0",
                      padding: "18px 20px", background: "#fafafa",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: "50%",
                          background: "linear-gradient(135deg, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 11, fontWeight: 800, color: "#fff",
                        }}>
                          {idx + 1}
                        </div>
                        <span style={{ fontSize: 13.5, fontWeight: 700, color: "#0f0f0f" }}>Leadership Member</span>
                      </div>
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => removeLeadership(idx)}
                          style={{
                            display: "flex", alignItems: "center", gap: 4,
                            padding: "4px 10px", borderRadius: 50,
                            border: "1.5px solid #fecaca", background: "#fff5f5",
                            color: "#ef4444", fontWeight: 700, fontSize: 12,
                            cursor: "pointer", fontFamily: "inherit",
                          }}
                        >
                          <X size={12} strokeWidth={2.5} /> Remove
                        </button>
                      )}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                      <input
                        value={member.name}
                        onChange={e => handleLeadershipChange(idx, "name", e.target.value)}
                        placeholder="Full Name"
                        style={{ ...inputStyle(), background: "#fff" }}
                        onFocus={e => e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"}
                        onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
                      />
                      <input
                        value={member.position}
                        onChange={e => handleLeadershipChange(idx, "position", e.target.value)}
                        placeholder="Position (e.g. Principal)"
                        style={{ ...inputStyle(), background: "#fff" }}
                        onFocus={e => e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"}
                        onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
                      />
                    </div>
                  </div>
                ))}
                {errors.leadership && <p style={errorStyle}><AlertCircle size={11} strokeWidth={2.5} />{errors.leadership}</p>}
                <button
                  type="button"
                  onClick={addLeadership}
                  style={{
                    width: "100%", padding: "14px", borderRadius: 14,
                    border: "2px dashed #e5e7eb", background: "none",
                    color: "#6b7280", fontWeight: 700, fontSize: 13.5,
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"; e.currentTarget.style.color = "var(--color-primary,#4f46e5)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#6b7280"; }}
                >
                  <Plus size={15} strokeWidth={2.5} /> Add Leadership Member
                </button>
              </div>
            </Card>
          )}

          {/* ── FEATURES ── */}
          {activeTab === "features" && (
            <Card>
              <SectionHead label="Step 4" title="School Features" sub="Highlight what makes your school unique" />
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {[
                  { field: "academicStreams",    label: "Academic Streams",     icon: BookOpen,      placeholder: "e.g. Science, Commerce, Arts" },
                  { field: "schoolFacilities",   label: "Facilities",           icon: Building2,     placeholder: "e.g. Library, Laboratory, Sports Ground" },
                  { field: "clubsAndSocieties",  label: "Clubs & Societies",    icon: Users,         placeholder: "e.g. Debate Club, Science Society" },
                  { field: "achievements",       label: "Achievements",         icon: Trophy,        placeholder: "e.g. National Champions 2024" },
                  { field: "sponsors",           label: "Sponsors & Partners",  icon: Star,          placeholder: "e.g. ABC Company" },
                ].map(({ field, label, icon, placeholder }) => (
                  <ArrayField
                    key={field}
                    label={label}
                    icon={icon}
                    items={formData[field]}
                    onChange={(i, v) => handleArrayChange(field, i, v)}
                    onAdd={() => addArrayItem(field)}
                    onRemove={(i) => removeArrayItem(field, i)}
                    placeholder={placeholder}
                  />
                ))}
              </div>
            </Card>
          )}

          {/* ── DOCUMENTS ── */}
          {activeTab === "documents" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <Card>
                <SectionHead label="Step 5" title="Verification Documents" sub="Upload clear, readable documents for verification" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 24 }}>
                  <FileUploadTile
                    label="School Logo" sub="Upload school logo" required
                    previewUrl={previews.logo} fileName={formData.logoFile?.name}
                    inputId="logo-upload" name="logoFile" onChange={handleChange}
                    error={errors.logo} icon={Image}
                  />
                  <FileUploadTile
                    label="Cover Image" sub="Upload cover photo"
                    previewUrl={previews.cover} fileName={formData.coverImageFile?.name}
                    inputId="cover-upload" name="coverImageFile" onChange={handleChange}
                    error={null} icon={Image}
                  />
                </div>

                {/* Gallery upload */}
                <div>
                  <label style={{ ...labelStyle, marginBottom: 8 }}>Photo Gallery <span style={{ fontSize: 11.5, color: "#9ca3af", fontWeight: 500 }}>(Optional)</span></label>
                  <label
                    htmlFor="gallery-upload"
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                      padding: "24px", borderRadius: 14, cursor: "pointer", textAlign: "center",
                      border: "2px dashed #e5e7eb", background: "#fafafa", transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"; e.currentTarget.style.background = "color-mix(in srgb,var(--color-primary,#4f46e5) 4%,transparent)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#fafafa"; }}
                  >
                    <input type="file" id="gallery-upload" name="photoGallery" multiple accept="image/*" onChange={handleChange} style={{ display: "none" }} />
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                      <Upload size={20} color="#9ca3af" strokeWidth={1.8} />
                    </div>
                    <span style={{ fontSize: 13.5, fontWeight: 700, color: "#374151", marginBottom: 3 }}>Upload Gallery Photos</span>
                    <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>PNG, JPG — up to 10 images, 5MB each</span>
                  </label>

                  {previews.gallery.length > 0 && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(90px,1fr))", gap: 10, marginTop: 14 }}>
                      {previews.gallery.map((url, idx) => (
                        <div key={idx} style={{ position: "relative", borderRadius: 10, overflow: "hidden", aspectRatio: "1" }}>
                          <img src={url} alt={`Gallery ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <button
                            type="button"
                            onClick={() => {
                              setPreviews(p => ({ ...p, gallery: p.gallery.filter((_, i) => i !== idx) }));
                              setFormData(p => ({ ...p, photoGallery: p.photoGallery.filter((_, i) => i !== idx) }));
                            }}
                            style={{
                              position: "absolute", top: 5, right: 5,
                              width: 22, height: 22, borderRadius: "50%",
                              background: "rgba(0,0,0,0.6)", border: "none",
                              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                          >
                            <X size={12} color="#fff" strokeWidth={2.5} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              {/* Verification note */}
              <div style={{
                borderRadius: 16, padding: "20px",
                background: "color-mix(in srgb,var(--color-primary,#4f46e5) 5%,transparent)",
                border: "1px solid color-mix(in srgb,var(--color-primary,#4f46e5) 14%,transparent)",
                display: "flex", alignItems: "flex-start", gap: 14,
              }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "color-mix(in srgb,var(--color-primary,#4f46e5) 12%,transparent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Shield size={18} color="var(--color-primary,#4f46e5)" strokeWidth={2} />
                </div>
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 800, color: "#0f0f0f", margin: "0 0 6px" }}>Verification Promise</p>
                  <p style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.65, margin: "0 0 10px", fontWeight: 400 }}>
                    We strictly verify all institutional identities to ensure platform safety. Documents are encrypted and only accessible by our verification staff.
                  </p>
                  <ul style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.8, margin: 0, paddingLeft: 16, fontWeight: 500 }}>
                    <li>NIC / Passport / National ID of the registering officer</li>
                    <li>Signed letter on official school letterhead</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ═══ SUBMIT BAR ═══ */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 16,
            marginTop: 28, paddingTop: 24, borderTop: "1px solid #f0f0f0",
          }}>
            <p style={{ fontSize: 12.5, color: "#9ca3af", fontWeight: 500, maxWidth: 380 }}>
              By submitting, you confirm you are authorised to represent this institution and agree to our Terms of Service.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                type="button"
                onClick={() => navigate("/")}
                style={{
                  padding: "12px 22px", borderRadius: 50,
                  border: "1.5px solid #e5e7eb", background: "#fff",
                  color: "#374151", fontWeight: 700, fontSize: 13.5,
                  cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "12px 28px", borderRadius: 50, border: "none",
                  background: isSubmitting
                    ? "#e5e7eb"
                    : "linear-gradient(135deg, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))",
                  color: isSubmitting ? "#9ca3af" : "#fff",
                  fontWeight: 800, fontSize: 14, cursor: isSubmitting ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  boxShadow: isSubmitting ? "none" : "0 6px 20px color-mix(in srgb,var(--color-primary,#4f46e5) 35%,transparent)",
                  transition: "all 0.2s",
                }}
              >
                {isSubmitting
                  ? <><Loader2 size={16} strokeWidth={2.5} style={{ animation: "spin 1s linear infinite" }} /> Processing…</>
                  : <><Sparkles size={15} strokeWidth={2.5} /> Confirm Registration</>
                }
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default RegisterSchool;