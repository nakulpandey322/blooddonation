import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import PulseLine from "../components/PulseLine";

const STATS = [
  { value: "8 min", label: "Median time to first donor match" },
  { value: "42,000+", label: "Verified donors on the network" },
  { value: "96%", label: "Emergency requests fulfilled" },
  { value: "19", label: "Cities live across India" },
];

const STEPS = [
  { title: "Raise the alert", body: "A patient, family member, or hospital posts blood group, units needed, and hospital — takes under a minute." },
  { title: "We match by compatibility & distance", body: "The matching engine checks blood-type compatibility, donor eligibility, and proximity — then expands the search radius automatically until enough donors are found." },
  { title: "Donors respond in real time", body: "Nearby, eligible donors get notified instantly and can accept directly from their phone." },
  { title: "Track it to completion", body: "Everyone sees a live status timeline — matched, accepted, en route, donated — until the request closes." },
];

const FEATURES = [
  { title: "Compatibility-aware matching", body: "Built on real transfusion rules — an O- request never gets shown an incompatible donor." },
  { title: "Radius that expands itself", body: "If a 10km search comes up short, the network widens the net automatically instead of leaving a request stuck." },
  { title: "Verified donors only", body: "Every donor is identity and eligibility verified — including the 90-day rule since their last donation." },
  { title: "One dashboard per role", body: "Donors, patients, hospitals, blood banks, NGOs, and admins each get a workspace built for what they actually need to do." },
];

const FAQS = [
  { q: "How is a donor match decided?", a: "The engine filters by real blood-compatibility rules, then by verified availability, donation eligibility, and distance — closest eligible donors are notified first." },
  { q: "Is my location shared with everyone?", a: "No. Your approximate location is only used to calculate distance for matching. Exact addresses are never shown to other users." },
  { q: "What if no donor responds nearby?", a: "The search radius expands automatically in steps until enough compatible donors are reached, so a request is never left stranded at 10km." },
  { q: "Can hospitals post requests directly?", a: "Yes — verified hospitals and blood banks can raise requests and manage their own inventory from a dedicated dashboard." },
];

export default function Landing() {
  return (
    <div className="bg-ivory min-h-screen">
      <Navbar />

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-10 md:pt-24 md:pb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="uppercase tracking-[0.2em] text-xs font-semibold text-crimson mb-5">
              Live blood emergency network
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-semibold leading-[1.05] text-ink">
              The right blood group, found before the wait becomes the emergency.
            </h1>
            <p className="mt-6 text-lg text-ink/70 max-w-md">
              RaktSetu connects patients in crisis to verified, nearby donors in real time —
              matched by compatibility, distance, and availability, not luck.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/register?role=patient"
                className="bg-crimson text-ivory font-semibold rounded-full px-7 py-3.5 hover:bg-crimson-dark transition-colors focus-ring inline-flex items-center gap-2"
              >
                🚨 Raise an emergency request
              </Link>
              <Link
                to="/register?role=donor"
                className="border border-ink/20 text-ink font-semibold rounded-full px-7 py-3.5 hover:border-ink/50 transition-colors focus-ring"
              >
                Become a donor
              </Link>
            </div>
          </div>

          <div className="relative bg-ink rounded-3xl p-8 md:p-10 overflow-hidden">
            <p className="text-ivory/50 text-xs uppercase tracking-[0.2em] font-semibold mb-6">Network pulse — live</p>
            <PulseLine className="w-full h-16" stroke="#E8A33D" />
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div>
                <p className="font-display text-3xl text-ivory">O-</p>
                <p className="text-ivory/50 text-sm mt-1">2 units needed · AIIMS Delhi · matched in 6 min</p>
              </div>
              <div>
                <p className="font-display text-3xl text-ivory">B+</p>
                <p className="text-ivory/50 text-sm mt-1">1 unit needed · Fortis Bengaluru · donor en route</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="network" className="border-y border-ink/10 bg-white/50">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-display text-3xl md:text-4xl font-semibold text-crimson">{s.value}</p>
              <p className="text-sm text-ink/60 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink mb-12">How it works</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative">
              <p className="font-display text-5xl text-crimson/20 font-semibold mb-3">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="font-semibold text-ink mb-2">{step.title}</h3>
              <p className="text-sm text-ink/60 leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-ink py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-ivory mb-12">Built for the moment that can't wait</h2>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
            {FEATURES.map((f) => (
              <div key={f.title} className="border-t border-ivory/15 pt-6">
                <h3 className="font-semibold text-ivory mb-2">{f.title}</h3>
                <p className="text-sm text-ivory/60 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink mb-12">From the network</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { quote: "We needed AB- at 2am and had a donor confirmed before the ambulance arrived.", who: "Family member, Pune" },
            { quote: "As a donor I finally get notified only for requests I can actually help with.", who: "Donor, O+, Hyderabad" },
            { quote: "Our blood bank plugged in inventory tracking and cut emergency response time in half.", who: "Blood bank coordinator, Kolkata" },
          ].map((t) => (
            <blockquote key={t.who} className="bg-white/60 border border-ink/10 rounded-2xl p-6">
              <p className="text-ink/80 leading-relaxed">"{t.quote}"</p>
              <footer className="mt-4 text-sm font-semibold text-ink/50">{t.who}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink mb-10">Questions, answered</h2>
        <div className="divide-y divide-ink/10">
          {FAQS.map((f) => (
            <details key={f.q} className="py-5 group">
              <summary className="flex items-center justify-between cursor-pointer font-semibold text-ink list-none focus-ring rounded">
                {f.q}
                <span className="text-crimson group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-3 text-ink/60 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-ink/10 bg-white/50">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-display text-lg text-ink">Rakt<span className="text-crimson">Setu</span></p>
          <p className="text-sm text-ink/50">© {new Date().getFullYear()} RaktSetu. Built to close the gap between need and blood.</p>
        </div>
      </footer>
    </div>
  );
}
