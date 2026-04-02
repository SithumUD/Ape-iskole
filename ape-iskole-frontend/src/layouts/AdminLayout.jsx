import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/layout/AdminSidebar";
import AdminHeader from "../components/layout/AdminHeader";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  .admin-layout * { box-sizing: border-box; }

  /* Root: full viewport, no overflow — children scroll independently */
  .admin-layout {
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex;
    height: 100vh;
    overflow: hidden;
    background: #f7f8fa;
  }

  /* ── Sidebar column ──
     Pinned to full viewport height. Scrolls internally if nav grows long.
     Collapses to 0 width on mobile (overlay drawer handles mobile nav). */
  .admin-layout-sidebar {
    flex-shrink: 0;
    width: 268px;
    height: 100vh;
    position: sticky;
    top: 0;
    left: 0;
    overflow-y: auto;
    overflow-x: hidden;
  }
  @media (max-width: 1023px) {
    .admin-layout-sidebar {
      width: 0;
      overflow: visible; /* let the fixed overlay drawer still render */
    }
  }

  /* ── Right column ──
     Fills the remaining width and is the only scrollable region. */
  .admin-layout-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
  }

  /* Main content padding */
  .admin-layout-main {
    flex: 1;
    padding: 28px 24px 48px;
  }
  @media (min-width: 640px)  { .admin-layout-main { padding: 32px 28px 56px; } }
  @media (min-width: 1024px) { .admin-layout-main { padding: 36px 36px 64px; } }

  .admin-layout-content {
    max-width: 1280px;
    margin: 0 auto;
  }
`;

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-layout">
      <style>{styles}</style>

      {/* Sidebar — pinned, never scrolls with content */}
      <div className="admin-layout-sidebar">
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Body — the only scroll container: header stays sticky inside it */}
      <div className="admin-layout-body">
        <AdminHeader setSidebarOpen={setSidebarOpen} />

        <main className="admin-layout-main">
          <div className="admin-layout-content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;