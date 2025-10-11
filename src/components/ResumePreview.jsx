import "../App.css";
import { useState } from "react";
export default function ResumePreview({ formData}) {
  const [hasExperience, setHasExperience] = useState(true);

  if (formData.experience.length === 0) {
    setHasExperience(false);
  }

  return (
    <div>
      <div className="flex flex-col gap-2">
        <h1 className="text-center font-link text-3xl font-bold">{formData.name}</h1>
        <div className="flex gap-2 justify-center font-semibold font-link">
          <a href={`mailto:${formData.email}`}>{formData.email}</a>
          <p>|</p>
          <a href={`tel:${formData.phone}`}>{formData.phone}</a>
          <p>|</p>
          <a href={formData.linkedIn}>LinkedIn</a>
          <p>|</p>
          <a href={formData.github}>GitHub</a>
        </div>
        <div className="p-2">
          <h2 className="font-link text-2xl">Education</h2>
          <hr />
          <div>
            {formData.education.map((edu, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between">
                  <h3>{edu.institution}</h3>
                  <p>{edu.year}</p>
                </div>
                <div className="flex justify-between">
                  <p>{edu.degree}</p>
                  <p>CGPA: {edu.cgpa}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div >
          <h2 className="font-link text-2xl">Projects</h2>
          <hr />
          <div>
            {formData.projects.map((project,index)=>{
              return (
                <div key={index} className="mb-2">
                  <h3 className="font-semibold">{project.title}</h3>
                  <p>{project.description}</p>
                  <p className="italic">Technologies: {project.technologies.join(", ")}</p>
                  <a href={project.link}>Project Link</a>
                </div>
              )
            })}
          </div>
        </div>
        {hasExperience ? (
          <div>
            <h2>Experience</h2>
            <hr />
            <div>
              {formData.experience.map((exp, index) => (
                <div key={index} className="mb-2">
                  <h3 className="font-semibold">{exp.company}</h3>
                  <p>{exp.role}</p>
                  <p>{exp.duration}</p>
                  <ul>
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : ''}
      </div>
    </div>
  );
}
