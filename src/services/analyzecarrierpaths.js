import { initializeGenAI, createChatModel } from './genaiConfig';

/**
 * Calculates weighted skill matches for career paths based on user skills and role requirements
 * @param {Array} userSkills - Array of user's technical skills
 * @param {Object} jobRolesSkills - Object mapping job roles to required skills
 * @returns {Object} - Career path analysis with weighted matching
 */
export const analyzeCareerPaths = async (userSkills, jobRolesSkills) => {
  try {
    // Get weighted skills for each job role
    const weightedJobSkills = await getWeightedSkillsForRoles(jobRolesSkills);
    
    // Calculate career paths with weighted matching
    const careerPaths = [];
    
    for (const [role, weightedSkills] of Object.entries(weightedJobSkills)) {
      const matchedSkills = [];
      const missingSkills = [];
      let weightedMatchScore = 0;
      let totalWeight = 0;
      
      // Calculate total weight for normalization
      weightedSkills.forEach(skill => {
        totalWeight += skill.weight;
      });
      
      // Calculate matched and missing skills with their weights
      weightedSkills.forEach(skillObj => {
        const { skill, weight } = skillObj;
        if (userSkills.includes(skill)) {
          matchedSkills.push(skill);
          weightedMatchScore += weight;
        } else {
          missingSkills.push(skill);
        }
      });
      
      // Calculate match percentage (normalized to 100%)
      const matchPercentage = Math.round((weightedMatchScore / totalWeight) * 100);
      
      careerPaths.push({
        role,
        matchPercentage,
        matchedSkills,
        missingSkills,
        skillGap: missingSkills.length,
      });
    }
    
    // Sort career paths by match percentage (highest first)
    careerPaths.sort((a, b) => b.matchPercentage - a.matchPercentage);
    
    return {
      careerPaths,
      topMatch: careerPaths.length > 0 ? careerPaths[0] : null,
    };
  } catch (error) {
    console.error("Error analyzing career paths:", error);
    throw error;
  }
};

/**
 * Uses Gemini to assign weights to skills for each job role
 * @param {Object} jobRolesSkills - Object mapping job roles to required skills
 * @returns {Object} - Object mapping roles to arrays of weighted skills
 */
const getWeightedSkillsForRoles = async (jobRolesSkills) => {
  const weightedJobSkills = {};
  const chatModel = createChatModel();
  
  for (const [role, skills] of Object.entries(jobRolesSkills)) {
    try {
      // Prompt to get skill weightages for this role
      const prompt = `
      As an expert career advisor, assign a weight to each of the following skills for the "${role}" role.
      The weights should sum to 100, and should reflect how important each skill is for this specific role.
      Higher weights indicate more critical skills.
      
      Skills: ${JSON.stringify(skills)}
      
      Return ONLY a JSON array with objects containing "skill" and "weight" properties.
      Example format: [{"skill": "Skill1", "weight": 20}, {"skill": "Skill2", "weight": 15}]
      `;
      
      // Call Gemini API
      const result = await chatModel.invoke(prompt);
      const responseText = result.content;
      
      // Extract JSON from response
      const jsonMatch = responseText.match(/\[.*\]/s);
      if (jsonMatch) {
        const weightedSkills = JSON.parse(jsonMatch[0]);
        weightedJobSkills[role] = weightedSkills;
      } else {
        // Fallback: assign equal weights if Gemini's response can't be parsed
        const equalWeight = 100 / skills.length;
        weightedJobSkills[role] = skills.map(skill => ({
          skill,
          weight: equalWeight
        }));
      }
    } catch (error) {
      console.error(`Error getting weights for ${role}:`, error);
      // Fallback: assign equal weights
      const equalWeight = 100 / skills.length;
      weightedJobSkills[role] = skills.map(skill => ({
        skill,
        weight: equalWeight
      }));
    }
  }
  
  return weightedJobSkills;
};

/**
 * Gets course recommendations for a specific role based on missing skills
 * @param {string} role - The job role
 * @param {Array} missingSkills - Array of skills the user needs to develop
 * @returns {Object} - Object with beginner, intermediate, and advanced course recommendations
 */
export const getCourseRecommendations = async (role, missingSkills) => {
  try {
    const chatModel = createChatModel();
    
    // Prompt to get course recommendations
    const prompt = `
    As a technical career advisor, recommend courses to help someone become a "${role}".
    They need to learn these specific skills: ${JSON.stringify(missingSkills)}
    
    For each skill gap, recommend:
    1. One beginner-level course
    2. One intermediate-level course
    3. One advanced-level course
    
    Return ONLY a JSON object with this structure:
    {
      "beginner": [
        {"title": "Course Title", "platform": "Platform Name", "description": "Brief description", "skill": "Related skill", "duration": "X weeks", "url": "course-url"}
      ],
      "intermediate": [
        {"title": "Course Title", "platform": "Platform Name", "description": "Brief description", "skill": "Related skill", "duration": "X weeks", "url": "course-url"}
      ],
      "advanced": [
        {"title": "Course Title", "platform": "Platform Name", "description": "Brief description", "skill": "Related skill", "duration": "X weeks", "url": "course-url"}
      ]
    }
    `;
    
    // Call Gemini API
    const result = await chatModel.invoke(prompt);
    const responseText = result.content;
    
    // Extract JSON from response
    const jsonMatch = responseText.match(/\{.*\}/s);
    if (jsonMatch) {
      const courseRecommendations = JSON.parse(jsonMatch[0]);
      return courseRecommendations;
    } else {
      // Fallback with empty course lists
      return {
        beginner: [],
        intermediate: [],
        advanced: []
      };
    }
  } catch (error) {
    console.error("Error getting course recommendations:", error);
    return {
      beginner: [],
      intermediate: [],
      advanced: []
    };
  }
};

