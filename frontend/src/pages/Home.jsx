import useAuthStore from "../store/auth.store";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import movieApi from "../services/modules/movie.api";

/* ─── Utility ──────────────────────────────────────────────────────────────── */
const GENRES = ["Tất cả", "Hành động", "Tình cảm", "Kinh dị", "Hoạt hình", "Tâm lý"];

/* ─── Hero Banner ───────────────────────────────────────────────────────────── */
function HeroBanner({ movie, onBook }) {
  if (!movie) return null;
  return (
    <div style={{ position: "relative", height: 520, overflow: "hidden", marginBottom: 48 }}>
      {/* Background poster with parallax feel */}
      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage: movie.posterUrl ? `url(${movie.posterUrl})` : "none",
          backgroundSize: "cover", backgroundPosition: "center top",
          filter: "blur(2px) brightness(0.35)",
          transform: "scale(1.05)",
        }}
      />
      {/* Gradient overlay bottom */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, transparent 30%, #0d0d0d 100%)",
      }} />

      {/* Content */}
      <div style={{
        position: "absolute", bottom: 48, left: 0, right: 0,
        maxWidth: 1200, margin: "0 auto", padding: "0 32px",
        display: "flex", gap: 32, alignItems: "flex-end",
      }}>
        {/* Poster thumbnail */}
        <div style={{
          width: 140, height: 210, borderRadius: 12, overflow: "hidden",
          flexShrink: 0, boxShadow: "0 8px 40px rgba(0,0,0,0.7)",
          border: "2px solid rgba(255,255,255,0.15)",
        }}>
          {movie.posterUrl ? (
            <img src={movie.posterUrl} alt={movie.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "#1a1a2e",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>🎬</div>
          )}
        </div>

        {/* Meta */}
        <div style={{ flex: 1, paddingBottom: 4 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <span style={{
              background: "#e50914", color: "#fff", fontSize: 11, fontWeight: 700,
              padding: "3px 10px", borderRadius: 4, letterSpacing: 1, textTransform: "uppercase",
            }}>Nổi bật</span>
            <span style={{
              background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)",
              fontSize: 11, padding: "3px 10px", borderRadius: 4,
            }}>⏱ {movie.duration} phút</span>
          </div>
          <h1 style={{
            margin: "0 0 10px", color: "#fff", fontSize: 36, fontWeight: 800,
            lineHeight: 1.15, letterSpacing: "-0.5px",
            textShadow: "0 2px 12px rgba(0,0,0,0.6)",
          }}>{movie.title}</h1>
          <p style={{
            margin: "0 0 20px", color: "rgba(255,255,255,0.65)", fontSize: 14,
            lineHeight: 1.6, maxWidth: 560,
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>{movie.description || "Bộ phim đang thu hút đông đảo khán giả tại các rạp toàn quốc."}</p>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => onBook(movie.id)}
              style={{
                padding: "12px 28px", background: "#e50914", color: "#fff",
                border: "none", borderRadius: 8, fontWeight: 700, fontSize: 15,
                cursor: "pointer", letterSpacing: 0.3,
                transition: "background 0.2s, transform 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#c40812"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#e50914"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              🎟 Đặt vé ngay
            </button>
            <button
              onClick={() => onBook(movie.id, "detail")}
              style={{
                padding: "12px 24px", background: "rgba(255,255,255,0.12)",
                color: "#fff", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8,
                fontWeight: 600, fontSize: 15, cursor: "pointer",
                backdropFilter: "blur(8px)",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
            >
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Movie Card ────────────────────────────────────────────────────────────── */
function MovieCard({ movie, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onClick(movie.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 12, overflow: "hidden", cursor: "pointer",
        background: "#181818",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        boxShadow: hovered ? "0 16px 40px rgba(0,0,0,0.5)" : "0 2px 12px rgba(0,0,0,0.25)",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      {/* Poster */}
      <div style={{ position: "relative", height: 300, background: "#111", overflow: "hidden" }}>
        {movie.posterUrl ? (
          <img src={movie.posterUrl} alt={movie.title}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.35s ease",
            }} />
        ) : (
          <div style={{
            height: "100%", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 52, background: "#1a1a2e",
          }}>🎥</div>
        )}
        {/* Overlay on hover */}
        <div style={{
          position: "absolute", inset: 0,
          background: hovered ? "rgba(229,9,20,0.15)" : "transparent",
          transition: "background 0.25s",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {hovered && (
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "rgba(229,9,20,0.9)", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>▶</div>
          )}
        </div>
        {/* Duration badge */}
        <div style={{
          position: "absolute", top: 10, right: 10,
          background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
          color: "#fff", fontSize: 11, padding: "4px 8px", borderRadius: 6,
          fontWeight: 600,
        }}>⏱ {movie.duration}p</div>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px" }}>
        <h3 style={{
          margin: "0 0 6px", fontSize: 15, fontWeight: 700,
          color: "#f0f0f0", lineHeight: 1.3,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{movie.title}</h3>
        <p style={{ margin: "0 0 12px", fontSize: 12, color: "#888" }}>
          📅 {new Date(movie.releaseDate).toLocaleDateString("vi-VN")}
        </p>
        <button
          style={{
            width: "100%", padding: "9px 0",
            background: hovered ? "#e50914" : "rgba(229,9,20,0.12)",
            color: hovered ? "#fff" : "#e50914",
            border: `1px solid ${hovered ? "#e50914" : "rgba(229,9,20,0.3)"}`,
            borderRadius: 7, cursor: "pointer", fontWeight: 700, fontSize: 13,
            transition: "all 0.2s",
          }}
        >
          Đặt vé
        </button>
      </div>
    </div>
  );
}

/* ─── Skeleton Card ─────────────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div style={{ borderRadius: 12, overflow: "hidden", background: "#181818" }}>
      <div style={{ height: 300, background: "#222", animation: "pulse 1.5s ease-in-out infinite" }} />
      <div style={{ padding: "14px 16px" }}>
        <div style={{ height: 16, background: "#222", borderRadius: 4, marginBottom: 8, animation: "pulse 1.5s ease-in-out infinite" }} />
        <div style={{ height: 12, background: "#1a1a1a", borderRadius: 4, width: "60%", animation: "pulse 1.5s ease-in-out infinite" }} />
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────────── */
export default function Home() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeGenre, setActiveGenre] = useState("Tất cả");

  useEffect(() => {
    setLoading(true);
    movieApi
      .getAll({ page, limit: 8, search })
      .then((data) => {
        setMovies(data.data);
        setTotalPages(data.totalPages);
      })
      .finally(() => setLoading(false));
  }, [page, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleBook = (id, mode) => {
    if (mode === "detail") navigate(`/movies/${id}`);
    else navigate(`/booking/${id}`);
  };

  const featuredMovie = movies[0] || null;

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", color: "#f0f0f0" }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(13,13,13,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "0 32px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, background: "#e50914", borderRadius: 8,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 800,
          }}>C</div>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.5px", color: "#fff" }}>
            Cine<span style={{ color: "#e50914" }}>Book</span>
          </span>
        </div>

        {/* Nav links */}
        <div style={{ display: "flex", gap: 28, fontSize: 14, color: "rgba(255,255,255,0.6)" }}>
          {["Phim đang chiếu", "Sắp chiếu", "Rạp chiếu", "Khuyến mãi"].map(l => (
            <span key={l} style={{ cursor: "pointer", transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
            >{l}</span>
          ))}
        </div>

        {/* User section */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Search */}
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#555" }}>🔍</span>
            <input
              type="text"
              placeholder="Tìm phim..."
              value={search}
              onChange={handleSearch}
              style={{
                padding: "8px 12px 8px 30px",
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8, color: "#f0f0f0", fontSize: 13,
                width: 200, outline: "none",
                transition: "border-color 0.2s, width 0.3s",
              }}
              onFocus={e => { e.currentTarget.style.borderColor = "rgba(229,9,20,0.5)"; e.currentTarget.style.width = "240px"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.width = "200px"; }}
            />
          </div>

   {user ? (
  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
    <div style={{
      width: 34,
      height: 34,
      borderRadius: "50%",
      background: "#e50914",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      fontSize: 13,
      color: "#fff",
    }}>
      {user.name?.[0]?.toUpperCase() || "U"}
    </div>

    {/* User info */}
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
        {user.name}
      </span>

      <span
        onClick={() => navigate("/history")}
        style={{
          fontSize: 12,
          color: "#e50914",
          cursor: "pointer",
          marginTop: 2,
        }}
      >
        Lịch sử đặt vé
      </span>
    </div>

    <button
      onClick={() => {
        logout();
        navigate("/login");
      }}
      style={{
        padding: "6px 14px",
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.2)",
        color: "rgba(255,255,255,0.6)",
        borderRadius: 6,
        fontSize: 13,
        cursor: "pointer",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#e50914";
        e.currentTarget.style.color = "#e50914";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
        e.currentTarget.style.color = "rgba(255,255,255,0.6)";
      }}
    >
      Đăng xuất
    </button>
  </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              style={{
                padding: "8px 20px", background: "#e50914", color: "#fff",
                border: "none", borderRadius: 7, fontWeight: 700, fontSize: 14,
                cursor: "pointer", transition: "background 0.2s",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#c40812"}
              onMouseLeave={e => e.currentTarget.style.background = "#e50914"}
            >Đăng nhập</button>
          )}
        </div>
      </nav>

      {/* ── Hero Banner ── */}
      {!loading && featuredMovie && (
        <HeroBanner movie={featuredMovie} onBook={handleBook} />
      )}

      {/* ── Main content ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px 64px" }}>

        {/* Genre Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {GENRES.map(g => (
            <button
              key={g}
              onClick={() => setActiveGenre(g)}
              style={{
                padding: "7px 18px", borderRadius: 20,
                background: activeGenre === g ? "#e50914" : "rgba(255,255,255,0.07)",
                color: activeGenre === g ? "#fff" : "rgba(255,255,255,0.5)",
                border: activeGenre === g ? "none" : "1px solid rgba(255,255,255,0.1)",
                fontSize: 13, fontWeight: activeGenre === g ? 700 : 400,
                cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={e => { if (activeGenre !== g) e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { if (activeGenre !== g) e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
            >{g}</button>
          ))}
        </div>

        {/* Section title */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 4, height: 24, background: "#e50914", borderRadius: 2 }} />
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#f0f0f0" }}>
              {search ? `Kết quả: "${search}"` : "Phim đang chiếu"}
            </h2>
          </div>
          {movies.length > 0 && (
            <span style={{ fontSize: 13, color: "#666" }}>{movies.length} phim</span>
          )}
        </div>

        {/* Movie Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : movies.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "80px 0",
            color: "#555", fontSize: 15,
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎬</div>
            <p style={{ margin: 0 }}>Không tìm thấy phim nào</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} onClick={id => navigate(`/movies/${id}`)} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 48 }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: "9px 16px", borderRadius: 7, fontSize: 14,
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.12)",
                color: page === 1 ? "#444" : "#ccc",
                cursor: page === 1 ? "not-allowed" : "pointer",
              }}
            >← Trước</button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                style={{
                  padding: "9px 14px", borderRadius: 7, fontSize: 14,
                  background: page === i + 1 ? "#e50914" : "transparent",
                  border: `1px solid ${page === i + 1 ? "#e50914" : "rgba(255,255,255,0.12)"}`,
                  color: page === i + 1 ? "#fff" : "#888",
                  fontWeight: page === i + 1 ? 700 : 400,
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >{i + 1}</button>
            ))}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                padding: "9px 16px", borderRadius: 7, fontSize: 14,
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.12)",
                color: page === totalPages ? "#444" : "#ccc",
                cursor: page === totalPages ? "not-allowed" : "pointer",
              }}
            >Tiếp →</button>
          </div>
        )}
      </div>
    </div>
  );
}