import React from 'react';
import {
  Cookie, Info, Settings, ShieldCheck, BarChart, Zap,
  ExternalLink, Sparkles, CheckCircle
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

const COOKIE_TYPES = [
  {
    icon: ShieldCheck,
    color: "#2563eb", bg: "#eff6ff",
    type: "Essential Cookies",
    desc: "Necessary for the website to function properly. These cannot be disabled.",
    examples: ["Authentication", "Security", "Load Balancing"],
  },
  {
    icon: BarChart,
    color: "#7c3aed", bg: "#f5f3ff",
    type: "Analytical Cookies",
    desc: "Help us understand how visitors interact with our platform to improve the experience.",
    examples: ["Page Views", "Session Duration", "Traffic Sources"],
  },
  {
    icon: Settings,
    color: "#059669", bg: "#ecfdf5",
    type: "Functional Cookies",
    desc: "Allow the website to remember choices you make such as language preference.",
    examples: ["Language Preference", "Region", "Font Size"],
  },
  {
    icon: Zap,
    color: "#d97706", bg: "#fffbeb",
    type: "Performance Cookies",
    desc: "Used to enhance the performance and speed of the platform for all users.",
    examples: ["Image Optimisation", "CDN Caching", "Prefetching"],
  },
];

const BROWSERS = [
  { name: "Google Chrome", url: "https://support.google.com/chrome/answer/95647" },
  { name: "Safari",        url: "https://support.apple.com/guide/safari/manage-cookies-sfri11471" },
  { name: "Firefox",       url: "https://support.mozilla.org/kb/enable-and-disable-cookies-website-preferences" },
  { name: "Microsoft Edge",url: "https://support.microsoft.com/en-us/topic/delete-and-manage-cookies" },
];

const CookiesPolicy = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
      @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
      .cookies-page * { box-sizing: border-box; }
      .cookies-page { font-family: 'Plus Jakarta Sans', sans-serif; }
      .cookie-card { transition: all 0.25s; }
      .cookie-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.1) !important; }
      .browser-btn { transition: all 0.18s; cursor: pointer; font-family: inherit; }
      .browser-btn:hover { border-color: color-mix(in srgb,var(--color-primary,#4f46e5) 40%,transparent) !important; color: var(--color-primary,#4f46e5) !important; }
    `}</style>

    <div className="cookies-page" style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}>

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
            Cookies{" "}<span style={{ color: "#fde68a" }}>Policy</span>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.78)", lineHeight: 1.75, margin: "0 0 16px", fontWeight: 400, maxWidth: 520 }}>
            We use cookies to improve your experience and ensure our platform runs smoothly. Learn what we collect and how to manage it.
          </p>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>Last updated: March 31, 2026</span>
        </div>
      </div>

      {/* ═══ INTRO QUOTE ═══ */}
      <div style={{
        background: "linear-gradient(135deg, color-mix(in srgb,var(--color-primary,#4f46e5) 5%,#fff), color-mix(in srgb,var(--color-secondary,#7c3aed) 4%,#fff))",
        border: "1.5px solid color-mix(in srgb,var(--color-primary,#4f46e5) 14%,transparent)",
        borderRadius: 20, padding: "32px 36px", marginBottom: 48,
        display: "flex", alignItems: "flex-start", gap: 18,
      }}>
        <div style={{
          width: 46, height: 46, borderRadius: 14, flexShrink: 0,
          background: "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Cookie size={22} color="#d97706" strokeWidth={2} />
        </div>
        <p style={{ fontSize: 15, color: "#4b5563", lineHeight: 1.8, margin: 0, fontStyle: "italic", fontWeight: 500 }}>
          "Cookies are small text files stored on your device when you visit a website. They help us recognise your device and store information about your preferences, making your next visit faster and the site more useful to you."
        </p>
      </div>

      {/* ═══ COOKIE TYPES ═══ */}
      <section style={{ marginBottom: 48 }}>
        <SectionHead label="What We Use" title="Types of Cookies" sub="Understanding the cookies we place on your device" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16 }}>
          {COOKIE_TYPES.map(({ icon: Icon, color, bg, type, desc, examples }, i) => (
            <div
              key={i}
              className="cookie-card"
              style={{
                background: "#fff", borderRadius: 20, border: "1px solid #f0f0f0",
                padding: "28px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 14, marginBottom: 18, background: bg,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={22} color={color} strokeWidth={2} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f0f0f", margin: "0 0 10px" }}>{type}</h3>
              <p style={{ fontSize: 13.5, color: "#6b7280", lineHeight: 1.7, margin: "0 0 16px", fontWeight: 400 }}>{desc}</p>
              <div style={{
                paddingTop: 14, borderTop: "1px solid #f3f4f6",
              }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>Typically used for:</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {examples.map((ex, j) => (
                    <span key={j} style={{
                      fontSize: 11.5, fontWeight: 700, color: color, background: bg,
                      padding: "3px 10px", borderRadius: 50,
                    }}>{ex}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ HOW TO MANAGE ═══ */}
      <section style={{ marginBottom: 48 }}>
        <SectionHead label="Your Control" title="How to Manage Cookies" sub="You can control cookie settings in your browser at any time" />
        <div style={{
          background: "#fff", borderRadius: 20, border: "1px solid #f0f0f0",
          padding: "32px 32px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.8, margin: "0 0 24px", fontWeight: 400 }}>
            Most web browsers allow you to control cookies through their settings preferences. If you choose to disable cookies, some features of Ape Iskole may not function correctly. Use the links below to manage cookies for your specific browser:
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10, marginBottom: 28 }}>
            {BROWSERS.map(({ name, url }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="browser-btn"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 16px", borderRadius: 12,
                  border: "1.5px solid #e5e7eb", background: "#fafafa",
                  fontSize: 13, fontWeight: 700, color: "#374151",
                  textDecoration: "none",
                }}
              >
                {name}
                <ExternalLink size={13} strokeWidth={2.2} />
              </a>
            ))}
          </div>

          {/* Privacy highlight */}
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 14,
            padding: "18px 20px", borderRadius: 14,
            background: "#eff6ff", border: "1px solid #bfdbfe",
          }}>
            <ShieldCheck size={20} color="#2563eb" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ fontSize: 13.5, fontWeight: 800, color: "#1e3a8a", margin: "0 0 4px" }}>Your privacy matters</p>
              <p style={{ fontSize: 13, color: "#1d4ed8", fontWeight: 500, margin: 0, lineHeight: 1.6 }}>
                We regularly review our cookie usage to maintain the highest security and performance standards for all alumni and schools on the platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ WHAT WE DON'T DO ═══ */}
      <section>
        <div style={{
          borderRadius: 24, overflow: "hidden", position: "relative",
          background: "linear-gradient(135deg,#f0fdf4 0%,#eff6ff 100%)",
          border: "1px solid #e0f2fe", padding: "48px 40px",
        }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 220, height: 220, borderRadius: "50%", background: "rgba(16,185,129,0.07)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <SectionHead label="Our Commitment" title="What We Never Do" sub="Our promise to you regarding your cookie data" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
              {[
                "We never sell your cookie data to third parties",
                "We never use cookies to build advertising profiles",
                "We never store sensitive personal data in cookies",
                "We never share analytics data with unauthorised parties",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <CheckCircle size={12} color="#059669" strokeWidth={2.5} />
                  </div>
                  <p style={{ fontSize: 13.5, color: "#374151", fontWeight: 600, margin: 0, lineHeight: 1.5 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  </>
);

export default CookiesPolicy;