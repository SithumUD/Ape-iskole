import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialProfile = {
  schoolName: "Royal College",
  schoolType: "Government",
  registrationNumber: "GOV/COL/001",
  established: "1835",
  email: "info@royalcollege.lk",
  phone: "+94 11 234 5678",
  alternatePhone: "+94 11 234 5679",
  website: "https://www.royalcollege.lk",
  district: "Colombo",
  city: "Colombo",
  address: "Rajakeeya Mawatha, Colombo 07",
  mapLink: "https://maps.google.com",
  description: "Royal College is one of the leading schools in Sri Lanka, known for academic excellence, sports, and student activities. Established in 1835, it has produced numerous national leaders, scholars, and sportsmen.",
  mission: "To nurture young minds into responsible citizens who will contribute to the nation's development.",
  vision: "To be the premier educational institution in Sri Lanka, fostering excellence in academics, sports, and character.",
  studentCount: 8500,
  teacherCount: 320,
  facebook: "https://facebook.com/royalcollege",
  youtube: "https://youtube.com/royalcollege",
  linkedin: "https://linkedin.com/school/royalcollege",
  instagram: "https://instagram.com/royalcollege",
};

const initialPreferences = {
  emailNotifications: true,
  approvalNotifications: true,
  donationNotifications: true,
  ticketNotifications: true,
  announcementNotifications: true,
  publicProfileVisible: true,
  allowExternalAnnouncements: false,
  showContactInfo: true,
  showStatistics: true,
  allowPublicDonations: true,
  autoApproveEvents: false,
};

