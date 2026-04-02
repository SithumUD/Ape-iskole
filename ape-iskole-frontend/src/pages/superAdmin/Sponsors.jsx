import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const initialForm = {
  name: "",
  category: "",
  contactPerson: "",
  email: "",
  phone: "",
  website: "",
  sponsorType: "",
  logo: null,
  description: "",
  partnershipStart: "",
  partnershipEnd: "",
  contractValue: "",
  featured: false,
  socialLinks: {
    facebook: "",
    instagram: "",
    linkedin: "",
  },
};

const dummySponsors = [
  {
    id: 1,
    name: "ABC Bookshop",
    category: "Education",
    sponsorType: "Gold",
    email: "contact@abcbookshop.lk",
    phone: "+94 77 123 4567",
    website: "https://abcbookshop.lk",
    activeCampaigns: 4,
    status: "Active",
    partnershipStart: "2026-01-01",
    partnershipEnd: "2026-12-31",
    contractValue: 250000,
    impressions: 12500,
    clicks: 1870,
    featured: true,
  },
  {
    id: 2,
    name: "Future Tech",
    category: "Technology",
    sponsorType: "Silver",
    email: "hello@futuretech.lk",
    phone: "+94 71 987 6543",
    website: "https://futuretech.lk",
    activeCampaigns: 2,
    status: "Active",
    partnershipStart: "2026-02-01",
    partnershipEnd: "2026-07-31",
    contractValue: 150000,
    impressions: 8200,
    clicks: 1240,
    featured: false,
  },
  {
    id: 3,
    name: "Lanka Prints",
    category: "Printing",
    sponsorType: "Bronze",
    email: "info@lankaprints.lk",
    phone: "+94 76 888 2222",
    website: "https://lankaprints.lk",
    activeCampaigns: 1,
    status: "Pending",
    partnershipStart: "2026-03-15",
    partnershipEnd: "2026-09-15",
    contractValue: 75000,
    impressions: 3400,
    clicks: 510,
    featured: false,
  },
  {
    id: 4,
    name: "Edu Sports Hub",
    category: "Sports",
    sponsorType: "Gold",
    email: "team@edusportshub.lk",
    phone: "+94 75 456 7890",
    website: "https://edusportshub.lk",
    activeCampaigns: 0,
    status: "Inactive",
    partnershipStart: "2025-10-01",
    partnershipEnd: "2026-03-31",
    contractValue: 200000,
    impressions: 5600,
    clicks: 840,
    featured: false,
  },
  {
    id: 5,
    name: "Tech Innovators",
    category: "Technology",
    sponsorType: "Silver",
    email: "contact@techinnovators.lk",
    phone: "+94 77 888 9999",
    website: "https://techinnovators.lk",
    activeCampaigns: 3,
    status: "Active",
    partnershipStart: "2026-01-15",
    partnershipEnd: "2026-07-15",
    contractValue: 180000,
    impressions: 9800,
    clicks: 1470,
    featured: true,
  },
];

const categories = [
  "Education",
  "Technology",
  "Printing",
  "Sports",
  "Retail",
  "Food & Beverage",
  "Banking",
  "Telecom",
];

const getStatusClass = (status) => {
  switch (status) {
    case "Active":
      return "badge status-approved";
    case "Pending":
      return "badge status-pending";
    case "Inactive":
      return "badge status-rejected";
    default:
      return "badge badge-blue";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "Active": return "✓";
    case "Pending": return "⏳";
    case "Inactive": return "○";
    default: return "📄";
  }
};

const getSponsorTypeClass = (type) => {
  switch (type) {
    case "Gold":
      return "badge bg-yellow-500 text-white";
    case "Silver":
      return "badge bg-gray-400 text-white";
    case "Bronze":
      return "badge bg-orange-500 text-white";
    default:
      return "badge badge-blue";
  }
};

const getSponsorTypeIcon = (type) => {
  switch (type) {
    case "Gold": return "🥇";
    case "Silver": return "🥈";
    case "Bronze": return "🥉";
    default: return "🏅";
  }
};

