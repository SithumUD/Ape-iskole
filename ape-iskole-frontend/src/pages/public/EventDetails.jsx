import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ApiEvent from "../../services/ApiEvent";
import { toast } from "react-hot-toast";
import {
  Calendar, MapPin, Clock, School, Ticket, Heart, Share2,
  MessageCircle, Link2, Check,
  ChevronRight, AlignLeft, Zap, ArrowLeft, Mail, Phone,
  Users, ParkingCircle, UtensilsCrossed, Accessibility,
  UserCheck, Copy, X, CheckCircle, CreditCard, Smartphone,
  Building2, Minus, Plus, Star, Dumbbell, Trophy, Palette,
  Music, Microscope, BookOpen, GraduationCap, Sparkles,
  Newspaper, TrendingUp, Play
} from "lucide-react";

/* ── helpers ── */
const formatDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
};
const formatDateShort = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};
const formatTime = (t) => t || "";
const formatCurrency = (n) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(n || 0);

const CATEGORY_META = {
  Sports:      { icon: Dumbbell,      color: "#059669", bg: "#ecfdf5" },
  "Big Match": { icon: Trophy,        color: "#d97706", bg: "#fffbeb" },
  Art:         { icon: Palette,       color: "#7c3aed", bg: "#f5f3ff" },
  Carnival:    { icon: Sparkles,      color: "#db2777", bg: "#fdf2f8" },
  Achievement: { icon: Star,          color: "#2563eb", bg: "#eff6ff" },
  Education:   { icon: BookOpen,      color: "#2563eb", bg: "#eff6ff" },
  Cultural:    { icon: GraduationCap, color: "#7c3aed", bg: "#f5f3ff" },
  Concert:     { icon: Music,         color: "#059669", bg: "#ecfdf5" },
  Science:     { icon: Microscope,    color: "#0891b2", bg: "#ecfeff" },
  Academic:    { icon: BookOpen,      color: "#2563eb", bg: "#eff6ff" },
  News:        { icon: Newspaper,     color: "#6b7280", bg: "#f9fafb" },
};
const getCatMeta = (c) => CATEGORY_META[c] || CATEGORY_META.News;

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
    <div style={{ height: "100%", borderRadius: 50, width: `${Math.min(pct, 100)}%`, background: color, transition: "width 0.6s" }} />
  </div>
);

/* ── Card wrapper ── */
const Card = ({ children, style = {} }) => (
  <div style={{
    background: "#fff", borderRadius: 20, border: "1px solid #f0f0f0",
    padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", ...style,
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
    <h2 style={{ fontSize: 19, fontWeight: 800, color: "#0f0f0f", letterSpacing: "-0.3px", margin: 0 }}>{title}</h2>
    {sub && <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4, fontWeight: 500 }}>{sub}</p>}
  </div>
);

/* ── Tab config ── */
const buildTabs = (event) => [
  { id: "details",  label: "Details",  icon: AlignLeft },
  ...(event.enableTickets  ? [{ id: "tickets",  label: "Tickets",  icon: Ticket  }] : []),
  ...(event.enableDonation ? [{ id: "donation", label: "Support",  icon: Heart   }] : []),
];

