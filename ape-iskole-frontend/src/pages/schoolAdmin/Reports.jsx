import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const ticketSalesData = [
  {
    id: 1,
    event: "Annual Sports Meet 2026",
    ticketsSold: 3240,
    totalTickets: 5000,
    revenue: 1620000,
    status: "Completed",
    date: "2026-04-12",
  },
  {
    id: 2,
    event: "Battle of the Blues",
    ticketsSold: 11250,
    totalTickets: 15000,
    revenue: 11250000,
    status: "Active",
    date: "2026-04-22",
  },
  {
    id: 3,
    event: "Annual Concert Night",
    ticketsSold: 890,
    totalTickets: 1200,
    revenue: 890000,
    status: "Completed",
    date: "2026-07-15",
  },
  {
    id: 4,
    event: "International Art Exhibition",
    ticketsSold: 425,
    totalTickets: 800,
    revenue: 127500,
    status: "Upcoming",
    date: "2026-05-18",
  },
];

const donationData = [
  {
    id: 1,
    campaign: "Library Development Fund",
    raised: 320000,
    goal: 500000,
    donors: 86,
    status: "Active",
    endDate: "2026-05-30",
  },
  {
    id: 2,
    campaign: "Science Lab Upgrade",
    raised: 410000,
    goal: 750000,
    donors: 59,
    status: "Active",
    endDate: "2026-06-15",
  },
  {
    id: 3,
    campaign: "Sports Ground Improvement",
    raised: 600000,
    goal: 600000,
    donors: 112,
    status: "Completed",
    endDate: "2026-04-20",
  },
  {
    id: 4,
    campaign: "Student Scholarship Support",
    raised: 180000,
    goal: 900000,
    donors: 24,
    status: "Active",
    endDate: "2026-07-10",
  },
];

const eventPerformanceData = [
  {
    id: 1,
    event: "Annual Sports Meet 2026",
    views: 12500,
    clicks: 3420,
    shares: 890,
    engagement: 28.5,
    status: "Approved",
  },
  {
    id: 2,
    event: "Battle of the Blues",
    views: 25400,
    clicks: 6800,
    shares: 2100,
    engagement: 35.2,
    status: "Approved",
  },
  {
    id: 3,
    event: "International Art Exhibition",
    views: 3420,
    clicks: 890,
    shares: 245,
    engagement: 33.2,
    status: "Approved",
  },
  {
    id: 4,
    event: "Annual Concert Night",
    views: 8900,
    clicks: 2340,
    shares: 567,
    engagement: 32.7,
    status: "Pending",
  },
];

const announcementData = [
  {
    id: 1,
    title: "Big Match Tickets Now Available",
    audience: "All Schools",
    opens: 12500,
    clicks: 3420,
    engagement: 27.4,
    status: "Sent",
    date: "2026-03-15",
  },
  {
    id: 2,
    title: "Inter-school Art Competition Registration",
    audience: "Targeted Schools",
    opens: 3420,
    clicks: 890,
    engagement: 26.0,
    status: "Sent",
    date: "2026-03-18",
  },
  {
    id: 3,
    title: "Prefects Meeting Schedule",
    audience: "Classes 10-13",
    opens: 890,
    clicks: 234,
    engagement: 26.3,
    status: "Sent",
    date: "2026-03-10",
  },
  {
    id: 4,
    title: "Science Exhibition Volunteers Needed",
    audience: "Selected Classes",
    opens: 215,
    clicks: 45,
    engagement: 20.9,
    status: "Draft",
    date: "2026-03-20",
  },
];

const formatLKR = (amount) => `LKR ${amount.toLocaleString()}`;
const formatNumber = (num) => num.toLocaleString();
const formatPercentage = (num) => `${num.toFixed(1)}%`;

const getStatusClass = (status) => {
  switch (status) {
    case "Completed":
    case "Approved":
    case "Sent":
    case "Active":
    case "Upcoming":
      return status === "Upcoming" ? "badge badge-blue" : "badge status-approved";
    case "Pending":
      return "badge status-pending";
    case "Draft":
      return "badge badge-blue";
    case "Rejected":
      return "badge status-rejected";
    default:
      return "badge badge-blue";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "Completed": return "✓";
    case "Approved": return "✓";
    case "Sent": return "📧";
    case "Active": return "⚡";
    case "Upcoming": return "📅";
    case "Pending": return "⏳";
    case "Draft": return "📝";
    default: return "📄";
  }
};

