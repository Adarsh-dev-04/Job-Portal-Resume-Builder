import { useMemo, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  LuMenu,
  LuX,
  LuUser,
  LuLogOut,
  LuLayoutDashboard,
  LuFileText,
  LuBriefcase,
  LuPlus,
  LuBuilding2,
} from "react-icons/lu";

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("name");
  const companyName = localStorage.getItem("companyName");
  const isLoggedIn = !!token;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const activeClass =
    "rounded-xl bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-600";
  const inactiveClass =
    "rounded-xl px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-100";

  const displayName = useMemo(() => {
    if (role === "employer") return companyName || userName || "Employer";
    return userName || "User";
  }, [role, companyName, userName]);

  function handleLogout() {
    localStorage.clear();
    window.location.href = "/";
  }

  function goToProfile() {
    setProfileOpen(false);
    setMobileOpen(false);

    if (role === "employer") {
      navigate("/employer/profile");
    } else {
      navigate("/profile");
    }
  }

  const navItems = [
    { to: "/", label: "Home", show: true },
    { to: "/jobs", label: "Jobs", show: true },    { to: "/companies", label: "Companies", show: true },    { to: "/resume", label: "Resume Builder", show: role !== "employer" },
    {
      to: role === "employer" ? "/employer-dashboard" : "/my-applications",
      label: "Dashboard",
      show: role!== "admin",
    },
    { to: "/post-job", label: "Post Job", show: role === "employer" },
    { to: "/admin", label: "Admin Panel", show: role === "admin" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-black text-orange-600"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-sm">
              <LuBriefcase size={18} />
            </span>
            <span>JobNexus</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 lg:flex">
            {navItems
              .filter((item) => item.show)
              .map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    isActive ? activeClass : inactiveClass
                  }
                >
                  {item.label}
                </NavLink>
              ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden items-center gap-3 lg:flex">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/signup"
                  className="rounded-2xl border border-orange-300 px-4 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-50"
                >
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="rounded-2xl bg-orange-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
                >
                  Login
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 transition hover:border-orange-300"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                    {(displayName || "U").charAt(0).toUpperCase()}
                  </span>

                  <div className="text-left">
                    <p className="max-w-[160px] truncate text-sm font-bold text-stone-900">
                      {displayName}
                    </p>
                    <p className="text-xs text-stone-500 capitalize">{role}</p>
                  </div>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-64 rounded-3xl border border-stone-200 bg-white p-3 shadow-xl">
                    <button
                      onClick={goToProfile}
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                    >
                      {role === "employer" ? (
                        <LuBuilding2 size={18} />
                      ) : (
                        <LuUser size={18} />
                      )}
                      {role === "employer" ? "Company Profile" : "My Profile"}
                    </button>

                    <Link
                      to={role === "employer" ? "/employer-dashboard" : "/my-applications"}
                      onClick={() => setProfileOpen(false)}
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                    >
                      <LuLayoutDashboard size={18} />
                      Dashboard
                    </Link>

                    {role !== "employer" && (
                      <Link
                        to="/resume"
                        onClick={() => setProfileOpen(false)}
                        className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                      >
                        <LuFileText size={18} />
                        Resume Builder
                      </Link>
                    )}

                    {role === "employer" && (
                      <Link
                        to="/post-job"
                        onClick={() => setProfileOpen(false)}
                        className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                      >
                        <LuPlus size={18} />
                        Post a Job
                      </Link>
                    )}

                    <div className="my-2 border-t border-stone-100" />

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <LuLogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-2xl border border-stone-200 p-2 text-stone-700 lg:hidden"
          >
            {mobileOpen ? <LuX size={22} /> : <LuMenu size={22} />}
          </button>
        </nav>

        {/* Mobile Panel */}
        {mobileOpen && (
          <div className="border-t border-stone-200 py-4 lg:hidden">
            <div className="space-y-2">
              {navItems
                .filter((item) => item.show)
                .map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `block ${isActive ? activeClass : inactiveClass}`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
            </div>

            <div className="mt-4 border-t border-stone-100 pt-4">
              {!isLoggedIn ? (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-2xl border border-orange-300 px-4 py-3 text-center text-sm font-semibold text-orange-600"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-2xl bg-orange-500 px-4 py-3 text-center text-sm font-bold text-white"
                  >
                    Login
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={goToProfile}
                    className="flex w-full items-center gap-3 rounded-2xl border border-stone-200 px-4 py-3 text-left"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 font-bold text-white">
                      {(displayName || "U").charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-stone-900">{displayName}</p>
                      <p className="text-xs capitalize text-stone-500">{role}</p>
                    </div>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600"
                  >
                    <LuLogOut size={18} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}