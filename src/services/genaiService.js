import { GoogleGenerativeAI } from "@google/generative-ai";

export const initializeGenAI = () => {
  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_API_KEY);
  return genAI;
};

export const generateModel = async () => {
  const genAI = initializeGenAI();
  // Update model name to use the correct version
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  return model;
};

export const analyzeCareerPaths = async (userSkills, jobRolesSkills) => {
  try {
    const model = await generateModel();
    
    // Prepare the prompt with user skills and job requirements
    const prompt = `
    I am a jobseeker with the following technical skills: ${userSkills.join(', ')}.
    
    These are different job roles and their required skills:
    ${Object.entries(jobRolesSkills).map(([role, skills]) => 
      `${role}: ${skills.join(', ')}`
    ).join('\n')}
    
    Based on my current skills, analyze:
    1. Which career paths are the best match for me
    2. For each career path, calculate match percentage
    3. What key skills I'm missing for each career path
    
    Format the response as JSON with this structure:
    {
      "careerPaths": [
        {
          "role": "Job Role Name",
          "matchPercentage": 85,
          "matchedSkills": ["Skill1", "Skill2"],
          "missingSkills": ["Skill3", "Skill4"]
        }
      ]
    }
    
    Sort the results by matchPercentage in descending order.
    `;
    
    // Use the structured format to ensure proper JSON response
    const generationConfig = {
      temperature: 0.2, // Lower temperature for more predictable JSON output
    };
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig
    });
    
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response - improved parsing
    try {
      // Try direct JSON parsing first
      return JSON.parse(text);
    } catch (e) {
      // Fallback to regex extraction
      const jsonMatch = text.match(/({[\s\S]*})/);
      if (jsonMatch && jsonMatch[0]) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error("Failed to parse JSON from AI response", e);
          return null;
        }
      }
      
      console.error("Couldn't extract valid JSON from response:", text);
      return null;
    }
  } catch (error) {
    console.error("Error analyzing career paths:", error);
    throw error; // Re-throw to better handle the error in the caller
  }
};

export const getCourseRecommendations = async (role, missingSkills) => {
  try {
    const model = await generateModel();
    
    const prompt = `
    I'm preparing for a career as a ${role} and need to learn the following skills: ${missingSkills.join(', ')}.
    
    For each skill, suggest 1-2 high-quality courses at three different levels:
    1. Beginner level (for people new to the skill)
    2. Intermediate level (for people with some knowledge)
    3. Advanced level (for people looking to master the skill)
    
    For each course, provide:
    - Title (specific and descriptive)
    - Provider (e.g., Coursera, Udemy, edX, Pluralsight, etc.)
    - Duration (in weeks or hours)
    - A realistic rating out of 5
    - A brief description of what the course covers
    
    Format the response as JSON with this structure:
    {
      "beginner": [
        {
          "skill": "Skill Name",
          "title": "Course Title",
          "provider": "Provider Name",
          "duration": "X weeks",
          "rating": 4.5,
          "description": "Brief course description"
        }
      ],
      "intermediate": [
        {
          "skill": "Skill Name",
          "title": "Course Title",
          "provider": "Provider Name",
          "duration": "X weeks",
          "rating": 4.5,
          "description": "Brief course description"
        }
      ],
      "advanced": [
        {
          "skill": "Skill Name",
          "title": "Course Title",
          "provider": "Provider Name",
          "duration": "X weeks",
          "rating": 4.5,
          "description": "Brief course description"
        }
      ]
    }
    
    Ensure you provide realistic, currently available courses. Include a good mix of different providers.
    `;
    
    // Use structured format to ensure proper JSON response
    const generationConfig = {
      temperature: 0.4, // Slightly higher temperature for more variety in course suggestions
    };
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig
    });
    
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response - improved parsing
    try {
      // Try direct JSON parsing first
      return JSON.parse(text);
    } catch (e) {
      // Fallback to regex extraction
      const jsonMatch = text.match(/({[\s\S]*})/);
      if (jsonMatch && jsonMatch[0]) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error("Failed to parse JSON from AI response", e);
          return {
            beginner: [],
            intermediate: [],
            advanced: []
          };
        }
      }
      
      console.error("Couldn't extract valid JSON from response:", text);
      return {
        beginner: [],
        intermediate: [],
        advanced: []
      };
    }
  } catch (error) {
    console.error("Error getting course recommendations:", error);
    throw error;
  }
};