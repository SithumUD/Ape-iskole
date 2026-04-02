import React from "react";
import { Link } from "react-router-dom";
import { Home, Calendar, School, ArrowRight, BookOpen } from "lucide-react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
  @keyframes floatY   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
  @keyframes shimmer  { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  @keyframes pulse404 { 0%,100%{opacity:1} 50%{opacity:.7} }

  .nf*{box-sizing:border-box}
  .nf{
    font-family:'Plus Jakarta Sans',sans-serif;
    min-height:100vh;
    display:flex;
    align-items:center;
    justify-content:center;
    padding:32px 24px;
    position:relative;
    overflow:hidden;
    background:#fafafa;
  }

  /* background decorations */
  .nf-deco{position:absolute;border-radius:50%;pointer-events:none}

  /* card */
  .nf-card{
    position:relative;z-index:1;
    text-align:center;
    max-width:520px;
    width:100%;
    animation:fadeUp .6s ease both;
  }

  /* icon badge */
  .nf-icon-wrap{
    width:88px;height:88px;border-radius:26px;
    background:linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));
    display:flex;align-items:center;justify-content:center;
    margin:0 auto 28px;
    box-shadow:0 12px 36px color-mix(in srgb,var(--color-primary,#4f46e5) 36%,transparent);
    animation:floatY 3.6s ease-in-out infinite;
  }

  /* 404 number */
  .nf-number{
    font-size:clamp(80px,14vw,128px);
    font-weight:900;
    letter-spacing:-6px;
    line-height:1;
    margin:0 0 6px;
    background:linear-gradient(135deg,var(--color-primary,#4f46e5) 0%,var(--color-secondary,#7c3aed) 60%,#c026d3 100%);
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
    background-clip:text;
    animation:pulse404 3s ease-in-out infinite;
  }

  /* divider dots */
  .nf-dots{
    display:flex;align-items:center;justify-content:center;gap:6px;
    margin:0 0 20px;
  }
  .nf-dot{
    width:6px;height:6px;border-radius:50%;
    background:color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent);
  }
  .nf-dot.mid{
    width:10px;height:10px;
    background:var(--color-primary,#4f46e5);
  }

  /* text */
  .nf-title{
    font-size:clamp(22px,4vw,30px);
    font-weight:900;
    color:#0f0f0f;
    letter-spacing:-.5px;
    margin:0 0 12px;
  }
  .nf-desc{
    font-size:15.5px;
    color:#6b7280;
    line-height:1.75;
    font-weight:500;
    margin:0 0 36px;
    max-width:400px;
    margin-left:auto;
    margin-right:auto;
  }

  /* actions */
  .nf-actions{
    display:flex;
    flex-wrap:wrap;
    gap:12px;
    justify-content:center;
    margin-bottom:40px;
  }
  .nf-btn-primary{
    display:inline-flex;align-items:center;gap:7px;
    padding:13px 26px;border-radius:50px;border:none;
    background:linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed));
    color:#fff;font-weight:800;font-size:14px;
    cursor:pointer;font-family:inherit;text-decoration:none;
    box-shadow:0 6px 20px color-mix(in srgb,var(--color-primary,#4f46e5) 36%,transparent);
    transition:all .22s;
  }
  .nf-btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 28px color-mix(in srgb,var(--color-primary,#4f46e5) 44%,transparent)}
  .nf-btn-outline{
    display:inline-flex;align-items:center;gap:7px;
    padding:13px 22px;border-radius:50px;
    border:1.5px solid color-mix(in srgb,var(--color-primary,#4f46e5) 25%,transparent);
    background:color-mix(in srgb,var(--color-primary,#4f46e5) 6%,transparent);
    color:var(--color-primary,#4f46e5);font-weight:700;font-size:14px;
    cursor:pointer;font-family:inherit;text-decoration:none;
    transition:all .22s;
  }
  .nf-btn-outline:hover{background:color-mix(in srgb,var(--color-primary,#4f46e5) 12%,transparent);border-color:color-mix(in srgb,var(--color-primary,#4f46e5) 40%,transparent)}

  /* quick links */
  .nf-links-label{
    font-size:10.5px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;
    color:#c4c4c4;margin-bottom:14px;
  }
  .nf-links{
    display:flex;flex-wrap:wrap;gap:10px;justify-content:center;
  }
  .nf-link{
    display:inline-flex;align-items:center;gap:6px;
    padding:9px 16px;border-radius:50px;
    background:#fff;border:1px solid #ececec;
    font-size:13px;font-weight:700;color:#6b7280;
    text-decoration:none;
    box-shadow:0 1px 4px rgba(0,0,0,.04);
    transition:all .2s;
  }
  .nf-link:hover{
    border-color:color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent);
    color:var(--color-primary,#4f46e5);
    transform:translateY(-1px);
    box-shadow:0 4px 12px rgba(0,0,0,.07);
  }
`;

const NotFound = () => (
  <>
    <style>{styles}</style>
    <div className="nf">
      {/* Background blobs */}
      <div className="nf-deco" style={{ top: -120, right: -120, width: 480, height: 480, background: "color-mix(in srgb,var(--color-primary,#4f46e5) 5%,transparent)" }} />
      <div className="nf-deco" style={{ bottom: -80, left: -80, width: 360, height: 360, background: "color-mix(in srgb,var(--color-secondary,#7c3aed) 5%,transparent)" }} />
      <div className="nf-deco" style={{ top: "40%", left: "8%", width: 160, height: 160, background: "rgba(251,191,36,0.06)" }} />

      <div className="nf-card">
        {/* Floating icon */}
        <div className="nf-icon-wrap">
          <BookOpen size={38} color="#fff" strokeWidth={2} />
        </div>

        {/* 404 */}
        <p className="nf-number">404</p>

        {/* Decorative dots */}
        <div className="nf-dots">
          <span className="nf-dot" />
          <span className="nf-dot mid" />
          <span className="nf-dot" />
        </div>

        {/* Title & description */}
        <h1 className="nf-title">Page Not Found</h1>
        <p className="nf-desc">
          The page you're looking for doesn't exist or may have been moved.
          Let's get you back on track.
        </p>

        {/* Primary actions */}
        <div className="nf-actions">
          <Link to="/" className="nf-btn-primary">
            <Home size={16} strokeWidth={2.5} /> Go to Home
          </Link>
          <Link to="/events" className="nf-btn-outline">
            <Calendar size={16} strokeWidth={2.5} /> Browse Events
          </Link>
        </div>

        {/* Quick links */}
        <p className="nf-links-label">Or explore</p>
        <div className="nf-links">
          {[
            { to: "/schools",   icon: School,   label: "Schools"   },
            { to: "/stories",   icon: BookOpen, label: "Stories"   },
            { to: "/donations", icon: Home,     label: "Donations" },
          ].map(({ to, icon: Icon, label }) => (
            <Link key={to} to={to} className="nf-link">
              <Icon size={13} strokeWidth={2.2} />{label}
              <ArrowRight size={11} strokeWidth={2.5} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default NotFound;