import { useState, useEffect } from 'react';
import { analyzeCareerPaths, getCourseRecommendations } from '../services/genaiService';
import { getJobRolesSkills, getUserProfile } from '../services/firebaseService';  
import { auth } from '../firebase-config'; 
import CourseView from './CourseView';

const SkillAnalyzer = () => {
  const [loading, setLoading] = useState(true);
  const [careerAnalysis, setCareerAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [technicalSkills, setTechnicalSkills] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [courseLoading, setCourseLoading] = useState(false);
  const [courses, setCourses] = useState({
    beginner: [],
    intermediate: [],
    advanced: []
  });

  useEffect(() => {
    const fetchUserSkills = async () => {
      try {
        setLoading(true);
        const currentUser = auth.currentUser; 
        
        if (!currentUser) {
          setError("User not logged in");
          return;
        }

        const userProfile = await getUserProfile(currentUser.uid); 
        
        if (!userProfile || !userProfile.skills || !userProfile.skills.technical) {
          setError("No skills found in user profile");
          return;
        }

        setTechnicalSkills(userProfile.skills.technical);

        const jobRolesSkills = await getJobRolesSkills(); // Fetch job roles and skills

        const analysis = await analyzeCareerPaths(userProfile.skills.technical, jobRolesSkills);
        setCareerAnalysis(analysis);
      } catch (err) {
        setError(err.message);
        console.error('Error analyzing career paths:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSkills();
  }, []);

  const fetchCourseRecommendations = async (role, missingSkills) => {
    setCourseLoading(true);
    setCurrentRole(role);
    setShowRecommendations(true);
    
    try {
      const courseRecommendations = await getCourseRecommendations(role, missingSkills);
      setCourses(courseRecommendations);
    } catch (err) {
      console.error('Error fetching course recommendations:', err);
      setCourses({
        beginner: [],
        intermediate: [],
        advanced: []
      });
    } finally {
      setCourseLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-xl font-medium text-gray-700">Analyzing your career paths...</p>
        <p className="text-gray-500 mt-2">We're matching your skills with job opportunities</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-red-50 border-l-4 border-red-500 p-8 rounded-lg shadow-lg max-w-2xl">
        <div className="flex items-center">
          <div className="text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-red-800">Error Analyzing Career Paths</h3>
            <p className="text-red-700 mt-1">{error}</p>
            <p className="mt-3 text-sm text-gray-600">Please try again or contact support if the issue persists.</p>
          </div>
        </div>
      </div>
    </div>
  );
  
  if (!careerAnalysis) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-orange-50 border-l-4 border-orange-500 p-8 rounded-lg shadow-lg max-w-2xl">
        <div className="flex items-center">
          <div className="text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-orange-800">Analysis Unavailable</h3>
            <p className="text-orange-700 mt-1">Unable to analyze career paths at this time.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-3 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors">
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Course recommendations overlay
  const CourseRecommendationsOverlay = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 z-50 overflow-y-auto">
        <div className="min-h-screen p-4">
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl">
            <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center rounded-t-xl z-10">
              <h2 className="text-2xl font-bold text-gray-800">
                Course Recommendations for {currentRole}
              </h2>
              <button 
                onClick={() => setShowRecommendations(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-full transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              {courseLoading ? (
                <div className="py-12 text-center">
                  <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-lg text-gray-700">Finding the best courses for your career path...</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Beginner Level Courses */}
                  <div>
                    <h3 className="text-xl font-bold text-blue-800 mb-4 pb-2 border-b">
                      Beginner Level Courses
                    </h3>
                    {courses.beginner.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.beginner.map((course, index) => (
                          <CourseCard key={`beginner-${index}`} course={course} level="beginner" />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No beginner courses found.</p>
                    )}
                  </div>
                  
                  {/* Intermediate Level Courses */}
                  <div>
                    <h3 className="text-xl font-bold text-green-800 mb-4 pb-2 border-b">
                      Intermediate Level Courses
                    </h3>
                    {courses.intermediate.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.intermediate.map((course, index) => (
                          <CourseCard key={`intermediate-${index}`} course={course} level="intermediate" />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No intermediate courses found.</p>
                    )}
                  </div>
                  
                  {/* Advanced Level Courses */}
                  <div>
                    <h3 className="text-xl font-bold text-purple-800 mb-4 pb-2 border-b">
                      Advanced Level Courses
                    </h3>
                    {courses.advanced.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.advanced.map((course, index) => (
                          <CourseCard key={`advanced-${index}`} course={course} level="advanced" />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No advanced courses found.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t text-center">
              <button 
                onClick={() => setShowRecommendations(false)} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition-colors">
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

const CourseCard = ({ course, level }) => {
  return (
    <CourseView course={course} role={currentRole} />
  );
};

  return (
    <>
      <div className="container mx-auto p-4 max-w-7xl">
        
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Your Current Technical Skills</h3>
          <div className="flex flex-wrap gap-2">
            {technicalSkills.map((skill, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {careerAnalysis.careerPaths?.map((path, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md transition-all hover:shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-800">{path.role}</h3>
                  <div className="relative w-20 h-20">
                    <svg viewBox="0 0 36 36" className="w-20 h-20 transform -rotate">
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#eee"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={path.matchPercentage > 70 ? "#10b981" : path.matchPercentage > 40 ? "#3b82f6" : "#ef4444"}
                        strokeWidth="3"
                        strokeDasharray={`${path.matchPercentage}, 100`}
                      />
                      <text x="18" y="20.5" textAnchor="middle" className="text-md font-bold" fill={path.matchPercentage > 70 ? "#10b981" : path.matchPercentage > 40 ? "#3b82f6" : "#ef4444"}>
                        {path.matchPercentage}%
                      </text>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="flex items-center font-semibold text-green-700 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Skills You Already Have
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {path.matchedSkills.map((skill, idx) => (
                      <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="flex items-center font-semibold text-red-700 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Skills You Need to Develop
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {path.missingSkills.map((skill, idx) => (
                      <span key={idx} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => fetchCourseRecommendations(path.role, path.missingSkills)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Course Recommendations
                  </button>
                  <button
                    className="bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg transition-colors"
                  >
                    Get Learning Path
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {showRecommendations && <CourseRecommendationsOverlay />}
    </>
  );
};

export default SkillAnalyzer;