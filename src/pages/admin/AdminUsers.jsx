import { useEffect, useState } from "react";
import { API_BASE } from "../../config";
import { LuSearch, LuTrash2, LuBadgeCheck, LuBan, LuShield } from "react-icons/lu";

export default function AdminUsers() {
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [role]);

  async function fetchUsers() {
    try {
      const query = new URLSearchParams();
      if (role) query.append("role", role);
      if (search) query.append("search", search);

      const res = await fetch(`${API_BASE}/api/admin/users?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to fetch users");
        return;
      }

      setUsers(data);
    } catch {
      alert("Failed to fetch users");
    }
  }

  async function updateUser(id, payload) {
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to update user");
        return;
      }

      fetchUsers();
    } catch {
      alert("Failed to update user");
    }
  }

  async function deleteUser(id) {
    const ok = window.confirm("Delete this user?");
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed to delete user");
        return;
      }

      fetchUsers();
    } catch {
      alert("Failed to delete user");
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-black text-stone-900">Manage Users</h1>
        <p className="mt-2 text-sm text-stone-500">
          Verify employers, suspend suspicious accounts, and manage roles.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="relative">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, company..."
              className="w-full rounded-2xl border border-stone-200 px-11 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          >
            <option value="">All Roles</option>
            <option value="candidate">Candidate</option>
            <option value="employer">Employer</option>
            <option value="admin">Admin</option>
          </select>

          <button
            onClick={fetchUsers}
            className="rounded-2xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600"
          >
            Search
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-black text-stone-900">{user.name}</h2>
                  <span className="rounded-full bg-stone-200 px-3 py-1 text-xs font-bold text-stone-700">
                    {user.role}
                  </span>
                  {user.isVerified && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                      Verified
                    </span>
                  )}
                  {user.isSuspended && (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                      Suspended
                    </span>
                  )}
                </div>

                <p className="mt-2 text-sm text-stone-500">{user.email}</p>

                {user.companyName && (
                  <p className="mt-1 text-sm text-stone-600">
                    Company: <span className="font-semibold">{user.companyName}</span>
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {user.role === "employer" && (
                  <button
                    onClick={() => updateUser(user._id, { isVerified: !user.isVerified })}
                    className="inline-flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-bold text-green-700 hover:bg-green-100"
                  >
                    <LuBadgeCheck size={16} />
                    {user.isVerified ? "Unverify" : "Verify"}
                  </button>
                )}

                <button
                  onClick={() => updateUser(user._id, { isSuspended: !user.isSuspended })}
                  className="inline-flex items-center gap-2 rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-2 text-sm font-bold text-yellow-700 hover:bg-yellow-100"
                >
                  <LuBan size={16} />
                  {user.isSuspended ? "Unsuspend" : "Suspend"}
                </button>

                {user.role !== "admin" && (
                  <button
                    onClick={() => updateUser(user._id, { role: "admin" })}
                    className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100"
                  >
                    <LuShield size={16} />
                    Make Admin
                  </button>
                )}

                <button
                  onClick={() => deleteUser(user._id)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
                >
                  <LuTrash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center text-stone-500 shadow-sm">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
}