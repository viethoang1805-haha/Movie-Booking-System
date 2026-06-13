// src/pages/History.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth.store";
import bookingApi from "../services/modules/booking.api";

/* ─── Status Badge ───────────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const MAP = {
    CONFIRMED: { bg: "rgba(46,204,113,0.12)", color: "#2ecc71", dot: "#2ecc71", label: "Đã xác nhận" },
    PENDING:   { bg: "rgba(243,156,18,0.12)",  color: "#f5a623", dot: "#f5a623", label: "Chờ xử lý" },
    CANCELLED: { bg: "rgba(229,9,20,0.12)",    color: "#ff6b6b", dot: "#e50914", label: "Đã huỷ" },
  };
  const s = MAP[status] || MAP.PENDING;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontSize: 12, fontWeight: 600, padding: "4px 10px", borderRadius: 20,
      background: s.bg, color: s.color,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

/* ─── Empty State ────────────────────────────────────────────────────────────── */
function EmptyState({ onBrowse }) {
  return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        background: "rgba(229,9,20,0.08)", border: "1px solid rgba(229,9,20,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 32, margin: "0 auto 20px",
      }}>🎟</div>
      <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#f0f0f0" }}>
        Chưa có lịch sử đặt vé
      </h3>
      <p style={{ margin: "0 0 24px", color: "#666", fontSize: 14 }}>
        Bạn chưa đặt vé phim nào. Hãy khám phá các bộ phim đang chiếu!
      </p>
      <button
        onClick={onBrowse}
        style={{
          padding: "11px 28px", background: "#e50914", color: "#fff",
          border: "none", borderRadius: 9, fontWeight: 700, fontSize: 14,
          cursor: "pointer",
        }}
      >Xem phim ngay</button>
    </div>
  );
}

/* ─── Booking Card ───────────────────────────────────────────────────────────── */
function BookingCard({ booking }) {
  const [expanded, setExpanded] = useState(false);
  const isCancelled = booking.status === "CANCELLED";

  return (
    <div style={{
      background: "#161616",
      border: `1px solid ${expanded ? "rgba(229,9,20,0.3)" : "rgba(255,255,255,0.07)"}`,
      borderRadius: 14, overflow: "hidden",
      transition: "border-color 0.2s",
    }}>
      {/* Card header */}
      <div
        onClick={() => setExpanded(v => !v)}
        style={{
          padding: "18px 22px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 16,
          transition: "background 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        {/* Poster thumbnail */}
        <div style={{
          width: 52, height: 72, borderRadius: 8, overflow: "hidden",
          background: "#1a1a2e", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, opacity: isCancelled ? 0.4 : 1,
        }}>
          {booking.posterUrl
            ? <img src={booking.posterUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : "🎬"}
        </div>

        {/* Main info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
            <h3 style={{
              margin: 0, fontSize: 15, fontWeight: 700,
              color: isCancelled ? "#555" : "#f0f0f0",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>{booking.showtime?.movie?.title ?? "Phim không xác định"}</h3>
            <StatusBadge status={booking.status} />
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {[
              { icon: "🏢", text: booking.showtime?.room?.theater?.name },
              { icon: "🚪", text: booking.showtime?.room?.name },
              { icon: "🕐", text: booking.showtime?.startTime
                  ? new Date(booking.showtime.startTime).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" })
                  : null },
            ].filter(i => i.text).map(item => (
              <span key={item.icon} style={{ fontSize: 12, color: "#666", display: "flex", alignItems: "center", gap: 4 }}>
                {item.icon} {item.text}
              </span>
            ))}
          </div>
        </div>

        {/* Price + chevron */}
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: isCancelled ? "#555" : "#e50914", marginBottom: 4 }}>
            {(booking.totalPrice ?? 0).toLocaleString()}đ
          </div>
          <div style={{
            fontSize: 11, color: "#555",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s", display: "inline-block",
          }}>▼</div>
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "18px 22px",
          background: "rgba(255,255,255,0.015)",
        }}>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            {/* Seats */}
            <div>
              <p style={{ margin: "0 0 8px", fontSize: 11, color: "#666", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Ghế đã đặt</p>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {(booking.bookingSeats ?? []).map(bs => (
                  <span key={bs.seat?.seatNumber ?? bs.id} style={{
                    background: isCancelled ? "rgba(255,255,255,0.04)" : "rgba(229,9,20,0.1)",
                    border: `1px solid ${isCancelled ? "rgba(255,255,255,0.08)" : "rgba(229,9,20,0.25)"}`,
                    color: isCancelled ? "#555" : "#e50914",
                    borderRadius: 6, padding: "4px 10px", fontSize: 13, fontWeight: 700,
                  }}>{bs.seat?.seatNumber ?? "?"}</span>
                ))}
              </div>
            </div>

            {/* Booking info */}
            <div>
              <p style={{ margin: "0 0 8px", fontSize: 11, color: "#666", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Thông tin đặt vé</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, color: "#888" }}>
                  Mã đặt: <span style={{ fontFamily: "monospace", color: "#aaa", background: "rgba(255,255,255,0.05)", padding: "1px 6px", borderRadius: 4 }}>
                    #{String(booking.id).slice(-8).toUpperCase()}
                  </span>
                </span>
                <span style={{ fontSize: 12, color: "#888" }}>
                  Ngày đặt: {new Date(booking.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </span>
                <span style={{ fontSize: 12, color: "#888" }}>
                  Số ghế: {booking.bookingSeats?.length ?? 0} ghế ×{" "}
                  {((booking.totalPrice ?? 0) / (booking.bookingSeats?.length || 1)).toLocaleString()}đ
                </span>
              </div>
            </div>

            {/* Payment status */}
            {booking.payment && (
              <div>
                <p style={{ margin: "0 0 8px", fontSize: 11, color: "#666", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>Thanh toán</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 12, color: "#888" }}>
                    Phương thức: <span style={{ color: "#aaa" }}>{booking.payment.method ?? "—"}</span>
                  </span>
                  <span style={{ fontSize: 12, color: booking.payment.status === "SUCCESS" ? "#2ecc71" : "#f5a623" }}>
                    {booking.payment.status === "SUCCESS" ? "✓ Đã thanh toán" : "⏳ Chưa thanh toán"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Skeleton ───────────────────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div style={{ background: "#161616", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "18px 22px", display: "flex", gap: 16, alignItems: "center" }}>
      <div style={{ width: 52, height: 72, borderRadius: 8, background: "#222", animation: "pulse 1.5s ease-in-out infinite", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 16, background: "#222", borderRadius: 4, width: "55%", marginBottom: 10, animation: "pulse 1.5s ease-in-out infinite" }} />
        <div style={{ height: 12, background: "#1e1e1e", borderRadius: 4, width: "80%", animation: "pulse 1.5s ease-in-out infinite" }} />
      </div>
      <div style={{ width: 80, textAlign: "right" }}>
        <div style={{ height: 18, background: "#222", borderRadius: 4, animation: "pulse 1.5s ease-in-out infinite" }} />
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────────────────── */
const TABS = [
  { key: "ALL",       label: "Tất cả" },
  { key: "CONFIRMED", label: "Đã xác nhận" },
  { key: "PENDING",   label: "Chờ xử lý" },
  { key: "CANCELLED", label: "Đã huỷ" },
];

export default function History() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    bookingApi.getByUser(user.id)
      .then(data => setBookings(Array.isArray(data) ? data : []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const filtered = bookings.filter(b => {
    const matchTab = activeTab === "ALL" || b.status === activeTab;
    const title = b.showtime?.movie?.title ?? "";
    const matchSearch = title.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const counts = TABS.reduce((acc, t) => {
    acc[t.key] = t.key === "ALL" ? bookings.length : bookings.filter(b => b.status === t.key).length;
    return acc;
  }, {});

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", color: "#f0f0f0" }}>
      <style>{`
        * { box-sizing: border-box; }
        html, body, #root { background: #0d0d0d !important; margin: 0; padding: 0; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 3px; }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(13,13,13,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 32px", height: 60,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 30, height: 30, background: "#e50914", borderRadius: 7,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 13, color: "#fff",
          }}>C</div>
          <span
            onClick={() => navigate("/")}
            style={{ fontWeight: 800, fontSize: 16, cursor: "pointer", letterSpacing: "-0.5px" }}
          >Cine<span style={{ color: "#e50914" }}>Book</span></span>
        </div>

        <div style={{ display: "flex", gap: 24, fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
          {[
            { label: "Trang chủ", path: "/" },
            { label: "Lịch sử", path: "/history", active: true },
          ].map(item => (
            <span
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{ cursor: "pointer", color: item.active ? "#fff" : undefined, fontWeight: item.active ? 600 : 400 }}
            >{item.label}</span>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "#e50914", display: "flex", alignItems: "center",
            justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#fff",
          }}>{user?.name?.[0]?.toUpperCase() ?? "U"}</div>
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>{user?.name}</span>
        </div>
      </nav>

      {/* ── Header ── */}
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "36px 24px 0" }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 800, letterSpacing: "-0.5px" }}>
            Lịch sử đặt vé
          </h1>
          <p style={{ margin: 0, color: "#666", fontSize: 14 }}>
            Bạn đã đặt tổng cộng <span style={{ color: "#f0f0f0", fontWeight: 600 }}>{bookings.length}</span> vé
          </p>
        </div>

        {/* ── Filter bar ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 6, background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: 3 }}>
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  padding: "7px 14px", borderRadius: 7, border: "none", cursor: "pointer",
                  background: activeTab === tab.key ? "#e50914" : "transparent",
                  color: activeTab === tab.key ? "#fff" : "#666",
                  fontWeight: activeTab === tab.key ? 700 : 400,
                  fontSize: 13, transition: "all 0.2s",
                  display: "flex", alignItems: "center", gap: 6,
                }}
              >
                {tab.label}
                {counts[tab.key] > 0 && (
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    background: activeTab === tab.key ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.08)",
                    color: activeTab === tab.key ? "#fff" : "#888",
                    borderRadius: 10, padding: "1px 6px", minWidth: 18, textAlign: "center",
                  }}>{counts[tab.key]}</span>
                )}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 13, color: "#555" }}>🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm theo tên phim..."
              style={{
                padding: "8px 12px 8px 30px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8, color: "#f0f0f0", fontSize: 13,
                width: 200, outline: "none",
              }}
            />
          </div>
        </div>

        {/* ── List ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingBottom: 60, animation: "fadeUp .4s ease" }}>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)
          ) : filtered.length === 0 ? (
            bookings.length === 0
              ? <EmptyState onBrowse={() => navigate("/")} />
              : (
                <div style={{ textAlign: "center", padding: "60px 0", color: "#555" }}>
                  <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
                  <p style={{ margin: 0, fontSize: 14 }}>Không tìm thấy vé nào khớp với bộ lọc</p>
                </div>
              )
          ) : (
            filtered.map(booking => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}