const Reports = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [reportType, setReportType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [exportFormat, setExportFormat] = useState("csv");

  const totalTicketRevenue = ticketSalesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalTicketsSold = ticketSalesData.reduce((sum, item) => sum + item.ticketsSold, 0);
  const totalDonationRaised = donationData.reduce((sum, item) => sum + item.raised, 0);
  const totalDonors = donationData.reduce((sum, item) => sum + item.donors, 0);
  const totalViews = eventPerformanceData.reduce((sum, item) => sum + item.views, 0);
  const totalClicks = eventPerformanceData.reduce((sum, item) => sum + item.clicks, 0);
  const avgEngagement = eventPerformanceData.reduce((sum, item) => sum + item.engagement, 0) / eventPerformanceData.length;

  const filteredEventPerformance = useMemo(() => {
    return eventPerformanceData.filter((item) =>
      item.event.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const filteredAnnouncements = useMemo(() => {
    return announcementData.filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const handleExport = () => {
    console.log(`Exporting as ${exportFormat}:`, {
      ticketSales: ticketSalesData,
      donations: donationData,
      eventPerformance: eventPerformanceData,
      announcements: announcementData,
    });
    alert(`Report exported as ${exportFormat.toUpperCase()} (demo)`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="section-subtitle">
            Track ticket sales, donations, event performance, and announcement engagement.
            Gain insights to optimize your school's activities.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <select
            className="input w-32"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
          >
            <option value="csv">CSV</option>
            <option value="excel">Excel</option>
            <option value="pdf">PDF</option>
          </select>
          <button onClick={handleExport} className="btn btn-primary flex items-center gap-2">
            <span>📥</span> Export Report
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ticket Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatLKR(totalTicketRevenue)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎟️</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-400">{totalTicketsSold.toLocaleString()} tickets sold</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Donations Raised</p>
              <p className="text-2xl font-bold text-green-600">{formatLKR(totalDonationRaised)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-400">{totalDonors.toLocaleString()} donors contributed</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Engagement</p>
              <p className="text-2xl font-bold text-purple-600">{formatNumber(totalViews)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👁️</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-400">{formatNumber(totalClicks)} clicks • {avgEngagement.toFixed(1)}% CTR</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Campaigns</p>
              <p className="text-2xl font-bold text-orange-600">
                {donationData.filter(d => d.status === "Active").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-gray-400">{ticketSalesData.filter(t => t.status === "Active").length} active events</p>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-1">
          {[
            { id: "all", label: "📊 Overview" },
            { id: "tickets", label: "🎟️ Ticket Sales" },
            { id: "donations", label: "💰 Donations" },
            { id: "performance", label: "📈 Event Performance" },
            { id: "announcements", label: "📢 Announcements" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                reportType === tab.id
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Reports
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search events, campaigns, or announcements..."
                className="input pl-12"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline flex items-center gap-2"
            >
              <span>📅</span>
              {showFilters ? "Hide Date Filters" : "Show Date Filters"}
            </button>
          </div>
        </div>

        {/* Date Range Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  className="input"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  className="input"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ticket Sales Section */}
      {(reportType === "all" || reportType === "tickets") && (
        <section className="dashboard-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title">Ticket Sales Summary</h2>
              <p className="text-sm text-gray-500">
                Track event-wise ticket sales, revenue, and performance.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="badge badge-green">Total Revenue: {formatLKR(totalTicketRevenue)}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tickets Sold</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ticketSalesData.map((item) => {
                  const percentage = (item.ticketsSold / item.totalTickets) * 100;
                  return (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{item.event}</div>
                        <div className="text-xs text-gray-400">{item.date}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">{formatNumber(item.ticketsSold)}</div>
                        <div className="text-xs text-gray-400">of {formatNumber(item.totalTickets)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-primary">{formatLKR(item.revenue)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${getStatusClass(item.status)} flex items-center gap-1 w-fit`}>
                          <span>{getStatusIcon(item.status)}</span>
                          <span>{item.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="min-w-[100px]">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">{Math.round(percentage)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-primary rounded-full h-1.5"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Donation Summary Section */}
      {(reportType === "all" || reportType === "donations") && (
        <section className="dashboard-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title">Donation Campaign Summary</h2>
              <p className="text-sm text-gray-500">
                Review fundraising campaign performance and donor engagement.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="badge badge-purple">Total Donors: {totalDonors.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-4">
            {donationData.map((item) => {
              const percentage = Math.min(100, Math.round((item.raised / item.goal) * 100));
              return (
                <div key={item.id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.campaign}</h3>
                      <p className="text-sm text-gray-500">Ends: {item.endDate}</p>
                    </div>
                    <span className={`badge ${getStatusClass(item.status)} flex items-center gap-1`}>
                      <span>{getStatusIcon(item.status)}</span>
                      <span>{item.status}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-400">Raised</p>
                      <p className="font-semibold text-green-600">{formatLKR(item.raised)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Goal</p>
                      <p className="font-medium text-gray-900">{formatLKR(item.goal)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Donors</p>
                      <p className="font-medium text-gray-900">{item.donors.toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="text-primary font-medium">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Event Performance Section */}
      {(reportType === "all" || reportType === "performance") && (
        <section className="dashboard-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title">Event Performance Analytics</h2>
              <p className="text-sm text-gray-500">
                Analyze views, clicks, shares, and engagement rates of your event posts.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="badge badge-blue">Avg. CTR: {avgEngagement.toFixed(1)}%</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clicks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shares</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engagement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEventPerformance.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.event}</td>
                    <td className="px-6 py-4 text-gray-600">{formatNumber(item.views)}</td>
                    <td className="px-6 py-4 text-gray-600">{formatNumber(item.clicks)}</td>
                    <td className="px-6 py-4 text-gray-600">{formatNumber(item.shares)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-green-500 rounded-full h-1.5"
                            style={{ width: `${item.engagement}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{formatPercentage(item.engagement)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${getStatusClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEventPerformance.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No performance records found.</p>
            </div>
          )}
        </section>
      )}

      {/* Announcement Engagement Section */}
      {(reportType === "all" || reportType === "announcements") && (
        <section className="dashboard-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title">Announcement Engagement</h2>
              <p className="text-sm text-gray-500">
                Track how your announcements are performing with open rates and click-through rates.
              </p>
            </div>
            <div className="flex gap-2">
              <span className="badge badge-orange">Total Opens: {announcementData.reduce((sum, a) => sum + a.opens, 0).toLocaleString()}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Announcement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Audience</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opens</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Clicks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engagement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAnnouncements.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{item.title}</div>
                      <div className="text-xs text-gray-400">{item.date}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">{item.audience}</td>
                    <td className="px-6 py-4 text-gray-600">{formatNumber(item.opens)}</td>
                    <td className="px-6 py-4 text-gray-600">{formatNumber(item.clicks)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-500 rounded-full h-1.5"
                            style={{ width: `${item.engagement}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{formatPercentage(item.engagement)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${getStatusClass(item.status)} flex items-center gap-1 w-fit`}>
                        <span>{getStatusIcon(item.status)}</span>
                        <span>{item.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAnnouncements.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No announcement records found.</p>
            </div>
          )}
        </section>
      )}

      {/* Quick Insights Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-5 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">📈</span>
            <h3 className="font-semibold">Top Performing Event</h3>
          </div>
          <p className="text-sm text-gray-600">Battle of the Blues</p>
          <p className="text-xs text-gray-500 mt-1">25,400 views • 35.2% engagement</p>
        </div>
        <div className="card p-5 bg-gradient-to-r from-green-50 to-green-100">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">💰</span>
            <h3 className="font-semibold">Most Funded Campaign</h3>
          </div>
          <p className="text-sm text-gray-600">Sports Ground Improvement</p>
          <p className="text-xs text-gray-500 mt-1">100% funded • 112 donors</p>
        </div>
        <div className="card p-5 bg-gradient-to-r from-purple-50 to-purple-100">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">📢</span>
            <h3 className="font-semibold">Best Performing Announcement</h3>
          </div>
          <p className="text-sm text-gray-600">Big Match Tickets Now Available</p>
          <p className="text-xs text-gray-500 mt-1">12,500 opens • 27.4% engagement</p>
        </div>
      </section>
    </div>
  );
};

export default Reports;