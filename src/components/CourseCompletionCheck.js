import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { doc,getDoc, updateDoc, arrayUnion, getFirestore } from 'firebase/firestore';

const CourseCompletionCheck = () => {
  const [testInProgress, setTestInProgress] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [showCertPopup, setShowCertPopup] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testScore, setTestScore] = useState(0);
  const [courseInfo, setCourseInfo] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [certificationData, setCertificationData] = useState({
    name: "",
    issuer: "",
    date: new Date().toISOString().split('T')[0],
    imageUrl: "",
    skills: [""]
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    // Check if there's a recently viewed course
    const lastViewedCourse = sessionStorage.getItem('lastViewedCourse');
    
    if (lastViewedCourse) {
      const parsedCourse = JSON.parse(lastViewedCourse);
      const currentTime = Date.now();
      const viewedTime = parsedCourse.timeStamp;
      
      // Only show popup if the course was viewed within the last 5 minutes
      if (currentTime - viewedTime < 5 * 60 * 1000) {
        setCourseInfo(parsedCourse);
        setCertificationData({
          ...certificationData,
          name: parsedCourse.title || "",
          issuer: parsedCourse.provider || "",
          skills: [parsedCourse.skill || ""]
        });
        
        // Set a timeout to show the popup after 30 seconds
        const timer = setTimeout(() => {
          setShowPopup(true);
        }, 6000); // 30 seconds
        
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Test questions based on the course content
  const testQuestions = [
    { question: "What is the primary function of a machine learning model?", options: ["Storing data", "Making predictions", "Rendering graphics", "Managing databases"], correctAnswer: 1 },
    { question: "Which algorithm is commonly used for classification problems?", options: ["Linear Regression", "K-Means Clustering", "Decision Trees", "Apriori"], correctAnswer: 2 },
    { question: "Which programming language is most commonly used for AI/ML?", options: ["Java", "Python", "C++", "JavaScript"], correctAnswer: 1 },
    { question: "What does 'overfitting' mean in machine learning?", options: ["Model performs poorly on training data", "Model performs well on training but poorly on new data", "Model is too simple", "Model ignores outliers"], correctAnswer: 1 },
    { question: "Which of the following is a supervised learning algorithm?", options: ["K-Means", "Random Forest", "PCA", "Apriori"], correctAnswer: 1 },
    { question: "What is a neural network?", options: ["A database system", "A hardware component", "A mathematical model inspired by the brain", "A type of cloud service"], correctAnswer: 2 },
    { question: "What does CNN stand for in deep learning?", options: ["Computer Neural Network", "Convolutional Neural Network", "Cascading Neural Network", "Central Neural Node"], correctAnswer: 1 },
    { question: "What is gradient descent used for?", options: ["Data visualization", "Feature extraction", "Optimizing model parameters", "Database indexing"], correctAnswer: 2 },
    { question: "What is the purpose of validation data in machine learning?", options: ["To train the model", "To test the final model", "To tune hyperparameters", "To clean the dataset"], correctAnswer: 2 },
    { question: "Which of these is NOT a common activation function?", options: ["ReLU", "Sigmoid", "Tanh", "QuickSort"], correctAnswer: 3 },
  ];

  const handleStartTest = () => {
    setTestInProgress(true);
    setShowPopup(false);
    sessionStorage.removeItem('lastViewedCourse');
  };

  // Handle selecting an answer
  const handleSelectAnswer = (questionIndex, answerIndex) => {
    setAnswers({
      ...answers,
      [questionIndex]: answerIndex
    });
  };

  // Handle navigating to the next question
  const handleNextQuestion = () => {
    if (currentQuestion < testQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score if at the last question
      calculateScore();
    }
  };

  // Handle navigating to the previous question
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Calculate the test score
  const calculateScore = () => {
    let correct = 0;
    testQuestions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });
    
    const percentage = (correct / testQuestions.length) * 100;
    setTestScore(percentage);
    setTestCompleted(true);
    
    if (percentage >= 70) {
      // Show certificate upload popup if score is 70% or higher (7 out of 10 questions)
      setShowCertPopup(true);
    }
  };

  // Handle image upload for certificate
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    setImageUploading(true);
    setError(null);

    try {
      // Mock image upload with setTimeout
      // In a real application, you would upload to your server/Cloudinary
      setTimeout(() => {
        // Create a dummy image URL (in a real app, this would be the uploaded image URL)
        const dummyImageUrl = URL.createObjectURL(file);
        
        // Update the certification image URL
        setCertificationData({
          ...certificationData,
          imageUrl: dummyImageUrl
        });
        
        setImageUploading(false);
      }, 1500);

    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
      setImageUploading(false);
    }
  };

  const handleSaveCertification = async () => {
    try {
        setLoading(true);
        setError(null);

        // Check if user is authenticated
        const currentUser = auth.currentUser;
        if (!currentUser) {
            setError('You must be logged in to save your certificate.');
            setLoading(false);
            return;
        }

        // Reference to the user's profile document
        const userProfileRef = doc(db, 'userProfiles', currentUser.uid);
        const userProfileSnap = await getDoc(userProfileRef);

        if (!userProfileSnap.exists()) {
            setError('User profile not found.');
            setLoading(false);
            return;
        }

        // Get current skills from user profile
        const userProfileData = userProfileSnap.data();
        const existingSkills = userProfileData.skills?.technical || [];

        // Prepare certificate data to save
        const certificateToSave = {
            ...certificationData,
            completionDate: new Date().toISOString(),
            score: testScore,
            courseId: courseInfo?.id || null,
            timestamp: new Date().getTime()
        };

        // Extract new skills from the certification
        const newSkills = certificationData.skills || [];

        // Merge and remove duplicates
        const updatedSkills = Array.from(new Set([...existingSkills, ...newSkills]));

        // Update the user profile document
        await updateDoc(userProfileRef, {
            certifications: arrayUnion(certificateToSave),
            "skills.technical": updatedSkills // Store skills inside `skills.technical`
        });

        // Close the certification popup
        setShowCertPopup(false);
        setTestInProgress(false);
        setTestCompleted(false);

        // Show success message
        alert('Certification and skills updated successfully!');
        navigate('/jobseeker-dashboard');

        setLoading(false);
    } catch (err) {
        console.error('Error saving certification:', err);
        setError(`Failed to save certification: ${err.message}`);
        setLoading(false);
    }
};

  // If no popup or test is active, don't render anything
  if (!showPopup && !testInProgress) return null;

  return (
    <>
      {/* Initial popup asking if course is complete */}
      {showPopup && !testInProgress && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Course Complete?</h3>
            <p className="text-gray-600 mb-4">
              Have you completed "{courseInfo?.title || 'the course'}"? Take the competency test and upload your certification to showcase your skills!
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setShowPopup(false);
                  sessionStorage.removeItem('lastViewedCourse');
                }}
              >
                Not Yet
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={handleStartTest}
              >
                Take Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test questions */}
      {testInProgress && !testCompleted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Knowledge Assessment
              </h3>
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                Question {currentQuestion + 1} of {testQuestions.length}
              </span>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-4">{testQuestions[currentQuestion].question}</h4>
              <div className="space-y-3">
                {testQuestions[currentQuestion].options.map((option, index) => (
                  <div 
                    key={index}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      answers[currentQuestion] === index 
                        ? 'bg-blue-50 border-blue-500' 
                        : 'hover:bg-gray-50 border-gray-300'
                    }`}
                    onClick={() => handleSelectAnswer(currentQuestion, index)}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                        answers[currentQuestion] === index 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-400'
                      }`}>
                        {answers[currentQuestion] === index && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button 
                className={`px-4 py-2 border border-gray-300 rounded-md text-gray-700 ${
                  currentQuestion === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </button>
              <button 
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                  answers[currentQuestion] === undefined ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleNextQuestion}
                disabled={answers[currentQuestion] === undefined}
              >
                {currentQuestion === testQuestions.length - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test result */}
      {testCompleted && !showCertPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center ${
                testScore >= 70 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <span className={`text-2xl font-bold ${
                  testScore >= 70 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {Math.round(testScore)}%
                </span>
              </div>
              <h3 className="text-xl font-bold mt-4 mb-2">
                {testScore >= 70 ? 'Congratulations!' : 'Almost there!'}
              </h3>
              <p className="text-gray-600">
                {testScore >= 70 
                  ? 'You passed the assessment! You can now receive your certificate.' 
                  : 'You need to score at least 70% to pass. Review the material and try again.'}
              </p>
            </div>
            
            <div className="flex justify-center">
              {testScore >= 70 ? (
                <button 
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  onClick={() => setShowCertPopup(true)}
                >
                  Get Certificate
                </button>
              ) : (
                <button 
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  onClick={() => {
                    setTestCompleted(false);
                    setTestInProgress(false);
                    setCurrentQuestion(0);
                    setAnswers({});
                    navigate('/jobseeker-dashboard');
                  }}
                >
                  Review & Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Certificate upload popup */}
      {showCertPopup && (
  <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-8 animate-fadeIn">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">
            <span className="text-blue-600">🎉</span> You Passed the Test!
          </h3>
          <p className="text-gray-500">Document your achievement with a certificate</p>
        </div>
        <button 
          onClick={() => setShowCertPopup(false)}
          className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Form Fields */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Name</label>
          <input
            type="text"
            value={certificationData.name}
            onChange={(e) => setCertificationData({...certificationData, name: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="e.g., Machine Learning Fundamentals"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Issuing Organization</label>
            <input
              type="text"
              value={certificationData.issuer}
              onChange={(e) => setCertificationData({...certificationData, issuer: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="e.g., Coursera"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Issued</label>
            <input
              type="date"
              value={certificationData.date}
              onChange={(e) => setCertificationData({...certificationData, date: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Skills Learned</label>
          <input
            type="text"
            value={certificationData.skills.join(", ")}
            onChange={(e) => {
              const skillsArray = e.target.value.split(",").map(skill => skill.trim()).filter(Boolean);
              setCertificationData({...certificationData, skills: skillsArray});
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="e.g., Python, Machine Learning, Data Science"
          />
          <p className="text-xs text-gray-500 mt-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Separate skills with commas
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Image</label>
          <div className="mt-1">
            {certificationData.imageUrl ? (
              <div className="relative inline-block">
                <img 
                  src={certificationData.imageUrl} 
                  alt={certificationData.name} 
                  className="h-40 max-w-full object-contain border border-gray-300 rounded-lg shadow-sm"
                />
                <button
                  onClick={() => setCertificationData({...certificationData, imageUrl: ""})}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center -mt-2 -mr-2 shadow-md hover:bg-red-600 transition"
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                <input
                  type="file"
                  id="certificate-image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <label
                  htmlFor="certificate-image"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                  </svg>
                  <span className="text-sm font-medium text-blue-600">
                    {imageUploading ? "Uploading..." : "Upload Certificate Image"}
                  </span>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Drag and drop or click to browse
                  </p>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer/Actions */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={() => setShowCertPopup(false)}
          className="px-4 py-2 mr-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveCertification}
          disabled={loading || !certificationData.name || !certificationData.issuer}
          className={`px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm transition ${
            loading || !certificationData.name || !certificationData.issuer
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-blue-700 hover:shadow'
          }`}
        >
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : 'Save Certificate'}
        </button>
      </div>
    </div>
  </div>
)}
    </>
  );
};

export default CourseCompletionCheck;