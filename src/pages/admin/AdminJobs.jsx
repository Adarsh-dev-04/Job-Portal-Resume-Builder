import { useEffect, useState } from "react";
import { API_BASE } from "../../config";
import {
  LuSearch,
  LuStar,
  LuClock3,
  LuShieldAlert,
  LuPower,
  LuTrash2,
} from "react-icons/lu";

export default function AdminJobs() {
  const token = localStorage.getItem("token");

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [approvalStatus, setApprovalStatus] = useState("");

  useEffect(() => {
    fetchJobs();
  }, [approvalStatus]);

  async function fetchJobs() {
    try {
      const query = new URLSearchParams();
      if (search) query.append("search", search);
      if (approvalStatus) query.append("approvalStatus", approvalStatus);

      const res = await fetch(`${API_BASE}/api/admin/jobs?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to fetch jobs");
        return;
      }

      setJobs(data);
    } catch {
      alert("Failed to fetch jobs");
    }
  }

  async function updateJob(id, payload) {
    try {
      const res = await fetch(`${API_BASE}/api/admin/jobs/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to update job");
        return;
      }

      fetchJobs();
    } catch {
      alert("Failed to update job");
    }
  }

  async function deleteJob(id) {
    const ok = window.confirm("Delete this job permanently?");
    if (!ok) return;

    try {
      const res = await fetch(`${API_BASE}/api/admin/jobs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to delete job");
        return;
      }

      fetchJobs();
    } catch {
      alert("Failed to delete job");
    }
  }

  function badgeColor(status) {
    if (status === "approved") return "bg-green-100 text-green-700";
    if (status === "pending") return "bg-yellow-100 text-yellow-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-stone-100 text-stone-700";
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-black text-stone-900">Manage Jobs</h1>
        <p className="mt-2 text-sm text-stone-500">
          Approve, reject, feature, flag, and moderate job listings.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="relative">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, company, location..."
              className="w-full rounded-2xl border border-stone-200 px-11 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            />
          </div>

          <select
            value={approvalStatus}
            onChange={(e) => setApprovalStatus(e.target.value)}
            className="rounded-2xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          >
            <option value="">All Approval Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            onClick={fetchJobs}
            className="rounded-2xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600"
          >
            Search
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-black text-stone-900">{job.title}</h2>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${badgeColor(job.approvalStatus)}`}>
                    {job.approvalStatus}
                  </span>

                  {job.isFeatured && (
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-bold text-yellow-700">
                      Featured
                    </span>
                  )}

                  {job.isUrgent && (
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                      Urgent
                    </span>
                  )}

                  {job.isFlagged && (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                      Flagged
                    </span>
                  )}

                  {!job.isActive && (
                    <span className="rounded-full bg-stone-200 px-3 py-1 text-xs font-bold text-stone-700">
                      Inactive
                    </span>
                  )}
                </div>

                <p className="mt-2 text-sm text-stone-500">
                  {job.company} • {job.location} • {job.type}
                </p>

                {job.employerId && (
                  <p className="mt-1 text-sm text-stone-600">
                    Employer:{" "}
                    <span className="font-semibold">
                      {job.employerId.companyName || job.employerId.name}
                    </span>
                    {job.employerId.isVerified && (
                      <span className="ml-2 rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                        Verified
                      </span>
                    )}
                  </p>
                )}

                <p className="mt-3 line-clamp-3 text-sm text-stone-600">
                  {job.description}
                </p>

                {job.rejectionReason && (
                  <p className="mt-3 rounded-2xl bg-red-50 p-3 text-sm text-red-700">
                    <span className="font-bold">Rejection reason:</span> {job.rejectionReason}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2 xl:max-w-[420px]">
                <button
                  onClick={() => updateJob(job._id, { approvalStatus: "approved", rejectionReason: "" })}
                  className="rounded-2xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-bold text-green-700 hover:bg-green-100"
                >
                  Approve
                </button>

                <button
                  onClick={() => {
                    const reason = prompt("Enter rejection reason (optional):") || "";
                    updateJob(job._id, {
                      approvalStatus: "rejected",
                      rejectionReason: reason,
                    });
                  }}
                  className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-100"
                >
                  Reject
                </button>

                <button
                  onClick={() => updateJob(job._id, { approvalStatus: "pending" })}
                  className="inline-flex items-center gap-2 rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-2 text-sm font-bold text-yellow-700 hover:bg-yellow-100"
                >
                  <LuClock3 size={16} />
                  Pending
                </button>

                <button
                  onClick={() => updateJob(job._id, { isFeatured: !job.isFeatured })}
                  className="inline-flex items-center gap-2 rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-2 text-sm font-bold text-yellow-700 hover:bg-yellow-100"
                >
                  <LuStar size={16} />
                  {job.isFeatured ? "Unfeature" : "Feature"}
                </button>

                <button
                  onClick={() => updateJob(job._id, { isFlagged: !job.isFlagged })}
                  className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-100"
                >
                  <LuShieldAlert size={16} />
                  {job.isFlagged ? "Unflag" : "Flag"}
                </button>

                <button
                  onClick={() => updateJob(job._id, { isActive: !job.isActive })}
                  className="inline-flex items-center gap-2 rounded-2xl border border-stone-200 bg-stone-100 px-4 py-2 text-sm font-bold text-stone-700 hover:bg-stone-200"
                >
                  <LuPower size={16} />
                  {job.isActive ? "Deactivate" : "Activate"}
                </button>

                <button
                  onClick={() => deleteJob(job._id)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
                >
                  <LuTrash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {jobs.length === 0 && (
          <div className="rounded-3xl border border-stone-200 bg-white p-10 text-center text-stone-500 shadow-sm">
            No jobs found.
          </div>
        )}
      </div>
    </div>
  );
}