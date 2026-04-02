import React, { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import ApiSchool from "../../services/ApiSchool";
import ApiEvent from "../../services/ApiEvent";
import ApiAnnouncement from "../../services/ApiAnnouncement";
import ApiDonation from "../../services/ApiDonation";
import { toast } from "react-hot-toast";
import {
  MapPin, Calendar, Users, GraduationCap, Phone, Mail, Globe,
  Building2, Landmark, Globe2, CheckCircle, Star, Trophy,
  Ticket, Heart, Megaphone, Image, LayoutList, ArrowRight,
  X, Clock, TrendingUp, Zap, BookOpen, ChevronRight,
  AlignLeft, ShieldCheck, Sparkles
} from "lucide-react";

/* ── helpers ── */
const formatDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};
const formatTime = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":");
  const date = new Date();
  date.setHours(parseInt(h), parseInt(m));
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
};
const formatCurrency = (n) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(n || 0);

const getEventPrice = (ev) => {
  if (!ev.enableTickets || !ev.ticketTypes?.length) return "Free";
  const min = Math.min(...ev.ticketTypes.map((t) => t.price));
  return min === 0 ? "Free" : `LKR ${min.toLocaleString()}`;
};
const getEventBooked = (ev) => {
  if (!ev.ticketTypes?.length) return { booked: 0, capacity: 0 };
  const cap   = ev.ticketTypes.reduce((s, t) => s + t.totalQuantity,     0);
  const avail = ev.ticketTypes.reduce((s, t) => s + t.availableQuantity, 0);
  return { booked: cap - avail, capacity: cap };
};
const getDonationProgress = (d) => {
  const raised = d.raisedAmount || 0;
  const goal   = d.goalAmount   || 1;
  return { raised, goal, pct: Math.min((raised / goal) * 100, 100) };
};

const TYPE_META = {
  government:    { icon: Landmark,  color: "#059669", bg: "#ecfdf5" },
  private:       { icon: Building2, color: "#2563eb", bg: "#eff6ff" },
  international: { icon: Globe2,    color: "#7c3aed", bg: "#f5f3ff" },
};
const getTypeMeta = (t) => TYPE_META[t?.toLowerCase()] || { icon: GraduationCap, color: "#6b7280", bg: "#f9fafb" };

const PRIORITY_META = {
  high:   { color: "#dc2626", bg: "#fef2f2" },
  normal: { color: "#2563eb", bg: "#eff6ff" },
};
const getPriorityMeta = (p) => PRIORITY_META[p?.toLowerCase()] || { color: "#6b7280", bg: "#f9fafb" };

/* ── Skeleton ── */
const Skeleton = ({ h = 20, r = 8 }) => (
  <div style={{
    height: h, borderRadius: r,
    background: "linear-gradient(90deg,#f3f4f6 25%,#e9eaec 50%,#f3f4f6 75%)",
    backgroundSize: "200% 100%", animation: "shimmer 1.6s infinite",
  }} />
);

/* ── Progress bar ── */
const ProgressBar = ({ pct, color = "var(--color-primary,#4f46e5)" }) => (
  <div style={{ height: 6, borderRadius: 50, background: "#f3f4f6", overflow: "hidden" }}>
    <div style={{
      height: "100%", borderRadius: 50, width: `${Math.min(pct, 100)}%`,
      background: color, transition: "width 0.6s",
    }} />
  </div>
);

/* ── Tab button ── */
const TAB_CONFIG = [
  { id: "overview",       label: "Overview",       icon: AlignLeft    },
  { id: "events",         label: "Events",         icon: Calendar     },
  { id: "announcements",  label: "Announcements",  icon: Megaphone    },
  { id: "gallery",        label: "Gallery",        icon: Image        },
  { id: "donations",      label: "Donations",      icon: Heart        },
];

