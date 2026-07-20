import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const LABELS = {
  hospital: "Hospital dashboard",
  bloodbank: "Blood bank dashboard",
  ngo: "NGO dashboard",
  admin: "Admin dashboard",
};

export default function GenericDashboard() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="font-display text-3xl font-semibold text-ink mb-2">{LABELS[user?.role] || "Dashboard"}</h1>
        <p className="text-ink/50 mb-8">Welcome, {user?.name}.</p>
        <div className="bg-white border border-ink/10 rounded-2xl p-8">
          <p className="text-ink/60 text-sm leading-relaxed">
            This role's dashboard (inventory management, verification queue, campaign tools, analytics)
            is the next module to build on top of this working core. The API layer already supports
            role-based access — this is the shell ready for those features.
          </p>
        </div>
      </main>
    </div>
  );
}
