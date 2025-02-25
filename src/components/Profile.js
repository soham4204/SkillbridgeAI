import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";

const ProfilePage = ({ userId }) => {
  const educationorder = [
    "degree",
    "institution",
    "location",
    "graduationYear",
    "grade",
  ];
  const workExperienceorder = [
    "companyName",
    "jobTitle",
    "startDate",
    "endDate",
    "location",
    "description",
    ];
  const projectorder = [
    "name", 
    "description", 
    "role", 
    "technologies"
    ];
//   const certificationorder = [
//     "name", 
//     "issuer", 
//     "date"
//     ];
//   const achievementorder = [
//     "name", 
//     "issuer", 
//     "date"
//     ];
  const [formData, setFormData] = useState({
    contactInformation: {
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
    },
    professionalSummary: "",
    skills: {
      technical: [""],
      soft: [""],
    },
    workExperience: [
      {
        companyName: "",
        location: "",
        jobTitle: "",
        startDate: "",
        endDate: "",
        description: [""],
      },
    ],
    education: [
      {
        degree: "",
        institution: "",
        location: "",
        graduationYear: "",
        grade: "",
      },
    ],
    certifications: [
      {
        name: "",
        issuer: "",
        date: "",
      },
    ],
    projects: [
      {
        name: "",
        description: "",
        role: "",
        technologies: [""],
      },
    ],
    achievements: [
      {
        name: "",
        issuer: "",
        date: "",
      },
    ],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;
  
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const profileRef = doc(db, "userProfiles", userId);
        const profileSnapshot = await getDoc(profileRef);
  
        if (profileSnapshot.exists()) {
          const data = profileSnapshot.data();
          setFormData((prevData) => ({
            ...prevData,
            ...data,
          }));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, [userId]);   

  const handleSave = async () => {
    if (!userId) {
      setError("No user ID provided");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const profileRef = doc(db, "userProfiles", userId);
      await setDoc(
        profileRef,
        {
          ...formData,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );

      setIsEditing(false);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError("Failed to save profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value, index = null) => {
    setFormData((prev) => {
      const newData = structuredClone(prev);

      if (index !== null) {
        if (!Array.isArray(newData[section])) {
          newData[section] = [];
        }
        if (!newData[section][index]) {
          newData[section][index] = {};
        }
        newData[section][index][field] = value;
      } else if (section === "skills") {
        newData.skills[field] = value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
      } else if (section === "contactInformation") {
        newData.contactInformation[field] = value;
      } else {
        newData[section] = value;
      }

      return newData;
    });
  };

  const addItem = (section) => {
    setFormData((prev) => {
      const newData = { ...prev };
      const emptyItem = getEmptyItem(section);
      newData[section] = [...(prev[section] || []), emptyItem];
      return newData;
    });
  };

  const removeItem = (section, index) => {
    setFormData((prev) => {
      const newData = { ...prev };
      newData[section] = prev[section].filter((_, i) => i !== index);
      return newData;
    });
  };

  const getEmptyItem = (section) => {
    const emptyItems = {
      workExperience: {
        companyName: "",
        location: "",
        jobTitle: "",
        startDate: "",
        endDate: "",
        accomplishments: [""],
      },
      education: {
        degree: "",
        institution: "",
        location: "",
        graduationYear: "",
        grade: "",
      },
      certifications: {
        name: "",
        issuer: "",
        date: "",
      },
      projects: {
        name: "",
        description: "",
        role: "",
        technologies: [""],
      },
      achievements: {
        name: "",
        issuer: "",
        date: "",
      },
    };
    return emptyItems[section] || {};
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2">Loading...</p>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        <div>
          {isEditing ? (
            <div className="space-x-2">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* Contact Information */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(formData.contactInformation).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      handleInputChange(
                        "contactInformation",
                        key,
                        e.target.value
                      )
                    }
                    className="w-full p-2 border rounded"
                  />
                ) : (
                  <p className="text-gray-800">{value}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Professional Summary */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">
            Describe yourself in a line
          </h2>
          {isEditing ? (
            <textarea
              value={formData.professionalSummary}
              onChange={(e) =>
                handleInputChange("professionalSummary", null, e.target.value)
              }
              className="w-full p-2 border rounded h-32"
            />
          ) : (
            <p className="text-gray-800">{formData.professionalSummary}</p>
          )}
        </section>

        {/* Skills */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Skills</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Technical Skills
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.skills.technical.join(", ")}
                  onChange={(e) =>
                    handleInputChange("skills", "technical", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Separate skills with commas"
                />
              ) : (
                <p className="text-gray-800">
                  {formData.skills.technical.join(", ")}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Soft Skills
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.skills.soft.join(", ")}
                  onChange={(e) =>
                    handleInputChange("skills", "soft", e.target.value)
                  }
                  className="w-full p-2 border rounded"
                  placeholder="Separate skills with commas"
                />
              ) : (
                <p className="text-gray-800">
                  {formData.skills.soft.join(", ")}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Education</h2>
            {isEditing && (
              <button
                onClick={() => addItem("education")}
                className="text-blue-500"
              >
                + Add Education
              </button>
            )}
          </div>
          <div className="space-y-6">
            {formData.education.map((edu, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                {isEditing && (
                  <button
                    onClick={() => removeItem("education", index)}
                    className="text-red-500 float-right"
                  >
                    Remove
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {educationorder.map((key) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={edu[key] || ""} // Ensure it doesn't break if a key is missing
                          onChange={(e) =>
                            handleInputChange(
                              "education",
                              key,
                              e.target.value,
                              index
                            )
                          }
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        <p className="text-gray-800">{edu[key]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Work Experience */}
        <section className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Work Experience</h2>
            {isEditing && (
              <button
                onClick={() => addItem("workExperience")}
                className="text-blue-500"
              >
                + Add Experience
              </button>
            )}
          </div>
          <div className="space-y-6">
            {formData.workExperience.map((exp, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                {isEditing && (
                  <button
                    onClick={() => removeItem("workExperience", index)}
                    className="text-red-500 float-right"
                  >
                    Remove
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {workExperienceorder.map((key) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={exp[key] || ""} 
                          onChange={(e) =>
                            handleInputChange(
                              "workExperience",
                              key,
                              e.target.value,
                              index
                            )
                          }
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        <p className="text-gray-800">{exp[key]}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Projects</h2>
            {isEditing && (
              <button
                onClick={() => addItem("projects")}
                className="text-blue-500"
              >
                + Add Project
              </button>
            )}
          </div>
          <div className="space-y-6">
            {formData.projects.map((project, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                {isEditing && (
                  <button
                    onClick={() => removeItem("projects", index)}
                    className="text-red-500 float-right"
                  >
                    Remove
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectorder.map((key) => (
                    <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    {isEditing ? (
                        key === "technologies" ? (
                        <input
                            type="text"
                            value={project[key]?.join(", ") || ""}
                            onChange={(e) =>
                            handleInputChange(
                                "projects",
                                key,
                                e.target.value.split(",").map((item) => item.trim()),
                                index
                            )
                            }
                            className="w-full p-2 border rounded"
                        />
                        ) : (
                        <input
                            type="text"
                            value={project[key] || ""}
                            onChange={(e) =>
                            handleInputChange("projects", key, e.target.value, index)
                            }
                            className="w-full p-2 border rounded"
                        />
                        )
                    ) : (
                        <p className="text-gray-800">
                        {Array.isArray(project[key]) ? project[key].join(", ") : project[key]}
                        </p>
                    )}
                    </div>
                ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Certifications</h2>
            {isEditing && (
              <button
                onClick={() => addItem("certifications")}
                className="text-blue-500"
              >
                + Add Certification
              </button>
            )}
          </div>
          <div className="space-y-6">
            {formData.certifications.map((cert, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                {isEditing && (
                  <button
                    onClick={() => removeItem("certifications", index)}
                    className="text-red-500 float-right"
                  >
                    Remove
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(cert).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={value}
                          onChange={(e) =>
                            handleInputChange(
                              "certifications",
                              key,
                              e.target.value,
                              index
                            )
                          }
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        <p className="text-gray-800">{value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements */}
        <section className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Achievements</h2>
            {isEditing && (
              <button
                onClick={() => addItem("achievements")}
                className="text-blue-500"
              >
                + Add Achievement
              </button>
            )}
          </div>
          <div className="space-y-6">
            {formData.achievements.map((achievement, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                {isEditing && (
                  <button
                    onClick={() => removeItem("achievements", index)}
                    className="text-red-500 float-right"
                  >
                    Remove
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(achievement).map(([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={value}
                          onChange={(e) =>
                            handleInputChange(
                              "achievements",
                              key,
                              e.target.value,
                              index
                            )
                          }
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        <p className="text-gray-800">{value}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Loading and Error States */}
      {isEditing && (
        <div className="fixed bottom-4 right-4 space-x-2">
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-6 py-2 rounded shadow hover:bg-green-600 transition-colors"
          >
            Save All Changes
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-500 text-white px-6 py-2 rounded shadow hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
