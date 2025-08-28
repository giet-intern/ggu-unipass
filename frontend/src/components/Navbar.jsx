import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuth, logout } = useAuth(); // ✅ fixed name
  const loc = useLocation();
  const navigate = useNavigate();

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
        loc.pathname === to
          ? "bg-rose-100 text-rose-700"
          : "text-rose-700 hover:bg-rose-50"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur border-b border-rose-100">
      <nav className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-rose-700 font-semibold text-lg tracking-tight"
        >
          Hallticket Portal
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-4">
          {!isAuth ? ( // ✅ fixed
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-lg bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 transition"
            >
              Login
            </button>
          ) : (
            <>
              {navLink("/dashboard", "Dashboard")}
              <button
                onClick={logout}
                className="px-3 py-2 rounded-lg text-sm font-medium text-rose-700 hover:bg-rose-50 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
