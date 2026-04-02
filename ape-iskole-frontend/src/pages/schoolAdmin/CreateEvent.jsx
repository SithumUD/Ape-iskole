import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import ApiEvent from "../../services/ApiEvent";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import {
  FileText, ImagePlus, Ticket, Heart, MapPin, CheckCircle,
  Eye, RotateCcw, Send, Save, Zap, ParkingSquare,
  UtensilsCrossed, Accessibility, Star, AlertCircle, Link2,
} from "lucide-react";

/* ─── constants ───────────────────────────────────────── */
const initialForm = {
  title:"", category:"", date:"", time:"", location:"", venue:"",
  shortDescription:"", description:"", image:null, youtubeLink:"",
  isFree:true, participationDetails:"", enableTickets:false, tickets:[],
  enableDonation:false, donationGoal:"", donationDescription:"",
  isFeatured:false, contactEmail:"", contactPhone:"",
  ageRestriction:"", parkingAvailable:false, foodAvailable:false, wheelchairAccessible:false,
};

const categories = [
  { value:"Sports",         label:"Sports" },
  { value:"Carnival",       label:"Carnival" },
  { value:"Art Competition",label:"Art Competition" },
  { value:"Anniversary",    label:"Anniversary" },
  { value:"Concert",        label:"Concert" },
  { value:"Big Match",      label:"Big Match" },
  { value:"Donation",       label:"Donation" },
  { value:"Science Fair",   label:"Science Fair" },
  { value:"Cultural Event", label:"Cultural Event" },
];

const TABS = [
  { id:"basic",    label:"Basic Info",    icon:FileText },
  { id:"media",    label:"Media",         icon:ImagePlus },
  { id:"tickets",  label:"Participation", icon:Ticket },
  { id:"donation", label:"Donation",      icon:Heart },
  { id:"venue",    label:"Venue",         icon:MapPin },
];

