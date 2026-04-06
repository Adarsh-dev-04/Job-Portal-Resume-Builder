import "../App.css";
import { FaExternalLinkAlt, FaLinkedin, FaGithubSquare } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { LuMapPin } from "react-icons/lu";

export default function ResumePreview({ formData }) {
  const hasExperience = formData.experience && formData.experience.length > 0;

  function SectionTitle({ children }) {
    return (
      <h2 className="mb-3 border-b border-stone-300 pb-2 text-lg font-black text-stone-900 sm:text-xl">
        {children}
      </h2>
    );
  }

  function Card({ children }) {
    return <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">{children}</div>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-2xl bg-white">
        {/* Header */}
        <div className="border-b-2 border-stone-200 pb-5 text-center">
          <h1 className="text-3xl font-black text-stone-900 sm:text-4xl">
            {formData.name || "Your Name"}
          </h1>

          <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs font-medium text-stone-600 sm:gap-4 sm:text-sm">
            {formData.email && (
              <div className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                <MdEmail className="text-blue-500" />
                <a href={`mailto:${formData.email}`} className="break-all">
                  {formData.email}
                </a>
              </div>
            )}

            {formData.phone && (
              <div className="flex items-center gap-1.5 hover:text-green-600 transition-colors">
                <IoCall className="text-green-500" />
                <a href={`tel:${formData.phone}`}>{formData.phone}</a>
              </div>
            )}

            {formData.linkedIn && (
              <div className="flex items-center gap-1.5 hover:text-blue-700 transition-colors">
                <a
                  href={formData.linkedIn}
                  className="flex items-center gap-1.5"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn <FaLinkedin className="text-blue-600" />
                </a>
              </div>
            )}

            {formData.github && (
              <div className="flex items-center gap-1.5 hover:text-stone-900 transition-colors">
                <a
                  href={formData.github}
                  className="flex items-center gap-1.5"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub <FaGithubSquare className="text-stone-700" />
                </a>
              </div>
            )}
          </div>

          {formData.address && (
            <div className="mt-3 flex items-center justify-center gap-1.5 text-sm text-stone-500">
              <LuMapPin className="text-orange-500" />
              <span>{formData.address}</span>
            </div>
          )}
        </div>

        <div className="mt-6 space-y-6">
          {/* Education */}
          {formData.education && formData.education.length > 0 && (
            <section>
              <SectionTitle>Education</SectionTitle>
              <div className="space-y-3">
                {formData.education.map((edu, index) => (
                  <Card key={index}>
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <h3 className="text-base font-bold text-stone-900">{edu.institution}</h3>
                      <p className="text-sm font-semibold text-stone-500">{edu.year}</p>
                    </div>

                    <div className="mt-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-stone-700">{edu.degree}</p>
                      {edu.cgpa && (
                        <p className="text-sm font-medium text-stone-500">CGPA: {edu.cgpa}</p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {formData.projects && formData.projects.length > 0 && (
            <section>
              <SectionTitle>Projects</SectionTitle>
              <div className="space-y-4">
                {formData.projects.map((project, index) => (
                  <Card key={index}>
                    <h3 className="text-base font-bold text-stone-900 sm:text-lg">
                      {project.title}
                    </h3>

                    {project.description && (
                      <p className="mt-2 text-sm leading-6 text-stone-700 sm:text-base">
                        {project.description}
                      </p>
                    )}

                    {project.technologies && (
                      <p className="mt-2 text-sm italic text-stone-500">
                        <span className="font-semibold not-italic text-stone-700">
                          Technologies:
                        </span>{" "}
                        {project.technologies}
                      </p>
                    )}

                    {project.link && (
                      <a
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 underline underline-offset-2 transition-colors hover:text-blue-800"
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Project Link <FaExternalLinkAlt className="text-xs" />
                      </a>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Experience */}
          {hasExperience && (
            <section>
              <SectionTitle>Experience</SectionTitle>
              <div className="space-y-4">
                {formData.experience.map((exp, index) => (
                  <Card key={index}>
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <h3 className="text-base font-bold text-stone-900 sm:text-lg">{exp.company}</h3>
                      <p className="text-sm font-medium text-stone-500">{exp.duration}</p>
                    </div>

                    <p className="mt-2 text-sm font-semibold text-stone-700 sm:text-base">
                      {exp.role}
                    </p>

                    {exp.responsibilities && (
                      <div className="mt-3">
                        {Array.isArray(exp.responsibilities) ? (
                          <ul className="list-disc space-y-1 pl-5">
                            {exp.responsibilities.map((resp, respIndex) => (
                              <li
                                key={respIndex}
                                className="text-sm leading-6 text-stone-700"
                              >
                                {resp}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm leading-6 text-stone-700">
                            {exp.responsibilities}
                          </p>
                        )}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {(formData.skills || formData.languages) && (
            <section>
              <SectionTitle>Skills</SectionTitle>
              <Card>
                <div className="space-y-4">
                  {formData.skills && (
                    <div>
                      <h3 className="mb-2 text-sm font-bold text-stone-900 sm:text-base">
                        Technical Skills
                      </h3>
                      <p className="text-sm leading-6 text-stone-700 sm:text-base">
                        {formData.skills}
                      </p>
                    </div>
                  )}

                  {formData.languages && (
                    <div>
                      <h3 className="mb-2 text-sm font-bold text-stone-900 sm:text-base">
                        Languages
                      </h3>
                      <p className="text-sm text-stone-700 sm:text-base">
                        {Array.isArray(formData.languages)
                          ? formData.languages.join(", ")
                          : formData.languages}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </section>
          )}

          {/* Certifications */}
          {formData.certifications && formData.certifications.length > 0 && (
            <section>
              <SectionTitle>Certifications</SectionTitle>
              <div className="space-y-3">
                {formData.certifications.map((cert, index) => (
                  <Card key={index}>
                    <h3 className="text-sm font-bold text-stone-900 sm:text-base">
                      {cert.title}
                    </h3>

                    <p className="mt-1 text-sm text-stone-700">{cert.issuer}</p>

                    <p className="mt-1 text-sm text-stone-500">{cert.year}</p>

                    {cert.link && (
                      <a
                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 underline underline-offset-2 transition-colors hover:text-blue-800"
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Certification Link <FaExternalLinkAlt className="text-xs" />
                      </a>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}