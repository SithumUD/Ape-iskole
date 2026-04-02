import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiEvent from "../../services/ApiEvent";
import {
  Search, LayoutGrid, List, Calendar, MapPin, Ticket,
  Eye, Heart, Star, Sparkles, Zap, Clock, SlidersHorizontal,
  X, ArrowRight, Filter, Dumbbell, Trophy, Palette, Music,
  Microscope, Newspaper, BookOpen, GraduationCap, ChevronDown,
  CalendarCheck
} from "lucide-react";

/* ── helpers ── */
const formatDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const formatTime = (t) => {
  if (!t) return "";
  if (t.includes("AM") || t.includes("PM")) return t;
  const [h, m] = t.split(":");
  const date = new Date();
  date.setHours(parseInt(h), parseInt(m));
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
};

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

const getEventPrice = (ev) => {
  if (!ev.enableTickets || !ev.ticketTypes?.length) return "Free";
  const min = Math.min(...ev.ticketTypes.map((t) => t.price));
  return min === 0 ? "Free" : `LKR ${min.toLocaleString()}`;
};

const getEventBooked = (ev) => {
  if (!ev.ticketTypes?.length) return { booked: 0, capacity: 0 };
  const cap   = ev.ticketTypes.reduce((s, t) => s + t.totalQuantity,     0);
  const avail = ev.ticketTypes.reduce((s, t) => s + t.availableQuantity, 0);
  return { booked: cap - avail, capacity: cap };
};

const SORT_OPTIONS = [
  { value: "date_asc",    label: "Date (Earliest First)" },
  { value: "date_desc",   label: "Date (Latest First)"   },
  { value: "name_asc",    label: "Name (A–Z)"            },
  { value: "name_desc",   label: "Name (Z–A)"            },
  { value: "popularity",  label: "Most Popular"          },
];

const CATEGORIES = [
  "All Categories", "Sports", "Big Match", "Art", "Concert",
  "Science", "Academic", "Carnival", "Cultural",
];

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
const SectionHead = ({ label, title, sub, onViewAll }) => (
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
        View all <ArrowRight size={15} strokeWidth={2.5} />
      </button>
    )}
  </div>
);

/* ── FilterSelect ── */
const FilterSelect = ({ label, value, onChange, options }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 160 }}>
    <label style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</label>
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", appearance: "none", WebkitAppearance: "none",
          padding: "10px 36px 10px 14px", borderRadius: 12,
          border: "1.5px solid #e5e7eb", background: "#fff",
          fontSize: 13.5, fontWeight: 600, color: "#374151",
          cursor: "pointer", outline: "none", fontFamily: "inherit",
          transition: "border-color 0.18s",
        }}
        onFocus={e => e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"}
        onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown size={14} color="#9ca3af" strokeWidth={2.5} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
    </div>
  </div>
);

