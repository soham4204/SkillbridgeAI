import React, { useState, useEffect } from "react";
import { db } from "../firebase-config"; // Make sure to import db
import { collection, getDocs, getDoc,doc, where, query } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard";
import SearchBar from "../components/SearchBar";
import Icons from "../components/Icons";
import MyResume from "../components/MyResume";
import ProgressPage from "../components/Progress";
import AppliedJobsPage from "../components/AppliedJobs";
import ProfilePage from "../components/Profile";
import SkillAnalyzer from "../components/skillAnalyzer";
import { getAuth } from "firebase/auth";
import CourseCompletionCheck from "../components/CourseCompletionCheck";
import SkillsVerification from "../components/SkillsVerification";

const JobseekerDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [currentUser, setCurrentUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!auth.currentUser) {
        console.error("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "userProfiles", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserProfile(userSnap.data());
        } else {
          console.error("User profile not found");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        // No user is signed in, redirect to login
        navigate('/login');
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [navigate]);

  // Fetch jobs from Firestore
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const jobsRef = collection(db, "jobs");
        const q = query(jobsRef, where("status", "==", "active"));
        const querySnapshot = await getDocs(q);
        
        const jobsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setJobs(jobsData);
        setFilteredJobs(jobsData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Handle search functionality
  useEffect(() => {
    if (searchQuery) {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = jobs.filter(job => 
        job.jobTitle?.toLowerCase().includes(lowercaseQuery) ||
        job.companyName?.toLowerCase().includes(lowercaseQuery) ||
        job.jobDescription?.toLowerCase().includes(lowercaseQuery) ||
        job.category?.toLowerCase().includes(lowercaseQuery) ||
        (job.requiredSkills && job.requiredSkills.some(skill => 
          skill.toLowerCase().includes(lowercaseQuery)
        ))
      );
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(jobs);
    }
  }, [searchQuery, jobs]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <MainContent />;
      case "profile":
        return <ProfilePage userId={currentUser?.uid} />;
      case "progress":
        return <ProgressPage />;
      case "resume":
        return <MyResume userId={currentUser?.uid} />;
      case "jobs":
        return <AppliedJobsPage />;
      default:
        return <MainContent />;
    }
  };
  console.log("currentUser", currentUser);
  console.log("API Key:", process.env.REACT_APP_GOOGLE_API_KEY);

  const [technicalSkills, setTechnicalSkills] = useState([
    "Machine Learning", "Python", "Data Science", "Deep Learning", "TensorFlow"
  ]);
  const [verifiedSkills, setVerifiedSkills] = useState([]);

  const handleSkillsVerified = (updatedVerifiedSkills) => {
    setVerifiedSkills(updatedVerifiedSkills);
    // You might want to refresh other data after skills verification
  };

  const MainContent = () => {
    return (
      <div className="p-6">
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <SkillsVerification 
          technicalSkills={technicalSkills} 
          onSkillsVerified={handleSkillsVerified} 
        />
      </div>
        <CourseCompletionCheck />
        <SkillAnalyzer userProfile={userProfile}/>
        <SearchBar onSearch={handleSearch} />
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="space-y-6 mt-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Icons.Search className="h-16 w-16 mx-auto text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No jobs found</h3>
            <p className="mt-2 text-gray-500">
              {searchQuery 
                ? "Try adjusting your search terms or filters." 
                : "Check back later for new job postings."}
            </p>
          </div>
        )}
      </div>
    );
  };

  // Sidebar component
  const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
    const menuItems = [
      { id: "home", label: "Home", icon: <Icons.Home /> },
      { id: "profile", label: "Profile", icon: <Icons.User /> },
      { id: "progress", label: "My Progress", icon: <Icons.BarChart /> },
      { id: "resume", label: "My Resume", icon: <Icons.FileText /> },
      { id: "jobs", label: "Applied Jobs", icon: <Icons.Briefcase /> },
    ];

    return (
      <div className="w-64 h-screen bg-white shadow-lg fixed left-0 top-0 flex flex-col">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        </div>
        <nav className="mt-6 flex-grow">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                activeTab === item.id ? "bg-blue-50 text-blue-600" : ""
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </button>
          ))}
        </nav>
        <button 
          onClick={onLogout}
          className="w-full flex items-center px-6 py-3 text-red-600 hover:bg-gray-100"
        >
          <Icons.Logout />
          <span className="ml-3">Logout</span>
        </button>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
      />
      <div className="ml-64 min-h-screen">
        <main className="container mx-auto py-6">
          {currentUser ? renderContent() : <div>Loading...</div>}
        </main>
      </div>
    </div>
  );
};

export default JobseekerDashboard;