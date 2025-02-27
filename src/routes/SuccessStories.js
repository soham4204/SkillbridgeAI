import React, { useState } from 'react';
import ReactPlayer from 'react-player/youtube';
import Navbar from '../components/Navbar'; // Update this path to match your project structure

const SuccessStories = () => {
  const [selectedCategory, setSelectedCategory] = useState('career');
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

  // Success story videos organized by categories
  const videoCategories = {
    career: [
      {
        id: 'career1',
        title: 'From Junior to Senior Developer in 2 Years',
        description: 'Learn how Sarah transformed her career through consistent learning and strategic project choices.',
        url: 'https://www.youtube.com/watch?v=r_MbozD32eo',
        duration: '18:42',
        author: 'Sarah Chen'
      },
      {
        id: 'career2',
        title: 'How I Landed My Dream Job at a Tech Giant',
        description: 'Follow Mark\'s journey from bootcamp graduate to working at one of the top tech companies.',
        url: 'https://www.youtube.com/watch?v=4vKiJZNPhss',
        duration: '22:15',
        author: 'Mark Johnson'
      },
      {
        id: 'career3',
        title: 'Switching Careers: From Teacher to Developer',
        description: 'Jane shares how she successfully transitioned from education to tech with no prior coding experience.',
        url: 'https://www.youtube.com/watch?v=u7UyiLCQGas',
        duration: '24:56',
        author: 'Jane Williams'
      }
    ],
    freelance: [
      {
        id: 'freelance1',
        title: 'Building a Six-Figure Freelance Development Business',
        description: 'Dave explains his strategies for finding high-value clients and scaling his freelance operation.',
        url: 'https://www.youtube.com/watch?v=MJUJ4wbFm_A',
        duration: '32:18',
        author: 'Dave Rodriguez'
      },
      {
        id: 'freelance2',
        title: 'How I Got My First 10 Clients as a Freelance Developer',
        description: 'Practical tips on starting your freelance journey with no connections or portfolio.',
        url: 'https://www.youtube.com/watch?v=sDnPs_V87Dk',
        duration: '26:04',
        author: 'Priya Sharma'
      }
    ],
    startup: [
      {
        id: 'startup1',
        title: 'From Side Project to Funded Startup: My Journey',
        description: 'Learn how Alex turned a weekend project into a venture-backed company.',
        url: 'https://www.youtube.com/watch?v=RpT3BA_mK1I',
        duration: '28:45',
        author: 'Alex Torres'
      },
      {
        id: 'startup2',
        title: 'Bootstrapping Our SaaS to $50K MRR',
        description: 'The co-founders share their experience growing a profitable business without external funding.',
        url: 'https://www.youtube.com/watch?v=epHFUWmrAPg',
        duration: '34:22',
        author: 'Michael & Lisa Reynolds'
      }
    ],
    learning: [
      {
        id: 'learning1',
        title: 'How I Mastered 5 Programming Languages in 3 Years',
        description: 'Kevin shares his efficient learning system for rapidly acquiring new technical skills.',
        url: 'https://www.youtube.com/watch?v=5t9yk0HVzPI',
        duration: '19:36',
        author: 'Kevin Zhang'
      },
      {
        id: 'learning2',
        title: 'Self-Taught Developer: My Learning Path and Tips',
        description: 'A complete roadmap from zero knowledge to employment without a CS degree.',
        url: 'https://www.youtube.com/watch?v=qvn2JFX4lHs',
        duration: '25:18',
        author: 'Emma Wilson'
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
      <div className="bg-gradient-to-r from-green-600 to-green-800 py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-white">Developer Success Stories</h1>
          <p className="text-white mt-2">
            Real journeys and inspirational stories from developers who've achieved their goals
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto py-8 px-4">
        {/* Category navigation */}
        <div className="flex flex-wrap mb-8 gap-2">
          <button 
            className={`px-4 py-2 rounded-md font-medium ${selectedCategory === 'career' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setSelectedCategory('career')}
          >
            Career Growth
          </button>
          <button 
            className={`px-4 py-2 rounded-md font-medium ${selectedCategory === 'freelance' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setSelectedCategory('freelance')}
          >
            Freelance Success
          </button>
          <button 
            className={`px-4 py-2 rounded-md font-medium ${selectedCategory === 'startup' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setSelectedCategory('startup')}
          >
            Startup Stories
          </button>
          <button 
            className={`px-4 py-2 rounded-md font-medium ${selectedCategory === 'learning' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}
            onClick={() => setSelectedCategory('learning')}
          >
            Learning Journeys
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
                <p className="text-gray-600 mb-1">By {activeVideo.author}</p>
                <p className="text-gray-700 mb-4">{activeVideo.description}</p>
                <p className="text-sm text-gray-600">Duration: {activeVideo.duration}</p>
                <div className="mt-4">
                  <h3 className="font-bold text-lg mb-2">Key Takeaways:</h3>
                  <ul className="list-disc pl-5 text-gray-700">
                    <li>Practical strategies that worked in real situations</li>
                    <li>Common obstacles and how they were overcome</li>
                    <li>Timeline of progress and milestones</li>
                    <li>Advice for developers on similar paths</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-200 rounded-lg">
              <p className="text-gray-600">Select a success story to start watching</p>
            </div>
          )}
        </div>

        {/* Video selection grid */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {selectedCategory === 'career' && 'Career Growth Stories'}
            {selectedCategory === 'freelance' && 'Freelance Success Stories'}
            {selectedCategory === 'startup' && 'Startup Journey Stories'}
            {selectedCategory === 'learning' && 'Learning Achievement Stories'}
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
                  <p className="text-gray-600 text-sm mb-1">By {video.author}</p>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{video.description}</p>
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
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

export default SuccessStories;