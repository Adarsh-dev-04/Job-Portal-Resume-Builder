import { useEffect, useState } from "react";
import { API_BASE } from "../../config";

export default function AdminApplications() {
  const token = localStorage.getItem("token");
  const [applications, setApplications] = useState([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchApplications();
  }, [status]);

  async function fetchApplications() {
    try {
      const query = new URLSearchParams();
      if (status) query.append("status", status);

      const res = await fetch(`${API_BASE}/api/admin/applications?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to fetch applications");
        return;
      }

      setApplications(data);
    } catch {
      alert("Failed to fetch applications");
    }
  }

  function badge(status) {
    if (status === "pending") return "bg-yellow-100 text-yellow-700";
    if (status === "accepted") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-stone-100 text-stone-700";
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-black text-stone-900">Applications</h1>
        <p className="mt-2 text-sm text-stone-500">
          Monitor platform-wide candidate applications.
        </p>

        <div className="mt-5 max-w-xs">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {applications.map((app) => (
          <div
            key={app._id}
            className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="text-xl font-black text-stone-900">
                  {app.jobId?.title || "Deleted Job"}
                </h2>

                <p className="mt-2 text-sm text-stone-500">
                  {app.jobId?.company} • {app.jobId?.location}
                </p>

                <p className="mt-2 text-sm text-stone-600">
                  Applicant: <span className="font-semibold">{app.applicantId?.name || "Unknown"}</span>
                </p>

                <p className="text-sm text-stone-600">
                  Email: <span className="font-semibold">{app.applicantId?.email || "N/A"}</span>
                </p>

                <p className="text-sm text-stone-600">
                  Resume: <span className="font-semibold">{app.resumeId?.title || "Untitled Resume"}</span>
                </p>

                <p className="mt-2 text-xs text-stone-400">
                  Applied on: {new Date(app.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div>
                <span className={`rounded-full px-4 py-2 text-sm font-bold ${badge(app.status)}`}>
                  {app.status?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ))}

        {applications.length === 0 && (
          <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center text-stone-500 shadow-sm">
            No applications found.
          </div>
        )}
      </div>
    </div>
  );
}