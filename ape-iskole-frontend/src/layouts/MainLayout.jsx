import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/layout/PublicNavbar";
import Footer from "../components/layout/PublicFooter";
import { ArrowUp } from "lucide-react";

/* ─── styles ─────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .main-layout * { box-sizing: border-box; }
  .main-layout {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f7f8fa;
  }

  .main-layout-main { flex: 1; }

  /* Back to top button */
  .btt-btn {
    position: fixed;
    bottom: 32px;
    right: 28px;
    z-index: 40;
    width: 44px;
    height: 44px;
    border-radius: 14px;
    border: 1.5px solid color-mix(in srgb,var(--color-primary,#4f46e5) 22%,transparent);
    background: #fff;
    color: var(--color-primary,#4f46e5);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 8px 24px rgba(0,0,0,0.10);
    transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
    opacity: 0;
    transform: translateY(12px);
    pointer-events: none;
  }
  .btt-btn.visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: all;
  }
  .btt-btn:hover {
    background: linear-gradient(135deg, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed));
    color: #fff;
    border-color: transparent;
    box-shadow: 0 12px 28px color-mix(in srgb,var(--color-primary,#4f46e5) 35%,transparent);
    transform: translateY(-2px);
  }
  .btt-btn:active { transform: translateY(0); }
`;

/* ─── Back to top ────────────────────────────────────── */
const BackToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 300);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <button
      className={`btt-btn ${visible ? "visible" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
    >
      <ArrowUp size={18} strokeWidth={2.5} />
    </button>
  );
};

/* ─── Main layout ────────────────────────────────────── */
const MainLayout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="main-layout">
      <style>{styles}</style>

      <Navbar />

      <main className="main-layout-main">
        <Outlet />
      </main>

      <Footer />

      <BackToTopButton />
    </div>
  );
};

export default MainLayout;