/* ── Section head ── */
const SectionHead = ({ label, title, sub }) => (
  <div style={{ marginBottom: 24 }}>
    {label && (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
        color: "var(--color-primary,#4f46e5)",
        background: "color-mix(in srgb,var(--color-primary,#4f46e5) 9%,transparent)",
        padding: "4px 10px", borderRadius: 50, marginBottom: 8,
      }}>
        <Zap size={11} strokeWidth={2.5} />{label}
      </span>
    )}
    <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f0f0f", letterSpacing: "-0.3px", margin: 0 }}>{title}</h2>
    {sub && <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4, fontWeight: 500 }}>{sub}</p>}
  </div>
);

/* ── Card wrapper ── */
const Card = ({ children, style = {} }) => (
  <div style={{
    background: "#fff", borderRadius: 20, border: "1px solid #f0f0f0",
    padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    ...style,
  }}>
    {children}
  </div>
);

/* ── Empty state ── */
const Empty = ({ icon: Icon, msg }) => (
  <div style={{ textAlign: "center", padding: "48px 24px" }}>
    <div style={{ width: 52, height: 52, borderRadius: 14, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
      <Icon size={22} color="#9ca3af" strokeWidth={1.8} />
    </div>
    <p style={{ fontSize: 14, color: "#9ca3af", fontWeight: 500, margin: 0 }}>{msg}</p>
  </div>
);

/* ═══════════════════════════════════
   SCHOOL DETAILS PAGE
═══════════════════════════════════ */
const SchoolDetails = () => {
  const { id } = useParams();
  const [activeTab,     setActiveTab]     = useState("overview");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [school,        setSchool]        = useState(null);
  const [events,        setEvents]        = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [donations,     setDonations]     = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [schoolRes, eventsRes, announcementsRes, donationsRes] = await Promise.all([
        ApiSchool.getSchool(id),
        ApiEvent.getEvents({ schoolId: id }),
        ApiAnnouncement.getPublicForSchool(id),
        ApiDonation.getDonations({ schoolId: id }),
      ]);
      setSchool(schoolRes.data);
      setEvents(eventsRes.data);
      setAnnouncements(announcementsRes.data);
      setDonations(donationsRes.data);
    } catch (err) {
      toast.error("Failed to load school details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  /* ── Loading state ── */
  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
          .sd-page * { box-sizing: border-box; }
          .sd-page { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}</style>
        <div className="sd-page" style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}>
          <Skeleton h={320} r={24} />
          <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            {[1,2,3].map(i => <Skeleton key={i} h={120} r={20} />)}
          </div>
        </div>
      </>
    );
  }

  /* ── Not found ── */
  if (!school) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          .sd-page * { box-sizing: border-box; }
          .sd-page { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}</style>
        <div className="sd-page" style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <GraduationCap size={32} color="#9ca3af" strokeWidth={1.5} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0f0f0f", margin: "0 0 10px" }}>School Not Found</h1>
          <p style={{ fontSize: 15, color: "#6b7280", marginBottom: 24 }}>The school you are looking for does not exist.</p>
          <Link to="/schools" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "12px 24px", borderRadius: 50, border: "none",
            background: "linear-gradient(135deg, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))",
            color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none",
          }}>
            <ArrowRight size={15} strokeWidth={2.5} /> Back to Schools
          </Link>
        </div>
      </>
    );
  }

  const typeMeta   = getTypeMeta(school.type);
  const TypeIcon   = typeMeta.icon;
  const principal  = school.leadership?.find(l => l.position.toLowerCase().includes("principal"))?.name
    || school.leadership?.[0]?.name || "Not Specified";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        .sd-page * { box-sizing: border-box; }
        .sd-page { font-family: 'Plus Jakarta Sans', sans-serif; }
        .sd-tab-btn { transition: all 0.18s; }
        .sd-tab-btn:hover { color: var(--color-primary,#4f46e5) !important; }
      `}</style>

      <div className="sd-page" style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* ═══ HERO ═══ */}
        <div style={{
          position: "relative", borderRadius: 24, overflow: "hidden",
          marginBottom: 32, animation: "fadeUp 0.6s ease both",
          boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
        }}>
          {/* Cover image */}
          <div style={{ height: 320, background: "linear-gradient(135deg, #1e1b4b, var(--color-primary,#4f46e5))", position: "relative", overflow: "hidden" }}>
            {school.coverImageUrl
              ? <img src={school.coverImageUrl} alt={school.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : (
                <>
                  <div style={{ position: "absolute", top: -80, right: -80, width: 360, height: 360, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
                  <div style={{ position: "absolute", bottom: -60, left: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
                </>
              )
            }
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }} />
          </div>

          {/* School info overlay */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "32px 36px", color: "#fff" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 24, flexWrap: "wrap" }}>
              {/* Logo */}
              <div style={{
                width: 88, height: 88, borderRadius: 20, flexShrink: 0,
                background: "#fff", border: "3px solid rgba(255,255,255,0.3)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
              }}>
                {school.logoUrl
                  ? <img src={school.logoUrl} alt={school.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : <TypeIcon size={36} color={typeMeta.color} strokeWidth={1.8} />
                }
              </div>

              <div style={{ flex: 1 }}>
                {/* Badges */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 5,
                    fontSize: 11.5, fontWeight: 700,
                    color: typeMeta.color, background: typeMeta.bg,
                    padding: "4px 10px", borderRadius: 50,
                  }}>
                    <TypeIcon size={11} strokeWidth={2.5} />{school.type}
                  </span>
                  {school.isVerified && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 700, color: "#065f46", background: "#d1fae5", padding: "4px 10px", borderRadius: 50 }}>
                      <CheckCircle size={11} strokeWidth={2.5} /> Verified
                    </span>
                  )}
                  {school.isFeatured && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 700, color: "#92400e", background: "#fef3c7", padding: "4px 10px", borderRadius: 50 }}>
                      <Star size={11} strokeWidth={2.5} /> Featured
                    </span>
                  )}
                </div>

                <h1 style={{ fontSize: "clamp(22px,3.5vw,36px)", fontWeight: 900, letterSpacing: "-0.5px", margin: "0 0 10px", lineHeight: 1.15 }}>
                  {school.name}
                </h1>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px" }}>
                  {[
                    { icon: MapPin,         val: school.contact?.city || "Sri Lanka" },
                    { icon: Calendar,       val: `Est. ${school.startedYear}` },
                    { icon: Users,          val: `${school.studentCount?.toLocaleString() || 0} Students` },
                    { icon: GraduationCap,  val: `${school.teachersCount || 0} Teachers` },
                  ].map(({ icon: Icon, val }, i) => (
                    <span key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "rgba(255,255,255,0.82)", fontWeight: 500 }}>
                      <Icon size={13} strokeWidth={2} color="rgba(255,255,255,0.6)" />{val}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ TABS ═══ */}
        <div style={{
          background: "#fff", borderRadius: 18, border: "1px solid #f0f0f0",
          padding: "6px 8px", marginBottom: 28,
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          display: "flex", flexWrap: "wrap", gap: 4,
        }}>
          {TAB_CONFIG.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="sd-tab-btn"
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "10px 18px", borderRadius: 12, border: "none",
                background: activeTab === id
                  ? "linear-gradient(135deg, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))"
                  : "transparent",
                color: activeTab === id ? "#fff" : "#6b7280",
                fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit",
                boxShadow: activeTab === id ? "0 4px 12px color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent)" : "none",
              }}
            >
              <Icon size={14} strokeWidth={2.2} />{label}
            </button>
          ))}
        </div>

        {/* ═══ CONTENT + SIDEBAR ═══ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>

          {/* ── MAIN ── */}
          <div style={{ minWidth: 0 }}>

            {/* OVERVIEW */}
            {activeTab === "overview" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                {/* About */}
                <Card>
                  <SectionHead label="About" title={`About ${school.name}`} />
                  <p style={{ fontSize: 14, color: "#4b5563", lineHeight: 1.8, margin: 0 }}>
                    {school.description || "No description available."}
                  </p>
                </Card>

                {/* Contact & Leadership */}
                <Card>
                  <SectionHead label="Info" title="Contact & Leadership" />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                    <div>
                      <h3 style={{ fontSize: 13, fontWeight: 800, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 14px" }}>Contact</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {[
                          { icon: Phone,  val: school.contact?.phone   || "N/A" },
                          { icon: Mail,   val: school.contact?.email   || "N/A" },
                          { icon: Globe,  val: school.contact?.website || "N/A" },
                          { icon: MapPin, val: school.contact?.address || "N/A" },
                        ].map(({ icon: Icon, val }, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, color: "#374151", fontWeight: 500 }}>
                            <div style={{ width: 30, height: 30, borderRadius: 9, background: "color-mix(in srgb,var(--color-primary,#4f46e5) 8%,transparent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <Icon size={13} color="var(--color-primary,#4f46e5)" strokeWidth={2} />
                            </div>
                            {val}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 style={{ fontSize: 13, fontWeight: 800, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 14px" }}>Leadership</h3>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                          <div style={{ width: 30, height: 30, borderRadius: 9, background: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <Star size={13} color="#d97706" strokeWidth={2} />
                          </div>
                          <div>
                            <div style={{ fontSize: 11.5, color: "#9ca3af", fontWeight: 600 }}>Principal</div>
                            <div style={{ fontSize: 13.5, color: "#374151", fontWeight: 700 }}>{principal}</div>
                          </div>
                        </div>
                        {school.leadership?.slice(1, 4).map((l, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                            <div style={{ width: 30, height: 30, borderRadius: 9, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <GraduationCap size={13} color="#6b7280" strokeWidth={2} />
                            </div>
                            <div>
                              <div style={{ fontSize: 11.5, color: "#9ca3af", fontWeight: 600 }}>{l.position}</div>
                              <div style={{ fontSize: 13.5, color: "#374151", fontWeight: 700 }}>{l.name}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Academic Streams */}
                {school.academicStreams?.length > 0 && (
                  <Card>
                    <SectionHead label="Academics" title="Academic Streams" />
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {school.academicStreams.map((s, i) => (
                        <span key={i} style={{
                          fontSize: 12.5, fontWeight: 700,
                          color: "var(--color-primary,#4f46e5)",
                          background: "color-mix(in srgb,var(--color-primary,#4f46e5) 9%,transparent)",
                          padding: "5px 14px", borderRadius: 50,
                        }}>{s}</span>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Facilities */}
                {school.schoolFacilities?.length > 0 && (
                  <Card>
                    <SectionHead label="Campus" title="School Facilities" />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {school.schoolFacilities.map((f, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, color: "#374151", fontWeight: 500 }}>
                          <div style={{ width: 22, height: 22, borderRadius: 6, background: "#d1fae5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <CheckCircle size={12} color="#059669" strokeWidth={2.5} />
                          </div>
                          {f}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Clubs */}
                {school.clubsAndSocieties?.length > 0 && (
                  <Card>
                    <SectionHead label="Activities" title="Clubs & Societies" />
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {school.clubsAndSocieties.map((c, i) => (
                        <span key={i} style={{
                          fontSize: 12.5, fontWeight: 700,
                          color: "#7c3aed", background: "#f5f3ff",
                          padding: "5px 14px", borderRadius: 50,
                        }}>{c}</span>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Achievements */}
                {school.achievements?.length > 0 && (
                  <Card>
                    <SectionHead label="Honours" title="Achievements" />
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {school.achievements.map((a, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <div style={{ width: 28, height: 28, borderRadius: 8, background: "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                            <Trophy size={13} color="#d97706" strokeWidth={2} />
                          </div>
                          <p style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.6, margin: 0, fontWeight: 500 }}>{a}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* EVENTS */}
            {activeTab === "events" && (
              <Card>
                <SectionHead label="Schedule" title="School Events" sub={`${events.length} event${events.length !== 1 ? "s" : ""} available`} />
                {events.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {events.map(ev => {
                      const { booked, capacity } = getEventBooked(ev);
                      const pct = capacity > 0 ? Math.min((booked / capacity) * 100, 100) : 0;
                      const price = getEventPrice(ev);
                      const isFree = price === "Free";
                      return (
                        <div key={ev.id} style={{
                          borderRadius: 16, border: "1px solid #f0f0f0", overflow: "hidden",
                          transition: "box-shadow 0.2s",
                        }}
                          onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.07)"}
                          onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                        >
                          <div style={{ display: "flex" }}>
                            {ev.image && (
                              <div style={{ width: 120, flexShrink: 0, overflow: "hidden" }}>
                                <img src={ev.image} alt={ev.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              </div>
                            )}
                            <div style={{ flex: 1, padding: "18px 20px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
                                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f0f0f", margin: 0, lineHeight: 1.35 }}>{ev.title}</h3>
                                <span style={{
                                  flexShrink: 0, fontSize: 12, fontWeight: 800,
                                  color: isFree ? "#065f46" : "#1e3a8a",
                                  background: isFree ? "#d1fae5" : "#dbeafe",
                                  padding: "3px 10px", borderRadius: 50,
                                }}>{price}</span>
                              </div>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", marginBottom: 12 }}>
                                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "#4b5563", fontWeight: 500 }}>
                                  <Calendar size={12} strokeWidth={2} color="var(--color-primary,#4f46e5)" />{formatDate(ev.date)}{ev.time ? ` · ${formatTime(ev.time)}` : ""}
                                </span>
                                <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "#4b5563", fontWeight: 500 }}>
                                  <MapPin size={12} strokeWidth={2} color="var(--color-primary,#4f46e5)" />{ev.venue || ev.location || "TBA"}
                                </span>
                              </div>
                              {capacity > 0 && (
                                <div style={{ marginBottom: 12 }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                    <span style={{ fontSize: 11.5, color: "#9ca3af", fontWeight: 600 }}>Booking</span>
                                    <span style={{ fontSize: 11.5, color: "#374151", fontWeight: 700 }}>{booked}/{capacity}</span>
                                  </div>
                                  <ProgressBar pct={pct} color={pct > 80 ? "#ef4444" : "var(--color-primary,#4f46e5)"} />
                                </div>
                              )}
                              <Link to={`/events/${ev.id}`} style={{
                                display: "inline-flex", alignItems: "center", gap: 5,
                                fontSize: 13, fontWeight: 700, color: "var(--color-primary,#4f46e5)", textDecoration: "none",
                              }}>
                                View Details <ChevronRight size={13} strokeWidth={2.5} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : <Empty icon={Calendar} msg="No events found for this school." />}
              </Card>
            )}

            {/* ANNOUNCEMENTS */}
            {activeTab === "announcements" && (
              <Card>
                <SectionHead label="Updates" title="Latest Announcements" sub={`${announcements.length} announcement${announcements.length !== 1 ? "s" : ""}`} />
                {announcements.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {announcements.map(a => {
                      const pm = getPriorityMeta(a.priority);
                      return (
                        <div key={a.id} style={{
                          borderRadius: 14, border: "1px solid #f0f0f0",
                          padding: "18px 20px", background: "#fafafa",
                          borderLeft: `4px solid ${pm.color}`,
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 8 }}>
                            <h3 style={{ fontSize: 14.5, fontWeight: 800, color: "#0f0f0f", margin: 0 }}>{a.title}</h3>
                            <span style={{
                              flexShrink: 0, fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em",
                              color: pm.color, background: pm.bg,
                              padding: "3px 9px", borderRadius: 50,
                            }}>{a.priority || "Normal"}</span>
                          </div>
                          <p style={{ fontSize: 13.5, color: "#4b5563", lineHeight: 1.65, margin: "0 0 10px" }}>{a.message}</p>
                          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>
                            <Clock size={11} strokeWidth={2} />{formatDate(a.createdAt)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : <Empty icon={Megaphone} msg="No announcements from this school yet." />}
              </Card>
            )}

            {/* GALLERY */}
            {activeTab === "gallery" && (
              <Card>
                <SectionHead label="Media" title="Photo Gallery" sub={`${school.photoGallery?.length || 0} photos`} />
                {school.photoGallery?.length > 0 ? (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                    {school.photoGallery.map((img, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedImage(img)}
                        style={{ position: "relative", borderRadius: 14, overflow: "hidden", cursor: "pointer", aspectRatio: "1" }}
                        onMouseEnter={e => e.currentTarget.querySelector(".overlay").style.opacity = "1"}
                        onMouseLeave={e => e.currentTarget.querySelector(".overlay").style.opacity = "0"}
                      >
                        <img src={img} alt={`Gallery ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.07)"}
                          onMouseLeave={e => e.currentTarget.style.transform = ""}
                        />
                        <div className="overlay" style={{
                          position: "absolute", inset: 0,
                          background: "rgba(0,0,0,0.45)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          opacity: 0, transition: "opacity 0.25s",
                        }}>
                          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Image size={18} color="#fff" strokeWidth={2} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <Empty icon={Image} msg="No photos in the gallery yet." />}
              </Card>
            )}

            {/* DONATIONS */}
            {activeTab === "donations" && (
              <Card>
                <SectionHead label="Support" title="Donation Campaigns" sub={`${donations.length} active campaign${donations.length !== 1 ? "s" : ""}`} />
                {donations.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    {donations.map(d => {
                      const { raised, goal, pct } = getDonationProgress(d);
                      return (
                        <div key={d.id} style={{
                          borderRadius: 16, border: "1px solid #f0f0f0", padding: "20px",
                          transition: "box-shadow 0.2s",
                        }}
                          onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.07)"}
                          onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                        >
                          <h3 style={{ fontSize: 15.5, fontWeight: 800, color: "#0f0f0f", margin: "0 0 8px" }}>{d.title}</h3>
                          <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.65, margin: "0 0 16px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {d.description}
                          </p>
                          <div style={{ marginBottom: 14 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Goal: {formatCurrency(goal)}</span>
                              <span style={{ fontSize: 12, fontWeight: 700, color: pct >= 100 ? "#059669" : "var(--color-primary,#4f46e5)" }}>{Math.round(pct)}%</span>
                            </div>
                            <ProgressBar pct={pct} color={pct >= 100 ? "#059669" : "var(--color-primary,#4f46e5)"} />
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                              <span style={{ fontSize: 11.5, color: "#9ca3af", fontWeight: 600 }}>Raised: {formatCurrency(raised)}</span>
                              <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "#9ca3af", fontWeight: 600 }}>
                                <Users size={11} strokeWidth={2} />{d.donorsCount || 0} donors
                              </span>
                            </div>
                          </div>
                          {d.expiryDate && (
                            <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#9ca3af", fontWeight: 500, marginBottom: 14 }}>
                              <Clock size={12} strokeWidth={2} />Ends {formatDate(d.expiryDate)}
                            </div>
                          )}
                          <Link to={`/donations/${d.id}`} style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            padding: "9px 20px", borderRadius: 50, border: "none",
                            background: "linear-gradient(135deg, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))",
                            color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none",
                            boxShadow: "0 4px 12px color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent)",
                          }}>
                            <Heart size={13} strokeWidth={2.5} /> Support Campaign
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                ) : <Empty icon={Heart} msg="No active donation campaigns." />}
              </Card>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20, position: "sticky", top: 24 }}>

            {/* Quick Stats */}
            <div style={{
              borderRadius: 20,
              background: "linear-gradient(135deg, color-mix(in srgb,var(--color-primary,#4f46e5) 8%,#fff), color-mix(in srgb,var(--color-secondary,#7c3aed) 5%,#fff))",
              border: "1px solid color-mix(in srgb,var(--color-primary,#4f46e5) 14%,transparent)",
              padding: "24px",
            }}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: "#0f0f0f", letterSpacing: "-0.2px", margin: "0 0 16px" }}>Quick Stats</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  { icon: Calendar,  label: "Total Events",      val: events.length        },
                  { icon: Megaphone, label: "Announcements",     val: announcements.length },
                  { icon: Heart,     label: "Active Campaigns",  val: donations.length     },
                ].map(({ icon: Icon, label, val }, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#4b5563", fontWeight: 500 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: "color-mix(in srgb,var(--color-primary,#4f46e5) 10%,transparent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={13} color="var(--color-primary,#4f46e5)" strokeWidth={2} />
                      </div>
                      {label}
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 900, color: "#0f0f0f" }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <Card>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: "#0f0f0f", margin: "0 0 16px" }}>Location</h2>
              <div style={{
                height: 140, borderRadius: 14,
                background: "linear-gradient(135deg, color-mix(in srgb,var(--color-primary,#4f46e5) 7%,#fff), #f3f4f6)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 12,
              }}>
                {school.latitude && school.longitude ? (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "color-mix(in srgb,var(--color-primary,#4f46e5) 12%,transparent)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                      <MapPin size={18} color="var(--color-primary,#4f46e5)" strokeWidth={2} />
                    </div>
                    <p style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, margin: 0 }}>
                      {school.latitude.toFixed(4)}, {school.longitude.toFixed(4)}
                    </p>
                  </div>
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <MapPin size={28} color="#d1d5db" strokeWidth={1.5} />
                    <p style={{ fontSize: 12, color: "#9ca3af", margin: "6px 0 0" }}>Location not mapped</p>
                  </div>
                )}
              </div>
              <p style={{ fontSize: 13, color: "#4b5563", fontWeight: 500, margin: 0, lineHeight: 1.6 }}>
                {school.contact?.address || "Address not provided"}
              </p>
            </Card>

            {/* Social Media */}
            {school.socialMediaUrls?.length > 0 && (
              <Card>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: "#0f0f0f", margin: "0 0 14px" }}>Connect With Us</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {school.socialMediaUrls.map((url, i) => (
                    <a
                      key={i} href={url} target="_blank" rel="noopener noreferrer"
                      style={{
                        display: "flex", alignItems: "center", gap: 9,
                        padding: "9px 12px", borderRadius: 12,
                        border: "1px solid #f0f0f0", background: "#fafafa",
                        textDecoration: "none", transition: "all 0.18s",
                        fontSize: 12.5, color: "var(--color-primary,#4f46e5)", fontWeight: 600,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "color-mix(in srgb,var(--color-primary,#4f46e5) 6%,transparent)"; e.currentTarget.style.borderColor = "color-mix(in srgb,var(--color-primary,#4f46e5) 20%,transparent)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#fafafa"; e.currentTarget.style.borderColor = "#f0f0f0"; }}
                    >
                      <Globe size={13} strokeWidth={2} />
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{url}</span>
                    </a>
                  ))}
                </div>
              </Card>
            )}

            {/* Sponsors */}
            {school.sponsors?.length > 0 && (
              <Card>
                <h2 style={{ fontSize: 14, fontWeight: 800, color: "#0f0f0f", margin: "0 0 14px" }}>Our Sponsors</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {school.sponsors.map((s, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 9,
                      padding: "9px 12px", borderRadius: 12,
                      background: "#fafafa", border: "1px solid #f0f0f0",
                    }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ShieldCheck size={13} color="#059669" strokeWidth={2} />
                      </div>
                      <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* ═══ LIGHTBOX ═══ */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)",
            zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
          }}
        >
          <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }} onClick={e => e.stopPropagation()}>
            <img src={selectedImage} alt="Full view" style={{ maxWidth: "100%", maxHeight: "90vh", objectFit: "contain", borderRadius: 16 }} />
            <button
              onClick={() => setSelectedImage(null)}
              style={{
                position: "absolute", top: -14, right: -14,
                width: 36, height: 36, borderRadius: "50%", border: "none",
                background: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
              }}
            >
              <X size={16} strokeWidth={2.5} color="#374151" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SchoolDetails;