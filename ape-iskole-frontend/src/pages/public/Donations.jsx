import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiDonation from "../../services/ApiDonation";
import {
  Search, LayoutGrid, List, Heart, HandCoins, TrendingUp,
  Sparkles, Zap, ArrowRight, X, SlidersHorizontal, ChevronDown,
  Clock, Users, BookOpen, Building2, Dumbbell, GraduationCap,
  Target, Star, Calendar
} from "lucide-react";

/* ── helpers ── */
const formatLKR = (n) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(n || 0);

const calculateDaysLeft = (expiryDate) => {
  if (!expiryDate) return 0;
  const diff = new Date(expiryDate) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const CATEGORY_META = {
  Education:         { icon: BookOpen,      color: "#2563eb", bg: "#eff6ff" },
  Infrastructure:    { icon: Building2,     color: "#7c3aed", bg: "#f5f3ff" },
  Sports:            { icon: Dumbbell,      color: "#059669", bg: "#ecfdf5" },
  "Student Support": { icon: GraduationCap, color: "#d97706", bg: "#fffbeb" },
};
const getCatMeta = (c) => CATEGORY_META[c] || { icon: Target, color: "#6b7280", bg: "#f9fafb" };

const SORT_OPTIONS = [
  { value: "featured",  label: "Featured First"      },
  { value: "goal_high", label: "Goal (High to Low)"  },
  { value: "goal_low",  label: "Goal (Low to High)"  },
  { value: "days_asc",  label: "Ending Soon"         },
];

const CATEGORIES = ["All Categories", "Education", "Infrastructure", "Sports", "Student Support"];

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

/* ── Progress bar ── */
const ProgressBar = ({ pct }) => (
  <div style={{ height: 6, borderRadius: 50, background: "#f3f4f6", overflow: "hidden", margin: "8px 0" }}>
    <div style={{
      height: "100%", borderRadius: 50, width: `${Math.min(pct, 100)}%`,
      background: pct >= 100
        ? "#059669"
        : pct > 60
          ? "var(--color-primary,#4f46e5)"
          : "linear-gradient(90deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed))",
      transition: "width 0.6s",
    }} />
  </div>
);

/* ── Donation Card (Grid) ── */
const DonationCard = ({ campaign, onClick }) => {
  const meta = getCatMeta(campaign.category);
  const Icon = meta.icon;
  const pct  = campaign.goal > 0 ? Math.min(100, Math.round((campaign.raised / campaign.goal) * 100)) : 0;
  const urgent = campaign.daysLeft > 0 && campaign.daysLeft <= 10;

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
          src={campaign.image || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600"}
          alt={campaign.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
          onMouseLeave={e => e.currentTarget.style.transform = ""}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 55%)" }} />
        <span style={{
          position: "absolute", top: 14, left: 14,
          display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 11.5, fontWeight: 700, color: meta.color, background: meta.bg,
          padding: "4px 10px", borderRadius: 50,
        }}>
          <Icon size={11} strokeWidth={2.5} />{campaign.category}
        </span>
        {campaign.featured && (
          <span style={{
            position: "absolute", top: 14, right: 14,
            fontSize: 10.5, fontWeight: 800, color: "#92400e", background: "#fef3c7",
            padding: "4px 9px", borderRadius: 50,
          }}>FEATURED</span>
        )}
        {urgent && (
          <span style={{
            position: "absolute", bottom: 14, right: 14,
            fontSize: 11, fontWeight: 800, color: "#fff", background: "#ef4444",
            padding: "4px 10px", borderRadius: 50,
            animation: "pulse 1.5s ease-in-out infinite",
          }}>⏰ {campaign.daysLeft}d left</span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
        <p style={{ fontSize: 12.5, fontWeight: 600, color: "#9ca3af", margin: "0 0 6px" }}>{campaign.school}</p>
        <h3 style={{
          fontSize: 15.5, fontWeight: 800, color: "#0f0f0f", lineHeight: 1.4, margin: "0 0 8px",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {campaign.title}
        </h3>
        <p style={{
          fontSize: 13, color: "#6b7280", lineHeight: 1.65, margin: "0 0 14px",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {campaign.longDescription || campaign.description}
        </p>

        {/* Impact */}
        {campaign.impact && (
          <div style={{
            background: "color-mix(in srgb,var(--color-primary,#4f46e5) 6%,transparent)",
            border: "1px solid color-mix(in srgb,var(--color-primary,#4f46e5) 14%,transparent)",
            borderRadius: 12, padding: "10px 14px", marginBottom: 14,
          }}>
            <p style={{ fontSize: 10.5, fontWeight: 800, color: "var(--color-primary,#4f46e5)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>Impact</p>
            <p style={{ fontSize: 12.5, color: "#374151", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{campaign.impact}</p>
          </div>
        )}

        {/* Goal & progress */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Goal: {formatLKR(campaign.goal)}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: pct >= 100 ? "#059669" : "var(--color-primary,#4f46e5)" }}>{pct}%</span>
          </div>
          <ProgressBar pct={pct} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: "#9ca3af" }}>Raised: {formatLKR(campaign.raised)}</span>
            {campaign.daysLeft > 0 && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 600, color: "#9ca3af" }}>
                <Clock size={11} strokeWidth={2} />{campaign.daysLeft} days left
              </span>
            )}
          </div>
        </div>

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
          <Heart size={14} strokeWidth={2.5} /> Support Now
        </button>
      </div>
    </div>
  );
};

/* ── Donation Row (List) ── */
const DonationRow = ({ campaign, onClick }) => {
  const meta = getCatMeta(campaign.category);
  const Icon = meta.icon;
  const pct  = campaign.goal > 0 ? Math.min(100, Math.round((campaign.raised / campaign.goal) * 100)) : 0;

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
          src={campaign.image || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600"}
          alt={campaign.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s" }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
          onMouseLeave={e => e.currentTarget.style.transform = ""}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 70%, rgba(0,0,0,0.08))" }} />
        <span style={{
          position: "absolute", top: 12, left: 12,
          display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 11.5, fontWeight: 700, color: meta.color, background: meta.bg,
          padding: "4px 10px", borderRadius: 50,
        }}>
          <Icon size={11} strokeWidth={2.5} />{campaign.category}
        </span>
        {campaign.featured && (
          <span style={{
            position: "absolute", bottom: 12, left: 12,
            fontSize: 10.5, fontWeight: 800, color: "#92400e", background: "#fef3c7",
            padding: "3px 9px", borderRadius: 50,
          }}>FEATURED</span>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <p style={{ fontSize: 12.5, fontWeight: 600, color: "#9ca3af", margin: "0 0 4px" }}>{campaign.school}</p>
        <h3 style={{
          fontSize: 16, fontWeight: 800, color: "#0f0f0f", lineHeight: 1.35, margin: "0 0 8px",
          display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {campaign.title}
        </h3>
        <p style={{
          fontSize: 13, color: "#6b7280", lineHeight: 1.65, margin: "0 0 14px",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {campaign.longDescription || campaign.description}
        </p>

        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Goal: {formatLKR(campaign.goal)}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--color-primary,#4f46e5)" }}>{pct}% raised</span>
          </div>
          <ProgressBar pct={pct} />
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: "#9ca3af" }}>Raised: {formatLKR(campaign.raised)}</span>
            {campaign.daysLeft > 0 && (
              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 600, color: campaign.daysLeft <= 10 ? "#ef4444" : "#9ca3af" }}>
                <Clock size={11} strokeWidth={2} />{campaign.daysLeft} days left
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
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
            <Heart size={14} strokeWidth={2.5} /> Support Now
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Featured Hero Card ── */
const FeaturedCard = ({ campaign, onClick }) => {
  const meta = getCatMeta(campaign.category);
  const Icon = meta.icon;
  const pct  = campaign.goal > 0 ? Math.min(100, Math.round((campaign.raised / campaign.goal) * 100)) : 0;

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
        src={campaign.image || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800"}
        alt={campaign.title}
        style={{ width: "100%", height: 300, objectFit: "cover", display: "block", transition: "transform 0.6s" }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
        onMouseLeave={e => e.currentTarget.style.transform = ""}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)" }} />

      <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 8 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          fontSize: 11.5, fontWeight: 700, color: meta.color, background: meta.bg,
          padding: "4px 10px", borderRadius: 50,
        }}>
          <Icon size={11} strokeWidth={2.5} />{campaign.category}
        </span>
        <span style={{ fontSize: 10.5, fontWeight: 800, color: "#92400e", background: "#fef3c7", padding: "4px 9px", borderRadius: 50 }}>
          ⭐ FEATURED
        </span>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 22px" }}>
        <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", fontWeight: 600, margin: "0 0 4px" }}>{campaign.school}</p>
        <h3 style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.3px", margin: "0 0 10px", lineHeight: 1.3 }}>
          {campaign.title}
        </h3>
        {/* Progress */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ height: 5, borderRadius: 50, background: "rgba(255,255,255,0.2)", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 50, width: `${pct}%`, background: "#fff" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>Goal: {formatLKR(campaign.goal)}</span>
            <span style={{ fontSize: 12, color: "#fff", fontWeight: 800 }}>{pct}% raised</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {campaign.daysLeft > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>
              <Clock size={13} strokeWidth={2} />{campaign.daysLeft} days remaining
            </span>
          )}
          <button style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "9px 18px", borderRadius: 50, border: "none",
            background: "#fff", color: "var(--color-primary,#4f46e5)",
            fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
          }}>
            Support Campaign <ArrowRight size={14} strokeWidth={2.5} />
          </button>
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
    <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f0f0f", margin: "0 0 8px" }}>No campaigns found</h3>
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
   DONATIONS PAGE
═══════════════════════════════════ */
const Donations = () => {
  const navigate = useNavigate();
  const [donations, setDonations]           = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [search, setSearch]                 = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy]                 = useState("featured");
  const [viewMode, setViewMode]             = useState("grid");
  const [showFilters, setShowFilters]       = useState(false);
  const [minGoal, setMinGoal]               = useState("");
  const [maxGoal, setMaxGoal]               = useState("");

  useEffect(() => { fetchDonations(); }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const response = await ApiDonation.getDonations();
      setDonations(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load donation campaigns. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredDonations = useMemo(() => {
    let list = donations.map(d => ({
      ...d,
      school:   d.schoolName,
      goal:     d.goalAmount,
      raised:   d.raisedAmount,
      image:    d.image || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600",
      donors:   d.donorsCount,
      daysLeft: calculateDaysLeft(d.expiryDate),
      featured: d.isFeatured,
    })).filter(item => {
      const q = search.toLowerCase();
      const matchSearch = !search ||
        item.title?.toLowerCase().includes(q) ||
        item.school?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q);
      const matchCat  = selectedCategory === "All Categories" || item.category === selectedCategory;
      const matchMin  = !minGoal || item.goal >= Number(minGoal);
      const matchMax  = !maxGoal || item.goal <= Number(maxGoal);
      return matchSearch && matchCat && matchMin && matchMax;
    });

    list.sort((a, b) => {
      switch (sortBy) {
        case "featured":  return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        case "goal_high": return b.goal - a.goal;
        case "goal_low":  return a.goal - b.goal;
        case "days_asc":  return a.daysLeft - b.daysLeft;
        default:          return 0;
      }
    });
    return list;
  }, [donations, search, selectedCategory, sortBy, minGoal, maxGoal]);

  const featuredCampaigns = filteredDonations.filter(d => d.featured);
  const showFeatured = featuredCampaigns.length > 0 && !search && selectedCategory === "All Categories";

  const clearFilters = () => {
    setSearch(""); setSelectedCategory("All Categories");
    setMinGoal(""); setMaxGoal(""); setShowFilters(false);
  };

  const hasFilters = search || selectedCategory !== "All Categories" || minGoal || maxGoal;

  const categoryOptions = CATEGORIES.map(c => ({ value: c, label: c }));

  // totals for hero stats
  const totalCampaigns = donations.length;
  const totalRaised    = donations.reduce((s, d) => s + (d.raisedAmount || 0), 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.65} }
        .donations-page * { box-sizing: border-box; }
        .donations-page { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      <div className="donations-page" style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}>

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
              <TrendingUp size={12} strokeWidth={2.5} /> Make an Impact
            </span>
            <h1 style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 900, letterSpacing: "-1px", lineHeight: 1.15, margin: "0 0 18px" }}>
              Support{" "}
              <span style={{ color: "#fde68a" }}>School Projects</span>
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.78)", lineHeight: 1.75, margin: "0 0 36px", fontWeight: 400, maxWidth: 520 }}>
              Make a difference in education by supporting verified school campaigns, infrastructure projects, and student programs across Sri Lanka.
            </p>

            {/* Stats strip */}
            <div style={{
              display: "inline-flex", flexWrap: "wrap", gap: 2,
              background: "rgba(255,255,255,0.1)", borderRadius: 16,
              backdropFilter: "blur(8px)", overflow: "hidden",
            }}>
              {[
                { icon: Heart,     label: "Active Campaigns", val: loading ? null : `${totalCampaigns}+` },
                { icon: HandCoins, label: "Total Raised",     val: loading ? null : formatLKR(totalRaised) },
              ].map(({ icon: Icon, label, val }, i) => (
                <div key={i} style={{ padding: "18px 28px", borderRight: i === 0 ? "1px solid rgba(255,255,255,0.12)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <Icon size={14} strokeWidth={2} color="rgba(255,255,255,0.6)" />
                    <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</span>
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.5px" }}>
                    {val ?? <span style={{ display: "inline-block", width: 80, height: 22, borderRadius: 6, background: "rgba(255,255,255,0.15)", animation: "shimmer 1.6s infinite", backgroundSize: "200% 100%" }} />}
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
            <button onClick={fetchDonations} style={{ color: "#b91c1c", fontWeight: 700, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontSize: 13 }}>Retry</button>
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
                  placeholder="Campaign name, school or description…"
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

          {/* Advanced panel — goal range */}
          {showFilters && (
            <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid #f3f4f6", display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase" }}>Campaign Goal Range (LKR)</label>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {[
                    { key: "min", val: minGoal, set: setMinGoal, ph: "Min" },
                    { key: "max", val: maxGoal, set: setMaxGoal, ph: "Max" },
                  ].map(({ key, val, set, ph }, i) => (
                    <React.Fragment key={key}>
                      {i === 1 && <span style={{ fontSize: 13, color: "#9ca3af", fontWeight: 600 }}>to</span>}
                      <input
                        type="number"
                        value={val}
                        onChange={e => set(e.target.value)}
                        placeholder={ph}
                        style={{
                          width: 140, padding: "10px 14px", borderRadius: 12,
                          border: "1.5px solid #e5e7eb", fontSize: 13.5, fontWeight: 500,
                          color: "#374151", outline: "none", fontFamily: "inherit", transition: "border-color 0.18s",
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"}
                        onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
                      />
                    </React.Fragment>
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
              {filteredDonations.length.toLocaleString()} {filteredDonations.length === 1 ? "Campaign" : "Campaigns"}
            </span>
            {hasFilters && (
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--color-primary,#4f46e5)", background: "color-mix(in srgb,var(--color-primary,#4f46e5) 9%,transparent)", padding: "3px 10px", borderRadius: 50 }}>Filtered</span>
            )}
          </div>
        )}

        {/* ═══ LOADING ═══ */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 20 }}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ borderRadius: 20, overflow: "hidden", background: "#fff", border: "1px solid #f0f0f0" }}>
                <Skeleton h={190} r={0} />
                <div style={{ padding: "18px 20px 20px" }}>
                  <Skeleton h={14} r={4} />
                  <div style={{ marginTop: 10 }}><Skeleton h={20} r={6} /></div>
                  <div style={{ marginTop: 8 }}><Skeleton h={14} r={4} /></div>
                  <div style={{ marginTop: 16 }}><Skeleton h={6} r={50} /></div>
                </div>
              </div>
            ))}
          </div>

        ) : filteredDonations.length === 0 ? (
          <Empty onClear={clearFilters} />

        ) : (
          <>
            {/* ═══ FEATURED ═══ */}
            {showFeatured && (
              <section style={{ marginBottom: 48 }}>
                <SectionHead label="Spotlight" title="Featured Campaigns" sub="Hand-picked campaigns making real impact" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 20 }}>
                  {featuredCampaigns.slice(0, 4).map(c => (
                    <FeaturedCard key={c.id} campaign={c} onClick={() => navigate(`/donations/${c.id}`)} />
                  ))}
                </div>
              </section>
            )}

            {/* ═══ ALL CAMPAIGNS ═══ */}
            <section>
              {showFeatured && (
                <SectionHead label="All Campaigns" title="Support a Cause" sub="Every contribution makes a difference" />
              )}

              {viewMode === "grid" ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 20 }}>
                  {filteredDonations.map(c => (
                    <DonationCard key={c.id} campaign={c} onClick={() => navigate(`/donations/${c.id}`)} />
                  ))}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {filteredDonations.map(c => (
                    <DonationRow key={c.id} campaign={c} onClick={() => navigate(`/donations/${c.id}`)} />
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

export default Donations;