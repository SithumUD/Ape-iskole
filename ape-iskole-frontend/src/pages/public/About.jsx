import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target, Users, Heart, GraduationCap, ArrowRight, ShieldCheck,
  Zap, Sparkles, BookOpen, Megaphone, Calendar, TrendingUp,
  Globe, School, CheckCircle, Star, Building2
} from 'lucide-react';

/* ── Section header (matches other pages) ── */
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

/* ── Card wrapper ── */
const Card = ({ children, style = {} }) => (
  <div style={{
    background: "#fff", borderRadius: 20, border: "1px solid #f0f0f0",
    padding: "28px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    ...style,
  }}>
    {children}
  </div>
);

const FEATURES = [
  {
    icon: Users,
    color: "#2563eb", bg: "#eff6ff",
    title: "Alumni Networks",
    desc: "Build and manage a comprehensive database of past students and staff, keeping the community connected for life.",
  },
  {
    icon: Heart,
    color: "#db2777", bg: "#fdf2f8",
    title: "Donation Campaigns",
    desc: "Transparently raise funds for specific school projects and facilities with real-time progress tracking.",
  },
  {
    icon: Calendar,
    color: "#059669", bg: "#ecfdf5",
    title: "Event Management",
    desc: "Organise reunions, school events, and ticket sales effortlessly with our built-in booking system.",
  },
  {
    icon: ShieldCheck,
    color: "#059669", bg: "#ecfdf5",
    title: "Verified Profiles",
    desc: "Official school accounts verified by our team so parents, students, and alumni can trust every listing.",
  },
  {
    icon: GraduationCap,
    color: "#7c3aed", bg: "#f5f3ff",
    title: "School Heritage",
    desc: "A digital space to preserve and celebrate school history, traditions, and lifetime achievements.",
  },
  {
    icon: Megaphone,
    color: "#d97706", bg: "#fffbeb",
    title: "Real-time Stories",
    desc: "Share updates, success stories, and announcements with your wider school community instantly.",
  },
];

const STATS = [
  { icon: School,        label: "Schools Registered", value: "500+" },
  { icon: Users,         label: "Alumni Connected",   value: "80K+" },
  { icon: Heart,         label: "Donations Raised",   value: "LKR 12M+" },
  { icon: Calendar,      label: "Events Hosted",      value: "2,400+" },
];

const TEAM = [
  { name: "Ashan Perera",    role: "Co-Founder & CEO",       initials: "AP" },
  { name: "Nimali Fernando", role: "Co-Founder & CTO",       initials: "NF" },
  { name: "Ruvini Silva",    role: "Head of School Relations", initials: "RS" },
  { name: "Kasun Jayawardena", role: "Lead Designer",        initials: "KJ" },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        .about-page * { box-sizing: border-box; }
        .about-page { font-family: 'Plus Jakarta Sans', sans-serif; }
        .feature-card { transition: all 0.25s; }
        .feature-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.1) !important; }
        .team-card { transition: all 0.25s; }
        .team-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.1) !important; }
      `}</style>

      <div className="about-page" style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}>

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

          <div style={{ position: "relative", zIndex: 1, maxWidth: 680 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20,
              fontSize: 11.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#c7d2fe", background: "rgba(255,255,255,0.12)",
              padding: "5px 14px", borderRadius: 50,
            }}>
              <Sparkles size={12} strokeWidth={2.5} /> Sri Lanka's Education Platform
            </span>
            <h1 style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 900, letterSpacing: "-1px", lineHeight: 1.15, margin: "0 0 18px" }}>
              Bridging Schools,{" "}
              <span style={{ color: "#fde68a" }}>Alumni &amp; Communities</span>
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.78)", lineHeight: 1.75, margin: "0 0 36px", fontWeight: 400, maxWidth: 560 }}>
              Ape Iskole is a dedicated digital platform empowering schools across Sri Lanka by reconnecting them with alumni, enabling transparent fundraising, and celebrating every school's unique legacy.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <button
                onClick={() => navigate("/schools")}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "13px 26px", borderRadius: 50, border: "none",
                  background: "#fff", color: "var(--color-primary,#4f46e5)",
                  fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                }}
              >
                Explore Schools <ArrowRight size={16} strokeWidth={2.5} />
              </button>
              <button
                onClick={() => navigate("/register-school")}
                style={{
                  padding: "13px 26px", borderRadius: 50,
                  border: "2px solid rgba(255,255,255,0.3)", background: "transparent",
                  color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
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
            {STATS.map(({ icon: Icon, label, value }, i) => (
              <div key={i} style={{ padding: "22px 24px", borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <Icon size={16} strokeWidth={2} color="rgba(255,255,255,0.65)" />
                  <span style={{ fontSize: 11.5, fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</span>
                </div>
                <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.5px" }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ MISSION & VISION ═══ */}
        <section style={{ marginBottom: 56 }}>
          <SectionHead label="Who We Are" title="Mission &amp; Vision" sub="The values that drive everything we do" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>

            {/* Mission */}
            <div style={{
              borderRadius: 20, overflow: "hidden",
              background: "linear-gradient(135deg, color-mix(in srgb,var(--color-primary,#4f46e5) 5%,#fff), color-mix(in srgb,var(--color-secondary,#7c3aed) 4%,#fff))",
              border: "1px solid color-mix(in srgb,var(--color-primary,#4f46e5) 14%,transparent)",
              padding: "36px 32px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              transition: "all 0.25s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 16, marginBottom: 20,
                background: "color-mix(in srgb,var(--color-primary,#4f46e5) 10%,transparent)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Target size={24} color="var(--color-primary,#4f46e5)" strokeWidth={2} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: "#0f0f0f", letterSpacing: "-0.3px", margin: "0 0 14px" }}>Our Mission</h3>
              <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.8, margin: 0, fontWeight: 400 }}>
                To create a seamless digital ecosystem where every school in Sri Lanka can showcase its heritage, engage its alumni network, and secure the necessary support to provide students with state-of-the-art facilities and opportunities.
              </p>
            </div>

            {/* Vision */}
            <div style={{
              borderRadius: 20, overflow: "hidden",
              background: "linear-gradient(135deg, #1e1b4b 0%, var(--color-primary,#4f46e5) 60%, var(--color-secondary,#7c3aed) 100%)",
              padding: "36px 32px",
              boxShadow: "0 4px 24px color-mix(in srgb,var(--color-primary,#4f46e5) 25%,transparent)",
              transition: "all 0.25s", position: "relative", overflow: "hidden",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 20px 48px color-mix(in srgb,var(--color-primary,#4f46e5) 35%,transparent)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 24px color-mix(in srgb,var(--color-primary,#4f46e5) 25%,transparent)"; }}
            >
              <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 16, marginBottom: 20,
                  background: "rgba(255,255,255,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Globe size={24} color="#fff" strokeWidth={2} />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 900, color: "#fff", letterSpacing: "-0.3px", margin: "0 0 14px" }}>Our Vision</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", lineHeight: 1.8, margin: 0, fontWeight: 400 }}>
                  We envision a future where geographical boundaries are no barrier to supporting one's alma mater — where every school is well-resourced and every student's potential is nurtured through a strong, global alumni community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FEATURES ═══ */}
        <section style={{ marginBottom: 56 }}>
          <SectionHead label="Platform" title="What We Offer" sub="Powerful tools built for Sri Lankan schools and their communities" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
            {FEATURES.map(({ icon: Icon, color, bg, title, desc }, i) => (
              <div
                key={i}
                className="feature-card"
                style={{
                  background: "#fff", borderRadius: 20, border: "1px solid #f0f0f0",
                  padding: "28px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 14, marginBottom: 18,
                  background: bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={22} color={color} strokeWidth={2} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f0f0f", margin: "0 0 10px" }}>{title}</h3>
                <p style={{ fontSize: 13.5, color: "#6b7280", lineHeight: 1.7, margin: 0, fontWeight: 400 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ TEAM ═══ */}
        <section style={{ marginBottom: 56 }}>
          <SectionHead label="The People" title="Meet the Team" sub="Passionate individuals committed to transforming education in Sri Lanka" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
            {TEAM.map(({ name, role, initials }, i) => (
              <div
                key={i}
                className="team-card"
                style={{
                  background: "#fff", borderRadius: 20, border: "1px solid #f0f0f0",
                  padding: "28px 24px", textAlign: "center",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{
                  width: 64, height: 64, borderRadius: 20, margin: "0 auto 16px",
                  background: "linear-gradient(135deg, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, fontWeight: 900, color: "#fff",
                  boxShadow: "0 4px 16px color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent)",
                }}>
                  {initials}
                </div>
                <h3 style={{ fontSize: 15.5, fontWeight: 800, color: "#0f0f0f", margin: "0 0 5px" }}>{name}</h3>
                <p style={{ fontSize: 13, color: "#9ca3af", fontWeight: 600, margin: 0 }}>{role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ VALUES ═══ */}
        <section style={{ marginBottom: 56 }}>
          <SectionHead label="Our Values" title="How We Work" sub="Principles that guide every decision we make" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
            {[
              { icon: CheckCircle, color: "#059669", label: "Transparency",  desc: "Every donation, every rupee — fully visible and accountable." },
              { icon: ShieldCheck, color: "#2563eb", label: "Trust",          desc: "Verified school profiles and secure payment infrastructure." },
              { icon: Star,        color: "#d97706", label: "Community",      desc: "Schools, alumni, and donors united around shared purpose." },
              { icon: TrendingUp,  color: "#7c3aed", label: "Impact",         desc: "We measure success by real outcomes for real students." },
            ].map(({ icon: Icon, color, label, desc }, i) => (
              <div key={i} style={{
                background: "#fff", borderRadius: 18, border: "1px solid #f0f0f0",
                padding: "24px 20px", textAlign: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                transition: "all 0.22s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"; }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, margin: "0 auto 14px",
                  background: `color-mix(in srgb,${color} 10%,transparent)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={20} color={color} strokeWidth={2} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f0f0f", margin: "0 0 8px" }}>{label}</h3>
                <p style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ CTA ═══ */}
        <section>
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
                <TrendingUp size={11} strokeWidth={2.5} /> Get Involved
              </span>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: "#0f0f0f", letterSpacing: "-0.5px", margin: "0 0 12px" }}>
                Ready to Support Your Alma Mater?
              </h2>
              <p style={{ fontSize: 15, color: "#4b5563", lineHeight: 1.7, margin: 0, fontWeight: 400 }}>
                Join thousands of alumni making a real difference in their schools. Whether it's a donation, volunteering, or organising an event — every contribution matters.
              </p>
            </div>
            <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={() => navigate("/register-school")}
                style={{
                  padding: "13px 28px", borderRadius: 50, border: "none",
                  background: "linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed))",
                  color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer",
                  boxShadow: "0 6px 20px color-mix(in srgb,var(--color-primary,#4f46e5) 35%,transparent)",
                  fontFamily: "inherit",
                }}
              >
                Get Started Now
              </button>
              <button
                onClick={() => navigate("/schools")}
                style={{
                  padding: "13px 24px", borderRadius: 50,
                  border: "1.5px solid #d1d5db", background: "#fff",
                  color: "#374151", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Browse Schools
              </button>
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default About;