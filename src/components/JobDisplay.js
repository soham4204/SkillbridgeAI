import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc, query, where } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import JobCard from "./JobCard";

const JobsListingPage = ({ jobs: propJobs, loading: propLoading }) => {
  const [localJobs, setLocalJobs] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(propLoading !== undefined ? propLoading : true);
  const [debugInfo, setDebugInfo] = useState({ 
    userSkillsFound: false,
    skillsCount: 0,
    jobsWithSkillsCount: 0,
    matchingAttempted: false
  });
  
  // Use either the props jobs or local jobs
  const jobsToDisplay = propJobs || localJobs;

  useEffect(() => {
    if (propJobs) return; // Skip fetching if jobs are provided as props
    
    const fetchUserAndJobs = async () => {
      setLoading(true);
      try {
        // 1. Fetch and log user data for debugging
        const user = auth.currentUser;
        if (!user) {
          console.error("DEBUG: No authenticated user found");
          setLoading(false);
          return;
        }

        console.log("DEBUG: Current user ID:", user.uid);
        
        // Try both collections where user data might be stored
        const userProfileDoc = await getDoc(doc(db, "userProfiles", user.uid));
        
        console.log("DEBUG: UserProfile document exists:", userProfileDoc.exists());
        
        // Extract and log user skills for debugging
        let extractedSkills = [];
        let debugData = {
          userSkillsFound: false,
          skillsCount: 0,
          jobsWithSkillsCount: 0,
          matchingAttempted: false
        };
        
        if (userProfileDoc.exists() && extractedSkills.length === 0) {
          const userData = userProfileDoc.data();
          console.log("DEBUG: UserProfile data structure:", JSON.stringify(userData, null, 2));
          
          if (userData.skills.technical) {
            extractedSkills = userData.skills.technical;
            console.log("DEBUG: Found technical skills in userProfile data:", extractedSkills);
            debugData.userSkillsFound = true;
          } 
        }
        
        // Normalize skills to lowercase
        const normalizedSkills = extractedSkills.map(skill => {
          if (typeof skill === 'string') {
            return skill.toLowerCase();
          } else if (skill && typeof skill === 'object' && skill.name) {
            return skill.name.toLowerCase();
          }
          console.log("DEBUG: Unexpected skill format:", skill);
          return '';
        }).filter(Boolean);
        
        console.log("DEBUG: Normalized user skills:", normalizedSkills);
        debugData.skillsCount = normalizedSkills.length;
        setUserSkills(normalizedSkills);

        // 2. Fetch and log jobs for debugging
        const jobsRef = collection(db, "jobs");
        const jobsQuery = query(jobsRef, where("status", "==", "active"));
        const jobsSnapshot = await getDocs(jobsQuery);
        
        const jobsList = jobsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log(`DEBUG: Found ${jobsList.length} jobs`);
        
        // Log the first job's structure for debugging
        if (jobsList.length > 0) {
          console.log("DEBUG: First job structure:", JSON.stringify(jobsList[0], null, 2));
        }
        
        // Count jobs with required skills
        const jobsWithSkills = jobsList.filter(job => 
          job.requiredSkills && Array.isArray(job.requiredSkills) && job.requiredSkills.length > 0
        );
        
        console.log(`DEBUG: ${jobsWithSkills.length} jobs have required skills`);
        debugData.jobsWithSkillsCount = jobsWithSkills.length;
        
        if (jobsWithSkills.length > 0 && jobsWithSkills[0].requiredSkills) {
          console.log("DEBUG: Example job skills:", jobsWithSkills[0].requiredSkills);
        }

        // 3. Calculate match percentages with detailed logging
        const jobsWithMatch = jobsList.map(job => {
          const jobSkills = (job.requiredSkills || []).map(skill => 
            typeof skill === 'string' ? skill.toLowerCase() : ''
          ).filter(Boolean);
          
          console.log(`DEBUG: Job "${job.jobTitle}" skills:`, jobSkills);
          
          let matchCount = 0;
          let matchDetails = [];
          
          for (const jobSkill of jobSkills) {
            let matched = false;
            for (const userSkill of normalizedSkills) {
              if (jobSkill === userSkill || 
                  jobSkill.includes(userSkill) || 
                  userSkill.includes(jobSkill)) {
                matched = true;
                matchDetails.push(`"${jobSkill}" matched with "${userSkill}"`);
                break;
              }
            }
            if (matched) matchCount++;
          }
          
          const matchPercentage = jobSkills.length ? Math.round((matchCount / jobSkills.length) * 100) : 0;
          
          console.log(`DEBUG: Job "${job.jobTitle}" match: ${matchCount}/${jobSkills.length} = ${matchPercentage}%`);
          if (matchDetails.length > 0) {
            console.log(`DEBUG: Match details for "${job.jobTitle}":`, matchDetails);
          }
          
          return { ...job, matchPercentage };
        });
        
        debugData.matchingAttempted = true;
        setDebugInfo(debugData);
        
        // Sort by match percentage
        jobsWithMatch.sort((a, b) => b.matchPercentage - a.matchPercentage);
        setLocalJobs(jobsWithMatch);
      } catch (error) {
        console.error("DEBUG: Error in job matching:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndJobs();
  }, [propJobs]);

  // If props-based jobs need processing with user skills
  useEffect(() => {
    if (!propJobs || propJobs.length === 0 || userSkills.length === 0) return;
    
    console.log("DEBUG: Processing prop jobs with user skills:", userSkills);
    
    // Processing would happen here (not implemented since we likely won't use this path)
  }, [propJobs, userSkills]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Jobs Matching Your Skills</h1>
      
      {/* Debug information panel - only show in development */}
      {/* {process.env.NODE_ENV !== 'production' && (
        <div className="bg-gray-100 p-4 mb-6 rounded-lg text-sm">
          <h3 className="font-bold mb-2">Debug Information:</h3>
          <ul className="list-disc pl-5">
            <li>User skills found: {debugInfo.userSkillsFound ? 'Yes' : 'No'}</li>
            <li>Number of user skills: {debugInfo.skillsCount}</li>
            <li>Jobs with required skills: {debugInfo.jobsWithSkillsCount}</li>
            <li>Matching algorithm ran: {debugInfo.matchingAttempted ? 'Yes' : 'No'}</li>
            <li>User skills: {userSkills.join(', ')}</li>
          </ul>
          <p className="mt-2 text-gray-600">Check browser console for detailed logs</p>
        </div>
      )} */}
      
      <div className="space-y-6">
        {jobsToDisplay.length > 0 ? (
          jobsToDisplay.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              matchPercentage={job.matchPercentage || 0}
            />
          ))
        ) : (
          <p className="text-gray-600 text-center py-8">No jobs found. Check back later for new opportunities.</p>
        )}
      </div>
    </div>
  );
};

export default JobsListingPage;