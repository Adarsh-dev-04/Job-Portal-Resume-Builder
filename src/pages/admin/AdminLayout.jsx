import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuUsers,
  LuBriefcaseBusiness,
  LuClipboardList,
  LuShield,
  LuLogOut,
} from "react-icons/lu";

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: "Dashboard", path: "/admin", icon: <LuLayoutDashboard size={18} /> },
    { label: "Users", path: "/admin/users", icon: <LuUsers size={18} /> },
    { label: "Jobs", path: "/admin/jobs", icon: <LuBriefcaseBusiness size={18} /> },
    { label: "Applications", path: "/admin/applications", icon: <LuClipboardList size={18} /> },
  ];

  function logout() {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          {/* Sidebar */}
          <aside className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:h-fit">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                <LuShield size={22} />
              </div>
              <div>
                <h2 className="text-lg font-black text-stone-900">Admin Panel</h2>
                <p className="text-xs text-stone-500">Platform controls</p>
              </div>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-orange-500 text-white"
                        : "text-stone-700 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <button
              onClick={logout}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600 transition hover:bg-red-100"
            >
              <LuLogOut size={16} />
              Logout
            </button>
          </aside>

          {/* Content */}
          <section>
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
}