/* ─── styles ──────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  @keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
  @keyframes spin   { to{transform:rotate(360deg)} }

  .cev*{box-sizing:border-box}
  .cev{font-family:'Plus Jakarta Sans',sans-serif;animation:fadeUp .45s ease both}

  /* head */
  .cev-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:24px}
  .cev-title{font-size:22px;font-weight:900;color:#0f0f0f;letter-spacing:-.4px;margin:0 0 4px}
  .cev-sub{font-size:13px;color:#9ca3af;font-weight:500;margin:0}
  .cev-head-badges{display:flex;align-items:center;gap:7px;flex-wrap:wrap}

  /* success banner */
  .cev-success{background:#ecfdf5;border:1px solid #a7f3d0;border-radius:16px;padding:16px 20px;display:flex;align-items:center;gap:12px;margin-bottom:24px}
  .cev-success-ico{width:38px;height:38px;border-radius:12px;background:#d1fae5;display:flex;align-items:center;justify-content:center;color:#059669;flex-shrink:0}
  .cev-success-title{font-size:14px;font-weight:800;color:#065f46;margin:0 0 2px}
  .cev-success-sub{font-size:12px;color:#047857;margin:0}

  /* layout */
  .cev-layout{display:grid;grid-template-columns:1fr;gap:20px}
  @media(min-width:1024px){.cev-layout{grid-template-columns:1fr 320px}}
  .cev-main{display:flex;flex-direction:column;gap:16px}

  /* tab nav */
  .cev-tabs{background:#fff;border-radius:16px;border:1px solid #f0f0f0;padding:6px;display:flex;flex-wrap:wrap;gap:4px;box-shadow:0 1px 4px rgba(0,0,0,.04);position:sticky;top:72px;z-index:10}
  .cev-tab{display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:11px;border:none;background:transparent;font-size:12.5px;font-weight:700;color:#6b7280;cursor:pointer;font-family:inherit;transition:all .18s;white-space:nowrap}
  .cev-tab:hover{background:#f7f7f8;color:#111}
  .cev-tab.active{background:linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));color:#fff;box-shadow:0 3px 10px color-mix(in srgb,var(--color-primary,#4f46e5) 28%,transparent)}

  /* form card */
  .cev-card{background:#fff;border-radius:20px;border:1px solid #f0f0f0;padding:24px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .cev-card-title{font-size:16px;font-weight:800;color:#0f0f0f;margin:0 0 18px;letter-spacing:-.2px}

  /* form fields */
  .cev-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  @media(max-width:560px){.cev-grid{grid-template-columns:1fr}}
  .cev-col2{grid-column:1/-1}
  .cev-field{display:flex;flex-direction:column;gap:5px}
  .cev-label{font-size:11.5px;font-weight:700;color:#374151}
  .cev-req{color:#ef4444}
  .cev-input{height:42px;padding:0 13px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:500;color:#111;font-family:inherit;transition:border-color .18s;outline:none;width:100%}
  .cev-input:focus{border-color:var(--color-primary,#4f46e5)}
  .cev-input.err{border-color:#ef4444}
  .cev-textarea{padding:11px 13px;border-radius:12px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:500;color:#111;font-family:inherit;transition:border-color .18s;outline:none;width:100%;resize:vertical;line-height:1.65;min-height:90px}
  .cev-textarea:focus{border-color:var(--color-primary,#4f46e5)}
  .cev-textarea.err{border-color:#ef4444}
  .cev-char{font-size:10.5px;color:#9ca3af;text-align:right;margin-top:3px}
  .cev-errmsg{font-size:11.5px;color:#ef4444;font-weight:600;margin-top:2px;display:flex;align-items:center;gap:4px}
  .cev-hint{font-size:11.5px;color:#9ca3af;margin-top:3px}

  /* section label */
  .cev-sec{font-size:9.5px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;color:#c4c4c4;margin:20px 0 10px}

  /* image upload */
  .cev-upload{border:2px dashed #e5e7eb;border-radius:14px;padding:28px 20px;text-align:center;cursor:pointer;transition:border-color .18s;position:relative;display:block}
  .cev-upload:hover{border-color:var(--color-primary,#4f46e5)}
  .cev-upload input{position:absolute;inset:0;opacity:0;cursor:pointer}
  .cev-upload-ico{width:44px;height:44px;border-radius:13px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;color:#9ca3af}
  .cev-preview{width:100%;height:180px;object-fit:cover;border-radius:14px;margin-bottom:12px;display:block}

  /* access type */
  .cev-access-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .cev-access-opt{display:flex;align-items:center;gap:10px;padding:14px;border-radius:13px;border:1.5px solid #e5e7eb;cursor:pointer;transition:all .18s;background:#fff}
  .cev-access-opt.free{background:#eff6ff;border-color:#93c5fd}
  .cev-access-opt.paid{background:#fff7ed;border-color:#fdba74}
  .cev-access-icon{width:36px;height:36px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}

  /* facilities */
  .cev-fac-row{display:flex;flex-wrap:wrap;gap:9px}
  .cev-fac-opt{display:flex;align-items:center;gap:7px;padding:9px 14px;border-radius:11px;border:1.5px solid #e5e7eb;background:#fff;cursor:pointer;transition:all .18s;font-size:12.5px;font-weight:600;color:#4b5563;user-select:none}
  .cev-fac-opt.on{background:color-mix(in srgb,var(--color-primary,#4f46e5) 7%,transparent);border-color:color-mix(in srgb,var(--color-primary,#4f46e5) 22%,transparent);color:var(--color-primary,#4f46e5)}

  /* donation disabled state */
  .cev-donation-off{background:#fafafa;border-radius:14px;padding:36px 20px;text-align:center;border:1px dashed #e5e7eb}

  /* coming soon badge */
  .cev-coming{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:50px;background:#ede9fe;color:#5b21b6;font-size:11px;font-weight:800;letter-spacing:.06em}
  .cev-pulse{width:7px;height:7px;border-radius:50%;background:#7c3aed;animation:pulse 1.5s ease infinite}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}

  /* ── SIDEBAR ── */
  .cev-sidebar{display:flex;flex-direction:column;gap:16px}

  /* status card */
  .cev-status-card{background:#fff;border-radius:20px;border:1px solid #f0f0f0;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .cev-status-item{border-radius:13px;padding:14px;margin-bottom:10px}
  .cev-status-item:last-child{margin-bottom:0}
  .cev-status-item-head{display:flex;align-items:center;gap:7px;margin-bottom:5px;font-size:12px;font-weight:700}
  .cev-status-item-title{font-size:13.5px;font-weight:800;color:#0f0f0f;margin:0 0 3px}
  .cev-status-item-sub{font-size:11.5px;color:#6b7280;margin:0}

  /* featured toggle */
  .cev-featured-toggle{display:flex;align-items:center;justify-content:space-between;padding:13px 14px;border-radius:13px;border:1.5px solid #e5e7eb;background:#fff;cursor:pointer;margin-bottom:14px;transition:border-color .18s}
  .cev-featured-toggle.on{background:color-mix(in srgb,#d97706 6%,transparent);border-color:color-mix(in srgb,#d97706 25%,transparent)}
  .cev-toggle-track{width:38px;height:22px;border-radius:50px;background:#e5e7eb;position:relative;transition:background .18s;flex-shrink:0}
  .cev-toggle-track.on{background:#d97706}
  .cev-toggle-thumb{width:16px;height:16px;border-radius:50%;background:#fff;position:absolute;top:3px;left:3px;transition:left .18s;box-shadow:0 1px 4px rgba(0,0,0,.2)}
  .cev-toggle-thumb.on{left:19px}

  /* preview mini card */
  .cev-preview-card{background:#fff;border-radius:20px;border:1px solid #f0f0f0;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,.04)}
  .cev-preview-img{width:100%;height:110px;object-fit:cover;border-radius:12px;margin-bottom:12px}
  .cev-preview-ph{height:110px;border-radius:12px;background:linear-gradient(135deg,color-mix(in srgb,var(--color-primary,#4f46e5) 8%,#fff),color-mix(in srgb,var(--color-secondary,#7c3aed) 6%,#fff));display:flex;align-items:center;justify-content:center;margin-bottom:12px;color:var(--color-primary,#4f46e5)}
  .cev-preview-badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:50px;font-size:11px;font-weight:700;margin-right:5px;margin-bottom:6px}
  .cev-preview-name{font-size:14px;font-weight:800;color:#0f0f0f;margin:0 0 4px}
  .cev-preview-meta{font-size:11.5px;color:#9ca3af;margin:0 0 5px}
  .cev-preview-desc{font-size:12px;color:#6b7280;margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}

  /* action btns */
  .cev-actions{background:#fff;border-radius:20px;border:1px solid #f0f0f0;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,.04);display:flex;flex-direction:column;gap:10px}
  .cev-btn-submit{width:100%;padding:13px;border-radius:13px;border:none;background:linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));color:#fff;font-size:13.5px;font-weight:800;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 5px 16px color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent);transition:all .22s}
  .cev-btn-submit:hover{transform:translateY(-1px);box-shadow:0 8px 22px color-mix(in srgb,var(--color-primary,#4f46e5) 40%,transparent)}
  .cev-btn-submit:disabled{opacity:.6;cursor:not-allowed;transform:none}
  .cev-btn-outline{width:100%;padding:12px;border-radius:13px;border:1.5px solid #e5e7eb;background:#fff;font-size:13px;font-weight:700;color:#374151;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:7px;transition:all .18s}
  .cev-btn-outline:hover{background:#f7f7f8;border-color:#d1d5db}
  .cev-btn-ghost{width:100%;padding:12px;border-radius:13px;border:none;background:color-mix(in srgb,var(--color-primary,#4f46e5) 7%,transparent);font-size:13px;font-weight:700;color:var(--color-primary,#4f46e5);cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:7px;transition:all .18s}
  .cev-btn-ghost:hover{background:color-mix(in srgb,var(--color-primary,#4f46e5) 12%,transparent)}

  /* spinner */
  .cev-spin{width:16px;height:16px;border-radius:50%;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;animation:spin .75s linear infinite;flex-shrink:0}

  /* badge helpers */
  .cev-b-blue{background:#dbeafe;color:#1e40af}
  .cev-b-orange{background:#ffedd5;color:#9a3412}
  .cev-b-green{background:#d1fae5;color:#065f46}
  .cev-b-purple{background:#ede9fe;color:#5b21b6}
`;

/* ═══════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════ */
const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData]     = useState(initialForm);
  const [previewUrl, setPreviewUrl] = useState("");
  const [submitted, setSubmitted]   = useState(false);
  const [errors, setErrors]         = useState({});
  const [activeTab, setActiveTab]   = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userProfile } = useAuth();

  const minDate = useMemo(() => new Date().toISOString().split("T")[0], []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") { setFormData(p => ({ ...p, [name]: checked })); return; }
    if (type === "file") {
      const file = files?.[0] || null;
      setFormData(p => ({ ...p, image: file }));
      setPreviewUrl(file ? URL.createObjectURL(file) : "");
      return;
    }
    setFormData(p => ({ ...p, [name]: value }));
  };

  const validate = () => {
    const e = {};
    if (!formData.title.trim())            e.title            = "Event title is required";
    if (!formData.category)                e.category         = "Please select a category";
    if (!formData.date)                    e.date             = "Event date is required";
    if (!formData.time)                    e.time             = "Event time is required";
    if (!formData.location.trim())         e.location         = "Location is required";
    if (!formData.shortDescription.trim()) e.shortDescription = "Short description is required";
    if (!formData.description.trim())      e.description      = "Full description is required";
    if (formData.enableDonation && !formData.donationGoal) e.donationGoal = "Enter donation goal";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) { window.scrollTo({ top:0, behavior:"smooth" }); return; }
    if (!userProfile?.schoolId) { toast.error("Account not associated with a school."); return; }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      const map = {
        Title: formData.title, Category: formData.category,
        Date: new Date(formData.date).toISOString(), Time: formData.time,
        Location: formData.location, Venue: formData.venue||"",
        ShortDescription: formData.shortDescription, Description: formData.description,
        YoutubeLink: formData.youtubeLink||"", IsFree: formData.isFree,
        ParticipationDetails: formData.participationDetails||"", EnableTickets: false,
        EnableDonation: formData.enableDonation, DonationGoal: formData.donationGoal||0,
        DonationDescription: formData.donationDescription||"", IsFeatured: formData.isFeatured,
        ContactEmail: formData.contactEmail||"", ContactPhone: formData.contactPhone||"",
        AgeRestriction: formData.ageRestriction||"", ParkingAvailable: formData.parkingAvailable,
        FoodAvailable: formData.foodAvailable, WheelchairAccessible: formData.wheelchairAccessible,
        SchoolId: userProfile.schoolId,
      };
      Object.entries(map).forEach(([k,v]) => fd.append(k, v));
      if (formData.image) fd.append("ImageFile", formData.image);
      await ApiEvent.createEvent(fd);
      toast.success("Event created successfully!");
      setSubmitted(true);
      setTimeout(() => navigate("/school-admin/events"), 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create event");
    } finally { setIsSubmitting(false); }
  };

  const getCategoryLabel = (v) => categories.find(c => c.value === v)?.label || "";

  const Field = ({ label, required, error, hint, children }) => (
    <div className="cev-field">
      <label className="cev-label">{label}{required && <span className="cev-req"> *</span>}</label>
      {children}
      {error && <p className="cev-errmsg"><AlertCircle size={11}/>  {error}</p>}
      {hint && !error && <p className="cev-hint">{hint}</p>}
    </div>
  );

  return (
    <div className="cev">
      <style>{styles}</style>

      {/* ── HEAD ── */}
      <div className="cev-head">
        <div>
          <h1 className="cev-title">Create New Event</h1>
          <p className="cev-sub">Fill in the details below to create a new school event.</p>
        </div>
        <div className="cev-head-badges">
          <span className="cev-preview-badge cev-b-blue">Draft</span>
          <span className="cev-preview-badge cev-b-orange">Pending Approval</span>
        </div>
      </div>

      {/* ── SUCCESS BANNER ── */}
      {submitted && (
        <div className="cev-success">
          <div className="cev-success-ico"><CheckCircle size={20} strokeWidth={2.5}/></div>
          <div>
            <p className="cev-success-title">Event created successfully!</p>
            <p className="cev-success-sub">Submitted for approval. Redirecting to events list…</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="cev-layout">

          {/* ── MAIN FORM ── */}
          <div className="cev-main">

            {/* Tab nav */}
            <div className="cev-tabs">
              {TABS.map(({ id, label, icon:Icon }) => (
                <button key={id} type="button" className={`cev-tab ${activeTab===id?"active":""}`} onClick={()=>setActiveTab(id)}>
                  <Icon size={13} strokeWidth={2.2}/>{label}
                </button>
              ))}
            </div>

            {/* ─── BASIC INFO ─── */}
            {activeTab === "basic" && (
              <div className="cev-card">
                <p className="cev-card-title">Basic Information</p>
                <div className="cev-grid">
                  <div className="cev-col2">
                    <Field label="Event Title" required error={errors.title}>
                      <input className={`cev-input ${errors.title?"err":""}`} name="title" value={formData.title} onChange={handleChange} placeholder="Enter a descriptive event title"/>
                    </Field>
                  </div>
                  <Field label="Category" required error={errors.category}>
                    <select className={`cev-input ${errors.category?"err":""}`} name="category" value={formData.category} onChange={handleChange}>
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Location" required error={errors.location}>
                    <input className={`cev-input ${errors.location?"err":""}`} name="location" value={formData.location} onChange={handleChange} placeholder="City or area"/>
                  </Field>
                  <Field label="Venue Name">
                    <input className="cev-input" name="venue" value={formData.venue} onChange={handleChange} placeholder="e.g. Main Hall, Sports Ground"/>
                  </Field>
                  <Field label="Start Date" required error={errors.date}>
                    <input type="date" className={`cev-input ${errors.date?"err":""}`} name="date" min={minDate} value={formData.date} onChange={handleChange}/>
                  </Field>
                  <Field label="Start Time" required error={errors.time}>
                    <input type="time" className={`cev-input ${errors.time?"err":""}`} name="time" value={formData.time} onChange={handleChange}/>
                  </Field>
                  <div className="cev-col2">
                    <Field label="Short Description" required error={errors.shortDescription} hint={`${formData.shortDescription.length}/150`}>
                      <input className={`cev-input ${errors.shortDescription?"err":""}`} name="shortDescription" value={formData.shortDescription} onChange={handleChange} placeholder="One-line summary (max 150 chars)" maxLength={150}/>
                    </Field>
                  </div>
                  <div className="cev-col2">
                    <Field label="Full Description" required error={errors.description}>
                      <textarea className={`cev-textarea ${errors.description?"err":""}`} name="description" value={formData.description} onChange={handleChange} rows={6} placeholder="Detailed info, schedule, highlights…"/>
                    </Field>
                  </div>
                </div>
              </div>
            )}

            {/* ─── MEDIA ─── */}
            {activeTab === "media" && (
              <div className="cev-card">
                <p className="cev-card-title">Media & Links</p>
                <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                  <div>
                    {previewUrl && <img src={previewUrl} alt="preview" className="cev-preview"/>}
                    <label className="cev-upload">
                      <input type="file" name="image" accept="image/*" onChange={handleChange}/>
                      <div className="cev-upload-ico"><ImagePlus size={20} strokeWidth={1.8}/></div>
                      <p style={{ fontSize:13, fontWeight:600, color:"#374151", margin:"0 0 4px" }}>
                        {previewUrl ? "Change banner image" : "Upload event banner"}
                      </p>
                      <p style={{ fontSize:11.5, color:"#9ca3af", margin:0 }}>PNG, JPG, WEBP — up to 5 MB</p>
                    </label>
                  </div>
                  <Field label="YouTube / Live Stream Link" hint="Embed a YouTube video or live stream link">
                    <div style={{ position:"relative" }}>
                      <Link2 size={14} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:"#9ca3af", pointerEvents:"none" }}/>
                      <input className="cev-input" style={{ paddingLeft:34 }} name="youtubeLink" value={formData.youtubeLink} onChange={handleChange} placeholder="https://youtube.com/embed/…"/>
                    </div>
                  </Field>
                </div>
              </div>
            )}

            {/* ─── PARTICIPATION ─── */}
            {activeTab === "tickets" && (
              <div className="cev-card">
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18, flexWrap:"wrap", gap:10 }}>
                  <div>
                    <p className="cev-card-title" style={{ margin:0 }}>Participation & Ticketing</p>
                    <p style={{ fontSize:12.5, color:"#9ca3af", margin:"4px 0 0" }}>Configure how attendees can join this event.</p>
                  </div>
                  <span className="cev-coming"><span className="cev-pulse"/><Ticket size={11} strokeWidth={2.5}/>Online Ticketing Coming Soon</span>
                </div>

                <p className="cev-sec">Access Type</p>
                <div className="cev-access-row" style={{ marginBottom:18 }}>
                  <label className={`cev-access-opt ${formData.isFree?"free":""}`}>
                    <input type="radio" style={{ display:"none" }} checked={formData.isFree===true} onChange={()=>setFormData(p=>({...p,isFree:true}))}/>
                    <div className="cev-access-icon" style={{ background: formData.isFree?"#dbeafe":"#f3f4f6" }}>🆓</div>
                    <div>
                      <p style={{ fontSize:13, fontWeight:700, color: formData.isFree?"#1e40af":"#374151", margin:0 }}>Free Event</p>
                      <p style={{ fontSize:11, color:"#9ca3af", margin:"2px 0 0" }}>No fees required</p>
                    </div>
                  </label>
                  <label className={`cev-access-opt ${!formData.isFree?"paid":""}`}>
                    <input type="radio" style={{ display:"none" }} checked={formData.isFree===false} onChange={()=>setFormData(p=>({...p,isFree:false}))}/>
                    <div className="cev-access-icon" style={{ background: !formData.isFree?"#ffedd5":"#f3f4f6" }}>🎟️</div>
                    <div>
                      <p style={{ fontSize:13, fontWeight:700, color: !formData.isFree?"#9a3412":"#374151", margin:0 }}>Paid / RSVP</p>
                      <p style={{ fontSize:11, color:"#9ca3af", margin:"2px 0 0" }}>Requires payment</p>
                    </div>
                  </label>
                </div>

                <Field label="Participation & Joining Instructions" hint="Explain how users can join or purchase tickets offline.">
                  <textarea
                    className="cev-textarea" name="participationDetails"
                    value={formData.participationDetails}
                    onChange={e=>setFormData(p=>({...p,participationDetails:e.target.value}))}
                    rows={5}
                    placeholder={formData.isFree
                      ? "e.g., Open to everyone. Just show up at the venue!"
                      : "e.g., Tickets can be purchased at the school office for LKR 1,000 per person."
                    }
                  />
                </Field>
              </div>
            )}

            {/* ─── DONATION ─── */}
            {activeTab === "donation" && (
              <div className="cev-card">
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18 }}>
                  <p className="cev-card-title" style={{ margin:0 }}>Donation Campaign</p>
                  <label className={`cev-featured-toggle ${formData.enableDonation?"on":""}`} style={{ width:"auto", padding:"8px 14px" }}>
                    <input type="checkbox" name="enableDonation" checked={formData.enableDonation} onChange={handleChange} style={{ display:"none" }}/>
                    <span style={{ fontSize:12.5, fontWeight:700, color: formData.enableDonation?"#b45309":"#6b7280", marginRight:10 }}>Enable Donations</span>
                    <div className={`cev-toggle-track ${formData.enableDonation?"on":""}`}><div className={`cev-toggle-thumb ${formData.enableDonation?"on":""}`}/></div>
                  </label>
                </div>

                {formData.enableDonation ? (
                  <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                    <Field label="Fundraising Goal (LKR)" required error={errors.donationGoal}>
                      <input type="number" className={`cev-input ${errors.donationGoal?"err":""}`} name="donationGoal" value={formData.donationGoal} onChange={handleChange} placeholder="e.g. 500000"/>
                    </Field>
                    <Field label="Campaign Description">
                      <textarea className="cev-textarea" name="donationDescription" value={formData.donationDescription} onChange={handleChange} rows={3} placeholder="Explain how donations will be used…"/>
                    </Field>
                  </div>
                ) : (
                  <div className="cev-donation-off">
                    <Heart size={32} strokeWidth={1.5} color="#d1d5db" style={{ margin:"0 auto 10px" }}/>
                    <p style={{ fontSize:13.5, fontWeight:700, color:"#9ca3af", margin:"0 0 4px" }}>Donations disabled</p>
                    <p style={{ fontSize:12, color:"#c4c4c4", margin:0 }}>Toggle the switch above to enable a donation campaign</p>
                  </div>
                )}
              </div>
            )}

            {/* ─── VENUE ─── */}
            {activeTab === "venue" && (
              <div className="cev-card">
                <p className="cev-card-title">Venue & Contact</p>
                <div className="cev-grid">
                  <Field label="Contact Email">
                    <input type="email" className="cev-input" name="contactEmail" value={formData.contactEmail} onChange={handleChange} placeholder="event@school.lk"/>
                  </Field>
                  <Field label="Contact Phone">
                    <input type="tel" className="cev-input" name="contactPhone" value={formData.contactPhone} onChange={handleChange} placeholder="+94 XX XXX XXXX"/>
                  </Field>
                  <div className="cev-col2">
                    <Field label="Age Restriction">
                      <select className="cev-input" name="ageRestriction" value={formData.ageRestriction} onChange={handleChange}>
                        <option value="">No restriction</option>
                        <option value="All ages welcome">All ages welcome</option>
                        <option value="Ages 12+">Ages 12+</option>
                        <option value="Ages 16+">Ages 16+</option>
                        <option value="Ages 18+">Ages 18+</option>
                      </select>
                    </Field>
                  </div>
                </div>
                <p className="cev-sec">Facilities</p>
                <div className="cev-fac-row">
                  {[
                    { name:"parkingAvailable",    icon:<ParkingSquare size={14} strokeWidth={2}/>,   label:"Parking Available" },
                    { name:"foodAvailable",        icon:<UtensilsCrossed size={14} strokeWidth={2}/>, label:"Food & Beverages" },
                    { name:"wheelchairAccessible", icon:<Accessibility size={14} strokeWidth={2}/>,   label:"Wheelchair Accessible" },
                  ].map(({ name, icon, label }) => (
                    <label key={name} className={`cev-fac-opt ${formData[name]?"on":""}`}>
                      <input type="checkbox" name={name} checked={!!formData[name]} onChange={handleChange} style={{ display:"none" }}/>
                      {icon}{label}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <div className="cev-sidebar">

            {/* Publish status */}
            <div className="cev-status-card">
              <p className="cev-card-title" style={{ marginBottom:14 }}>Publish Settings</p>

              {/* Featured toggle */}
              <label className={`cev-featured-toggle ${formData.isFeatured?"on":""}`}>
                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} style={{ display:"none" }}/>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <Star size={15} strokeWidth={2.2} color={formData.isFeatured?"#d97706":"#9ca3af"}/>
                  <span style={{ fontSize:12.5, fontWeight:700, color: formData.isFeatured?"#b45309":"#374151" }}>Request to be Featured</span>
                </div>
                <div className={`cev-toggle-track ${formData.isFeatured?"on":""}`}><div className={`cev-toggle-thumb ${formData.isFeatured?"on":""}`}/></div>
              </label>

              <div className="cev-status-item" style={{ background:"#eff6ff" }}>
                <div className="cev-status-item-head" style={{ color:"#2563eb" }}>
                  <FileText size={13} strokeWidth={2.2}/>Submission Status
                </div>
                <p className="cev-status-item-title">Sent for approval</p>
                <p className="cev-status-item-sub">Events need admin review before going live</p>
              </div>
              <div className="cev-status-item" style={{ background:"#ecfdf5" }}>
                <div className="cev-status-item-head" style={{ color:"#059669" }}>
                  <Eye size={13} strokeWidth={2.2}/>Visibility
                </div>
                <p className="cev-status-item-title">Public after approval</p>
                <p className="cev-status-item-sub">Visible to all users once approved</p>
              </div>
            </div>

            {/* Quick preview */}
            <div className="cev-preview-card">
              <p className="cev-card-title" style={{ marginBottom:14 }}>Preview</p>
              {previewUrl
                ? <img src={previewUrl} alt="" className="cev-preview-img"/>
                : <div className="cev-preview-ph"><ImagePlus size={28} strokeWidth={1.5}/></div>
              }
              <div style={{ marginBottom:8 }}>
                {formData.category && <span className="cev-preview-badge cev-b-orange">{getCategoryLabel(formData.category)}</span>}
                {formData.enableDonation && <span className="cev-preview-badge cev-b-green">Donations</span>}
              </div>
              <p className="cev-preview-name">{formData.title || "Event Title"}</p>
              <p className="cev-preview-meta">
                {formData.location||"Location"}{formData.date ? ` · ${formData.date}` : ""}
              </p>
              <p className="cev-preview-desc">{formData.shortDescription||"Short description preview…"}</p>
            </div>

            {/* Actions */}
            <div className="cev-actions">
              <button type="submit" className="cev-btn-submit" disabled={isSubmitting}>
                {isSubmitting
                  ? <><div className="cev-spin"/>Submitting…</>
                  : <><Send size={15} strokeWidth={2.5}/>Submit for Approval</>
                }
              </button>
              <button type="button" className="cev-btn-outline" onClick={()=>{ setSubmitted(true); setTimeout(()=>setSubmitted(false),3000); }}>
                <Save size={14} strokeWidth={2.5}/>Save as Draft
              </button>
              <button type="button" className="cev-btn-ghost" onClick={()=>{ setFormData(initialForm); setPreviewUrl(""); setErrors({}); setSubmitted(false); }}>
                <RotateCcw size={14} strokeWidth={2.5}/>Reset Form
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;