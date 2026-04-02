import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiPublic from "../../services/ApiPublic";
import {
  School, Users, CalendarCheck, HandCoins,
  ArrowRight, MapPin, Calendar, Ticket, Eye,
  Heart, MessageCircle, CheckCircle, ChevronRight,
  Star, BookOpen, Trophy, Palette, Music, Microscope,
  Newspaper, Dumbbell, TrendingUp, Landmark, Building2,
  Globe, GraduationCap, Sparkles, Clock, Zap
} from "lucide-react";

/* ── helpers ── */
const formatDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};
const formatCurrency = (n) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(n || 0);

const CATEGORY_META = {
  Sports:      { icon: Dumbbell,   color: "#059669", bg: "#ecfdf5" },
  "Big Match": { icon: Trophy,     color: "#d97706", bg: "#fffbeb" },
  Art:         { icon: Palette,    color: "#7c3aed", bg: "#f5f3ff" },
  Carnival:    { icon: Sparkles,   color: "#db2777", bg: "#fdf2f8" },
  Achievement: { icon: Star,       color: "#2563eb", bg: "#eff6ff" },
  Education:   { icon: BookOpen,   color: "#2563eb", bg: "#eff6ff" },
  Cultural:    { icon: GraduationCap, color: "#7c3aed", bg: "#f5f3ff" },
  Music:       { icon: Music,      color: "#059669", bg: "#ecfdf5" },
  Science:     { icon: Microscope, color: "#0891b2", bg: "#ecfeff" },
  News:        { icon: Newspaper,  color: "#6b7280", bg: "#f9fafb" },
};
const getCatMeta = (c) => CATEGORY_META[c] || CATEGORY_META.News;

const TYPE_META = {
  government:    { icon: Landmark,  color: "#059669", bg: "#ecfdf5" },
  private:       { icon: Building2, color: "#2563eb", bg: "#eff6ff" },
  international: { icon: Globe,     color: "#7c3aed", bg: "#f5f3ff" },
};
const getTypeMeta = (t) => TYPE_META[t?.toLowerCase()] || { icon: School, color: "#6b7280", bg: "#f9fafb" };

const getEventPrice = (ev) => {
  if (!ev.enableTickets || !ev.ticketTypes?.length) return "Free";
  const min = Math.min(...ev.ticketTypes.map((t) => t.price));
  return min === 0 ? "Free" : `LKR ${min.toLocaleString()}`;
};
const getEventBooked = (ev) => {
  if (!ev.ticketTypes?.length) return { booked: 0, capacity: 0 };
  const cap = ev.ticketTypes.reduce((s, t) => s + t.totalQuantity, 0);
  const avail = ev.ticketTypes.reduce((s, t) => s + t.availableQuantity, 0);
  return { booked: cap - avail, capacity: cap };
};

/* ── Skeleton ── */
const Skeleton = ({ h = 200, r = 16 }) => (
  <div style={{
    height: h, borderRadius: r,
    background: "linear-gradient(90deg,#f3f4f6 25%,#e9eaec 50%,#f3f4f6 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.6s infinite",
  }} />
);

/* ── Section header ── */
const SectionHead = ({ label, title, sub, onViewAll, viewLabel = "View all" }) => (
  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28 }}>
    <div>
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
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f0f0f", letterSpacing: "-0.4px", margin: 0 }}>{title}</h2>
      {sub && <p style={{ fontSize: 13.5, color: "#6b7280", marginTop: 5, fontWeight: 500 }}>{sub}</p>}
    </div>
    {onViewAll && (
      <button
        onClick={onViewAll}
        style={{
          display: "flex", alignItems: "center", gap: 5, flexShrink: 0,
          fontSize: 13, fontWeight: 700, color: "var(--color-primary,#4f46e5)",
          background: "none", border: "none", cursor: "pointer", padding: "6px 0",
          transition: "gap 0.18s",
        }}
        onMouseEnter={e => e.currentTarget.style.gap = "8px"}
        onMouseLeave={e => e.currentTarget.style.gap = "5px"}
      >
        {viewLabel} <ArrowRight size={15} strokeWidth={2.5} />
      </button>
    )}
  </div>
);

