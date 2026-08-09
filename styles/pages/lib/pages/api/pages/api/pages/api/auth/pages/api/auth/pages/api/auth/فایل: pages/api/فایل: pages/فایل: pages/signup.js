import { useState } from "react";
import { useRouter } from "next/router";
import { Trophy } from "lucide-react";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "خطایی پیش اومد");
      return;
    }
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    router.push("/");
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0B1220" }}>
      <div style={{ width: 340, background: "#131B2E", border: "1px solid #1B2540", borderRadius: 16, padding: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28, justifyContent: "center" }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "#C8FF00", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Trophy size={18} color="#0B1220" />
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, color: "#E8ECF4" }}>STAKEHOUSE</span>
        </div>

        <h1 style={{ color: "#E8ECF4", fontSize: 18, fontFamily: "'Space Grotesk', sans-serif", marginBottom: 20, textAlign: "center" }}>ساخت حساب دمو</h1>

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: 12, color: "#7C8AA5", display: "block", marginBottom: 6 }}>نام</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", background: "#0F1626", border: "1px solid #253150", borderRadius: 8, padding: "10px 12px", color: "#E8ECF4", fontSize: 14, marginBottom: 16 }}
          />

          <label style={{ fontSize: 12, color: "#7C8AA5", display: "block", marginBottom: 6 }}>ایمیل</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", background: "#0F1626", border: "1px solid #253150", borderRadius: 8, padding: "10px 12px", color: "#E8ECF4", fontSize: 14, marginBottom: 16 }}
          />

          <label style={{ fontSize: 12, color: "#7C8AA5", display: "block", marginBottom: 6 }}>رمز عبور</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", background: "#0F1626", border: "1px solid #253150", borderRadius: 8, padding: "10px 12px", color: "#E8ECF4", fontSize: 14, marginBottom: 20 }}
          />

          {error && <div style={{ color: "#FF5C5C", fontSize: 13, marginBottom: 14 }}>{error}</div>}

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", background: "#C8FF00", color: "#0B1220", border: "none", borderRadius: 8, padding: "12px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
          >
            {loading ? "در حال ساخت حساب..." : "ثبت‌نام و دریافت ۲۵۰€ موجودی دمو"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#7C8AA5" }}>
          حساب داری؟{" "}
          <a href="/login" style={{ color: "#C8FF00", textDecoration: "none" }}>
            وارد شو
          </a>
        </div>
      </div>
    </div>
  );
  }
