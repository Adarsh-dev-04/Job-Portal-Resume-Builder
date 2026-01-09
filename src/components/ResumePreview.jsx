import "../App.css";
import { FaExternalLinkAlt, FaLinkedin, FaGithubSquare } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { MdEmail } from "react-icons/md";

export default function ResumePreview({ formData }) {
  const hasExperience = formData.experience && formData.experience.length > 0;

  return (
    <div className="resume-preview">
      <div className="flex flex-col gap-4">
        {/* Header Section */}
        <div className="text-center border-b-2 border-gray-200 pb-4">
          <h1 className="font-link text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
            {formData.name || "Your Name"}
          </h1>
          <div className="flex flex-wrap gap-2 sm:gap-4 justify-center font-semibold font-link text-xs sm:text-sm lg:text-base text-gray-600">
            {formData.email && (
              <>
                <div className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                  <MdEmail className="inline text-blue-500" />
                  <a href={`mailto:${formData.email}`} className="break-all">
                    {formData.email}
                  </a>
                </div>
                <span className="hidden sm:inline text-gray-400">|</span>
              </>
            )}
            {formData.phone && (
              <>
                <div className="flex items-center gap-1 hover:text-green-600 transition-colors">
                  <IoCall className="inline text-green-500" />
                  <a href={`tel:${formData.phone}`}>{formData.phone}</a>
                </div>
                <span className="hidden sm:inline text-gray-400">|</span>
              </>
            )}
            {formData.linkedIn && (
              <>
                <div className="flex items-center gap-1 hover:text-blue-700 transition-colors">
                  <a href={formData.linkedIn} className="flex items-center gap-1" target="_blank" rel="noopener noreferrer">
                    LinkedIn <FaLinkedin className="inline text-blue-600" />
                  </a>
                </div>
                <span className="hidden sm:inline text-gray-400">|</span>
              </>
            )}
            {formData.github && (
              <div className="flex items-center gap-1 hover:text-gray-800 transition-colors">
                <a href={formData.github} className="flex items-center gap-1" target="_blank" rel="noopener noreferrer">
                  GitHub <FaGithubSquare className="inline text-gray-700" />
                </a>
              </div>
            )}
          </div>
          {formData.address && (
            <p className="text-sm text-gray-600 mt-2">{formData.address}</p>
          )}
        </div>
        {/* Education Section */}
        {formData.education && formData.education.length > 0 && (
          <div className="section">
            <h2 className="font-link text-xl sm:text-2xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">
              Education
            </h2>
            <div className="space-y-3">
              {formData.education.map((edu, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                    <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{edu.institution}</h3>
                    <p className="text-gray-600 text-sm font-medium">{edu.year}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 mt-1">
                    <p className="text-gray-700 text-sm">{edu.degree}</p>
                    {edu.cgpa && <p className="text-gray-600 text-sm">CGPA: {edu.cgpa}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Section */}
        {formData.projects && formData.projects.length > 0 && (
          <div className="section">
            <h2 className="font-link text-xl sm:text-2xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">
              Projects
            </h2>
            <div className="space-y-4">
              {formData.projects.map((project, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-2">{project.title}</h3>
                  {project.description && (
                    <p className="text-gray-700 text-sm sm:text-base mb-2 leading-relaxed">{project.description}</p>
                  )}
                  {project.technologies && (
                    <p className="italic text-gray-600 text-sm mb-2">
                      <span className="font-medium">Technologies:</span> {project.technologies}
                    </p>
                  )}
                  {project.link && (
                    <a
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline underline-offset-2 text-sm transition-colors"
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Project Link <FaExternalLinkAlt className="inline text-xs" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Experience Section */}
        {hasExperience && (
          <div className="section">
            <h2 className="font-link text-xl sm:text-2xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">
              Experience
            </h2>
            <div className="space-y-4">
              {formData.experience.map((exp, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 mb-2">
                    <h3 className="font-semibold text-gray-800 text-base sm:text-lg">{exp.company}</h3>
                    <p className="text-sm text-gray-600 font-medium">{exp.duration}</p>
                  </div>
                  <p className="font-medium text-gray-700 mb-2 text-sm sm:text-base">{exp.role}</p>
                  {exp.responsibilities && (
                    <div className="mt-2">
                      {Array.isArray(exp.responsibilities) ? (
                        <ul className="list-disc list-inside space-y-1">
                          {exp.responsibilities.map((resp, respIndex) => (
                            <li key={respIndex} className="text-sm text-gray-700 leading-relaxed">
                              {resp}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-700 leading-relaxed">{exp.responsibilities}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Section */}
        {(formData.skills || formData.languages) && (
          <div className="section">
            <h2 className="font-link text-xl sm:text-2xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">
              Skills
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              {formData.skills && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Technical Skills</h3>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{formData.skills}</p>
                </div>
              )}
              {formData.languages && (
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Languages</h3>
                  <p className="text-gray-700 text-sm sm:text-base">
                    {Array.isArray(formData.languages)
                      ? formData.languages.join(", ")
                      : formData.languages}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {formData.certifications && formData.certifications.length > 0 && (
          <div className="section">
            <h2 className="font-link text-xl sm:text-2xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-1">
              Certifications
            </h2>
            <div className="space-y-3">
              {formData.certifications.map((cert, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base mb-1">{cert.title}</h3>
                  <p className="text-gray-700 text-sm mb-1">{cert.issuer}</p>
                  <p className="text-gray-600 text-sm mb-2">{cert.year}</p>
                  {cert.link && (
                    <a
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline underline-offset-2 text-sm transition-colors"
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Certification Link <FaExternalLinkAlt className="inline text-xs" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}