import React, { useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import Navbar from '../components/Navbar'; // Update this path to match your project structure

const InstructionalVideos = () => {
  const [selectedCategory, setSelectedCategory] = useState('frontend');
  const [activeVideo, setActiveVideo] = useState(null);

  // Function to extract YouTube video ID from URL
  const getYouTubeID = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Function to generate YouTube thumbnail URL
  const getYouTubeThumbnail = (url) => {
    const videoID = getYouTubeID(url);
    return videoID ? `https://img.youtube.com/vi/${videoID}/mqdefault.jpg` : null;
  };

  // Video data organized by categories
  const videoCategories = {
    frontend: [
      {
        id: 'fe1',
        title: 'Complete React Course for Beginners',
        description: 'Learn React from scratch with practical examples and projects.',
        url: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
        duration: '12:08:40'
      },
      {
        id: 'fe2',
        title: 'CSS Flexbox & Grid Complete Guide',
        description: 'Master modern CSS layout techniques with this comprehensive tutorial.',
        url: 'https://www.youtube.com/watch?v=tRAnFBR4On8',
        duration: '3:42:01'
      },
      {
        id: 'fe3',
        title: 'JavaScript ES6+ Features Every Developer Should Know',
        description: 'Upgrade your JavaScript skills with the latest ES6+ features.',
        url: 'https://www.youtube.com/watch?v=NCwa_xi0Uuc',
        duration: '1:28:47'
      }
    ],
    aiml: [
      {
        id: 'ml1',
        title: 'Machine Learning for JavaScript Developers',
        description: 'Integrate machine learning into your web applications with TensorFlow.js.',
        url: 'https://www.youtube.com/watch?v=WIHZ7kjJ35o',
        duration: '2:19:58'
      },
      {
        id: 'ml2',
        title: 'AI for Web Developers: Practical Applications',
        description: 'Learn how to implement AI features in your web applications.',
        url: 'https://www.youtube.com/watch?v=XB4MIexjvY0',
        duration: '1:45:32'
      }
    ],
    devops: [
      {
        id: 'do1',
        title: 'Docker and Kubernetes for Developers',
        description: 'Learn container technologies to streamline your development workflow.',
        url: 'https://www.youtube.com/watch?v=Wf2eSG3owoA',
        duration: '3:11:28'
      },
      {
        id: 'do2',
        title: 'CI/CD Pipeline Tutorial using GitHub Actions',
        description: 'Set up automated testing and deployment for your web projects.',
        url: 'https://www.youtube.com/watch?v=R8_veQiYBjI',
        duration: '1:23:54'
      }
    ],
    software: [
      {
        id: 'se1',
        title: 'Data Structures and Algorithms in JavaScript',
        description: 'Master fundamental computer science concepts with JavaScript examples.',
        url: 'https://www.youtube.com/watch?v=t2CEgPsws3U',
        duration: '6:21:53'
      },
      {
        id: 'se2',
        title: 'System Design for Web Developers',
        description: 'Learn how to design scalable systems for your web applications.',
        url: 'https://www.youtube.com/watch?v=FKA2KgkkcqY',
        duration: '1:56:09'
      }
    ]
  };

  // Handle video selection
  const handleVideoSelect = (video) => {
    setActiveVideo(video);
    // Scroll to video player
    document.getElementById('video-player').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <Navbar />
      
      {/* Header section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-white">Developer Instructional Videos</h1>
          <p className="text-white mt-2">
            Explore curated tutorials to advance your development skills
          </p>
          {/* Back to Home button removed as requested */}
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto py-8 px-4">
        {/* Category navigation */}
        <div className="flex flex-wrap mb-8 gap-2">
          <button 
            className={`px-4 py-2 rounded-md font-medium ${selectedCategory === 'frontend' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setSelectedCategory('frontend')}
          >
            Frontend Development
          </button>
          <button 
            className={`px-4 py-2 rounded-md font-medium ${selectedCategory === 'aiml' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setSelectedCategory('aiml')}
          >
            AI & Machine Learning
          </button>
          <button 
            className={`px-4 py-2 rounded-md font-medium ${selectedCategory === 'devops' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setSelectedCategory('devops')}
          >
            DevOps
          </button>
          <button 
            className={`px-4 py-2 rounded-md font-medium ${selectedCategory === 'software' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setSelectedCategory('software')}
          >
            Software Engineering
          </button>
        </div>

        {/* Video player section */}
        <div id="video-player" className="mb-8">
          {activeVideo ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ReactPlayer
                  url={activeVideo.url}
                  controls
                  width="100%"
                  height="600px"
                  className="rounded-lg overflow-hidden shadow-lg"
                />
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-2">{activeVideo.title}</h2>
                <p className="text-gray-700 mb-4">{activeVideo.description}</p>
                <p className="text-sm text-gray-600">Duration: {activeVideo.duration}</p>
                <div className="mt-4">
                  <h3 className="font-bold text-lg mb-2">What you'll learn:</h3>
                  <ul className="list-disc pl-5 text-gray-700">
                    <li>Fundamental concepts and best practices</li>
                    <li>Practical implementation techniques</li>
                    <li>Real-world problem solving</li>
                    <li>Industry-standard workflows</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-200 rounded-lg">
              <p className="text-gray-600">Select a video to start watching</p>
            </div>
          )}
        </div>

        {/* Video selection grid */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {selectedCategory === 'frontend' && 'Frontend Development Videos'}
            {selectedCategory === 'aiml' && 'AI & Machine Learning Videos'}
            {selectedCategory === 'devops' && 'DevOps Videos'}
            {selectedCategory === 'software' && 'Software Engineering Videos'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoCategories[selectedCategory].map((video) => (
              <div 
                key={video.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition hover:scale-105"
                onClick={() => handleVideoSelect(video)}
              >
                <img 
                  src={getYouTubeThumbnail(video.url)} 
                  alt={video.title} 
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 truncate">{video.title}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{video.description}</p>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {video.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructionalVideos;