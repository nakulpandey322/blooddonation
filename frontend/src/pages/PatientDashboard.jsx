import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/client";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const STATUS_STYLES = {
  open: "bg-amber/15 text-amber",
  matching: "bg-pulse/15 text-pulse",
  fulfilled: "bg-green-100 text-green-700",
  cancelled: "bg-ink/10 text-ink/40",
  expired: "bg-ink/10 text-ink/40",
};

export default function PatientDashboard() {
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [form, setForm] = useState({
    patientName: "", bloodGroup: "", unitsRequired: 1, hospitalName: "",
    doctorName: "", urgency: "normal", city: "", contactPhone: "", notes: "",
  });

  const loadRequests = () => {
    api.get("/requests").then(({ data }) => setRequests(data.requests)).catch(() => {});
  };

  useEffect(() => { loadRequests(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const { data } = await api.post("/requests", form);
      setResult({ ok: true, count: data.matchedDonorsCount });
      setShowForm(false);
      loadRequests();
    } catch (err) {
      setResult({ ok: false, message: err.response?.data?.message || "Failed to create request" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-semibold text-ink">Your requests</h1>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="bg-crimson text-ivory font-semibold rounded-full px-6 py-2.5 hover:bg-crimson-dark transition-colors"
          >
            {showForm ? "Cancel" : "+ New emergency request"}
          </button>
        </div>

        {result && (
          <p className={`mb-6 text-sm rounded-lg px-4 py-3 ${result.ok ? "bg-pulse/10 text-pulse" : "bg-crimson/10 text-crimson"}`}>
            {result.ok ? `Request created — ${result.count} compatible donor(s) matched nearby.` : result.message}
          </p>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white border border-ink/10 rounded-2xl p-6 mb-8 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-ink/70">Patient name</label>
                <input required value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5 focus-ring" />
              </div>
              <div>
                <label className="text-sm font-medium text-ink/70">Blood group</label>
                <select required value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5 focus-ring bg-white">
                  <option value="">Select</option>
                  {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-ink/70">Units required</label>
                <input type="number" min={1} required value={form.unitsRequired}
                  onChange={(e) => setForm({ ...form, unitsRequired: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5 focus-ring" />
              </div>
              <div>
                <label className="text-sm font-medium text-ink/70">Urgency</label>
                <select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5 focus-ring bg-white">
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-ink/70">Hospital name</label>
                <input required value={form.hospitalName} onChange={(e) => setForm({ ...form, hospitalName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5 focus-ring" />
              </div>
              <div>
                <label className="text-sm font-medium text-ink/70">Doctor name</label>
                <input value={form.doctorName} onChange={(e) => setForm({ ...form, doctorName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5 focus-ring" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-ink/70">City</label>
                <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5 focus-ring" />
              </div>
              <div>
                <label className="text-sm font-medium text-ink/70">Contact phone</label>
                <input required value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5 focus-ring" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-ink/70">Notes (optional)</label>
              <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2.5 focus-ring" rows={2} />
            </div>
            <button type="submit" disabled={submitting}
              className="w-full bg-crimson text-ivory font-semibold rounded-full py-3 hover:bg-crimson-dark transition-colors disabled:opacity-60">
              {submitting ? "Submitting…" : "Submit emergency request"}
            </button>
          </form>
        )}

        <div className="space-y-4">
          {requests.length === 0 && <p className="text-ink/40 text-sm">No requests yet.</p>}
          {requests.map((r) => (
            <div key={r._id} className="bg-white border border-ink/10 rounded-2xl p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-ink">{r.patientName} · {r.bloodGroup} · {r.unitsRequired} unit(s)</p>
                  <p className="text-sm text-ink/50 mt-1">{r.hospitalName}, {r.city}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[r.status] || ""}`}>
                  {r.status}
                </span>
              </div>
              <p className="text-sm text-ink/50 mt-3">{r.matchedDonors?.length || 0} donor(s) matched · radius {r.searchRadiusKm}km</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
