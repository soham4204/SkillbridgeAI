import React, { useState } from "react";

const CertificationsSection = ({ formData, setFormData }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleChange = (index, field, value) => {
    const updatedCertifications = [...formData.certifications];
    updatedCertifications[index] = {
      ...updatedCertifications[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      certifications: updatedCertifications,
    });
  };

  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [
        ...formData.certifications,
        {
          name: "",
          issuer: "",
          date: "",
        },
      ],
    });
    setExpandedIndex(formData.certifications.length);
  };

  const removeCertification = (index) => {
    const updatedCertifications = [...formData.certifications];
    updatedCertifications.splice(index, 1);
    setFormData({
      ...formData,
      certifications: updatedCertifications,
    });
    setExpandedIndex(null);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Certifications</h2>
      <p className="mb-4 text-gray-600">Add professional certifications or licenses you've earned.</p>
      
      <div className="space-y-6">
        {formData.certifications.map((cert, index) => (
          <div key={index} className="border border-gray-300 rounded p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {cert.name ? cert.name : ``}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {expandedIndex === index ? "Collapse" : "Expand"}
                </button>
                <button
                  onClick={() => removeCertification(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            </div>
            
            {(expandedIndex === index || formData.certifications.length === 1) && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name</label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => handleChange(index, "name", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="e.g., AWS Certified Solutions Architect"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Issuing Organization</label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => handleChange(index, "issuer", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                      placeholder="e.g., Amazon Web Services"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Issued</label>
                    <input
                      type="month"
                      value={cert.date}
                      onChange={(e) => handleChange(index, "date", e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        <button
          onClick={addCertification}
          className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 w-full"
        >
          + Add Certification
        </button>
      </div>
    </div>
  );
};

export default CertificationsSection;