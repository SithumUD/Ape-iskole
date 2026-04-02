import React, { useState } from 'react';
import {
  Mail, Phone, MapPin, Send, MessageSquare,
  CheckCircle2, AlertCircle, Loader2, Sparkles, Zap, Clock
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

const CONTACT_CARDS = [
  {
    icon: Mail,
    color: "#2563eb", bg: "#eff6ff",
    title: "Email Us",
    sub: "Our team is here to help.",
    value: "sithumudayangaofficial@gmail.com",
    href: "mailto:sithumudayangaofficial@gmail.com",
  },
  {
    icon: Phone,
    color: "#059669", bg: "#ecfdf5",
    title: "Call Us",
    sub: "Mon–Fri from 8am to 5pm.",
    value: "+94 71 234 5678",
    href: "tel:+94712345678",
  },
  {
    icon: MapPin,
    color: "#7c3aed", bg: "#f5f3ff",
    title: "Visit Us",
    sub: "Come say hello at our office.",
    value: "123, Education Square,\nColombo 07, Sri Lanka.",
    href: null,
  },
  {
    icon: Clock,
    color: "#d97706", bg: "#fffbeb",
    title: "Office Hours",
    sub: "We're available during these times.",
    value: "Mon–Fri: 8:00am – 5:00pm\nSat: 9:00am – 1:00pm",
    href: null,
  },
];

const Contact = () => {
  const [result, setResult] = useState("");
  const [status, setStatus] = useState("idle");

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus("loading");
    setResult("Sending...");

    const formData = new FormData(event.target);
    formData.append("c9521060-2ab3-4b00-bc83-6a09abe1448c", "sithumudayangaofficial@gmail.com");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setStatus("success");
        setResult("Message sent successfully!");
        event.target.reset();
      } else {
        setStatus("error");
        setResult(data.message);
      }
    } catch (error) {
      setStatus("error");
      setResult("Something went wrong. Please try again later.");
    }
  };

  const inputStyle = {
    width: "100%", padding: "11px 14px",
    borderRadius: 12, border: "1.5px solid #e5e7eb",
    fontSize: 13.5, fontWeight: 500, color: "#374151",
    outline: "none", fontFamily: "inherit",
    background: "#fafafa",
    transition: "border-color 0.18s, background 0.18s",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: 12, fontWeight: 700, color: "#9ca3af",
    letterSpacing: "0.1em", textTransform: "uppercase",
    display: "block", marginBottom: 6,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        .contact-page * { box-sizing: border-box; }
        .contact-page { font-family: 'Plus Jakarta Sans', sans-serif; }
        .contact-input:focus { border-color: var(--color-primary,#4f46e5) !important; background: #fff !important; }
        .contact-card { transition: all 0.25s; }
        .contact-card:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.1) !important; }
      `}</style>

      <div className="contact-page" style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}>

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
              color: "#c7d2fe", background: "rgba(255,255,255,0.12)",
              padding: "5px 14px", borderRadius: 50,
            }}>
              <Sparkles size={12} strokeWidth={2.5} /> We'd Love to Hear From You
            </span>
            <h1 style={{ fontSize: "clamp(28px,4vw,46px)", fontWeight: 900, letterSpacing: "-1px", lineHeight: 1.15, margin: "0 0 18px" }}>
              Get in{" "}
              <span style={{ color: "#fde68a" }}>Touch</span>
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,0.78)", lineHeight: 1.75, margin: 0, fontWeight: 400, maxWidth: 520 }}>
              Have questions about Ape Iskole? Whether you're a school, parent, or alumnus — we're here to help you connect with your community.
            </p>
          </div>
        </div>

        {/* ═══ CONTACT INFO CARDS ═══ */}
        <section style={{ marginBottom: 40 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
            {CONTACT_CARDS.map(({ icon: Icon, color, bg, title, sub, value, href }, i) => (
              <div
                key={i}
                className="contact-card"
                style={{
                  background: "#fff", borderRadius: 20, border: "1px solid #f0f0f0",
                  padding: "24px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}
              >
                <div style={{
                  width: 46, height: 46, borderRadius: 14, marginBottom: 16,
                  background: bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={20} color={color} strokeWidth={2} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f0f0f", margin: "0 0 4px" }}>{title}</h3>
                <p style={{ fontSize: 12.5, color: "#9ca3af", fontWeight: 500, margin: "0 0 10px" }}>{sub}</p>
                {href ? (
                  <a
                    href={href}
                    style={{
                      fontSize: 13, fontWeight: 700, color: color,
                      textDecoration: "none", wordBreak: "break-all", lineHeight: 1.5,
                    }}
                    onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                    onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
                  >
                    {value}
                  </a>
                ) : (
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", margin: 0, lineHeight: 1.6, whiteSpace: "pre-line" }}>
                    {value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ═══ FORM SECTION ═══ */}
        <section>
          <SectionHead label="Message Us" title="Send a Message" sub="Fill in the form below and we'll get back to you as soon as possible." />

          <div style={{
            background: "#fff", borderRadius: 20, border: "1px solid #f0f0f0",
            padding: "36px 36px 40px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            {/* Form header */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                background: "linear-gradient(135deg, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent)",
              }}>
                <MessageSquare size={20} color="#fff" strokeWidth={2} />
              </div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0f0f0f", margin: 0 }}>Send us a message</h3>
                <p style={{ fontSize: 13, color: "#9ca3af", fontWeight: 500, margin: 0 }}>We typically reply within 24 hours.</p>
              </div>
            </div>

            <form onSubmit={onSubmit}>
              {/* Name + Email row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18, marginBottom: 18 }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input
                    type="text" name="name" required placeholder="John Doe"
                    className="contact-input"
                    style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"; e.currentTarget.style.background = "#fff"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#fafafa"; }}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input
                    type="email" name="email" required placeholder="john@example.com"
                    className="contact-input"
                    style={inputStyle}
                    onFocus={e => { e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"; e.currentTarget.style.background = "#fff"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#fafafa"; }}
                  />
                </div>
              </div>

              {/* Subject */}
              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Subject</label>
                <input
                  type="text" name="subject" required placeholder="How can we help you?"
                  className="contact-input"
                  style={inputStyle}
                  onFocus={e => { e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"; e.currentTarget.style.background = "#fff"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#fafafa"; }}
                />
              </div>

              {/* Message */}
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Message</label>
                <textarea
                  name="message" required rows={5}
                  placeholder="Tell us more about your inquiry…"
                  className="contact-input"
                  style={{ ...inputStyle, resize: "none", lineHeight: 1.7 }}
                  onFocus={e => { e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"; e.currentTarget.style.background = "#fff"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#fafafa"; }}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                style={{
                  width: "100%", padding: "13px", borderRadius: 12, border: "none",
                  background: status === "loading"
                    ? "#d1d5db"
                    : "linear-gradient(135deg, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))",
                  color: "#fff", fontWeight: 800, fontSize: 14,
                  cursor: status === "loading" ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: status === "loading" ? "none" : "0 4px 16px color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent)",
                  transition: "opacity 0.18s",
                }}
                onMouseEnter={e => { if (status !== "loading") e.currentTarget.style.opacity = "0.88"; }}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                {status === "loading" ? (
                  <>
                    <Loader2 size={18} strokeWidth={2.5} style={{ animation: "spin 1s linear infinite" }} />
                    Sending Message…
                  </>
                ) : (
                  <>
                    <Send size={16} strokeWidth={2.5} />
                    Send Message
                  </>
                )}
              </button>

              {/* Status feedback */}
              {status === "success" && (
                <div style={{
                  marginTop: 16, padding: "14px 18px",
                  background: "#f0fdf4", border: "1px solid #bbf7d0",
                  borderRadius: 12, display: "flex", alignItems: "center", gap: 10,
                }}>
                  <CheckCircle2 size={18} color="#059669" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: 13.5, fontWeight: 700, color: "#065f46", margin: 0 }}>{result}</p>
                </div>
              )}

              {status === "error" && (
                <div style={{
                  marginTop: 16, padding: "14px 18px",
                  background: "#fef2f2", border: "1px solid #fecaca",
                  borderRadius: 12, display: "flex", alignItems: "center", gap: 10,
                }}>
                  <AlertCircle size={18} color="#dc2626" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                  <p style={{ fontSize: 13.5, fontWeight: 700, color: "#991b1b", margin: 0 }}>{result}</p>
                </div>
              )}
            </form>
          </div>
        </section>

        {/* ── spin keyframe for loader ── */}
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    </>
  );
};

export default Contact;