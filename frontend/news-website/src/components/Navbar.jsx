import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold hover:text-blue-200 transition"
          >
            📰 NewsHub
          </Link>

          {/* Right side: nav + auth */}
          <div className="flex items-center gap-6">
            {/* Primary links */}
            <div className="flex items-center gap-4">
              <Link to="/" className="px-2 py-1 hover:text-blue-200 transition">
                Home
              </Link>

              {isAuthenticated && (
                <Link
                  to="/bookmarks"
                  className="px-2 py-1 hover:text-blue-200 transition"
                >
                  Bookmarks
                </Link>
              )}

              {isAuthenticated && isAdmin && (
                <Link
                  to="/admin"
                  className="px-2 py-1 hover:text-blue-200 transition"
                >
                  Admin
                </Link>
              )}
            </div>

            {/* Auth controls */}
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm">
                  Welcome, <span className="font-semibold">{user.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-3 py-1 hover:text-blue-200 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded transition font-semibold mr-4"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