/* ── Share section ── */
const ShareSection = ({ event }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl  = window.location.href;
  const shareText = `Join us at ${event.title} at ${event.schoolName} on ${formatDateShort(event.date)}`;

  const copy = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socials = [
    { label: "Facebook",  color: "#1877f2", icon: MessageCircle,   href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { label: "Twitter",   color: "#1da1f2", icon: MessageCircle,    href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}` },
    { label: "WhatsApp",  color: "#25d366", icon: MessageCircle, href: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}` },
    { label: "LinkedIn",  color: "#0a66c2", icon: MessageCircle,   href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(event.title)}` },
  ];

  return (
    <Card>
      <SectionHead label="Spread the Word" title="Share This Event" />
      <p style={{ fontSize: 13, color: "#6b7280", fontWeight: 500, marginBottom: 16 }}>
        Invite friends and family to join this exciting event!
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
        {socials.map(({ label, color, icon: Icon, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
              padding: "10px 12px", borderRadius: 12, border: "none",
              background: color, color: "#fff",
              fontWeight: 700, fontSize: 13, textDecoration: "none",
              transition: "opacity 0.18s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            <Icon size={14} strokeWidth={2.5} />{label}
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
            color: "#fff", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit",
            transition: "background 0.2s",
          }}
        >
          {copied ? <><Check size={12} strokeWidth={2.5} />Copied</> : <><Copy size={12} strokeWidth={2.5} />Copy</>}
        </button>
      </div>
    </Card>
  );
};

/* ── Contact section for donation ── */
const ContactDetails = ({ contactEmail, contactPhone }) => {
  const [copiedField, setCopiedField] = useState(null);
  const copy = (val, field) => {
    if (!val) return;
    navigator.clipboard.writeText(val);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!contactEmail && !contactPhone) {
    return (
      <div style={{ background: "#fffbeb", border: "1px solid #fef3c7", borderRadius: 14, padding: "20px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Mail size={16} color="#d97706" strokeWidth={2} />
          </div>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: "#0f0f0f", margin: "0 0 4px" }}>Contact the School</h3>
            <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>Please reach out to the school directly to support this event.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {[
        { label: "Email", value: contactEmail, field: "email", icon: Mail  },
        { label: "Phone", value: contactPhone, field: "phone", icon: Phone },
      ].map(({ label, value, field, icon: Icon }) => value ? (
        <div key={field} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px", borderRadius: 12,
          background: "color-mix(in srgb,var(--color-primary,#4f46e5) 5%,transparent)",
          border: "1px solid color-mix(in srgb,var(--color-primary,#4f46e5) 12%,transparent)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <Icon size={14} color="var(--color-primary,#4f46e5)" strokeWidth={2} />
            <div>
              <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: 13.5, color: "#374151", fontWeight: 700 }}>{value}</div>
            </div>
          </div>
          <button
            onClick={() => copy(value, field)}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "5px 12px", borderRadius: 8, border: "none",
              background: copiedField === field ? "#d1fae5" : "#fff",
              color: copiedField === field ? "#059669" : "var(--color-primary,#4f46e5)",
              fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            {copiedField === field ? <><Check size={11} strokeWidth={2.5} />Copied</> : <><Copy size={11} strokeWidth={2.5} />Copy</>}
          </button>
        </div>
      ) : null)}
    </div>
  );
};

/* ═══════════════════════════════════
   EVENT DETAILS PAGE
═══════════════════════════════════ */
const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event,               setEvent]               = useState(null);
  const [loading,             setLoading]             = useState(true);
  const [error,               setError]               = useState(null);
  const [activeTab,           setActiveTab]           = useState("details");

  /* booking */
  const [selectedTicket,      setSelectedTicket]      = useState(null);
  const [showBookingModal,    setShowBookingModal]    = useState(false);
  const [showSuccessModal,    setShowSuccessModal]    = useState(false);
  const [bookingDetails,      setBookingDetails]      = useState(null);
  const [showPaymentStep,     setShowPaymentStep]     = useState(false);
  const [selectedPayment,     setSelectedPayment]     = useState("");
  const [quantity,            setQuantity]            = useState(1);
  const [formData,            setFormData]            = useState({ name: "", email: "", phone: "", nic: "", specialRequests: "" });

  /* donation */
  const [donationAmount,      setDonationAmount]      = useState("");
  const [showDonationModal,   setShowDonationModal]   = useState(false);
  const [donationStep2,       setDonationStep2]       = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await ApiEvent.getEvent(id);
        setEvent(res.data);
      } catch (e) {
        setError("Event not found or failed to load.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const totals = useMemo(() => {
    if (!event?.ticketTypes) return { capacity: 0, booked: 0 };
    return {
      capacity: event.ticketTypes.reduce((s, t) => s + t.totalQuantity, 0),
      booked:   event.ticketTypes.reduce((s, t) => s + (t.totalQuantity - t.availableQuantity), 0),
    };
  }, [event]);

  const openBooking = (ticket) => {
    setSelectedTicket(ticket);
    setQuantity(1);
    setFormData({ name: "", email: "", phone: "", nic: "", specialRequests: "" });
    setShowPaymentStep(false);
    setSelectedPayment("");
    setShowBookingModal(true);
  };

  const proceedToPayment = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    setShowPaymentStep(true);
  };

  const completePayment = () => {
    if (!selectedPayment) { toast.error("Please select a payment method"); return; }
    const booking = {
      ticketType: selectedTicket.name,
      quantity,
      totalPrice: selectedTicket.price * quantity,
      paymentMethod: selectedPayment,
      customerDetails: formData,
      eventTitle: event.title,
      eventDate: formatDate(event.date),
      bookingId: `BK${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    };
    setBookingDetails(booking);
    setShowBookingModal(false);
    setShowSuccessModal(true);
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
          .ed-page * { box-sizing: border-box; }
          .ed-page { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}</style>
        <div className="ed-page" style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}>
          <Skeleton h={380} r={24} />
          <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Skeleton h={56} r={18} /><Skeleton h={200} r={20} /><Skeleton h={180} r={20} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Skeleton h={200} r={20} /><Skeleton h={160} r={20} />
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ── Error ── */
  if (error || !event) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          .ed-page * { box-sizing: border-box; }
          .ed-page { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}</style>
        <div className="ed-page" style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Calendar size={32} color="#9ca3af" strokeWidth={1.5} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f0f0f", margin: "0 0 10px" }}>{error || "Event Not Found"}</h1>
          <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>The event you're looking for could not be loaded.</p>
          <button
            onClick={() => navigate("/events")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "12px 24px", borderRadius: 50, border: "none",
              background: "linear-gradient(135deg, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))",
              color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            <ArrowLeft size={15} strokeWidth={2.5} /> Return to Events
          </button>
        </div>
      </>
    );
  }

  const catMeta = getCatMeta(event.category);
  const CatIcon = catMeta.icon;
  const tabs    = buildTabs(event);
  const donationPct = event.enableDonation && event.donationGoal > 0
    ? Math.min(100, (event.donationRaised / event.donationGoal) * 100)
    : 0;

  const formatDateTimeRange = () => {
    const start = `${formatDate(event.date)}${event.time ? ` at ${formatTime(event.time)}` : ""}`;
    if (!event.endDate) return start;
    const endFmt = formatDate(event.endDate);
    return endFmt === formatDate(event.date)
      ? `${start} – ${formatTime(event.endTime)}`
      : `${start} – ${endFmt}${event.endTime ? ` at ${formatTime(event.endTime)}` : ""}`;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        .ed-page * { box-sizing: border-box; }
        .ed-page { font-family: 'Plus Jakarta Sans', sans-serif; }
        .ed-tab-btn:hover { color: var(--color-primary,#4f46e5) !important; }
      `}</style>

      <div className="ed-page" style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* Breadcrumb */}
        <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#9ca3af", fontWeight: 500, marginBottom: 24 }}>
          <Link to="/"       style={{ color: "#9ca3af", textDecoration: "none", fontWeight: 600 }} onMouseEnter={e => e.currentTarget.style.color = "var(--color-primary,#4f46e5)"} onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}>Home</Link>
          <ChevronRight size={13} strokeWidth={2} />
          <Link to="/events" style={{ color: "#9ca3af", textDecoration: "none", fontWeight: 600 }} onMouseEnter={e => e.currentTarget.style.color = "var(--color-primary,#4f46e5)"} onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}>Events</Link>
          <ChevronRight size={13} strokeWidth={2} />
          <span style={{ color: "#374151", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220 }}>{event.title}</span>
        </nav>

        {/* ═══ HERO ═══ */}
        <div style={{
          position: "relative", borderRadius: 24, overflow: "hidden", marginBottom: 28,
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)", animation: "fadeUp 0.6s ease both",
        }}>
          <div style={{ height: 460, position: "relative", overflow: "hidden" }}>
            {event.image
              ? <img src={event.image} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 8s ease", }} />
              : <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, #1e1b4b, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))" }} />
            }
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.1) 100%)" }} />
          </div>

          {/* Overlay content */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "36px 40px", color: "#fff" }}>
            {/* Badges */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 12, fontWeight: 700, color: catMeta.color, background: catMeta.bg,
                padding: "4px 11px", borderRadius: 50,
              }}>
                <CatIcon size={12} strokeWidth={2.5} />{event.category}
              </span>
              {event.isFeatured && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 800, color: "#92400e", background: "#fef3c7", padding: "4px 10px", borderRadius: 50 }}>
                  <Star size={11} strokeWidth={2.5} /> Featured
                </span>
              )}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 800,
                color: event.isFree ? "#065f46" : "#1e3a8a",
                background: event.isFree ? "#d1fae5" : "#dbeafe",
                padding: "4px 10px", borderRadius: 50,
              }}>
                <Ticket size={11} strokeWidth={2.5} />
                {event.isFree ? "Free Event" : event.ticketTypes?.length > 0 ? `From ${formatCurrency(Math.min(...event.ticketTypes.map(t => t.price)))}` : "Paid Event"}
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(24px,4vw,48px)", fontWeight: 900, letterSpacing: "-1px", lineHeight: 1.12, margin: "0 0 20px" }}>
              {event.title}
            </h1>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 28px" }}>
              {[
                { icon: School,   val: event.schoolName },
                { icon: Calendar, val: `${formatDateShort(event.date)}${event.time ? ` · ${formatTime(event.time)}` : ""}` },
                { icon: MapPin,   val: event.venue || event.location || "TBA" },
              ].map(({ icon: Icon, val }, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
                  <Icon size={15} strokeWidth={2} color="rgba(255,255,255,0.55)" />{val}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ TABS ═══ */}
        <div style={{
          background: "#fff", borderRadius: 18, border: "1px solid #f0f0f0",
          padding: "6px 8px", marginBottom: 24,
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          display: "flex", flexWrap: "wrap", gap: 4,
        }}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id} onClick={() => setActiveTab(id)}
              className="ed-tab-btn"
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "10px 18px", borderRadius: 12, border: "none",
                background: activeTab === id
                  ? "linear-gradient(135deg, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))"
                  : "transparent",
                color: activeTab === id ? "#fff" : "#6b7280",
                fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit",
                boxShadow: activeTab === id ? "0 4px 12px color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent)" : "none",
                transition: "all 0.18s",
              }}
            >
              <Icon size={14} strokeWidth={2.2} />{label}
            </button>
          ))}
        </div>

        {/* ═══ CONTENT + SIDEBAR ═══ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>

          {/* ── MAIN ── */}
          <div style={{ minWidth: 0 }}>

            {/* DETAILS TAB */}
            {activeTab === "details" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                <Card>
                  <SectionHead label="About" title="About the Event" />
                  <p style={{ fontSize: 14.5, color: "#374151", lineHeight: 1.85, margin: 0, whiteSpace: "pre-line" }}>
                    {event.longDescription || event.description}
                  </p>
                </Card>

                <Card>
                  <SectionHead label="Participation" title="Participation Details" />
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
                    borderRadius: 12, marginBottom: 16,
                    background: event.isFree ? "#f0fdf4" : "#eff6ff",
                    border: `1px solid ${event.isFree ? "#bbf7d0" : "#bfdbfe"}`,
                  }}>
                    <Ticket size={16} color={event.isFree ? "#059669" : "#2563eb"} strokeWidth={2} />
                    <span style={{ fontSize: 14, fontWeight: 700, color: event.isFree ? "#065f46" : "#1e3a8a" }}>
                      {event.isFree ? "This is a Free Event" : "This is a Paid Event"}
                    </span>
                  </div>
                  {event.participationDetails ? (
                    <div style={{
                      background: "color-mix(in srgb,var(--color-primary,#4f46e5) 5%,transparent)",
                      border: "1px solid color-mix(in srgb,var(--color-primary,#4f46e5) 12%,transparent)",
                      borderRadius: 14, padding: "16px 18px",
                    }}>
                      <p style={{ fontSize: 11.5, fontWeight: 800, color: "var(--color-primary,#4f46e5)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>How to Participate</p>
                      <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.75, margin: 0, whiteSpace: "pre-line" }}>{event.participationDetails}</p>
                    </div>
                  ) : (
                    <p style={{ fontSize: 13.5, color: "#9ca3af", fontStyle: "italic", margin: 0 }}>No specific participation details provided.</p>
                  )}
                </Card>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Card>
                    <SectionHead label="When" title="Schedule" />
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <div style={{ width: 30, height: 30, borderRadius: 9, background: "color-mix(in srgb,var(--color-primary,#4f46e5) 8%,transparent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Calendar size={13} color="var(--color-primary,#4f46e5)" strokeWidth={2} />
                        </div>
                        <div>
                          <div style={{ fontSize: 11.5, color: "#9ca3af", fontWeight: 600 }}>Start</div>
                          <div style={{ fontSize: 13.5, color: "#374151", fontWeight: 700, lineHeight: 1.4 }}>{formatDateTimeRange()}</div>
                        </div>
                      </div>
                      {event.endDate && (
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <div style={{ width: 30, height: 30, borderRadius: 9, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Clock size={13} color="#6b7280" strokeWidth={2} />
                          </div>
                          <div>
                            <div style={{ fontSize: 11.5, color: "#9ca3af", fontWeight: 600 }}>End</div>
                            <div style={{ fontSize: 13.5, color: "#374151", fontWeight: 700 }}>{formatDate(event.endDate)}{event.endTime ? ` at ${formatTime(event.endTime)}` : ""}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>

                  <Card>
                    <SectionHead label="Where" title="Venue" />
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {[
                        { label: "Location", val: event.location || "TBA" },
                        { label: "Venue",    val: event.venue    || "Main Hall" },
                      ].map(({ label, val }, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <div style={{ width: 30, height: 30, borderRadius: 9, background: "color-mix(in srgb,var(--color-primary,#4f46e5) 8%,transparent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <MapPin size={13} color="var(--color-primary,#4f46e5)" strokeWidth={2} />
                          </div>
                          <div>
                            <div style={{ fontSize: 11.5, color: "#9ca3af", fontWeight: 600 }}>{label}</div>
                            <div style={{ fontSize: 13.5, color: "#374151", fontWeight: 700 }}>{val}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* YouTube embed */}
                {event.youtubeLink && (
                  <Card>
                    <SectionHead label="Preview" title="Event Media" />
                    <div style={{ borderRadius: 14, overflow: "hidden", aspectRatio: "16/9" }}>
                      <iframe
                        width="100%" height="100%"
                        src={event.youtubeLink.replace("watch?v=", "embed/")}
                        title="Event preview"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ display: "block" }}
                      />
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* TICKETS TAB */}
            {activeTab === "tickets" && event.enableTickets && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Capacity banner */}
                <div style={{
                  borderRadius: 20, overflow: "hidden",
                  background: "linear-gradient(135deg, #1e1b4b, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))",
                  padding: "28px 32px", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20,
                }}>
                  <div>
                    <h3 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 6px", letterSpacing: "-0.3px" }}>Secure Your Spot</h3>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", margin: 0 }}>Choose your preferred ticket category below.</p>
                  </div>
                  {totals.capacity > 0 && (
                    <div style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", borderRadius: 16, padding: "16px 24px", textAlign: "center" }}>
                      <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.5px" }}>{totals.booked}/{totals.capacity}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>Seats Reserved</div>
                    </div>
                  )}
                </div>

                {event.ticketTypes.map(ticket => {
                  const sold = ticket.totalQuantity - ticket.availableQuantity;
                  const pct  = ticket.totalQuantity > 0 ? (sold / ticket.totalQuantity) * 100 : 0;
                  const soldOut = ticket.availableQuantity === 0;
                  return (
                    <Card key={ticket.id} style={{ opacity: soldOut ? 0.65 : 1, filter: soldOut ? "grayscale(0.4)" : "none" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 10 }}>
                            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0f0f0f", margin: 0 }}>{ticket.name}</h3>
                            <span style={{
                              fontSize: 11.5, fontWeight: 800,
                              color: soldOut ? "#dc2626" : "#059669",
                              background: soldOut ? "#fef2f2" : "#f0fdf4",
                              padding: "3px 9px", borderRadius: 50,
                            }}>
                              {soldOut ? "Sold Out" : `${ticket.availableQuantity} available`}
                            </span>
                          </div>
                          <p style={{ fontSize: 13.5, color: "#6b7280", lineHeight: 1.65, margin: "0 0 12px" }}>{ticket.description}</p>
                          {ticket.benefits?.length > 0 && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                              {ticket.benefits.map((b, i) => (
                                <span key={i} style={{
                                  display: "inline-flex", alignItems: "center", gap: 4,
                                  fontSize: 11.5, fontWeight: 600, color: "#059669", background: "#f0fdf4",
                                  padding: "3px 10px", borderRadius: 50,
                                }}>
                                  <CheckCircle size={10} strokeWidth={2.5} />{b}
                                </span>
                              ))}
                            </div>
                          )}
                          {ticket.totalQuantity > 0 && (
                            <div style={{ marginTop: 14 }}>
                              <ProgressBar pct={pct} color={pct > 80 ? "#ef4444" : "var(--color-primary,#4f46e5)"} />
                              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                                <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>Booked</span>
                                <span style={{ fontSize: 11, color: "#374151", fontWeight: 700 }}>{sold}/{ticket.totalQuantity}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, minWidth: 140 }}>
                          <div style={{ fontSize: 22, fontWeight: 900, color: "var(--color-primary,#4f46e5)", letterSpacing: "-0.3px" }}>
                            {formatCurrency(ticket.price)}
                          </div>
                          <button
                            onClick={() => !soldOut && openBooking(ticket)}
                            disabled={soldOut}
                            style={{
                              width: "100%", padding: "11px 16px", borderRadius: 12, border: "none",
                              background: soldOut
                                ? "#f3f4f6"
                                : "linear-gradient(135deg, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))",
                              color: soldOut ? "#9ca3af" : "#fff",
                              fontWeight: 700, fontSize: 13.5, cursor: soldOut ? "not-allowed" : "pointer",
                              fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                              boxShadow: soldOut ? "none" : "0 4px 12px color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent)",
                            }}
                          >
                            <Ticket size={14} strokeWidth={2.5} />
                            {soldOut ? "Sold Out" : "Book Now"}
                          </button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* DONATION TAB */}
            {activeTab === "donation" && event.enableDonation && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{
                  borderRadius: 20,
                  background: "linear-gradient(135deg, #064e3b, #059669, #10b981)",
                  padding: "32px", color: "#fff",
                }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 14,
                    fontSize: 11.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
                    color: "#a7f3d0", background: "rgba(255,255,255,0.12)",
                    padding: "5px 14px", borderRadius: 50,
                  }}>
                    <TrendingUp size={12} strokeWidth={2.5} /> Make an Impact
                  </span>
                  <h2 style={{ fontSize: 24, fontWeight: 900, margin: "0 0 10px", letterSpacing: "-0.4px" }}>Support This Event</h2>
                  <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.78)", lineHeight: 1.75, margin: 0, maxWidth: 520 }}>
                    {event.donationDescription || "Your contributions directly help make this event a success and support the school community."}
                  </p>
                  {event.donationGoal > 0 && (
                    <div style={{ marginTop: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>Goal: {formatCurrency(event.donationGoal)}</span>
                        <span style={{ fontSize: 13, fontWeight: 800 }}>{Math.round(donationPct)}% raised</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 50, background: "rgba(255,255,255,0.2)", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 50, width: `${donationPct}%`, background: "#fff" }} />
                      </div>
                    </div>
                  )}
                </div>

                <Card>
                  <SectionHead label="How to Support" title="Contact Information" sub="Reach out to the school directly to make your contribution." />
                  <ContactDetails contactEmail={event.contactEmail} contactPhone={event.contactPhone} />
                </Card>
              </div>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 24 }}>

            {/* Event info card */}
            <Card>
              <SectionHead label="Details" title="Event Information" />
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { icon: UserCheck,       label: "Age Restriction",    val: event.ageRestriction      || "All ages welcome"   },
                  { icon: ParkingCircle,   label: "Parking",            val: event.parkingAvailable    ? "Available"     : "Limited"        },
                  { icon: UtensilsCrossed, label: "Food & Drinks",      val: event.foodAvailable       ? "Available"     : "Not provided"   },
                  { icon: Accessibility,   label: "Wheelchair Access",  val: event.wheelchairAccessible ? "Accessible"   : "Limited"        },
                ].map(({ icon: Icon, label, val }, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6b7280", fontWeight: 500 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon size={13} color="#6b7280" strokeWidth={2} />
                      </div>
                      {label}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#374151", textAlign: "right" }}>{val}</span>
                  </div>
                ))}
              </div>

              {(event.contactEmail || event.contactPhone) && (
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #f3f4f6" }}>
                  <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0f0f0f", margin: "0 0 12px" }}>Organizer Contact</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {event.contactEmail && (
                      <a href={`mailto:${event.contactEmail}`} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--color-primary,#4f46e5)", fontWeight: 600, textDecoration: "none" }}>
                        <Mail size={13} strokeWidth={2} />{event.contactEmail}
                      </a>
                    )}
                    {event.contactPhone && (
                      <a href={`tel:${event.contactPhone}`} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--color-primary,#4f46e5)", fontWeight: 600, textDecoration: "none" }}>
                        <Phone size={13} strokeWidth={2} />{event.contactPhone}
                      </a>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={() => navigate(`/schools/${event.schoolId}`)}
                style={{
                  width: "100%", marginTop: 20, padding: "11px 16px", borderRadius: 12, border: "1.5px solid #e5e7eb",
                  background: "#fff", color: "#374151", fontWeight: 700, fontSize: 13.5,
                  cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  transition: "all 0.18s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"; e.currentTarget.style.color = "var(--color-primary,#4f46e5)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#374151"; }}
              >
                <School size={14} strokeWidth={2.2} /> View School Profile
              </button>
            </Card>

            {/* Share */}
            <ShareSection event={event} />
          </div>
        </div>
      </div>

      {/* ═══ BOOKING MODAL ═══ */}
      {showBookingModal && selectedTicket && (
        <div
          onClick={() => setShowBookingModal(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: "#fff", borderRadius: 24, maxWidth: 560, width: "100%", maxHeight: "90vh", overflowY: "auto", padding: 32, boxShadow: "0 24px 64px rgba(0,0,0,0.2)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: "#0f0f0f", margin: 0 }}>Book Tickets</h2>
              <button onClick={() => setShowBookingModal(false)} style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid #e5e7eb", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <X size={16} strokeWidth={2.5} color="#374151" />
              </button>
            </div>

            {!showPaymentStep ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Ticket + quantity */}
                <div style={{ padding: "16px 18px", borderRadius: 14, background: "color-mix(in srgb,var(--color-primary,#4f46e5) 6%,transparent)", border: "1px solid color-mix(in srgb,var(--color-primary,#4f46e5) 14%,transparent)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 800, color: "#0f0f0f", margin: "0 0 3px" }}>{selectedTicket.name}</p>
                    <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{formatCurrency(selectedTicket.price)} each</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", borderRadius: 12, padding: "6px 10px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: 30, height: 30, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#f9fafb", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Minus size={13} strokeWidth={2.5} />
                    </button>
                    <span style={{ fontSize: 16, fontWeight: 900, minWidth: 24, textAlign: "center" }}>{quantity}</span>
                    <button onClick={() => setQuantity(Math.min(selectedTicket.availableQuantity, quantity + 1))} style={{ width: 30, height: 30, borderRadius: 8, border: "1.5px solid #e5e7eb", background: "#f9fafb", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Plus size={13} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                {/* Form */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 800, color: "#0f0f0f", margin: 0 }}>Your Details</h3>
                  {[
                    { key: "name",  label: "Full Name *",  type: "text"  },
                    { key: "email", label: "Email *",      type: "email" },
                    { key: "phone", label: "Phone *",      type: "tel"   },
                    { key: "nic",   label: "NIC (optional)", type: "text" },
                  ].map(({ key, label, type }) => (
                    <div key={key}>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", display: "block", marginBottom: 5 }}>{label}</label>
                      <input
                        type={type} value={formData[key]}
                        onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                        style={{
                          width: "100%", padding: "10px 14px", borderRadius: 12,
                          border: "1.5px solid #e5e7eb", fontSize: 13.5, fontWeight: 500,
                          color: "#374151", outline: "none", fontFamily: "inherit",
                          transition: "border-color 0.18s", boxSizing: "border-box",
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"}
                        onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
                      />
                    </div>
                  ))}
                </div>

                {/* Total + proceed */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "1px solid #f3f4f6" }}>
                  <div>
                    <div style={{ fontSize: 11.5, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>Total</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: "var(--color-primary,#4f46e5)", letterSpacing: "-0.3px" }}>{formatCurrency(selectedTicket.price * quantity)}</div>
                  </div>
                  <button
                    onClick={proceedToPayment}
                    style={{
                      padding: "12px 24px", borderRadius: 12, border: "none",
                      background: "linear-gradient(135deg, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))",
                      color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
                      boxShadow: "0 4px 12px color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent)",
                    }}
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, color: "#0f0f0f", margin: 0 }}>Select Payment Method</h3>
                {[
                  { id: "card",   name: "Credit / Debit Card",    icon: CreditCard  },
                  { id: "mobile", name: "Mobile Wallet",          icon: Smartphone  },
                  { id: "bank",   name: "Direct Bank Transfer",   icon: Building2   },
                ].map(({ id, name, icon: Icon }) => (
                  <button
                    key={id} onClick={() => setSelectedPayment(id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "14px 18px", borderRadius: 14,
                      border: `2px solid ${selectedPayment === id ? "var(--color-primary,#4f46e5)" : "#e5e7eb"}`,
                      background: selectedPayment === id ? "color-mix(in srgb,var(--color-primary,#4f46e5) 6%,transparent)" : "#fff",
                      cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s",
                    }}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: selectedPayment === id ? "color-mix(in srgb,var(--color-primary,#4f46e5) 12%,transparent)" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon size={18} color={selectedPayment === id ? "var(--color-primary,#4f46e5)" : "#6b7280"} strokeWidth={2} />
                    </div>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: selectedPayment === id ? "var(--color-primary,#4f46e5)" : "#374151", textAlign: "left" }}>{name}</span>
                    {selectedPayment === id && <CheckCircle size={18} color="var(--color-primary,#4f46e5)" strokeWidth={2.5} />}
                  </button>
                ))}
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    onClick={() => setShowPaymentStep(false)}
                    style={{ flex: 1, padding: "12px", borderRadius: 12, border: "1.5px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}
                  >
                    Back
                  </button>
                  <button
                    onClick={completePayment}
                    style={{
                      flex: 2, padding: "12px", borderRadius: 12, border: "none",
                      background: "linear-gradient(135deg, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))",
                      color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
                      boxShadow: "0 4px 12px color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent)",
                    }}
                  >
                    Complete Payment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ SUCCESS MODAL ═══ */}
      {showSuccessModal && bookingDetails && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 24, maxWidth: 420, width: "100%", padding: 36, textAlign: "center", boxShadow: "0 24px 64px rgba(0,0,0,0.2)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <CheckCircle size={32} color="#059669" strokeWidth={2} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: "#0f0f0f", margin: "0 0 8px" }}>Booking Confirmed!</h2>
            <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.65, margin: "0 0 24px" }}>
              Your tickets have been reserved. A confirmation has been sent to{" "}
              <strong style={{ color: "#374151" }}>{bookingDetails.customerDetails.email}</strong>.
            </p>
            <div style={{ background: "#f9fafb", borderRadius: 14, padding: "14px 20px", marginBottom: 24, border: "1px solid #f0f0f0" }}>
              <div style={{ fontSize: 11.5, color: "#9ca3af", fontWeight: 600, marginBottom: 4 }}>Booking ID</div>
              <div style={{ fontFamily: "monospace", fontSize: 18, fontWeight: 900, color: "#0f0f0f", letterSpacing: "0.1em" }}>{bookingDetails.bookingId}</div>
            </div>
            <button
              onClick={() => { setShowSuccessModal(false); navigate(`/events/${event.id}`); }}
              style={{
                width: "100%", padding: "13px", borderRadius: 12, border: "none",
                background: "linear-gradient(135deg, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))",
                color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 4px 14px color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent)",
              }}
            >
              View Event
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EventDetails;