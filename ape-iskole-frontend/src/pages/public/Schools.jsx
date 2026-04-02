import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ApiSchool from "../../services/ApiSchool";
import { toast } from "react-hot-toast";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import {
  Search, LayoutGrid, Map, School, Landmark, Building2, Globe,
  MapPin, Users, GraduationCap, CheckCircle, Star, ArrowRight,
  ChevronDown, SlidersHorizontal, CalendarCheck, X, Loader2,
  BookOpen, ArrowUpRight
} from "lucide-react";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const getGoogleMapsApiKey = () => {
  if (typeof process !== "undefined" && process.env?.REACT_APP_GOOGLE_MAPS_API_KEY)
    return process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_GOOGLE_MAPS_API_KEY)
    return import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  return "";
};

const getSchoolLocation = (s) =>
  s.contact?.city || s.contact?.district || s.contact?.address || "Sri Lanka";

const TYPE_META = {
  government:    { icon: Landmark,  color: "#059669", bg: "#ecfdf5", label: "Government" },
  private:       { icon: Building2, color: "#2563eb", bg: "#eff6ff", label: "Private" },
  international: { icon: Globe,     color: "#7c3aed", bg: "#f5f3ff", label: "International" },
};
const getTypeMeta = (t) => TYPE_META[t?.toLowerCase()] || { icon: School, color: "#6b7280", bg: "#f9fafb", label: t || "School" };

/* ─────────────────────────────────────────────
   Skeleton
───────────────────────────────────────────── */
const Skeleton = ({ h = 120, r = 14 }) => (
  <div style={{
    height: h, borderRadius: r,
    background: "linear-gradient(90deg,#f3f4f6 25%,#e9eaec 50%,#f3f4f6 75%)",
    backgroundSize: "200% 100%", animation: "shimmer 1.6s infinite",
  }} />
);

/* ─────────────────────────────────────────────
   School Card
───────────────────────────────────────────── */
const SchoolCard = ({ school, onClick }) => {
  const typeMeta = getTypeMeta(school.type);
  const TypeIcon = typeMeta.icon;

  return (
    <div
      onClick={onClick}
      style={{
        background: "#fff", borderRadius: 20, border: "1px solid #f0f0f0",
        overflow: "hidden", cursor: "pointer", transition: "all 0.25s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 14px 36px rgba(0,0,0,0.09)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; }}
    >
      {/* Cover banner */}
      <div style={{
        height: 96, position: "relative", overflow: "hidden", flexShrink: 0,
        background: `linear-gradient(135deg,color-mix(in srgb,${typeMeta.color} 12%,#fff),color-mix(in srgb,${typeMeta.color} 5%,#f8f8ff))`,
      }}>
        {school.coverImageUrl && (
          <img src={school.coverImageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.22 }} />
        )}
        {/* Badges */}
        <div style={{ position: "absolute", top: 10, right: 12, display: "flex", gap: 6 }}>
          {school.isVerified && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontSize: 10.5, fontWeight: 800, color: "#065f46", background: "#d1fae5",
              padding: "3px 9px", borderRadius: 50,
            }}>
              <CheckCircle size={10} strokeWidth={2.5} /> Verified
            </span>
          )}
          {school.isFeatured && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontSize: 10.5, fontWeight: 800, color: "#92400e", background: "#fef3c7",
              padding: "3px 9px", borderRadius: 50,
            }}>
              <Star size={10} strokeWidth={2.5} fill="currentColor" /> Featured
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "0 20px 20px", marginTop: -26 }}>
        {/* Logo */}
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: "#fff", border: "2.5px solid #fff",
          boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden", marginBottom: 14,
        }}>
          {school.logoUrl
            ? <img src={school.logoUrl} alt={school.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <TypeIcon size={22} color={typeMeta.color} strokeWidth={1.8} />
          }
        </div>

        <h3 style={{
          fontSize: 16, fontWeight: 800, color: "#0f0f0f", margin: "0 0 6px",
          lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {school.name}
        </h3>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <MapPin size={12} strokeWidth={2} color="#9ca3af" />
          <span style={{ fontSize: 12.5, color: "#9ca3af", fontWeight: 500 }}>{getSchoolLocation(school)}</span>
          {school.startedYear > 0 && (
            <><span style={{ color: "#e5e7eb", fontSize: 12 }}>·</span>
            <span style={{ fontSize: 12.5, color: "#9ca3af", fontWeight: 500 }}>Est. {school.startedYear}</span></>
          )}
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
          {school.studentCount > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "#4b5563", fontWeight: 600 }}>
              <Users size={13} strokeWidth={2} color="#9ca3af" />{school.studentCount.toLocaleString()} students
            </span>
          )}
          {school.teachersCount > 0 && (
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "#4b5563", fontWeight: 600 }}>
              <GraduationCap size={13} strokeWidth={2} color="#9ca3af" />{school.teachersCount} teachers
            </span>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: 11.5, fontWeight: 700, color: typeMeta.color, background: typeMeta.bg,
            padding: "4px 10px", borderRadius: 50,
          }}>
            <TypeIcon size={11} strokeWidth={2.2} />{typeMeta.label}
          </span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 13, fontWeight: 700, color: "var(--color-primary,#4f46e5)",
          }}>
            View <ArrowUpRight size={13} strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Google Map View
───────────────────────────────────────────── */
const GoogleMapView = ({ schools, onSchoolSelect, selectedSchool, navigate }) => {
  const apiKey = getGoogleMapsApiKey();
  const { isLoaded, loadError } = useJsApiLoader({ id: "google-map-script", googleMapsApiKey: apiKey });

  const validSchools = schools.filter(s =>
    s.latitude && s.longitude && s.latitude !== 0 && s.longitude !== 0 &&
    s.latitude >= 5.9 && s.latitude <= 9.9 && s.longitude >= 79.5 && s.longitude <= 81.9
  );

  const center = useMemo(() => ({ lat: 7.8731, lng: 80.7718 }), []);
  const mapOptions = useMemo(() => ({
    restriction: { latLngBounds: { north: 9.9, south: 5.9, west: 79.5, east: 81.9 }, strictBounds: false },
    mapTypeControl: false, streetViewControl: false, fullscreenControl: true, zoomControl: true,
    styles: [{ featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }],
  }), []);

  const getMarkerIcon = (school) => school.logoUrl
    ? { url: school.logoUrl, scaledSize: new window.google.maps.Size(40, 40), origin: new window.google.maps.Point(0, 0), anchor: new window.google.maps.Point(20, 40) }
    : { url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png", scaledSize: new window.google.maps.Size(32, 32) };

  const MapError = ({ title, msg }) => (
    <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f0f0f0", padding: "48px 24px", textAlign: "center" }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
        <Map size={22} color="#ef4444" strokeWidth={1.8} />
      </div>
      <p style={{ fontSize: 15, fontWeight: 700, color: "#0f0f0f", margin: "0 0 6px" }}>{title}</p>
      <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>{msg}</p>
    </div>
  );

  if (!apiKey) return <MapError title="Google Maps API Key Missing" msg="Set the REACT_APP_GOOGLE_MAPS_API_KEY environment variable." />;
  if (loadError) return <MapError title="Failed to load Google Maps" msg="Check your API key and network connection." />;
  if (!isLoaded) return (
    <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f0f0f0", padding: "48px 24px", textAlign: "center" }}>
      <Loader2 size={28} color="var(--color-primary,#4f46e5)" style={{ animation: "spin 1s linear infinite", display: "block", margin: "0 auto 12px" }} />
      <p style={{ fontSize: 13.5, color: "#9ca3af", margin: 0, fontWeight: 500 }}>Loading map…</p>
    </div>
  );

  const typeMeta = selectedSchool ? getTypeMeta(selectedSchool.type) : null;
  const SelIcon = typeMeta?.icon;

  return (
    <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #f0f0f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
      {/* Map header */}
      <div style={{ padding: "18px 22px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f0f0f", margin: "0 0 3px" }}>School Locations</h3>
          <p style={{ fontSize: 12.5, color: "#9ca3af", margin: 0, fontWeight: 500 }}>{validSchools.length} schools with map coordinates</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#6b7280" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--color-primary,#4f46e5)", display: "inline-block" }} /> School
          </span>
          {selectedSchool && (
            <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: "#6b7280" }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} /> Selected
            </span>
          )}
        </div>
      </div>

      <GoogleMap mapContainerStyle={{ width: "100%", height: 480 }} center={center} zoom={7.5} options={mapOptions}>
        {validSchools.map(school => (
          <Marker
            key={school.id}
            position={{ lat: school.latitude, lng: school.longitude }}
            title={school.name}
            icon={getMarkerIcon(school)}
            onClick={() => onSchoolSelect(school)}
            animation={window.google.maps.Animation.DROP}
          />
        ))}
      </GoogleMap>

      {selectedSchool && (
        <div style={{ padding: "20px 22px", borderTop: "1px solid #f3f4f6", background: "#fafafa" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 13, overflow: "hidden", flexShrink: 0,
                background: typeMeta?.bg, border: "1px solid #f0f0f0",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {selectedSchool.logoUrl
                  ? <img src={selectedSchool.logoUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                  : <SelIcon size={20} color={typeMeta?.color} strokeWidth={1.8} />
                }
              </div>
              <div>
                <h4 style={{ fontSize: 15, fontWeight: 800, color: "#0f0f0f", margin: "0 0 4px" }}>{selectedSchool.name}</h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 14px" }}>
                  {[
                    { Icon: MapPin, val: getSchoolLocation(selectedSchool) },
                    { Icon: CalendarCheck, val: `Est. ${selectedSchool.startedYear}` },
                    { Icon: Users, val: `${selectedSchool.studentCount?.toLocaleString()} students` },
                    { Icon: GraduationCap, val: `${selectedSchool.teachersCount} teachers` },
                  ].map(({ Icon, val }, i) => (
                    <span key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#6b7280", fontWeight: 500 }}>
                      <Icon size={12} strokeWidth={2} />{val}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate(`/schools/${selectedSchool.id}`)}
              style={{
                flexShrink: 0, display: "flex", alignItems: "center", gap: 6,
                padding: "10px 18px", borderRadius: 50, border: "none",
                background: "linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed))",
                color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 4px 12px color-mix(in srgb,var(--color-primary,#4f46e5) 30%,transparent)",
              }}
            >
              View School <ArrowRight size={14} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Select component
───────────────────────────────────────────── */
const FilterSelect = ({ label, value, onChange, options }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 160 }}>
    <label style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</label>
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", appearance: "none", WebkitAppearance: "none",
          padding: "10px 36px 10px 14px", borderRadius: 12,
          border: "1.5px solid #e5e7eb", background: "#fff",
          fontSize: 13.5, fontWeight: 600, color: "#374151",
          cursor: "pointer", outline: "none", fontFamily: "inherit",
          transition: "border-color 0.18s",
        }}
        onFocus={e => e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"}
        onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown size={14} color="#9ca3af" strokeWidth={2.5} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   SCHOOLS PAGE
───────────────────────────────────────────── */
const Schools = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode]         = useState("grid");
  const [search, setSearch]             = useState("");
  const [filter, setFilter]             = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schools, setSchools]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [availableCities, setAvailableCities] = useState(["All"]);

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        searchTerm: search || undefined,
        type: filter === "All" ? undefined : filter,
        city: selectedCity === "All" ? undefined : selectedCity,
        pageSize: 50,
      };
      const response = await ApiSchool.getPublicSchools(params);
      const data = response.data;
      setSchools(data);
      const citiesSet = new Set();
      data.forEach(s => {
        if (s.contact?.city) citiesSet.add(s.contact.city);
        else if (s.contact?.district) citiesSet.add(s.contact.district);
      });
      setAvailableCities(["All", ...Array.from(citiesSet).sort()]);
    } catch (err) {
      toast.error("Failed to load schools");
    } finally {
      setLoading(false);
    }
  }, [search, filter, selectedCity]);

  useEffect(() => {
    const t = setTimeout(fetchSchools, 500);
    return () => clearTimeout(t);
  }, [fetchSchools]);

  const clearFilters = () => { setSearch(""); setFilter("All"); setSelectedCity("All"); };
  const hasFilters = search || filter !== "All" || selectedCity !== "All";

  const cityOptions = availableCities.map(c => ({ value: c, label: c === "All" ? "All Cities" : c }));
  const typeOptions = [
    { value: "All", label: "All Types" },
    { value: "Government", label: "Government" },
    { value: "Private", label: "Private" },
    { value: "International", label: "International" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
        .schools-page * { box-sizing: border-box; }
        .schools-page { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      <div className="schools-page" style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* ═══ HERO ═══ */}
        <div style={{
          position: "relative", borderRadius: 24, overflow: "hidden",
          background: "linear-gradient(135deg,#1e1b4b 0%,var(--color-primary,#4f46e5) 50%,var(--color-secondary,#7c3aed) 100%)",
          padding: "56px 48px 52px", marginBottom: 32, color: "#fff",
          animation: "fadeUp 0.55s ease both",
        }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -60, left: -40, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 18,
              fontSize: 11.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#c7d2fe", background: "rgba(255,255,255,0.12)", padding: "5px 14px", borderRadius: 50,
            }}>
              <BookOpen size={12} strokeWidth={2.5} /> Sri Lanka's Education Network
            </span>
            <h1 style={{ fontSize: "clamp(26px,3.5vw,42px)", fontWeight: 900, letterSpacing: "-0.8px", lineHeight: 1.2, margin: "0 0 14px" }}>
              Schools in Sri Lanka
            </h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, margin: "0 0 36px", fontWeight: 400, maxWidth: 500 }}>
              Discover and connect with institutions across the island — explore events, activities, and achievements.
            </p>

            {/* Stats */}
            <div style={{
              display: "inline-flex", flexWrap: "wrap", gap: 2,
              background: "rgba(255,255,255,0.1)", borderRadius: 16,
              backdropFilter: "blur(8px)", overflow: "hidden",
            }}>
              {[
                { icon: School,       label: "Schools",      val: "10,000+" },
                { icon: CalendarCheck,label: "Active Events", val: "500+" },
              ].map(({ icon: Icon, label, val }, i) => (
                <div key={i} style={{ padding: "18px 28px", borderRight: i === 0 ? "1px solid rgba(255,255,255,0.12)" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <Icon size={14} strokeWidth={2} color="rgba(255,255,255,0.6)" />
                    <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</span>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.5px" }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ FILTERS ═══ */}
        <div style={{
          background: "#fff", borderRadius: 18, border: "1px solid #f0f0f0",
          padding: "20px 24px", marginBottom: 28,
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "flex-end" }}>

            {/* Search */}
            <div style={{ flex: "1 1 240px", display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase" }}>Search</label>
              <div style={{ position: "relative" }}>
                <Search size={15} strokeWidth={2.2} color="#9ca3af" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input
                  type="text"
                  placeholder="School name or description…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 14px 10px 40px",
                    borderRadius: 12, border: "1.5px solid #e5e7eb",
                    fontSize: 13.5, fontWeight: 500, color: "#374151",
                    outline: "none", fontFamily: "inherit", transition: "border-color 0.18s",
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"}
                  onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
                />
                {search && (
                  <button onClick={() => setSearch("")} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", padding: 2 }}>
                    <X size={14} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            </div>

            <FilterSelect label="Type" value={filter} onChange={setFilter} options={typeOptions} />
            <FilterSelect label="City / District" value={selectedCity} onChange={setSelectedCity} options={cityOptions} />

            {/* Divider */}
            <div style={{ width: 1, height: 40, background: "#f0f0f0", flexShrink: 0, alignSelf: "flex-end" }} />

            {/* View toggle */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase" }}>View</label>
              <div style={{ display: "flex", gap: 4, background: "#f7f7f8", borderRadius: 12, padding: 4 }}>
                {[
                  { id: "grid", Icon: LayoutGrid, label: "Grid" },
                  { id: "map",  Icon: Map,         label: "Map" },
                ].map(({ id, Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setViewMode(id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "8px 16px", borderRadius: 9, border: "none",
                      background: viewMode === id ? "#fff" : "transparent",
                      color: viewMode === id ? "var(--color-primary,#4f46e5)" : "#6b7280",
                      fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                      boxShadow: viewMode === id ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                      transition: "all 0.18s",
                    }}
                  >
                    <Icon size={14} strokeWidth={2.2} />{label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear filters */}
            {hasFilters && (
              <button
                onClick={clearFilters}
                style={{
                  display: "flex", alignItems: "center", gap: 6, alignSelf: "flex-end",
                  padding: "10px 16px", borderRadius: 12, border: "1.5px solid #fecaca",
                  background: "#fef2f2", color: "#dc2626", fontWeight: 700, fontSize: 13,
                  cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
                }}
              >
                <X size={13} strokeWidth={2.5} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* ═══ RESULTS HEADER ═══ */}
        {!loading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#0f0f0f", letterSpacing: "-0.3px" }}>
                {schools.length.toLocaleString()} {schools.length === 1 ? "School" : "Schools"}
              </span>
              {hasFilters && (
                <span style={{
                  fontSize: 11.5, fontWeight: 700, color: "var(--color-primary,#4f46e5)",
                  background: "color-mix(in srgb,var(--color-primary,#4f46e5) 9%,transparent)",
                  padding: "3px 10px", borderRadius: 50,
                }}>Filtered</span>
              )}
            </div>
          </div>
        )}

        {/* ═══ CONTENT ═══ */}
        {loading ? (
          <div>
            {viewMode === "grid" ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} style={{ borderRadius: 20, overflow: "hidden", background: "#fff", border: "1px solid #f0f0f0" }}>
                    <Skeleton h={96} r={0} />
                    <div style={{ padding: "32px 20px 20px" }}>
                      <Skeleton h={14} r={6} />
                      <div style={{ marginTop: 10 }}><Skeleton h={20} r={6} /></div>
                      <div style={{ marginTop: 8 }}><Skeleton h={13} r={4} /></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ borderRadius: 20, overflow: "hidden", background: "#fff", border: "1px solid #f0f0f0" }}>
                <Skeleton h={500} r={0} />
              </div>
            )}
          </div>
        ) : schools.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 24px", background: "#fff", borderRadius: 20, border: "1px solid #f0f0f0" }}>
            <div style={{ width: 60, height: 60, borderRadius: 16, background: "#f7f7f8", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Search size={26} color="#d1d5db" strokeWidth={1.8} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f0f0f", margin: "0 0 8px" }}>No schools found</h3>
            <p style={{ fontSize: 14, color: "#9ca3af", margin: "0 0 20px" }}>Try adjusting your search or filter criteria</p>
            <button
              onClick={clearFilters}
              style={{
                padding: "11px 24px", borderRadius: 50, border: "none",
                background: "linear-gradient(135deg,var(--color-primary,#4f46e5),var(--color-secondary,#7c3aed))",
                color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Clear all filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
            {schools.map(school => (
              <SchoolCard key={school.id} school={school} onClick={() => navigate(`/schools/${school.id}`)} />
            ))}
          </div>
        ) : (
          <GoogleMapView
            schools={schools}
            onSchoolSelect={setSelectedSchool}
            selectedSchool={selectedSchool}
            navigate={navigate}
          />
        )}
      </div>
    </>
  );
};

export default Schools;