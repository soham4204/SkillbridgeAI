// import React, { useState, useEffect } from "react";
// import { auth } from "../firebase-config";
// import { useNavigate } from "react-router-dom";
// import JobCard from "../components/JobCard";
// import SearchBar from "../components/SearchBar";
// import Icons from "../components/Icons";
// import MyResume from "../components/MyResume";
// import ProgressPage from "../components/Progress";
// import AppliedJobsPage from "../components/AppliedJobs";
// import ProfilePage from "../components/Profile";

// const Sidebar = ({ activeTab, setActiveTab }) => {

//   const menuItems = [
//     { id: "home", label: "Home", icon: <Icons.Home /> },
//     { id: "profile", label: "Profile", icon: <Icons.User /> },
//     { id: "progress", label: "My Progress", icon: <Icons.BarChart /> },
//     { id: "resume", label: "My Resume", icon: <Icons.FileText /> },
//     { id: "jobs", label: "Applied Jobs", icon: <Icons.Briefcase /> },
//   ];

//   return (
//     <div className="w-64 h-screen bg-white shadow-lg fixed left-0 top-0 flex flex-col">
//       <div className="p-4 border-b">
//         <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
//       </div>
//       <nav className="mt-6 flex-grow">
//         {menuItems.map((item) => (
//           <button
//             key={item.id}
//             onClick={() => setActiveTab(item.id)}
//             className={`w-full flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
//               activeTab === item.id ? "bg-blue-50 text-blue-600" : ""
//             }`}
//           >
//             {item.icon}
//             <span className="ml-3">{item.label}</span>
//           </button>
//         ))}
//       </nav>
//       <button 
//           onClick={onLogout}
//           className="w-full flex items-center px-6 py-3 text-red-600 hover:bg-gray-100"
//         >
//           <Icons.Logout />
//           <span className="ml-3">Logout</span>
//         </button>
//     </div>
//   );
// };






// // Main Dashboard Component
// const JobseekerDashboard = () => {
//   const [activeTab, setActiveTab] = useState("home");
//   const [currentUser, setCurrentUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         setCurrentUser(user);
//       } else {
//         navigate('/login');
//       }
//     });

//     return () => unsubscribe();
//   }, [navigate]);

//   const handleLogout = async () => {
//     try {
//       await auth.signOut();
//       navigate('/login');
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   const renderContent = () => {
//     switch (activeTab) {
//       case "home":
//         return <MainContent />;
//       case "profile":
//         return <ProfilePage userId={currentUser?.uid} />;
//       case "progress":
//         return <ProgressPage />;
//       case "resume":
//         return <MyResume />;
//       case "jobs":
//         return <AppliedJobsPage />;
//       default:
//         return <MainContent />;
//     }
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
//       <div className="ml-64 min-h-screen">
//         <main className="container mx-auto py-6">{renderContent()}</main>
//       </div>
//     </div>
//   );
// };

// export default JobseekerDashboard;

import React, { useState, useEffect } from "react";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard";
import SearchBar from "../components/SearchBar";
import Icons from "../components/Icons";
import MyResume from "../components/MyResume";
import ProgressPage from "../components/Progress";
import AppliedJobsPage from "../components/AppliedJobs";
import ProfilePage from "../components/Profile";

const JobseekerDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
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

  const MainContent = () => {
    const sampleJobs = [
      {
        title: "Senior Frontend Developer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA (Remote)",
        description:
          "We're looking for an experienced frontend developer to join our team...",
        skills: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
        postedDate: "2 days ago",
      },
      {
        title: "Full Stack Engineer",
        company: "Innovation Labs",
        location: "New York, NY (Hybrid)",
        description:
          "Join our dynamic team building cutting-edge web applications...",
        skills: ["Node.js", "React", "MongoDB", "AWS"],
        postedDate: "1 week ago",
      },
    ];
    return (
      <div className="p-6">
        <SearchBar />
        <div className="space-y-4">
          {sampleJobs.map((job, index) => (
            <JobCard key={index} job={job} />
          ))}
        </div>
      </div>
    );
  };

  // Modify your Sidebar component to use handleLogout
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