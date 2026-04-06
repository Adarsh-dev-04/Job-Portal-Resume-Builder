import { useEffect, useState } from "react";
import { API_BASE } from "../config";
import {
  LuBuilding2,
  LuMail,
  LuGlobe,
  LuUsers,
  LuMapPin,
  LuSave,
  LuLoaderCircle,
  LuTriangleAlert,
  LuCheck,
} from "react-icons/lu";
import toast from "react-hot-toast";

export default function EmployerProfile() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [form, setForm] = useState({
    name: "",
    email: "",
    companyName: "",
    companyWebsite: "",
    industry: "",
    companySize: "1-10",
    companyCity: "",
    companyDescription: "",
    hiringFor: [],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const hiringOptions = ["Engineering", "Design", "Marketing", "Sales", "Operations", "HR", "Finance"];
  const industrySamples = ["Technology", "Finance", "Healthcare", "Retail", "Manufacturing", "Education"];

  useEffect(() => {
    if (role !== "employer") return;
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
        toast.error(data?.message || "Failed to load profile");
        return;
      }

      setForm({
        name: data.name || "",
        email: data.email || "",
        companyName: data.companyName || "",
        companyWebsite: data.companyWebsite || "",
        industry: data.industry || "",
        companySize: data.companySize || "1-10",
        companyCity: data.companyCity || "",
        companyDescription: data.companyDescription || "",
        hiringFor: Array.isArray(data.hiringFor) ? data.hiringFor : [],
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function toggleHiringFor(value) {
    setForm((prev) => {
      const current = prev.hiringFor || [];
      const exists = current.includes(value);
      return {
        ...prev,
        hiringFor: exists ? current.filter((x) => x !== value) : [...current, value],
      };
    });
  }

  async function handleSave() {
    if (!form.companyName.trim()) {
      toast.error("Company name is required");
      return;
    }

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
        toast.error(data?.message || "Failed to update profile");
        return;
      }

      toast.success(data?.message || "Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  }

  if (role !== "employer") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100">
        <div className="rounded-3xl border border-red-200 bg-white p-8">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-red-50 p-3 text-red-600">
              <LuTriangleAlert size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900">Access Denied</h2>
              <p className="mt-2 text-sm text-stone-600">Only employers can access this page</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-stone-900">Company Profile</h1>
          <p className="mt-2 text-stone-600">Manage your company information and hiring preferences</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white px-5 py-4 shadow-sm">
              <LuLoaderCircle className="animate-spin text-orange-500" size={20} />
              <span className="text-sm font-semibold text-stone-700">Loading profile...</span>
            </div>
          </div>
        )}

        {/* Form */}
        {!loading && (
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
              <div className="border-b border-stone-200 bg-gradient-to-r from-orange-50 to-amber-50 px-8 py-6">
                <h2 className="text-xl font-bold text-stone-900">Contact Information</h2>
              </div>

              <div className="space-y-5 p-8">
                <div>
                  <label className="block text-sm font-semibold text-stone-700">
                    <LuUsers className="mb-1 inline" size={16} /> Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your Full Name"
                    className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-2 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700">
                    <LuMail className="mb-1 inline" size={16} /> Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    disabled
                    className="mt-2 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-500"
                  />
                  <p className="mt-1 text-xs text-stone-500">Email cannot be changed</p>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
              <div className="border-b border-stone-200 bg-gradient-to-r from-orange-50 to-amber-50 px-8 py-6">
                <h2 className="text-xl font-bold text-stone-900">Company Information</h2>
              </div>

              <div className="space-y-5 p-8">
                <div>
                  <label className="block text-sm font-semibold text-stone-700">
                    <LuBuilding2 className="mb-1 inline" size={16} /> Company Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder="Your Company Name"
                    className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-2 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700">
                    <LuGlobe className="mb-1 inline" size={16} /> Website
                  </label>
                  <input
                    type="text"
                    name="companyWebsite"
                    value={form.companyWebsite}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-2 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700">Industry</label>
                    <input
                      type="text"
                      name="industry"
                      value={form.industry}
                      onChange={handleChange}
                      placeholder="e.g., Technology"
                      list="industry-list"
                      className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-2 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                    />
                    <datalist id="industry-list">
                      {industrySamples.map((ind) => (
                        <option key={ind} value={ind} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700">Company Size</label>
                    <select
                      name="companySize"
                      value={form.companySize}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-2 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                    >
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="200+">200+ employees</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700">
                    <LuMapPin className="mb-1 inline" size={16} /> City
                  </label>
                  <input
                    type="text"
                    name="companyCity"
                    value={form.companyCity}
                    onChange={handleChange}
                    placeholder="Your Company City"
                    className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-2 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-stone-700">Company Description</label>
                  <textarea
                    name="companyDescription"
                    value={form.companyDescription}
                    onChange={handleChange}
                    placeholder="Tell candidates about your company..."
                    rows="5"
                    className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-2 text-sm outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-200"
                  />
                </div>
              </div>
            </div>

            {/* Hiring Preferences */}
            <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
              <div className="border-b border-stone-200 bg-gradient-to-r from-orange-50 to-amber-50 px-8 py-6">
                <h2 className="text-xl font-bold text-stone-900">Currently Hiring For</h2>
              </div>

              <div className="space-y-3 p-8">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {hiringOptions.map((option) => (
                    <label key={option} className="flex items-center gap-3 rounded-xl border border-stone-200 px-4 py-3 cursor-pointer hover:border-orange-300 hover:bg-orange-50">
                      <input
                        type="checkbox"
                        checked={form.hiringFor.includes(option)}
                        onChange={() => toggleHiringFor(option)}
                        className="h-4 w-4 rounded border-stone-300 text-orange-500 focus:ring-orange-500"
                      />
                      <span className="text-sm font-medium text-stone-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between rounded-3xl border border-stone-200 bg-white px-8 py-6 shadow-sm">
              <div>
                <p className="text-sm text-stone-600">
                  Make sure all information is accurate before saving
                </p>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:bg-stone-300"
              >
                {saving ? (
                  <>
                    <LuLoaderCircle className="animate-spin" size={18} />
                    Saving...
                  </>
                ) : (
                  <>
                    <LuSave size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
