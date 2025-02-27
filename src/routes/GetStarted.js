import React, { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import ContactInfoSection from "../components/profile/ContactInfo";
import ProfessionalSummarySection from "../components/profile/ProfessionalSummary";
import SkillsSection from "../components/profile/Skills";
import WorkExperienceSection from "../components/profile/WorkExperience";
import EducationSection from "../components/profile/Education";
import CertificationsSection from "../components/profile/Certifications";
import ProjectsSection from "../components/profile/Projects";
import AchievementsSection from "../components/profile/Achievements";

const CreateProfile = ({ userId: propUserId }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [showFinishPopup, setShowFinishPopup] = useState(false);
  const [processingState, setProcessingState] = useState("");
  const [userId, setUserId] = useState(propUserId || null);
  const [formData, setFormData] = useState({
    contactInformation: { fullName: "", phoneNumber: "", email: "", address: "" },
    professionalSummary: "",
    skills: [],
    workExperience: [],
    education: [],
    certifications: [],
    projects: [],
    achievements: [],
  });

  // Get userId from Firebase Auth if not provided as prop
  useEffect(() => {
    if (!userId) {
      const auth = getAuth();
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          console.log("User authenticated:", user.uid);
          setUserId(user.uid);
        } else {
          console.log("No user is signed in");
          setSaveError("You need to be logged in to create a profile. Please sign in first.");
        }
      });
      
      return () => unsubscribe();
    }
  }, [userId]);

  const steps = [
    { name: "Contact Information", component: <ContactInfoSection formData={formData} setFormData={setFormData} /> },
    { name: "Professional Summary", component: <ProfessionalSummarySection formData={formData} setFormData={setFormData} /> },
    { name: "Skills", component: <SkillsSection formData={formData} setFormData={setFormData} /> },
    { name: "Work Experience", component: <WorkExperienceSection formData={formData} setFormData={setFormData} /> },
    { name: "Education", component: <EducationSection formData={formData} setFormData={setFormData} /> },
    { name: "Certifications", component: <CertificationsSection formData={formData} setFormData={setFormData} /> },
    { name: "Projects", component: <ProjectsSection formData={formData} setFormData={setFormData} /> },
    { name: "Achievements", component: <AchievementsSection formData={formData} setFormData={setFormData} /> },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleSaveProgress = async () => {
    if (!userId) {
      console.error("Error: userId is not defined or null", { userId });
      setSaveError("User ID is missing. Please ensure you're logged in.");
      return false;
    }

    setSaving(true);
    setSaveError(null);
    setProcessingState("Saving profile data...");
    console.log("Attempting to save profile data for user:", userId);
    console.log("Form data being saved:", formData);

    try {
      const profileRef = doc(db, "userProfiles", userId);
      
      // Using setDoc with merge option to create the document if it doesn't exist
      setProcessingState("Creating/updating document in Firestore...");
      await setDoc(profileRef, formData, { merge: true });
      console.log("Profile saved successfully");
      
      setProcessingState("Save completed successfully");
      return true;
    } catch (err) {
      console.error("Error saving progress:", err);
      console.error("Error details:", { 
        code: err.code,
        message: err.message,
        stack: err.stack,
        userId: userId,
        formDataKeys: Object.keys(formData)
      });
      
      let errorMessage = "Failed to save profile data. ";
      
      if (err.code === "permission-denied") {
        errorMessage += "You don't have permission to update this profile.";
      } else {
        errorMessage += err.message || "Unknown error occurred.";
      }
      
      setSaveError(errorMessage);
      setProcessingState("Error occurred during save");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleFinish = async () => {
    console.log("Finish button clicked");
    
    if (!userId) {
      console.error("Cannot finish: userId is not defined");
      setSaveError("You need to be logged in to save your profile. Please sign in and try again.");
      return;
    }
    
    try {
      setProcessingState("Starting finish process");
      console.log("Current user ID:", userId);
      
      console.log("Attempting to save data before showing popup");
      const saveSuccessful = await handleSaveProgress();
      console.log("Save result:", saveSuccessful);
      
      if (saveSuccessful) {
        console.log("Setting popup to visible");
        setShowFinishPopup(true);
      } else {
        console.error("Save was not successful, not showing popup");
      }
    } catch (err) {
      console.error("Error in handleFinish function:", err);
      setSaveError(`An unexpected error occurred: ${err.message}`);
      setProcessingState("Error in finish process");
    }
  };

  // For demonstration purposes if no user is logged in
  const handleFinishDemo = () => {
    console.log("Demo finish button clicked");
    setShowFinishPopup(true);
  };

  const navigateToDashboard = () => {
    console.log("Navigating to dashboard");
    navigate("/jobseeker-dashboard");
  };

  const navigateToResume = () => {
    console.log("Navigating to resume view");
    navigate("/jobseeker-dashboard");
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Build Your Professional Profile</h1>

      {/* Debug info - remove in production */}
      {process.env.NODE_ENV !== "production" && (
        <div className="mb-4 p-2 bg-yellow-100 border border-yellow-300 rounded">
          <p className="text-xs font-mono">Debug Info:</p>
          <p className="text-xs font-mono">User ID: {userId || "not set"}</p>
          <p className="text-xs font-mono">Current State: {processingState}</p>
          <p className="text-xs font-mono">Current Step: {currentStep + 1}/{steps.length}</p>
          <p className="text-xs font-mono">Popup Visible: {showFinishPopup ? "Yes" : "No"}</p>
        </div>
      )}

      {/* User not logged in warning */}
      {!userId && (
        <div className="mb-4 p-3 bg-orange-100 border border-orange-300 rounded">
          <p className="font-bold text-orange-800">⚠️ You are not logged in</p>
          <p className="text-orange-800">You need to be logged in to save your profile. You can continue filling out the form, but your progress won't be saved.</p>
        </div>
      )}

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
      </div>

      {/* Step indicator */}
      <div className="flex justify-between mb-8">
        <p>
          Step {currentStep + 1} of {steps.length}: {steps[currentStep].name}
        </p>
        <button 
          onClick={handleSaveProgress} 
          className={`text-blue-600 hover:text-blue-800 ${!userId ? 'opacity-50 cursor-not-allowed' : ''}`} 
          disabled={saving || !userId}
        >
          {saving ? "Saving..." : "Save Progress"}
        </button>
      </div>

      {saveError && (
        <div className="text-red-500 mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="font-bold">Error:</p>
          <p>{saveError}</p>
        </div>
      )}

      {/* Current step component */}
      <div className="mb-8">{steps[currentStep].component}</div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className={`px-4 py-2 rounded ${currentStep === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-gray-500 text-white hover:bg-gray-600"}`}
        >
          Previous
        </button>

        <button onClick={handleSkip} className="px-4 py-2 text-gray-600 hover:text-gray-800">
          Skip for now
        </button>

        {currentStep < steps.length - 1 ? (
          <button onClick={handleNext} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Next
          </button>
        ) : (
          <button 
            onClick={userId ? handleFinish : handleFinishDemo} 
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            disabled={saving}
          >
            {saving ? "Saving..." : "Finish"}
          </button>
        )}
      </div>

      {/* Finish Popup */}
      {showFinishPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Profile Created Successfully!</h2>
            <p className="mb-6">
              {userId 
                ? "Your professional profile has been created. What would you like to do next?" 
                : "Demo mode: Your profile would have been created if you were logged in. What would you like to do next?"}
            </p>
            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
              <button
                onClick={navigateToDashboard}
                className="w-full sm:w-1/2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Go to Dashboard
              </button>
              <button
                onClick={navigateToResume}
                className="w-full sm:w-1/2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                View My Resume
              </button>
            </div>
            <button
              onClick={() => setShowFinishPopup(false)}
              className="mt-4 w-full px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProfile;