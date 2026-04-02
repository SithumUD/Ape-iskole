import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const initialForm = {
  event: "",
  ticketName: "",
  ticketType: "",
  price: "",
  quantity: "",
  minOrder: 1,
  maxOrder: 10,
  saleStart: "",
  saleEnd: "",
  description: "",
  benefits: [],
  enableQr: true,
  status: "Draft",
};

const demoTickets = [
  {
    id: 1,
    event: "Annual Sports Meet 2026",
    eventId: 1,
    ticketName: "VIP Pass",
    ticketType: "VIP",
    price: 3000,
    quantity: 200,
    sold: 126,
    remaining: 74,
    status: "Active",
    benefits: ["Front Row Seating", "Complimentary Refreshments", "Event Merchandise"],
    minOrder: 1,
    maxOrder: 4,
    revenue: 378000,
  },
  {
    id: 2,
    event: "Battle of the Blues",
    eventId: 2,
    ticketName: "Grandstand Ticket",
    ticketType: "Premium",
    price: 2000,
    quantity: 500,
    sold: 342,
    remaining: 158,
    status: "Active",
    benefits: ["Reserved Seating", "Event Program"],
    minOrder: 1,
    maxOrder: 8,
    revenue: 684000,
  },
  {
    id: 3,
    event: "Annual Concert Night",
    eventId: 3,
    ticketName: "Front Row Experience",
    ticketType: "VIP",
    price: 5000,
    quantity: 120,
    sold: 120,
    remaining: 0,
    status: "Sold Out",
    benefits: ["Front Row Seating", "Meet & Greet", "Complimentary Drinks"],
    minOrder: 1,
    maxOrder: 2,
    revenue: 600000,
  },
  {
    id: 4,
    event: "Art Exhibition",
    eventId: 4,
    ticketName: "Student Entry",
    ticketType: "Student",
    price: 500,
    quantity: 300,
    sold: 74,
    remaining: 226,
    status: "Active",
    benefits: ["Student ID Required", "Art Supplies Kit"],
    minOrder: 1,
    maxOrder: 5,
    revenue: 37000,
  },
  {
    id: 5,
    event: "Science Fair",
    eventId: 5,
    ticketName: "Family Pack",
    ticketType: "Family",
    price: 2500,
    quantity: 150,
    sold: 45,
    remaining: 105,
    status: "Draft",
    benefits: ["2 Adults + 2 Kids", "Activity Pass"],
    minOrder: 1,
    maxOrder: 2,
    revenue: 112500,
  },
];

const eventOptions = [
  { id: 1, name: "Annual Sports Meet 2026" },
  { id: 2, name: "Battle of the Blues" },
  { id: 3, name: "Annual Concert Night" },
  { id: 4, name: "Art Exhibition" },
  { id: 5, name: "Science Fair" },
];

const ticketTypes = [
  { value: "VIP", label: "VIP", icon: "⭐", defaultPrice: 5000 },
  { value: "Premium", label: "Premium", icon: "✨", defaultPrice: 2500 },
  { value: "General", label: "General Admission", icon: "🎫", defaultPrice: 1000 },
  { value: "Student", label: "Student Discount", icon: "👨‍🎓", defaultPrice: 500 },
  { value: "Early Bird", label: "Early Bird", icon: "🐦", defaultPrice: 800 },
  { value: "Family", label: "Family Pack", icon: "👨‍👩‍👧‍👦", defaultPrice: 3000 },
  { value: "Group", label: "Group Discount", icon: "👥", defaultPrice: 4000 },
];

const getStatusClass = (status) => {
  switch (status) {
    case "Active":
      return "badge status-approved";
    case "Sold Out":
      return "badge status-rejected";
    case "Draft":
      return "badge badge-blue";
    case "Expired":
      return "badge status-pending";
    default:
      return "badge badge-blue";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "Active": return "✓";
    case "Sold Out": return "✕";
    case "Draft": return "📝";
    case "Expired": return "⏰";
    default: return "📄";
  }
};

