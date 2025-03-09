// ProjectAssistant.js
import React, { useState, useEffect, useRef } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { db, auth } from '../firebase-config';
import { HumanMessage, SystemMessage, AIMessage } from '@langchain/core/messages';

const ProjectAssistant = () => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentProject, setCurrentProject] = useState(null);
  const [suggestedPrompts, setSuggestedPrompts] = useState([]);
  const chatContainerRef = useRef(null);

  // Fetch current project data
  useEffect(() => {
    const fetchCurrentProject = async () => {
      try {
        setLoading(true);
        const user = auth.currentUser;
        if (!user) return;

        const userProfileRef = doc(db, 'userProfiles', user.uid);
        const userProfileSnap = await getDoc(userProfileRef);
        
        if (userProfileSnap.exists() && userProfileSnap.data().currentProject) {
          const projectData = userProfileSnap.data().currentProject;
          setCurrentProject(projectData);
          
          // Generate initial message and suggestions based on project
          generateInitialSuggestions(projectData);
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentProject();
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Generate initial suggestions based on project data
  const generateInitialSuggestions = async (projectData) => {
    try {
      const model = new ChatGoogleGenerativeAI({
        model: "gemini-1.5-flash",
        temperature: 0.2,
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        maxRetries: 2,
      });

      const systemPrompt = `You are a personalized project assistant for a learning project. 
      The user is working on the following project:
      Name: ${projectData.name}
      Description: ${projectData.description}
      Difficulty: ${projectData.difficulty}
      Skills involved: ${projectData.skills.join(', ')}
      Implementation steps: ${projectData.implementationSteps.join('\n')}
      Learning objectives: ${projectData.learningObjectives.join('\n')}
      
      Your goal is to provide helpful, personalized guidance. Generate:
      1. A welcome message to the user that's encouraging and acknowledges their project
      2. Three specific suggested prompts they might want to ask you about their project`;

      const response = await model.invoke([
        new SystemMessage(systemPrompt),
      ]);

      // Parse the response to extract welcome message and suggestions
      const responseText = response.content;
      
      // Simple parsing - adjust based on actual response format
      const sections = responseText.split(/\d\.\s/).filter(Boolean);
      
      if (sections.length >= 1) {
        // Add welcome message
        const welcomeMessage = sections[0].trim();
        setMessages([{ type: 'assistant', content: welcomeMessage }]);
        
        // Extract suggested prompts
        const promptSuggestions = [];
        for (let i = 1; i < sections.length && i < 4; i++) {
          promptSuggestions.push(sections[i].trim());
        }
        setSuggestedPrompts(promptSuggestions);
      }
    } catch (error) {
      console.error("Error generating initial suggestions:", error);
      setMessages([{ 
        type: 'assistant', 
        content: "Hello! I'm your project assistant. How can I help you with your project today?" 
      }]);
      setSuggestedPrompts([
        "I'm stuck on the first step. Can you help?",
        "What resources do you recommend for this project?",
        "Can you break down the implementation steps further?"
      ]);
    }
  };

  // Handle sending a message
  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage = { type: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Show loading state
    setMessages(prev => [...prev, { type: 'assistant', content: '...', isLoading: true }]);

    try {
      const model = new ChatGoogleGenerativeAI({
        model: "gemini-1.5-flash",
        temperature: 0.2,
        apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        maxRetries: 2,
      });

      // Create system prompt with context for the AI
      const systemPrompt = `You are a personalized project assistant helping with a learning project.
      
      Current project details:
      Name: ${currentProject.name}
      Description: ${currentProject.description}
      Difficulty: ${currentProject.difficulty}
      Skills: ${currentProject.skills.join(', ')}
      Implementation steps: ${currentProject.implementationSteps.join('\n')}
      Current status: ${currentProject.status}
      Learning objectives: ${currentProject.learningObjectives.join('\n')}
      Resources: ${currentProject.resources.join('\n')}
      
      Based on these details, provide personalized, specific guidance to help the user. Be encouraging but practical.
      After answering, suggest 2-3 follow-up questions related to their current situation.`;

      // Convert chat history to messages format (using AIMessage for assistant messages)
      const chatHistory = messages
        .filter(msg => !msg.isLoading)
        .map(msg => 
          msg.type === 'user' 
            ? new HumanMessage(msg.content) 
            : new AIMessage(msg.content)  // Changed from SystemMessage to AIMessage
        );

      // Add the new user message
      chatHistory.push(new HumanMessage(message));

      // Start with system message, then add chat history
      const allMessages = [new SystemMessage(systemPrompt), ...chatHistory];

      // Get response from AI
      const response = await model.invoke(allMessages);
      
      // Parse response for main content and suggestions
      const responseText = response.content;
      
      // Simple parsing - adjust based on actual model output
      const parts = responseText.split(/Follow-up questions:|Suggested questions:|Next steps:/i);
      
      let mainResponse = responseText;
      let newSuggestions = [];
      
      if (parts.length > 1) {
        mainResponse = parts[0].trim();
        const suggestionsText = parts[1].trim();
        
        // Extract numbered or bulleted suggestions
        newSuggestions = suggestionsText
          .split(/\d\.\s|\-\s|\*\s/)
          .filter(Boolean)
          .map(s => s.trim())
          .filter(s => s.length > 0 && s.length < 100); // Reasonable length for a suggestion
      }

      // Remove loading message and add actual response
      setMessages(prev => [...prev.filter(msg => !msg.isLoading), { type: 'assistant', content: mainResponse }]);
      
      // Update suggestions if we got new ones
      if (newSuggestions.length > 0) {
        setSuggestedPrompts(newSuggestions);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      // Remove loading message and add error message
      setMessages(prev => [
        ...prev.filter(msg => !msg.isLoading), 
        { type: 'assistant', content: "I'm sorry, I couldn't process your request. Please try again." }
      ]);
    }
  };

  // Handle clicking a suggestion
  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
    handleSendMessage(suggestion);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (!currentProject) {
    return <div className="p-4 text-center">
      <p>No active project found. Please select a project to get started.</p>
    </div>;
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg shadow-md bg-white">
      {/* Project header */}
      <div className="border-b p-4 bg-gray-50">
        <h2 className="text-lg font-semibold">{currentProject.name}</h2>
        <p className="text-sm text-gray-500">AI Project Assistant</p>
      </div>
      
      {/* Chat messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 p-4 overflow-y-auto space-y-4"
      >
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[75%] p-3 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-blue-500 text-white rounded-br-none' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              {message.isLoading ? (
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Suggested prompts */}
      {suggestedPrompts.length > 0 && (
        <div className="p-4 border-t flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(prompt)}
              className="text-sm bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1 text-gray-700 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}
      
      {/* Input area */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about your project..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim()}
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectAssistant;