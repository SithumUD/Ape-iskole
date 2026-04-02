import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Eye, Lock, Share2, User, Database, Bell,
  ShieldCheck, Sparkles, Zap, CheckCircle, ArrowRight
} from 'lucide-react';

/* ── Section header ── */
const SectionHead = ({ label, title, sub }) => (
  <div style={{ marginBottom: 24 }}>
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
    {sub && <p style={{ fontSize: 13.5, color: "#6b7280", marginTop: 4, fontWeight: 500 }}>{sub}</p>}
  </div>
);

/* ── Card ── */
const Card = ({ children, style = {} }) => (
  <div style={{
    background: "#fff", borderRadius: 20, border: "1px solid #f0f0f0",
    padding: "28px 28px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    ...style,
  }}>
    {children}
  </div>
);

const OVERVIEW = [
  { icon: Database, color: "#2563eb", bg: "#eff6ff",  title: "Information We Collect" },
  { icon: Eye,      color: "#7c3aed", bg: "#f5f3ff",  title: "How We Use Your Data"  },
  { icon: Lock,     color: "#059669", bg: "#ecfdf5",  title: "Data Security"          },
  { icon: Share2,   color: "#db2777", bg: "#fdf2f8",  title: "Third-Party Sharing"   },
  { icon: User,     color: "#d97706", bg: "#fffbeb",  title: "Your Rights"           },
  { icon: ShieldCheck,color:"#6b7280",bg: "#f9fafb",  title: "Cookie Usage"          },
];

const DATA_USES = [
  { label: "Verify Identity",    color: "#2563eb", bg: "#eff6ff" },
  { label: "Connect Alumni",     color: "#7c3aed", bg: "#f5f3ff" },
  { label: "Process Donations",  color: "#059669", bg: "#ecfdf5" },
  { label: "Send Updates",       color: "#db2777", bg: "#fdf2f8" },
];

