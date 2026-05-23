// src/components/booking/SeatMap.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../hooks/useSocket";
import useAuthStore from "../../store/auth.store";

/* ─── Seat status colors ───────────────────────────────────────────────────── */
const getStyle = (seat, isSelected) => {
  if (seat.status === "booked")
    return { bg: "#2a0a0a", border: "#7b1010", color: "#7b1010", cursor: "not-allowed" };
  if (seat.status === "locked" && !isSelected)
    return { bg: "#2a1e00", border: "#b87314", color: "#b87314", cursor: "not-allowed" };
  if (isSelected)
    return { bg: "#0d2a4a", border: "#1e90ff", color: "#1e90ff", cursor: "pointer" };
  return { bg: "#0d2a1a", border: "#1a8a45", color: "#2ecc71", cursor: "pointer" };
};

/* ─── Seat Button ───────────────────────────────────────────────────────────── */
function Seat({ seat, isSelected, onClick }) {
  const [hovered, setHovered] = useState(false);
  const s = getStyle(seat, isSelected);
  const isDisabled = seat.status === "booked" || (seat.status === "locked" && !isSelected);

  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      onMouseEnter={() => !isDisabled && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={seat.id}
      style={{
        padding: "8px 4px",
        borderRadius: 7,
        border: `1px solid ${s.border}`,
        cursor: s.cursor,
        background: hovered && !isDisabled ? s.border : s.bg,
        color: hovered && !isDisabled ? "#fff" : s.color,
        fontWeight: 700, fontSize: 11,
        transition: "all 0.15s",
        transform: isSelected ? "scale(1.08)" : "scale(1)",
        boxShadow: isSelected ? `0 0 10px ${s.border}55` : "none",
        minWidth: 0,
      }}
    >
      {seat.id}
    </button>
  );
}

