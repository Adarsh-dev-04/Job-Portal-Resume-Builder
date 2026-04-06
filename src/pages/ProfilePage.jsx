import { useEffect, useMemo, useState } from "react";
import { API_BASE } from "../config";
import {
  LuUser,
  LuMail,
  LuPhone,
  LuMapPin,
  LuBriefcase,
  LuSave,
  LuTrash2,
  LuBadgeCheck,
  LuTriangleAlert,
  LuLoaderCircle,
} from "react-icons/lu";

export default function ProfilePage() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    headline: "",
    experience: "fresher",
    bio: "",
    preferredJobTypes: [],
    preferredWorkModes: [],
    preferredLocations: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  const jobTypeOptions = ["Full-Time", "Part-Time", "Internship", "Contract", "Freelance"];
  const workModeOptions = ["On-site", "Remote", "Hybrid"];

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    if (role === "employer") return;
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch(`${API_BASE}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok || !data) {
        showToast(data?.message || "Failed to load profile", "error");
        return;
      }

      setForm({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        city: data.city || "",
        headline: data.headline || "",
        experience: data.experience || "fresher",
        bio: data.bio || "",
        preferredJobTypes: Array.isArray(data.preferredJobTypes) ? data.preferredJobTypes : [],
        preferredWorkModes: Array.isArray(data.preferredWorkModes) ? data.preferredWorkModes : [],
        preferredLocations: data.preferredLocations || "",
      });
    } catch (error) {
      console.error(error);
      showToast("Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function toggleArrayField(field, value) {
    setForm((prev) => {
      const current = prev[field] || [];
      const exists = current.includes(value);

      return {
        ...prev,
        [field]: exists ? current.filter((v) => v !== value) : [...current, value],
      };
    });
  }

  const completion = useMemo(() => {
    const checks = [
      !!form.name,
      !!form.email,
      !!form.phone,
      !!form.city,
      !!form.headline,
      !!form.bio,
      form.preferredJobTypes.length > 0,
      form.preferredWorkModes.length > 0,
    ];

    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  }, [form]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`${API_BASE}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        showToast(data?.message || "Failed to update profile", "error");
        return;
      }

      localStorage.setItem("name", data.user?.name || form.name);
      showToast("Profile updated successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account?"
    );
    if (!confirmed) return;

    setDeleting(true);

    try {
      const res = await fetch(`${API_BASE}/api/users/me`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let data;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        showToast(data?.message || "Failed to delete account", "error");
        return;
      }

      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      showToast("Failed to delete account", "error");
    } finally {
      setDeleting(false);
    }
  }

  if (role === "employer") {
    return (
      <div className="min-h-screen bg-stone-100 p-6">
        <div className="mx-auto max-w-3xl rounded-3xl border border-stone-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-black text-stone-900">Wrong profile page</h1>
          <p className="mt-2 text-sm text-stone-600">
            Employer accounts should use the company profile page.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-5 py-4 shadow-sm">
          <LuLoaderCircle className="animate-spin text-orange-500" />
          <span className="text-sm font-semibold text-stone-700">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
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
              {toast.type === "success" ? <LuBadgeCheck /> : <LuTriangleAlert />}
              {toast.message}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-500 text-2xl font-black text-white">
                  {(form.name || "U").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-black text-stone-900">{form.name || "User"}</h2>
                  <p className="text-sm text-stone-500">Candidate Account</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold text-stone-700">Profile Completion</span>
                  <span className="font-bold text-orange-600">{completion}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                  <div
                    className="h-full rounded-full bg-orange-500"
                    style={{ width: `${completion}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-red-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-black text-stone-900">Danger Zone</h3>
              <p className="mt-2 text-xs leading-6 text-stone-500">
                Deleting your account may remove your profile, resumes, and application history.
              </p>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-70"
              >
                <LuTrash2 size={16} />
                {deleting ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </aside>

          {/* Main */}
          <form
            onSubmit={handleSave}
            className="space-y-6 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div>
              <h1 className="text-3xl font-black text-stone-900">My Profile</h1>
              <p className="mt-2 text-sm text-stone-500">
                Update your personal details, preferences, and complete missing information.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Full Name" icon={<LuUser />} name="name" value={form.name} onChange={handleChange} />
              <Field label="Email" icon={<LuMail />} name="email" value={form.email} onChange={handleChange} />
              <Field label="Phone" icon={<LuPhone />} name="phone" value={form.phone} onChange={handleChange} />
              <Field label="City" icon={<LuMapPin />} name="city" value={form.city} onChange={handleChange} />
            </div>

            <Field
              label="Professional Headline"
              icon={<LuBriefcase />}
              name="headline"
              value={form.headline}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer | React Enthusiast"
            />

            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">Experience</label>
              <select
                name="experience"
                value={form.experience}
                onChange={handleChange}
                className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              >
                <option value="fresher">Fresher</option>
                <option value="1-3">1–3 yrs</option>
                <option value="3-5">3–5 yrs</option>
                <option value="5+">5+ yrs</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows="5"
                placeholder="Write a short summary about yourself..."
                className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <PreferenceGroup
              title="Preferred Job Types"
              options={jobTypeOptions}
              values={form.preferredJobTypes}
              onToggle={(value) => toggleArrayField("preferredJobTypes", value)}
            />

            <PreferenceGroup
              title="Preferred Work Modes"
              options={workModeOptions}
              values={form.preferredWorkModes}
              onToggle={(value) => toggleArrayField("preferredWorkModes", value)}
            />

            <div>
              <label className="mb-2 block text-sm font-semibold text-stone-700">
                Preferred Locations
              </label>
              <input
                name="preferredLocations"
                value={form.preferredLocations}
                onChange={handleChange}
                placeholder="e.g. Bengaluru, Remote, Hyderabad"
                className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-3.5 text-sm font-bold text-white transition hover:bg-orange-600 disabled:opacity-70"
            >
              <LuSave size={18} />
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon, name, value, onChange, placeholder = "" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-stone-700">{label}</label>
      <div className="relative">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400">
          {icon}
        </div>
        <input
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 pl-11 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        />
      </div>
    </div>
  );
}

function PreferenceGroup({ title, options, values, onToggle }) {
  return (
    <div>
      <label className="mb-3 block text-sm font-semibold text-stone-700">{title}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = values.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => onToggle(option)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                active
                  ? "border-orange-300 bg-orange-50 text-orange-700"
                  : "border-stone-200 bg-white text-stone-600 hover:border-orange-200"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}