const Tickets = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [eventFilter, setEventFilter] = useState("All");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const totalTickets = demoTickets.reduce((sum, item) => sum + item.quantity, 0);
  const totalSold = demoTickets.reduce((sum, item) => sum + item.sold, 0);
  const totalRevenue = demoTickets.reduce((sum, item) => sum + item.revenue, 0);
  const activeTickets = demoTickets.filter(item => item.status === "Active").length;
  const soldOutTickets = demoTickets.filter(item => item.status === "Sold Out").length;

  const filteredTickets = useMemo(() => {
    return demoTickets.filter((ticket) => {
      const matchesSearch = ticket.ticketName.toLowerCase().includes(search.toLowerCase()) ||
                           ticket.event.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "All" || ticket.status === statusFilter;
      const matchesEvent = eventFilter === "All" || ticket.event === eventFilter;

      return matchesSearch && matchesStatus && matchesEvent;
    });
  }, [search, statusFilter, eventFilter]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBenefitsChange = (e) => {
    const benefits = e.target.value.split(",").map(b => b.trim()).filter(b => b);
    setFormData((prev) => ({
      ...prev,
      benefits,
    }));
  };

  const handleTicketTypeSelect = (value) => {
    const ticketType = ticketTypes.find(t => t.value === value);
    setFormData((prev) => ({
      ...prev,
      ticketType: value,
      price: ticketType?.defaultPrice || "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.event) newErrors.event = "Please select an event";
    if (!formData.ticketName) newErrors.ticketName = "Ticket name is required";
    if (!formData.ticketType) newErrors.ticketType = "Ticket type is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.quantity) newErrors.quantity = "Quantity is required";
    if (formData.minOrder < 1) newErrors.minOrder = "Minimum order must be at least 1";
    if (formData.maxOrder < formData.minOrder) newErrors.maxOrder = "Maximum order must be greater than minimum";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setSubmitted(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);
    
    setTimeout(() => {
      console.log("Ticket form submitted:", formData);
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Reset form after success
      setTimeout(() => {
        setSubmitted(false);
        setFormData(initialForm);
      }, 3000);
    }, 1500);
  };

  const handleSaveDraft = () => {
    console.log("Saving draft:", { ...formData, status: "Draft" });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleDeleteClick = (ticket) => {
    setSelectedTicket(ticket);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    console.log("Deleting ticket:", selectedTicket);
    setShowDeleteModal(false);
    setSelectedTicket(null);
  };

  const formatCurrency = (amount) => {
    return `LKR ${amount.toLocaleString()}`;
  };

  const getProgressPercentage = (sold, total) => {
    return total > 0 ? (sold / total) * 100 : 0;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="page-title">Ticket Management</h1>
          <p className="section-subtitle">
            Create ticket types, manage inventory, and monitor sales for your school events.
            Enable QR codes for seamless entry validation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge badge-purple">🎟️ QR Ticketing</span>
          <span className="badge badge-green">✓ Real-time Analytics</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Tickets</p>
              <p className="text-2xl font-bold text-gray-900">{totalTickets.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎫</span>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tickets Sold</p>
              <p className="text-2xl font-bold text-green-600">{totalSold.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active / Sold Out</p>
              <p className="text-2xl font-bold text-gray-900">{activeTickets} / {soldOutTickets}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Create Ticket Form */}
        <section className="dashboard-card p-6 xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="section-title">Create New Ticket Type</h2>
            <span className="badge badge-green flex items-center gap-1">
              <span>✨</span> Demo Mode
            </span>
          </div>

          {submitted && (
            <div className="mb-5 card border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">✅</span>
                <div>
                  <h3 className="font-semibold text-green-800">
                    {isSubmitting ? "Creating ticket..." : "Ticket created successfully!"}
                  </h3>
                  <p className="text-sm text-green-700">
                    {!isSubmitting && "Your ticket has been saved."}
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event <span className="text-red-500">*</span>
              </label>
              <select
                name="event"
                value={formData.event}
                onChange={handleChange}
                className={`input ${errors.event ? "border-red-500" : ""}`}
              >
                <option value="">Select event</option>
                {eventOptions.map((event) => (
                  <option key={event.id} value={event.name}>
                    {event.name}
                  </option>
                ))}
              </select>
              {errors.event && <p className="mt-1 text-sm text-red-500">{errors.event}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ticket Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ticketName"
                value={formData.ticketName}
                onChange={handleChange}
                className={`input ${errors.ticketName ? "border-red-500" : ""}`}
                placeholder="e.g., VIP Pass, General Admission"
              />
              {errors.ticketName && <p className="mt-1 text-sm text-red-500">{errors.ticketName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ticket Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.ticketType}
                onChange={(e) => handleTicketTypeSelect(e.target.value)}
                className={`input ${errors.ticketType ? "border-red-500" : ""}`}
              >
                <option value="">Select ticket type</option>
                {ticketTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label} (Default: {formatCurrency(type.defaultPrice)})
                  </option>
                ))}
              </select>
              {errors.ticketType && <p className="mt-1 text-sm text-red-500">{errors.ticketType}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (LKR) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`input ${errors.price ? "border-red-500" : ""}`}
                placeholder="1500"
              />
              {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className={`input ${errors.quantity ? "border-red-500" : ""}`}
                placeholder="500"
              />
              {errors.quantity && <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Order
              </label>
              <input
                type="number"
                name="minOrder"
                value={formData.minOrder}
                onChange={handleChange}
                className="input"
                min="1"
              />
              {errors.minOrder && <p className="mt-1 text-sm text-red-500">{errors.minOrder}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Order
              </label>
              <input
                type="number"
                name="maxOrder"
                value={formData.maxOrder}
                onChange={handleChange}
                className="input"
                min={formData.minOrder}
              />
              {errors.maxOrder && <p className="mt-1 text-sm text-red-500">{errors.maxOrder}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sale Start Date
              </label>
              <input
                type="date"
                name="saleStart"
                value={formData.saleStart}
                onChange={handleChange}
                className="input"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sale End Date
              </label>
              <input
                type="date"
                name="saleEnd"
                value={formData.saleEnd}
                onChange={handleChange}
                className="input"
                min={formData.saleStart || new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Benefits (comma separated)
              </label>
              <input
                type="text"
                value={formData.benefits.join(", ")}
                onChange={handleBenefitsChange}
                className="input"
                placeholder="e.g., Front Row Seating, Complimentary Drink, Event Merchandise"
              />
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
                placeholder="Additional details about this ticket..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-3 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  name="enableQr"
                  checked={formData.enableQr}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary rounded"
                />
                <span>🔲 Enable QR code validation for this ticket</span>
              </label>
              <p className="mt-1 text-xs text-gray-400 ml-7">
                QR codes allow for quick and secure entry validation at the event
              </p>
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
                    ✨ Create Ticket
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleSaveDraft}
                className="btn btn-outline flex items-center gap-2"
              >
                📝 Save as Draft
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="btn btn-soft flex items-center gap-2"
              >
                👁️ Preview
              </button>
            </div>
          </form>
        </section>

        {/* Preview & Notes */}
        <section className="space-y-6">
          {/* Ticket Preview Card */}
          <div className="dashboard-card p-6">
            <h2 className="section-title mb-4">Live Preview</h2>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50">
              <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white">
                <p className="text-xs opacity-90">
                  {formData.event || "Event Name"}
                </p>
                <h3 className="text-lg font-semibold mt-1">
                  {formData.ticketName || "Ticket Name"}
                </h3>
              </div>

              <div className="space-y-3 p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Type:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.ticketType || "Ticket Type"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Price:</span>
                  <span className="text-sm font-bold text-primary">
                    {formData.price ? formatCurrency(formData.price) : "LKR 0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Quantity:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formData.quantity || 0} tickets
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Order Limits:</span>
                  <span className="text-sm text-gray-600">
                    {formData.minOrder} - {formData.maxOrder} per person
                  </span>
                </div>

                {formData.benefits.length > 0 && (
                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-xs font-medium text-gray-500 mb-2">Benefits:</p>
                    <ul className="space-y-1">
                      {formData.benefits.slice(0, 3).map((benefit, idx) => (
                        <li key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                          <span>✓</span> {benefit}
                        </li>
                      ))}
                      {formData.benefits.length > 3 && (
                        <li className="text-xs text-gray-400">+{formData.benefits.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-center py-3 border-t border-gray-100">
                  {formData.enableQr ? (
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto bg-gray-100 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">🔲</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">QR Code Preview</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">QR validation disabled</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="dashboard-card p-6">
            <h2 className="section-title mb-4">💡 Quick Tips</h2>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Use separate ticket types for different entry levels (VIP, General, Student)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Enable QR codes for faster validation at event gates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Set order limits to prevent bulk buying</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Monitor sold-out tickets to plan additional releases</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Add benefits to increase ticket value perception</span>
              </li>
            </ul>
          </div>
        </section>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Tickets
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search by ticket name or event..."
                className="input pl-12"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="md:w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              className="input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Sold Out">Sold Out</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          <div className="md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event
            </label>
            <select
              className="input"
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
            >
              <option value="All">All Events</option>
              {eventOptions.map(event => (
                <option key={event.id} value={event.name}>{event.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(search || statusFilter !== "All" || eventFilter !== "All") && (
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
            {eventFilter !== "All" && (
              <span className="badge badge-green text-sm">
                Event: {eventFilter}
                <button onClick={() => setEventFilter("All")} className="ml-2 hover:text-red-500">✕</button>
              </span>
            )}
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
                setEventFilter("All");
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
          {filteredTickets.length} Ticket Types Found
        </h2>
        <div className="text-sm text-gray-500">
          Showing {filteredTickets.length} of {demoTickets.length} tickets
        </div>
      </div>

      {/* Ticket List Table */}
      <section className="dashboard-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inventory</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTickets.map((ticket) => {
                const progress = getProgressPercentage(ticket.sold, ticket.quantity);
                return (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{ticket.event}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{ticket.ticketName}</div>
                        <div className="text-sm text-gray-500">{ticket.ticketType}</div>
                        {ticket.benefits && ticket.benefits.length > 0 && (
                          <div className="text-xs text-gray-400 mt-1 line-clamp-1">
                            {ticket.benefits.slice(0, 2).join(", ")}
                            {ticket.benefits.length > 2 && ` +${ticket.benefits.length - 2}`}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-primary">{formatCurrency(ticket.price)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="min-w-[100px]">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-600">{ticket.sold} sold</span>
                          <span className="text-gray-600">of {ticket.quantity}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-primary rounded-full h-1.5 transition-all"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {ticket.remaining} remaining
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${getStatusClass(ticket.status)} flex items-center gap-1 w-fit`}>
                        <span>{getStatusIcon(ticket.status)}</span>
                        <span>{ticket.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{formatCurrency(ticket.revenue)}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/school-admin/tickets/${ticket.id}`)}
                          className="btn btn-soft text-xs px-3 py-1.5"
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => navigate(`/school-admin/tickets/edit/${ticket.id}`)}
                          className="btn btn-outline text-xs px-3 py-1.5"
                          title="Edit Ticket"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteClick(ticket)}
                          className="btn btn-secondary text-xs px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100"
                          title="Delete Ticket"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎫</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
                setEventFilter("All");
              }}
              className="btn btn-outline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-bold mb-2">Delete Ticket Type</h2>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete "{selectedTicket.ticketName}"? This action cannot be undone.
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

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Ticket Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white">
                <p className="text-xs opacity-90">{formData.event || "Event Name"}</p>
                <h3 className="text-lg font-semibold">{formData.ticketName || "Ticket Name"}</h3>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Type:</span>
                  <span className="text-sm">{formData.ticketType || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Price:</span>
                  <span className="text-sm font-bold text-primary">{formData.price ? formatCurrency(formData.price) : "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Quantity:</span>
                  <span className="text-sm">{formData.quantity || 0}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setShowPreview(false)} className="btn btn-primary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;