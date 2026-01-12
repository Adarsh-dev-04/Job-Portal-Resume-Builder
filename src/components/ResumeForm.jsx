import "../App.css";
import { useState } from "react";
import toast from "react-hot-toast";
import { API_BASE } from "../config.js";

export default function ResumeForm({
  formData,
  setFormData,
  currentResumeId,
  currentTitle,
  loadResumeList,
  clearformData,
}) {
  const [showNameModal, setShowNameModal] = useState(false);
  const [tempTitle, setTempTitle] = useState("");

  const inputBoxStyle =
    "w-full px-4 py-3 bg-white text-black rounded-lg focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 transition-all duration-200 placeholder-gray-400";
  const textareaStyle =
    "w-full px-4 py-3 bg-white text-black rounded-lg focus:border-green-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition-all duration-200 min-h-[100px] resize-vertical placeholder-gray-400";
  const labelStyle =
    "text-white flex flex-col gap-2 text-sm sm:text-base lg:text-lg font-medium";
  const sectionStyle =
    "flex flex-col gap-4 sm:gap-6 items-start  p-4 sm:p-6 rounded-lg w-full bg-[#F26522]";
  const buttonStyle =
    "bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-medium cursor-pointer transition-colors duration-200";

  function handleAddEducation() {
    const newEducation = {
      institution: "",
      year: "",
      degree: "",
      cgpa: "",
    };
    setFormData({
      ...formData,
      education: [...formData.education, newEducation],
    });
  }

  function handleRemoveEducation(index) {
    const updatedEducation = formData.education.filter((_, i) => i !== index);
    setFormData({ ...formData, education: updatedEducation });
  }

  function handleAddExperience() {
    const newExperience = {
      company: "",
      role: "",
      duration: "",
      responsibilities: [],
    };
    setFormData({
      ...formData,
      experience: [...formData.experience, newExperience],
    });
  }

  function handleRemoveExperience(index) {
    const updatedExperience = formData.experience.filter((_, i) => i !== index);
    setFormData({ ...formData, experience: updatedExperience });
  }

  function handleAddProject() {
    const newProject = {
      title: "",
      link: "",
      description: "",
      technologies: "",
    };
    setFormData({ ...formData, projects: [...formData.projects, newProject] });
  }

  function handleRemoveProject(index) {
    const updatedProjects = formData.projects.filter((_, i) => i !== index);
    setFormData({ ...formData, projects: updatedProjects });
  }

  function handleAddCertification() {
    const newCertification = {
      title: "",
      issuer: "",
      year: "",
      link: "",
    };
    setFormData({
      ...formData,
      certifications: [...formData.certifications, newCertification],
    });
  }

  function handleRemoveCertification(index) {
    const updatedCertifications = formData.certifications.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, certifications: updatedCertifications });
  }

  // async function saveResume() {
  //   const token = localStorage.getItem("token"); // ✅ DEFINE TOKEN

  //   if (!token) {
  //     alert("You are not logged in");
  //     return;
  //   }

  //   const response = await fetch("${API_BASE}//api/resume", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`, // ✅ now defined
  //     },
  //     body: JSON.stringify({
  //       resumeId: currentResumeId,
  //       title: currentTitle,
  //       data: formData,
  //     }),
  //   });

  //   if (!response.ok) {
  //     const err = await response.json();
  //     console.error("Save failed:", err);
  //     alert("Save failed");
  //     return;
  //   }

  //   alert("Resume saved successfully");
  //   await loadResumeList();
  // }

  async function saveResume() {
    console.log("saveResume called");
    const token = localStorage.getItem("token");

    if (!token) {
      setShowLoginModal(true); // 👈 force login
      return;
    }

    if (!currentResumeId && !tempTitle) {
      setShowNameModal(true);
      return;
    }

    const titleToSave = currentResumeId ? currentTitle : tempTitle;

    await actuallySaveResume(titleToSave);

    // continue with save logic
  }

  async function actuallySaveResume(title) {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not logged in");
      return;
    }

    const res = await fetch(`${API_BASE}/api/resume`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        resumeId: currentResumeId,
        title,
        data: formData,
      }),
    });

    if (!res.ok) {
      toast.error("Failed to save resume");
      return;
    } else {
      toast.success("Resume saved successfully");
    }

    setShowNameModal(false);
    setTempTitle("");
    loadResumeList();
  }

  return (
    <div className="w-full">
      {/* Tips Section */}
      {/* <div className="flex content-center justify-center "> */}
      <div className="mb-2 p-4 bg-gray-300 border border-orange-500 rounded-lg w-full">
        <h1 className="text-gray-500 border-bottom-2 font-bold mb-2 text-xl">Resume Title : <strong className="ml-2 text-right text-orange-800">{currentTitle || "Untitled"}</strong></h1>
        <hr className="mb-2 bg-orange-500" />
        <h3 className="text-orange-800 font-semibold mb-2 flex items-center gap-2">
          💡 Tips for a Great Resume
        </h3>
        <ul className="text-orange-700 text-sm space-y-1">
          <li>• Keep descriptions concise and action-oriented</li>
          <li>• Use keywords relevant to your target job</li>
          <li>• Quantify achievements with numbers when possible</li>
          <li>• Preview updates in real-time on the right panel</li>
        </ul>
      </div>
      {/* </div> */}

      <form className="flex flex-col gap-4 sm:gap-6 items-start">
        {/* Personal Information */}
        <div className={sectionStyle}>
          <h2 className="text-2xl text-white font-bold mb-2">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <label className={labelStyle}>
              Name *
              <input
                className={inputBoxStyle}
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </label>
            <label className={labelStyle}>
              Email *
              <input
                className={inputBoxStyle}
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </label>
            <label className={labelStyle}>
              Phone *
              <input
                className={inputBoxStyle}
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </label>
            <label className={labelStyle}>
              LinkedIn
              <input
                className={inputBoxStyle}
                type="url"
                placeholder="LinkedIn profile URL"
                value={formData.linkedIn}
                onChange={(e) =>
                  setFormData({ ...formData, linkedIn: e.target.value })
                }
              />
            </label>
            <label className={labelStyle}>
              GitHub
              <input
                className={inputBoxStyle}
                type="url"
                placeholder="GitHub profile URL"
                value={formData.github}
                onChange={(e) =>
                  setFormData({ ...formData, github: e.target.value })
                }
              />
            </label>
            <label className={labelStyle}>
              Address
              <input
                className={inputBoxStyle}
                type="text"
                placeholder="Enter your address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </label>
          </div>
        </div>

        {/* Education */}
        <div className={sectionStyle}>
          <h2 className="text-2xl text-white font-bold mb-2">Education</h2>
          {formData.education?.map((edu, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 items-start p-4 rounded-lg w-full bg-orange-400 relative"
            >
              <button
                type="button"
                onClick={() => handleRemoveEducation(index)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-800 text-center text-white rounded-full w-6 h-6 flex items-center justify-center text-sm transition-colors"
                title="Remove education"
              >
                &#10005;
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <label className={labelStyle}>
                  Institution *
                  <input
                    className={inputBoxStyle}
                    type="text"
                    placeholder="Enter institution name"
                    value={edu.institution}
                    onChange={(e) => {
                      const updatedEducation = [...formData.education];
                      updatedEducation[index].institution = e.target.value;
                      setFormData({ ...formData, education: updatedEducation });
                    }}
                    required
                  />
                </label>
                <label className={labelStyle}>
                  Year *
                  <input
                    className={inputBoxStyle}
                    type="text"
                    placeholder="e.g., 2020-2024"
                    value={edu.year}
                    onChange={(e) => {
                      const updatedEducation = [...formData.education];
                      updatedEducation[index].year = e.target.value;
                      setFormData({ ...formData, education: updatedEducation });
                    }}
                    required
                  />
                </label>
                <label className={labelStyle}>
                  Degree *
                  <input
                    className={inputBoxStyle}
                    type="text"
                    placeholder="e.g., Bachelor of Computer Science"
                    value={edu.degree}
                    onChange={(e) => {
                      const updatedEducation = [...formData.education];
                      updatedEducation[index].degree = e.target.value;
                      setFormData({ ...formData, education: updatedEducation });
                    }}
                    required
                  />
                </label>
                <label className={labelStyle}>
                  CGPA/GPA
                  <input
                    className={inputBoxStyle}
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    placeholder="e.g., 8.5"
                    value={edu.cgpa}
                    onChange={(e) => {
                      const updatedEducation = [...formData.education];
                      updatedEducation[index].cgpa = e.target.value;
                      setFormData({ ...formData, education: updatedEducation });
                    }}
                  />
                </label>
              </div>
            </div>
          ))}
          <button
            className={buttonStyle}
            type="button"
            onClick={handleAddEducation}
          >
            Add Education
          </button>
        </div>

        {/* Experience */}
        <div className={sectionStyle}>
          <h2 className="text-2xl text-white font-bold mb-2">Experience</h2>
          {formData.experience.map((exp, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 items-start p-4 rounded-lg w-full bg-orange-400 relative"
            >
              <button
                type="button"
                onClick={() => handleRemoveExperience(index)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm transition-colors"
                title="Remove experience"
              >
                &#10005;
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <label className={labelStyle}>
                  Company *
                  <input
                    className={inputBoxStyle}
                    type="text"
                    placeholder="Enter company name"
                    value={exp.company}
                    onChange={(e) => {
                      const updatedExperience = [...formData.experience];
                      updatedExperience[index].company = e.target.value;
                      setFormData({
                        ...formData,
                        experience: updatedExperience,
                      });
                    }}
                    required
                  />
                </label>
                <label className={labelStyle}>
                  Duration *
                  <input
                    className={inputBoxStyle}
                    type="text"
                    placeholder="e.g., Jan 2023 - Present"
                    value={exp.duration}
                    onChange={(e) => {
                      const updatedExperience = [...formData.experience];
                      updatedExperience[index].duration = e.target.value;
                      setFormData({
                        ...formData,
                        experience: updatedExperience,
                      });
                    }}
                    required
                  />
                </label>
                <label className={labelStyle}>
                  Position *
                  <input
                    className={inputBoxStyle}
                    type="text"
                    placeholder="Enter position/role"
                    value={exp.role}
                    onChange={(e) => {
                      const updatedExperience = [...formData.experience];
                      updatedExperience[index].role = e.target.value;
                      setFormData({
                        ...formData,
                        experience: updatedExperience,
                      });
                    }}
                    required
                  />
                </label>
                <label className={labelStyle}>
                  Responsibilities
                  <textarea
                    className={textareaStyle}
                    placeholder="Enter responsibilities (comma-separated)"
                    value={
                      Array.isArray(exp.responsibilities)
                        ? exp.responsibilities.join(", ")
                        : exp.responsibilities
                    }
                    onChange={(e) => {
                      const updatedExperience = [...formData.experience];
                      updatedExperience[index].responsibilities = e.target.value
                        .split(",")
                        .map((item) => item.trim());
                      setFormData({
                        ...formData,
                        experience: updatedExperience,
                      });
                    }}
                  />
                </label>
              </div>
            </div>
          ))}
          <button
            className={buttonStyle}
            type="button"
            onClick={handleAddExperience}
          >
            Add Experience
          </button>
        </div>

        {/* Projects */}
        <div className={sectionStyle}>
          <h2 className="text-2xl text-white font-bold mb-2">Projects</h2>
          {formData.projects.map((project, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 items-start  p-4 rounded-lg w-full bg-orange-400 relative"
            >
              <button
                type="button"
                onClick={() => handleRemoveProject(index)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm transition-colors"
                title="Remove project"
              >
                &#10005;
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <label className={labelStyle}>
                  Title *
                  <input
                    className={inputBoxStyle}
                    type="text"
                    placeholder="Enter project title"
                    value={project.title}
                    onChange={(e) => {
                      const updatedProjects = [...formData.projects];
                      updatedProjects[index].title = e.target.value;
                      setFormData({ ...formData, projects: updatedProjects });
                    }}
                    required
                  />
                </label>
                <label className={labelStyle}>
                  Link
                  <input
                    className={inputBoxStyle}
                    type="url"
                    placeholder="Enter project link"
                    value={project.link}
                    onChange={(e) => {
                      const updatedProjects = [...formData.projects];
                      updatedProjects[index].link = e.target.value;
                      setFormData({ ...formData, projects: updatedProjects });
                    }}
                  />
                </label>
                <label className={labelStyle}>
                  Technologies
                  <input
                    className={inputBoxStyle}
                    type="text"
                    placeholder="e.g., React, Node.js, MongoDB"
                    value={project.technologies}
                    onChange={(e) => {
                      const updatedProjects = [...formData.projects];
                      updatedProjects[index].technologies = e.target.value;
                      setFormData({ ...formData, projects: updatedProjects });
                    }}
                  />
                </label>
                <label className={labelStyle}>
                  Description
                  <textarea
                    className={textareaStyle}
                    placeholder="Enter project description"
                    value={project.description}
                    onChange={(e) => {
                      const updatedProjects = [...formData.projects];
                      updatedProjects[index].description = e.target.value;
                      setFormData({ ...formData, projects: updatedProjects });
                    }}
                  />
                </label>
              </div>
            </div>
          ))}
          <button
            className={buttonStyle}
            type="button"
            onClick={handleAddProject}
          >
            Add Project
          </button>
        </div>

        {/* Skills */}
        <div className={sectionStyle}>
          <h2 className="text-2xl text-white font-bold mb-2">Skills</h2>
          <label className={labelStyle}>
            Skills (comma-separated)
            <input
              className={inputBoxStyle}
              type="text"
              placeholder="e.g., JavaScript, React, Python, SQL"
              value={formData.skills}
              onChange={(e) =>
                setFormData({ ...formData, skills: e.target.value })
              }
            />
          </label>
        </div>

        {/* Languages */}
        <div className={sectionStyle}>
          <h2 className="text-2xl text-white font-bold mb-2">Languages</h2>
          <label className={labelStyle}>
            Languages (comma-separated)
            <input
              className={inputBoxStyle}
              type="text"
              placeholder="e.g., English, Spanish, French"
              value={
                Array.isArray(formData.languages)
                  ? formData.languages.join(", ")
                  : formData.languages
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  languages: e.target.value
                    .split(",")
                    .map((item) => item.trim()),
                })
              }
            />
          </label>
        </div>

        {/* Certifications */}
        <div className={sectionStyle}>
          <h2 className="text-2xl text-white font-bold mb-2">Certifications</h2>
          {formData.certifications.map((cert, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 items-start p-4 rounded-lg w-full bg-orange-400 relative"
            >
              <button
                type="button"
                onClick={() => handleRemoveCertification(index)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm transition-colors"
                title="Remove certification"
              >
                &#10005;
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <label className={labelStyle}>
                  Title *
                  <input
                    className={inputBoxStyle}
                    type="text"
                    placeholder="Enter certification title"
                    value={cert.title}
                    onChange={(e) => {
                      const updatedCertifications = [
                        ...formData.certifications,
                      ];
                      updatedCertifications[index].title = e.target.value;
                      setFormData({
                        ...formData,
                        certifications: updatedCertifications,
                      });
                    }}
                    required
                  />
                </label>
                <label className={labelStyle}>
                  Issuer *
                  <input
                    className={inputBoxStyle}
                    type="text"
                    placeholder="Enter certification issuer"
                    value={cert.issuer}
                    onChange={(e) => {
                      const updatedCertifications = [
                        ...formData.certifications,
                      ];
                      updatedCertifications[index].issuer = e.target.value;
                      setFormData({
                        ...formData,
                        certifications: updatedCertifications,
                      });
                    }}
                    required
                  />
                </label>
                <label className={labelStyle}>
                  Year *
                  <input
                    className={inputBoxStyle}
                    type="text"
                    placeholder="Enter certification year"
                    value={cert.year}
                    onChange={(e) => {
                      const updatedCertifications = [
                        ...formData.certifications,
                      ];
                      updatedCertifications[index].year = e.target.value;
                      setFormData({
                        ...formData,
                        certifications: updatedCertifications,
                      });
                    }}
                    required
                  />
                </label>
                <label className={labelStyle}>
                  Link
                  <input
                    className={inputBoxStyle}
                    type="url"
                    placeholder="Enter certification link"
                    value={cert.link}
                    onChange={(e) => {
                      const updatedCertifications = [
                        ...formData.certifications,
                      ];
                      updatedCertifications[index].link = e.target.value;
                      setFormData({
                        ...formData,
                        certifications: updatedCertifications,
                      });
                    }}
                  />
                </label>
              </div>
            </div>
          ))}
          <button
            className={buttonStyle}
            type="button"
            onClick={handleAddCertification}
          >
            Add Certification
          </button>
        </div>
        <div className="flex gap-4">

        <button
          type="button"
          onClick={() => {
            saveResume();
          }}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-semibold cursor-pointer"
        >
          Save Resume
        </button>
        <button
          type="button"
          onClick={() => {
            clearformData();
          }}
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg text-white font-semibold cursor-pointer"
        >
          Clear Form
        </button>
        </div>
      </form>
      {showNameModal && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
          <div className="relative bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold mb-4">Name your resume</h3>

            <input
              type="text"
              placeholder="e.g. Software Engineer Resume"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4"
              autoFocus
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowNameModal(false)}
                className="px-3 py-1 bg-gray-300 rounded cursor-pointer hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => actuallySaveResume(tempTitle)}
                className="px-3 py-1 bg-green-600 text-white rounded cursor-pointer hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
