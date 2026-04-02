import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ApiDonation from "../../services/ApiDonation";
import ApiSchool from "../../services/ApiSchool";
import {
  Heart, TrendingUp, Calendar, MapPin, Phone, Mail, Globe,
  Users, Copy, Check, ArrowLeft, ChevronRight, Clock,
  Share2, BookOpen, Building2, Zap, Image, X, CheckCircle,
  Landmark, Globe2, GraduationCap, Megaphone, Star,
  ShieldCheck, ArrowRight, Sparkles
} from "lucide-react";

/* ── helpers ── */
const formatDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};
const formatCurrency = (n) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(n || 0);

const CATEGORY_META = {
  Education:        { color: "#2563eb", bg: "#eff6ff" },
  Infrastructure:   { color: "#7c3aed", bg: "#f5f3ff" },
  Sports:           { color: "#059669", bg: "#ecfdf5" },
  "Student Support":{ color: "#d97706", bg: "#fffbeb" },
};
const getCatMeta = (c) => CATEGORY_META[c] || { color: "#6b7280", bg: "#f9fafb" };

/* ── Skeleton ── */
const Skeleton = ({ h = 20, r = 8 }) => (
  <div style={{
    height: h, borderRadius: r,
    background: "linear-gradient(90deg,#f3f4f6 25%,#e9eaec 50%,#f3f4f6 75%)",
    backgroundSize: "200% 100%", animation: "shimmer 1.6s infinite",
  }} />
);

/* ── Progress bar ── */
const ProgressBar = ({ pct, color = "var(--color-primary,#4f46e5)" }) => (
  <div style={{ height: 6, borderRadius: 50, background: "#f3f4f6", overflow: "hidden" }}>
    <div style={{
      height: "100%", borderRadius: 50, width: `${Math.min(pct, 100)}%`,
      background: color, transition: "width 0.6s",
    }} />
  </div>
);

/* ── Card wrapper ── */
const Card = ({ children, style = {} }) => (
  <div style={{
    background: "#fff", borderRadius: 20, border: "1px solid #f0f0f0",
    padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    ...style,
  }}>
    {children}
  </div>
);