/* ── Story card ── */
const StoryCard = ({ story, onClick }) => {
  const meta = getCatMeta(story.category);
  const Icon = meta.icon;
  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff", borderRadius: 18, border: "1px solid #f0f0f0",
        overflow: "hidden", cursor: "pointer", transition: "all 0.25s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; }}
    >
      <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
        <img
          src={story.image || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600"}
          alt={story.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
          onMouseLeave={e => e.currentTarget.style.transform = ""}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 55%)" }} />
        <span style={{
          position: "absolute", top: 14, left: 14,
          display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 11.5, fontWeight: 700,
          color: meta.color, background: meta.bg,
          padding: "4px 10px", borderRadius: 50,
        }}>
          <Icon size={11} strokeWidth={2.5} />{story.category}
        </span>
        {story.isFeatured && (
          <span style={{
            position: "absolute", top: 14, right: 14,
            fontSize: 10.5, fontWeight: 800, letterSpacing: "0.06em",
            color: "#92400e", background: "#fef3c7",
            padding: "4px 9px", borderRadius: 50,
          }}>FEATURED</span>
        )}
      </div>
      <div style={{ padding: "18px 20px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af" }}>{story.schoolName}</span>
          <span style={{ fontSize: 11, color: "#c4c4c4", fontWeight: 500 }}>{formatDate(story.createdAt)}</span>
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f0f0f", lineHeight: 1.4, margin: "0 0 8px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {story.title}
        </h3>
        <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, margin: "0 0 14px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {story.description}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          {[
            { Icon: Eye, val: story.views || 0 },
            { Icon: Heart, val: story.likes || 0 },
            { Icon: MessageCircle, val: story.commentCount || 0 },
          ].map(({ Icon, val }, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>
              <Icon size={13} strokeWidth={2} />{val.toLocaleString()}
            </span>
          ))}
        </div>
        <button style={{
          width: "100%", padding: "10px", borderRadius: 12,
          border: `1.5px solid color-mix(in srgb,var(--color-primary,#4f46e5) 25%,transparent)`,
          background: "color-mix(in srgb,var(--color-primary,#4f46e5) 5%,transparent)",
          color: "var(--color-primary,#4f46e5)", fontWeight: 700, fontSize: 13,
          cursor: "pointer", transition: "all 0.18s", fontFamily: "inherit",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--color-primary,#4f46e5)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "color-mix(in srgb,var(--color-primary,#4f46e5) 5%,transparent)"; e.currentTarget.style.color = "var(--color-primary,#4f46e5)"; }}
        >
          Read Story
        </button>
      </div>
    </div>
  );
};

