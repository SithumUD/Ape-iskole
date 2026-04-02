import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SuperAdminSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    // General Settings
    platformName: "Ape Iskole",
    platformTagline: "Empowering Education in Sri Lanka",
    contactEmail: "admin@apeiskole.com",
    contactPhone: "+94 77 123 4567",
    supportEmail: "support@apeiskole.com",
    address: "Colombo, Sri Lanka",
    
    // Feature Toggles
    allowDonations: true,
    allowTickets: true,
    allowLiveStreaming: true,
    allowAnnouncements: true,
    allowPromotions: true,
    enableAI: false,
    enableQRValidation: true,
    
    // Integrations
    googleMapsEnabled: true,
    youtubeEnabled: true,
    facebookEnabled: true,
    instagramEnabled: true,
    linkedinEnabled: true,
    
    // Security Settings
    requireEmailVerification: true,
    requireAdminApproval: true,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    
    // System Controls
    maintenanceMode: false,
    debugMode: false,
    analyticsEnabled: true,
    
    // Content Moderation
    autoApproveEvents: false,
    autoApprovePromotions: false,
    moderateAnnouncements: true,
    
    // Email Settings
    smtpHost: "",
    smtpPort: "",
    smtpUser: "",
    smtpPassword: "",
  });

  const [logoPreview, setLogoPreview] = useState("");
  const [faviconPreview, setFaviconPreview] = useState("");
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setSettings((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === "file") {
      const file = files[0];
      if (file) {
        if (name === "logo") {
          setLogoPreview(URL.createObjectURL(file));
        } else if (name === "favicon") {
          setFaviconPreview(URL.createObjectURL(file));
        }
      }
    } else {
      setSettings((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      console.log("Saved settings:", settings);
      setIsSubmitting(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all settings to default?")) {
      window.location.reload();
    }
  };

  const tabs = [
    { id: "general", label: "⚙️ General", icon: "⚙️" },
    { id: "features", label: "🎯 Features", icon: "🎯" },
    { id: "integrations", label: "🔗 Integrations", icon: "🔗" },
    { id: "security", label: "🔒 Security", icon: "🔒" },
    { id: "moderation", label: "✓ Moderation", icon: "✓" },
    { id: "email", label: "📧 Email", icon: "📧" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="page-title">Platform Settings</h1>
          <p className="section-subtitle">
            Configure global system behavior, feature toggles, integrations, and security settings.
            Changes here affect the entire platform.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-purple">⚡ Global Configuration</span>
          <span className="badge badge-blue">🔐 Admin Access Only</span>
        </div>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="card border border-green-200 bg-green-50 p-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <h3 className="font-semibold text-green-800">
                {isSubmitting ? "Saving settings..." : "Settings saved successfully!"}
              </h3>
              <p className="text-sm text-green-700">
                {!isSubmitting && "Your changes have been applied to the platform."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100 sticky top-20 z-10">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* General Settings Tab */}
      {activeTab === "general" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="dashboard-card p-6">
            <h2 className="section-title mb-5">General Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="platformName"
                  value={settings.platformName}
                  onChange={handleChange}
                  className="input"
                  placeholder="Platform Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Platform Tagline
                </label>
                <input
                  type="text"
                  name="platformTagline"
                  value={settings.platformTagline}
                  onChange={handleChange}
                  className="input"
                  placeholder="Tagline for the platform"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleChange}
                  className="input"
                  placeholder="contact@platform.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="text"
                  name="contactPhone"
                  value={settings.contactPhone}
                  onChange={handleChange}
                  className="input"
                  placeholder="+94 xx xxx xxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Support Email
                </label>
                <input
                  type="email"
                  name="supportEmail"
                  value={settings.supportEmail}
                  onChange={handleChange}
                  className="input"
                  placeholder="support@platform.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  className="input"
                  placeholder="Business Address"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="dashboard-card p-6">
              <h2 className="section-title mb-5">Branding</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform Logo
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-primary transition">
                        <input
                          type="file"
                          name="logo"
                          accept="image/*"
                          onChange={handleChange}
                          className="hidden"
                        />
                        <span className="text-3xl mb-2 block">🖼️</span>
                        <p className="text-sm text-gray-500">Upload new logo</p>
                        <p className="text-xs text-gray-400">PNG, JPG, SVG up to 2MB</p>
                      </div>
                    </label>
                    {logoPreview && (
                      <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                        <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Favicon
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-primary transition">
                        <input
                          type="file"
                          name="favicon"
                          accept="image/*"
                          onChange={handleChange}
                          className="hidden"
                        />
                        <span className="text-3xl mb-2 block">⭐</span>
                        <p className="text-sm text-gray-500">Upload favicon</p>
                        <p className="text-xs text-gray-400">ICO, PNG, SVG up to 1MB</p>
                      </div>
                    </label>
                    {faviconPreview && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                        <img src={faviconPreview} alt="Favicon preview" className="w-full h-full object-contain" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="dashboard-card p-6">
              <h2 className="section-title mb-5">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="btn btn-primary w-full flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Saving...
                    </>
                  ) : (
                    <>
                      💾 Save All Settings
                    </>
                  )}
                </button>
                <button
                  onClick={handleReset}
                  className="btn btn-outline w-full"
                >
                  🔄 Reset to Default
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature Controls Tab */}
      {activeTab === "features" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="dashboard-card p-6">
            <h2 className="section-title mb-5">Core Features</h2>
            <div className="space-y-3">
              {[
                { name: "allowDonations", label: "💰 Donations", description: "Enable fundraising campaigns" },
                { name: "allowTickets", label: "🎟️ Ticketing System", description: "Enable ticket sales for events" },
                { name: "allowLiveStreaming", label: "📺 Live Streaming", description: "Allow YouTube/Facebook embeds" },
                { name: "allowAnnouncements", label: "📢 Announcements", description: "Enable school announcements" },
                { name: "allowPromotions", label: "🎁 Promotions", description: "Enable promotional offers" },
              ].map((item) => (
                <div key={item.name} className="flex justify-between items-center p-3 border border-gray-100 rounded-xl">
                  <div>
                    <span className="font-medium">{item.label}</span>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name={item.name}
                      checked={settings[item.name]}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card p-6">
            <h2 className="section-title mb-5">Advanced Features</h2>
            <div className="space-y-3">
              {[
                { name: "enableAI", label: "🤖 AI Features", description: "AI-powered recommendations and analytics" },
                { name: "enableQRValidation", label: "🔲 QR Validation", description: "QR code scanning for ticket entry" },
                { name: "analyticsEnabled", label: "📊 Analytics", description: "Enable usage analytics and reporting" },
              ].map((item) => (
                <div key={item.name} className="flex justify-between items-center p-3 border border-gray-100 rounded-xl">
                  <div>
                    <span className="font-medium">{item.label}</span>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name={item.name}
                      checked={settings[item.name]}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === "integrations" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="dashboard-card p-6">
            <h2 className="section-title mb-5">Third-Party Integrations</h2>
            <div className="space-y-3">
              {[
                { name: "googleMapsEnabled", label: "🗺️ Google Maps", description: "Location mapping for schools" },
                { name: "youtubeEnabled", label: "📺 YouTube", description: "Embed YouTube videos and streams" },
                { name: "facebookEnabled", label: "📘 Facebook", description: "Facebook page integration" },
                { name: "instagramEnabled", label: "📷 Instagram", description: "Instagram feed integration" },
                { name: "linkedinEnabled", label: "🔗 LinkedIn", description: "LinkedIn company page" },
              ].map((item) => (
                <div key={item.name} className="flex justify-between items-center p-3 border border-gray-100 rounded-xl">
                  <div>
                    <span className="font-medium">{item.label}</span>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name={item.name}
                      checked={settings[item.name]}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-card p-6">
            <h2 className="section-title mb-5">Notification Channels</h2>
            <div className="space-y-3">
              {[
                { name: "emailNotifications", label: "📧 Email Notifications", description: "Send email alerts" },
                { name: "smsNotifications", label: "📱 SMS Notifications", description: "Send text message alerts" },
                { name: "pushNotifications", label: "🔔 Push Notifications", description: "Browser push notifications" },
              ].map((item) => (
                <div key={item.name} className="flex justify-between items-center p-3 border border-gray-100 rounded-xl">
                  <div>
                    <span className="font-medium">{item.label}</span>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name={item.name}
                      checked={settings[item.name]}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Security Settings Tab */}
      {activeTab === "security" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="dashboard-card p-6">
            <h2 className="section-title mb-5">Security Settings</h2>
            <div className="space-y-4">
              {[
                { name: "requireEmailVerification", label: "Require Email Verification", description: "Users must verify email before login" },
                { name: "requireAdminApproval", label: "Require Admin Approval", description: "New users need admin approval" },
              ].map((item) => (
                <div key={item.name} className="flex justify-between items-center p-3 border border-gray-100 rounded-xl">
                  <div>
                    <span className="font-medium">{item.label}</span>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name={item.name}
                      checked={settings[item.name]}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  name="sessionTimeout"
                  value={settings.sessionTimeout}
                  onChange={handleChange}
                  className="input"
                  min="5"
                  max="480"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Login Attempts
                </label>
                <input
                  type="number"
                  name="maxLoginAttempts"
                  value={settings.maxLoginAttempts}
                  onChange={handleChange}
                  className="input"
                  min="3"
                  max="10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="dashboard-card p-6">
              <h2 className="section-title mb-5">System Controls</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border border-gray-100 rounded-xl">
                  <div>
                    <span className="font-medium">🔧 Maintenance Mode</span>
                    <p className="text-xs text-gray-400">Users cannot access platform except admins</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="maintenanceMode"
                      checked={settings.maintenanceMode}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex justify-between items-center p-3 border border-gray-100 rounded-xl">
                  <div>
                    <span className="font-medium">🐛 Debug Mode</span>
                    <p className="text-xs text-gray-400">Enable detailed error logging</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="debugMode"
                      checked={settings.debugMode}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="dashboard-card p-6 bg-gradient-to-r from-red-50 to-orange-50">
              <h2 className="section-title mb-5">⚠️ Danger Zone</h2>
              <div className="space-y-3">
                <button className="btn btn-secondary w-full bg-red-500 text-white hover:bg-red-600">
                  🗑️ Clear All Cache
                </button>
                <button className="btn btn-outline w-full border-red-300 text-red-600 hover:bg-red-50">
                  📥 Export System Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Moderation Settings Tab */}
      {activeTab === "moderation" && (
        <div className="dashboard-card p-6">
          <h2 className="section-title mb-5">Content Moderation Rules</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              { name: "autoApproveEvents", label: "Auto-approve Events", description: "Events go live immediately" },
              { name: "autoApprovePromotions", label: "Auto-approve Promotions", description: "Promotions go live immediately" },
              { name: "moderateAnnouncements", label: "Moderate Announcements", description: "Require review for announcements" },
            ].map((item) => (
              <div key={item.name} className="flex justify-between items-center p-3 border border-gray-100 rounded-xl">
                <div>
                  <span className="font-medium">{item.label}</span>
                  <p className="text-xs text-gray-400">{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name={item.name}
                    checked={settings[item.name]}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Email Settings Tab */}
      {activeTab === "email" && (
        <div className="dashboard-card p-6">
          <h2 className="section-title mb-5">SMTP Configuration</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMTP Host
              </label>
              <input
                type="text"
                name="smtpHost"
                value={settings.smtpHost}
                onChange={handleChange}
                className="input"
                placeholder="smtp.gmail.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMTP Port
              </label>
              <input
                type="text"
                name="smtpPort"
                value={settings.smtpPort}
                onChange={handleChange}
                className="input"
                placeholder="587"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMTP Username
              </label>
              <input
                type="text"
                name="smtpUser"
                value={settings.smtpUser}
                onChange={handleChange}
                className="input"
                placeholder="user@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMTP Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="smtpPassword"
                  value={settings.smtpPassword}
                  onChange={handleChange}
                  className="input pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <button className="btn btn-outline w-full">
                📧 Send Test Email
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Button for all tabs except general (which has its own) */}
      {activeTab !== "general" && (
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className="btn btn-primary px-8 py-3 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin">⏳</span>
                Saving...
              </>
            ) : (
              <>
                💾 Save Settings
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default SuperAdminSettings;