/* ─── Legend item ───────────────────────────────────────────────────────────── */
function LegendItem({ color, borderColor, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <div style={{
        width: 22, height: 22, borderRadius: 5,
        background: color, border: `1px solid ${borderColor}`,
      }} />
      <span style={{ fontSize: 12, color: "#888" }}>{label}</span>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────────── */
export default function SeatMap({ showtimeId }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const USER_ID = Number(user?.id ?? 0);

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showtime, setShowtime] = useState(null);
  const [notification, setNotification] = useState(null); // { type: "success"|"error"|"warn", msg }

  const notify = (type, msg) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 3500);
  };

  useEffect(() => {
    if (!showtimeId) return;
    if (!socket.connected) {
      const token = localStorage.getItem("token");
      socket.auth = { token };
      socket.connect();
    }

    fetch(`${import.meta.env.VITE_API_URL}/showtimes/${showtimeId}`)
      .then(r => r.json()).then(setShowtime).catch(() => {});

    fetch(`${import.meta.env.VITE_API_URL}/bookings/showtimes/${showtimeId}/seats`)
      .then(r => r.json())
      .then(data => {
        setSeats(data.map(s => ({ id: s.seatNumber, status: s.status })));
        socket.emit("join_showtime", Number(showtimeId));
      })
      .catch(() => {
        setSeats(Array.from({ length: 20 }).map((_, i) => ({ id: "A" + (i + 1), status: "available" })));
        socket.emit("join_showtime", Number(showtimeId));
      });

    const onSeatLocked = data => {
      setSeats(prev => prev.map(s =>
        s.id === data.seatId && s.status !== "booked" ? { ...s, status: "locked" } : s
      ));
      if (Number(data.userId) === USER_ID)
        setSelectedSeats(prev => prev.includes(data.seatId) ? prev : [...prev, data.seatId]);
    };

    const onSeatUnlocked = data => {
      setSeats(prev => prev.map(s =>
        s.id === data.seatId && s.status !== "booked" ? { ...s, status: "available" } : s
      ));
      setSelectedSeats(prev => prev.filter(id => id !== data.seatId));
    };

    const onSeatBooked = data => {
      setSeats(prev => prev.map(s =>
        data.seatIds.includes(s.id) ? { ...s, status: "booked" } : s
      ));
      setSelectedSeats(prev => prev.filter(id => !data.seatIds.includes(id)));
    };

    const onBookingSuccess = data => {
      notify("success", `Đặt vé thành công! Mã: #${String(data.bookingId).slice(-6).toUpperCase()} — Tổng: ${Number(data.totalPrice).toLocaleString()}đ`);
      setSelectedSeats([]);
    };

    const onBookingError = data => notify("error", data.message);
    const onSeatError = data => {
      notify("warn", data.message);
      setSelectedSeats(prev => prev.filter(id => id !== data.seatId));
    };

    socket.on("seat_locked", onSeatLocked);
    socket.on("seat_unlocked", onSeatUnlocked);
    socket.on("seat_booked", onSeatBooked);
    socket.on("booking_success", onBookingSuccess);
    socket.on("booking_error", onBookingError);
    socket.on("seat_error", onSeatError);

    return () => {
      socket.off("seat_locked", onSeatLocked);
      socket.off("seat_unlocked", onSeatUnlocked);
      socket.off("seat_booked", onSeatBooked);
      socket.off("booking_success", onBookingSuccess);
      socket.off("booking_error", onBookingError);
      socket.off("seat_error", onSeatError);
      socket.disconnect();
    };
  }, [showtimeId, USER_ID]);

  const chonGhe = seat => {
    if (seat.status !== "available") return;
    socket.emit("select_seat", { showtimeId: Number(showtimeId), seatId: seat.id });
  };

  const boGhe = seat => {
    socket.emit("unselect_seat", { showtimeId: Number(showtimeId), seatId: seat.id });
    setSelectedSeats(prev => prev.filter(id => id !== seat.id));
  };

  const datVe = () => {
    if (!selectedSeats.length) { notify("warn", "Vui lòng chọn ít nhất 1 ghế!"); return; }
    socket.emit("confirm_booking", { showtimeId: Number(showtimeId), seatIds: selectedSeats });
  };

  const totalPrice = selectedSeats.length * (showtime?.price ?? 0);

  /* Group seats into rows by prefix letter */
  const rowMap = seats.reduce((acc, s) => {
    const row = s.id.match(/^[A-Za-z]+/)?.[0] ?? "?";
    if (!acc[row]) acc[row] = [];
    acc[row].push(s);
    return acc;
  }, {});
  const rows = Object.entries(rowMap);

  const notifColors = {
    success: { bg: "rgba(46,204,113,0.12)", border: "rgba(46,204,113,0.3)", color: "#2ecc71", icon: "✓" },
    error:   { bg: "rgba(229,9,20,0.12)",   border: "rgba(229,9,20,0.3)",   color: "#ff6b6b", icon: "✕" },
    warn:    { bg: "rgba(243,156,18,0.12)",  border: "rgba(243,156,18,0.3)", color: "#f5a623", icon: "⚠" },
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", color: "#f0f0f0", padding: "0 0 60px" }}>
      <style>{`
        * { box-sizing: border-box; }
        html, body, #root { background: #0d0d0d !important; margin: 0; padding: 0; }
        @keyframes slideDown { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* ── Notification toast ── */}
      {notification && (() => {
        const nc = notifColors[notification.type];
        return (
          <div style={{
            position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
            background: nc.bg, border: `1px solid ${nc.border}`,
            color: nc.color, borderRadius: 10, padding: "12px 22px",
            fontSize: 14, fontWeight: 600, zIndex: 1000,
            display: "flex", alignItems: "center", gap: 8,
            animation: "slideDown .3s ease",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            maxWidth: 420, textAlign: "center",
          }}>
            <span style={{ fontSize: 16 }}>{nc.icon}</span>
            {notification.msg}
          </div>
        );
      })()}

      {/* ── Top bar ── */}
      <div style={{
        background: "rgba(13,13,13,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 28px", height: 58,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "transparent", border: "1px solid rgba(255,255,255,0.12)",
            color: "#ccc", padding: "7px 14px", borderRadius: 7,
            fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#e50914"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#ccc"; }}
        >← Quay lại</button>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, background: "#e50914", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13 }}>C</div>
          <span style={{ fontWeight: 800, fontSize: 15 }}>Cine<span style={{ color: "#e50914" }}>Book</span></span>
        </div>

        <div style={{ width: 100 }} />
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 20px 0" }}>

        {/* ── Showtime Info ── */}
        {showtime && (
          <div style={{
            background: "#161616", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14, padding: "18px 22px", marginBottom: 28,
            display: "flex", gap: 16, alignItems: "center",
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 10, overflow: "hidden",
              background: "#1a1a2e", flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
            }}>🎬</div>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 800, color: "#fff" }}>
                {showtime.movie?.title}
              </h2>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {[
                  { icon: "🏢", text: showtime.room?.theater?.name },
                  { icon: "🚪", text: showtime.room?.name },
                  { icon: "🕐", text: new Date(showtime.startTime).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" }) },
                  { icon: "💰", text: `${(showtime.price ?? 0).toLocaleString()}đ/ghế` },
                ].map(item => item.text && (
                  <span key={item.icon} style={{ fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 4 }}>
                    {item.icon} {item.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Screen ── */}
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <div style={{
            display: "inline-block",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.03))",
            border: "1px solid rgba(255,255,255,0.12)",
            borderBottom: "none", borderRadius: "60px 60px 0 0",
            padding: "7px 80px 10px",
            fontSize: 11, fontWeight: 700, color: "#666",
            letterSpacing: 3, textTransform: "uppercase",
          }}>Màn hình</div>
          {/* Shadow under screen */}
          <div style={{ height: 6, background: "radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, transparent 70%)", marginBottom: 20 }} />
        </div>

        {/* ── Seat Grid ── */}
        <div style={{ marginBottom: 28 }}>
          {rows.length > 0 ? (
            rows.map(([row, rowSeats]) => (
              <div key={row} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ width: 20, fontSize: 12, color: "#555", fontWeight: 700, flexShrink: 0, textAlign: "center" }}>{row}</span>
                <div style={{ flex: 1, display: "grid", gridTemplateColumns: `repeat(${Math.min(rowSeats.length, 10)}, 1fr)`, gap: 6 }}>
                  {rowSeats.map(seat => {
                    const isSelected = selectedSeats.includes(seat.id);
                    return (
                      <Seat
                        key={seat.id}
                        seat={seat}
                        isSelected={isSelected}
                        onClick={() => isSelected ? boGhe(seat) : chonGhe(seat)}
                      />
                    );
                  })}
                </div>
                <span style={{ width: 20, fontSize: 12, color: "#555", fontWeight: 700, flexShrink: 0, textAlign: "center" }}>{row}</span>
              </div>
            ))
          ) : (
            // Fallback: flat grid if no rows parsed
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
              {seats.map(seat => {
                const isSelected = selectedSeats.includes(seat.id);
                return (
                  <Seat key={seat.id} seat={seat} isSelected={isSelected}
                    onClick={() => isSelected ? boGhe(seat) : chonGhe(seat)} />
                );
              })}
            </div>
          )}
        </div>

        {/* ── Legend ── */}
        <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", marginBottom: 28 }}>
          <LegendItem color="#0d2a1a" borderColor="#1a8a45" label="Ghế trống" />
          <LegendItem color="#0d2a4a" borderColor="#1e90ff" label="Đang chọn" />
          <LegendItem color="#2a1e00" borderColor="#b87314" label="Người khác giữ" />
          <LegendItem color="#2a0a0a" borderColor="#7b1010" label="Đã đặt" />
        </div>

        {/* ── Footer booking bar ── */}
        <div style={{
          background: "#161616", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14, padding: "18px 22px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 16, flexWrap: "wrap",
        }}>
          {/* Selected seats info */}
          <div>
            <p style={{ margin: "0 0 4px", fontSize: 12, color: "#666" }}>Ghế đã chọn</p>
            {selectedSeats.length === 0 ? (
              <span style={{ fontSize: 14, color: "#555" }}>Chưa chọn ghế nào</span>
            ) : (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {selectedSeats.map(id => (
                  <span key={id} style={{
                    background: "rgba(30,144,255,0.12)", border: "1px solid rgba(30,144,255,0.3)",
                    color: "#1e90ff", borderRadius: 6, padding: "3px 10px", fontSize: 13, fontWeight: 700,
                  }}>{id}</span>
                ))}
              </div>
            )}
          </div>

          {/* Total + button */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}>
            {selectedSeats.length > 0 && (
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: "0 0 2px", fontSize: 12, color: "#666" }}>Tổng tiền</p>
                <span style={{ fontSize: 20, fontWeight: 800, color: "#e50914" }}>
                  {totalPrice.toLocaleString()}đ
                </span>
              </div>
            )}
            <button
              onClick={datVe}
              disabled={!selectedSeats.length}
              style={{
                padding: "13px 28px",
                background: selectedSeats.length ? "#e50914" : "#222",
                color: selectedSeats.length ? "#fff" : "#555",
                border: `1px solid ${selectedSeats.length ? "#e50914" : "#333"}`,
                borderRadius: 10, cursor: selectedSeats.length ? "pointer" : "not-allowed",
                fontWeight: 700, fontSize: 15, transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => { if (selectedSeats.length) e.currentTarget.style.background = "#c40812"; }}
              onMouseLeave={e => { if (selectedSeats.length) e.currentTarget.style.background = "#e50914"; }}
            >
              🎟 Đặt {selectedSeats.length > 0 ? `${selectedSeats.length} ghế` : "vé"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}