import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const jobData = {
  "full-stack-developer": {
    title: "Full Stack Developer",
    description: "Build scalable web applications by working on both frontend and backend technologies like React, Node.js, and databases.",
    responsibilities: [
      "Develop frontend with React, Angular, or Vue.js.",
      "Build backend using Node.js, Express.js, or Django.",
      "Manage databases like MongoDB, MySQL, or Firebase.",
      "Ensure responsiveness and optimize performance.",
      "Integrate APIs and third-party services."
    ],
    skills: [
      "HTML, CSS, JavaScript, React, Angular",
      "Backend frameworks (Node.js, Express.js, Django)",
      "Database management (SQL, NoSQL, Firebase)",
      "Version control (Git, GitHub, GitLab)",
      "Cloud services (AWS, Google Cloud, Firebase)"
    ]
  },
  "ai-ml-engineer": {
    title: "AI/ML Engineer",
    description: "Develop and deploy AI/ML models using Python, TensorFlow, PyTorch, and data science techniques.",
    responsibilities: [
      "Train and fine-tune AI models using Python.",
      "Implement deep learning solutions using TensorFlow and PyTorch.",
      "Optimize machine learning pipelines.",
      "Process and analyze large datasets.",
      "Deploy models using cloud services like AWS and GCP."
    ],
    skills: [
      "Machine Learning & Deep Learning",
      "Python, TensorFlow, PyTorch",
      "Big Data Processing (Hadoop, Spark)",
      "Cloud Computing & Deployment",
      "Data Science & Analytics"
    ]
  },
  "cloud-devops-engineer": {
    title: "Cloud & DevOps Engineer",
    description: "Manage and automate cloud infrastructure using AWS, Azure, Kubernetes, and Terraform.",
    responsibilities: [
      "Design and deploy scalable cloud infrastructure.",
      "Implement CI/CD pipelines using Jenkins, GitHub Actions.",
      "Monitor system performance and security.",
      "Manage Kubernetes clusters and containerized applications.",
      "Automate infrastructure with Terraform and Ansible."
    ],
    skills: [
      "Cloud Platforms (AWS, Azure, GCP)",
      "Infrastructure as Code (Terraform, Ansible)",
      "CI/CD Tools (Jenkins, GitHub Actions)",
      "Containerization (Docker, Kubernetes)",
      "Networking & Security"
    ]
  },
  "software-engineer": {
    title: "Software Engineer",
    description: "Design, develop, and maintain software applications using various programming languages.",
    responsibilities: [
      "Write clean and maintainable code.",
      "Develop applications using Java, Python, or C++.",
      "Work with databases and backend APIs.",
      "Optimize application performance.",
      "Collaborate with cross-functional teams."
    ],
    skills: [
      "Programming (Java, Python, C++)",
      "Database Management (SQL, NoSQL)",
      "Software Development Life Cycle (SDLC)",
      "Version Control (Git, GitHub)",
      "Problem-Solving & Algorithms"
    ]
  }
};

const JobDetails = () => {
  const [selectedJob, setSelectedJob] = useState("full-stack-developer");
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 min-h-screen p-6 flex flex-col items-center">
      {/* Back Button */}
      <button 
        onClick={() => navigate("/")} 
        className="absolute top-4 left-4 px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-700 transition"
      >
        ← Back to Home
      </button>

      {/* Job Role Cards */}
      <div className="flex space-x-4 overflow-x-auto p-4 w-full max-w-4xl">
        {Object.keys(jobData).map((jobKey) => (
          <div 
            key={jobKey}
            className={`flex-shrink-0 w-48 p-4 rounded-lg shadow-md cursor-pointer transition-all duration-300 ${
              selectedJob === jobKey ? "bg-blue-500 text-white scale-105" : "bg-white"
            }`}
            onClick={() => setSelectedJob(jobKey)}
          >
            <h3 className="text-lg font-semibold">{jobData[jobKey].title}</h3>
          </div>
        ))}
      </div>

      {/* Job Details */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-blue-600">{jobData[selectedJob].title}</h1>
        <p className="text-lg mt-2 text-gray-700">{jobData[selectedJob].description}</p>

        {/* Responsibilities Section */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-blue-500">Key Responsibilities</h2>
          <ul className="list-disc list-inside mt-2 text-gray-700">
            {jobData[selectedJob].responsibilities.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        {/* Skills Section */}
        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-blue-500">Required Skills</h2>
          <ul className="list-disc list-inside mt-2 text-gray-700">
            {jobData[selectedJob].skills.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;