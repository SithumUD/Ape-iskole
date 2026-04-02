import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

// Public pages
import Home from "../pages/public/Home";
import Schools from "../pages/public/Schools";
import SchoolDetails from "../pages/public/SchoolDetails";
import Events from "../pages/public/Events";
import EventDetails from "../pages/public/EventDetails";
import Donations from "../pages/public/Donations";
import Promotions from "../pages/public/Promotions";
import TopStories from "../pages/public/TopStories";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import RegisterSchool from "../pages/public/RegisterSchool";
import StoryDetails from "../pages/public/StoryDetails";
import DonationDetails from "../pages/public/DonationDetails";
import Faq from "../pages/public/Faq";

// School admin pages
import SchoolAdminDashboard from "../pages/schoolAdmin/SchoolAdminDashboard";
import ManageEvents from "../pages/schoolAdmin/ManageEvents";
import CreateEvent from "../pages/schoolAdmin/CreateEvent";
import Announcements from "../pages/schoolAdmin/Announcements";
import Tickets from "../pages/schoolAdmin/Tickets";
import SchoolDonations from "../pages/schoolAdmin/SchoolDonations";
import Reports from "../pages/schoolAdmin/Reports";
import SchoolSettings from "../pages/schoolAdmin/SchoolSettings";
import SchoolProfile from "../pages/schoolAdmin/SchoolProfile";

// Super admin pages
import SuperAdminDashboard from "../pages/superAdmin/SuperAdminDashboard";
import SchoolsManagement from "../pages/superAdmin/SchoolsManagement";
import Approvals from "../pages/superAdmin/Approvals";
import AdsManager from "../pages/superAdmin/AdsManager";
import Sponsors from "../pages/superAdmin/Sponsors";
import Users from "../pages/superAdmin/Users";
import SuperAdminSettings from "../pages/superAdmin/SuperAdminSettings";
import PromotionManage from "../pages/superAdmin/PromotionManage";

// Fallback pages
import NotFound from "../pages/NotFound";
import ManegeStory from "../pages/schoolAdmin/ManegeStory";
import PrivacyPolicy from "../pages/public/PrivacyPolicy";
import TermsConditions from "../pages/public/TermsConditions";
import CookiesPolicy from "../pages/public/CookiesPolicy";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public website */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/schools" element={<Schools />} />
        <Route path="/schools/:id" element={<SchoolDetails />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/donations" element={<Donations />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/stories" element={<TopStories />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register-school" element={<RegisterSchool />} />
        <Route path="/stories/:id" element={<StoryDetails />}/> 
        <Route path="/donations/:id" element={<DonationDetails />}/>
        <Route path="/faq" element={<Faq/>}/>
        <Route path="/privacy" element={<PrivacyPolicy/>}/>
        <Route path="/terms" element={<TermsConditions/>}/>
        <Route path="/cookies" element={<CookiesPolicy/>}/>
      </Route>

      {/* School admin (Protected + SchoolAdmin Role) */}
      <Route
        path="/school-admin"
        element={
          <AdminRoute requiredRole="school_admin">
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SchoolAdminDashboard />} />
        <Route path="profile" element={<SchoolProfile/>}/>
        <Route path="events" element={<ManageEvents />} />
        <Route path="events/create" element={<CreateEvent />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="tickets" element={<Tickets />} />
        <Route path="donations" element={<SchoolDonations />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<SchoolSettings />} />
        <Route path="stories" element={<ManegeStory />}/>
      </Route>

      {/* Super admin (Protected + SuperAdmin Role) */}
      <Route
        path="/super-admin"
        element={
          <AdminRoute requiredRole="super_admin">
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SuperAdminDashboard />} />
        <Route path="schools" element={<SchoolsManagement />} />
        <Route path="approvals" element={<Approvals />} />
        <Route path="ads" element={<AdsManager />} />
        <Route path="sponsors" element={<Sponsors />} />
        <Route path="promotions" element={<PromotionManage/>}/>
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<SuperAdminSettings />} />
      </Route>

      {/* 404 & Fallbacks */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;