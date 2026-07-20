import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(`/dashboard/${user.role}`);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="font-display text-xl font-semibold text-ink block text-center mb-8">
          Rakt<span className="text-crimson">Setu</span>
        </Link>
        <div className="bg-white border border-ink/10 rounded-2xl p-8">
          <h1 className="font-display text-2xl font-semibold text-ink mb-1">Welcome back</h1>
          <p className="text-sm text-ink/50 mb-6">Log in to your account</p>

          {error && <p className="text-sm text-crimson bg-crimson/10 rounded-lg px-3 py-2 mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-ink/70">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5 focus-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink/70">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5 focus-ring"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-crimson text-ivory font-semibold rounded-full py-3 hover:bg-crimson-dark transition-colors disabled:opacity-60"
            >
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>

          <p className="text-sm text-ink/50 text-center mt-6">
            New here? <Link to="/register" className="text-crimson font-semibold">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