const THIRD_PARTIES = [
  { name: "Keycloak",             desc: "For secure authentication and user management." },
  { name: "Brevo",                desc: "For sending platform-related emails and updates." },
  { name: "Payment Processors",  desc: "To securely handle donation transactions." },
];

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        .privacy-page * { box-sizing: border-box; }
        .privacy-page { font-family: 'Plus Jakarta Sans', sans-serif; }
        .overview-card { transition: all 0.22s; }
        .overview-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08) !important; }
      `}</style>

      <div className="privacy-page" style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}>

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

          <div style={{ position: "relative", zIndex: 1, maxWidth: 640 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20,
              fontSize: 11.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#c7d2fe", background: "rgba(255,255,255,0.12)", padding: "5px 14px", borderRadius: 50,
            }}>
              <Sparkles size={12} strokeWidth={2.5} /> Legal &amp; Privacy
            </span>
            <h1 style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 900, letterSpacing: "-1px", lineHeight: 1.15, margin: "0 0 18px" }}>
              Privacy{" "}<span style={{ color: "#fde68a" }}>Policy</span>
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.78)", lineHeight: 1.75, margin: "0 0 16px", fontWeight: 400, maxWidth: 520 }}>
              At Ape Iskole, we are committed to protecting your personal information and being fully transparent about how we handle your data.
            </p>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Last updated: March 31, 2026</span>
          </div>
        </div>

        {/* ═══ OVERVIEW CARDS ═══ */}
        <section style={{ marginBottom: 48 }}>
          <SectionHead label="At a Glance" title="What This Policy Covers" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>
            {OVERVIEW.map(({ icon: Icon, color, bg, title }, i) => (
              <div
                key={i}
                className="overview-card"
                style={{
                  background: "#fff", borderRadius: 16, border: "1px solid #f0f0f0",
                  padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                  display: "flex", alignItems: "center", gap: 14,
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={18} color={color} strokeWidth={2} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#0f0f0f" }}>{title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ MAIN CONTENT + SIDEBAR ═══ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24, alignItems: "start" }}>

          {/* ── MAIN ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* 1. Information We Collect */}
            <Card>
              <SectionHead label="Section 1" title="Information We Collect" />
              <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.8, margin: "0 0 20px", fontWeight: 400 }}>
                We collect information that you provide directly to us when you create an account, register a school, or make a donation.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
                {[
                  { icon: User,     color: "#2563eb", bg: "#eff6ff", title: "Personal Info",   desc: "Name, email, and alumni details." },
                  { icon: Database, color: "#7c3aed", bg: "#f5f3ff", title: "School Data",     desc: "Verification docs and contact info." },
                  { icon: Shield,   color: "#059669", bg: "#ecfdf5", title: "Usage Data",      desc: "Pages visited, clicks, and session info." },
                  { icon: Bell,     color: "#d97706", bg: "#fffbeb", title: "Communications",  desc: "Messages sent via the platform." },
                ].map(({ icon: Icon, color, bg, title, desc }, i) => (
                  <div key={i} style={{
                    padding: "16px", borderRadius: 14, background: bg,
                    border: `1px solid color-mix(in srgb,${color} 15%,transparent)`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <Icon size={15} color={color} strokeWidth={2} />
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#0f0f0f" }}>{title}</span>
                    </div>
                    <p style={{ fontSize: 12.5, color: "#6b7280", margin: 0, fontWeight: 500, lineHeight: 1.5 }}>{desc}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* 2. How We Use Data */}
            <Card>
              <SectionHead label="Section 2" title="How We Use Your Data" />
              <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.8, margin: "0 0 18px", fontWeight: 400 }}>
                Your data helps us provide a specialised experience for each alumnus and school. We use it to:
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {DATA_USES.map(({ label, color, bg }, i) => (
                  <span key={i} style={{
                    fontSize: 13, fontWeight: 700, color, background: bg,
                    padding: "6px 14px", borderRadius: 50,
                  }}>{label}</span>
                ))}
              </div>
            </Card>

            {/* 3. Data Security */}
            <Card>
              <SectionHead label="Section 3" title="Data Security" />
              <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.8, margin: "0 0 18px", fontWeight: 400 }}>
                We implement industry-standard security measures, including 256-bit encryption for all data transmissions and secure cloud storage. Identity management is powered by Keycloak.
              </p>
              <div style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "16px 18px", borderRadius: 14,
                background: "#ecfdf5", border: "1px solid #bbf7d0",
              }}>
                <ShieldCheck size={18} color="#059669" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 13.5, fontWeight: 700, color: "#065f46", margin: 0, lineHeight: 1.5 }}>
                  Your data is encrypted at rest and in transit at all times.
                </p>
              </div>
            </Card>

            {/* 4. Third-Party Sharing */}
            <Card>
              <SectionHead label="Section 4" title="Third-Party Sharing" />
              <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.8, margin: "0 0 18px", fontWeight: 400 }}>
                We do not sell your personal data. We only share information with partners necessary to provide our core services:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {THIRD_PARTIES.map(({ name, desc }, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "flex-start", gap: 12,
                    padding: "14px 16px", borderRadius: 12,
                    background: "#fafafa", border: "1px solid #f0f0f0",
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%", flexShrink: 0, marginTop: 6,
                      background: "var(--color-primary,#4f46e5)",
                    }} />
                    <p style={{ fontSize: 13.5, color: "#374151", margin: 0, lineHeight: 1.6 }}>
                      <span style={{ fontWeight: 800 }}>{name}:</span>{" "}
                      <span style={{ fontWeight: 500, color: "#6b7280" }}>{desc}</span>
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* 5. Your Rights */}
            <Card>
              <SectionHead label="Section 5" title="Your Rights" />
              <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.8, margin: "0 0 18px", fontWeight: 400 }}>
                Under applicable data protection laws, you have the following rights regarding your personal data:
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10 }}>
                {[
                  "Right to access your data",
                  "Right to correct inaccurate data",
                  "Right to delete your account",
                  "Right to data portability",
                  "Right to restrict processing",
                  "Right to withdraw consent",
                ].map((right, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <CheckCircle size={12} color="#059669" strokeWidth={2.5} />
                    </div>
                    <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>{right}</span>
                  </div>
                ))}
              </div>
            </Card>

          </div>

          {/* ── SIDEBAR ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 24 }}>

            {/* Quick nav */}
            <div style={{
              borderRadius: 20,
              background: "linear-gradient(135deg, color-mix(in srgb,var(--color-primary,#4f46e5) 8%,#fff), color-mix(in srgb,var(--color-secondary,#7c3aed) 5%,#fff))",
              border: "1px solid color-mix(in srgb,var(--color-primary,#4f46e5) 14%,transparent)",
              padding: "24px",
            }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: "#9ca3af", letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 16px" }}>Contents</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {["Information We Collect","How We Use Your Data","Data Security","Third-Party Sharing","Your Rights"].map((item, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "9px 12px", borderRadius: 10,
                    fontSize: 13, fontWeight: 600, color: "#4b5563",
                  }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                      background: "color-mix(in srgb,var(--color-primary,#4f46e5) 10%,transparent)",
                      fontSize: 10.5, fontWeight: 900, color: "var(--color-primary,#4f46e5)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>{i + 1}</span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Contact DPO */}
            <Card>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#0f0f0f", margin: "0 0 6px" }}>Have a privacy concern?</p>
              <p style={{ fontSize: 12.5, color: "#9ca3af", fontWeight: 500, margin: "0 0 16px" }}>Contact our data protection officer directly.</p>
              <button
                onClick={() => window.location.href = "mailto:privacy@apeiskole.lk"}
                style={{
                  width: "100%", padding: "10px", borderRadius: 12, border: "none",
                  background: "linear-gradient(135deg, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))",
                  color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  boxShadow: "0 4px 12px color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent)",
                }}
              >
                <Bell size={14} strokeWidth={2.5} /> Contact DPO
              </button>
            </Card>

          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;