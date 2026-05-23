import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import adminApi from "../../services/modules/admin.api";

/* ─── COLORS ───────────────────────────────────────── */
const COLORS = {
  bg: "#f5f7fb",
  card: "#ffffff",
  border: "#e5e7eb",
  text: "#111827",
  subtext: "#6b7280",
  primary: "#e50914",
};

/* ─── Stat Card ────────────────────────────────────── */
function StatCard({ label, value, icon, bg, delta }) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 180,
        background: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        padding: "20px 22px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: bg,
          opacity: 0.15,
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
          }}
        >
          {icon}
        </div>

        {delta !== undefined && (
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              padding: "4px 10px",
              borderRadius: 999,
              background:
                delta >= 0
                  ? "rgba(46,204,113,0.12)"
                  : "rgba(231,76,60,0.12)",
              color: delta >= 0 ? "#2ecc71" : "#e74c3c",
            }}
          >
            {delta >= 0 ? "+" : ""}
            {delta}%
          </span>
        )}
      </div>

      <p
        style={{
          margin: "0 0 6px",
          fontSize: 13,
          color: COLORS.subtext,
        }}
      >
        {label}
      </p>

      <h2
        style={{
          margin: 0,
          fontSize: 28,
          fontWeight: 800,
          color: COLORS.text,
        }}
      >
        {value}
      </h2>
    </div>
  );
}

/* ─── Mini Chart ───────────────────────────────────── */
function MiniChart({ data }) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 4,
        height: 60,
      }}
    >
      {data.map((d, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          <div
            style={{
              width: "100%",
              height: `${(d.value / max) * 50}px`,
              background:
                i === data.length - 1
                  ? COLORS.primary
                  : "rgba(229,9,20,0.25)",
              borderRadius: "4px 4px 0 0",
              minHeight: 4,
            }}
          />

          <span style={{ fontSize: 9, color: COLORS.subtext }}>
            {d.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Status Badge ─────────────────────────────────── */
function StatusBadge({ status }) {
  const MAP = {
    CONFIRMED: {
      bg: "rgba(46,204,113,0.12)",
      color: "#2ecc71",
      label: "Đã xác nhận",
    },
    PENDING: {
      bg: "rgba(243,156,18,0.12)",
      color: "#f39c12",
      label: "Chờ xử lý",
    },
    CANCELLED: {
      bg: "rgba(231,76,60,0.12)",
      color: "#e74c3c",
      label: "Đã huỷ",
    },
  };

  const s = MAP[status] || MAP.PENDING;

  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: "4px 10px",
        borderRadius: 999,
        background: s.bg,
        color: s.color,
      }}
    >
      {s.label}
    </span>
  );
}

const MOCK_CHART = [
  { label: "T2", value: 42 },
  { label: "T3", value: 67 },
  { label: "T4", value: 53 },
  { label: "T5", value: 89 },
  { label: "T6", value: 76 },
  { label: "T7", value: 110 },
  { label: "CN", value: 98 },
];

/* ─── Main Dashboard ───────────────────────────────── */
export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getDashboard()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div
          style={{
            padding: 48,
            color: COLORS.subtext,
            fontFamily: "Inter, sans-serif",
          }}
        >
          Đang tải dữ liệu...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div
        style={{
          padding: "32px 36px",
          minHeight: "100vh",
          background: COLORS.bg,
          color: COLORS.text,
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: 32,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 6px",
                fontSize: 13,
                color: COLORS.subtext,
              }}
            >
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>

            <h1
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 800,
                color: COLORS.text,
              }}
            >
              Trang Chủ
            </h1>
          </div>


        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 28,
            flexWrap: "wrap",
          }}
        >
          <StatCard
            label="Tổng phim"
            icon="🎬"
            value={stats?.totalMovies ?? 0}
            bg="rgba(52,152,219,0.3)"
            delta={12}
          />

          <StatCard
            label="Người dùng"
            icon="👥"
            value={(stats?.totalUsers ?? 0).toLocaleString()}
            bg="rgba(46,204,113,0.3)"
            delta={8}
          />

          <StatCard
            label="Đơn đặt vé"
            icon="🎟"
            value={(stats?.totalBookings ?? 0).toLocaleString()}
            bg="rgba(243,156,18,0.3)"
            delta={21}
          />

          <StatCard
            label="Doanh thu"
            icon="💰"
            value={`${(
              (stats?.totalRevenue ?? 0) / 1_000_000
            ).toFixed(1)}M đ`}
            bg="rgba(229,9,20,0.3)"
            delta={15}
          />
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: 20,
          }}
        >
          {/* Table */}
          <div
            style={{
              background: COLORS.card,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                padding: "18px 22px",
                borderBottom: `1px solid ${COLORS.border}`,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                🕐 Đặt vé gần đây
              </h3>

              <span
                style={{
                  color: COLORS.primary,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Xem tất cả →
              </span>
            </div>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                  {[
                    "Mã đặt",
                    "Khách hàng",
                    "Phim",
                    "Ghế",
                    "Tổng tiền",
                    "Trạng thái",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 14px",
                        textAlign: "left",
                        color: COLORS.subtext,
                        fontWeight: 600,
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {(stats?.recentBookings ?? []).map((b) => (
                  <tr
                    key={b.id}
                    style={{
                      borderBottom: `1px solid ${COLORS.border}`,
                    }}
                  >
                    <td style={{ padding: "14px" }}>
                      #{String(b.id).slice(-6)}
                    </td>

                    <td style={{ padding: "14px" }}>
                      {b.user?.name ?? b.user?.email}
                    </td>

                    <td style={{ padding: "14px" }}>{b.movie}</td>

                    <td style={{ padding: "14px" }}>
                      <span
                        style={{
                          background: "#f3f4f6",
                          padding: "4px 8px",
                          borderRadius: 6,
                        }}
                      >
                        {b.seats?.join(", ")}
                      </span>
                    </td>

                    <td
                      style={{
                        padding: "14px",
                        color: COLORS.primary,
                        fontWeight: 700,
                      }}
                    >
                      {(b.totalPrice ?? 0).toLocaleString()}đ
                    </td>

                    <td style={{ padding: "14px" }}>
                      <StatusBadge
                        status={b.status ?? "CONFIRMED"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right side */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Chart */}
            <div
              style={{
                background: COLORS.card,
                border: `1px solid ${COLORS.border}`,
                borderRadius: 16,
                padding: "18px 20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <p
                style={{
                  margin: "0 0 4px",
                  fontSize: 12,
                  color: COLORS.subtext,
                }}
              >
                Doanh thu 7 ngày qua
              </p>

              <h3
                style={{
                  margin: "0 0 18px",
                  fontSize: 22,
                  fontWeight: 800,
                }}
              >
                {(
                  (stats?.totalRevenue ?? 0) / 1_000_000
                ).toFixed(1)}
                M đ
              </h3>

              <MiniChart data={MOCK_CHART} />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}