import React from 'react';
import PropTypes from 'prop-types';

const ResumeTemplate1 = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg">
      {/* Header Section */}
      <header className="border-b-2 border-gray-300 pb-4 mb-6 w-full text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">{data.contactInformation.fullName}</h1>
          <p className="text-xl text-gray-600 mt-1">{data.professionalSummary}</p>
          <p>Email: {data.contactInformation.email}</p>
          <p>Contact: {data.contactInformation.phoneNumber}</p>
          <p>Address: {data.contactInformation.address}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {/* Skills Section */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 border-b border-gray-300 pb-1 mb-2">
              Skills
            </h2>
            <div className="space-y-2">
              <h3 className="font-medium text-gray-700">Hard Skills</h3>
              <ul className="list-disc list-inside text-gray-600">
                {data.skills.technical.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
              <h3 className="font-medium text-gray-700 mt-3">Soft Skills</h3>
              <ul className="list-disc list-inside text-gray-600">
                {data.skills.soft.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* Education Section */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 border-b border-gray-300 pb-1 mb-2">
              Education
            </h2>
            <ul className="space-y-2 text-gray-600">
              {data.education.map((entry, index) => (
                <li key={index}>{entry.degree} - {entry.institution} ({entry.graduationYear})</li>
              ))}
            </ul>
          </section>
        </div>

        <div>
          {/* Certifications Section */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 border-b border-gray-300 pb-1 mb-2">
              Certifications
            </h2>
            <ul className="space-y-2">
              {data.certifications.map((cert, index) => (
                <li key={index}>
                  <h3 className="font-medium text-gray-700">{cert.name}</h3>
                  <p className="text-sm text-gray-600">{cert.issuer}</p>
                  <p className="text-sm text-gray-500">{cert.date}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Work Experience Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 border-b border-gray-300 pb-1 my-4">
              Work Experience
            </h2>
            <ul className="space-y-6">
              {data.workExperience.map((exp, index) => (
                <li key={index}>
                  <h3 className="text-lg font-semibold text-gray-800">{exp.companyName} - {exp.jobTitle}</h3>
                  <p className="text-gray-600 italic">{exp.location} ({exp.startDate} - {exp.endDate})</p>
                  <ul className="list-disc list-inside text-gray-700">
                    {exp.accomplishments.map((accomplishment, index) => (
                      <li key={index}>{accomplishment}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>

          {/* Projects Section */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 border-b border-gray-300 pb-1 mb-2">
              Projects
            </h2>
            <ul className="space-y-2">
              {data.projects.map((project, index) => (
                <li key={index}>
                  <h3 className="font-medium text-gray-700">{project.name}</h3>
                  <p className="text-sm text-gray-600">{project.description}</p>
                  <p className="text-sm text-gray-500">Role: {project.role}</p>
                  <p className="text-sm text-gray-500">Technologies: {project.technologies}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Achievements Section */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-700 border-b border-gray-300 pb-1 my-4">
              Achievements
            </h2>
            <ul className="space-y-2">
              {data.achievements.map((achievement, index) => (
                <li key={index}>
                  <h3 className="font-medium text-gray-700">{achievement.name}</h3>
                  <p className="text-sm text-gray-600">{achievement.issuer}</p>
                  <p className="text-sm text-gray-500">{achievement.date}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

// Prop Types Validation
ResumeTemplate1.propTypes = {
  data: PropTypes.shape({
    contactInformation: PropTypes.shape({
      fullName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phoneNumber: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
    }).isRequired,
    professionalSummary: PropTypes.string.isRequired,
    skills: PropTypes.shape({
      technical: PropTypes.arrayOf(PropTypes.string).isRequired,
      soft: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    education: PropTypes.arrayOf(
      PropTypes.shape({
        degree: PropTypes.string.isRequired,
        institution: PropTypes.string.isRequired,
        graduationYear: PropTypes.string.isRequired,
      })
    ).isRequired,
    certifications: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        issuer: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
    workExperience: PropTypes.arrayOf(
      PropTypes.shape({
        companyName: PropTypes.string.isRequired,
        jobTitle: PropTypes.string.isRequired,
        location: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
        accomplishments: PropTypes.arrayOf(PropTypes.string).isRequired,
      })
    ).isRequired,
    projects: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        technologies: PropTypes.arrayOf(PropTypes.string).isRequired,
      })
    ).isRequired,
    achievements: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        issuer: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

const ResumeTemplate2 = ({ data }) => {
  return (
    <div className="max-w-3xl mx-auto p-8 bg-gray-50 shadow-lg">
      {/* Header Section */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">{data.contactInformation.fullName}</h1>
        <p className="text-lg text-gray-600 mt-1">{data.professionalSummary}</p>
        <div className="mt-4">
          <p className="text-gray-600">Email: {data.contactInformation.email}</p>
          <p className="text-gray-600">Phone: {data.contactInformation.phoneNumber}</p>
          <p className="text-gray-600">Address: {data.contactInformation.address}</p>
        </div>
      </header>

      {/* Skills Section */}
      <section className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">Skills</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-medium text-gray-700">Technical Skills</h3>
            <ul className="list-disc pl-6">
              {data.skills.technical.map((skill, index) => (
                <li key={index} className="text-gray-600">{skill}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-medium text-gray-700">Soft Skills</h3>
            <ul className="list-disc pl-6">
              {data.skills.soft.map((skill, index) => (
                <li key={index} className="text-gray-600">{skill}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Work Experience Section */}
      <section className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">Work Experience</h2>
        {data.workExperience.map((exp, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-2xl font-semibold text-gray-800">{exp.companyName} - {exp.jobTitle}</h3>
            <p className="text-gray-600 italic">{exp.location} | {exp.startDate} - {exp.endDate}</p>
            <ul className="list-disc pl-6 mt-2">
              {exp.accomplishments.map((accomplishment, index) => (
                <li key={index} className="text-gray-600">{accomplishment}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Education Section */}
      <section className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">Education</h2>
        <ul className="list-none">
          {data.education.map((entry, index) => (
            <li key={index} className="text-gray-600">
              {entry.degree} from {entry.institution} ({entry.graduationYear})
            </li>
          ))}
        </ul>
      </section>

      {/* Certifications Section */}
      <section className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">Certifications</h2>
        <ul className="list-none">
          {data.certifications.map((cert, index) => (
            <li key={index} className="text-gray-600">
              <strong>{cert.name}</strong> - {cert.issuer} ({cert.date})
            </li>
          ))}
        </ul>
      </section>

      {/* Projects Section */}
      <section className="mb-8">
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">Projects</h2>
        {data.projects.map((project, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-2xl font-semibold text-gray-800">{project.name}</h3>
            <p className="text-gray-600">{project.description}</p>
            <p className="text-gray-600"><strong>Role:</strong> {project.role}</p>
            <p className="text-gray-600"><strong>Technologies:</strong> {project.technologies.join(', ')}</p>
          </div>
        ))}
      </section>

      {/* Achievements Section */}
      <section>
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">Achievements</h2>
        <ul className="list-none">
          {data.achievements.map((achievement, index) => (
            <li key={index} className="text-gray-600">
              <strong>{achievement.name}</strong> - {achievement.issuer} ({achievement.date})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ResumeTemplate2;

const ResumeTemplate3 = ({ data }) => {
  return (
    <div className="max-w-3xl mx-auto p-8 bg-gray-50 shadow-xl">
      {/* Header Section */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">{data.contactInformation.fullName}</h1>
        <p className="text-lg text-gray-600 mt-2">{data.contactInformation.email} | {data.contactInformation.phoneNumber}</p>
        <p className="text-lg text-gray-600">{data.contactInformation.address}</p>
      </header>

      {/* Skills Section */}
      <section className="grid grid-cols-2 gap-12 mb-12">
        <div>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Technical Skills</h2>
          <ul className="list-disc pl-6">
            {data.skills.technical.map((skill, index) => (
              <li key={index} className="text-gray-600">{skill}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Soft Skills</h2>
          <ul className="list-disc pl-6">
            {data.skills.soft.map((skill, index) => (
              <li key={index} className="text-gray-600">{skill}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Work Experience Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Work Experience</h2>
        {data.workExperience.map((exp, index) => (
          <div key={index} className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800">{exp.companyName} - {exp.jobTitle}</h3>
            <p className="text-gray-600">{exp.location} | {exp.startDate} - {exp.endDate}</p>
            <ul className="list-disc pl-6 mt-2">
              {exp.accomplishments.map((accomplishment, index) => (
                <li key={index} className="text-gray-600">{accomplishment}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* Education Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Education</h2>
        <ul className="list-none">
          {data.education.map((entry, index) => (
            <li key={index} className="text-gray-600">
              <strong>{entry.degree}</strong> - {entry.institution} ({entry.graduationYear})
            </li>
          ))}
        </ul>
      </section>

      {/* Certifications Section */}
      <section>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Certifications</h2>
        <ul className="list-none">
          {data.certifications.map((cert, index) => (
            <li key={index} className="text-gray-600">
              <strong>{cert.name}</strong> - {cert.issuer} ({cert.date})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export { ResumeTemplate1, ResumeTemplate2, ResumeTemplate3 };