import { useEffect, useState } from "react";
import { API_BASE } from "../config";
import { IoMdListBox } from "react-icons/io";
import { FaUser } from "react-icons/fa6";
import { IoMdTime } from "react-icons/io";
import { FaRegCheckCircle } from "react-icons/fa";

export default function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [applicantions, setApplications] = useState({});
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);


  const token = localStorage.getItem("token");

  async function loadDashboardData() {
    const res = await fetch(
      `${API_BASE}/api/applications/employer/${localStorage.getItem("userId")}/jobs`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const data = await res.json();
    setJobs(data);
    const allApplicants = [];
    for (const job of data) {
      const res = await fetch(
        `${API_BASE}/api/applications/job/${job._id}/applicants`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const apps = await res.json();
      setApplications((prev) => ({ ...prev, [job._id]: apps.length }));
      allApplicants.push(...apps);

    }
    setApplicants(allApplicants);

    const statusCounts = { accepted: 0, pending: 0, rejected: 0 };
    for (const app of allApplicants) {
      if (app.status === "accepted") {
        statusCounts.accepted += 1;
      }
      if (app.status === "pending") {
        statusCounts.pending += 1;
      } else if (app.status === "rejected") {
        statusCounts.rejected += 1;
      }
    }
    setAcceptedCount(statusCounts.accepted);
    setPendingCount(statusCounts.pending);
    setRejectedCount(statusCounts.rejected);
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div className="px-10 py-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Employer Dashboard</h1>

      <div className="grid grid-cols-4 gap-6 mb-10">
        <div className="flex bg-white border border-gray-300 items-center rounded-xl p-4 text-center">
          <div className="mr-4 p-3 bg-orange-50 rounded">
            <IoMdListBox className="text-xl text-orange-500 " />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-left">{jobs.length}</h2>
            <p className="text-gray-500 text-xs">Active Jobs</p>
            <p className="text-green-700 font-semibold text-xs">+2 this week</p>
          </div>
        </div>
        <div className="flex bg-white border border-gray-300 items-center rounded-xl p-4 text-center">
          <div className="mr-4 p-3 bg-blue-50 rounded">
            <FaUser className="text-xl text-blue-400 " />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-left">
              {applicants.length}
            </h2>
            <p className="text-gray-500 text-xs">Total Applicants</p>
            <p className="text-green-700 font-semibold text-xs">+2 this week</p>
          </div>
        </div>
        <div className="flex bg-white border border-gray-300 items-center rounded-xl p-4 text-center">
          <div className="mr-4 p-3 bg-yellow-50 rounded">
            <IoMdTime className="text-xl text-yellow-500 " />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-left">{pendingCount}</h2>
            <p className="text-gray-500 text-xs">Jobs Awaiting Review</p>
            <p className="text-green-700 font-semibold text-xs">+2 this week</p>
          </div>
        </div>
        <div className="flex bg-white border border-gray-300 items-center rounded-xl p-4 text-center">
          <div className="mr-4 p-3 bg-purple-50 rounded">
            <FaRegCheckCircle className="text-xl text-purple-500 " />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-left">{acceptedCount}</h2>
            <p className="text-gray-500 text-xs">Hired this Month</p>
            <p className="text-green-700 font-semibold text-xs">+2 this week</p>
          </div>
        </div>
      </div>

      {/* Jobs */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Jobs</h2>
        <table className="w-full bg-white rounded-xl shadow divide-y divide-gray-200">
          <thead className="bg-gray-50 ">
            <tr className="divide-y divide-gray-200 h-12 w-full rounded-tl-lg rounded-tr-lg">
              <th className="text-left text-sm text-gray-500 p-4 font-normal">Title</th>
              <th className="text-left text-sm text-gray-500 p-4 font-normal">Location</th>
              <th className="text-left text-sm text-gray-500 p-4 font-normal">Type</th>
              <th className="text-left text-sm text-gray-500 p-4 font-normal">Status</th>
              <th className="text-left text-sm text-gray-500 p-4 font-normal">Posted On</th>

              <th className="text-left text-sm text-gray-500 font-normal">
                Applicants
              </th>
              <th className="text-center text-sm text-gray-500 p-4 pr-0 font-normal">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr
                key={job._id}
                className="border-b border-gray-200 hover:bg-gray-50 "
              >
                <td className="text-left text-sm text-black font-medium capitalize p-4">
                  {job.title}
                  <p className="text-gray-500 text-xs font-normal">{job.company}</p>
                </td>
                <td className="text-left text-sm text-gray-500 capitalize p-4">
                  {job.location}
                </td>
                <td className="text-left text-xs font-semibold capitalize p-4 pr-0">
                  <span className={job.type === "Full-Time" ? "bg-blue-50 py-1 px-2 text-blue-900 rounded-xl border border-blue-300" : job.type === "Part-Time" ? "bg-yellow-50 text-yellow-900 rounded-xl border border-yellow-300" : "bg-green-50 text-green-900 rounded-xl border border-green-300"}>
                    {job.type}
                  </span>
                </td>
                <td className="text-left text-xs text-gray-500 p-4 font-semibold pr-0">
                  <span className={job.isActive ? "bg-green-50 text-green-900 rounded-xl border border-green-300 py-1 px-2" : "bg-red-50 text-red-900 rounded-xl border border-red-400 py-1 px-2"}>
                    {job.isActive ? "Active" : "Closed"}
                  </span>
                </td>
                <td className="text-left text-xs text-yellow-500 p-4 font-semibold pr-0">
                  {new Date(job.createdAt).toLocaleDateString()}
                </td>

                <td className="text-left text-sm text-orange-500 font-semibold p-4 pr-0">
                  {applicantions[job._id] || 0}
                </td>
                <td className="text-left text-sm text-gray-500 p-4 pr-0 flex justify-center gap-2">
                  <a className="border-2 border-gray-200 text-black text-xs font-medium px-2 py-1 rounded-lg hover:bg-blue-200 hover:text-blue-700 hover:border-blue-300" href={`/employer-dashboard/applicants/${job._id}`}>
                    View
                  </a>
                  <button className="border-2 border-gray-200 text-black text-xs font-medium px-2 py-1 rounded-lg hover:bg-red-200 hover:text-red-700 hover:border-red-300">
                    Close
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