const SchoolSettings = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(initialProfile);
  const [preferences, setPreferences] = useState(initialPreferences);
  const [logoPreview, setLogoPreview] = useState("");
  const [coverPreview, setCoverPreview] = useState("");
  const [savedSection, setSavedSection] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    if (type === "logo") {
      setLogoPreview(previewUrl);
    } else {
      setCoverPreview(previewUrl);
    }
  };

  const handleSave = (sectionName) => {
    setIsSubmitting(true);
    setTimeout(() => {
      console.log("Profile Data:", profileData);
      console.log("Preferences:", preferences);
      setSavedSection(sectionName);
      setIsSubmitting(false);
      setTimeout(() => setSavedSection(""), 3000);
    }, 1000);
  };

  const tabs = [
    { id: "profile", label: "🏫 School Profile", icon: "🏫" },
    { id: "branding", label: "🎨 Branding", icon: "🎨" },
    { id: "social", label: "🔗 Social Links", icon: "🔗" },
    { id: "preferences", label: "⚙️ Preferences", icon: "⚙️" },
    { id: "security", label: "🔒 Security", icon: "🔒" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="page-title">School Settings</h1>
          <p className="section-subtitle">
            Manage your school profile, contact details, social links, branding,
            and notification preferences.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-blue">✓ Profile Management</span>
          <span className="badge badge-green">🔒 Secure</span>
        </div>
      </div>

      {/* Success Message */}
      {savedSection && (
        <div className="card border border-green-200 bg-green-50 p-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <h3 className="font-semibold text-green-800">
                {isSubmitting ? "Saving..." : `${savedSection} saved successfully!`}
              </h3>
              <p className="text-sm text-green-700">
                {!isSubmitting && "Your changes have been updated."}
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

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* School Profile Form */}
          <section className="dashboard-card p-6 xl:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title">School Profile</h2>
              <button
                type="button"
                onClick={() => handleSave("School profile")}
                className="btn btn-primary flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Saving...
                  </>
                ) : (
                  <>
                    💾 Save Profile
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="schoolName"
                  value={profileData.schoolName}
                  onChange={handleProfileChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Type
                </label>
                <select
                  name="schoolType"
                  value={profileData.schoolType}
                  onChange={handleProfileChange}
                  className="input"
                >
                  <option value="Government">🏛️ Government</option>
                  <option value="Private">🏢 Private</option>
                  <option value="International">🌏 International</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={profileData.registrationNumber}
                  onChange={handleProfileChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Established Year
                </label>
                <input
                  type="text"
                  name="established"
                  value={profileData.established}
                  onChange={handleProfileChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alternate Phone
                </label>
                <input
                  type="text"
                  name="alternatePhone"
                  value={profileData.alternatePhone}
                  onChange={handleProfileChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={profileData.website}
                  onChange={handleProfileChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  value={profileData.district}
                  onChange={handleProfileChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={profileData.city}
                  onChange={handleProfileChange}
                  className="input"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={profileData.address}
                  onChange={handleProfileChange}
                  className="input textarea"
                  rows={2}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Map Link
                </label>
                <input
                  type="url"
                  name="mapLink"
                  value={profileData.mapLink}
                  onChange={handleProfileChange}
                  className="input"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Description
                </label>
                <textarea
                  name="description"
                  value={profileData.description}
                  onChange={handleProfileChange}
                  className="input textarea"
                  rows={3}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mission Statement
                </label>
                <textarea
                  name="mission"
                  value={profileData.mission}
                  onChange={handleProfileChange}
                  className="input textarea"
                  rows={2}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vision Statement
                </label>
                <textarea
                  name="vision"
                  value={profileData.vision}
                  onChange={handleProfileChange}
                  className="input textarea"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Students
                </label>
                <input
                  type="number"
                  name="studentCount"
                  value={profileData.studentCount}
                  onChange={handleProfileChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Teachers
                </label>
                <input
                  type="number"
                  name="teacherCount"
                  value={profileData.teacherCount}
                  onChange={handleProfileChange}
                  className="input"
                />
              </div>
            </div>
          </section>

          {/* Profile Preview */}
          <section className="space-y-6">
            <div className="dashboard-card p-6">
              <h2 className="section-title mb-4">Profile Preview</h2>

              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 relative">
                  {coverPreview ? (
                    <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                      Cover Image Preview
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="-mt-10 mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-md">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-3xl">🏫</span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900">{profileData.schoolName}</h3>
                  <p className="text-sm text-gray-500">
                    {profileData.schoolType} • Est. {profileData.established} • {profileData.city}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                    <span>👥 {profileData.studentCount.toLocaleString()} students</span>
                    <span>👨‍🏫 {profileData.teacherCount} teachers</span>
                  </div>
                  <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                    {profileData.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="dashboard-card p-6">
              <h2 className="section-title mb-4">Quick Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">School Type</span>
                  <span className="font-medium">{profileData.schoolType}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Established</span>
                  <span className="font-medium">{profileData.established}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Student-Teacher Ratio</span>
                  <span className="font-medium">
                    {Math.round(profileData.studentCount / profileData.teacherCount)}:1
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Branding Tab */}
      {activeTab === "branding" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <section className="dashboard-card p-6">
            <h2 className="section-title mb-5">Branding Assets</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Logo
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-primary transition">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, "logo")}
                        className="hidden"
                      />
                      <span className="text-3xl mb-2 block">🖼️</span>
                      <p className="text-sm text-gray-500">Upload new logo</p>
                      <p className="text-xs text-gray-400">PNG, JPG, SVG up to 2MB</p>
                    </div>
                  </label>
                  <div className="w-24 h-24 rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">🏫</span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-primary transition">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, "cover")}
                        className="hidden"
                      />
                      <span className="text-3xl mb-2 block">📸</span>
                      <p className="text-sm text-gray-500">Upload cover image</p>
                      <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                    </div>
                  </label>
                  <div className="w-32 h-20 rounded-xl border border-gray-200 overflow-hidden bg-gray-50">
                    {coverPreview ? (
                      <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                        Preview
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => handleSave("Branding")}
                  className="btn btn-primary w-full"
                >
                  💾 Save Branding
                </button>
              </div>
            </div>
          </section>

          <section className="dashboard-card p-6">
            <h2 className="section-title mb-5">Branding Preview</h2>

            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="h-36 bg-gradient-to-r from-primary/30 to-secondary/30 relative">
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    Cover Image
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="-mt-12 mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-white shadow-md">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo" className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-3xl">🏫</span>
                  )}
                </div>
                <h3 className="text-lg font-bold">{profileData.schoolName}</h3>
                <p className="text-sm text-gray-500">Your school branding preview</p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Social Links Tab */}
      {activeTab === "social" && (
        <section className="dashboard-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Social Media Links</h2>
            <button
              onClick={() => handleSave("Social links")}
              className="btn btn-primary"
            >
              💾 Save Social Links
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="mr-1">📘</span> Facebook
              </label>
              <input
                type="url"
                name="facebook"
                value={profileData.facebook}
                onChange={handleProfileChange}
                className="input"
                placeholder="https://facebook.com/your-school"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="mr-1">📺</span> YouTube
              </label>
              <input
                type="url"
                name="youtube"
                value={profileData.youtube}
                onChange={handleProfileChange}
                className="input"
                placeholder="https://youtube.com/your-school"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="mr-1">🔗</span> LinkedIn
              </label>
              <input
                type="url"
                name="linkedin"
                value={profileData.linkedin}
                onChange={handleProfileChange}
                className="input"
                placeholder="https://linkedin.com/school/your-school"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="mr-1">📷</span> Instagram
              </label>
              <input
                type="url"
                name="instagram"
                value={profileData.instagram}
                onChange={handleProfileChange}
                className="input"
                placeholder="https://instagram.com/your-school"
              />
            </div>
          </div>
        </section>
      )}

      {/* Preferences Tab */}
      {activeTab === "preferences" && (
        <section className="dashboard-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Notification Preferences</h2>
            <button
              onClick={() => handleSave("Preferences")}
              className="btn btn-primary"
            >
              💾 Save Preferences
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
              <input
                type="checkbox"
                name="emailNotifications"
                checked={preferences.emailNotifications}
                onChange={handlePreferenceChange}
                className="w-4 h-4 text-primary rounded"
              />
              <div>
                <span className="font-medium">📧 Email notifications</span>
                <p className="text-xs text-gray-400">Receive updates via email</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
              <input
                type="checkbox"
                name="approvalNotifications"
                checked={preferences.approvalNotifications}
                onChange={handlePreferenceChange}
                className="w-4 h-4 text-primary rounded"
              />
              <div>
                <span className="font-medium">✓ Approval notifications</span>
                <p className="text-xs text-gray-400">Get notified when events are approved</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
              <input
                type="checkbox"
                name="donationNotifications"
                checked={preferences.donationNotifications}
                onChange={handlePreferenceChange}
                className="w-4 h-4 text-primary rounded"
              />
              <div>
                <span className="font-medium">💰 Donation notifications</span>
                <p className="text-xs text-gray-400">Receive donation alerts</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
              <input
                type="checkbox"
                name="ticketNotifications"
                checked={preferences.ticketNotifications}
                onChange={handlePreferenceChange}
                className="w-4 h-4 text-primary rounded"
              />
              <div>
                <span className="font-medium">🎟️ Ticket notifications</span>
                <p className="text-xs text-gray-400">Ticket sales and booking updates</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
              <input
                type="checkbox"
                name="announcementNotifications"
                checked={preferences.announcementNotifications}
                onChange={handlePreferenceChange}
                className="w-4 h-4 text-primary rounded"
              />
              <div>
                <span className="font-medium">📢 Announcement notifications</span>
                <p className="text-xs text-gray-400">New announcements from platform</p>
              </div>
            </label>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="section-title mb-4">Privacy Settings</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="checkbox"
                  name="publicProfileVisible"
                  checked={preferences.publicProfileVisible}
                  onChange={handlePreferenceChange}
                  className="w-4 h-4 text-primary rounded"
                />
                <div>
                  <span className="font-medium">🌐 Public profile visible</span>
                  <p className="text-xs text-gray-400">Allow public to view school profile</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="checkbox"
                  name="showContactInfo"
                  checked={preferences.showContactInfo}
                  onChange={handlePreferenceChange}
                  className="w-4 h-4 text-primary rounded"
                />
                <div>
                  <span className="font-medium">📞 Show contact information</span>
                  <p className="text-xs text-gray-400">Display phone and email on public profile</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="checkbox"
                  name="showStatistics"
                  checked={preferences.showStatistics}
                  onChange={handlePreferenceChange}
                  className="w-4 h-4 text-primary rounded"
                />
                <div>
                  <span className="font-medium">📊 Show school statistics</span>
                  <p className="text-xs text-gray-400">Display student and teacher counts</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="checkbox"
                  name="allowExternalAnnouncements"
                  checked={preferences.allowExternalAnnouncements}
                  onChange={handlePreferenceChange}
                  className="w-4 h-4 text-primary rounded"
                />
                <div>
                  <span className="font-medium">📨 Allow external announcements</span>
                  <p className="text-xs text-gray-400">Receive announcements from other schools</p>
                </div>
              </label>
            </div>
          </div>
        </section>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="dashboard-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="font-semibold text-lg">Password Management</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Password and account security are handled through Keycloak identity management.
            </p>
            <button className="btn btn-outline w-full">Open Account Security</button>
          </div>

          <div className="dashboard-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💻</span>
              </div>
              <h3 className="font-semibold text-lg">Session Control</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Manage active sessions and log out from other devices.
            </p>
            <button className="btn btn-outline w-full">View Active Sessions</button>
          </div>

          <div className="dashboard-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="font-semibold text-lg">Account Role</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Your access level is controlled by the system administrator.
            </p>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <span className="badge badge-blue">School Administrator</span>
            </div>
          </div>

          <div className="dashboard-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="font-semibold text-lg">Audit Log</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              View all recent activities and changes made to your account.
            </p>
            <button className="btn btn-soft w-full">View Audit Log</button>
          </div>

          <div className="dashboard-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
              <h3 className="font-semibold text-lg">Two-Factor Authentication</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Add an extra layer of security to your account.
            </p>
            <button className="btn btn-outline w-full">Enable 2FA</button>
          </div>

          <div className="dashboard-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="font-semibold text-lg">Recovery Options</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Set up recovery email and phone number.
            </p>
            <button className="btn btn-soft w-full">Configure Recovery</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolSettings;