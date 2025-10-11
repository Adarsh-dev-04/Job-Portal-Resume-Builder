import "../App.css";
export default function ResumeForm({ formData, setFormData }) {
  let educationCount = formData.education.length;
  let experienceCount = formData.experience.length;
  let projectCount = formData.projects.length;
  let inputBoxExperienceStyle =
    "text-white bg-black border-2 border-black px-2 py-1 w-150 rounded-sm";


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

  function handleAddExperience(){
    const newExperience = {
      company: "",
      role : "",
      duration : "",
      responsibilities: []
    }

    setFormData({...formData, experience : [...formData.experience , newExperience]})
  }

  function handleAddProject(){
    const newProject = {
      title : "",
      link : "",
      description : []
    };

    setFormData({...formData, projects : [...formData.projects , newProject]})
  }

  let inputBoxStyle =
    "text-white bg-black border-2 border-black px-2 py-1 w-155 rounded-sm";
  let inputBoxEducationStyle =
    "text-white bg-black border-2 border-black px-2 py-1 w-150 rounded-sm";
  let buttonStyle ="bg-green-500 p-2 rounded-sm text-white cursor-pointer";
  let labelStyle = "text-white flex flex-col gap-1 text-lg font-medium";
  return (
    <div className="">
      <form className="flex flex-col gap-4 items-start ">
        <div className="flex flex-col gap-4 items-start border-1 border-gray-300 p-4 rounded-sm w-full">
          <label className={labelStyle}>
            Name:
            <input
              className={inputBoxStyle}
              type="text"
              placeholder={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </label>
          <label className={labelStyle}>
            Email:
            <input
              className={inputBoxStyle}
              type="email"
              placeholder={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </label>
          <label className={labelStyle}>
            Phone:
            <input
              className={inputBoxStyle}
              type="tel"
              placeholder={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </label>
          <label className={labelStyle}>
            LinkedIn:
            <input
              className={inputBoxStyle}
              type="text"
              placeholder={formData.linkedIn}
              onChange={(e) =>
                setFormData({ ...formData, linkedIn: e.target.value })
              }
            />
          </label>
          <label className={labelStyle}>
            GitHub:
            <input
              className={inputBoxStyle}
              type="text"
              placeholder={formData.github}
              onChange={(e) =>
                setFormData({ ...formData, github: e.target.value })
              }
            />
          </label>
          <label className={labelStyle}>
            Address:
            <input
              className={inputBoxStyle}
              type="text"
              placeholder={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
          </label>
        </div>

        <h2 className="text-2xl p-1 text-white text-bold">Education</h2>

        <div className="flex flex-col gap-4 items-start border-1 border-gray-200 p-4 rounded-sm w-full">
          {Array.from({ length: educationCount }).map((_, index) => (
            <div key={index} className="edu-1 flex flex-col gap-4 items-start border-1 border-gray-200 p-4 rounded-sm w-full">
              <label className={labelStyle}>
                Institution: 
                <input
                  className={inputBoxEducationStyle}
                  type="text"
                  placeholder="Enter institution name" 
                  onChange={(e) => {
                    const updatedEducation = [...formData.education];
                    updatedEducation[index].institution = e.target.value;
                    setFormData({ ...formData, education: updatedEducation });
                  }}
                />
              </label>
              <label className={labelStyle}>
                Year:
                <input
                  className={inputBoxEducationStyle}
                  type="text"
                  placeholder="Enter year" 
                  onChange={(e) => {
                    const updatedEducation = [...formData.education];
                    updatedEducation[index].year = e.target.value;
                    setFormData({ ...formData, education: updatedEducation });
                  }}
                />
              </label> 
              <label className={labelStyle}>
                Degree:
                <input
                  className={inputBoxEducationStyle}
                  type="text"
                  placeholder="Enter degree" 
                  onChange={(e) => {
                    const updatedEducation = [...formData.education];
                    updatedEducation[index].degree = e.target.value;
                    setFormData({ ...formData, education: updatedEducation });
                  }}
                />
              </label>
              <label className={labelStyle}>
                CGPA:
                <input  
                  className={inputBoxEducationStyle}
                  type="number"
                  min={0}
                  max={10}
                  placeholder="Enter CGPA" 
                  onChange={(e) => {
                    const updatedEducation = [...formData.education];
                    updatedEducation[index].cgpa = e.target.value;
                    setFormData({ ...formData, education: updatedEducation });
                  }}
                />
              </label>
            </div>
          ))}
          <button className="bg-green-500 p-2 rounded-sm text-white cursor-pointer" type="button" onClick={handleAddEducation}>
            Add Education
          </button>
        </div>

        <div className="experience-section flex flex-col gap-4 items-start border-1 border-gray-200 p-4 rounded-sm w-full">
          {experienceCount>0? (<h2 className="text-2xl p-1 text-white text-bold">Experience</h2>) : (<></>)}
          {formData.experience.length>0 ? (Array.from({ length: experienceCount }).map((_, index) => (
          <div key={index} className="exp-1 flex flex-col gap-4 items-start border-1 border-gray-200 p-4 rounded-sm w-full">
            <label className={labelStyle}>
              Company:
              <input
                className={inputBoxExperienceStyle}
                type="text"
                placeholder="Enter company name"
                onChange={(e) => {
                  const updatedExperience = [...formData.experience];
                  updatedExperience[index].company = e.target.value;
                  setFormData({ ...formData, experience: updatedExperience });
                }}
              />
            </label>
            <label className={labelStyle}>
              Year:
              <input
                className={inputBoxExperienceStyle}
                type="text"
                placeholder="Enter year"
                onChange={(e) => {
                  const updatedExperience = [...formData.experience];
                  updatedExperience[index].duration = e.target.value;
                  setFormData({ ...formData, experience: updatedExperience });
                }}
              />
            </label>
            <label className={labelStyle}>
              Position:
              <input
                className={inputBoxExperienceStyle}
                type="text"
                placeholder="Enter position"
                onChange={(e) => {
                  const updatedExperience = [...formData.experience];
                  updatedExperience[index].role = e.target.value;
                  setFormData({ ...formData, experience: updatedExperience });
                }}
              />
            </label>
            <label className={labelStyle}>
              Responsibilities:
              <textarea
                className={inputBoxExperienceStyle}
                placeholder="Enter responsibilities"
                onChange={(e) => {
                  const updatedExperience = [...formData.experience];
                  updatedExperience[index].responsibilities = e.target.value.split(",").map(item => item.trim());
                  setFormData({ ...formData, experience: updatedExperience });
                }}
              />
            </label>
          </div>
        ))) : (<></>)}
        <button className="bg-green-500 p-2 rounded-sm text-white cursor-pointer" type="button" onClick={handleAddExperience}>
            Add Experience
          </button>
        </div>
        <div className="flex flex-col gap-4 items-start border-1 border-gray-300 p-4 rounded-sm w-full">
          <h2 className="text-2xl p-1 text-white text-bold">Projects</h2>
          {formData.projects.length > 0 ? (Array.from({ length: projectCount }).map((_, index) => (
            <div key={index} className="project-1 flex flex-col gap-4 items-start border-1 border-gray-200 p-4 rounded-sm w-full">
              <label className={labelStyle}>
                Title:
                <input
                  className={inputBoxEducationStyle}
                  type="text"
                  placeholder="Enter project title"
                  onChange={(e) => {
                    const updatedProjects = [...formData.projects];
                    updatedProjects[index].title = e.target.value;
                    setFormData({ ...formData, projects: updatedProjects });
                  }}
                />
              </label>
              <label className={labelStyle}>
                Link:
                <input
                  className={inputBoxEducationStyle}
                  type="text"
                  placeholder="Enter project link"
                  onChange={(e) => {
                    const updatedProjects = [...formData.projects];
                    updatedProjects[index].link = e.target.value;
                    setFormData({ ...formData, projects: updatedProjects });
                  }}
                />
              </label>
              <label className={labelStyle}>
                Technologies:
                <input
                  className={inputBoxEducationStyle}
                  type="text"
                  placeholder="Enter project technologies"
                  onChange={(e) => {
                    const updatedProjects = [...formData.projects];
                    updatedProjects[index].technologies = e.target.value;
                    setFormData({ ...formData, projects: updatedProjects });
                  }}
                />
              </label>
              <label className={labelStyle}>
                Description:
                <textarea
                  className={inputBoxEducationStyle}
                  placeholder="Enter project description"
                  onChange={(e) => {
                    const updatedProjects = [...formData.projects];
                    updatedProjects[index].description = e.target.value;
                    setFormData({ ...formData, projects: updatedProjects });
                  }}
                />
              </label>
            </div>
          ))) : (<></>)}
          <button className="bg-green-500 p-2 rounded-sm text-white cursor-pointer" type="button" onClick={handleAddProject}>
            Add Project
          </button>
          
        </div>
        <div className="flex flex-col gap-4 items-start border-1 border-gray-300 p-4 rounded-sm w-full">
          <h2 className="text-2xl p-1 text-white text-bold">Skills</h2>
          <label className={labelStyle}>
            <input
              className={inputBoxEducationStyle}
              type="text"
              placeholder="Enter your skills"
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            />
          </label>
        </div>
        <div className="flex flex-col gap-4 items-start border-1 border-gray-300 p-4 rounded-sm w-full">
          <h2 className="text-2xl p-1 text-white text-bold">Languages</h2>
          <label className={labelStyle}>
            <input
              className={inputBoxEducationStyle}
              type="text"
              placeholder="Enter your languages"
              onChange={(e) => setFormData({ ...formData, languages: e.target.value.split(",").map(item => item.trim()) })}
            />
          </label>
        </div>
        <div className="flex flex-col gap-4 items-start border-1 border-gray-300 p-4 rounded-sm w-full">
          <h2 className="text-2xl p-1 text-white text-bold">Certifications</h2>
          {formData.certifications.length > 0 ? (Array.from({ length: formData.certifications.length }).map((_, index) => (
            <div key={index} className="mb-2">
              <label className={labelStyle}>
                Title:
                <input
                  className={inputBoxEducationStyle}
                  type="text"
                  placeholder="Enter certification title"
                  onChange={(e) => {
                    const updatedCertifications = [...formData.certifications];
                    updatedCertifications[index].title = e.target.value;
                    setFormData({ ...formData, certifications: updatedCertifications });
                  }}
                />
              </label>
              <label className={labelStyle}>
                Issuer:
                <input
                  className={inputBoxEducationStyle}
                  type="text"
                  placeholder="Enter certification issuer"
                  onChange={(e) => {
                    const updatedCertifications = [...formData.certifications];
                    updatedCertifications[index].issuer = e.target.value;
                    setFormData({ ...formData, certifications: updatedCertifications });
                  }}
                />
              </label>
              <label className={labelStyle}>
                Year:
                <input
                  className={inputBoxEducationStyle}
                  type="text"
                  placeholder="Enter certification year"
                  onChange={(e) => {
                    const updatedCertifications = [...formData.certifications];
                    updatedCertifications[index].year = e.target.value;
                    setFormData({ ...formData, certifications: updatedCertifications });
                  }}
                />
              </label>
              <label className={labelStyle}>
                Link:
                <input
                  className={inputBoxEducationStyle}
                  type="text"
                  placeholder="Enter certification link"
                  onChange={(e) => {
                    const updatedCertifications = [...formData.certifications];
                    updatedCertifications[index].link = e.target.value;
                    setFormData({ ...formData, certifications: updatedCertifications });
                  }}
                />
              </label>
            </div>
          ))) : (<></>)}
          <button className="bg-green-500 p-2 rounded-sm text-white cursor-pointer" type="button" onClick={() => {
            const newCertification = {
              title: "",
              issuer: "",
              year: "",
              link: "",
            };
            setFormData({ ...formData, certifications: [...formData.certifications, newCertification] });
          }}>
            Add Certification
          </button>
        </div>
      </form>
    </div>
  );
}
