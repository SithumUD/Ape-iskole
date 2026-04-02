import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Heart, GraduationCap, ArrowUpRight } from "lucide-react";

const FOOTER_LINKS = {
  explore: [
    { path: "/",           label: "Home" },
    { path: "/schools",    label: "Schools" },
    { path: "/events",     label: "Events" },
    { path: "/promotions", label: "Promotions" },
    { path: "/donations",  label: "Donations" },
    { path: "/stories",    label: "Top Stories" },
  ],
  platform: [
    { path: "/about",   label: "About Us" },
    { path: "/contact", label: "Contact" },
    { path: "/faq",     label: "FAQ" },
    { path: "/help",    label: "Help Center" },
  ],
  legal: [
    { path: "/privacy", label: "Privacy Policy" },
    { path: "/terms",   label: "Terms & Conditions" },
    { path: "/cookies", label: "Cookie Policy" },
  ],
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .pfooter * { box-sizing: border-box; }
  .pfooter { font-family: 'Plus Jakarta Sans', sans-serif; }

  /* ── Shell ── */
  .pfooter {
    background: #fff;
    border-top: 1px solid #f0f0f0;
  }

  .pfooter-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 1.5rem;
  }

  /* ── Top band ── */
  .pfooter-top {
    display: grid;
    grid-template-columns: 1fr;
    gap: 48px;
    padding: 64px 0 56px;
    border-bottom: 1px solid #f3f4f6;
  }
  @media (min-width: 1024px) {
    .pfooter-top {
      grid-template-columns: 1.1fr 1.9fr;
      gap: 80px;
    }
  }

  /* Brand col */
  .pfooter-brand-link {
    display: inline-flex; align-items: center; gap: 10px;
    text-decoration: none; margin-bottom: 20px;
  }
  .pfooter-brand-icon {
    width: 40px; height: 40px; border-radius: 11px; flex-shrink: 0;
    background: linear-gradient(135deg, var(--color-primary, #4f46e5), var(--color-secondary, #7c3aed));
    display: flex; align-items: center; justify-content: center;
  }
  .pfooter-brand-name {
    font-size: 19px; font-weight: 800; letter-spacing: -0.4px; color: #0f0f0f;
  }
  .pfooter-brand-name span { color: var(--color-primary, #4f46e5); }

  .pfooter-desc {
    font-size: 14.5px; font-weight: 500; color: #6b7280;
    line-height: 1.75; max-width: 360px; margin-bottom: 28px;
  }

  /* Contact pills */
  .pfooter-contacts { display: flex; flex-direction: column; gap: 10px; }
  .pfooter-contact-item {
    display: inline-flex; align-items: center; gap: 10px;
    text-decoration: none; color: #6b7280;
    font-size: 13.5px; font-weight: 500;
    transition: color 0.18s;
  }
  .pfooter-contact-item:hover { color: var(--color-primary, #4f46e5); }
  .pfooter-contact-icon {
    width: 32px; height: 32px; border-radius: 9px; flex-shrink: 0;
    background: #f7f7f8; border: 1px solid #ececec;
    display: flex; align-items: center; justify-content: center;
    color: #9ca3af; transition: all 0.18s;
  }
  .pfooter-contact-item:hover .pfooter-contact-icon {
    background: color-mix(in srgb, var(--color-primary, #4f46e5) 9%, transparent);
    border-color: color-mix(in srgb, var(--color-primary, #4f46e5) 20%, transparent);
    color: var(--color-primary, #4f46e5);
  }

  /* Link columns grid */
  .pfooter-cols {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px 32px;
  }
  @media (min-width: 640px) {
    .pfooter-cols { grid-template-columns: repeat(3, 1fr); }
  }

  .pfooter-col-head {
    font-size: 10.5px; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.16em; color: #9ca3af; margin-bottom: 18px;
  }
  .pfooter-col-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
  .pfooter-col-link {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 13.5px; font-weight: 600; color: #4b5563;
    text-decoration: none; transition: color 0.18s;
  }
  .pfooter-col-link:hover { color: var(--color-primary, #4f46e5); }
  .pfooter-col-link svg { opacity: 0; transform: translateX(-3px); transition: all 0.18s; }
  .pfooter-col-link:hover svg { opacity: 1; transform: translateX(0); }

  /* ── Bottom bar ── */
  .pfooter-bottom {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 24px 0;
  }
  @media (min-width: 768px) {
    .pfooter-bottom {
      flex-direction: row;
      justify-content: space-between;
    }
  }

  .pfooter-bottom-left {
    display: flex; flex-direction: column; align-items: center; gap: 10px;
  }
  @media (min-width: 640px) {
    .pfooter-bottom-left { flex-direction: row; gap: 20px; }
  }

  .pfooter-copy {
    font-size: 12.5px; font-weight: 600; color: #9ca3af;
  }

  .pfooter-legal-links {
    display: flex; flex-wrap: wrap; gap: 12px; justify-content: center;
  }
  .pfooter-legal-link {
    font-size: 11.5px; font-weight: 700; color: #c4c4c4;
    text-decoration: none; transition: color 0.18s;
    text-transform: uppercase; letter-spacing: 0.04em;
  }
  .pfooter-legal-link:hover { color: #374151; }

  .pfooter-bottom-right {
    display: flex; align-items: center; gap: 12px; flex-shrink: 0; flex-wrap: wrap; justify-content: center;
  }
  .pfooter-made {
    display: flex; align-items: center; gap: 5px;
    font-size: 11.5px; font-weight: 700; color: #b4b4b4; text-transform: uppercase; letter-spacing: 0.08em;
  }
  .pfooter-heart { color: #f43f5e; }

  .pfooter-divider {
    width: 1px; height: 14px; background: #e5e7eb; flex-shrink: 0;
  }

  .pfooter-devby {
    font-size: 11.5px; font-weight: 600; color: #b4b4b4;
  }
  .pfooter-devby-link {
    font-weight: 800; color: var(--color-primary, #4f46e5);
    text-decoration: none; transition: opacity 0.18s;
  }
  .pfooter-devby-link:hover { opacity: 0.75; }

  .pfooter-version {
    padding: 4px 10px; border-radius: 50px;
    background: #f7f7f8; border: 1px solid #ececec;
    font-size: 10px; font-weight: 800; color: #b4b4b4;
    text-transform: uppercase; letter-spacing: 0.08em;
  }

  /* ── Divider dot ── */
  .pfooter-bottom-left .dot {
    width: 3px; height: 3px; border-radius: 50%; background: #e5e7eb;
    display: none;
  }
  @media (min-width: 640px) { .pfooter-bottom-left .dot { display: block; } }
`;

const PublicFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="pfooter">
      <style>{styles}</style>
      <div className="pfooter-inner">

        {/* ── Top section ── */}
        <div className="pfooter-top">

          {/* Brand + contact */}
          <div>
            <Link to="/" className="pfooter-brand-link">
              <div className="pfooter-brand-icon">
                <GraduationCap size={19} color="#fff" strokeWidth={2.5} />
              </div>
              <span className="pfooter-brand-name">Ape<span>Iskole</span></span>
            </Link>

            <p className="pfooter-desc">
              The central infrastructure for Sri Lankan education — connecting
              schools, parents, and students through verified data and seamless
              digital tools.
            </p>

            <div className="pfooter-contacts">
              <a href="mailto:info@apeiskole.com" className="pfooter-contact-item">
                <span className="pfooter-contact-icon"><Mail size={14} strokeWidth={2.2} /></span>
                info@apeiskole.com
              </a>
              <a href="tel:+94771234567" className="pfooter-contact-item">
                <span className="pfooter-contact-icon"><Phone size={14} strokeWidth={2.2} /></span>
                +94 77 123 4567
              </a>
              <span className="pfooter-contact-item" style={{ cursor: "default" }}>
                <span className="pfooter-contact-icon"><MapPin size={14} strokeWidth={2.2} /></span>
                Colombo, Sri Lanka
              </span>
            </div>
          </div>

          {/* Link columns */}
          <div className="pfooter-cols">
            <div>
              <p className="pfooter-col-head">Explore</p>
              <ul className="pfooter-col-list">
                {FOOTER_LINKS.explore.map(({ path, label }) => (
                  <li key={path}>
                    <Link to={path} className="pfooter-col-link">
                      {label}
                      <ArrowUpRight size={11} strokeWidth={2.5} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="pfooter-col-head">Platform</p>
              <ul className="pfooter-col-list">
                {FOOTER_LINKS.platform.map(({ path, label }) => (
                  <li key={path}>
                    <Link to={path} className="pfooter-col-link">
                      {label}
                      <ArrowUpRight size={11} strokeWidth={2.5} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ gridColumn: "1 / -1" }} className="col-break">
              <p className="pfooter-col-head">Legal</p>
              <ul className="pfooter-col-list" style={{ flexDirection: "row", flexWrap: "wrap", gap: "10px 24px" }}>
                {FOOTER_LINKS.legal.map(({ path, label }) => (
                  <li key={path}>
                    <Link to={path} className="pfooter-col-link">
                      {label}
                      <ArrowUpRight size={11} strokeWidth={2.5} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="pfooter-bottom">
          <div className="pfooter-bottom-left">
            <span className="pfooter-copy">© {year} Ape Iskole. All rights reserved.</span>
            <span className="dot" />
            <div className="pfooter-legal-links">
              {FOOTER_LINKS.legal.map(({ path, label }) => (
                <Link key={path} to={path} className="pfooter-legal-link">{label}</Link>
              ))}
            </div>
          </div>

          <div className="pfooter-bottom-right">
            <span className="pfooter-made">
              Built with <Heart size={12} className="pfooter-heart" fill="currentColor" /> in Sri Lanka
            </span>
            <span className="pfooter-divider" />
            <span className="pfooter-devby">
              Developed &amp; maintained by{" "}
              <a
                href="https://digitech3000.com"
                target="_blank"
                rel="noopener noreferrer"
                className="pfooter-devby-link"
              >
                Digitech 3000
              </a>
            </span>
            <span className="pfooter-version">v1.0.0</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default PublicFooter;