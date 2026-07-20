import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const ROLES = [
  { value: "donor", label: "Donor" },
  { value: "patient", label: "Patient / Family" },
  { value: "hospital", label: "Hospital" },
  { value: "bloodbank", label: "Blood Bank" },
  { value: "ngo", label: "NGO" },
];

export default function Register() {
  const [params] = useSearchParams();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: params.get("role") || "donor",
    bloodGroup: "",
    city: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await register(form);
      navigate(`/dashboard/${user.role}`);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="font-display text-xl font-semibold text-ink block text-center mb-8">
          Rakt<span className="text-crimson">Setu</span>
        </Link>
        <div className="bg-white border border-ink/10 rounded-2xl p-8">
          <h1 className="font-display text-2xl font-semibold text-ink mb-1">Join the network</h1>
          <p className="text-sm text-ink/50 mb-6">Every account starts here — role-specific tools come next.</p>

          {error && <p className="text-sm text-crimson bg-crimson/10 rounded-lg px-3 py-2 mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-ink/70">I am a</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5 focus-ring bg-white"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-ink/70">Full name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5 focus-ring" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-ink/70">Email</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5 focus-ring" />
              </div>
              <div>
                <label className="text-sm font-medium text-ink/70">Phone</label>
                <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5 focus-ring" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-ink/70">Blood group</label>
                <select value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5 focus-ring bg-white">
                  <option value="">Select</option>
                  {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-ink/70">City</label>
                <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5 focus-ring" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-ink/70">Password</label>
              <input type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5 focus-ring" />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-crimson text-ivory font-semibold rounded-full py-3 hover:bg-crimson-dark transition-colors disabled:opacity-60">
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="text-sm text-ink/50 text-center mt-6">
            Already have an account? <Link to="/login" className="text-crimson font-semibold">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
