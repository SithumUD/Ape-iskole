import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ApiStory from "../../services/ApiStory";
import ApiComment from "../../services/ApiComment";
import { toast } from "react-hot-toast";
import {
  Heart, Eye, MessageCircle, Share2, ArrowLeft, ChevronRight,
  Calendar, User, Clock, BookOpen, Zap, ArrowRight, Copy,
  Check, Star, Image, Tag, Send, Dumbbell, Trophy, Palette,
  Music, Microscope, Newspaper, GraduationCap, Sparkles,
  ThumbsUp, X
} from "lucide-react";

/* ── helpers ── */
const formatDate = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};
const formatDateShort = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const CATEGORY_META = {
  Sports:      { icon: Dumbbell,      color: "#059669", bg: "#ecfdf5" },
  "Big Match": { icon: Trophy,        color: "#d97706", bg: "#fffbeb" },
  Art:         { icon: Palette,       color: "#7c3aed", bg: "#f5f3ff" },
  Carnival:    { icon: Sparkles,      color: "#db2777", bg: "#fdf2f8" },
  Achievement: { icon: Star,          color: "#2563eb", bg: "#eff6ff" },
  Education:   { icon: BookOpen,      color: "#2563eb", bg: "#eff6ff" },
  Cultural:    { icon: GraduationCap, color: "#7c3aed", bg: "#f5f3ff" },
  Music:       { icon: Music,         color: "#059669", bg: "#ecfdf5" },
  Science:     { icon: Microscope,    color: "#0891b2", bg: "#ecfeff" },
  News:        { icon: Newspaper,     color: "#6b7280", bg: "#f9fafb" },
};
const getCatMeta = (c) => CATEGORY_META[c] || CATEGORY_META.News;

/* ── JWT helper ── */
const getTokenPayload = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};
const userPayload = getTokenPayload();
const isLoggedIn  = !!userPayload;
const userName    = userPayload ? (userPayload.name || userPayload.preferred_username || "User") : "";

/* ── Skeleton ── */
const Skeleton = ({ h = 20, r = 8 }) => (
  <div style={{
    height: h, borderRadius: r,
    background: "linear-gradient(90deg,#f3f4f6 25%,#e9eaec 50%,#f3f4f6 75%)",
    backgroundSize: "200% 100%", animation: "shimmer 1.6s infinite",
  }} />
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

/* ── Section head ── */
const SectionHead = ({ label, title, sub }) => (
  <div style={{ marginBottom: 20 }}>
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

/* ── Lightbox ── */
const Lightbox = ({ image, onClose }) => {
  useEffect(() => {
    const handle = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
    >
      <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }} onClick={e => e.stopPropagation()}>
        <img src={image} alt="Full view" style={{ maxWidth: "100%", maxHeight: "90vh", objectFit: "contain", borderRadius: 16 }} />
        <button
          onClick={onClose}
          style={{ position: "absolute", top: -14, right: -14, width: 36, height: 36, borderRadius: "50%", border: "none", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
        >
          <X size={16} strokeWidth={2.5} color="#374151" />
        </button>
      </div>
    </div>
  );
};

/* ══════════════════════════════
   COMMENT SECTION
══════════════════════════════ */
const CommentSection = ({ storyId }) => {
  const [newComment,    setNewComment]    = useState("");
  const [comments,      setComments]      = useState([]);
  const [submitting,    setSubmitting]    = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await ApiComment.getCommentsByStory(storyId);
        setComments(res.data || []);
      } catch {}
    })();
  }, [storyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) { toast.error("Please log in to comment."); return; }
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await ApiComment.addComment(storyId, { content: newComment, anonymousName: userName });
      setComments([res.data, ...comments]);
      setNewComment("");
      toast.success("Comment posted!");
    } catch {
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (id, idx) => {
    if (!isLoggedIn) { toast.error("Please log in to like a comment."); return; }
    try {
      await ApiComment.likeComment(id);
      const updated = [...comments];
      updated[idx] = { ...updated[idx], likes: (updated[idx].likes || 0) + 1 };
      setComments(updated);
    } catch {
      toast.error("Failed to like comment");
    }
  };

  return (
    <section style={{ marginTop: 48 }}>
      <SectionHead label="Discussion" title={`Comments (${comments.length})`} />

      {/* Comment form */}
      {isLoggedIn ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
          <div style={{
            background: "#f9fafb", borderRadius: 16, border: "1px solid #f0f0f0",
            padding: "18px 20px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "color-mix(in srgb,var(--color-primary,#4f46e5) 12%,transparent)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 800, color: "var(--color-primary,#4f46e5)",
                flexShrink: 0,
              }}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Posting as</div>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: "var(--color-primary,#4f46e5)" }}>{userName}</div>
              </div>
            </div>
            <textarea
              rows={3}
              placeholder="Share your thoughts about this story…"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              disabled={submitting}
              style={{
                width: "100%", padding: "12px 14px", borderRadius: 12,
                border: "1.5px solid #e5e7eb", fontSize: 13.5, fontWeight: 500,
                color: "#374151", outline: "none", fontFamily: "inherit",
                resize: "none", boxSizing: "border-box", transition: "border-color 0.18s",
                background: "#fff",
              }}
              onFocus={e => e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"}
              onBlur={e => e.currentTarget.style.borderColor = "#e5e7eb"}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "10px 20px", borderRadius: 50, border: "none",
                  background: submitting || !newComment.trim()
                    ? "#e5e7eb"
                    : "linear-gradient(135deg, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))",
                  color: submitting || !newComment.trim() ? "#9ca3af" : "#fff",
                  fontWeight: 700, fontSize: 13.5, cursor: submitting || !newComment.trim() ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  boxShadow: submitting || !newComment.trim() ? "none" : "0 4px 12px color-mix(in srgb,var(--color-primary,#4f46e5) 25%,transparent)",
                  transition: "all 0.18s",
                }}
              >
                <Send size={13} strokeWidth={2.5} />
                {submitting ? "Posting…" : "Post Comment"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div style={{
          marginBottom: 24, borderRadius: 16,
          background: "color-mix(in srgb,var(--color-primary,#4f46e5) 5%,transparent)",
          border: "1px solid color-mix(in srgb,var(--color-primary,#4f46e5) 12%,transparent)",
          padding: "32px 24px", textAlign: "center",
        }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "color-mix(in srgb,var(--color-primary,#4f46e5) 10%,transparent)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <MessageCircle size={22} color="var(--color-primary,#4f46e5)" strokeWidth={1.8} />
          </div>
          <h4 style={{ fontSize: 16, fontWeight: 800, color: "#0f0f0f", margin: "0 0 6px" }}>Join the Conversation</h4>
          <p style={{ fontSize: 13.5, color: "#6b7280", lineHeight: 1.65, margin: "0 0 18px", fontWeight: 400 }}>
            Log in to leave a comment and show your support!
          </p>
          <button
            onClick={() => toast.error("Please login to comment")}
            style={{
              padding: "10px 24px", borderRadius: 50, border: "none",
              background: "linear-gradient(135deg, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))",
              color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Log In to Comment
          </button>
        </div>
      )}

      {/* Comment list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {comments.length > 0 ? comments.map((c, idx) => (
          <div
            key={c.id || idx}
            style={{
              display: "flex", gap: 14, padding: "18px 20px",
              background: "#fff", borderRadius: 16, border: "1px solid #f0f0f0",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)", transition: "box-shadow 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.07)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"}
          >
            <div style={{
              width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
              background: "color-mix(in srgb,var(--color-secondary,#7c3aed) 12%,transparent)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 800, color: "var(--color-secondary,#7c3aed)",
            }}>
              {(c.authorName || c.anonymousName || "U").charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 800, color: "#0f0f0f" }}>{c.authorName || c.anonymousName || "Anonymous"}</span>
                  <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>{formatDateShort(c.createdAt || c.date)}</span>
                </div>
                <button
                  onClick={() => handleLike(c.id, idx)}
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "4px 10px", borderRadius: 50, border: "1.5px solid #f0f0f0",
                    background: "none", cursor: "pointer", fontFamily: "inherit",
                    fontSize: 12, fontWeight: 700, color: "#9ca3af",
                    transition: "all 0.18s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#fecdd3"; e.currentTarget.style.color = "#e11d48"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#f0f0f0"; e.currentTarget.style.color = "#9ca3af"; }}
                >
                  <Heart size={12} strokeWidth={2} />{c.likes || 0}
                </button>
              </div>
              <p style={{ fontSize: 13.5, color: "#4b5563", lineHeight: 1.7, margin: 0, fontWeight: 400 }}>{c.content}</p>
            </div>
          </div>
        )) : (
          <div style={{ textAlign: "center", padding: "40px 24px", background: "#fafafa", borderRadius: 16, border: "1px dashed #e5e7eb" }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <MessageCircle size={20} color="#9ca3af" strokeWidth={1.8} />
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#374151", margin: "0 0 4px" }}>No comments yet</p>
            <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </section>
  );
};

/* ══════════════════════════════
   RECOMMENDED STORIES
══════════════════════════════ */
const RecommendedStories = ({ currentStoryId, onStoryClick }) => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await ApiStory.getStories({ pageSize: 4, isPublished: true });
        setStories(res.data.filter(s => s.id !== currentStoryId).slice(0, 3));
      } catch {} finally {
        setLoading(false);
      }
    })();
  }, [currentStoryId]);

  if (loading || !stories.length) return null;

  return (
    <section style={{ marginTop: 56, paddingTop: 40, borderTop: "1px solid #f0f0f0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f0f0f", letterSpacing: "-0.4px", margin: "0 0 4px" }}>Recommended Stories</h2>
          <p style={{ fontSize: 13.5, color: "#6b7280", margin: 0, fontWeight: 500 }}>You might also enjoy these stories</p>
        </div>
        <button
          onClick={() => onStoryClick(null)}
          style={{
            display: "flex", alignItems: "center", gap: 5,
            fontSize: 13, fontWeight: 700, color: "var(--color-primary,#4f46e5)",
            background: "none", border: "none", cursor: "pointer", padding: "6px 0",
          }}
        >
          View all <ArrowRight size={15} strokeWidth={2.5} />
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 20 }}>
        {stories.map(s => {
          const meta = getCatMeta(s.category);
          const Icon = meta.icon;
          return (
            <div
              key={s.id}
              onClick={() => onStoryClick(s.id)}
              style={{
                background: "#fff", borderRadius: 18, border: "1px solid #f0f0f0",
                overflow: "hidden", cursor: "pointer", transition: "all 0.25s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; }}
            >
              <div style={{ position: "relative", height: 190, overflow: "hidden" }}>
                <img
                  src={s.image || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=600"}
                  alt={s.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.06)"}
                  onMouseLeave={e => e.currentTarget.style.transform = ""}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 55%)" }} />
                <span style={{
                  position: "absolute", top: 12, left: 12,
                  display: "inline-flex", alignItems: "center", gap: 5,
                  fontSize: 11.5, fontWeight: 700, color: meta.color, background: meta.bg,
                  padding: "4px 10px", borderRadius: 50,
                }}>
                  <Icon size={11} strokeWidth={2.5} />{s.category}
                </span>
              </div>
              <div style={{ padding: "16px 18px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af" }}>{s.schoolName}</span>
                  <span style={{ fontSize: 11, color: "#c4c4c4", fontWeight: 500 }}>{formatDateShort(s.createdAt)}</span>
                </div>
                <h3 style={{
                  fontSize: 15, fontWeight: 800, color: "#0f0f0f", lineHeight: 1.4, margin: "0 0 8px",
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                  {s.title}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  {[{ Icon: Eye, val: s.views || 0 }, { Icon: Heart, val: s.likes || 0 }, { Icon: MessageCircle, val: s.commentCount || 0 }].map(({ Icon, val }, i) => (
                    <span key={i} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#9ca3af", fontWeight: 600 }}>
                      <Icon size={12} strokeWidth={2} />{val.toLocaleString()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

/* ══════════════════════════════
   STORY DETAILS PAGE
══════════════════════════════ */
const StoryDetails = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [story,      setStory]      = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [liked,      setLiked]      = useState(false);
  const [likeCount,  setLikeCount]  = useState(0);
  const [activeImg,  setActiveImg]  = useState(0);
  const [lightbox,   setLightbox]   = useState(null);
  const [copied,     setCopied]     = useState(false);

  const fetchStory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await ApiStory.getStory(id);
      setStory(res.data);
      setLikeCount(res.data.likes || 0);
    } catch {
      toast.error("Story not found or loading failed");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchStory(); }, [fetchStory]);

  const handleLike = async () => {
    if (!isLoggedIn) { toast.error("Please log in to like this story."); return; }
    if (liked) return;
    try {
      await ApiStory.likeStory(id);
      setLikeCount(p => p + 1);
      setLiked(true);
      toast.success("Story liked!");
    } catch {
      toast.error("Failed to like story");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: story.title, text: story.description, url: window.location.href }); } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Link copied!");
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
          .sd2-page * { box-sizing: border-box; }
          .sd2-page { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}</style>
        <div className="sd2-page" style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 64px" }}>
          <Skeleton h={380} r={24} />
          <div style={{ marginTop: 24 }}>
            <Skeleton h={32} r={8} />
            <div style={{ marginTop: 12 }}><Skeleton h={18} r={6} /></div>
            <div style={{ marginTop: 20 }}><Skeleton h={200} r={20} /></div>
          </div>
        </div>
      </>
    );
  }

  /* ── Not found ── */
  if (!story) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          .sd2-page * { box-sizing: border-box; }
          .sd2-page { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}</style>
        <div className="sd2-page" style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <BookOpen size={32} color="#9ca3af" strokeWidth={1.5} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0f0f0f", margin: "0 0 10px" }}>Story Not Found</h1>
          <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>The story you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/stories")}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "12px 24px", borderRadius: 50, border: "none",
              background: "linear-gradient(135deg, var(--color-primary,#4f46e5), var(--color-secondary,#7c3aed))",
              color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            <ArrowLeft size={15} strokeWidth={2.5} /> Back to Stories
          </button>
        </div>
      </>
    );
  }

  const catMeta  = getCatMeta(story.category);
  const CatIcon  = catMeta.icon;
  const allImages = [story.image, ...(story.gallery || [])].filter(Boolean);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
        .sd2-page * { box-sizing: border-box; }
        .sd2-page { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      <div className="sd2-page" style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* ═══ BREADCRUMB ═══ */}
        <nav style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#9ca3af", fontWeight: 500, marginBottom: 24 }}>
          <Link to="/"       style={{ color: "#9ca3af", textDecoration: "none", fontWeight: 600 }} onMouseEnter={e => e.currentTarget.style.color = "var(--color-primary,#4f46e5)"} onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}>Home</Link>
          <ChevronRight size={13} strokeWidth={2} />
          <Link to="/stories" style={{ color: "#9ca3af", textDecoration: "none", fontWeight: 600 }} onMouseEnter={e => e.currentTarget.style.color = "var(--color-primary,#4f46e5)"} onMouseLeave={e => e.currentTarget.style.color = "#9ca3af"}>Stories</Link>
          <ChevronRight size={13} strokeWidth={2} />
          <span style={{ color: "#374151", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 220 }}>{story.title}</span>
        </nav>

        {/* ═══ HERO ═══ */}
        <div style={{
          position: "relative", borderRadius: 24, overflow: "hidden",
          marginBottom: 32, boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          animation: "fadeUp 0.6s ease both",
        }}>
          <div style={{ height: 420, position: "relative", overflow: "hidden" }}>
            <img
              src={allImages[activeImg] || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1200"}
              alt={story.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.05) 100%)" }} />

            {/* Gallery thumbnails */}
            {allImages.length > 1 && (
              <div style={{ position: "absolute", bottom: 16, left: 20, display: "flex", gap: 8 }}>
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      width: 52, height: 52, borderRadius: 10, overflow: "hidden",
                      border: `2.5px solid ${activeImg === i ? "#fff" : "rgba(255,255,255,0.35)"}`,
                      cursor: "pointer", padding: 0, transition: "border-color 0.18s",
                    }}
                  >
                    <img src={img} alt={`thumb ${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}

            {/* Expand gallery button */}
            {allImages.length > 0 && (
              <button
                onClick={() => setLightbox(allImages[activeImg])}
                style={{
                  position: "absolute", bottom: 16, right: 20,
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 14px", borderRadius: 50,
                  background: "rgba(255,255,255,0.15)", backdropFilter: "blur(6px)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "#fff", fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                <Image size={13} strokeWidth={2} /> View Full
              </button>
            )}
          </div>

          {/* Story info overlay */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 32px", color: "#fff" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 12, fontWeight: 700, color: catMeta.color, background: catMeta.bg,
                padding: "4px 11px", borderRadius: 50,
              }}>
                <CatIcon size={12} strokeWidth={2.5} />{story.category}
              </span>
              {story.isFeatured && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 800, color: "#92400e", background: "#fef3c7", padding: "4px 10px", borderRadius: 50 }}>
                  <Star size={11} strokeWidth={2.5} /> Featured
                </span>
              )}
            </div>
            <h1 style={{ fontSize: "clamp(22px,4vw,42px)", fontWeight: 900, letterSpacing: "-0.8px", lineHeight: 1.12, margin: "0 0 16px" }}>
              {story.title}
            </h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 22px" }}>
              {[
                { icon: GraduationCap, val: story.schoolName },
                { icon: Calendar,      val: formatDate(story.createdAt) },
                { icon: User,          val: story.authorName || "Staff Writer" },
                { icon: Clock,         val: "5 min read" },
              ].filter(({ val }) => val).map(({ icon: Icon, val }, i) => (
                <span key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, color: "rgba(255,255,255,0.82)", fontWeight: 500 }}>
                  <Icon size={14} strokeWidth={2} color="rgba(255,255,255,0.55)" />{val}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ ENGAGEMENT BAR ═══ */}
        <div style={{
          background: "#fff", borderRadius: 16, border: "1px solid #f0f0f0",
          padding: "14px 20px", marginBottom: 28,
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {[
              { Icon: Eye,            val: (story.views || 0).toLocaleString(), label: "views"    },
              { Icon: MessageCircle,  val: story.commentCount || 0,             label: "comments" },
            ].map(({ Icon, val, label }, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13.5, color: "#6b7280", fontWeight: 600 }}>
                <Icon size={15} strokeWidth={2} color="#9ca3af" />{val} {label}
              </span>
            ))}
            <button
              onClick={handleLike}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 14px", borderRadius: 50,
                border: `1.5px solid ${liked ? "#fecdd3" : "#f0f0f0"}`,
                background: liked ? "#fff1f2" : "none",
                color: liked ? "#e11d48" : "#6b7280",
                fontWeight: 700, fontSize: 13.5, cursor: "pointer", fontFamily: "inherit",
                transition: "all 0.18s",
              }}
            >
              <Heart size={14} strokeWidth={2} fill={liked ? "#e11d48" : "none"} />
              {likeCount} {liked ? "Liked" : "Like"}
            </button>
          </div>

          <button
            onClick={handleShare}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "8px 18px", borderRadius: 50,
              border: "1.5px solid #e5e7eb", background: "#fff",
              color: "#374151", fontWeight: 700, fontSize: 13.5, cursor: "pointer",
              fontFamily: "inherit", transition: "all 0.18s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-primary,#4f46e5)"; e.currentTarget.style.color = "var(--color-primary,#4f46e5)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#374151"; }}
          >
            {copied ? <><Check size={14} strokeWidth={2.5} />Copied!</> : <><Share2 size={14} strokeWidth={2} />Share</>}
          </button>
        </div>

        {/* ═══ ARTICLE BODY ═══ */}
        <Card style={{ marginBottom: 28 }}>
          {/* Lead */}
          <p style={{ fontSize: 17, color: "#374151", lineHeight: 1.85, fontWeight: 500, margin: "0 0 24px", paddingBottom: 24, borderBottom: "1px solid #f3f4f6" }}>
            {story.description}
          </p>
          {/* Content */}
          <div style={{ fontSize: 15, color: "#4b5563", lineHeight: 1.9, fontWeight: 400, whiteSpace: "pre-line" }}>
            {story.content}
          </div>

          {/* Tags */}
          {story.tags?.length > 0 && (
            <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid #f3f4f6" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <Tag size={14} color="#9ca3af" strokeWidth={2} />
                {story.tags.map((tag, i) => (
                  <span
                    key={i}
                    onClick={() => navigate(`/stories?tag=${tag}`)}
                    style={{
                      fontSize: 12.5, fontWeight: 700,
                      color: "var(--color-primary,#4f46e5)",
                      background: "color-mix(in srgb,var(--color-primary,#4f46e5) 8%,transparent)",
                      padding: "4px 12px", borderRadius: 50, cursor: "pointer",
                      transition: "all 0.18s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "var(--color-primary,#4f46e5)"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "color-mix(in srgb,var(--color-primary,#4f46e5) 8%,transparent)"; e.currentTarget.style.color = "var(--color-primary,#4f46e5)"; }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* ═══ COMMENTS ═══ */}
        <CommentSection storyId={story.id} />

        {/* ═══ RECOMMENDED ═══ */}
        <RecommendedStories
          currentStoryId={story.id}
          onStoryClick={(newId) => newId ? navigate(`/stories/${newId}`) : navigate("/stories")}
        />
      </div>

      {/* ═══ LIGHTBOX ═══ */}
      {lightbox && <Lightbox image={lightbox} onClose={() => setLightbox(null)} />}
    </>
  );
};

export default StoryDetails;