/* ── Event card ── */
const EventCard = ({ event, onClick }) => {
  const meta = getCatMeta(event.category);
  const Icon = meta.icon;
  const { booked, capacity } = getEventBooked(event);
  const pct = capacity > 0 ? Math.min((booked / capacity) * 100, 100) : 0;
  const price = getEventPrice(event);
  const isFree = price === "Free";

  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff", borderRadius: 18, border: "1px solid #f0f0f0",
        overflow: "hidden", cursor: "pointer", transition: "all 0.25s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; }}
    >
      <div style={{ position: "relative", height: 190, overflow: "hidden", flexShrink: 0 }}>
        <img
          src={event.image || "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600"}
          alt={event.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
          onMouseLeave={e => e.currentTarget.style.transform = ""}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)" }} />
        <span style={{
          position: "absolute", top: 14, left: 14,
          display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 11.5, fontWeight: 700,
          color: meta.color, background: meta.bg,
          padding: "4px 10px", borderRadius: 50,
        }}>
          <Icon size={11} strokeWidth={2.5} />{event.category}
        </span>
        <span style={{
          position: "absolute", bottom: 14, right: 14,
          fontSize: 13, fontWeight: 800,
          color: isFree ? "#065f46" : "#1e3a8a",
          background: isFree ? "#d1fae5" : "#dbeafe",
          padding: "5px 12px", borderRadius: 50,
        }}>{price}</span>
      </div>
      <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{ fontSize: 15.5, fontWeight: 800, color: "#0f0f0f", lineHeight: 1.4, margin: "0 0 6px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {event.title}
        </h3>
        <p style={{ fontSize: 12.5, fontWeight: 600, color: "#9ca3af", margin: "0 0 10px" }}>{event.schoolName}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "#4b5563", fontWeight: 500 }}>
            <Calendar size={13} strokeWidth={2} color="var(--color-primary,#4f46e5)" />
            {formatDate(event.date)}{event.time ? ` · ${event.time}` : ""}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "#4b5563", fontWeight: 500 }}>
            <MapPin size={13} strokeWidth={2} color="var(--color-primary,#4f46e5)" />
            {event.venue || event.location || "TBA"}
          </span>
        </div>
        {capacity > 0 && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: "#9ca3af" }}>Booked</span>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "#374151" }}>{booked}/{capacity}</span>
            </div>
            <div style={{ height: 5, borderRadius: 50, background: "#f3f4f6", overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 50, width: `${pct}%`,
                background: pct > 80 ? "#ef4444" : "var(--color-primary,#4f46e5)",
                transition: "width 0.5s",
              }} />
            </div>
          </div>
        )}
        <button style={{
          marginTop: "auto",
          width: "100%", padding: "10px", borderRadius: 12, border: "none",
          background: "linear-gradient(135deg, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))",
          color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
          boxShadow: "0 4px 12px color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent)",
          transition: "opacity 0.18s", fontFamily: "inherit",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
          onMouseLeave={e => e.currentTarget.style.opacity = "1"}
        >
          <Ticket size={14} strokeWidth={2.5} /> Book Tickets
        </button>
      </div>
    </div>
  );
};

