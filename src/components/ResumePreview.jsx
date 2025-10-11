import "../App.css";
import { useState } from "react";
import { FaExternalLinkAlt,FaLinkedin,FaGithubSquare } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { MdEmail } from "react-icons/md";

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
          <div className="flex items-center">
            <MdEmail className="inline" />
            <a href={`mailto:${formData.email}`}>{formData.email}</a>
          </div>
          <p>|</p>
          <div className="flex items-center">
            <IoCall className="inline" />
            <a href={`tel:${formData.phone}`}>{formData.phone}</a>
          </div>
          <p>|</p>
          <div className="flex items-center">
            <a className="" href={formData.linkedIn}>LinkedIn </a>
          <FaLinkedin className="inline " />
          </div>
          <p>|</p>
          <div className="flex items-center">
            <a className="" href={formData.github}>GitHub </a>
            <FaGithubSquare className="inline " />
          </div>
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
                  <p className="italic">Technologies: {project.technologies}</p>
                  <a className="underline underline-offset-2 " href={project.link}>Project Link <FaExternalLinkAlt className="inline" />
                  </a>
                </div>
              )
            })}
          </div>
        </div>
        {hasExperience ? (
          <div>
            <h2 className="font-link text-2xl">Experience</h2>
            <hr />
            <div>
              {formData.experience.map((exp, index) => (
                <div key={index} className="mb-2">
                  <h3 className="font-semibold">{exp.company}</h3>
                  <p>{exp.role}</p>
                  <p>{exp.duration}</p>
                  <p>{exp.responsibilities}</p>
                </div>
              ))}
            </div>
          </div>
        ) : ''}
        <div>
          <h2 className="font-link text-2xl">Skills</h2>
          <hr />
          <div>
            <p>{formData.skills}</p>
          </div>
          <div className="flex">
            <p className="font-bold">Languages :</p>
            <p className="px-1">{formData.languages}</p>
          </div>
        </div>
        <div>
          <h2 className="font-link text-2xl">Certifications</h2>
          <hr />
          <div>
            {formData.certifications.map((cert, index) => (
              <div key={index} className="mb-2">
                <h3 className="font-semibold">{cert.title}</h3>
                <p>{cert.issuer}</p>
                <p>{cert.year}</p>
                <a className="underline underline-offset-2 " href={cert.link}>Certification Link
                  <FaExternalLinkAlt className="inline" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
