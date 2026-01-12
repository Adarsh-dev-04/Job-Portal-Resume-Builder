import React, { useState, useRef, useEffect } from "react";
import { FaCircleUser } from "react-icons/fa6";
import ResumeForm from "./components/ResumeForm";
import ResumePreview from "./components/ResumePreview";
import "./App.css";
import PDFDownloadButton from "./components/PDFDownloadButton.jsx";
import Login from "./components/Modals/Login.jsx";
import Signup from "./components/Modals/Signup.jsx";
import { details } from "./Data.js";
import { API_BASE } from "./config.js";
import toast from "react-hot-toast";
import UserInfoModal from "./components/Modals/UserInfoModal.jsx";

const App = () => {
  const emptyResume = {
    name: "",
    email: "",
    phone: "",
    linkedIn: "",
    github: "",
    address: "",
    education: [],
    experience: [],
    projects: [],
    skills: "",
    languages: [],
    certifications: [],
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState(
    localStorage.getItem("name") || "GuestUser"
  );
  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("email") || ""
  );

  const [resumeList, setResumeList] = useState([]);
  const [formData, setFormData] = useState(details);

  const [currentResumeId, setCurrentResumeId] = useState(null);
  const [currentTitle, setCurrentTitle] = useState("");

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserInfoModal, setShowUserInfoModal] = useState(false);
  const [showUpdateInfoModal, setShowUpdateInfoModal] = useState(false);

  const [showRenameInput, setShowRenameInput] = useState(false);

  const componentRef = useRef();

  const isLoggedIn = !!localStorage.getItem("token");

  const [showSignup, setShowSignup] = useState(false);

  /* ================= LOAD RESUMES ================= */

  async function loadResumeList() {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await fetch(`${API_BASE}/api/resumes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setResumeList(Array.isArray(data) ? data : []);
  }

  async function loadSingleResume(resumeId) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE}/api/resume/${resumeId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const resume = await res.json();

    if (resume) {
      setCurrentResumeId(resume._id);
      setCurrentTitle(resume.title || "");
      setFormData({
        ...emptyResume,
        ...resume.data,
      });
      localStorage.setItem("activeResumeId", resumeId);
    }
  }

  /* ================= RENAME & DELETE ================= */

  async function renameResume(resumeId, newTitle) {
    await fetch(`${API_BASE}/api/resume/${resumeId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ title: newTitle }),
    });

    if (resumeId === currentResumeId) {
      setCurrentTitle(newTitle);
    }

    loadResumeList();
  }
  async function deleteAccount() {
    const ok = window.confirm("Delete your account permanently?");
    if (!ok) return;

    await fetch(`${API_BASE}/api/deleteAccount`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    window.location.reload();
    toast.success("Account deleted successfully");
  }

  async function deleteResume(resumeId) {
    const ok = window.confirm("Delete this resume permanently?");
    if (!ok) return;

    await fetch(`${API_BASE}/api/resume/${resumeId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (resumeId === currentResumeId) {
      setFormData(emptyResume);
      setCurrentResumeId(null);
      setCurrentTitle("");
      localStorage.removeItem("activeResumeId");
    }

    loadResumeList();
  }

  // useEffect(() => {
  //   if (isLoggedIn) {
  //     loadResumeList();
  //   }
  // }, [isLoggedIn]);
  useEffect(() => {
    if (isLoggedIn) {
      loadResumeList();
    }
  }, [isLoggedIn]);

  function clearformData() {
    setFormData(emptyResume);
  }
  /* ================= AUTH ================= */

  /* ================= UI (UNCHANGED STYLING) ================= */

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-[0px]min-h-screen bg-orange-200">
        <header className="bg-[#F26522] shadow-lg mb-2">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold">
                Resume Builder
              </h1>
              <div className="flex gap-4">
                {/* PDF Download button */}
                <div>
                  {formData.name && <PDFDownloadButton formData={formData} />}
                  {!formData.name && (
                    <button
                      className="inline-block px-4 py-2 border-2 border-white bg-white text-orange-400 font-semibold rounded-lg transition-colors duration-200 text-sm sm:text-base opacity-50 cursor-not-allowed"
                      disabled
                    >
                      Download PDF
                    </button>
                  )}
                </div>
                {/* New Resume button */}
                <div>
                  <button
                    onClick={() => {
                      setFormData(details);
                      setCurrentResumeId(null);
                      setCurrentTitle("");
                    }}
                    className="inline-block px-4 py-2 border-2 border-white bg-white text-orange-400 font-semibold rounded-lg text-sm sm:text-base hover:bg-orange-500/50 hover:text-white hover:cursor-pointer transition-colors duration-200"
                  >
                    + New Resume
                  </button>
                </div>
                {/* Login and Logout button */}
                <div className="flex items-center gap-3">
                  {!isLoggedIn ? (
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="inline-block px-4 py-2 border-2 border-white bg-white text-orange-400 font-semibold rounded-lg text-sm sm:text-base hover:bg-orange-500/50 hover:text-white hover:cursor-pointer transition-colors duration-200"
                    >
                      Login to Save
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("userId");
                        localStorage.removeItem("name");
                        window.location.reload();
                      }}
                      className="inline-block px-4 py-2 border-2 border-white bg-white text-orange-400 font-semibold rounded-lg text-sm sm:text-base hover:bg-orange-500/50 hover:text-white hover:cursor-pointer transition-colors duration-200"
                    >
                      Logout
                    </button>
                  )}
                </div>
                {/* Dropdown for existing resumes */}
                {isLoggedIn && (
                  <div>
                    {/* Dropdown button */}
                    <button
                      onClick={() => setIsDropdownOpen((prev) => !prev)}
                      className="inline-block px-4 py-2 border-2 hover:text-white border-white bg-white hover:bg-orange-500/50 active:text-gray-800 hover:cursor-pointer text-orange-400 font-semibold rounded-lg transition-colors duration-200 text-sm sm:text-base"
                    >
                      My Resumes ▾
                    </button>
                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute right-20 top-15 w-64 bg-white shadow-xl rounded z-50 border">
                        <div className="max-h-64 overflow-y-auto">
                          {resumeList.map((resume) => (
                            <div
                              key={resume._id}
                              className="px-4 py-2 border-b hover:bg-gray-100"
                            >
                              {showRenameInput ? (
                                <input
                                  type="text"
                                  defaultValue={
                                    resume.title || "Untitled Resume"
                                  }
                                  onBlur={(e) => {
                                    renameResume(resume._id, e.target.value);
                                    setShowRenameInput(false);
                                  }}
                                  className="w-full border px-2 py-1 rounded"
                                />
                              ) : (
                                <button
                                  onClick={() => {
                                    loadSingleResume(resume._id);
                                    setIsDropdownOpen(false);
                                  }}
                                  className="block w-full text-left font-medium"
                                >
                                  {resume.title || "Untitled Resume"}
                                </button>
                              )}

                              <div className="flex gap-3 text-sm mt-1">
                                <button
                                  onClick={() =>
                                    setShowRenameInput((prev) => !prev)
                                  }
                                  className="text-blue-600"
                                >
                                  {showRenameInput ? "Save" : "Rename"}
                                </button>
                                <button
                                  onClick={() => deleteResume(resume._id)}
                                  className="text-red-600"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/*user info*/}
                <div
                  className="text-white font-medium text-sm sm:text-base flex cursor-pointer items-center"
                  onClick={() => setShowUserInfoModal(true)}
                >
                  <FaCircleUser className="inline mr-2 text-4xl" />
                  <p>{userName || "GuestUser"}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="py-6">
          <div className="mx-2 flex flex-col xl:flex-row gap-6">
            <div className="w-full xl:w-1/2">
              <div className="bg-[#FFF9F5] rounded-xl shadow-2xl p-2">
                <div className="p-4 sm:p-6 lg:p-8 max-h-[80vh] overflow-y-auto">
                  <ResumeForm
                    formData={formData}
                    setFormData={setFormData}
                    currentResumeId={currentResumeId}
                    currentTitle={currentTitle}
                    loadResumeList={loadResumeList}
                    clearformData={clearformData}
                  />
                </div>
              </div>
            </div>

            <div className="w-full xl:w-1/2">
              <div className="bg-white rounded-xl shadow-2xl p-2">
                <div
                  ref={componentRef}
                  className="p-4 sm:p-6 lg:p-8 max-h-[80vh] overflow-y-auto"
                >
                  <ResumePreview formData={formData} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      {showLoginModal && (
        <Login
          onLogin={(name) => {
            setUserName(name);
            setShowLoginModal(false);
            loadResumeList();
          }}
          onSwitchToSignup={() => {
            setShowLoginModal(false);
            setShowSignup(true);
          }}
          setShowLoginModal={setShowLoginModal}
        />
      )}
      {showSignup && (
        <Signup
          onSignup={() => {
            setShowSignup(false);
            setShowLoginModal(true);
          }}
          onSwitchToLogin={() => {
            setShowSignup(false);
            setShowLoginModal(true);
          }}
          setShowSignup={setShowSignup}
        />
      )}
      {showUserInfoModal && (
        <UserInfoModal
          setShowUserInfoModal={setShowUserInfoModal}
          deleteResume={deleteResume}
          deleteAccount={deleteAccount}
          setShowUpdateInfoModal={setShowUpdateInfoModal}
          userName={userName}
          userEmail={userEmail}
          isLoggedIn={isLoggedIn}
        />
      )}
    </div>
  );
};

export default App;
