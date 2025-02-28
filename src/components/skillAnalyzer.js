import { useState, useEffect } from 'react';
import { analyzeCareerPaths, getCourseRecommendations } from '../services/genaiService';
import { getJobRolesSkills, getUserProfile } from '../services/firebaseService';  
import { auth } from '../firebase-config';

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
  const [skillStats, setSkillStats] = useState({
    total: 0,
    inDemand: 0,
    unique: 0
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

        const skills = userProfile.skills.technical;
        setTechnicalSkills(skills);

        // Calculate skill statistics
        setSkillStats({
          total: skills.length,
          inDemand: Math.floor(skills.length * 0.7), // This would ideally be calculated from actual data
          unique: Math.floor(skills.length * 0.3) // This would ideally be calculated from actual data
        });

        const jobRolesSkills = await getJobRolesSkills();
        const analysis = await analyzeCareerPaths(skills, jobRolesSkills);
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="text-center p-10 bg-white rounded-2xl shadow-xl max-w-md">
        <div className="animate-spin w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"></div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Analyzing Your Skills</h3>
        <p className="text-xl font-medium text-gray-700 mb-4">Creating your personalized career roadmap...</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
          <div className="bg-blue-600 h-2.5 rounded-full w-3/4 animate-pulse"></div>
        </div>
        <p className="text-gray-500 text-sm">This may take a moment</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
      <div className="bg-white border-l-4 border-red-500 p-8 rounded-xl shadow-xl max-w-2xl">
        <div className="flex items-center">
          <div className="text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-bold text-red-800">Error Analyzing Career Paths</h3>
            <p className="text-red-700 mt-2">{error}</p>
            <p className="mt-4 text-gray-600">We're having trouble analyzing your skills at the moment.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  if (!careerAnalysis) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="bg-white border-l-4 border-orange-500 p-8 rounded-xl shadow-xl max-w-2xl">
        <div className="flex items-center">
          <div className="text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-bold text-orange-800">Analysis Unavailable</h3>
            <p className="text-orange-700 mt-2">We couldn't generate your career analysis at this time.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
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
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 flex justify-between items-center rounded-t-2xl z-10">
              <h2 className="text-2xl font-bold">
                Courses for {currentRole} Career Path
              </h2>
              <button 
                onClick={() => setShowRecommendations(false)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-8">
              {courseLoading ? (
                <div className="py-16 text-center">
                  <div className="animate-spin w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"></div>
                  <p className="text-xl text-gray-700">Finding the perfect courses to advance your career...</p>
                </div>
              ) : (
                <div className="space-y-10">
                  {/* Beginner Level Courses */}
                  <div>
                    <h3 className="text-2xl font-bold text-blue-800 mb-4 pb-2 border-b">
                      <span className="inline-block mr-2 w-3 h-3 rounded-full bg-blue-500"></span>
                      Foundation Courses
                    </h3>
                    {courses.beginner.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.beginner.map((course, index) => (
                          <CourseCard key={`beginner-${index}`} course={course} level="beginner" />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic py-4">No beginner courses found for this career path.</p>
                    )}
                  </div>
                  
                  {/* Intermediate Level Courses */}
                  <div>
                    <h3 className="text-2xl font-bold text-green-800 mb-4 pb-2 border-b">
                      <span className="inline-block mr-2 w-3 h-3 rounded-full bg-green-500"></span>
                      Skill-Building Courses
                    </h3>
                    {courses.intermediate.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.intermediate.map((course, index) => (
                          <CourseCard key={`intermediate-${index}`} course={course} level="intermediate" />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic py-4">No intermediate courses found for this career path.</p>
                    )}
                  </div>
                  
                  {/* Advanced Level Courses */}
                  <div>
                    <h3 className="text-2xl font-bold text-purple-800 mb-4 pb-2 border-b">
                      <span className="inline-block mr-2 w-3 h-3 rounded-full bg-purple-500"></span>
                      Expert-Level Specializations
                    </h3>
                    {courses.advanced.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.advanced.map((course, index) => (
                          <CourseCard key={`advanced-${index}`} course={course} level="advanced" />
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic py-4">No advanced courses found for this career path.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t bg-gray-50 rounded-b-2xl flex justify-between items-center">
              <p className="text-gray-600 italic text-sm">
                Courses are personalized based on your skill gap analysis
              </p>
              <button 
                onClick={() => setShowRecommendations(false)} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition-colors">
                Back to Career Paths
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Course card component
  const CourseCard = ({ course, level }) => {
    const levelColors = {
      beginner: 'border-blue-200 bg-blue-50',
      intermediate: 'border-green-200 bg-green-50',
      advanced: 'border-purple-200 bg-purple-50'
    };
    
    const levelBadgeColors = {
      beginner: 'bg-blue-500',
      intermediate: 'bg-green-500',
      advanced: 'bg-purple-500'
    };
    
    const levelTitles = {
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced'
    };
    
    return (
      <div className={`border rounded-xl overflow-hidden shadow-md transition-all hover:shadow-xl transform hover:-translate-y-1 ${levelColors[level]}`}>
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="flex flex-col">
              <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full text-white mb-2 ${levelBadgeColors[level]}`}>
                {levelTitles[level]}
              </span>
              {course.skill && (
                <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gray-200 text-gray-700">
                  {course.skill}
                </span>
              )}
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1 text-gray-700 font-medium">{course.rating}</span>
            </div>
          </div>
          
          <h4 className="text-lg font-bold mb-2 text-gray-800 line-clamp-2">{course.title}</h4>
          
          <p className="text-gray-600 mb-4 text-sm line-clamp-2">{course.description}</p>
          
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {course.duration}
          </div>
          
          <div className="flex items-center mb-4">
            <span className="text-sm font-medium bg-gray-200 text-gray-800 px-2 py-1 rounded">
              {course.provider}
            </span>
          </div>
          
          <a href="#" className="block w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors text-center group">
            <span className="group-hover:hidden">View Course</span>
            <span className="hidden group-hover:inline-block">Enroll Now</span>
          </a>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 mb-8 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold mb-3">Your Career Path Analysis</h2>
            <p className="text-blue-100 text-lg mb-6">Based on your {technicalSkills.length} skills, we've identified the best career paths for you.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white bg-opacity-10 p-6 rounded-xl">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{skillStats.total}</div>
                <div className="text-blue-100">Total Skills</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{skillStats.inDemand}</div>
                <div className="text-blue-100">In-Demand Skills</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2">{skillStats.unique}</div>
                <div className="text-blue-100">Unique Skills</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              Your Technical Skills Profile
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {technicalSkills.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium">
                  {skill}
                </span>
              ))}
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-800 flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Based on industry trends, your skills align best with the career paths shown below. Each path shows your current match percentage and skills you need to develop.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {careerAnalysis.careerPaths?.map((path, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all hover:shadow-xl">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b relative">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-1">{path.role}</h3>
                      <p className="text-gray-600 text-sm">Career compatibility based on your skills</p>
                    </div>
                    <div className="relative w-24 h-24">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-2xl font-bold" style={{color: path.matchPercentage > 70 ? "#10b981" : path.matchPercentage > 40 ? "#3b82f6" : "#ef4444"}}>
                          {path.matchPercentage}%
                        </div>
                      </div>
                      <svg viewBox="0 0 36 36" className="w-24 h-24 transform -rotate-90">
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#eee"
                          strokeWidth="4"
                        />
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke={path.matchPercentage > 70 ? "#10b981" : path.matchPercentage > 40 ? "#3b82f6" : "#ef4444"}
                          strokeWidth="4"
                          strokeDasharray={`${path.matchPercentage}, 100`}
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="flex items-center font-semibold text-green-700 mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Skills You Already Have ({path.matchedSkills.length})
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
                      Skills To Develop ({path.missingSkills.length})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {path.missingSkills.map((skill, idx) => (
                        <span key={idx} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => fetchCourseRecommendations(path.role, path.missingSkills)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center shadow-md"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Course Recommendations
                    </button>
                    <button
                      className="bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Learning Path
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {showRecommendations && <CourseRecommendationsOverlay />}
    </>
  );
};

export default SkillAnalyzer;