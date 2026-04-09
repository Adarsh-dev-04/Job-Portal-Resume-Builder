import React from "react";
import { API_BASE } from "../config.js";
import { useParams, Link } from "react-router-dom";
import {
  LuMapPin,
  LuBuilding2,
  LuBriefcase,
  LuClock3,
  LuWallet,
  LuCalendarDays,
  LuFileText,
  LuCheck,
  LuTriangleAlert,
  LuBadgeInfo,
  LuSparkles,
  LuChevronRight,
  LuLoaderCircle,
} from "react-icons/lu";

const JobDetails = () => {
  const { jobId } = useParams();

  const [resumeList, setResumeList] = React.useState([]);
  const [selectedResume, setSelectedResume] = React.useState(
    localStorage.getItem("selectedResume") || ""
  );

  const [jobInfo, setJobInfo] = React.useState(null);
  const [loadingJob, setLoadingJob] = React.useState(true);
  const [loadingResumes, setLoadingResumes] = React.useState(true);
  const [applyLoading, setApplyLoading] = React.useState(false);
  const [pageError, setPageError] = React.useState("");
  const [toast, setToast] = React.useState(null);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function loadResumeList() {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoadingResumes(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/resumes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = [];
      }

      setResumeList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load resumes:", error);
      setResumeList([]);
    } finally {
      setLoadingResumes(false);
    }
  }

  async function loadJobInfo() {
    setLoadingJob(true);
    setPageError("");

    try {
      const res = await fetch(`${API_BASE}/api/jobs/${jobId}`);

      let data;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok || !data) {
        setPageError(data?.message || "Failed to load job details");
        setJobInfo(null);
        return;
      }

      setJobInfo(data);
    } catch (error) {
      console.error("Failed to load job:", error);
      setPageError("Something went wrong while loading this job");
      setJobInfo(null);
    } finally {
      setLoadingJob(false);
    }
  }

  React.useEffect(() => {
    loadResumeList();
    if (jobId) loadJobInfo();
  }, [jobId]);

  function formatSalary(job) {
    // New model support
    if (job.salaryMin || job.salaryMax) {
      const fmt = (v) => Number(v).toLocaleString("en-IN");
      const suffixMap = {
        monthly: "/month",
        yearly: "/year",
        project: "/project",
      };
      const suffix = suffixMap[job.salaryPeriod] || "/month";

      if (job.salaryMin && job.salaryMax) {
        return `₹${fmt(job.salaryMin)} – ₹${fmt(job.salaryMax)} ${suffix}`;
      }
      if (job.salaryMin) {
        return `₹${fmt(job.salaryMin)}+ ${suffix}`;
      }
      if (job.salaryMax) {
        return `Up to ₹${fmt(job.salaryMax)} ${suffix}`;
      }
    }

    // Old model fallback
    if (job.salary) {
      return `₹${Number(job.salary).toLocaleString("en-IN")}`;
    }

    return "Not disclosed";
  }

  function getWorkMode(job) {
    if (job.workMode) return job.workMode;
    if (typeof job.remote === "boolean") {
      return job.remote ? "Remote" : "On-site";
    }
    return "On-site";
  }

  function getRequirements(job) {
    if (Array.isArray(job.requirements)) return job.requirements;
    if (typeof job.requirements === "string") {
      return job.requirements
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  }

  function getBenefits(job) {
    return Array.isArray(job.benefits) ? job.benefits : [];
  }

  function formatPostedDate(date) {
    if (!date) return "Recently posted";

    const posted = new Date(date);
    const now = new Date();
    const diffMs = now - posted;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "Posted today";
    if (diffDays === 1) return "Posted 1 day ago";
    if (diffDays < 30) return `Posted ${diffDays} days ago`;

    return `Posted on ${posted.toLocaleDateString("en-IN")}`;
  }

  function formatDeadline(date) {
    if (!date) return "No deadline specified";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function statusBadge(status) {
    const value = status || "active";

    const styles = {
      active: "bg-green-50 text-green-700 border-green-200",
      paused: "bg-amber-50 text-amber-700 border-amber-200",
      closed: "bg-red-50 text-red-700 border-red-200",
    };

    return styles[value] || styles.active;
  }

  async function applyJob() {
    const token = localStorage.getItem("token");

    if (!token) {
      showToast("Please login to apply", "error");
      return;
    }

    if (role !== "candidate") {
      showToast("Only candidates can apply to jobs", "error");
      return;
    }

    const resumeId = selectedResume;
    const email = localStorage.getItem("email");
    const name = localStorage.getItem("name");

    if (!resumeId) {
      showToast("Please select a resume before applying", "error");
      return;
    }

    try {
      setApplyLoading(true);

      const res = await fetch(`${API_BASE}/api/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId,
          resumeId,
          applicantEmail: email,
          applicantName: name,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = { message: "Server returned an invalid response" };
      }

      if (!res.ok) {
        showToast(data.message || "Failed to apply", "error");
        return;
      }

      showToast(data.message || "Application submitted successfully!", "success");
    } catch (error) {
      console.error("Apply job error:", error);
      showToast("Something went wrong while applying", "error");
    } finally {
      setApplyLoading(false);
    }
  }

  const requirements = jobInfo ? getRequirements(jobInfo) : [];
  const benefits = jobInfo ? getBenefits(jobInfo) : [];
  const workMode = jobInfo ? getWorkMode(jobInfo) : "On-site";

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Toast */}
      {toast && (
        <div className="fixed right-4 top-4 z-50">
          <div
            className={`min-w-[260px] rounded-2xl border px-4 py-3 shadow-lg ${
              toast.type === "success"
                ? "border-green-200 bg-white text-green-700"
                : "border-red-200 bg-white text-red-700"
            }`}
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              {toast.type === "success" ? <LuCheck /> : <LuTriangleAlert />}
              {toast.message}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Loading */}
        {loadingJob && (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-5 py-4 shadow-sm">
              <LuLoaderCircle className="animate-spin text-orange-500" size={20} />
              <span className="text-sm font-semibold text-stone-700">
                Loading job details...
              </span>
            </div>
          </div>
        )}

        {/* Error */}
        {!loadingJob && pageError && (
          <div className="mx-auto max-w-2xl rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-red-50 p-3 text-red-600">
                <LuTriangleAlert size={22} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-stone-900">Unable to load job</h2>
                <p className="mt-2 text-sm text-stone-600">{pageError}</p>
                <button
                  onClick={loadJobInfo}
                  className="mt-4 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {!loadingJob && !pageError && jobInfo && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
            {/* Main content */}
            <div className="space-y-6">
              {/* Hero Card */}
              <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
                <div className="border-b border-stone-200 bg-gradient-to-r from-orange-50 to-amber-50 p-6">
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                          {jobInfo.type || "Full-Time"}
                        </span>

                        <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          {workMode}
                        </span>

                        {jobInfo.status && (
                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge(
                              jobInfo.status
                            )}`}
                          >
                            {jobInfo.status.charAt(0).toUpperCase() + jobInfo.status.slice(1)}
                          </span>
                        )}
                      </div>

                      <h1 className="text-2xl font-black text-stone-900 sm:text-3xl">
                        {jobInfo.title}
                      </h1>

                      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-stone-600">
                        <div className="flex items-center gap-2">
                          <LuBuilding2 className="text-stone-400" />
                          <Link
                            to={`/company-profile/${encodeURIComponent(jobInfo.employerId)}`}
                            className="font-medium transition hover:text-orange-600 hover:underline"
                          >
                            {jobInfo.company}
                          </Link>
                        </div>

                        <div className="flex items-center gap-2">
                          <LuMapPin className="text-stone-400" />
                          <span>{jobInfo.location}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <LuClock3 className="text-stone-400" />
                          <span>{formatPostedDate(jobInfo.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                        Salary
                      </p>
                      <p className="mt-1 text-lg font-extrabold text-stone-900">
                        {formatSalary(jobInfo)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4">
                  {[
                    {
                      icon: <LuBriefcase className="text-orange-500" />,
                      label: "Job Type",
                      value: jobInfo.type || "Not specified",
                    },
                    {
                      icon: <LuBadgeInfo className="text-orange-500" />,
                      label: "Work Mode",
                      value: workMode,
                    },
                    {
                      icon: <LuCalendarDays className="text-orange-500" />,
                      label: "Application Deadline",
                      value: formatDeadline(jobInfo.closingDate),
                    },
                    {
                      icon: <LuWallet className="text-orange-500" />,
                      label: "Vacancies",
                      value: `${jobInfo.vacancies || 1} opening${
                        Number(jobInfo.vacancies || 1) > 1 ? "s" : ""
                      }`,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-stone-200 bg-stone-50 p-4"
                    >
                      <div className="flex items-center gap-2 text-sm font-semibold text-stone-500">
                        {item.icon}
                        {item.label}
                      </div>
                      <p className="mt-2 text-sm font-bold text-stone-900">{item.value}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Description */}
              <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-black text-stone-900">About this role</h2>
                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-stone-700">
                  {jobInfo.description || "No description provided."}
                </p>
              </section>

              {/* Requirements */}
              <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-black text-stone-900">Required skills</h2>

                {requirements.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {requirements.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-stone-500">No skills listed.</p>
                )}

                {jobInfo.additionalRequirements && (
                  <div className="mt-5 rounded-2xl border border-stone-200 bg-stone-50 p-4">
                    <p className="text-sm font-semibold text-stone-800">
                      Additional requirements
                    </p>
                    <p className="mt-2 text-sm leading-7 text-stone-600">
                      {jobInfo.additionalRequirements}
                    </p>
                  </div>
                )}
              </section>

              {/* Benefits */}
              {benefits.length > 0 && (
                <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-2">
                    <LuSparkles className="text-orange-500" />
                    <h2 className="text-lg font-black text-stone-900">Perks & benefits</h2>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {benefits.map((benefit) => (
                      <div
                        key={benefit}
                        className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-3"
                      >
                        <div className="rounded-xl bg-green-50 p-2 text-green-600">
                          <LuCheck size={16} />
                        </div>
                        <span className="text-sm font-medium text-stone-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sticky apply card */}
            <aside className="space-y-6">
              <div className="sticky top-24 space-y-6">
                <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                  <h3 className="text-base font-black text-stone-900">Apply to this job</h3>
                  <p className="mt-1 text-sm text-stone-500">
                    Select a resume and submit your application.
                  </p>

                  <div className="mt-5 space-y-4">
                    {!token ? (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                        <p className="text-sm font-medium text-amber-800">
                          Please login as a candidate to apply.
                        </p>
                        <Link
                          to="/login"
                          className="mt-3 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600"
                        >
                          Login to continue
                          <LuChevronRight />
                        </Link>
                      </div>
                    ) : role !== "candidate" ? (
                      <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                        <p className="text-sm font-medium text-red-700">
                          Only candidate accounts can apply to jobs.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-stone-700">
                            Choose resume
                          </label>

                          <select
                            value={selectedResume}
                            onChange={(e) => {
                              setSelectedResume(e.target.value);
                              localStorage.setItem("selectedResume", e.target.value);
                            }}
                            className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                          >
                            <option value="">
                              {loadingResumes ? "Loading resumes..." : "Select resume"}
                            </option>
                            {resumeList.map((r) => (
                              <option key={r._id} value={r._id}>
                                {r.title}
                              </option>
                            ))}
                          </select>

                          {!loadingResumes && resumeList.length === 0 && (
                            <p className="mt-2 text-xs text-stone-500">
                              No resumes found. Create one first before applying.
                            </p>
                          )}
                        </div>

                        <button
                          onClick={applyJob}
                          disabled={applyLoading || resumeList.length === 0}
                          className="w-full rounded-2xl bg-orange-500 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {applyLoading ? "Applying..." : "Apply now"}
                        </button>
                      </>
                    )}
                  </div>
                </section>

                {/* Quick facts */}
                <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                  <h3 className="text-base font-black text-stone-900">Quick facts</h3>

                  <div className="mt-4 space-y-3">
                    {[
                      ["Company", jobInfo.company || "Not specified"],
                      ["Location", jobInfo.location || "Not specified"],
                      ["Work mode", workMode],
                      ["Salary", formatSalary(jobInfo)],
                      ["Job type", jobInfo.type || "Not specified"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="flex items-center justify-between border-b border-stone-100 pb-2 last:border-b-0"
                      >
                        <span className="text-sm text-stone-500">{label}</span>
                        <span className="max-w-[60%] text-right text-sm font-semibold text-stone-800">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;