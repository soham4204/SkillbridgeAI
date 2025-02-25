import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPalette, FaFont } from "react-icons/fa";

const ResumeBuilder = ({ userId }) => {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [selectedFont, setSelectedFont] = useState("inter");

  const templates = {
    modern: {
      name: "Modern",
      className: "bg-white rounded-lg shadow-lg p-8 space-y-4"
    },
    minimal: {
      name: "Minimal",
      className: "bg-white rounded-lg shadow-lg p-8 space-y-4"
    },
    professional: {
      name: "Professional",
      className: "bg-white border border-gray-200"
    },
    compact: {
      name: "Compact",
      className: "bg-white p-6 max-w-3xl mx-auto"
    }
  };

  const fonts = {
    inter: {
      name: "Inter",
      className: "font-sans"
    },
    georgia: {
      name: "Georgia",
      className: "font-serif"
    },
    monaco: {
      name: "Monaco",
      className: "font-mono"
    }
  };

  const currentYear = new Date().getFullYear();

  const ModernTemplate = () => (
      <div 
      id="resume-content" 
      className="bg-white space-y-4"
      >
      {/* Header/Contact Information */}
      <div className="border-b border-gray-600 pb-2">
        <h2 className="text-6xl font-bold text-gray-800 mb-2">
          {resumeData?.contactInformation?.fullName}
        </h2>
        <p className="text-gray-600 mb-4 text-lg">
          {resumeData?.professionalSummary}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
          <p className="flex items-center">
            <FaEnvelope className="mr-2 text-blue-500" />
            {resumeData?.contactInformation?.email}
          </p>
          <p className="flex items-center">
            <FaPhone className="mr-2 text-blue-500" />
            {resumeData?.contactInformation?.phoneNumber}
          </p>
          <p className="flex items-center">
            <FaMapMarkerAlt className="mr-2 text-blue-500" />
            {resumeData?.contactInformation?.address}
          </p>
        </div>
      </div>

      {/* Education */}
      <div className="flex flex-row text-justify">
        <div className="flex w-full flex-col pr-3 border-r border-gray-600">
          <div className="pb-2 border-b border-gray-600">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Education</h3>
            <div className="space-y-6">
              {resumeData?.education?.map((edu, index) => {
                return (
                  <p key={index} className="text-gray-700">
                    <li>
                      <>
                        {edu.graduationYear > currentYear ? (
                          <>
                          Currently pursuing <strong>{edu.degree}</strong> from {edu.institution}, expected to graduate in {edu.graduationYear}with current grade of <strong>{edu.grade}</strong> .
                          </>
                        ) : edu.graduationYear < currentYear - 2 ? (
                          <>
                          Completed <strong>{edu.degree}</strong> from {edu.institution} in {edu.graduationYear} with a grade of <strong>{edu.grade}</strong>.
                          </>
                        ) : (
                          <>
                          Graduated with <strong>{edu.degree}</strong> from {edu.institution} in {edu.graduationYear} with a grade of <strong>{edu.grade}</strong>.
                          </>
                        )}
                      </>
                    </li>
                  </p>
                );
              })}
            </div>
          </div>

      {/* Work Experience */}
      <div className="py-2 border-b border-gray-600">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Work Experience</h3>
        <div className="space-y-6">
          {resumeData?.workExperience?.map((exp, index) => {
            let sentence = "";
            if (exp.endDate.toLowerCase() === "present") {
              sentence = `${exp.jobTitle} at ${exp.companyName} (${exp.location}) since ${exp.startDate}.`;
            } else {
              sentence = `${exp.jobTitle} at ${exp.companyName} (${exp.location}) from ${exp.startDate} to ${exp.endDate}.`;
            }
            return (
              <div>
              <p key={index} className="text-gray-700 font-bold"><li>{sentence}</li></p>
              <p key={index} className="text-gray-700">{exp.description}</p>
              </div>
            );
          })}
        </div>
      </div>
      {/* Certifications */}
        <div className="py-2">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Certifications</h3>
          <div className="space-y-6">
            {resumeData?.certifications?.map((cert, index) => (
              <p key={index} className="text-gray-700">
                <p className="font-bold">{cert.name}</p>{`issued by ${cert.issuer} on ${cert.date}.`}
              </p>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col pl-3">
      {/* Skills */}
      <div className="py-2 border-b border-gray-600">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Skills</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-700">Technical Skills</h4>
            <ul className="list-disc list-inside text-gray-700">
              {resumeData?.skills?.technical?.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700">Soft Skills</h4>
            <ul className="list-disc list-inside text-gray-700">
              {resumeData?.skills?.soft?.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Projects */}
      <div className="py-2 border-b border-gray-600">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Projects</h3>
        <div className="space-y-6">
          {resumeData?.projects?.map((project, index) => (
            <p key={index} className="text-gray-700">
              <p className="font-bold">{project.name}:</p>{`${project.description}`}
            </p>
          ))}
        </div>
      </div>

      {/*Achievements*/}
      <div className="py-2">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Achievements</h3>
          <div className="space-y-6">
            {resumeData?.achievements?.map((ach, index) => (
              <p key={index} className="text-gray-700">
                <p className="font-bold">{ach.name}</p>{`issued by ${ach.issuer} on ${ach.date}.`}
              </p>
            ))}
          </div>
      </div>
      
      </div>
      </div>
    </div>
  );

  const MinimalistTemplate = () => (
    <div id="resume-content" className="bg-white">
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-4xl font-dark text-gray-900 mb-3">
          {resumeData?.contactInformation?.fullName}
        </h1>
        <p className="text-gray-600 mb-4 text-lg font-light leading-relaxed">
          {resumeData?.professionalSummary}
        </p>
        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          <span className="flex items-center">
            <FaEnvelope className="mr-2" />
            {resumeData?.contactInformation?.email}
          </span>
          <span className="flex items-center">
            <FaPhone className="mr-2" />
            {resumeData?.contactInformation?.phoneNumber}
          </span>
          <span className="flex items-center">
            <FaMapMarkerAlt className="mr-2" />
            {resumeData?.contactInformation?.address}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Experience Section */}
          <section>
            <h2 className="text-2xl font-dark text-gray-900 mb-4 pb-2 border-b border-gray-500">
              Work Experience
            </h2>
            <div className="space-y-6">
              {resumeData?.workExperience?.map((exp, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex flex-row justify-between">
                  <h3 className="font-medium text-gray-900">{exp.jobTitle}</h3>
                  <p className="text-gray-600 text-sm">
                    {exp.startDate} - {exp.endDate}
                  </p>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {exp.companyName} • {exp.location}
                  </p>
                  
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Education Section */}
          <section>
            <h2 className="text-2xl font-dark text-gray-900 mb-4 pb-2 border-b border-gray-500">
              Education
            </h2>
            <div className="space-y-4">
              {resumeData?.education?.map((edu, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex flex-row justify-between">
                    <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-600 text-sm">
                      GraduationYear: {edu.graduationYear}
                    </p>
                  </div>
                  <p className="text-gray-600 text-sm">{edu.institution}</p>
                  <p className="text-gray-700 text-sm">{edu.grade}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Projects Section */}
          <section>
            <h2 className="text-2xl font-dark text-gray-900 mb-4 pb-2 border-b border-gray-500">
              Projects
            </h2>
            <div className="space-y-4">
              {resumeData?.projects?.map((project, index) => (
                <div key={index} className="space-y-1">
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  <p className="text-gray-700 text-sm">{project.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Skills Section */}
          <section>
            <h2 className="text-2xl font-dark text-gray-900 mb-4 pb-2 border-b border-gray-500">
              Skills
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Technical</h3>
                <div className="flex flex-wrap gap-2">
                  {resumeData?.skills?.technical?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Soft Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {resumeData?.skills?.soft?.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Certifications Section */}
          <section>
            <h2 className="text-2xl font-dark text-gray-900 mb-4 pb-2 border-b border-gray-500">
              Certifications
            </h2>
            <div className="space-y-4">
              {resumeData?.certifications?.map((cert, index) => (
                <div key={index} className="space-y-1">
                  <h3 className="font-medium text-gray-900">{cert.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {cert.issuer} • {cert.date}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Achievements Section */}
          <section>
            <h2 className="text-2xl font-dark text-gray-900 mb-4 pb-2 border-b border-gray-500">
              Achievements
            </h2>
            <div className="space-y-4">
              {resumeData?.achievements?.map((ach, index) => (
                <div key={index} className="space-y-1">
                  <h3 className="font-medium text-gray-900">{ach.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {ach.issuer} • {ach.date}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )

const CompactTemplate = () => (
  <div className="max-w-2xl mx-auto">
    <header className="border-b-2 border-black pb-4 mb-6">
      <h1 className="text-3xl font-bold">{resumeData?.contactInformation?.fullName}</h1>
      <p className="text-sm mt-2 mb-3">{resumeData?.professionalSummary}</p>
      <div className="flex justify-between text-sm">
        <span>{resumeData?.contactInformation?.email}</span>
        <span>{resumeData?.contactInformation?.phoneNumber}</span>
        <span>{resumeData?.contactInformation?.address}</span>
      </div>
    </header>

    <main className="space-y-6">
      <section>
        <h2 className="text-xl font-bold mb-2">Education</h2>
        {resumeData?.education?.map((edu, index) => (
          <div key={index} className="flex justify-between mb-1">
            <div className="flex flex-col">
              <span className="font-semibold">•{edu.institution}</span>
              <span>{edu.degree}</span>
            </div>
            <span>{edu.graduationYear} ({edu.grade})</span>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-2">Experience</h2>
        {resumeData?.workExperience?.map((exp, index) => (
          <div key={index} className="mb-4">
            <div className="flex justify-between">
              <strong>{exp.jobTitle} at {exp.companyName}</strong>
              <span>{exp.startDate} - {exp.endDate}</span>
            </div>
            <div className="text-sm text-gray-600 mb-1">{exp.location}</div>
            <p className="text-sm">{exp.description}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-2 gap-6">
        <section>
          <h2 className="text-xl font-bold mb-2">Technical Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resumeData?.skills?.technical?.map((skill, index) => (
              <span key={index} className="text-sm bg-gray-100 px-2 py-1 rounded">
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Soft Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resumeData?.skills?.soft?.map((skill, index) => (
              <span key={index} className="text-sm bg-gray-100 px-2 py-1 rounded">
                {skill}
              </span>
            ))}
          </div>
        </section>
      </div>

      <section>
        <h2 className="text-xl font-bold mb-2">Projects</h2>
        {resumeData?.projects?.map((project, index) => (
          <div key={index} className="mb-3">
            <div className="font-semibold">{project.name}</div>
            <p className="text-sm">{project.description}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-2 gap-6">
        <section>
          <h2 className="text-xl font-bold mb-2">Certifications</h2>
          {resumeData?.certifications?.map((cert, index) => (
            <div key={index} className="mb-2">
              <div className="font-semibold">{cert.name}</div>
              <div className="text-sm text-gray-600">
                {cert.issuer} • {cert.date}
              </div>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-xl font-bold mb-2">Achievements</h2>
          {resumeData?.achievements?.map((achievement, index) => (
            <div key={index} className="mb-2">
              <div className="font-semibold">{achievement.name}</div>
              <div className="text-sm text-gray-600">
                {achievement.issuer} • {achievement.date}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  </div>
);

  const ProfessionalTemplate = () => (
    <div className="max-w-4xl mx-auto bg-white">
      {/* Header Section */}
      <header className="mb-8 bg-gray-800 text-white p-6">
        <h1 className="text-4xl font-bold mb-2">{resumeData?.contactInformation?.fullName}</h1>
        <p className="text-gray-300 mb-4">{resumeData?.professionalSummary}</p>
        <div className="flex flex-wrap gap-6 text-sm">
          <span className="flex items-center"><FaEnvelope className="mr-2" />{resumeData?.contactInformation?.email}</span>
          <span className="flex items-center"><FaPhone className="mr-2" />{resumeData?.contactInformation?.phoneNumber}</span>
          <span className="flex items-center"><FaMapMarkerAlt className="mr-2" />{resumeData?.contactInformation?.address}</span>
        </div>
      </header>
  
        <div className="flex w-full flex-col pr-3 border-r border-gray-600">
          {/* Education Section */}
          <div className="pb-2 border-b border-gray-600">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Education</h3>
            <div className="space-y-6">
              {resumeData?.education?.map((edu, index) => (
                <p key={index} className="text-gray-700">
                  <li>
                    {edu.graduationYear > currentYear ? (
                      `Currently pursuing ${edu.degree} from ${edu.institution}, expected to graduate in ${edu.graduationYear} with a current grade of ${edu.grade}.`
                    ) : edu.graduationYear < currentYear - 2 ? (
                      `Completed ${edu.degree} from ${edu.institution} in ${edu.graduationYear} with a grade of ${edu.grade}.`
                    ) : (
                      `Graduated with ${edu.degree} from ${edu.institution} in ${edu.graduationYear} with a grade of ${edu.grade}.`
                    )}
                  </li>
                </p>
              ))}
            </div>
          </div>
  
          {/* Work Experience Section */}
          <div className="py-2 border-b border-gray-600">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Work Experience</h3>
            <div className="space-y-6">
              {resumeData?.workExperience?.map((exp, index) => (
                <div key={index}>
                  <p className="text-gray-700 font-bold">
                    <li>
                      {exp.endDate.toLowerCase() === "present"
                        ? `${exp.jobTitle} at ${exp.companyName} (${exp.location}) since ${exp.startDate}.`
                        : `${exp.jobTitle} at ${exp.companyName} (${exp.location}) from ${exp.startDate} to ${exp.endDate}.`}
                    </li>
                  </p>
                  <p className="text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
  
          {/* Certifications Section */}
          <div className="py-2">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Certifications</h3>
            <div className="space-y-6">
              {resumeData?.certifications?.map((cert, index) => (
                <p key={index} className="text-gray-700">
                  <p className="font-bold">{cert.name}</p>{` issued by ${cert.issuer} on ${cert.date}.`}
                </p>
              ))}
            </div>
          </div>
  
        <div className="w-full flex flex-col pl-3">
          {/* Skills Section */}
          <div className="py-2 border-b border-gray-600">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Skills</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-700">Technical Skills</h4>
                <ul className="list-disc list-inside text-gray-700">
                  {resumeData?.skills?.technical?.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700">Soft Skills</h4>
                <ul className="list-disc list-inside text-gray-700">
                  {resumeData?.skills?.soft?.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
  
          {/* Projects Section */}
          <div className="py-2 border-b border-gray-600">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Projects</h3>
            <div className="space-y-6">
              {resumeData?.projects?.map((project, index) => (
                <p key={index} className="text-gray-700">
                  <p className="font-bold">{project.name}:</p>{` ${project.description}`}
                </p>
              ))}
            </div>
          </div>
  
          {/* Achievements Section */}
          <div className="py-2">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Achievements</h3>
            <div className="space-y-6">
              {resumeData?.achievements?.map((ach, index) => (
                <p key={index} className="text-gray-700">
                  <p className="font-bold">{ach.name}</p>{` issued by ${ach.issuer} on ${ach.date}.`}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case "modern":
        return <ModernTemplate />;
      case "minimal":
        return <MinimalistTemplate />;
      case "compact":
        return <CompactTemplate />;
      case "professional":
        return <ProfessionalTemplate />;
      default:
        return <ModernTemplate />;
    }
  };

  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        const docRef = doc(db, "userProfiles", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setResumeData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching resume data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResumeData();
  }, [userId]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8 flex space-x-4">
        <div className="flex items-center">
          <FaPalette className="mr-2" />
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {Object.entries(templates).map(([key, template]) => (
              <option key={key} value={key}>
                {template.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <FaFont className="mr-2" />
          <select
            value={selectedFont}
            onChange={(e) => setSelectedFont(e.target.value)}
            className="border rounded px-3 py-2"
          >
            {Object.entries(fonts).map(([key, font]) => (
              <option key={key} value={key}>
                {font.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className={`${templates[selectedTemplate].className} ${fonts[selectedFont].className}`}>
        {renderTemplate()}
      </div>
    </div>
  );
};

export default ResumeBuilder;