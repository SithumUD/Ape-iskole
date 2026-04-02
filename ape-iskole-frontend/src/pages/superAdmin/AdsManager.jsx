import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const initialForm = {
  title: "",
  type: "",
  placement: "",
  link: "",
  image: null,
  startDate: "",
  endDate: "",
  budget: "",
  targetAudience: "",
  priority: "normal",
  status: "Draft",
  description: "",
};

const dummyAds = [
  {
    id: 1,
    title: "ABC Bookshop - Back to School Sale",
    type: "Banner",
    placement: "Homepage",
    clicks: 1240,
    impressions: 8200,
    ctr: 15.12,
    revenue: 12400,
    status: "Active",
    startDate: "2026-03-01",
    endDate: "2026-04-30",
    budget: 50000,
    priority: "high",
  },
  {
    id: 2,
    title: "SportZone - Sports Gear Discount",
    type: "Sidebar",
    placement: "School Page",
    clicks: 640,
    impressions: 4300,
    ctr: 14.88,
    revenue: 6400,
    status: "Active",
    startDate: "2026-03-15",
    endDate: "2026-05-15",
    budget: 30000,
    priority: "normal",
  },
  {
    id: 3,
    title: "Future Academy - Online Courses",
    type: "Inline",
    placement: "Events Page",
    clicks: 210,
    impressions: 1800,
    ctr: 11.67,
    revenue: 3150,
    status: "Draft",
    startDate: "2026-04-01",
    endDate: "2026-06-30",
    budget: 25000,
    priority: "low",
  },
  {
    id: 4,
    title: "TechHub - Student Laptop Discount",
    type: "Popup",
    placement: "Homepage",
    clicks: 890,
    impressions: 5600,
    ctr: 15.89,
    revenue: 13350,
    status: "Active",
    startDate: "2026-03-10",
    endDate: "2026-04-20",
    budget: 45000,
    priority: "high",
  },
  {
    id: 5,
    title: "Art Haven - Art Supplies Mega Sale",
    type: "Banner",
    placement: "Top Stories",
    clicks: 450,
    impressions: 3200,
    ctr: 14.06,
    revenue: 6750,
    status: "Expired",
    startDate: "2026-02-01",
    endDate: "2026-03-01",
    budget: 20000,
    priority: "normal",
  },
];

const placements = [
  { value: "Homepage", label: "🏠 Homepage", description: "Top banner and sidebar on homepage" },
  { value: "Events Page", label: "📅 Events Page", description: "Between events listings" },
  { value: "School Page", label: "🏫 School Page", description: "School profile sidebar" },
  { value: "Top Stories", label: "📰 Top Stories", description: "Within stories feed" },
  { value: "Donations Page", label: "💰 Donations Page", description: "Donation campaign sidebar" },
  { value: "Promotions Page", label: "🎁 Promotions Page", description: "Promotions listings" },
];

const types = [
  { value: "Banner", label: "📊 Banner", size: "728x90", description: "Full width banner" },
  { value: "Sidebar", label: "📌 Sidebar", size: "300x250", description: "Right sidebar placement" },
  { value: "Inline", label: "📄 Inline", size: "468x60", description: "Between content" },
  { value: "Popup", label: "🪟 Popup", size: "400x400", description: "Modal popup ad" },
];

const getStatusClass = (status) => {
  switch (status) {
    case "Active":
      return "badge status-approved";
    case "Draft":
      return "badge badge-blue";
    case "Expired":
      return "badge status-rejected";
    default:
      return "badge";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "Active": return "✓";
    case "Draft": return "📝";
    case "Expired": return "⏰";
    default: return "📄";
  }
};

const getPriorityClass = (priority) => {
  switch (priority) {
    case "high": return "badge-red";
    case "normal": return "badge-blue";
    case "low": return "badge-gray";
    default: return "badge-blue";
  }
};

const AdsManager = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [preview, setPreview] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [placementFilter, setPlacementFilter] = useState("All");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState("list");

  const totalAds = dummyAds.length;
  const activeAds = dummyAds.filter((a) => a.status === "Active").length;
  const totalClicks = dummyAds.reduce((sum, a) => sum + a.clicks, 0);
  const totalImpressions = dummyAds.reduce((sum, a) => sum + a.impressions, 0);
  const totalRevenue = dummyAds.reduce((sum, a) => sum + a.revenue, 0);
  const avgCTR = (totalClicks / totalImpressions) * 100;

  const filteredAds = useMemo(() => {
    return dummyAds.filter((ad) => {
      const matchesSearch = ad.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || ad.status === statusFilter;
      const matchesType = typeFilter === "All" || ad.type === typeFilter;
      const matchesPlacement = placementFilter === "All" || ad.placement === placementFilter;

      return matchesSearch && matchesStatus && matchesType && matchesPlacement;
    });
  }, [search, statusFilter, typeFilter, placementFilter]);

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData({ ...formData, image: file });

      if (file) {
        setPreview(URL.createObjectURL(file));
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title) errors.title = "Ad title is required";
    if (!formData.type) errors.type = "Ad type is required";
    if (!formData.placement) errors.placement = "Placement is required";
    if (!formData.link) errors.link = "Redirect URL is required";
    if (!formData.startDate) errors.startDate = "Start date is required";
    if (!formData.endDate) errors.endDate = "End date is required";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      console.log("Ad created:", formData);
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData(initialForm);
      setPreview("");
      setTimeout(() => setSubmitted(false), 3000);
    }, 1000);
  };

  const handleDeleteClick = (ad) => {
    setSelectedAd(ad);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    console.log("Deleting ad:", selectedAd);
    setShowDeleteModal(false);
    setSelectedAd(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="page-title">Ads Manager</h1>
          <p className="section-subtitle">
            Create and manage advertisements across the platform. Track performance,
            impressions, clicks, and revenue generated from ad campaigns.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-purple">💰 Revenue Module</span>
          <span className="badge badge-green">✓ {activeAds} Active</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Ads</p>
              <p className="text-2xl font-bold text-gray-900">{totalAds}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📢</span>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Campaigns</p>
              <p className="text-2xl font-bold text-green-600">{activeAds}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Clicks</p>
              <p className="text-2xl font-bold text-orange-600">{totalClicks.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👆</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">CTR: {avgCTR.toFixed(2)}%</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-purple-600">LKR {totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("list")}
            className={`px-6 py-2 rounded-xl font-medium transition-all ${
              activeTab === "list"
                ? "bg-primary text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            📋 Manage Ads
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`px-6 py-2 rounded-xl font-medium transition-all ${
              activeTab === "create"
                ? "bg-primary text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            ➕ Create New Ad
          </button>
        </div>
      </div>

      {/* Create Ad Form */}
      {activeTab === "create" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2 dashboard-card p-6">
            <h2 className="section-title mb-5">Create New Advertisement</h2>

            {submitted && (
              <div className="mb-5 card border border-green-200 bg-green-50 p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <h3 className="font-semibold text-green-800">
                      {isSubmitting ? "Creating ad..." : "Ad created successfully!"}
                    </h3>
                    <p className="text-sm text-green-700">
                      {!isSubmitting && "Your advertisement has been saved."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter ad title"
                  className="input"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  className="input"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="">Select type</option>
                  {types.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label} ({t.size})
                    </option>
                  ))}
                </select>
                {formData.type && (
                  <p className="text-xs text-gray-400 mt-1">
                    {types.find(t => t.value === formData.type)?.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Placement <span className="text-red-500">*</span>
                </label>
                <select
                  name="placement"
                  className="input"
                  value={formData.placement}
                  onChange={handleChange}
                >
                  <option value="">Select placement</option>
                  {placements.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
                {formData.placement && (
                  <p className="text-xs text-gray-400 mt-1">
                    {placements.find(p => p.value === formData.placement)?.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Redirect URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="link"
                  placeholder="https://example.com"
                  className="input"
                  value={formData.link}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget (LKR)
                </label>
                <input
                  type="number"
                  name="budget"
                  placeholder="Enter campaign budget"
                  className="input"
                  value={formData.budget}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  name="priority"
                  className="input"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  className="input"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  className="input"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate || new Date().toISOString().split("T")[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  name="targetAudience"
                  placeholder="e.g., Students, Parents, Teachers"
                  className="input"
                  value={formData.targetAudience}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Add ad description or notes..."
                  className="input textarea"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Image <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-primary transition">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                      />
                      <span className="text-3xl mb-2 block">🖼️</span>
                      <p className="text-sm text-gray-500">Click to upload ad image</p>
                      <p className="text-xs text-gray-400">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                  </label>
                  {preview && (
                    <div className="w-32 h-32 rounded-xl overflow-hidden border border-gray-200">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Creating...
                    </>
                  ) : (
                    <>
                      ✨ Create Ad
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setFormData(initialForm);
                    setPreview("");
                  }}
                >
                  🔄 Reset Form
                </button>
              </div>
            </form>
          </div>

          {/* Preview & Tips */}
          <div className="space-y-6">
            <div className="dashboard-card p-6">
              <h2 className="section-title mb-4">Ad Preview</h2>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="bg-gray-50 p-4 text-center">
                  {preview ? (
                    <img src={preview} alt="preview" className="max-w-full rounded-lg mx-auto" />
                  ) : (
                    <div className="h-32 flex items-center justify-center text-gray-400 text-sm">
                      Ad preview will appear here
                    </div>
                  )}
                </div>
                <div className="p-4 bg-white">
                  <p className="font-semibold text-gray-900">{formData.title || "Ad Title"}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Type: {formData.type || "—"} • Placement: {formData.placement || "—"}
                  </p>
                  {formData.link && (
                    <p className="text-xs text-primary mt-2 truncate">{formData.link}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="dashboard-card p-6">
              <h2 className="section-title mb-4">💡 Ad Best Practices</h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Use high-quality images for better engagement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Keep ad copy clear and concise</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Include a strong call-to-action (CTA)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Target relevant audience segments</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Monitor performance and optimize accordingly</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Manage Ads List */}
      {activeTab === "list" && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Ads
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                    🔍
                  </span>
                  <input
                    type="text"
                    placeholder="Search by ad title..."
                    className="input pl-12"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="md:w-40">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  className="input"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>

              <div className="md:w-40">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  className="input"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="All">All Types</option>
                  {types.map(t => (
                    <option key={t.value} value={t.value}>{t.value}</option>
                  ))}
                </select>
              </div>

              <div className="md:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Placement
                </label>
                <select
                  className="input"
                  value={placementFilter}
                  onChange={(e) => setPlacementFilter(e.target.value)}
                >
                  <option value="All">All Placements</option>
                  {placements.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            {(search || statusFilter !== "All" || typeFilter !== "All" || placementFilter !== "All") && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-600">Active filters:</span>
                {search && (
                  <span className="badge badge-blue text-sm">
                    Search: {search}
                    <button onClick={() => setSearch("")} className="ml-2 hover:text-red-500">✕</button>
                  </span>
                )}
                {statusFilter !== "All" && (
                  <span className="badge badge-purple text-sm">
                    Status: {statusFilter}
                    <button onClick={() => setStatusFilter("All")} className="ml-2 hover:text-red-500">✕</button>
                  </span>
                )}
                {typeFilter !== "All" && (
                  <span className="badge badge-green text-sm">
                    Type: {typeFilter}
                    <button onClick={() => setTypeFilter("All")} className="ml-2 hover:text-red-500">✕</button>
                  </span>
                )}
                {placementFilter !== "All" && (
                  <span className="badge badge-orange text-sm">
                    Placement: {placementFilter}
                    <button onClick={() => setPlacementFilter("All")} className="ml-2 hover:text-red-500">✕</button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                    setTypeFilter("All");
                    setPlacementFilter("All");
                  }}
                  className="text-sm text-red-500 hover:text-red-700 ml-2"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {filteredAds.length} Ads Found
            </h2>
            <div className="text-sm text-gray-500">
              Showing {filteredAds.length} of {dummyAds.length} ads
            </div>
          </div>

          {/* Ads Table */}
          <div className="dashboard-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Placement</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAds.map((ad) => (
                    <tr key={ad.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{ad.title}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {ad.type} • {ad.priority === "high" && "🔥 High Priority"}
                            {ad.priority === "normal" && "📌 Normal"}
                            {ad.priority === "low" && "📄 Low"}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{ad.placement}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm text-gray-900">{ad.clicks.toLocaleString()} clicks</div>
                          <div className="text-xs text-gray-400">{ad.impressions.toLocaleString()} impressions</div>
                          <div className="text-xs text-green-600">CTR: {ad.ctr.toFixed(2)}%</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-primary">LKR {ad.revenue.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">Budget: LKR {ad.budget.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-600">
                          <div>Start: {formatDate(ad.startDate)}</div>
                          <div>End: {formatDate(ad.endDate)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${getStatusClass(ad.status)} flex items-center gap-1 w-fit`}>
                          <span>{getStatusIcon(ad.status)}</span>
                          <span>{ad.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/super-admin/ads/${ad.id}`)}
                            className="btn btn-soft text-xs px-2 py-1"
                            title="View Details"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => navigate(`/super-admin/ads/edit/${ad.id}`)}
                            className="btn btn-outline text-xs px-2 py-1"
                            title="Edit Ad"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteClick(ad)}
                            className="btn btn-secondary text-xs px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100"
                            title="Delete Ad"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredAds.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📢</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No ads found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                    setTypeFilter("All");
                    setPlacementFilter("All");
                  }}
                  className="btn btn-outline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedAd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold mb-2">Delete Advertisement</h2>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete "{selectedAd.title}"? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="btn btn-secondary flex-1 bg-red-500 text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdsManager;