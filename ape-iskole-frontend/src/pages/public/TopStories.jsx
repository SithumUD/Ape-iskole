import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ApiStory from "../../services/ApiStory";
import { toast } from "react-hot-toast";
import {
  Search, LayoutGrid, List, Eye, Heart, MessageCircle,
  BookOpen, Sparkles, Zap, ArrowRight, X, SlidersHorizontal,
  ChevronDown, Clock, User, Newspaper, Trophy, Palette,
  Microscope, Star, TrendingUp, Calendar, Flame
} from "lucide-react";

/* ── helpers ── */
const formatDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const calculateReadTime = (content) => {
  if (!content) return "3 min";
  const words = content.trim().split(/\s+/).length;
  return `${Math.ceil(words / 200)} min`;
};

const CATEGORY_META = {
  "Big Match":   { icon: Trophy,      color: "#d97706", bg: "#fffbeb" },
  Achievement:   { icon: Star,        color: "#059669", bg: "#ecfdf5" },
  Carnival:      { icon: Sparkles,    color: "#db2777", bg: "#fdf2f8" },
  Donation:      { icon: Heart,       color: "#2563eb", bg: "#eff6ff" },
  Anniversary:   { icon: Calendar,    color: "#7c3aed", bg: "#f5f3ff" },
  Science:       { icon: Microscope,  color: "#0891b2", bg: "#ecfeff" },
  News:          { icon: Newspaper,   color: "#6b7280", bg: "#f9fafb" },
  Art:           { icon: Palette,     color: "#7c3aed", bg: "#f5f3ff" },
};
const getCatMeta = (c) => CATEGORY_META[c] || CATEGORY_META.News;

const SORT_OPTIONS = [
  { value: "latest",         label: "Latest First"    },
  { value: "oldest",         label: "Oldest First"    },
  { value: "popular",        label: "Most Popular"    },
  { value: "most_liked",     label: "Most Liked"      },
  { value: "most_commented", label: "Most Discussed"  },
];

const CATEGORIES = [
  "All Stories", "Big Match", "Achievement", "Carnival",
  "Donation", "Anniversary", "Science", "News",
];

/* ── Skeleton ── */
const Skeleton = ({ h = 200, r = 16 }) => (
  <div style={{
    height: h, borderRadius: r,
    background: "linear-gradient(90deg,#f3f4f6 25%,#e9eaec 50%,#f3f4f6 75%)",
    backgroundSize: "200% 100%", animation: "shimmer 1.6s infinite",
  }} />
);

/* ── FilterSelect ── */
const FilterSelect = ({ label, value, onChange, options }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 160 }}>
    <label style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</label>
    <div style={{ position: "relative" }}>
      <select
        value={value} onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", appearance: "none", WebkitAppearance: "none",
          padding: "10px 36px 10px 14px", borderRadius: 12,
          border: "1.5px solid #e5e7eb", background: "#fff",
          fontSize: 13.5, fontWeight: 600, color: "#374151",
          cursor: "pointer", outline: "none", fontFamily: "inherit", transition: "border-color 0.18s",
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

/* ── Stats row (views / likes / comments) ── */
const StoryStats = ({ story, color = "#9ca3af" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
    {[
      { Icon: Eye,           val: story.views        || 0 },
      { Icon: Heart,         val: story.likes        || 0 },
      { Icon: MessageCircle, val: story.commentCount || 0 },
    ].map(({ Icon, val }, i) => (
      <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color, fontWeight: 600 }}>
        <Icon size={13} strokeWidth={2} />{val.toLocaleString()}
      </span>
    ))}
  </div>
);

/* ── Story Card (Grid) ── */
const StoryCard = ({ story, onClick }) => {
  const meta = getCatMeta(story.category);
  const Icon = meta.icon;
  const rt   = calculateReadTime(story.content);

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
      <div style={{ position: "relative", height: 200, overflow: "hidden", flexShrink: 0 }}>
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
          fontSize: 11.5, fontWeight: 700, color: meta.color, background: meta.bg,
          padding: "4px 10px", borderRadius: 50,
        }}>
          <Icon size={11} strokeWidth={2.5} />{story.category}
        </span>
        {story.isFeatured && (
          <span style={{
            position: "absolute", top: 14, right: 14,
            fontSize: 10.5, fontWeight: 800, color: "#92400e", background: "#fef3c7",
            padding: "4px 9px", borderRadius: 50,
          }}>FEATURED</span>
        )}
        <span style={{
          position: "absolute", bottom: 14, right: 14,
          display: "flex", alignItems: "center", gap: 4,
          fontSize: 11, fontWeight: 700, color: "#fff",
          background: "rgba(0,0,0,0.45)", padding: "3px 9px", borderRadius: 50,
        }}>
          <Clock size={11} strokeWidth={2} />{rt} read
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af" }}>{story.schoolName}</span>
          <span style={{ fontSize: 11, color: "#c4c4c4", fontWeight: 500 }}>{formatDate(story.createdAt)}</span>
        </div>
        <h3 style={{
          fontSize: 16, fontWeight: 800, color: "#0f0f0f", lineHeight: 1.4, margin: "0 0 8px",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {story.title}
        </h3>
        <p style={{
          fontSize: 13, color: "#6b7280", lineHeight: 1.65, margin: "0 0 12px",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {story.description}
        </p>

        {/* Author */}
        {story.authorName && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 12 }}>
            <div style={{ width: 22, height: 22, borderRadius: "50%", background: "color-mix(in srgb,var(--color-primary,#4f46e5) 10%,transparent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={11} color="var(--color-primary,#4f46e5)" strokeWidth={2} />
            </div>
            <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 600 }}>{story.authorName}</span>
          </div>
        )}

        <StoryStats story={story} />

        {/* Tags */}
        {story.tags?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 10 }}>
            {story.tags.slice(0, 3).map((tag, i) => (
              <span key={i} style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>#{tag}</span>
            ))}
          </div>
        )}

        <button style={{
          marginTop: "auto", marginTop: 16,
          width: "100%", padding: "10px", borderRadius: 12,
          border: "1.5px solid color-mix(in srgb,var(--color-primary,#4f46e5) 25%,transparent)",
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

/* ── Story Row (List) ── */
const StoryRow = ({ story, onClick }) => {
  const meta = getCatMeta(story.category);
  const Icon = meta.icon;
  const rt   = calculateReadTime(story.content);

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
          src={story.image || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600"}
          alt={story.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
          onMouseLeave={e => e.currentTarget.style.transform = ""}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 70%, rgba(0,0,0,0.06))" }} />
        <span style={{
          position: "absolute", top: 12, left: 12,
          display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 11.5, fontWeight: 700, color: meta.color, background: meta.bg,
          padding: "4px 10px", borderRadius: 50,
        }}>
          <Icon size={11} strokeWidth={2.5} />{story.category}
        </span>
        {story.isFeatured && (
          <span style={{ position: "absolute", bottom: 12, left: 12, fontSize: 10.5, fontWeight: 800, color: "#92400e", background: "#fef3c7", padding: "3px 9px", borderRadius: 50 }}>
            FEATURED
          </span>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 8 }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af" }}>{story.schoolName}</span>
            <h3 style={{
              fontSize: 16, fontWeight: 800, color: "#0f0f0f", lineHeight: 1.35, margin: "4px 0 0",
              display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {story.title}
            </h3>
          </div>
          <span style={{ fontSize: 11, color: "#c4c4c4", fontWeight: 500, flexShrink: 0 }}>{formatDate(story.createdAt)}</span>
        </div>

        <p style={{
          fontSize: 13, color: "#6b7280", lineHeight: 1.65, margin: "0 0 12px",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {story.description}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 20px", marginBottom: 14 }}>
          {story.authorName && (
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6b7280", fontWeight: 600 }}>
              <User size={12} strokeWidth={2} color="#9ca3af" />{story.authorName}
            </span>
          )}
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>
            <Clock size={12} strokeWidth={2} />{rt} read
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <StoryStats story={story} />
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
            <BookOpen size={14} strokeWidth={2.5} /> Read Story
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Featured Hero Card ── */
const FeaturedHero = ({ story, onClick }) => {
  const meta = getCatMeta(story.category);
  const Icon = meta.icon;
  const rt   = calculateReadTime(story.content);

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
        src={story.image || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200"}
        alt={story.title}
        style={{ width: "100%", height: 380, objectFit: "cover", display: "block", transition: "transform 0.6s" }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
        onMouseLeave={e => e.currentTarget.style.transform = ""}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)" }} />

      <div style={{ position: "absolute", top: 18, left: 18, display: "flex", gap: 8 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 11.5, fontWeight: 700, color: meta.color, background: meta.bg,
          padding: "4px 10px", borderRadius: 50,
        }}>
          <Icon size={11} strokeWidth={2.5} />{story.category}
        </span>
        <span style={{ fontSize: 10.5, fontWeight: 800, color: "#92400e", background: "#fef3c7", padding: "4px 9px", borderRadius: 50 }}>
          ⭐ FEATURED
        </span>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 28px" }}>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 600, margin: "0 0 6px" }}>{story.schoolName}</p>
        <h3 style={{ fontSize: "clamp(20px,3vw,28px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.4px", margin: "0 0 8px", lineHeight: 1.25 }}>
          {story.title}
        </h3>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, margin: "0 0 16px", maxWidth: 680 }}>
          {story.description}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <StoryStats story={story} color="rgba(255,255,255,0.75)" />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>
              <Clock size={13} strokeWidth={2} />{rt} read
            </span>
            <button style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "10px 20px", borderRadius: 50, border: "none",
              background: "#fff", color: "var(--color-primary,#4f46e5)",
              fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
            }}>
              Read Full Story <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Trending card ── */
const TrendingCard = ({ story, rank, onClick }) => {
  const meta = getCatMeta(story.category);
  const Icon = meta.icon;
  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff", borderRadius: 16, border: "1px solid #f0f0f0",
        padding: "18px 20px", cursor: "pointer", transition: "all 0.22s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)", display: "flex", gap: 14, alignItems: "flex-start",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; }}
    >
      <span style={{
        fontSize: 18, fontWeight: 900, color: rank <= 3 ? "var(--color-primary,#4f46e5)" : "#d1d5db",
        minWidth: 24, lineHeight: 1, letterSpacing: "-0.5px", flexShrink: 0, marginTop: 2,
      }}>
        {String(rank).padStart(2, "0")}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          fontSize: 10.5, fontWeight: 700, color: meta.color, background: meta.bg,
          padding: "2px 8px", borderRadius: 50, marginBottom: 6,
        }}>
          <Icon size={10} strokeWidth={2.5} />{story.category}
        </span>
        <h4 style={{
          fontSize: 13.5, fontWeight: 800, color: "#0f0f0f", lineHeight: 1.35, margin: "0 0 6px",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {story.title}
        </h4>
        <p style={{ fontSize: 11.5, color: "#9ca3af", fontWeight: 500, margin: "0 0 8px" }}>{story.schoolName}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {[
            { Icon: Eye,           val: story.views        || 0 },
            { Icon: MessageCircle, val: story.commentCount || 0 },
          ].map(({ Icon, val }, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11, color: "#9ca3af", fontWeight: 600 }}>
              <Icon size={11} strokeWidth={2} />{val.toLocaleString()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Section head ── */
const SectionHead = ({ label, title, sub }) => (
  <div style={{ marginBottom: 28 }}>
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
);

/* ── Empty state ── */
const Empty = ({ onClear }) => (
  <div style={{ textAlign: "center", padding: "64px 24px", background: "#fff", borderRadius: 20, border: "1px solid #f0f0f0" }}>
    <div style={{ width: 60, height: 60, borderRadius: 16, background: "#f7f7f8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
      <Search size={26} color="#d1d5db" strokeWidth={1.8} />
    </div>
    <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f0f0f", margin: "0 0 8px" }}>No stories found</h3>
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
   TOP STORIES PAGE
═══════════════════════════════════ */
const TopStories = () => {
  const navigate = useNavigate();
  const [stories, setStories]               = useState([]);
  const [loading, setLoading]               = useState(true);
  const [search, setSearch]                 = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Stories");
  const [sortBy, setSortBy]                 = useState("latest");
  const [viewMode, setViewMode]             = useState("grid");
  const [showFilters, setShowFilters]       = useState(false);
  const [dateRange, setDateRange]           = useState({ start: "", end: "" });

  const fetchStories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ApiStory.getStories({ isPublished: true });
      setStories(response.data);
    } catch (err) {
      toast.error("Failed to load stories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStories(); }, [fetchStories]);

  const filteredStories = useMemo(() => {
    let list = stories.filter(s => {
      const q = search.toLowerCase();
      const matchSearch = !search || [s.title, s.schoolName, s.description, s.authorName, s.content]
        .some(f => f?.toLowerCase().includes(q));
      const matchCat  = selectedCategory === "All Stories" || s.category === selectedCategory;
      const d = s.createdAt?.split("T")[0] || "";
      const matchDate = (!dateRange.start || d >= dateRange.start) && (!dateRange.end || d <= dateRange.end);
      return matchSearch && matchCat && matchDate;
    });

    list.sort((a, b) => {
      switch (sortBy) {
        case "latest":         return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":         return new Date(a.createdAt) - new Date(b.createdAt);
        case "popular":        return (b.views        || 0) - (a.views        || 0);
        case "most_liked":     return (b.likes        || 0) - (a.likes        || 0);
        case "most_commented": return (b.commentCount || 0) - (a.commentCount || 0);
        default:               return 0;
      }
    });
    return list;
  }, [stories, search, selectedCategory, sortBy, dateRange]);

  const isFiltered      = search || selectedCategory !== "All Stories" || dateRange.start || dateRange.end;
  const featuredStories = filteredStories.filter(s => s.isFeatured);
  const regularStories  = isFiltered ? filteredStories : filteredStories.filter(s => !s.isFeatured);
  const showFeatured    = featuredStories.length > 0 && !isFiltered;
  const hasFilters      = isFiltered;

  const clearFilters = () => {
    setSearch(""); setSelectedCategory("All Stories");
    setDateRange({ start: "", end: "" }); setShowFilters(false);
  };

  const totalViews = stories.reduce((s, x) => s + (x.views || 0), 0);
  const totalLikes = stories.reduce((s, x) => s + (x.likes || 0), 0);

  const categoryOptions = CATEGORIES.map(c => ({ value: c, label: c }));

  // Trending = top 4 by views from all stories
  const trendingStories = [...stories]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 4);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        .stories-page * { box-sizing: border-box; }
        .stories-page { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      <div className="stories-page" style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}>

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
              <Newspaper size={12} strokeWidth={2.5} /> School Stories Across Sri Lanka
            </span>
            <h1 style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 900, letterSpacing: "-1px", lineHeight: 1.15, margin: "0 0 18px" }}>
              Top{" "}
              <span style={{ color: "#fde68a" }}>Stories</span>
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.78)", lineHeight: 1.75, margin: "0 0 36px", fontWeight: 400, maxWidth: 520 }}>
              Discover the latest highlights, achievements, and events from schools across Sri Lanka. Stay updated with what's happening in education.
            </p>

            {/* Stats strip */}
            <div style={{
              display: "inline-flex", flexWrap: "wrap", gap: 2,
              background: "rgba(255,255,255,0.1)", borderRadius: 16,
              backdropFilter: "blur(8px)", overflow: "hidden",
            }}>
              {[
                { icon: Newspaper, label: "Total Stories", val: loading ? null : `${stories.length}+` },
                { icon: Eye,       label: "Total Views",   val: loading ? null : `${totalViews.toLocaleString()}` },
                { icon: Heart,     label: "Total Likes",   val: loading ? null : `${totalLikes.toLocaleString()}` },
              ].map(({ icon: Icon, label, val }, i) => (
                <div key={i} style={{ padding: "18px 24px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.12)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <Icon size={14} strokeWidth={2} color="rgba(255,255,255,0.6)" />
                    <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</span>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.5px" }}>
                    {val ?? <span style={{ display: "inline-block", width: 70, height: 22, borderRadius: 6, background: "rgba(255,255,255,0.15)", animation: "shimmer 1.6s infinite", backgroundSize: "200% 100%" }} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

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
                  placeholder="Title, school, author or content…"
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

            <FilterSelect label="Category" value={selectedCategory} onChange={setSelectedCategory} options={categoryOptions} />
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
                    key={id} onClick={() => setViewMode(id)}
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
                padding: "10px 16px", borderRadius: 12,
                border: showFilters ? "1.5px solid color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent)" : "1.5px solid #e5e7eb",
                background: showFilters ? "color-mix(in srgb,var(--color-primary,#4f46e5) 7%,transparent)" : "#fff",
                color: showFilters ? "var(--color-primary,#4f46e5)" : "#374151",
                fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              <SlidersHorizontal size={14} strokeWidth={2.2} /> Filters
              {hasFilters && (
                <span style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--color-primary,#4f46e5)", color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>!</span>
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

          {/* Advanced — date range */}
          {showFilters && (
            <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid #f3f4f6", display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase" }}>Date Range</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["start","end"].map(key => (
                    <input
                      key={key} type="date"
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
              {filteredStories.length.toLocaleString()} {filteredStories.length === 1 ? "Story" : "Stories"}
            </span>
            {hasFilters && (
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--color-primary,#4f46e5)", background: "color-mix(in srgb,var(--color-primary,#4f46e5) 9%,transparent)", padding: "3px 10px", borderRadius: 50 }}>Filtered</span>
            )}
          </div>
        )}

        {/* ═══ LOADING ═══ */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ borderRadius: 20, overflow: "hidden", background: "#fff", border: "1px solid #f0f0f0" }}>
                <Skeleton h={200} r={0} />
                <div style={{ padding: "18px 20px 20px" }}>
                  <Skeleton h={12} r={4} />
                  <div style={{ marginTop: 10 }}><Skeleton h={20} r={6} /></div>
                  <div style={{ marginTop: 8 }}><Skeleton h={13} r={4} /></div>
                  <div style={{ marginTop: 8 }}><Skeleton h={13} r={4} /></div>
                </div>
              </div>
            ))}
          </div>

        ) : filteredStories.length === 0 ? (
          <Empty onClear={clearFilters} />

        ) : (
          <>
            {/* ═══ FEATURED HERO ═══ */}
            {showFeatured && featuredStories.slice(0, 1).map(s => (
              <section key={s.id} style={{ marginBottom: 48 }}>
                <SectionHead label="Editor's Pick" title="Featured Story" sub="Hand-picked by the Ape Iskole team" />
                <FeaturedHero story={s} onClick={() => navigate(`/stories/${s.id}`)} />
              </section>
            ))}

            {/* ═══ STORIES ═══ */}
            <section style={{ marginBottom: 56 }}>
              {showFeatured && (
                <SectionHead label="Latest" title="All Stories" sub="Browse stories from schools across Sri Lanka" />
              )}

              {viewMode === "grid" ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
                  {regularStories.map(s => (
                    <StoryCard key={s.id} story={s} onClick={() => navigate(`/stories/${s.id}`)} />
                  ))}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {regularStories.map(s => (
                    <StoryRow key={s.id} story={s} onClick={() => navigate(`/stories/${s.id}`)} />
                  ))}
                </div>
              )}
            </section>

            {/* ═══ TRENDING ═══ */}
            {!isFiltered && trendingStories.length > 0 && (
              <section>
                <SectionHead
                  label="Trending"
                  title="Most Popular Stories"
                  sub="The most-viewed stories from this week"
                />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
                  {trendingStories.map((s, i) => (
                    <TrendingCard key={s.id} story={s} rank={i + 1} onClick={() => navigate(`/stories/${s.id}`)} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default TopStories;