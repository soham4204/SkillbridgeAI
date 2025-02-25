import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import jobseeker from '../assets/Jobseeker.png.jpg';
import employers from '../assets/employers.png.jpg';
import collaborators from '../assets/collaborators.png.jpg';
import videoicon from '../assets/videoicon.png';
import Navbar from '../components/Navbar';
import tick from '../assets/tick.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import axios from 'axios';

function Home() {

  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  const newData = {
    api_token: "9JRICQTcPNmg3sIOuRdtTVrtwZVSpFaETpeFZvVT",
    q: "technology OR innovation OR AI OR machine learning OR roboticun s OR pollution OR environment OR sustainability OR climate OR ecology OR conservation OR renewable OR air quality OR waste management OR water pollution",
    country: "IN",
    language: "en",
    page: 1
  };

  const handleVideoClick = () => {
    navigate('/instructional-videos');
  };

  useEffect(() => {
    axios.post('https://api.thenewsapi.com/v1/news/all', newData)
    .then(response => setBlogs(response.data.data))
    .catch(error => console.error(error))
    }, []);

    console.log('blogsssssssssssssssssssss', blogs)
  // Sample blog data
  // const blogs = [
  //   {
  //     title: "5 Tips for a Successful Job Interview",
  //     excerpt: "Master the art of interviewing with these essential tips to stand out in your next job interview.",
  //     image: "https://via.placeholder.com/300x200",
  //     link: "/blog/5-tips-for-a-successful-job-interview"
  //   },
  //   {
  //     title: "The Future of Remote Work",
  //     excerpt: "Explore the trends and challenges shaping the future of remote work in today's digital age.",
  //     image: "https://via.placeholder.com/300x200",
  //     link: "/blog/future-of-remote-work"
  //   },
  //   {
  //     title: "Top 10 Skills Employers Look For",
  //     excerpt: "Discover the most sought-after skills that can help you land your dream job in any industry.",
  //     image: "https://via.placeholder.com/300x200",
  //     link: "/blog/top-10-skills-employers-look-for"
  //   },
  //   {
  //     title: "How to Network Effectively",
  //     excerpt: "Learn the strategies for effective networking that can help advance your career.",
  //     image: "https://via.placeholder.com/300x200",
  //     link: "/blog/how-to-network-effectively"
  //   },
  //   {
  //     title: "Building a Winning Resume",
  //     excerpt: "Tips on how to create a resume that stands out and gets noticed by employers.",
  //     image: "https://via.placeholder.com/300x200",
  //     link: "/blog/building-a-winning-resume"
  //   },
  // ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar/>
      <main className="container mx-auto py-12 px-7">
        {/* Carousel Section */}
        <div className="mb-12">
          <Swiper
            pagination={{ clickable: true }}
            navigation={true}
            spaceBetween={30}
            slidesPerView={1}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {/* Full Stack Developer Slide */}
            <SwiperSlide>
              <div className="flex flex-col justify-center items-center h-64 bg-blue-500 text-white rounded-lg shadow-md p-4">
                <h3 className="text-2xl font-semibold">Full Stack Developer</h3>
                <p className="text-center mt-2">Build and manage both frontend and backend applications using modern web technologies.</p>
                <Link to="/job/full-stack-developer" className="mt-4 px-4 py-2 bg-white text-blue-500 rounded-lg shadow hover:bg-blue-100 transition duration-200">Learn More</Link>
              </div>
            </SwiperSlide>

            {/* AI/ML Engineer Slide */}
            <SwiperSlide>
              <div className="flex flex-col justify-center items-center h-64 bg-green-500 text-white rounded-lg shadow-md p-4">
                <h3 className="text-2xl font-semibold">AI/ML Engineer</h3>
                <p className="text-center mt-2">Develop and deploy AI/ML models using Python, TensorFlow, PyTorch, and data science techniques.</p>
                <Link to="/job/ai-ml-engineer" className="mt-4 px-4 py-2 bg-white text-green-500 rounded-lg shadow hover:bg-blue-100 transition duration-200">Learn More</Link>
              </div>
            </SwiperSlide>

            {/* Cloud and DevOps Engineer Slide */}
            <SwiperSlide>
              <div className="flex flex-col justify-center items-center h-64 bg-yellow-500 text-white rounded-lg shadow-md p-4">
                <h3 className="text-2xl font-semibold">Cloud and DevOps Engineer</h3>
                <p className="text-center mt-2">Manage and automate cloud infrastructure using AWS, Azure, Kubernetes, and Terraform.</p>
                <Link to="/job/cloud-devops-engineer" className="mt-4 px-4 py-2 bg-white text-yellow-500 rounded-lg shadow hover:bg-blue-100 transition duration-200">Learn More</Link>
              </div>
            </SwiperSlide>

            {/* Software Engineer Slide */}
            <SwiperSlide>
              <div className="flex flex-col justify-center items-center h-64 bg-orange-500 text-white rounded-lg shadow-md p-4">
                <h3 className="text-2xl font-semibold">Software Engineer</h3>
                <p className="text-center mt-2">Design, develop, and maintain software applications using various programming languages.</p>
                <Link to="/job/software-engineer" className="mt-4 px-4 py-2 bg-white text-orange-500 rounded-lg shadow hover:bg-blue-100 transition duration-200">Learn More</Link>
              </div>
            </SwiperSlide>

            {/* Add more roles if needed */}
          </Swiper>
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div className="bg-white rounded-md shadow-md p-6 hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out">
            <h2 className="bg-blue-500 text-xl font-bold mb-4 text-white p-2">JOBSEEKERS</h2>
            <img src={jobseeker} alt="Job Seekers" className="w-full h-64" />
            <p className="mt-4">Ready to land your dream job? Click Here to Apply Now!</p>
          </div>
          <div className="bg-white rounded-md shadow-md p-6 hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out">
            <h2 className="bg-blue-500 text-xl font-bold mb-4 text-white p-2">EMPLOYERS</h2>
            <img src={employers} alt="Employers" className="w-full h-64" />
            <p className="mt-4">Looking for top talent? Click Here to Find Your Next Hire!</p>
          </div>
          <div className="bg-white rounded-md shadow-md p-6 hover:scale-105 hover:shadow-lg transition duration-300 ease-in-out">
            <h2 className="bg-blue-500 text-xl font-bold mb-4 text-white p-2">COLLABORATORS</h2>
            <img src={collaborators} alt="Collaborators" className="w-full h-64" />
            <p className="mt-4">Ready to share your expertise? Click Here to Create Your Course!</p>
          </div>
        </div>
        <div className="flex space-x-7">
          <div className="mt-12 bg-white rounded-md shadow-md p-6 w-1/2">
            <h2 className="bg-blue-500 text-xl font-bold mb-4 text-white p-2">Events And News</h2>
            <ul className="list-disc px-6">
              <li>ONLINE JOB DRIVE NEAR MUMBAI SUBURBAN DISTRICTS DATED 22 AUGUST</li>
              <li>ONLINE TRAINING WORKSHOP ON DESIGN SKILLS DATED 24 AUGUST 8.00PM</li>
              <li>MINI JOB FAIR AT KARNATAKA DATED 23 AUGUST 12.00PM</li>
              <li>ONLINE WORKSHOP ON SPEAKING SKILLS DATED 25 AUGUST 7.00PM</li>
            </ul>
          </div>
          <div className="mt-12 bg-white rounded-md shadow-md p-6 w-1/2">
          <h2 className="bg-blue-500 text-xl font-bold mb-4 text-white p-2">Instructional Videos</h2>
          <div className="grid grid-cols-2 gap-6">
            <div
              className="bg-gray-200 rounded-md p-4 hover:bg-gray-300 transition duration-300 ease-in-out cursor-pointer"
              onClick={handleVideoClick} // Navigate on click
            >
              <img src={videoicon} alt="Instructional Video" className="h-11 mx-auto" />
              <p className="mt-2 text-center">Instructional Videos</p>
            </div>
            <div className="bg-gray-200 rounded-md p-4 hover:bg-gray-300 transition duration-300 ease-in-out">
              <img src={tick} alt="Success Story Video" className="h-12 mx-auto" />
              <p className="mt-2 text-center">Success Story Videos</p>
            </div>
          </div>
        </div>
        </div>
        <div className="mt-12 bg-white rounded-md shadow-md p-6 w-1/2 mx-auto">
          <h2 className="text-center text-2xl font-semibold mb-8 bg-blue-500 text-white p-2 rounded-md">
            Latest Blogs
          </h2>
          <Swiper
            pagination={{ clickable: true }}
            navigation={true}
            spaceBetween={30}
            slidesPerView={1}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {blogs.map((blog, index) => (
              <SwiperSlide key={index} className="flex flex-col items-center bg-white rounded-md shadow-md px-24 w-full">
                <img
                  src={blog.image_url}
                  alt={blog.title}
                  className="h-48 w-full object-cover rounded-md mb-4"
                />
                <h3 className="text-2xl font-semibold">{blog.title}</h3>
                <p className="text-left mt-2">{blog.description}</p>
                <Link to={blog.url} className="mt-4 text-blue-500 hover:underline">
                  Read More
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </main>
      
      <footer className="bg-gray-900 py-4 mt-10">
        <div className="container mx-auto text-white text-center">
          <p>&copy; 2024 SkillBridge AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;