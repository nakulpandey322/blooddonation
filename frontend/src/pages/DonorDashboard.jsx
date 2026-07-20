import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

export default function DonorDashboard() {
  const { user } = useAuth();
  const [available, setAvailable] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    api.get("/donors/leaderboard").then(({ data }) => setLeaderboard(data.leaderboard)).catch(() => {});
  }, []);

  const toggleAvailability = async () => {
    setToggling(true);
    try {
      const { data } = await api.patch("/donors/availability");
      setAvailable(data.isAvailable);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="font-display text-3xl font-semibold text-ink mb-1">Welcome, {user?.name}</h1>
        <p className="text-ink/50 mb-8">{user?.bloodGroup} · {user?.city}</p>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border border-ink/10 rounded-2xl p-6">
            <p className="text-sm text-ink/50 mb-1">Availability</p>
            <div className="flex items-center justify-between mt-2">
              <span className={`text-sm font-semibold ${available ? "text-pulse" : "text-ink/40"}`}>
                {available ? "Available to donate" : "Not available"}
              </span>
              <button
                onClick={toggleAvailability}
                disabled={toggling}
                className={`w-12 h-7 rounded-full transition-colors relative focus-ring ${available ? "bg-pulse" : "bg-ink/20"}`}
              >
                <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${available ? "translate-x-6" : "translate-x-1"}`} />
              </button>
            </div>
          </div>

          <div className="bg-white border border-ink/10 rounded-2xl p-6">
            <p className="text-sm text-ink/50 mb-1">Reward points</p>
            <p className="font-display text-3xl font-semibold text-crimson">{user?.rewardPoints ?? 0}</p>
          </div>

          <div className="bg-white border border-ink/10 rounded-2xl p-6">
            <p className="text-sm text-ink/50 mb-1">Verification status</p>
            <p className={`font-semibold ${user?.isVerified ? "text-pulse" : "text-amber"}`}>
              {user?.isVerified ? "Verified" : "Pending verification"}
            </p>
          </div>
        </div>

        <h2 className="font-display text-xl font-semibold text-ink mb-4">Top donors this month</h2>
        <div className="bg-white border border-ink/10 rounded-2xl divide-y divide-ink/10">
          {leaderboard.length === 0 && <p className="p-6 text-sm text-ink/40">No donors yet.</p>}
          {leaderboard.map((d, i) => (
            <div key={d._id} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-ink/30 w-6">{i + 1}</span>
                <div>
                  <p className="font-medium text-ink">{d.name}</p>
                  <p className="text-xs text-ink/50">{d.bloodGroup} · {d.city}</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-crimson">{d.rewardPoints} pts</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