/* ── Event Card (Grid) ── */
const EventCard = ({ event, onClick }) => {
  const meta  = getCatMeta(event.category);
  const Icon  = meta.icon;
  const { booked, capacity } = getEventBooked(event);
  const pct   = capacity > 0 ? Math.min((booked / capacity) * 100, 100) : 0;
  const price = getEventPrice(event);
  const isFree = price === "Free";

  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff", borderRadius: 20, border: "1px solid #f0f0f0",
        overflow: "hidden", cursor: "pointer", transition: "all 0.25s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 190, overflow: "hidden", flexShrink: 0 }}>
        <img
          src={event.image || "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600"}
          alt={event.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
          onMouseLeave={e => e.currentTarget.style.transform = ""}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)" }} />
        {/* Category badge */}
        <span style={{
          position: "absolute", top: 14, left: 14,
          display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 11.5, fontWeight: 700,
          color: meta.color, background: meta.bg,
          padding: "4px 10px", borderRadius: 50,
        }}>
          <Icon size={11} strokeWidth={2.5} />{event.category}
        </span>
        {/* Featured */}
        {event.isFeatured && (
          <span style={{
            position: "absolute", top: 14, right: 14,
            fontSize: 10.5, fontWeight: 800, letterSpacing: "0.06em",
            color: "#92400e", background: "#fef3c7",
            padding: "4px 9px", borderRadius: 50,
          }}>FEATURED</span>
        )}
        {/* Price */}
        <span style={{
          position: "absolute", bottom: 14, right: 14,
          fontSize: 13, fontWeight: 800,
          color: isFree ? "#065f46" : "#1e3a8a",
          background: isFree ? "#d1fae5" : "#dbeafe",
          padding: "5px 12px", borderRadius: 50,
        }}>{price}</span>
      </div>

      {/* Body */}
      <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h3 style={{
          fontSize: 15.5, fontWeight: 800, color: "#0f0f0f", lineHeight: 1.4,
          margin: "0 0 6px", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {event.title}
        </h3>
        <p style={{ fontSize: 12.5, fontWeight: 600, color: "#9ca3af", margin: "0 0 12px" }}>{event.schoolName}</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 14 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "#4b5563", fontWeight: 500 }}>
            <Calendar size={13} strokeWidth={2} color="var(--color-primary,#4f46e5)" />
            {formatDate(event.date)}{event.time ? ` · ${formatTime(event.time)}` : ""}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, color: "#4b5563", fontWeight: 500 }}>
            <MapPin size={13} strokeWidth={2} color="var(--color-primary,#4f46e5)" />
            {event.venue || event.location || "TBA"}
          </span>
        </div>

        {/* Capacity bar */}
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

        {/* Amenity pills */}
        {(event.parkingAvailable || event.foodAvailable || event.wheelchairAccessible) && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {event.parkingAvailable && (
              <span style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", background: "#f3f4f6", padding: "3px 9px", borderRadius: 50 }}>🅿️ Parking</span>
            )}
            {event.foodAvailable && (
              <span style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", background: "#f3f4f6", padding: "3px 9px", borderRadius: 50 }}>🍔 Food</span>
            )}
            {event.wheelchairAccessible && (
              <span style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", background: "#f3f4f6", padding: "3px 9px", borderRadius: 50 }}>♿ Accessible</span>
            )}
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

/* ── Event Row (List) ── */
const EventRow = ({ event, onClick }) => {
  const meta  = getCatMeta(event.category);
  const Icon  = meta.icon;
  const price = getEventPrice(event);
  const isFree = price === "Free";

  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff", borderRadius: 18, border: "1px solid #f0f0f0",
        overflow: "hidden", cursor: "pointer", transition: "all 0.25s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)", display: "flex",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; }}
    >
      {/* Thumbnail */}
      <div style={{ width: 220, flexShrink: 0, position: "relative", overflow: "hidden" }}>
        <img
          src={event.image || "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600"}
          alt={event.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
          onMouseLeave={e => e.currentTarget.style.transform = ""}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 70%, rgba(0,0,0,0.08))" }} />
        <span style={{
          position: "absolute", top: 12, left: 12,
          display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 11.5, fontWeight: 700,
          color: meta.color, background: meta.bg,
          padding: "4px 10px", borderRadius: 50,
        }}>
          <Icon size={11} strokeWidth={2.5} />{event.category}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            {event.isFeatured && (
              <span style={{
                fontSize: 10.5, fontWeight: 800, letterSpacing: "0.06em",
                color: "#92400e", background: "#fef3c7",
                padding: "3px 9px", borderRadius: 50, marginBottom: 6, display: "inline-block",
              }}>FEATURED</span>
            )}
            <h3 style={{
              fontSize: 16, fontWeight: 800, color: "#0f0f0f", lineHeight: 1.35,
              margin: "0 0 4px", display: "-webkit-box",
              WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {event.title}
            </h3>
            <p style={{ fontSize: 12.5, fontWeight: 600, color: "#9ca3af", margin: 0 }}>{event.schoolName}</p>
          </div>
          <span style={{
            flexShrink: 0, fontSize: 13, fontWeight: 800,
            color: isFree ? "#065f46" : "#1e3a8a",
            background: isFree ? "#d1fae5" : "#dbeafe",
            padding: "5px 14px", borderRadius: 50,
          }}>{price}</span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px", marginBottom: 14 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#4b5563", fontWeight: 500 }}>
            <Calendar size={13} strokeWidth={2} color="var(--color-primary,#4f46e5)" />
            {formatDate(event.date)}{event.time ? ` · ${formatTime(event.time)}` : ""}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#4b5563", fontWeight: 500 }}>
            <MapPin size={13} strokeWidth={2} color="var(--color-primary,#4f46e5)" />
            {event.venue || event.location || "TBA"}
          </span>
        </div>

        <p style={{
          fontSize: 13, color: "#6b7280", lineHeight: 1.65, margin: "0 0 14px",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {event.shortDescription || event.description}
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {event.parkingAvailable && (
              <span style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", background: "#f3f4f6", padding: "3px 9px", borderRadius: 50 }}>🅿️ Parking</span>
            )}
            {event.foodAvailable && (
              <span style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", background: "#f3f4f6", padding: "3px 9px", borderRadius: 50 }}>🍔 Food</span>
            )}
            {event.wheelchairAccessible && (
              <span style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", background: "#f3f4f6", padding: "3px 9px", borderRadius: 50 }}>♿ Accessible</span>
            )}
          </div>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "9px 20px", borderRadius: 50, border: "none",
            background: "linear-gradient(135deg, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))",
            color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
            boxShadow: "0 4px 12px color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent)",
            transition: "opacity 0.18s", fontFamily: "inherit", flexShrink: 0,
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            <Ticket size={14} strokeWidth={2.5} /> Book Tickets
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Featured Hero Card ── */
const FeaturedCard = ({ event, onClick }) => {
  const meta = getCatMeta(event.category);
  const Icon = meta.icon;
  const price = getEventPrice(event);
  const isFree = price === "Free";

  return (
    <div
      onClick={onClick}
      style={{
        position: "relative", borderRadius: 22, overflow: "hidden",
        cursor: "pointer", boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        transition: "all 0.3s",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 48px rgba(0,0,0,0.18)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.12)"; }}
    >
      <img
        src={event.image || "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800"}
        alt={event.title}
        style={{ width: "100%", height: 300, objectFit: "cover", display: "block", transition: "transform 0.6s" }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
        onMouseLeave={e => e.currentTarget.style.transform = ""}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)" }} />

      <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 8 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 11.5, fontWeight: 700, color: meta.color, background: meta.bg,
          padding: "4px 10px", borderRadius: 50,
        }}>
          <Icon size={11} strokeWidth={2.5} />{event.category}
        </span>
        <span style={{
          fontSize: 10.5, fontWeight: 800, letterSpacing: "0.06em",
          color: "#92400e", background: "#fef3c7",
          padding: "4px 9px", borderRadius: 50,
        }}>⭐ FEATURED</span>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 22px" }}>
        <h3 style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.3px", margin: "0 0 6px", lineHeight: 1.3 }}>
          {event.title}
        </h3>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 500, margin: "0 0 12px" }}>
          {event.schoolName} · {formatDate(event.date)}{event.time ? ` · ${formatTime(event.time)}` : ""}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{
            fontSize: 13, fontWeight: 800,
            color: isFree ? "#065f46" : "#1e3a8a",
            background: isFree ? "#d1fae5" : "#dbeafe",
            padding: "5px 14px", borderRadius: 50,
          }}>{price}</span>
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "9px 18px", borderRadius: 50, border: "none",
            background: "#fff", color: "var(--color-primary,#4f46e5)",
            fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
          }}>
            View Event <ArrowRight size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Empty state ── */