/* ── Section head ── */
const SectionHead = ({ label, title, sub }) => (
  <div style={{ marginBottom: 20 }}>
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

/* ── Empty state ── */
const Empty = ({ icon: Icon, msg }) => (
  <div style={{ textAlign: "center", padding: "40px 24px" }}>
    <div style={{ width: 52, height: 52, borderRadius: 14, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
      <Icon size={22} color="#9ca3af" strokeWidth={1.8} />
    </div>
    <p style={{ fontSize: 14, color: "#9ca3af", fontWeight: 500, margin: 0 }}>{msg}</p>
  </div>
);

/* ── Lightbox ── */
const Lightbox = ({ image, onClose }) => {
  useEffect(() => {
    const handle = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
    >
      <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }} onClick={e => e.stopPropagation()}>
        <img src={image} alt="Full view" style={{ maxWidth: "100%", maxHeight: "90vh", objectFit: "contain", borderRadius: 16 }} />
        <button
          onClick={onClose}
          style={{ position: "absolute", top: -14, right: -14, width: 36, height: 36, borderRadius: "50%", border: "none", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
        >
          <X size={16} strokeWidth={2.5} color="#374151" />
        </button>
      </div>
    </div>
  );
};

/* ── Share section ── */
const ShareSection = ({ campaign }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl  = window.location.href;
  const shareText = `Support ${campaign?.schoolName || "the school"}'s campaign: ${campaign?.title || ""}`;

  const copy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socials = [
    { label: "Facebook", color: "#1877f2", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { label: "Twitter",  color: "#1da1f2", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}` },
    { label: "WhatsApp", color: "#25d366", href: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}` },
    { label: "LinkedIn", color: "#0a66c2", href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(campaign?.title || "")}` },
  ];

  return (
    <Card>
      <SectionHead label="Spread the Word" title="Share This Campaign" />
      <p style={{ fontSize: 13, color: "#6b7280", fontWeight: 500, marginBottom: 16 }}>
        Invite others to support this cause!
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {socials.map(({ label, color, href }) => (
          <a
            key={label} href={href} target="_blank" rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "10px 12px", borderRadius: 12, border: "none",
              background: color, color: "#fff",
              fontWeight: 700, fontSize: 13, textDecoration: "none",
              transition: "opacity 0.18s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            {label}
          </a>
        ))}
      </div>
      <div style={{ position: "relative" }}>
        <input
          type="text" readOnly value={shareUrl}
          style={{
            width: "100%", padding: "10px 88px 10px 14px",
            borderRadius: 12, border: "1.5px solid #e5e7eb",
            fontSize: 12, color: "#6b7280", fontFamily: "monospace",
            outline: "none", boxSizing: "border-box",
          }}
        />
        <button
          onClick={copy}
          style={{
            position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)",
            display: "flex", alignItems: "center", gap: 4,
            padding: "6px 12px", borderRadius: 9, border: "none",
            background: copied ? "#059669" : "var(--color-primary,#4f46e5)",
            color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer",
            fontFamily: "inherit", transition: "background 0.2s",
          }}
        >
          {copied ? <><Check size={12} strokeWidth={2.5} />Copied</> : <><Copy size={12} strokeWidth={2.5} />Copy</>}
        </button>
      </div>
    </Card>
  );
};

/* ── Bank details ── */
const BankDetails = ({ campaign }) => {
  const [copiedField, setCopiedField] = useState(null);

  const copy = (val, field) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const copyAll = () => {
    const text = [
      `Bank Name: ${campaign.bankName || "N/A"}`,
      `Account Name: ${campaign.accountName || "N/A"}`,
      `Account Number: ${campaign.accountNumber || "N/A"}`,
      `Branch: ${campaign.branch || "N/A"}`,
      `SWIFT Code: ${campaign.swiftCode || "N/A"}`,
      `Reference: Donation for ${campaign.title}`,
    ].join("\n");
    navigator.clipboard.writeText(text);
    setCopiedField("all");
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!campaign.accountNumber) {
    return (
      <div style={{ background: "#fffbeb", border: "1px solid #fef3c7", borderRadius: 16, padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Landmark size={16} color="#d97706" strokeWidth={2} />
          </div>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: "#0f0f0f", margin: "0 0 4px" }}>Bank Transfer</h3>
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
              Contact the school directly to receive verified bank account details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const fields = [
    { label: "Bank Name",      value: campaign.bankName,      field: "bankName"      },
    { label: "Account Name",   value: campaign.accountName,   field: "accountName"   },
    { label: "Account Number", value: campaign.accountNumber, field: "accountNumber" },
    { label: "Branch",         value: campaign.branch,        field: "branch"        },
    { label: "SWIFT Code",     value: campaign.swiftCode,     field: "swiftCode"     },
  ];

  return (
    <Card>
      <SectionHead label="Bank Transfer" title="Account Details" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {fields.map(({ label, value, field }) => value ? (
          <div
            key={field}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "11px 14px", borderRadius: 12, background: "#f9fafb",
              border: "1px solid #f0f0f0",
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 13.5, color: "#374151", fontWeight: field === "accountNumber" || field === "swiftCode" ? 700 : 600, fontFamily: field === "accountNumber" || field === "swiftCode" ? "monospace" : "inherit" }}>
                {value}
              </div>
            </div>
            <button
              onClick={() => copy(value, field)}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "5px 12px", borderRadius: 8, border: "none",
                background: copiedField === field ? "#d1fae5" : "color-mix(in srgb,var(--color-primary,#4f46e5) 8%,transparent)",
                color: copiedField === field ? "#059669" : "var(--color-primary,#4f46e5)",
                fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {copiedField === field ? <><Check size={11} strokeWidth={2.5} />Copied</> : <><Copy size={11} strokeWidth={2.5} />Copy</>}
            </button>
          </div>
        ) : null)}
      </div>
      <button
        onClick={copyAll}
        style={{
          width: "100%", padding: "11px", borderRadius: 12, border: "none",
          background: copiedField === "all"
            ? "#059669"
            : "linear-gradient(135deg, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))",
          color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: "pointer",
          fontFamily: "inherit", transition: "background 0.2s",
          boxShadow: "0 4px 12px color-mix(in srgb,var(--color-primary,#4f46e5) 25%,transparent)",
        }}
      >
        {copiedField === "all" ? "All Details Copied!" : "Copy All Details"}
      </button>
      <div style={{ marginTop: 14, padding: "14px 16px", background: "#fffbeb", borderRadius: 12, border: "1px solid #fef3c7" }}>
        <p style={{ fontSize: 12.5, color: "#92400e", fontWeight: 600, margin: "0 0 6px" }}>Important Instructions</p>
        <ul style={{ fontSize: 12, color: "#78350f", lineHeight: 1.7, margin: 0, paddingLeft: 16 }}>
          <li>Include your name and <strong>"Donation for {campaign.title}"</strong> in the reference.</li>
          <li>Send proof of payment to the school's development committee.</li>
          <li>Your contribution will be updated within 48–72 hours.</li>
        </ul>
      </div>
    </Card>
  );
};

/* ── Updates timeline ── */
const UpdatesTimeline = ({ updates }) => {
  if (!updates?.length) return null;
  return (
    <Card>
      <SectionHead label="Updates" title={`Campaign Updates (${updates.length})`} />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {updates.map((u, i) => (
          <div
            key={u.id || i}
            style={{ position: "relative", paddingLeft: 20, borderLeft: "2.5px solid var(--color-primary,#4f46e5)", paddingBottom: i < updates.length - 1 ? 4 : 0 }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 6 }}>
              <h4 style={{ fontSize: 14.5, fontWeight: 800, color: "#0f0f0f", margin: 0 }}>{u.title}</h4>
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#9ca3af", fontWeight: 500, flexShrink: 0 }}>
                <Clock size={11} strokeWidth={2} />{formatDate(u.date)}
              </span>
            </div>
            <p style={{ fontSize: 13.5, color: "#4b5563", lineHeight: 1.7, margin: "0 0 6px" }}>{u.message}</p>
            <span style={{ fontSize: 12, color: "var(--color-primary,#4f46e5)", fontWeight: 600 }}>By {u.authorName || "Organizer"}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

/* ── School contact sidebar card ── */
const SchoolContactCard = ({ contact, schoolName }) => {
  if (!contact || (!contact.address && !contact.phone && !contact.email && !contact.website)) return null;

  return (
    <Card>
      <h2 style={{ fontSize: 14, fontWeight: 800, color: "#0f0f0f", margin: "0 0 16px" }}>School Contact</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { icon: MapPin, val: [contact.address, contact.city, contact.district].filter(Boolean).join(", ") || null },
          { icon: Phone,  val: contact.phone   || null },
          { icon: Mail,   val: contact.email   || null },
          { icon: Globe,  val: contact.website || null },
        ].filter(({ val }) => val).map(({ icon: Icon, val }, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "color-mix(in srgb,var(--color-primary,#4f46e5) 8%,transparent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={12} color="var(--color-primary,#4f46e5)" strokeWidth={2} />
            </div>
            <span style={{ fontSize: 13, color: "#374151", fontWeight: 500, lineHeight: 1.55 }}>{val}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

/* ═══════════════════════════════════
   DONATION DETAILS PAGE
═══════════════════════════════════ */
const DonationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign,         setCampaign]         = useState(null);
  const [schoolContact,    setSchoolContact]     = useState(null);
  const [loading,          setLoading]           = useState(true);
  const [error,            setError]             = useState(null);
  const [relatedCampaigns, setRelatedCampaigns]  = useState([]);
  const [selectedImage,    setSelectedImage]     = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [detailsRes, relatedRes] = await Promise.all([
          ApiDonation.getDonation(id),
          ApiDonation.getDonations({ pageSize: 4 }),
        ]);
        const data = detailsRes.data;
        setCampaign(data);
        if (relatedRes.data) {
          setRelatedCampaigns(relatedRes.data.filter(c => c.id !== id).slice(0, 3));
        }
        if (data?.schoolId) {
          try {
            const schoolRes = await ApiSchool.getSchool(data.schoolId);
            if (schoolRes.data?.contact) setSchoolContact(schoolRes.data.contact);
          } catch {}
        }
        setError(null);
      } catch {
        setError("Campaign not found or failed to load.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
          .dd-page * { box-sizing: border-box; }
          .dd-page { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}</style>
        <div className="dd-page" style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}>
          <Skeleton h={320} r={24} />
          <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Skeleton h={200} r={20} /><Skeleton h={160} r={20} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Skeleton h={180} r={20} /><Skeleton h={140} r={20} />
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ── Error ── */
  if (error || !campaign) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          .dd-page * { box-sizing: border-box; }
          .dd-page { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}</style>
        <div className="dd-page" style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Heart size={32} color="#9ca3af" strokeWidth={1.5} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f0f0f", margin: "0 0 10px" }}>{error || "Campaign Not Found"}</h1>
          <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>The campaign you're looking for could not be loaded.</p>
          <button
            onClick={() => navigate("/donations")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "12px 24px", borderRadius: 50, border: "none",
              background: "linear-gradient(135deg, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))",
              color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            <ArrowLeft size={15} strokeWidth={2.5} /> Return to Donations
          </button>
        </div>
      </>
    );
  }

  const catMeta  = getCatMeta(campaign.category);
  const pct      = campaign.goalAmount > 0 ? Math.min(100, Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)) : 0;
  const daysLeft = campaign.expiryDate
    ? Math.max(0, Math.ceil((new Date(campaign.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        .dd-page * { box-sizing: border-box; }
        .dd-page { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      <div className="dd-page" style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* ═══ BREADCRUMB ═══ */}
        <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#9ca3af", fontWeight: 500, marginBottom: 24 }}>
          <Link to="/"          style={{ color: "#9ca3af", textDecoration: "none", fontWeight: 600 }} onMouseEnter={e => e.currentTarget.style.color = "var(--color-primary,#4f46e5)"} onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}>Home</Link>
          <ChevronRight size={13} strokeWidth={2} />
          <Link to="/donations" style={{ color: "#9ca3af", textDecoration: "none", fontWeight: 600 }} onMouseEnter={e => e.currentTarget.style.color = "var(--color-primary,#4f46e5)"} onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}>Donations</Link>
          <ChevronRight size={13} strokeWidth={2} />
          <span style={{ color: "#374151", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220 }}>{campaign.title}</span>
        </nav>

        {/* ═══ HERO ═══ */}
        <div style={{
          position: "relative", borderRadius: 24, overflow: "hidden",
          marginBottom: 32, boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          animation: "fadeUp 0.6s ease both",
        }}>
          <div style={{ height: 380, position: "relative", overflow: "hidden" }}>
            {campaign.image
              ? <img src={campaign.image} alt={campaign.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #1e1b4b, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))" }}>
                  <div style={{ position: "absolute", top: -80, right: -80, width: 360, height: 360, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                  <div style={{ position: "absolute", bottom: -60, left: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
                </div>
            }
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.1) 100%)" }} />
          </div>

          {/* Overlay content */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "36px 40px", color: "#fff" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 12, fontWeight: 700,
                color: catMeta.color, background: catMeta.bg,
                padding: "4px 11px", borderRadius: 50,
              }}>{campaign.category}</span>
              {campaign.isFeatured && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 800, color: "#92400e", background: "#fef3c7", padding: "4px 10px", borderRadius: 50 }}>
                  <Star size={11} strokeWidth={2.5} /> Featured
                </span>
              )}
              {daysLeft !== null && daysLeft <= 10 && daysLeft > 0 && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 800, color: "#991b1b", background: "#fee2e2", padding: "4px 10px", borderRadius: 50 }}>
                  <Clock size={11} strokeWidth={2.5} /> Ending Soon
                </span>
              )}
            </div>
            <h1 style={{ fontSize: "clamp(22px,3.5vw,44px)", fontWeight: 900, letterSpacing: "-0.8px", lineHeight: 1.12, margin: "0 0 20px" }}>
              {campaign.title}
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 28px" }}>
              {[
                { icon: GraduationCap, val: campaign.schoolName   },
                { icon: Calendar,      val: daysLeft !== null ? (daysLeft > 0 ? `${daysLeft} days left` : "Ended") : "No deadline" },
              ].map(({ icon: Icon, val }, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
                  <Icon size={15} strokeWidth={2} color="rgba(255,255,255,0.55)" />{val}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ CONTENT + SIDEBAR ═══ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>

          {/* ── MAIN ── */}
          <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Gallery image + thumbnails */}
            {campaign.gallery?.length > 0 && (
              <Card style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 3 }}>
                  {campaign.gallery.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedImage(img)}
                      style={{ position: "relative", aspectRatio: "1", overflow: "hidden", cursor: "pointer" }}
                      onMouseEnter={e => { e.currentTarget.querySelector(".ov").style.opacity = "1"; }}
                      onMouseLeave={e => { e.currentTarget.querySelector(".ov").style.opacity = "0"; }}
                    >
                      <img src={img} alt={`Gallery ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.07)"}
                        onMouseLeave={e => e.currentTarget.style.transform = ""}
                      />
                      <div className="ov" style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.25s" }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Image size={16} color="#fff" strokeWidth={2} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* About */}
            <Card>
              <SectionHead label="About" title="About This Campaign" />
              <p style={{ fontSize: 14.5, color: "#374151", lineHeight: 1.85, margin: 0, whiteSpace: "pre-line" }}>
                {campaign.longDescription || campaign.description}
              </p>
              {campaign.impact && (
                <div style={{
                  marginTop: 20, padding: "16px 18px", borderRadius: 14,
                  background: "color-mix(in srgb,var(--color-primary,#4f46e5) 5%,transparent)",
                  border: "1px solid color-mix(in srgb,var(--color-primary,#4f46e5) 12%,transparent)",
                }}>
                  <p style={{ fontSize: 11.5, fontWeight: 800, color: "var(--color-primary,#4f46e5)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>Expected Impact</p>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.75, margin: 0 }}>{campaign.impact}</p>
                </div>
              )}
            </Card>

            {/* Bank Details (full width in main column) */}
            <BankDetails campaign={campaign} />

            {/* Updates */}
            {campaign.updates?.length > 0 && <UpdatesTimeline updates={campaign.updates} />}
          </div>

          {/* ── SIDEBAR ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 24 }}>

            {/* Fundraising progress */}
            <div style={{
              borderRadius: 20,
              background: "linear-gradient(135deg, color-mix(in srgb,var(--color-primary,#4f46e5) 8%,#fff), color-mix(in srgb,var(--color-secondary,#7c3aed) 5%,#fff))",
              border: "1px solid color-mix(in srgb,var(--color-primary,#4f46e5) 14%,transparent)",
              padding: "24px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 16 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
                  color: "var(--color-primary,#4f46e5)",
                  background: "color-mix(in srgb,var(--color-primary,#4f46e5) 9%,transparent)",
                  padding: "4px 10px", borderRadius: 50,
                }}>
                  <TrendingUp size={11} strokeWidth={2.5} /> Goal
                </span>
              </div>

              <div style={{ fontSize: 28, fontWeight: 900, color: "var(--color-primary,#4f46e5)", letterSpacing: "-0.5px", marginBottom: 4 }}>
                {formatCurrency(campaign.goalAmount)}
              </div>
              <p style={{ fontSize: 12.5, color: "#6b7280", fontWeight: 500, margin: "0 0 16px" }}>Target amount for this campaign</p>

              <ProgressBar pct={pct} color={pct >= 100 ? "#059669" : "var(--color-primary,#4f46e5)"} />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Raised: {formatCurrency(campaign.raisedAmount || 0)}</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: pct >= 100 ? "#059669" : "var(--color-primary,#4f46e5)" }}>{pct}%</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { icon: Users,    label: "Donors",    val: `${campaign.donorsCount || 0} donors` },
                  { icon: Calendar, label: "Time Left",  val: daysLeft !== null ? (daysLeft > 0 ? `${daysLeft} days` : "Ended") : "No deadline" },
                  { icon: Clock,    label: "Deadline",   val: campaign.expiryDate ? formatDate(campaign.expiryDate) : "Open-ended" },
                ].map(({ icon: Icon, label, val }, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6b7280", fontWeight: 500 }}>
                      <div style={{ width: 26, height: 26, borderRadius: 8, background: "color-mix(in srgb,var(--color-primary,#4f46e5) 10%,transparent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={12} color="var(--color-primary,#4f46e5)" strokeWidth={2} />
                      </div>
                      {label}
                    </div>
                    <span style={{ fontSize: 13.5, fontWeight: 800, color: "#0f0f0f" }}>{val}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => navigate(`/schools/${campaign.schoolId}`)}
                style={{
                  width: "100%", marginTop: 18, padding: "11px 16px", borderRadius: 12,
                  border: "1.5px solid color-mix(in srgb,var(--color-primary,#4f46e5) 25%,transparent)",
                  background: "color-mix(in srgb,var(--color-primary,#4f46e5) 6%,transparent)",
                  color: "var(--color-primary,#4f46e5)", fontWeight: 700, fontSize: 13.5,
                  cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  transition: "all 0.18s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--color-primary,#4f46e5)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "color-mix(in srgb,var(--color-primary,#4f46e5) 6%,transparent)"; e.currentTarget.style.color = "var(--color-primary,#4f46e5)"; }}
              >
                <GraduationCap size={14} strokeWidth={2.2} /> View School Profile
              </button>
            </div>

            {/* School contact */}
            <SchoolContactCard contact={schoolContact} schoolName={campaign.schoolName} />

            {/* Share */}
            <ShareSection campaign={campaign} />
          </div>
        </div>

        {/* ═══ RELATED CAMPAIGNS ═══ */}
        {relatedCampaigns.length > 0 && (
          <section style={{ marginTop: 56, paddingTop: 40, borderTop: "1px solid #f0f0f0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f0f0f", letterSpacing: "-0.4px", margin: "0 0 4px" }}>More Campaigns</h2>
                <p style={{ fontSize: 13.5, color: "#6b7280", margin: 0, fontWeight: 500 }}>Support other schools across Sri Lanka</p>
              </div>
              <button
                onClick={() => navigate("/donations")}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  fontSize: 13, fontWeight: 700, color: "var(--color-primary,#4f46e5)",
                  background: "none", border: "none", cursor: "pointer", padding: "6px 0",
                }}
              >
                View all <ArrowRight size={15} strokeWidth={2.5} />
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
              {relatedCampaigns.map(r => {
                const rMeta = getCatMeta(r.category);
                const rPct  = r.goalAmount > 0 ? Math.min(100, Math.round((r.raisedAmount / r.goalAmount) * 100)) : 0;
                const rDays = r.expiryDate ? Math.max(0, Math.ceil((new Date(r.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))) : null;
                return (
                  <div
                    key={r.id}
                    onClick={() => navigate(`/donations/${r.id}`)}
                    style={{
                      background: "#fff", borderRadius: 18, border: "1px solid #f0f0f0",
                      overflow: "hidden", cursor: "pointer", transition: "all 0.25s",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; }}
                  >
                    <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
                      <img
                        src={r.image || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600"}
                        alt={r.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s" }}
                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                        onMouseLeave={e => e.currentTarget.style.transform = ""}
                      />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 55%)" }} />
                      <span style={{
                        position: "absolute", top: 12, left: 12,
                        fontSize: 11.5, fontWeight: 700,
                        color: rMeta.color, background: rMeta.bg,
                        padding: "4px 10px", borderRadius: 50,
                      }}>{r.category}</span>
                    </div>
                    <div style={{ padding: "16px 18px 18px" }}>
                      <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f0f0f", margin: "0 0 5px", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {r.title}
                      </h3>
                      <p style={{ fontSize: 12.5, color: "#9ca3af", fontWeight: 600, margin: "0 0 12px" }}>{r.schoolName}</p>
                      <ProgressBar pct={rPct} color={rPct >= 100 ? "#059669" : "var(--color-primary,#4f46e5)"} />
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                        <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>Goal: {formatCurrency(r.goalAmount)}</span>
                        {rDays !== null && <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>{rDays > 0 ? `${rDays}d left` : "Ended"}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>

      {/* ═══ LIGHTBOX ═══ */}
      {selectedImage && <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />}
    </>
  );
};

export default DonationDetails;