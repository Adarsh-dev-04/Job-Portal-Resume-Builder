import React from "react";
import { useParams } from "react-router-dom";
import { API_BASE } from "../config";
import { useEffect, useState } from "react";
import ResumePreview from "../components/ResumePreview.jsx";

export default function ResumePreviewPage() {
  const { resumeId } = useParams();
  const [resumeData, setResumeData] = useState(null);
  const [error, setError] = useState(null);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    fetchResume();
  }, [resumeId]);

  async function fetchResume() {
    try {
      const token = localStorage.getItem("token");
      // Uses the new secure employer-authorized route — no impersonation needed
      const res = await fetch(`${API_BASE}/api/applications/resume/${resumeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Could not load resume.");
        return;
      }

      const data = await res.json();
      setResumeData(data);
    } catch (err) {
      setError("Failed to load resume. Please try again.");
    }
  }

  const handleZoomIn = () => setZoom((z) => Math.min(z + 10, 200));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 10, 50));

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg font-semibold mb-2">Access Denied</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full xl:w-1/2 mx-auto py-10">
      <button
        className="absolute right-7 top-10 bg-blue-100 hover:bg-blue-200 cursor-pointer text-blue-800 font-semibold px-3 py-1 rounded z-10"
        onClick={handleZoomIn}
      >
        +
      </button>
      <button
        className="absolute right-0 top-10 bg-blue-100 hover:bg-blue-200 cursor-pointer text-blue-800 font-semibold px-3 py-1 rounded z-10"
        onClick={handleZoomOut}
      >
        -
      </button>
      <div
        className="bg-white rounded-xl shadow-2xl p-2"
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: "top center",
          transition: "transform 0.2s ease",
        }}
      >
        <div className="p-4 sm:p-6 lg:p-8">
          {resumeData ? (
            <ResumePreview formData={resumeData.data} />
          ) : (
            <p className="text-center text-gray-400 py-10">Loading resume...</p>
          )}
        </div>
      </div>
    </div>
  );
}

