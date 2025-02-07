import React, { useRef, useState, useEffect } from 'react';
import { ResumeTemplate1, ResumeTemplate2, ResumeTemplate3 } from './ResumeTemplates';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';

const ResumeViewer = ({ data, setData }) => {
  const navigate = useNavigate();
  const resumeRef = useRef();
  const [selectedTemplate, setSelectedTemplate] = useState('template1');

  // Load saved state from localStorage when component mounts
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('resumeData'));
    const savedTemplate = localStorage.getItem('selectedTemplate');
  
    if (savedData) {
      // Directly set the state within ResumeViewer
      setSelectedTemplate(savedTemplate || 'template1');
    }
  }, []);
  

  const handleDownloadPDF = async () => {
    const element = resumeRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('resume.pdf');
  };

  const handleGoBack = () => {
    // Save current state to localStorage
    localStorage.setItem('resumeData', JSON.stringify(data));
    localStorage.setItem('selectedTemplate', selectedTemplate);
    navigate('/resume-builder'); // Navigate back to the builder
  };

  const renderTemplate = () => {
    switch (selectedTemplate) {
      case 'template1':
        return <ResumeTemplate1 data={data} />;
      case 'template2':
        return <ResumeTemplate2 data={data} />;
      case 'template3':
        return <ResumeTemplate3 data={data} />;
      default:
        return <ResumeTemplate1 data={data} />;
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <label htmlFor="template-selector" className="mr-2 text-gray-700 font-semibold">
          Select Template:
        </label>
        <select
          id="template-selector"
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
          className="px-3 py-2 border rounded shadow"
        >
          <option value="template1">Template 1</option>
          <option value="template2">Template 2</option>
          <option value="template3">Template 3</option>
        </select>
      </div>

      <div ref={resumeRef} className="border p-4 rounded shadow">
        {renderTemplate()}
      </div>

      <div className="mt-4">
        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 mr-4"
        >
          Download PDF
        </button>
        <button
          onClick={handleGoBack}
          className="px-4 py-2 bg-gray-500 text-white rounded shadow hover:bg-gray-600"
        >
          Go Back to Builder
        </button>
      </div>
    </div>
  );
};

export default ResumeViewer;
