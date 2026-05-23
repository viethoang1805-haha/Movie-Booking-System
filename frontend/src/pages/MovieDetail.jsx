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
            .toISOString().split("T")[0];
          setSelectedDate(firstDate);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#888", fontSize: 15 }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid #e50914", borderTopColor: "transparent", animation: "spin .7s linear infinite" }} />
        Đang tải...
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  if (!movie) return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}>
      Không tìm thấy phim
    </div>
  );

  const dates = [...new Set(
    showtimes.map(s => new Date(s.startTime).toISOString().split("T")[0])
  )].sort();

  const filteredShowtimes = showtimes.filter(
    s => new Date(s.startTime).toISOString().split("T")[0] === selectedDate
  );

  const groupByTheater = filteredShowtimes.reduce((acc, s) => {
    const name = s.room?.theater?.name ?? "Không rõ";
    if (!acc[name]) acc[name] = [];
    acc[name].push(s);
    return acc;
  }, {});

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", color: "#f0f0f0" }}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* ── Hero backdrop ── */}
      <div style={{ position: "relative", height: 440, overflow: "hidden" }}>
        {/* Blurred background */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: movie.posterUrl ? `url(${movie.posterUrl})` : "none",
          backgroundSize: "cover", backgroundPosition: "center",
          filter: "blur(18px) brightness(0.25)",
          transform: "scale(1.08)",
        }} />
        {/* Fallback bg */}
        {!movie.posterUrl && (
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,#1a1a2e,#0f0f1a)" }} />
        )}
        {/* Bottom gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(13,13,13,0) 0%, #0d0d0d 100%)",
        }} />

        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          style={{
            position: "absolute", top: 24, left: 32,
            background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.12)", color: "#ccc",
            padding: "8px 16px", borderRadius: 8, fontSize: 13,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#e50914"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#ccc"; }}
        >← Quay lại</button>

        {/* Content */}
        <div style={{
          position: "absolute", bottom: 32, left: 0, right: 0,
          maxWidth: 1000, margin: "0 auto", padding: "0 32px",
          display: "flex", gap: 32, alignItems: "flex-end",
          animation: "fadeUp .5s ease",
        }}>
          {/* Poster */}
          <div style={{
            width: 160, height: 240, borderRadius: 12, overflow: "hidden",
            flexShrink: 0, boxShadow: "0 12px 48px rgba(0,0,0,0.8)",
            border: "2px solid rgba(255,255,255,0.1)",
            background: "#1a1a2e",
          }}>
            {movie.posterUrl ? (
              <img src={movie.posterUrl} alt={movie.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>🎥</div>
            )}
          </div>

          {/* Meta */}
          <div style={{ flex: 1, paddingBottom: 6 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              <span style={{ background: "#e50914", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 4, letterSpacing: 1 }}>ĐANG CHIẾU</span>
              <span style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.75)", fontSize: 11, padding: "3px 10px", borderRadius: 4 }}>⏱ {movie.duration} phút</span>
              <span style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.75)", fontSize: 11, padding: "3px 10px", borderRadius: 4 }}>
                📅 {new Date(movie.releaseDate).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <h1 style={{ margin: "0 0 12px", fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px", lineHeight: 1.15 }}>
              {movie.title}
            </h1>
            {movie.description && (
              <p style={{
                margin: 0, color: "rgba(255,255,255,0.6)", fontSize: 14, lineHeight: 1.65,
                maxWidth: 560,
                display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>{movie.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 32px 60px" }}>

        {/* Description full */}
        {movie.description && (
          <div style={{
            background: "#161616", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 14, padding: "22px 24px", marginBottom: 36,
          }}>
            <h2 style={{ margin: "0 0 12px", fontSize: 16, fontWeight: 700, color: "#f0f0f0", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 3, height: 18, background: "#e50914", borderRadius: 2, display: "inline-block" }} />
              Nội dung phim
            </h2>
            <p style={{ margin: 0, color: "#999", fontSize: 14, lineHeight: 1.75 }}>{movie.description}</p>
          </div>
        )}

        {/* Showtimes section */}
        <div>
          <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 700, color: "#f0f0f0", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 3, height: 22, background: "#e50914", borderRadius: 2, display: "inline-block" }} />
            Chọn suất chiếu
          </h2>

          {showtimes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#555" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎟</div>
              <p style={{ margin: 0, fontSize: 14 }}>Chưa có suất chiếu nào cho phim này</p>
            </div>
          ) : (
            <>
              {/* Date Picker */}
              <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
                {dates.map(date => {
                  const d = new Date(date);
                  const isSelected = selectedDate === date;
                  return (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      style={{
                        padding: "10px 18px", borderRadius: 10,
                        border: `1px solid ${isSelected ? "#e50914" : "rgba(255,255,255,0.1)"}`,
                        cursor: "pointer",
                        background: isSelected ? "#e50914" : "rgba(255,255,255,0.04)",
                        color: isSelected ? "#fff" : "#aaa",
                        fontWeight: isSelected ? 700 : 400,
                        fontSize: 13, transition: "all 0.2s",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                        minWidth: 70,
                      }}
                      onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = "rgba(229,9,20,0.5)"; e.currentTarget.style.color = "#fff"; } }}
                      onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#aaa"; } }}
                    >
                      <span style={{ fontSize: 11, opacity: 0.8, fontWeight: 500 }}>
                        {d.toLocaleDateString("vi-VN", { weekday: "short" }).toUpperCase()}
                      </span>
                      <span style={{ fontSize: 16, fontWeight: 800, lineHeight: 1 }}>{d.getDate()}</span>
                      <span style={{ fontSize: 11, opacity: 0.8 }}>
                        Tháng {d.getMonth() + 1}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Theaters */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {Object.entries(groupByTheater).map(([theaterName, times]) => (
                  <div
                    key={theaterName}
                    style={{
                      background: "#161616",
                      border: "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 14, overflow: "hidden",
                    }}
                  >
                    {/* Theater header */}
                    <div style={{
                      padding: "16px 22px",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      display: "flex", alignItems: "center", gap: 12,
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 9,
                        background: "rgba(229,9,20,0.12)",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                      }}>🏢</div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#f0f0f0" }}>{theaterName}</h3>
                        <p style={{ margin: 0, fontSize: 12, color: "#666", marginTop: 2 }}>
                          📍 {times[0]?.room?.theater?.location ?? ""}
                        </p>
                      </div>
                    </div>

                    {/* Showtime buttons */}
                    <div style={{ padding: "16px 22px", display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {times.map(s => (
                        <button
                          key={s.id}
                          onClick={() => navigate(`/booking/${s.id}`)}
                          style={{
                            padding: "10px 18px", borderRadius: 10,
                            border: "1px solid rgba(229,9,20,0.35)",
                            cursor: "pointer", background: "rgba(229,9,20,0.06)",
                            color: "#f0f0f0",
                            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                            minWidth: 90,
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.background = "#e50914";
                            e.currentTarget.style.borderColor = "#e50914";
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = "rgba(229,9,20,0.06)";
                            e.currentTarget.style.borderColor = "rgba(229,9,20,0.35)";
                          }}
                        >
                          <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.3px" }}>
                            {new Date(s.startTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          <span style={{ fontSize: 11, color: "#aaa", marginTop: 1 }}>
                            {s.room?.name ?? `Phòng ${s.roomId}`}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#e50914", marginTop: 3 }}>
                            {(s.price ?? 0).toLocaleString()}đ
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}