const Sponsors = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [logoPreview, setLogoPreview] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState("list");

  const totalSponsors = dummySponsors.length;
  const activeSponsors = dummySponsors.filter((s) => s.status === "Active").length;
  const goldSponsors = dummySponsors.filter((s) => s.sponsorType === "Gold").length;
  const silverSponsors = dummySponsors.filter((s) => s.sponsorType === "Silver").length;
  const bronzeSponsors = dummySponsors.filter((s) => s.sponsorType === "Bronze").length;
  const totalImpressions = dummySponsors.reduce((sum, s) => sum + s.impressions, 0);
  const totalClicks = dummySponsors.reduce((sum, s) => sum + s.clicks, 0);
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;

  const filteredSponsors = useMemo(() => {
    return dummySponsors.filter((sponsor) => {
      const matchesSearch =
        sponsor.name.toLowerCase().includes(search.toLowerCase()) ||
        sponsor.category.toLowerCase().includes(search.toLowerCase()) ||
        sponsor.email.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "All" || sponsor.status === statusFilter;
      const matchesType = typeFilter === "All" || sponsor.sponsorType === typeFilter;
      const matchesCategory = categoryFilter === "All" || sponsor.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesType && matchesCategory;
    });
  }, [search, statusFilter, typeFilter, categoryFilter]);

  const handleChange = (e) => {
    const { name, value, files, type, checked } = e.target;

    if (type === "file") {
      const file = files?.[0] || null;
      setFormData((prev) => ({
        ...prev,
        logo: file,
      }));

      if (file) {
        setLogoPreview(URL.createObjectURL(file));
      } else {
        setLogoPreview("");
      }
      return;
    }

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    if (name.includes("social.")) {
      const socialPlatform = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialPlatform]: value,
        },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = "Sponsor name is required";
    if (!formData.category) errors.category = "Category is required";
    if (!formData.contactPerson) errors.contactPerson = "Contact person is required";
    if (!formData.email) errors.email = "Email is required";
    if (!formData.phone) errors.phone = "Phone is required";
    if (!formData.sponsorType) errors.sponsorType = "Sponsor tier is required";
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
      console.log("Sponsor data:", formData);
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData(initialForm);
      setLogoPreview("");
      setTimeout(() => setSubmitted(false), 3000);
    }, 1000);
  };

  const handleDeleteClick = (sponsor) => {
    setSelectedSponsor(sponsor);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    console.log("Deleting sponsor:", selectedSponsor);
    setShowDeleteModal(false);
    setSelectedSponsor(null);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatCurrency = (amount) => {
    return `LKR ${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="page-title">Sponsors Management</h1>
          <p className="section-subtitle">
            Manage platform sponsors, their visibility, campaign activity, and branding presence.
            Track performance metrics and partnership details.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-purple">🤝 Sponsorship Management</span>
          <span className="badge badge-green">✓ {activeSponsors} Active</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Sponsors</p>
              <p className="text-2xl font-bold text-gray-900">{totalSponsors}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🤝</span>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Partners</p>
              <p className="text-2xl font-bold text-green-600">{activeSponsors}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Impressions</p>
              <p className="text-2xl font-bold text-orange-600">{totalImpressions.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👁️</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">CTR: {avgCTR.toFixed(2)}%</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Clicks</p>
              <p className="text-2xl font-bold text-purple-600">{totalClicks.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👆</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sponsor Tier Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600">Gold Sponsors</p>
              <p className="text-2xl font-bold text-yellow-700">{goldSponsors}</p>
            </div>
            <span className="text-3xl">🥇</span>
          </div>
        </div>
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Silver Sponsors</p>
              <p className="text-2xl font-bold text-gray-700">{silverSponsors}</p>
            </div>
            <span className="text-3xl">🥈</span>
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600">Bronze Sponsors</p>
              <p className="text-2xl font-bold text-orange-700">{bronzeSponsors}</p>
            </div>
            <span className="text-3xl">🥉</span>
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
            📋 Manage Sponsors
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`px-6 py-2 rounded-xl font-medium transition-all ${
              activeTab === "create"
                ? "bg-primary text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            ➕ Add New Sponsor
          </button>
        </div>
      </div>

      {/* Add New Sponsor Form */}
      {activeTab === "create" && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2 dashboard-card p-6">
            <h2 className="section-title mb-5">Add New Sponsor</h2>

            {submitted && (
              <div className="mb-5 card border border-green-200 bg-green-50 p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✅</span>
                  <div>
                    <h3 className="font-semibold text-green-800">
                      {isSubmitting ? "Adding sponsor..." : "Sponsor added successfully!"}
                    </h3>
                    <p className="text-sm text-green-700">
                      {!isSubmitting && "The sponsor has been added to the platform."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sponsor Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter sponsor name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sponsor Tier <span className="text-red-500">*</span>
                </label>
                <select
                  name="sponsorType"
                  value={formData.sponsorType}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="">Select tier</option>
                  <option value="Gold">🥇 Gold</option>
                  <option value="Silver">🥈 Silver</option>
                  <option value="Bronze">🥉 Bronze</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className="input"
                  placeholder="Contact person name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  placeholder="sponsor@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input"
                  placeholder="+94 xx xxx xxxx"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="input"
                  placeholder="https://"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partnership Start Date
                </label>
                <input
                  type="date"
                  name="partnershipStart"
                  value={formData.partnershipStart}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partnership End Date
                </label>
                <input
                  type="date"
                  name="partnershipEnd"
                  value={formData.partnershipEnd}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Value (LKR)
                </label>
                <input
                  type="number"
                  name="contractValue"
                  value={formData.contractValue}
                  onChange={handleChange}
                  className="input"
                  placeholder="Enter contract amount"
                />
              </div>

              <div className="flex items-center pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span className="text-sm font-medium">Feature this sponsor</span>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="input textarea"
                  rows={3}
                  placeholder="Brief description about the sponsor partnership"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Social Links
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="url"
                    name="social.facebook"
                    placeholder="Facebook URL"
                    className="input"
                    value={formData.socialLinks.facebook}
                    onChange={handleChange}
                  />
                  <input
                    type="url"
                    name="social.instagram"
                    placeholder="Instagram URL"
                    className="input"
                    value={formData.socialLinks.instagram}
                    onChange={handleChange}
                  />
                  <input
                    type="url"
                    name="social.linkedin"
                    placeholder="LinkedIn URL"
                    className="input"
                    value={formData.socialLinks.linkedin}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sponsor Logo
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
                      <p className="text-sm text-gray-500">Click to upload logo</p>
                      <p className="text-xs text-gray-400">PNG, JPG, SVG up to 2MB</p>
                    </div>
                  </label>
                  {logoPreview && (
                    <div className="w-24 h-24 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
                      <img src={logoPreview} alt="Preview" className="max-w-full max-h-full object-contain" />
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
                      Adding...
                    </>
                  ) : (
                    <>
                      ✨ Add Sponsor
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setFormData(initialForm);
                    setLogoPreview("");
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
              <h2 className="section-title mb-4">Sponsor Preview</h2>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="h-32 bg-gray-50 flex items-center justify-center border-b border-gray-200">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Preview" className="max-h-24 max-w-[80%] object-contain" />
                  ) : (
                    <span className="text-gray-400 text-sm">Logo Preview</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-1 mb-2">
                    {formData.sponsorType && (
                      <span className={getSponsorTypeClass(formData.sponsorType)}>
                        {getSponsorTypeIcon(formData.sponsorType)} {formData.sponsorType}
                      </span>
                    )}
                    {formData.category && (
                      <span className="badge badge-blue">{formData.category}</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {formData.name || "Sponsor Name"}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {formData.contactPerson || "Contact Person"}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {formData.description || "Sponsor description preview"}
                  </p>
                </div>
              </div>
            </div>

            <div className="dashboard-card p-6">
              <h2 className="section-title mb-4">💡 Best Practices</h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Gold sponsors get premium homepage visibility</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Keep sponsor contact details updated</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Track performance metrics regularly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Offer renewal options before partnership ends</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Manage Sponsors List */}
      {activeTab === "list" && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Sponsors
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                    🔍
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name, category, or email..."
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
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="md:w-40">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tier
                </label>
                <select
                  className="input"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="All">All Tiers</option>
                  <option value="Gold">Gold</option>
                  <option value="Silver">Silver</option>
                  <option value="Bronze">Bronze</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn btn-outline flex items-center gap-2"
                >
                  <span>🔧</span>
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      className="input"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="All">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Active Filters Display */}
            {(search || statusFilter !== "All" || typeFilter !== "All" || categoryFilter !== "All") && (
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
                  <span className="badge badge-yellow text-sm">
                    Tier: {typeFilter}
                    <button onClick={() => setTypeFilter("All")} className="ml-2 hover:text-red-500">✕</button>
                  </span>
                )}
                {categoryFilter !== "All" && (
                  <span className="badge badge-green text-sm">
                    Category: {categoryFilter}
                    <button onClick={() => setCategoryFilter("All")} className="ml-2 hover:text-red-500">✕</button>
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                    setTypeFilter("All");
                    setCategoryFilter("All");
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
              {filteredSponsors.length} Sponsors Found
            </h2>
            <div className="text-sm text-gray-500">
              Showing {filteredSponsors.length} of {dummySponsors.length} sponsors
            </div>
          </div>

          {/* Sponsors Table */}
          <div className="dashboard-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sponsor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tier</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partnership</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredSponsors.map((sponsor) => (
                    <tr key={sponsor.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">{sponsor.name}</p>
                            {sponsor.featured && (
                              <span className="badge bg-yellow-500 text-white text-xs">⭐ Featured</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 mt-1">{sponsor.category}</p>
                          <p className="text-xs text-gray-400">{sponsor.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${getSponsorTypeClass(sponsor.sponsorType)} flex items-center gap-1 w-fit`}>
                          <span>{getSponsorTypeIcon(sponsor.sponsorType)}</span>
                          <span>{sponsor.sponsorType}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm text-gray-900">{sponsor.impressions.toLocaleString()} impressions</div>
                          <div className="text-xs text-gray-400">{sponsor.clicks.toLocaleString()} clicks</div>
                          <div className="text-xs text-green-600">
                            CTR: {((sponsor.clicks / sponsor.impressions) * 100).toFixed(2)}%
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div>Start: {formatDate(sponsor.partnershipStart)}</div>
                          <div>End: {formatDate(sponsor.partnershipEnd)}</div>
                          <div className="text-xs text-primary mt-1">{formatCurrency(sponsor.contractValue)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <span className={`badge ${getStatusClass(sponsor.status)} flex items-center gap-1 w-fit mb-1`}>
                            <span>{getStatusIcon(sponsor.status)}</span>
                            <span>{sponsor.status}</span>
                          </span>
                          <div className="text-xs text-gray-400 mt-1">{sponsor.activeCampaigns} active campaigns</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/super-admin/sponsors/${sponsor.id}`)}
                            className="btn btn-soft text-xs px-2 py-1"
                            title="View Details"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => navigate(`/super-admin/sponsors/edit/${sponsor.id}`)}
                            className="btn btn-outline text-xs px-2 py-1"
                            title="Edit Sponsor"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteClick(sponsor)}
                            className="btn btn-secondary text-xs px-2 py-1 bg-red-50 text-red-600 hover:bg-red-100"
                            title="Delete Sponsor"
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
            {filteredSponsors.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🤝</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No sponsors found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                    setTypeFilter("All");
                    setCategoryFilter("All");
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
      {showDeleteModal && selectedSponsor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold mb-2">Delete Sponsor</h2>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete "{selectedSponsor.name}"? This action cannot be undone.
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

export default Sponsors;