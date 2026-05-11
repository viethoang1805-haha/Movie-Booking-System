// src/components/booking/SeatMap.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../hooks/useSocket";
import useAuthStore from "../../store/auth.store";

export default function SeatMap({ showtimeId }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const USER_ID = Number(user?.id ?? 0);

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showtime, setShowtime] = useState(null);

  useEffect(() => {
    if (!showtimeId) return;
      // Cập nhật token mới nhất trước khi connect
if (!socket.connected) {
  const token = localStorage.getItem("token");
  socket.auth = { token };
  socket.connect();
}

    // 1. Load thông tin showtime
    fetch(`${import.meta.env.VITE_API_URL}/showtimes/${showtimeId}`)
      .then((r) => r.json())
      .then((data) => setShowtime(data))
      .catch(() => {});

    // 2. Load ghế từ API
    fetch(`${import.meta.env.VITE_API_URL}/bookings/showtimes/${showtimeId}/seats`)
      .then((r) => r.json())
      .then((data) => {
        setSeats(data.map((s) => ({ id: s.seatNumber, status: s.status })));
        socket.emit("join_showtime", Number(showtimeId));
      })
      .catch(() => {
        setSeats(Array.from({ length: 20 }).map((_, i) => ({ id: "A" + (i + 1), status: "available" })));
        socket.emit("join_showtime", Number(showtimeId));
      });

    // 3. Socket listeners
    const onSeatLocked = (data) => {
      setSeats((prev) =>
        prev.map((s) =>
          s.id === data.seatId && s.status !== "booked" ? { ...s, status: "locked" } : s
        )
      );
      if (Number(data.userId) === USER_ID) {
        setSelectedSeats((prev) =>
          prev.includes(data.seatId) ? prev : [...prev, data.seatId]
        );
      }
    };

    const onSeatUnlocked = (data) => {
      setSeats((prev) =>
        prev.map((s) =>
          s.id === data.seatId && s.status !== "booked" ? { ...s, status: "available" } : s
        )
      );
      setSelectedSeats((prev) => prev.filter((id) => id !== data.seatId));
    };

    const onSeatBooked = (data) => {
      setSeats((prev) =>
        prev.map((s) =>
          data.seatIds.includes(s.id) ? { ...s, status: "booked" } : s
        )
      );
      setSelectedSeats((prev) => prev.filter((id) => !data.seatIds.includes(id)));
    };

    const onBookingSuccess = (data) => {
      alert(`🎉 Đặt vé thành công!\nMã: ${data.bookingId}\nTổng: ${Number(data.totalPrice).toLocaleString()}đ`);
      setSelectedSeats([]);
    };

    const onBookingError = (data) => alert(`❌ ${data.message}`);

    const onSeatError = (data) => {
      alert(`⚠️ ${data.message}`);
      setSelectedSeats((prev) => prev.filter((id) => id !== data.seatId));
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
      socket.disconnect(); // ✅ Disconnect khi rời trang
    };
  }, [showtimeId, USER_ID]);

  const chonGhe = (seat) => {
    if (seat.status !== "available") return;
    socket.emit("select_seat", {
      showtimeId: Number(showtimeId),
      seatId: seat.id,
    });
  };

  const boGhe = (seat) => {
    socket.emit("unselect_seat", {
      showtimeId: Number(showtimeId),
      seatId: seat.id,
    });
    setSelectedSeats((prev) => prev.filter((id) => id !== seat.id));
  };

  const datVe = () => {
    if (!selectedSeats.length) { alert("Vui lòng chọn ít nhất 1 ghế!"); return; }
    socket.emit("confirm_booking", {
      showtimeId: Number(showtimeId),
      seatIds: selectedSeats,
    });
  };

  const getColor = (seat, isSelected) => {
    if (seat.status === "booked") return "#e50914";
    if (seat.status === "locked" && !isSelected) return "#f5a623";
    if (isSelected) return "#1e90ff";
    return "#2ecc71";
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", textAlign: "center", padding: 20 }}>
      <button
        onClick={() => navigate(-1)}
        style={{ float: "left", padding: "6px 14px", border: "1px solid #ccc", borderRadius: 6, cursor: "pointer", background: "#fff" }}
      >
        ← Quay lại
      </button>

      {showtime && (
        <div style={{ marginBottom: 16, textAlign: "center", lineHeight: 1.8 }}>
          <h2 style={{ margin: "0 0 4px" }}>🎬 {showtime.movie?.title}</h2>
          <p style={{ margin: 0, color: "#555", fontSize: 14 }}>
            Rạp: {showtime.room?.theater?.name} &nbsp;|&nbsp;
            Phòng: {showtime.room?.name} &nbsp;|&nbsp;
            Thời Gian: {new Date(showtime.startTime).toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit" })}
            &nbsp;|&nbsp; Giá: {showtime.price?.toLocaleString()}đ/ghế
          </p>
        </div>
      )}

      <div style={{ background: "#ddd", padding: 8, borderRadius: 6, marginBottom: 20, fontWeight: "bold", fontSize: 13 }}>
        SCREEN
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 20 }}>
        {seats.map((seat) => {
          const isSelected = selectedSeats.includes(seat.id);
          const isDisabled = seat.status === "booked" || (seat.status === "locked" && !isSelected);

          return (
            <button
              key={seat.id}
              disabled={isDisabled}
              onClick={() => (isSelected ? boGhe(seat) : chonGhe(seat))}
              style={{
                padding: 12, borderRadius: 8, border: "none",
                cursor: isDisabled ? "not-allowed" : "pointer",
                background: getColor(seat, isSelected),
                color: "#fff", fontWeight: "bold", transition: "0.2s",
              }}
            >
              {seat.id}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 15, fontSize: 13 }}>
        <span>🟩 Trống</span>
        <span>🟦 Đang chọn</span>
        <span>🟧 Đã giữ</span>
        <span>🟥 Đã đặt</span>
      </div>

      <p style={{ marginTop: 15 }}>
        Ghế đã chọn: <b>{selectedSeats.join(", ") || "Chưa chọn"}</b>
      </p>

      <button
        onClick={datVe}
        disabled={!selectedSeats.length}
        style={{
          padding: "10px 24px",
          background: selectedSeats.length ? "#e50914" : "#ccc",
          color: "#fff", border: "none", borderRadius: 8,
          cursor: selectedSeats.length ? "pointer" : "not-allowed",
          fontWeight: 600, fontSize: 15, marginTop: 10,
        }}
      >
        🎟 Đặt vé ({selectedSeats.length} ghế)
        {selectedSeats.length > 0 && showtime && (
          <span style={{ display: "block", fontSize: 12, fontWeight: 400 }}>
            Tổng: {(selectedSeats.length * (showtime.price ?? 0)).toLocaleString()}đ
          </span>
        )}
      </button>
    </div>
  );
}