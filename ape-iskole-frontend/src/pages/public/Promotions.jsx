import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiPromotion from "../../services/ApiPromotion";
import { toast } from "react-hot-toast";
import {
  Search, LayoutGrid, List, Tag, Sparkles, Zap, ArrowRight,
  X, SlidersHorizontal, ChevronDown, Clock, Users, BookOpen,
  Laptop, Shirt, Dumbbell, Target, Copy, ExternalLink,
  TrendingUp, Star, Flame, ShoppingBag
} from "lucide-react";

/* ── helpers ── */
const formatLKR = (n) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(n || 0);

const formatDate = (d) => {
  if (!d) return "No expiry";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const getDaysLeft = (dateString) => {
  if (!dateString) return null;
  const diff = new Date(dateString) - new Date();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const CATEGORY_META = {
  Education:   { icon: BookOpen,  color: "#2563eb", bg: "#eff6ff" },
  Supplies:    { icon: Tag,       color: "#7c3aed", bg: "#f5f3ff" },
  Sports:      { icon: Dumbbell,  color: "#059669", bg: "#ecfdf5" },
  Technology:  { icon: Laptop,    color: "#0891b2", bg: "#ecfeff" },
  Apparel:     { icon: Shirt,     color: "#db2777", bg: "#fdf2f8" },
};
const getCatMeta = (c) => CATEGORY_META[c] || { icon: Target, color: "#6b7280", bg: "#f9fafb" };

const CATEGORIES = ["All Categories", "Education", "Supplies", "Sports", "Technology", "Apparel"];

const SORT_OPTIONS = [
  { value: "featured",      label: "Featured First"       },
  { value: "discount_high", label: "Highest Discount"     },
  { value: "price_low",     label: "Price (Low to High)"  },
  { value: "price_high",    label: "Price (High to Low)"  },
  { value: "popularity",    label: "Most Popular"         },
  { value: "ending_soon",   label: "Ending Soon"          },
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

/* ── Promo Card (Grid) ── */
const PromoCard = ({ promo, onClaim }) => {
  const meta = getCatMeta(promo.category);
  const Icon = meta.icon;
  const daysLeft = getDaysLeft(promo.validUntil);
  const isExpiringSoon = daysLeft !== null && daysLeft <= 7 && daysLeft > 0;
  const pct = promo.limit > 0 ? Math.min(100, Math.round((promo.uses / promo.limit) * 100)) : null;

  return (
    <div
      style={{
        background: "#fff", borderRadius: 20, border: "1px solid #f0f0f0",
        overflow: "hidden", transition: "all 0.25s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 190, overflow: "hidden", flexShrink: 0 }}>
        <img
          src={promo.image || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600"}
          alt={promo.title}
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
          <Icon size={11} strokeWidth={2.5} />{promo.category}
        </span>
        {promo.featured && (
          <span style={{
            position: "absolute", top: 14, right: 14,
            fontSize: 10.5, fontWeight: 800, color: "#92400e", background: "#fef3c7",
            padding: "4px 9px", borderRadius: 50,
          }}>FEATURED</span>
        )}
        <span style={{
          position: "absolute", bottom: 14, left: 14,
          fontSize: 15, fontWeight: 900,
          color: "#fff", background: "#ef4444",
          padding: "5px 12px", borderRadius: 50,
        }}>{promo.discount} OFF</span>
        {isExpiringSoon && (
          <span style={{
            position: "absolute", bottom: 14, right: 14,
            fontSize: 11, fontWeight: 800, color: "#fff", background: "rgba(0,0,0,0.55)",
            padding: "4px 10px", borderRadius: 50,
            display: "flex", alignItems: "center", gap: 4,
          }}>
            <Clock size={11} strokeWidth={2} />{daysLeft}d left
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
        <p style={{ fontSize: 12.5, fontWeight: 600, color: "#9ca3af", margin: "0 0 5px" }}>{promo.brand}</p>
        <h3 style={{
          fontSize: 15.5, fontWeight: 800, color: "#0f0f0f", lineHeight: 1.4, margin: "0 0 8px",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {promo.title}
        </h3>
        <p style={{
          fontSize: 13, color: "#6b7280", lineHeight: 1.65, margin: "0 0 14px",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {promo.description}
        </p>

        {/* Pricing */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 20, fontWeight: 900, color: "var(--color-primary,#4f46e5)" }}>
            {formatLKR(promo.discountedPrice)}
          </span>
          <span style={{ fontSize: 13, color: "#c4c4c4", fontWeight: 500, textDecoration: "line-through" }}>
            {formatLKR(promo.originalPrice)}
          </span>
        </div>

        {/* Usage bar */}
        {pct !== null && (
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 11.5, fontWeight: 600, color: "#9ca3af" }}>Claimed</span>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "#374151" }}>{promo.uses}/{promo.limit}</span>
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

        {/* Meta row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>
            <Users size={12} strokeWidth={2} />{(promo.uses || 0).toLocaleString()} used
          </span>
          <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>
            Until {formatDate(promo.validUntil)}
          </span>
        </div>

        {/* Promo code pill */}
        <div style={{
          background: "color-mix(in srgb,var(--color-primary,#4f46e5) 6%,transparent)",
          border: "1.5px dashed color-mix(in srgb,var(--color-primary,#4f46e5) 25%,transparent)",
          borderRadius: 10, padding: "8px 14px", marginBottom: 14,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: 11.5, color: "#6b7280", fontWeight: 600 }}>Code:</span>
          <span style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 14, color: "var(--color-primary,#4f46e5)", letterSpacing: "0.08em" }}>
            {promo.code}
          </span>
        </div>

        <button
          onClick={e => { e.stopPropagation(); onClaim(promo); }}
          style={{
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
          <Copy size={14} strokeWidth={2.5} /> Copy Code & Claim
        </button>
      </div>
    </div>
  );
};

/* ── Promo Row (List) ── */
const PromoRow = ({ promo, onClaim }) => {
  const meta = getCatMeta(promo.category);
  const Icon = meta.icon;
  const daysLeft = getDaysLeft(promo.validUntil);

  return (
    <div
      style={{
        background: "#fff", borderRadius: 18, border: "1px solid #f0f0f0",
        overflow: "hidden", transition: "all 0.25s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)", display: "flex",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.08)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; }}
    >
      {/* Thumbnail */}
      <div style={{ width: 220, flexShrink: 0, position: "relative", overflow: "hidden" }}>
        <img
          src={promo.image || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600"}
          alt={promo.title}
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
          <Icon size={11} strokeWidth={2.5} />{promo.category}
        </span>
        <span style={{
          position: "absolute", bottom: 12, left: 12,
          fontSize: 13, fontWeight: 900, color: "#fff", background: "#ef4444",
          padding: "4px 10px", borderRadius: 50,
        }}>{promo.discount} OFF</span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            {promo.featured && (
              <span style={{
                fontSize: 10.5, fontWeight: 800, color: "#92400e", background: "#fef3c7",
                padding: "3px 9px", borderRadius: 50, marginBottom: 6, display: "inline-block",
              }}>FEATURED</span>
            )}
            <h3 style={{
              fontSize: 16, fontWeight: 800, color: "#0f0f0f", lineHeight: 1.35,
              margin: "0 0 3px", display: "-webkit-box",
              WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {promo.title}
            </h3>
            <p style={{ fontSize: 12.5, fontWeight: 600, color: "#9ca3af", margin: 0 }}>{promo.brand}</p>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: "var(--color-primary,#4f46e5)" }}>{formatLKR(promo.discountedPrice)}</span>
            <span style={{ fontSize: 12, color: "#c4c4c4", textDecoration: "line-through" }}>{formatLKR(promo.originalPrice)}</span>
          </div>
        </div>

        <p style={{
          fontSize: 13, color: "#6b7280", lineHeight: 1.65, margin: "0 0 12px",
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {promo.description}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px", marginBottom: 14 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "#4b5563", fontWeight: 500 }}>
            <Users size={13} strokeWidth={2} color="var(--color-primary,#4f46e5)" />
            {(promo.uses || 0).toLocaleString()} used
          </span>
          {daysLeft !== null && (
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: daysLeft <= 7 ? "#ef4444" : "#4b5563", fontWeight: 500 }}>
              <Clock size={13} strokeWidth={2} color={daysLeft <= 7 ? "#ef4444" : "var(--color-primary,#4f46e5)"} />
              {daysLeft} days left
            </span>
          )}
          <span style={{ fontSize: 12.5, color: "#4b5563", fontWeight: 500 }}>
            Code: <span style={{ fontFamily: "monospace", fontWeight: 800, color: "var(--color-primary,#4f46e5)" }}>{promo.code}</span>
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
          <button
            onClick={e => { e.stopPropagation(); onClaim(promo); }}
            style={{
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
            <Copy size={14} strokeWidth={2.5} /> Copy & Claim
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Featured Hero Card ── */
const FeaturedCard = ({ promo, onClaim }) => {
  const meta = getCatMeta(promo.category);
  const Icon = meta.icon;

  return (
    <div
      style={{
        position: "relative", borderRadius: 22, overflow: "hidden",
        cursor: "pointer", boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        transition: "all 0.3s",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 48px rgba(0,0,0,0.18)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.12)"; }}
    >
      <img
        src={promo.image || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800"}
        alt={promo.title}
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
          <Icon size={11} strokeWidth={2.5} />{promo.category}
        </span>
        <span style={{ fontSize: 10.5, fontWeight: 800, color: "#92400e", background: "#fef3c7", padding: "4px 9px", borderRadius: 50 }}>
          🔥 HOT DEAL
        </span>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 22px" }}>
        <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.7)", fontWeight: 600, margin: "0 0 4px" }}>{promo.brand}</p>
        <h3 style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.3px", margin: "0 0 6px", lineHeight: 1.3 }}>
          {promo.title}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: "#fde68a" }}>{promo.discount} OFF</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#fff" }}>{formatLKR(promo.discountedPrice)}</span>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", textDecoration: "line-through" }}>{formatLKR(promo.originalPrice)}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{
            background: "rgba(255,255,255,0.12)", backdropFilter: "blur(4px)",
            border: "1.5px dashed rgba(255,255,255,0.3)",
            borderRadius: 10, padding: "6px 14px",
          }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>Code: </span>
            <span style={{ fontFamily: "monospace", fontWeight: 900, fontSize: 15, color: "#fff", letterSpacing: "0.1em" }}>{promo.code}</span>
          </div>
          <button
            onClick={e => { e.stopPropagation(); onClaim(promo); }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "10px 20px", borderRadius: 50, border: "none",
              background: "#fff", color: "var(--color-primary,#4f46e5)",
              fontWeight: 800, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            <Copy size={14} strokeWidth={2.5} /> Grab Deal
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
    <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f0f0f", margin: "0 0 8px" }}>No offers found</h3>
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
   PROMOTIONS PAGE
═══════════════════════════════════ */
const Promotions = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions]         = useState([]);
  const [loading, setLoading]               = useState(true);
  const [search, setSearch]                 = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy]                 = useState("featured");
  const [viewMode, setViewMode]             = useState("grid");
  const [showFilters, setShowFilters]       = useState(false);
  const [minPrice, setMinPrice]             = useState("");
  const [maxPrice, setMaxPrice]             = useState("");

  useEffect(() => { fetchPromotions(); }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const response = await ApiPromotion.getAllActive();
      setPromotions(response.data);
    } catch (err) {
      toast.error("Failed to load offers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (promo) => {
    try {
      await navigator.clipboard.writeText(promo.code);
      toast.success(`Code "${promo.code}" copied to clipboard!`);
      await ApiPromotion.claim(promo.id);
      if (promo.url) {
        setTimeout(() => window.open(promo.url, "_blank", "noopener,noreferrer"), 800);
      }
      setPromotions(prev => prev.map(p => p.id === promo.id ? { ...p, uses: (p.uses || 0) + 1 } : p));
    } catch (err) {
      toast.error("An error occurred. Try again.");
    }
  };

  const filteredPromotions = useMemo(() => {
    let list = promotions.filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !search ||
        p.title?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q);
      const matchCat   = selectedCategory === "All Categories" || p.category === selectedCategory;
      const matchMin   = !minPrice || (p.discountedPrice || 0) >= Number(minPrice);
      const matchMax   = !maxPrice || (p.discountedPrice || 0) <= Number(maxPrice);
      return matchSearch && matchCat && matchMin && matchMax;
    });

    list.sort((a, b) => {
      switch (sortBy) {
        case "featured":      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        case "discount_high": return parseInt(b.discount) - parseInt(a.discount);
        case "price_low":     return (a.discountedPrice || 0) - (b.discountedPrice || 0);
        case "price_high":    return (b.discountedPrice || 0) - (a.discountedPrice || 0);
        case "popularity":    return (b.uses || 0) - (a.uses || 0);
        case "ending_soon":
          if (!a.validUntil) return 1;
          if (!b.validUntil) return -1;
          return new Date(a.validUntil) - new Date(b.validUntil);
        default: return 0;
      }
    });
    return list;
  }, [promotions, search, selectedCategory, sortBy, minPrice, maxPrice]);

  const featuredPromos  = filteredPromotions.filter(p => p.featured);
  const showFeatured    = featuredPromos.length > 0 && !search && selectedCategory === "All Categories";
  const hasFilters      = search || selectedCategory !== "All Categories" || minPrice || maxPrice;
  const clearFilters    = () => { setSearch(""); setSelectedCategory("All Categories"); setMinPrice(""); setMaxPrice(""); setShowFilters(false); };

  const totalUses = promotions.reduce((s, p) => s + (p.uses || 0), 0);
  const maxDiscount = promotions.reduce((max, p) => {
    const d = parseInt(p.discount) || 0;
    return d > max ? d : max;
  }, 0);

  const categoryOptions = CATEGORIES.map(c => ({ value: c, label: c }));
  const sortOptions     = SORT_OPTIONS;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        .promotions-page * { box-sizing: border-box; }
        .promotions-page { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      <div className="promotions-page" style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}>

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
              <Flame size={12} strokeWidth={2.5} /> Exclusive Deals for Schools
            </span>
            <h1 style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 900, letterSpacing: "-1px", lineHeight: 1.15, margin: "0 0 18px" }}>
              Offers &amp;{" "}
              <span style={{ color: "#fde68a" }}>Discounts</span>
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.78)", lineHeight: 1.75, margin: "0 0 36px", fontWeight: 400, maxWidth: 520 }}>
              Discover amazing deals on books, supplies, technology, sports gear, and more — curated exclusively for students, teachers, and schools across Sri Lanka.
            </p>

            {/* Stats strip */}
            <div style={{
              display: "inline-flex", flexWrap: "wrap", gap: 2,
              background: "rgba(255,255,255,0.1)", borderRadius: 16,
              backdropFilter: "blur(8px)", overflow: "hidden",
            }}>
              {[
                { icon: ShoppingBag, label: "Active Offers",    val: loading ? null : `${promotions.length}+` },
                { icon: TrendingUp,  label: "Max Discount",     val: loading ? null : `${maxDiscount}% OFF`   },
                { icon: Users,       label: "Happy Customers",  val: loading ? null : `${totalUses.toLocaleString()}+` },
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
                  placeholder="Offer name, brand or description…"
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
            <FilterSelect label="Sort" value={sortBy} onChange={setSortBy} options={sortOptions} />

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

          {/* Advanced panel */}
          {showFilters && (
            <div style={{ marginTop: 18, paddingTop: 18, borderTop: "1px solid #f3f4f6", display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase" }}>Discounted Price Range (LKR)</label>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {[
                    { key: "min", val: minPrice, set: setMinPrice, ph: "Min" },
                    { key: "max", val: maxPrice, set: setMaxPrice, ph: "Max" },
                  ].map(({ key, val, set, ph }, i) => (
                    <React.Fragment key={key}>
                      {i === 1 && <span style={{ fontSize: 13, color: "#9ca3af", fontWeight: 600 }}>to</span>}
                      <input
                        type="number" value={val} onChange={e => set(e.target.value)} placeholder={ph}
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
              {filteredPromotions.length.toLocaleString()} {filteredPromotions.length === 1 ? "Offer" : "Offers"}
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
                  <div style={{ marginTop: 16 }}><Skeleton h={5} r={50} /></div>
                  <div style={{ marginTop: 14 }}><Skeleton h={38} r={12} /></div>
                </div>
              </div>
            ))}
          </div>

        ) : filteredPromotions.length === 0 ? (
          <Empty onClear={clearFilters} />

        ) : (
          <>
            {/* ═══ FEATURED / HOT DEALS ═══ */}
            {showFeatured && (
              <section style={{ marginBottom: 48 }}>
                <SectionHead label="Hot Deals" title="Featured Offers" sub="Hand-picked discounts you don't want to miss" />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))", gap: 20 }}>
                  {featuredPromos.slice(0, 4).map(p => (
                    <FeaturedCard key={p.id} promo={p} onClaim={handleClaim} />
                  ))}
                </div>
              </section>
            )}

            {/* ═══ ALL OFFERS ═══ */}
            <section style={{ marginBottom: 56 }}>
              {showFeatured && (
                <SectionHead label="All Offers" title="Browse Deals" sub="Explore all available promotions and save big" />
              )}

              {viewMode === "grid" ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 20 }}>
                  {filteredPromotions.map(p => (
                    <PromoCard key={p.id} promo={p} onClaim={handleClaim} />
                  ))}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {filteredPromotions.map(p => (
                    <PromoRow key={p.id} promo={p} onClaim={handleClaim} />
                  ))}
                </div>
              )}
            </section>

            {/* ═══ HOW IT WORKS ═══ */}
            <section>
              <SectionHead label="Guide" title="How to Claim Offers" sub="Three simple steps to unlock your savings" />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
                {[
                  { icon: Search,    label: "Browse Offers",     desc: "Explore our curated deals across categories",         color: "var(--color-primary,#4f46e5)" },
                  { icon: Copy,      label: "Copy Promo Code",   desc: "Click 'Copy & Claim' to grab the discount code",      color: "#059669" },
                  { icon: ShoppingBag, label: "Shop & Save",     desc: "Apply the code at checkout and enjoy your discount",  color: "#db2777" },
                ].map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={i} style={{
                      background: "#fff", borderRadius: 18, border: "1px solid #f0f0f0",
                      padding: "28px 24px", textAlign: "center",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.04)", transition: "all 0.22s",
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
          </>
        )}
      </div>
    </>
  );
};

export default Promotions;