/* ── School card ── */
const SchoolCard = ({ school, onClick }) => {
  const typeMeta = getTypeMeta(school.type);
  const TypeIcon = typeMeta.icon;
  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff", borderRadius: 18, border: "1px solid #f0f0f0",
        overflow: "hidden", cursor: "pointer", transition: "all 0.25s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; }}
    >
      {/* Cover */}
      <div style={{ height: 88, background: `linear-gradient(135deg,color-mix(in srgb,var(--color-primary,#4f46e5) 12%,#fff),color-mix(in srgb,var(--color-secondary,#7c3aed) 8%,#fff))`, position: "relative", overflow: "hidden" }}>
        {school.coverImageUrl && (
          <img src={school.coverImageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.25 }} />
        )}
        {school.isVerified && (
          <span style={{
            position: "absolute", top: 10, right: 12,
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 10.5, fontWeight: 800, color: "#065f46", background: "#d1fae5",
            padding: "3px 9px", borderRadius: 50,
          }}>
            <CheckCircle size={10} strokeWidth={2.5} /> Verified
          </span>
        )}
      </div>
      <div style={{ padding: "0 18px 18px", marginTop: -22 }}>
        {/* Logo */}
        <div style={{
          width: 50, height: 50, borderRadius: 14,
          background: "#fff", border: "2.5px solid #fff",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden", marginBottom: 12,
        }}>
          {school.logoUrl
            ? <img src={school.logoUrl} alt={school.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <TypeIcon size={22} color={typeMeta.color} strokeWidth={2} />
          }
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f0f0f", margin: "0 0 5px", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {school.name}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <MapPin size={12} strokeWidth={2} color="#9ca3af" />
          <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>{school.contact?.city || "Sri Lanka"}</span>
          {school.startedYear > 0 && <>
            <span style={{ color: "#e5e7eb" }}>·</span>
            <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>Est. {school.startedYear}</span>
          </>}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: 11.5, fontWeight: 700,
            color: typeMeta.color, background: typeMeta.bg,
            padding: "4px 10px", borderRadius: 50,
          }}>
            <TypeIcon size={11} strokeWidth={2.2} />{school.type}
          </span>
          {school.studentCount > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#6b7280", fontWeight: 600 }}>
              <Users size={12} strokeWidth={2} />{school.studentCount.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Empty state ── */
const Empty = ({ icon: Icon, msg, action, onAction }) => (
  <div style={{ textAlign: "center", padding: "48px 24px", background: "#fafafa", borderRadius: 18, border: "1px solid #f0f0f0" }}>
    <div style={{ width: 56, height: 56, borderRadius: 16, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
      <Icon size={24} color="#9ca3af" strokeWidth={1.8} />
    </div>
    <p style={{ fontSize: 14, color: "#9ca3af", fontWeight: 500, margin: "0 0 12px" }}>{msg}</p>
    {action && (
      <button onClick={onAction} style={{
        padding: "9px 20px", borderRadius: 50,
        border: "1.5px solid color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent)",
        background: "color-mix(in srgb,var(--color-primary,#4f46e5) 6%,transparent)",
        color: "var(--color-primary,#4f46e5)", fontWeight: 700, fontSize: 13,
        cursor: "pointer", fontFamily: "inherit",
      }}>{action}</button>
    )}
  </div>
);

/* ═══════════════════════════════════
   HOME PAGE
═══════════════════════════════════ */
const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [data, setData]     = useState({ stories: [], events: [], schools: [], stats: { schools: 0, students: 0, events: 0, donations: 0 } });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data: d } = await ApiPublic.getHomeData();
        setData({
          stats: { schools: d.stats.totalSchools, students: d.stats.totalStudents, events: d.stats.totalEvents, donations: d.stats.totalDonationsRaised },
          stories: d.topStories || [],
          events:  d.upcomingEvents || [],
          schools: d.featuredSchools || [],
        });
        setError(null);
      } catch (e) {
        setError("Failed to load page data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const STATS = [
    { icon: School,      label: "Schools Nationwide",  value: data.stats.schools,   fmt: (v) => `${v.toLocaleString()}+` },
    { icon: Users,       label: "Students Connected",  value: data.stats.students,  fmt: (v) => `${v.toLocaleString()}+` },
    { icon: CalendarCheck, label: "Active Events",     value: data.stats.events,    fmt: (v) => `${v}+` },
    { icon: HandCoins,   label: "Donations Raised",    value: data.stats.donations, fmt: (v) => formatCurrency(v) },
  ];

  const STEPS = [
    { icon: School,       label: "Schools Register",    desc: "Join our verified network of institutions",       color: "var(--color-primary,#4f46e5)" },
    { icon: CalendarCheck,label: "Share Events",         desc: "Post school events, announcements and activities", color: "#059669" },
    { icon: Ticket,       label: "Sell Tickets",         desc: "Manage events and seamless ticket sales",           color: "#7c3aed" },
    { icon: HandCoins,    label: "Support Schools",      desc: "Donate to meaningful educational causes",           color: "#db2777" },
  ];

  const SPONSORS = ["ABC Bookshop", "Lanka Stationers", "SportZone", "Future Academy", "TechHub", "Art Haven"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        @keyframes countUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        .home-page * { box-sizing: border-box; }
        .home-page { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      <div className="home-page" style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* ═══ HERO ═══ */}
        <div style={{
          position: "relative", borderRadius: 24, overflow: "hidden",
          background: "linear-gradient(135deg, #1e1b4b 0%, var(--color-primary,#4f46e5) 45%, var(--color-secondary,#7c3aed) 100%)",
          padding: "64px 48px", marginBottom: 48, color: "#fff",
          animation: "fadeUp 0.6s ease both",
        }}>
          {/* Background decoration */}
          <div style={{ position: "absolute", top: -80, right: -80, width: 360, height: 360, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, left: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "50%", right: 120, transform: "translateY(-50%)", width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1, maxWidth: 640 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20,
              fontSize: 11.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#c7d2fe", background: "rgba(255,255,255,0.12)",
              padding: "5px 14px", borderRadius: 50,
            }}>
              <Sparkles size={12} strokeWidth={2.5} /> Sri Lanka's Education Platform
            </span>
            <h1 style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 900, letterSpacing: "-1px", lineHeight: 1.15, margin: "0 0 18px" }}>
              Welcome to{" "}
              <span style={{ color: "#fde68a" }}>Ape Iskole</span>
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.78)", lineHeight: 1.75, margin: "0 0 36px", fontWeight: 400, maxWidth: 520 }}>
              The premier digital platform connecting schools, students, and communities.
              Discover events, support education, and stay updated.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <button onClick={() => navigate("/schools")} style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "13px 26px", borderRadius: 50, border: "none",
                background: "#fff", color: "var(--color-primary,#4f46e5)",
                fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              }}>
                Explore Schools <ArrowRight size={16} strokeWidth={2.5} />
              </button>
              <button onClick={() => navigate("/register-school")} style={{
                padding: "13px 26px", borderRadius: 50,
                border: "2px solid rgba(255,255,255,0.3)", background: "transparent",
                color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
                transition: "background 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                Register Your School
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div style={{
            position: "relative", zIndex: 1,
            display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
            gap: 2, marginTop: 48,
            background: "rgba(255,255,255,0.08)", borderRadius: 16,
            backdropFilter: "blur(8px)", overflow: "hidden",
          }}>
            {STATS.map(({ icon: Icon, label, value, fmt }, i) => (
              <div key={i} style={{ padding: "22px 24px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <Icon size={16} strokeWidth={2} color="rgba(255,255,255,0.65)" />
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</span>
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.5px" }}>
                  {loading ? <span style={{ display: "inline-block", width: 80, height: 24, borderRadius: 6, background: "rgba(255,255,255,0.15)", animation: "shimmer 1.6s infinite", backgroundSize: "200% 100%" }} /> : fmt(value)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ ERROR ═══ */}
        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 14, padding: "16px 20px", textAlign: "center", marginBottom: 32 }}>
            <p style={{ color: "#dc2626", fontWeight: 600, margin: "0 0 8px" }}>{error}</p>
            <button onClick={() => window.location.reload()} style={{ color: "#b91c1c", fontWeight: 700, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontSize: 13 }}>Retry</button>
          </div>
        )}

        {/* ═══ TOP STORIES ═══ */}
        <section style={{ marginBottom: 56 }}>
          <SectionHead
            label="Latest" title="Top Stories"
            sub="Highlights from schools across Sri Lanka"
            onViewAll={() => navigate("/stories")}
          />
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
              {[1,2,3].map(i => <div key={i} style={{ borderRadius: 18, overflow: "hidden" }}><Skeleton h={200} /><div style={{ padding: 20 }}><Skeleton h={16} r={6} /><div style={{ marginTop: 10 }}><Skeleton h={22} r={6} /></div><div style={{ marginTop: 8 }}><Skeleton h={14} r={6} /></div></div></div>)}
            </div>
          ) : data.stories.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
              {data.stories.map(s => <StoryCard key={s.id} story={s} onClick={() => navigate(`/stories/${s.id}`)} />)}
            </div>
          ) : <Empty icon={Newspaper} msg="No stories available yet." />}
        </section>

        {/* ═══ UPCOMING EVENTS ═══ */}
        <section style={{ marginBottom: 56 }}>
          <SectionHead
            label="Don't Miss" title="Upcoming Events"
            sub="Exciting school events happening near you"
            onViewAll={() => navigate("/events")}
          />
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 20 }}>
              {[1,2,3].map(i => <div key={i} style={{ borderRadius: 18, overflow: "hidden" }}><Skeleton h={190} /><div style={{ padding: 20 }}><Skeleton h={20} r={6} /><div style={{ marginTop: 10 }}><Skeleton h={14} r={6} /></div></div></div>)}
            </div>
          ) : data.events.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 20 }}>
              {data.events.map(ev => <EventCard key={ev.id} event={ev} onClick={() => navigate(`/events/${ev.id}`)} />)}
            </div>
          ) : <Empty icon={CalendarCheck} msg="No upcoming events at the moment." />}
        </section>

        {/* ═══ FEATURED SCHOOLS ═══ */}
        <section style={{ marginBottom: 56 }}>
          <SectionHead
            label="Spotlight" title="Featured Schools"
            sub="Discover top educational institutions"
            onViewAll={() => navigate("/schools")}
          />
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
              {[1,2,3,4].map(i => <div key={i} style={{ borderRadius: 18, overflow: "hidden" }}><Skeleton h={88} /><div style={{ padding: 18 }}><Skeleton h={16} r={6} /><div style={{ marginTop: 8 }}><Skeleton h={12} r={4} /></div></div></div>)}
            </div>
          ) : data.schools.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 20 }}>
              {data.schools.map(sc => <SchoolCard key={sc.id} school={sc} onClick={() => navigate(`/schools/${sc.id}`)} />)}
            </div>
          ) : <Empty icon={School} msg="No featured schools yet." action="Browse All Schools" onAction={() => navigate("/schools")} />}
        </section>

        {/* ═══ DONATION CTA ═══ */}
        <section style={{ marginBottom: 56 }}>
          <div style={{
            borderRadius: 24, overflow: "hidden", position: "relative",
            background: "linear-gradient(135deg,#f0fdf4 0%,#eff6ff 100%)",
            border: "1px solid #e0f2fe", padding: "52px 48px",
            display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 32,
          }}>
            <div style={{ position: "absolute", top: -40, right: -40, width: 220, height: 220, borderRadius: "50%", background: "rgba(16,185,129,0.07)" }} />
            <div style={{ position: "absolute", bottom: -40, left: 100, width: 180, height: 180, borderRadius: "50%", background: "rgba(37,99,235,0.06)" }} />
            <div style={{ position: "relative", zIndex: 1, maxWidth: 520 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16,
                fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase",
                color: "#059669", background: "#d1fae5", padding: "4px 12px", borderRadius: 50,
              }}>
                <TrendingUp size={11} strokeWidth={2.5} /> Make an Impact
              </span>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: "#0f0f0f", letterSpacing: "-0.5px", margin: "0 0 12px" }}>
                Support Education in Sri Lanka
              </h2>
              <p style={{ fontSize: 15, color: "#4b5563", lineHeight: 1.7, margin: 0, fontWeight: 400 }}>
                Your donations improve school facilities, provide scholarships, and enhance learning resources for thousands of students across the island.
              </p>
            </div>
            <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={() => navigate("/donations")} style={{
                padding: "13px 28px", borderRadius: 50, border: "none",
                background: "linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed))",
                color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer",
                boxShadow: "0 6px 20px color-mix(in srgb,var(--color-primary,#4f46e5) 35%,transparent)",
                fontFamily: "inherit",
              }}>
                Make a Donation
              </button>
              <button onClick={() => navigate("/donations")} style={{
                padding: "13px 24px", borderRadius: 50,
                border: "1.5px solid #d1d5db", background: "#fff",
                color: "#374151", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
              }}>
                View Campaigns
              </button>
            </div>
          </div>
        </section>

        {/* ═══ HOW IT WORKS ═══ */}
        <section style={{ marginBottom: 56 }}>
          <SectionHead label="Platform" title="How Ape Iskole Works" sub="Simple, powerful, and built for Sri Lankan education" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} style={{
                  background: "#fff", borderRadius: 18, border: "1px solid #f0f0f0",
                  padding: "28px 24px", textAlign: "center",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                  transition: "all 0.22s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; }}
                >
                  <div style={{
                    width: 52, height: 52, borderRadius: 16, margin: "0 auto 16px",
                    background: `color-mix(in srgb,${step.color} 10%,transparent)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={22} color={step.color} strokeWidth={2} />
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 800, color: "#c4c4c4", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                    Step {i + 1}
                  </div>
                  <h3 style={{ fontSize: 15.5, fontWeight: 800, color: "#0f0f0f", margin: "0 0 8px" }}>{step.label}</h3>
                  <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.65, margin: 0, fontWeight: 400 }}>{step.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══ SPONSORS ═══ */}
        <section>
          <h2 style={{ fontSize: 14, fontWeight: 700, textAlign: "center", color: "#c4c4c4", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 24 }}>
            Trusted Partners
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 10 }}>
            {SPONSORS.map((s, i) => (
              <div key={i} style={{
                padding: "10px 22px", borderRadius: 50,
                background: "#fff", border: "1px solid #ececec",
                fontSize: 13, fontWeight: 700, color: "#6b7280",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                transition: "all 0.18s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent)"; e.currentTarget.style.color = "var(--color-primary,#4f46e5)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#ececec"; e.currentTarget.style.color = "#6b7280"; }}
              >
                {s}
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;