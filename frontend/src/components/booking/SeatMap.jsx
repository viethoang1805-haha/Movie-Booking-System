import { useEffect, useState } from "react";
import socket from "../../hooks/useSocket";

const getUserId = () => {
  const stored = localStorage.getItem("userId");
  if (stored) return Number(stored);
  const newId = Date.now();
  localStorage.setItem("userId", String(newId));
  return newId;
};

const USER_ID = 1;

export default function SeatMap({ showtimeId }) {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Load ghế
  useEffect(() => {
    if (!showtimeId) return;

    fetch(`${import.meta.env.VITE_API_URL}/booking/showtimes/${showtimeId}/seats`)
      .then((r) => r.json())
      .then((data) => {
        setSeats(
          data.map((s) => ({ id: s.seatNumber, status: "available" }))
        );
      })
      .catch(() => {
        setSeats(
          Array.from({ length: 20 }).map((_, i) => ({
            id: "A" + (i + 1),
            status: "available",
          }))
        );
      });
  }, [showtimeId]);

  // Socket
  useEffect(() => {
    if (!showtimeId) return;

    console.log("🔌 useEffect socket chạy:", showtimeId);

    socket.emit("join_showtime", Number(showtimeId));

    const onSeatLocked = (data) => {
      console.log("🔒 seat_locked:", data);
      setSeats((prev) =>
        prev.map((s) =>
          s.id === data.seatId ? { ...s, status: "locked" } : s
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
          s.id === data.seatId ? { ...s, status: "available" } : s
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
      setSelectedSeats((prev) =>
        prev.filter((id) => !data.seatIds.includes(id))
      );
    };

    const onBookingSuccess = (data) => {
      alert(`🎉 Đặt vé thành công!\nMã: ${data.bookingId}\nTổng: ${Number(data.totalPrice).toLocaleString()}đ`);
      setSelectedSeats([]);
    };

    const onBookingError = (data) => {
      alert(`❌ ${data.message}`);
    };

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
    };
  }, [showtimeId]);

  const chonGhe = (seat) => {
    if (seat.status !== "available") return;
    console.log("📤 emit select_seat:", seat.id);
    socket.emit("select_seat", {
      showtimeId: Number(showtimeId),
      seatId: seat.id,
      userId: USER_ID,
    });
  };

  const boGhe = (seat) => {
    socket.emit("unselect_seat", {
      showtimeId: Number(showtimeId),
      seatId: seat.id,
      userId: USER_ID,
    });
    setSelectedSeats((prev) => prev.filter((id) => id !== seat.id));
  };

  const datVe = () => {
    if (!selectedSeats.length) {
      alert("Vui lòng chọn ít nhất 1 ghế!");
      return;
    }
    socket.emit("confirm_booking", {
      showtimeId: Number(showtimeId),
      seatIds: selectedSeats,
      userId: USER_ID,
    });
  };

  return (
    <div>
      <h2>🎬 Seat Map</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
        {seats.map((seat) => {
          const isSelected = selectedSeats.includes(seat.id);
          const isDisabled =
            seat.status === "booked" ||
            (seat.status === "locked" && !isSelected);

          return (
            <button
              key={seat.id}
              onClick={() => (isSelected ? boGhe(seat) : chonGhe(seat))}
              disabled={isDisabled}
              style={{
                padding: 10,
                border: "1px solid #000",
                cursor: isDisabled ? "not-allowed" : "pointer",
                background:
                  seat.status === "booked"
                    ? "red"
                    : seat.status === "locked"
                    ? "orange"
                    : isSelected
                    ? "blue"
                    : "green",
                color: "white",
              }}
            >
              {seat.id}
            </button>
          );
        })}
      </div>

      <p>🟦 Ghế đang chọn: {selectedSeats.join(", ") || "Chưa chọn ghế nào"}</p>

      <button onClick={datVe} disabled={!selectedSeats.length} style={{ marginTop: 10 }}>
        🎟 Đặt vé ({selectedSeats.length} ghế)
      </button>
    </div>
  );
}