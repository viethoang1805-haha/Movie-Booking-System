// src/pages/MovieDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import movieApi from "../services/modules/movie.api";
import showtimeApi from "../services/modules/showtime.api";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    Promise.all([movieApi.getOne(id), showtimeApi.getByMovie(id)])
      .then(([movieData, showtimeData]) => {
        setMovie(movieData);
        setShowtimes(showtimeData);
        if (showtimeData.length > 0) {
          const firstDate = new Date(showtimeData[0].startTime)
            .toISOString()
            .split("T")[0];
          setSelectedDate(firstDate);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{ textAlign: "center", marginTop: 40 }}>Đang tải...</p>;
  if (!movie) return <p style={{ textAlign: "center", marginTop: 40 }}>Không tìm thấy phim</p>;

  const dates = [...new Set(
    showtimes.map((s) => new Date(s.startTime).toISOString().split("T")[0])
  )].sort();

  const filteredShowtimes = showtimes.filter(
    (s) => new Date(s.startTime).toISOString().split("T")[0] === selectedDate
  );

  const groupByTheater = filteredShowtimes.reduce((acc, s) => {
    const theaterName = s.room?.theater?.name ?? "Không rõ";
    if (!acc[theaterName]) acc[theaterName] = [];
    acc[theaterName].push(s);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "20px" }}>
      <button
        onClick={() => navigate("/")}
        style={{ marginBottom: 20, padding: "8px 16px", border: "none", background: "none", cursor: "pointer", fontSize: 14, color: "#666" }}
      >
        ← Quay lại
      </button>

      {/* Movie Info */}
      <div style={{ display: "flex", gap: 24, marginBottom: 32 }}>
        <div style={{ width: 200, minWidth: 200, height: 300, borderRadius: 12, overflow: "hidden", background: "#1a1a2e", flexShrink: 0 }}>
          {movie.posterUrl ? (
            <img src={movie.posterUrl} alt={movie.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>🎥</div>
          )}
        </div>
        <div>
          <h1 style={{ margin: "0 0 12px", fontSize: 28 }}>{movie.title}</h1>
          <p style={{ margin: "0 0 8px", color: "#555" }}>⏱ Thời lượng: <strong>{movie.duration} phút</strong></p>
          <p style={{ margin: "0 0 8px", color: "#555" }}>
            📅 Khởi chiếu: <strong>{new Date(movie.releaseDate).toLocaleDateString("vi-VN")}</strong>
          </p>
          {movie.description && (
            <p style={{ margin: "12px 0 0", color: "#444", lineHeight: 1.6 }}>{movie.description}</p>
          )}
        </div>
      </div>

      {/* Showtimes */}
      <h2 style={{ marginBottom: 16 }}>🎟 Chọn suất chiếu</h2>

      {showtimes.length === 0 ? (
        <p style={{ color: "#888" }}>Chưa có suất chiếu nào</p>
      ) : (
        <>
          {/* Date Picker */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            {dates.map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                style={{
                  padding: "8px 16px", borderRadius: 8, border: "1px solid #ccc", cursor: "pointer",
                  background: selectedDate === date ? "#e50914" : "#fff",
                  color: selectedDate === date ? "#fff" : "#000",
                  fontWeight: selectedDate === date ? 600 : 400,
                }}
              >
                {new Date(date).toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" })}
              </button>
            ))}
          </div>

          {/* Showtime by Theater */}
          {Object.entries(groupByTheater).map(([theaterName, times]) => (
            <div key={theaterName} style={{ marginBottom: 24, padding: 16, borderRadius: 12, border: "1px solid #eee", background: "#fafafa" }}>
              <h3 style={{ margin: "0 0 4px", fontSize: 16 }}>🏢 {theaterName}</h3>
              <p style={{ margin: "0 0 12px", fontSize: 13, color: "#888" }}>
                📍 {times[0]?.room?.theater?.location ?? ""}
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {times.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => navigate(`/booking/${s.id}`)}
                    style={{
                      padding: "10px 18px", borderRadius: 8, border: "1px solid #e50914",
                      cursor: "pointer", background: "#fff", color: "#e50914",
                      fontWeight: 600, fontSize: 14, transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#e50914"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "#e50914"; }}
                  >
                    {/* ✅ Tên phòng thật từ API */}
                    <span style={{ display: "block", fontSize: 11, fontWeight: 500, marginBottom: 2 }}>
                      {s.room?.name ?? `Phòng ${s.roomId}`}
                    </span>
                    {new Date(s.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                    <span style={{ display: "block", fontSize: 11, fontWeight: 400, color: "inherit", marginTop: 2 }}>
                      {s.price?.toLocaleString()}đ
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}