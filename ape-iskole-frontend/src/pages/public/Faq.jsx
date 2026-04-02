import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, ChevronDown, ChevronUp, HelpCircle, MessageSquare,
  ExternalLink, ThumbsUp, ThumbsDown, Sparkles, Zap, TrendingUp, X
} from 'lucide-react';

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

const CATEGORIES = ["All", "General", "Schools", "Alumni", "Donations", "Security"];

const FAQS = [
  {
    category: "General",
    question: "What is Ape Iskole?",
    answer: "Ape Iskole is a platform dedicated to connecting Sri Lankan schools with their alumni networks to facilitate support, organise events, and manage donations transparently.",
  },
  {
    category: "Schools",
    question: "How can my school join the platform?",
    answer: "School administrators can register by clicking the 'Register School' button. You'll need to provide basic school details and verification documents for our team to review.",
  },
  {
    category: "Alumni",
    question: "Is it free for alumni to join?",
    answer: "Yes, joining Ape Iskole as an alumnus is completely free. You can find your school, connect with classmates, and stay updated on school news and events.",
  },
  {
    category: "Donations",
    question: "How do I know my donation reaches the school?",
    answer: "We ensure transparency by providing direct tracking for every donation. Schools must provide impact reports and evidence of project completion for all funds raised.",
  },
  {
    category: "Security",
    question: "Is my personal data safe?",
    answer: "Absolutely. We use industry-standard encryption and follow strict data protection protocols. We never share your personal information with third parties without your explicit consent.",
  },
  {
    category: "Donations",
    question: "Can I donate anonymously?",
    answer: "Yes, when making a donation, you have the option to keep your name private from the public donor list while still receiving your own private confirmation and receipt.",
  },
  {
    category: "Schools",
    question: "What documents are required for school verification?",
    answer: "Standard requirements include the Ministry of Education registration certificate and a letter of authorisation from the current principal.",
  },
  {
    category: "General",
    question: "Is Ape Iskole available as a mobile app?",
    answer: "Our platform is fully optimised for mobile browsers. A dedicated native app is currently in development and will be available soon for both iOS and Android.",
  },
  {
    category: "Alumni",
    question: "How do I find classmates from my year?",
    answer: "Once you're connected to your school's profile, you can browse alumni directories filtered by year, stream, or house. You can also send connection requests to reconnect.",
  },
];

const CATEGORY_COLORS = {
  General:   { color: "#2563eb", bg: "#eff6ff" },
  Schools:   { color: "#059669", bg: "#ecfdf5" },
  Alumni:    { color: "#7c3aed", bg: "#f5f3ff" },
  Donations: { color: "#db2777", bg: "#fdf2f8" },
  Security:  { color: "#d97706", bg: "#fffbeb" },
};
const getCatStyle = (c) => CATEGORY_COLORS[c] || { color: "#6b7280", bg: "#f9fafb" };

const Faq = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery]       = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex]           = useState(null);

  const filtered = FAQS.filter(faq => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !searchQuery ||
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q);
    const matchCat = activeCategory === "All" || faq.category === activeCategory;
    return matchSearch && matchCat;
  });

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes shimmer  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        @keyframes slideDown{ from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:none} }
        .faq-page * { box-sizing: border-box; }
        .faq-page { font-family: 'Plus Jakarta Sans', sans-serif; }
        .faq-item  { transition: all 0.22s; }
        .faq-item:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important; }
        .cat-btn   { transition: all 0.18s; cursor: pointer; border: none; font-family: inherit; }
      `}</style>

      <div className="faq-page" style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* ═══ HERO ═══ */}
        <div style={{
          position: "relative", borderRadius: 24, overflow: "hidden",
          background: "linear-gradient(135deg, #1e1b4b 0%, var(--color-primary,#4f46e5) 45%, var(--color-secondary,#7c3aed) 100%)",
          padding: "64px 48px", marginBottom: 48, color: "#fff",
          animation: "fadeUp 0.6s ease both",
        }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 360, height: 360, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, left: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "50%", right: 120, transform: "translateY(-50%)", width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1, maxWidth: 680 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20,
              fontSize: 11.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#c7d2fe", background: "rgba(255,255,255,0.12)",
              padding: "5px 14px", borderRadius: 50,
            }}>
              <Sparkles size={12} strokeWidth={2.5} /> Knowledge Base
            </span>
            <h1 style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 900, letterSpacing: "-1px", lineHeight: 1.15, margin: "0 0 18px" }}>
              Frequently Asked{" "}
              <span style={{ color: "#fde68a" }}>Questions</span>
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.78)", lineHeight: 1.75, margin: "0 0 36px", fontWeight: 400, maxWidth: 520 }}>
              Search our knowledge base for quick answers about the Ape Iskole platform — for schools, alumni, and donors.
            </p>

            {/* Search bar */}
            <div style={{ position: "relative", maxWidth: 560 }}>
              <Search
                size={16} strokeWidth={2.2} color="rgba(255,255,255,0.5)"
                style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              />
              <input
                type="text"
                placeholder="Search questions — e.g. 'how to donate'…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: "100%", padding: "14px 44px 14px 44px",
                  borderRadius: 14, border: "2px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)",
                  color: "#fff", fontSize: 14, fontWeight: 500, fontFamily: "inherit",
                  outline: "none", transition: "border-color 0.18s",
                }}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.6)", padding: 2,
                  }}
                >
                  <X size={15} strokeWidth={2.5} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ═══ CATEGORY FILTERS ═══ */}
        <div style={{
          background: "#fff", borderRadius: 18, border: "1px solid #f0f0f0",
          padding: "12px 16px", marginBottom: 32,
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center",
        }}>
          {CATEGORIES.map(cat => {
            const active = activeCategory === cat;
            const cs = getCatStyle(cat);
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="cat-btn"
                style={{
                  padding: "8px 18px", borderRadius: 50,
                  fontSize: 13, fontWeight: 700,
                  background: active
                    ? (cat === "All"
                        ? "linear-gradient(135deg, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))"
                        : cs.bg)
                    : "#f7f7f8",
                  color: active
                    ? (cat === "All" ? "#fff" : cs.color)
                    : "#6b7280",
                  boxShadow: active && cat === "All"
                    ? "0 4px 12px color-mix(in srgb,var(--color-primary,#4f46e5) 28%,transparent)"
                    : "none",
                }}
              >
                {cat}
              </button>
            );
          })}
          {(searchQuery || activeCategory !== "All") && (
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              className="cat-btn"
              style={{
                marginLeft: "auto", display: "flex", alignItems: "center", gap: 5,
                padding: "8px 14px", borderRadius: 50,
                fontSize: 12.5, fontWeight: 700, color: "#dc2626",
                background: "#fef2f2", border: "1px solid #fecaca",
              }}
            >
              <X size={12} strokeWidth={2.5} /> Clear
            </button>
          )}
        </div>

        {/* ═══ RESULTS COUNT ═══ */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#0f0f0f", letterSpacing: "-0.3px" }}>
            {filtered.length} {filtered.length === 1 ? "Question" : "Questions"}
          </span>
          {(searchQuery || activeCategory !== "All") && (
            <span style={{
              fontSize: 11.5, fontWeight: 700, color: "var(--color-primary,#4f46e5)",
              background: "color-mix(in srgb,var(--color-primary,#4f46e5) 9%,transparent)",
              padding: "3px 10px", borderRadius: 50,
            }}>Filtered</span>
          )}
        </div>

        {/* ═══ FAQ LIST ═══ */}
        {filtered.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 56 }}>
            {filtered.map((faq, i) => {
              const isOpen = openIndex === i;
              const cs = getCatStyle(faq.category);
              return (
                <div
                  key={i}
                  className="faq-item"
                  style={{
                    background: "#fff", borderRadius: 18, overflow: "hidden",
                    border: isOpen
                      ? `1.5px solid color-mix(in srgb,var(--color-primary,#4f46e5) 28%,transparent)`
                      : "1px solid #f0f0f0",
                    boxShadow: isOpen
                      ? "0 8px 28px color-mix(in srgb,var(--color-primary,#4f46e5) 10%,transparent)"
                      : "0 1px 4px rgba(0,0,0,0.05)",
                  }}
                >
                  {/* Question row */}
                  <button
                    onClick={() => toggle(i)}
                    style={{
                      width: "100%", padding: "20px 24px",
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
                      background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
                      textAlign: "left",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                      <span style={{
                        flexShrink: 0, fontSize: 11, fontWeight: 800,
                        letterSpacing: "0.08em", textTransform: "uppercase",
                        color: cs.color, background: cs.bg,
                        padding: "4px 10px", borderRadius: 50,
                      }}>
                        {faq.category}
                      </span>
                      <h3 style={{
                        fontSize: 15, fontWeight: 800, margin: 0, lineHeight: 1.4,
                        color: isOpen ? "var(--color-primary,#4f46e5)" : "#0f0f0f",
                        transition: "color 0.18s",
                      }}>
                        {faq.question}
                      </h3>
                    </div>
                    <div style={{
                      width: 30, height: 30, borderRadius: 9, flexShrink: 0,
                      background: isOpen
                        ? "color-mix(in srgb,var(--color-primary,#4f46e5) 10%,transparent)"
                        : "#f3f4f6",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "background 0.18s",
                    }}>
                      {isOpen
                        ? <ChevronUp size={15} strokeWidth={2.5} color="var(--color-primary,#4f46e5)" />
                        : <ChevronDown size={15} strokeWidth={2.5} color="#6b7280" />
                      }
                    </div>
                  </button>

                  {/* Answer */}
                  {isOpen && (
                    <div style={{ padding: "0 24px 24px", animation: "slideDown 0.22s ease both" }}>
                      <div style={{ height: 1, background: "#f3f4f6", marginBottom: 18 }} />
                      <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.8, margin: "0 0 20px", fontWeight: 400 }}>
                        {faq.answer}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 12.5, fontWeight: 600, color: "#9ca3af" }}>Was this helpful?</span>
                          <div style={{ display: "flex", gap: 6 }}>
                            {[
                              { Icon: ThumbsUp,   hoverColor: "#059669", hoverBg: "#ecfdf5" },
                              { Icon: ThumbsDown, hoverColor: "#dc2626", hoverBg: "#fef2f2" },
                            ].map(({ Icon, hoverColor, hoverBg }, j) => (
                              <button
                                key={j}
                                style={{
                                  width: 32, height: 32, borderRadius: 9, border: "1px solid #f0f0f0",
                                  background: "#fafafa", cursor: "pointer",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  transition: "all 0.18s",
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = hoverBg; e.currentTarget.style.borderColor = hoverColor; e.currentTarget.querySelector("svg").style.stroke = hoverColor; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "#fafafa"; e.currentTarget.style.borderColor = "#f0f0f0"; e.currentTarget.querySelector("svg").style.stroke = "#9ca3af"; }}
                              >
                                <Icon size={14} strokeWidth={2} color="#9ca3af" />
                              </button>
                            ))}
                          </div>
                        </div>
                        <button style={{
                          display: "flex", alignItems: "center", gap: 5,
                          fontSize: 12.5, fontWeight: 700, color: "var(--color-primary,#4f46e5)",
                          background: "none", border: "none", cursor: "pointer", fontFamily: "inherit",
                        }}
                          onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                          onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                        >
                          Learn more <ExternalLink size={12} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* ── Empty state ── */
          <div style={{
            textAlign: "center", padding: "64px 24px", marginBottom: 56,
            background: "#fff", borderRadius: 20, border: "1px solid #f0f0f0",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <HelpCircle size={26} color="#d1d5db" strokeWidth={1.8} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f0f0f", margin: "0 0 8px" }}>No results found</h3>
            <p style={{ fontSize: 14, color: "#9ca3af", margin: "0 0 20px", maxWidth: 340, marginLeft: "auto", marginRight: "auto" }}>
              We couldn't find any questions matching "{searchQuery}". Try different keywords or contact our support team.
            </p>
            <button
              onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
              style={{
                padding: "11px 24px", borderRadius: 50, border: "none",
                background: "linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed))",
                color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* ═══ STILL NEED HELP CTA ═══ */}
        <div style={{
          borderRadius: 24, overflow: "hidden", position: "relative",
          background: "linear-gradient(135deg,#f0fdf4 0%,#eff6ff 100%)",
          border: "1px solid #e0f2fe", padding: "52px 48px",
          display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 32,
        }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 220, height: 220, borderRadius: "50%", background: "rgba(16,185,129,0.07)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: 100, width: 180, height: 180, borderRadius: "50%", background: "rgba(37,99,235,0.06)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1, maxWidth: 520 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16,
              fontSize: 11, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#059669", background: "#d1fae5", padding: "4px 12px", borderRadius: 50,
            }}>
              <TrendingUp size={11} strokeWidth={2.5} /> Still Need Help?
            </span>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: "#0f0f0f", letterSpacing: "-0.5px", margin: "0 0 12px" }}>
              Can't find the answer?
            </h2>
            <p style={{ fontSize: 15, color: "#4b5563", lineHeight: 1.7, margin: 0, fontWeight: 400 }}>
              Our friendly support team is ready to help. Chat with us live or send a message and we'll get back to you quickly.
            </p>
          </div>

          <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/contact")}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "13px 28px", borderRadius: 50, border: "none",
                background: "linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed))",
                color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer",
                boxShadow: "0 6px 20px color-mix(in srgb,var(--color-primary,#4f46e5) 35%,transparent)",
                fontFamily: "inherit",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <MessageSquare size={16} strokeWidth={2.5} /> Contact Us
            </button>
            <button
              style={{
                padding: "13px 24px", borderRadius: 50,
                border: "1.5px solid #d1d5db", background: "#fff",
                color: "#374151", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent)"; e.currentTarget.style.color = "var(--color-primary,#4f46e5)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.color = "#374151"; }}
            >
              Chat Support
            </button>
          </div>
        </div>

      </div>
    </>
  );
};

export default Faq;