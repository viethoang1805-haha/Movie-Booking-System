import { useEffect, useState } from "react";
import axios from "axios";
import useAuthStore from "../store/auth.store";

export default function History() {
  const { token } = useAuthStore();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await axios.get("http://localhost:3000/bookings/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.data);

      // FIX CHÍNH
      if (Array.isArray(res.data)) {
        setBookings(res.data);
      } else if (Array.isArray(res.data.data)) {
        setBookings(res.data.data);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error(err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0d0d0d",
          color: "#fff",
          padding: 40,
        }}
      >
        Đang tải...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d0d0d",
        color: "#fff",
        padding: 40,
      }}
    >
      <h1 style={{ marginBottom: 30 }}>Lịch sử đặt vé</h1>

      {bookings.length === 0 ? (
        <p>Chưa có vé nào</p>
      ) : (
        <div style={{ display: "grid", gap: 20 }}>
          {bookings.map((booking) => (
            <div
              key={booking.id}
              style={{
                background: "#181818",
                padding: 20,
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h2 style={{ marginBottom: 10 }}>
                {booking.movieTitle || "Phim"}
              </h2>

              <p>Ghế: {booking.seats?.join(", ")}</p>

              <p>
                Ngày đặt:{" "}
                {new Date(booking.createdAt).toLocaleString("vi-VN")}
              </p>

              <p style={{ color: "#e50914", fontWeight: 700 }}>
                {booking.totalPrice?.toLocaleString("vi-VN")}đ
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}