const Empty = ({ onClear }) => (
  <div style={{ textAlign: "center", padding: "64px 24px", background: "#fff", borderRadius: 20, border: "1px solid #f0f0f0" }}>
    <div style={{ width: 60, height: 60, borderRadius: 16, background: "#f7f7f8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
      <Search size={26} color="#d1d5db" strokeWidth={1.8} />
    </div>
    <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f0f0f", margin: "0 0 8px" }}>No events found</h3>
    <p style={{ fontSize: 14, color: "#9ca3af", margin: "0 0 20px" }}>Try adjusting your search or filter criteria</p>
    <button
      onClick={onClear}
      style={{
        padding: "11px 24px", borderRadius: 50, border: "none",
        background: "linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed))",
        color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit",
      }}
    >
      Clear all filters
    </button>
  </div>
);

/* ═══════════════════════════════════
   EVENTS PAGE
═══════════════════════════════════ */
const Events = () => {
  const navigate = useNavigate();
  const [events, setEvents]                 = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [search, setSearch]                 = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [dateRange, setDateRange]           = useState({ start: "", end: "" });
  const [eventType, setEventType]           = useState("All");
  const [sortBy, setSortBy]                 = useState("date_asc");
  const [viewMode, setViewMode]             = useState("grid");
  const [showFilters, setShowFilters]       = useState(false);

  useEffect(() => {
    const t = setTimeout(fetchEvents, 400);
    return () => clearTimeout(t);
  }, [search, selectedCategory, dateRange]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {
        search:    search || undefined,
        category:  selectedCategory === "All Categories" ? undefined : selectedCategory,
        startDate: dateRange.start || undefined,
        endDate:   dateRange.end   || undefined,
      };
      const response = await ApiEvent.getEvents(params);
      setEvents(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const processedEvents = useMemo(() => {
    let list = events.map(ev => ({
      ...ev,
      computedRegisteredCount: ev.ticketTypes?.reduce((s, t) => s + (t.totalQuantity - t.availableQuantity), 0) || 0,
    })).filter(ev => {
      if (eventType === "Free")  return ev.isFree;
      if (eventType === "Paid")  return !ev.isFree;
      return true;
    });

    list.sort((a, b) => {
      switch (sortBy) {
        case "date_asc":   return new Date(a.date) - new Date(b.date);
        case "date_desc":  return new Date(b.date) - new Date(a.date);
        case "name_asc":   return a.title.localeCompare(b.title);
        case "name_desc":  return b.title.localeCompare(a.title);
        case "popularity": return b.computedRegisteredCount - a.computedRegisteredCount;
        default:           return 0;
      }
    });
    return list;
  }, [events, eventType, sortBy]);

  const featuredEvents = processedEvents.filter(ev => ev.isFeatured);
  const showFeatured   = featuredEvents.length > 0 && !search && selectedCategory === "All Categories";

  const clearFilters = () => {
    setSearch(""); setSelectedCategory("All Categories");
    setDateRange({ start: "", end: "" }); setEventType("All");
    setShowFilters(false);
  };

  const hasFilters = search || selectedCategory !== "All Categories" || dateRange.start || dateRange.end || eventType !== "All";

  const categoryOptions = CATEGORIES.map(c => ({ value: c, label: c }));
  const typeOptions     = [
    { value: "All",  label: "All Events"  },
    { value: "Free", label: "Free Events" },
    { value: "Paid", label: "Paid Events" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        .events-page * { box-sizing: border-box; }
        .events-page { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      <div className="events-page" style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* ═══ HERO ═══ */}
        <div style={{
          position: "relative", borderRadius: 24, overflow: "hidden",
          background: "linear-gradient(135deg, #1e1b4b 0%, var(--color-primary,#4f46e5) 45%, var(--color-secondary,#7c3aed) 100%)",
          padding: "64px 48px", marginBottom: 32, color: "#fff",
          animation: "fadeUp 0.6s ease both",
        }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 360, height: 360, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, left: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1, maxWidth: 640 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20,
              fontSize: 11.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#c7d2fe", background: "rgba(255,255,255,0.12)",
              padding: "5px 14px", borderRadius: 50,
            }}>
              <Sparkles size={12} strokeWidth={2.5} /> School Events Across Sri Lanka
            </span>
            <h1 style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 900, letterSpacing: "-1px", lineHeight: 1.15, margin: "0 0 18px" }}>
              Discover &amp;{" "}
              <span style={{ color: "#fde68a" }}>Participate</span>
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.78)", lineHeight: 1.75, margin: "0 0 36px", fontWeight: 400, maxWidth: 520 }}>
              Exciting competitions, cultural shows, carnivals, and more from schools all across the island.
            </p>

            {/* Stats */}
            <div style={{
              display: "inline-flex", flexWrap: "wrap", gap: 2,
              background: "rgba(255,255,255,0.1)", borderRadius: 16,
              backdropFilter: "blur(8px)", overflow: "hidden",
            }}>
              {[
                { icon: CalendarCheck, label: "Active Events", val: `${events.length}+` },
                { icon: Ticket,        label: "Free Events",   val: `${events.filter(e => e.isFree).length}+` },
              ].map(({ icon: Icon, label, val }, i) => (
                <div key={i} style={{ padding: "18px 28px", borderRight: i === 0 ? "1px solid rgba(255,255,255,0.12)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <Icon size={14} strokeWidth={2} color="rgba(255,255,255,0.6)" />
                    <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</span>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.5px" }}>
                    {loading
                      ? <span style={{ display: "inline-block", width: 60, height: 24, borderRadius: 6, background: "rgba(255,255,255,0.15)", animation: "shimmer 1.6s infinite", backgroundSize: "200% 100%" }} />
                      : val}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ ERROR ═══ */}
        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 14, padding: "16px 20px", textAlign: "center", marginBottom: 32 }}>
            <p style={{ color: "#dc2626", fontWeight: 600, margin: "0 0 8px" }}>{error}</p>
            <button onClick={fetchEvents} style={{ color: "#b91c1c", fontWeight: 700, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontSize: 13 }}>Retry</button>
          </div>
        )}

        {/* ═══ FILTERS ═══ */}
        <div style={{
          background: "#fff", borderRadius: 18, border: "1px solid #f0f0f0",
          padding: "20px 24px", marginBottom: 20,
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "flex-end" }}>

            {/* Search */}
            <div style={{ flex: "1 1 240px", display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase" }}>Search</label>
              <div style={{ position: "relative" }}>
                <Search size={15} strokeWidth={2.2} color="#9ca3af" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input
                  type="text"
                  placeholder="Event name, school or description…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px 10px 40px",
                    borderRadius: 12, border: "1.5px solid #e5e7eb",
                    fontSize: 13.5, fontWeight: 500, color: "#374151",
                    outline: "none", fontFamily: "inherit", transition: "border-color 0.18s",
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"}
                  onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
                />
                {search && (
                  <button onClick={() => setSearch("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 2 }}>
                    <X size={14} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            </div>

            <FilterSelect label="Sort" value={sortBy} onChange={setSortBy} options={SORT_OPTIONS.map(o => ({ value: o.value, label: o.label }))} />

            {/* View toggle */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase" }}>View</label>
              <div style={{ display: "flex", gap: 4, background: "#f7f7f8", borderRadius: 12, padding: 4 }}>
                {[
                  { id: "grid", Icon: LayoutGrid, label: "Grid" },
                  { id: "list", Icon: List,        label: "List" },
                ].map(({ id, Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setViewMode(id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "8px 16px", borderRadius: 9, border: "none",
                      background: viewMode === id ? "#fff" : "transparent",
                      color: viewMode === id ? "var(--color-primary,#4f46e5)" : "#6b7280",
                      fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                      boxShadow: viewMode === id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                      transition: "all 0.18s",
                    }}
                  >
                    <Icon size={14} strokeWidth={2.2} />{label}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced filters toggle */}
            <button
              onClick={() => setShowFilters(v => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 6, alignSelf: "flex-end",
                padding: "10px 16px", borderRadius: 12, border: "1.5px solid #e5e7eb",
                background: showFilters ? "color-mix(in srgb,var(--color-primary,#4f46e5) 7%,transparent)" : "#fff",
                borderColor: showFilters ? "color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent)" : "#e5e7eb",
                color: showFilters ? "var(--color-primary,#4f46e5)" : "#374151",
                fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              <SlidersHorizontal size={14} strokeWidth={2.2} /> Filters
              {hasFilters && (
                <span style={{
                  width: 18, height: 18, borderRadius: "50%",
                  background: "var(--color-primary,#4f46e5)", color: "#fff",
                  fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center",
                }}>!</span>
              )}
            </button>

            {/* Clear */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                style={{
                  display: "flex", alignItems: "center", gap: 6, alignSelf: "flex-end",
                  padding: "10px 16px", borderRadius: 12, border: "1.5px solid #fecaca",
                  background: "#fef2f2", color: "#dc2626", fontWeight: 700, fontSize: 13,
                  cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
                }}
              >
                <X size={13} strokeWidth={2.5} /> Clear
              </button>
            )}
          </div>

          {/* Advanced filter panel */}
          {showFilters && (
            <div style={{
              marginTop: 18, paddingTop: 18, borderTop: "1px solid #f3f4f6",
              display: "flex", flexWrap: "wrap", gap: 16,
            }}>
              <FilterSelect label="Category" value={selectedCategory} onChange={setSelectedCategory} options={categoryOptions} />
              <FilterSelect label="Event Type" value={eventType} onChange={setEventType} options={typeOptions} />

              {/* Date range */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase" }}>Date Range</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["start","end"].map(key => (
                    <input
                      key={key}
                      type="date"
                      value={dateRange[key]}
                      onChange={e => setDateRange(prev => ({ ...prev, [key]: e.target.value }))}
                      style={{
                        padding: "10px 14px", borderRadius: 12, border: "1.5px solid #e5e7eb",
                        fontSize: 13, fontWeight: 500, color: "#374151",
                        outline: "none", fontFamily: "inherit", transition: "border-color 0.18s",
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"}
                      onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ═══ RESULTS COUNT ═══ */}
        {!loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#0f0f0f", letterSpacing: "-0.3px" }}>
              {processedEvents.length.toLocaleString()} {processedEvents.length === 1 ? "Event" : "Events"}
            </span>
            {hasFilters && (
              <span style={{
                fontSize: 11.5, fontWeight: 700, color: "var(--color-primary,#4f46e5)",
                background: "color-mix(in srgb,var(--color-primary,#4f46e5) 9%,transparent)",
                padding: "3px 10px", borderRadius: 50,
              }}>Filtered</span>
            )}
          </div>
        )}

        {/* ═══ LOADING ═══ */}
        {loading ? (
          <div>
            {viewMode === "grid" ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 20 }}>
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} style={{ borderRadius: 20, overflow: "hidden", background: "#fff", border: "1px solid #f0f0f0" }}>
                    <Skeleton h={190} r={0} />
                    <div style={{ padding: "18px 20px 20px" }}>
                      <Skeleton h={20} r={6} />
                      <div style={{ marginTop: 10 }}><Skeleton h={14} r={4} /></div>
                      <div style={{ marginTop: 8 }}><Skeleton h={14} r={4} /></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[1,2,3,4].map(i => (
                  <div key={i} style={{ borderRadius: 18, overflow: "hidden", background: "#fff", border: "1px solid #f0f0f0", display: "flex" }}>
                    <Skeleton h={140} r={0} />
                  </div>
                ))}
              </div>
            )}
          </div>

        ) : processedEvents.length === 0 ? (
          <Empty onClear={clearFilters} />

        ) : (
          <>
            {/* ═══ FEATURED ═══ */}
            {showFeatured && (
              <section style={{ marginBottom: 48 }}>
                <SectionHead label="Don't Miss" title="Featured Events" sub="Hand-picked highlights from across Sri Lanka" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 20 }}>
                  {featuredEvents.slice(0, 4).map(ev => (
                    <FeaturedCard key={ev.id} event={ev} onClick={() => navigate(`/events/${ev.id}`)} />
                  ))}
                </div>
              </section>
            )}

            {/* ═══ ALL EVENTS ═══ */}
            <section>
              {showFeatured && (
                <SectionHead label="Upcoming" title="All Events" sub="Browse and book from upcoming school events" />
              )}

              {viewMode === "grid" ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 20 }}>
                  {processedEvents.map(ev => (
                    <EventCard key={ev.id} event={ev} onClick={() => navigate(`/events/${ev.id}`)} />
                  ))}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {processedEvents.map(ev => (
                    <EventRow key={ev.id} event={ev} onClick={() => navigate(`/events/${ev.id}`)} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </>
  );
};

export default Events;