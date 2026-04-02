import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Shield, UserCheck, Heart, AlertCircle,
  Scale, Globe, ArrowRight, Sparkles, Zap, ChevronRight
} from 'lucide-react';

/* ── Section header ── */
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

const SECTIONS = [
  { id: "intro",      icon: FileText,    color: "#2563eb", bg: "#eff6ff", title: "1. Introduction"           },
  { id: "accounts",  icon: UserCheck,   color: "#7c3aed", bg: "#f5f3ff", title: "2. User Accounts"          },
  { id: "schools",   icon: Globe,       color: "#059669", bg: "#ecfdf5", title: "3. School Verification"    },
  { id: "donations", icon: Heart,       color: "#db2777", bg: "#fdf2f8", title: "4. Donations & Funding"    },
  { id: "conduct",   icon: Shield,      color: "#d97706", bg: "#fffbeb", title: "5. User Conduct"           },
  { id: "liability", icon: AlertCircle, color: "#6b7280", bg: "#f9fafb", title: "6. Limitation of Liability"},
  { id: "governing", icon: Scale,       color: "#0891b2", bg: "#ecfeff", title: "7. Governing Law"          },
];

const TermsConditions = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("intro");

  const scrollTo = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        .terms-page * { box-sizing: border-box; }
        .terms-page { font-family: 'Plus Jakarta Sans', sans-serif; }
        .nav-btn { transition: all 0.18s; cursor: pointer; border: none; font-family: inherit; text-align: left; }
        .nav-btn:hover { background: color-mix(in srgb,var(--color-primary,#4f46e5) 8%,transparent) !important; color: var(--color-primary,#4f46e5) !important; }
        .section-block { scroll-margin-top: 24px; }
      `}</style>

      <div className="terms-page" style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}>

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
              Terms &amp;{" "}<span style={{ color: "#fde68a" }}>Conditions</span>
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.78)", lineHeight: 1.75, margin: "0 0 16px", fontWeight: 400, maxWidth: 520 }}>
              By using Ape Iskole, you agree to these terms. Please read them carefully — they govern your relationship with the platform, schools, and other users.
            </p>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Last updated: March 31, 2026</span>
          </div>
        </div>

        {/* ═══ LAYOUT: SIDEBAR + CONTENT ═══ */}
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24, alignItems: "start" }}>

          {/* ── SIDEBAR ── */}
          <div style={{ position: "sticky", top: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{
              borderRadius: 20,
              background: "linear-gradient(135deg, color-mix(in srgb,var(--color-primary,#4f46e5) 8%,#fff), color-mix(in srgb,var(--color-secondary,#7c3aed) 5%,#fff))",
              border: "1px solid color-mix(in srgb,var(--color-primary,#4f46e5) 14%,transparent)",
              padding: "24px 16px",
            }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: "#9ca3af", letterSpacing: "0.14em", textTransform: "uppercase", margin: "0 0 14px", paddingLeft: 8 }}>
                Contents
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {SECTIONS.map(({ id, icon: Icon, color, bg, title }) => {
                  const active = activeSection === id;
                  return (
                    <button
                      key={id}
                      onClick={() => scrollTo(id)}
                      className="nav-btn"
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "10px 12px", borderRadius: 12, width: "100%",
                        background: active ? "color-mix(in srgb,var(--color-primary,#4f46e5) 8%,transparent)" : "transparent",
                        color: active ? "var(--color-primary,#4f46e5)" : "#4b5563",
                        fontSize: 13, fontWeight: active ? 800 : 600,
                      }}
                    >
                      <div style={{
                        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                        background: active ? "color-mix(in srgb,var(--color-primary,#4f46e5) 12%,transparent)" : bg,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Icon size={13} color={active ? "var(--color-primary,#4f46e5)" : color} strokeWidth={2} />
                      </div>
                      <span style={{ flex: 1, lineHeight: 1.3 }}>{title}</span>
                      {active && <ChevronRight size={13} strokeWidth={2.5} />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact card */}
            <Card style={{ padding: "20px" }}>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#0f0f0f", margin: "0 0 5px" }}>Questions about these Terms?</p>
              <p style={{ fontSize: 12.5, color: "#9ca3af", fontWeight: 500, margin: "0 0 14px" }}>Reach out to our support team.</p>
              <button
                onClick={() => navigate("/contact")}
                style={{
                  width: "100%", padding: "9px", borderRadius: 12, border: "none",
                  background: "linear-gradient(135deg, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))",
                  color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  boxShadow: "0 4px 12px color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent)",
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                Contact Support <ArrowRight size={13} strokeWidth={2.5} />
              </button>
            </Card>
          </div>

          {/* ── MAIN CONTENT ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* 1. Introduction */}
            <Card>
              <div id="intro" className="section-block">
                <SectionHead label="Section 1" title="Introduction" />
                <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.8, margin: "0 0 14px", fontWeight: 400 }}>
                  Welcome to Ape Iskole. By accessing or using our platform, you agree to comply with and be bound by these Terms and Conditions. These terms govern your relationship with schools, other alumni, and the platform itself. Please read them carefully before creating an account.
                </p>
                <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.8, margin: 0, fontWeight: 400 }}>
                  Ape Iskole serves as a facilitator for school–alumni engagement and does not guarantee the outcome of individual campaigns or events hosted on the platform.
                </p>
              </div>
            </Card>

            {/* 2. User Accounts */}
            <Card>
              <div id="accounts" className="section-block">
                <SectionHead label="Section 2" title="User Accounts" />
                <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.8, margin: "0 0 16px", fontWeight: 400 }}>
                  To access certain features, you must register for an account. You agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    "You must be at least 18 years old to create an account.",
                    "One person may only maintain one account unless otherwise authorised.",
                    "Account sharing is strictly prohibited and may result in permanent suspension.",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ width: 20, height: 20, borderRadius: 6, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <span style={{ fontSize: 10, fontWeight: 900, color: "#2563eb" }}>{i + 1}</span>
                      </div>
                      <p style={{ fontSize: 13.5, color: "#374151", fontWeight: 500, margin: 0, lineHeight: 1.6 }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* 3. School Verification */}
            <Card>
              <div id="schools" className="section-block">
                <SectionHead label="Section 3" title="School Verification" />
                <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.8, margin: "0 0 16px", fontWeight: 400 }}>
                  Schools must undergo a strict verification process. Standard requirements include official Ministry of Education registration and principal authorisation. Once verified, schools are granted "Verified Partner" status, allowing them to host donation projects and events.
                </p>
                <div style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "14px 16px", borderRadius: 12,
                  background: "#ecfdf5", border: "1px solid #bbf7d0",
                }}>
                  <Globe size={16} color="#059669" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#065f46", margin: 0, lineHeight: 1.5 }}>
                    Verified schools receive a green badge and gain full access to fundraising and event tools.
                  </p>
                </div>
              </div>
            </Card>

            {/* 4. Donations & Funding */}
            <Card>
              <div id="donations" className="section-block">
                <SectionHead label="Section 4" title="Donations &amp; Funding" />
                <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.8, margin: "0 0 16px", fontWeight: 400 }}>
                  All donations processed through Ape Iskole are intended for the specific projects mentioned by the schools. While we facilitate the transfer of funds, the ultimate responsibility for fund utilisation lies with the school administration.
                </p>
                <div style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "14px 16px", borderRadius: 12,
                  background: "#fdf2f8", border: "1px solid color-mix(in srgb,#db2777 20%,transparent)",
                }}>
                  <Heart size={16} color="#db2777" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#9d174d", margin: 0, lineHeight: 1.5, fontStyle: "italic" }}>
                    Transparency Guarantee: Schools are required to provide periodic updates and impact reports for every project funded through the platform.
                  </p>
                </div>
              </div>
            </Card>

            {/* 5. User Conduct */}
            <Card>
              <div id="conduct" className="section-block">
                <SectionHead label="Section 5" title="User Conduct" />
                <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.8, margin: "0 0 16px", fontWeight: 400 }}>
                  Users agree not to use the platform for any unlawful purpose or in any way that could harm, disable, or overburden the service. The following behaviours are strictly prohibited:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 8 }}>
                  {[
                    "Harassment of alumni or staff",
                    "Posting false or misleading info",
                    "Impersonating other users",
                    "Unauthorised data collection",
                  ].map((item, i) => (
                    <div key={i} style={{
                      padding: "10px 14px", borderRadius: 10,
                      background: "#fef2f2", border: "1px solid #fecaca",
                      fontSize: 13, fontWeight: 600, color: "#991b1b",
                      display: "flex", alignItems: "center", gap: 7,
                    }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#dc2626", flexShrink: 0 }} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* 6. Limitation of Liability */}
            <Card>
              <div id="liability" className="section-block">
                <SectionHead label="Section 6" title="Limitation of Liability" />
                <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.8, margin: 0, fontWeight: 400 }}>
                  Ape Iskole shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the service. We provide the platform on an "as-is" basis without warranties of any kind, express or implied.
                </p>
              </div>
            </Card>

            {/* 7. Governing Law */}
            <Card>
              <div id="governing" className="section-block">
                <SectionHead label="Section 7" title="Governing Law" />
                <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.8, margin: 0, fontWeight: 400 }}>
                  These Terms and Conditions shall be governed by and construed in accordance with the laws of the Democratic Socialist Republic of Sri Lanka. Any disputes shall be subject to the exclusive jurisdiction of the courts of Sri Lanka.
                </p>
              </div>
            </Card>

            {/* CTA */}
            <div style={{
              borderRadius: 24, overflow: "hidden", position: "relative",
              background: "linear-gradient(135deg,#f0fdf4 0%,#eff6ff 100%)",
              border: "1px solid #e0f2fe", padding: "36px 36px",
              display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 24,
            }}>
              <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: "rgba(16,185,129,0.07)", pointerEvents: "none" }} />
              <div style={{ position: "relative", zIndex: 1 }}>
                <p style={{ fontSize: 16, fontWeight: 900, color: "#0f0f0f", margin: "0 0 5px" }}>Questions about these Terms?</p>
                <p style={{ fontSize: 13.5, color: "#6b7280", fontWeight: 500, margin: 0 }}>
                  If you have any concerns, our support team is happy to help.
                </p>
              </div>
              <button
                onClick={() => navigate("/contact")}
                style={{
                  position: "relative", zIndex: 1,
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "12px 24px", borderRadius: 50, border: "none",
                  background: "linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed))",
                  color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
                  boxShadow: "0 6px 20px color-mix(in srgb,var(--color-primary,#4f46e5) 35%,transparent)",
                  flexShrink: 0,
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                Contact Support <ArrowRight size={15} strokeWidth={2.5} />
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default TermsConditions;