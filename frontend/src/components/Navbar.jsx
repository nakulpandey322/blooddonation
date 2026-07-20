import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-ivory/90 backdrop-blur border-b border-ink/10">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight text-ink">
          Rakt<span className="text-crimson">Setu</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-ink/70">
          <a href="/#how-it-works" className="hover:text-ink transition-colors">How it works</a>
          <a href="/#network" className="hover:text-ink transition-colors">Network</a>
          <a href="/#faq" className="hover:text-ink transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to={`/dashboard/${user.role}`}
                className="text-sm font-semibold text-ink hover:text-crimson transition-colors focus-ring rounded px-2 py-1"
              >
                Dashboard
              </Link>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="text-sm font-semibold text-ink/50 hover:text-ink transition-colors focus-ring rounded px-2 py-1"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-ink hover:text-crimson transition-colors focus-ring rounded px-2 py-1">
                Log in
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold bg-crimson text-ivory rounded-full px-5 py-2.5 hover:bg-crimson-dark transition-colors focus-ring"
              >
                Join the network
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
