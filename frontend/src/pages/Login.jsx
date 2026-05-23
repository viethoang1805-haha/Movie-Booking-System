// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../services/modules/auth.api";
import useAuthStore from "../store/auth.store";

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 9,
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.05)",
  color: "#f0f0f0",
  fontSize: 14,
  outline: "none",
  transition: "border-color 0.2s",
  boxSizing: "border-box",
};

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = tab === "login"
        ? await authApi.login({ email: form.email, password: form.password })
        : await authApi.register({ name: form.name, email: form.email, password: form.password });

      setAuth(data.user, data.token);
      navigate(data.user.role === "ADMIN" ? "/admin" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0d0d0d",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .inp:focus { border-color: rgba(229,9,20,0.6) !important; background: rgba(229,9,20,0.04) !important; }
        .inp::placeholder { color: #555; }
      `}</style>

      {/* Background glow blobs */}
      <div style={{ position: "absolute", top: "10%", left: "15%", width: 400, height: 400, borderRadius: "50%", background: "rgba(229,9,20,0.06)", filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "15%", right: "10%", width: 300, height: 300, borderRadius: "50%", background: "rgba(100,50,255,0.05)", filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{
        width: "100%", maxWidth: 400,
        animation: "fadeIn .4s ease",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, background: "#e50914", borderRadius: 14,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, margin: "0 auto 14px", fontWeight: 800,
          }}>C</div>
          <h1 style={{ margin: 0, color: "#fff", fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px" }}>
            Cine<span style={{ color: "#e50914" }}>Book</span>
          </h1>
          <p style={{ margin: "6px 0 0", color: "#666", fontSize: 13 }}>
            {tab === "login" ? "Chào mừng bạn trở lại" : "Tạo tài khoản mới"}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "#161616",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 18,
          padding: "32px 30px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
        }}>
          {/* Tabs */}
          <div style={{
            display: "flex", marginBottom: 28,
            background: "rgba(255,255,255,0.04)",
            borderRadius: 10, padding: 3,
          }}>
            {["login", "register"].map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(""); }}
                style={{
                  flex: 1, padding: "9px 0",
                  border: "none", cursor: "pointer",
                  borderRadius: 8,
                  background: tab === t ? "#e50914" : "transparent",
                  color: tab === t ? "#fff" : "#666",
                  fontWeight: tab === t ? 700 : 400,
                  fontSize: 14, transition: "all 0.2s",
                }}
              >
                {t === "login" ? "Đăng nhập" : "Đăng ký"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {tab === "register" && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 12, color: "#888", marginBottom: 6, fontWeight: 500 }}>Họ tên</label>
                <input
                  className="inp"
                  name="name"
                  placeholder="Nhập họ tên của bạn"
                  value={form.name}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 12, color: "#888", marginBottom: 6, fontWeight: 500 }}>Email</label>
              <input
                className="inp"
                name="email"
                type="email"
                placeholder="example@email.com"
                value={form.email}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ fontSize: 12, color: "#888", fontWeight: 500 }}>Mật khẩu</label>
                {tab === "login" && (
                  <span style={{ fontSize: 12, color: "#e50914", cursor: "pointer" }}>Quên mật khẩu?</span>
                )}
              </div>
              <div style={{ position: "relative" }}>
                <input
                  className="inp"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={tab === "register" ? "Tối thiểu 6 ký tự" : "Nhập mật khẩu"}
                  value={form.password}
                  onChange={handleChange}
                  required
                  style={{ ...inputStyle, paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "#555", fontSize: 14, padding: 2,
                  }}
                >{showPassword ? "🙈" : "👁"}</button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: "rgba(229,9,20,0.1)", border: "1px solid rgba(229,9,20,0.25)",
                borderRadius: 8, padding: "10px 14px", marginBottom: 16,
                color: "#ff6b6b", fontSize: 13, display: "flex", alignItems: "center", gap: 8,
              }}>
                <span>⚠</span> {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "13px 0",
                background: loading ? "#555" : "#e50914",
                color: "#fff", border: "none", borderRadius: 10,
                fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
                transition: "background 0.2s, transform 0.15s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#c40812"; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#e50914"; }}
            >
              {loading ? (
                <>
                  <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", animation: "spin .7s linear infinite" }} />
                  Đang xử lý...
                </>
              ) : tab === "login" ? "Đăng nhập" : "Tạo tài khoản"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", margin: "22px 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
            <span style={{ color: "#555", fontSize: 12, padding: "0 14px" }}>hoặc tiếp tục với</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
          </div>

          {/* Google */}
          <button
            onClick={() => authApi.loginWithGoogle()}
            style={{
              width: "100%", padding: "12px 0",
              background: "rgba(255,255,255,0.05)",
              color: "#f0f0f0",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M5.27 9.77A7.04 7.04 0 0 1 12 5c1.69 0 3.22.6 4.42 1.59L19.9 3.1A11.96 11.96 0 0 0 12 0C7.58 0 3.73 2.35 1.64 5.84l3.63 3.93Z"/>
              <path fill="#34A853" d="M16.04 18.01A7.02 7.02 0 0 1 12 19c-3.15 0-5.83-2.07-6.73-4.93l-3.65 3.9C3.73 21.66 7.57 24 12 24c3.3 0 6.25-1.14 8.55-3.01l-4.51-2.98Z"/>
              <path fill="#FBBC05" d="M5.27 14.07A7.09 7.09 0 0 1 4.95 12c0-.71.1-1.4.29-2.05L1.64 5.84A12.05 12.05 0 0 0 0 12c0 2.22.6 4.3 1.64 6.08l3.63-4.01Z"/>
              <path fill="#4285F4" d="M23.76 12.27c0-.78-.07-1.54-.2-2.27H12v4.3h6.6a5.65 5.65 0 0 1-2.46 3.7l4.51 2.98c2.63-2.44 4.11-6.03 4.11-8.71Z"/>
            </svg>
            Đăng nhập với Google
          </button>
        </div>

        {/* Footer note */}
        <p style={{ textAlign: "center", color: "#555", fontSize: 12, marginTop: 20 }}>
          Bằng cách đăng nhập, bạn đồng ý với{" "}
          <span style={{ color: "#e50914", cursor: "pointer" }}>Điều khoản dịch vụ</span>
          {" "}và{" "}
          <span style={{ color: "#e50914", cursor: "pointer" }}>Chính sách bảo mật</span>
        </p>
      </div>
    </div>
  );
}