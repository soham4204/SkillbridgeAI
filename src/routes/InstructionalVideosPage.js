// InstructionalVideosPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InstructionalVideosPage = () => {
  const [videos, setVideos] = useState([]);
  const API_KEY = 'YOUR_YOUTUBE_API_KEY';
  const channelId = 'YOUR_CHANNEL_ID'; // Replace with your channel's ID
  const maxResults = 6; // Number of videos to fetch

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=${maxResults}`
        );
        setVideos(response.data.items);
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Instructional Videos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id.videoId} className="bg-white rounded-md shadow-md p-4">
            <iframe
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${video.id.videoId}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={video.snippet.title}
            ></iframe>
            <p className="mt-2 font-semibold">{video.snippet.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstructionalVideosPage;
