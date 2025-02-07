import {Link} from 'react-router-dom';
import Logo from '../assets/logo.png'

const Navbar = () => {
    return (
        <div className="bg-white py-2">
        <div className="container mx-auto flex items-center justify-between px-7">
          <Link to="/" className="font-bold text-2xl text-blue-500">
            <img src={Logo} alt="SkillBridge AI" className="w-40 h-auto" />
          </Link>
          <div className="flex justify-center items-center gap-4 py-6">
            <Link to="/" className="font-semibold text-xl px-2 hover:underline hover:text-blue-500 duration-300">Home</Link>
            <Link to="/jobseekers" className="font-semibold text-xl px-2 hover:underline hover:text-blue-500 duration-300">Jobseekers</Link>
            <Link to="/" className="font-semibold text-xl px-2 hover:underline hover:text-blue-500 duration-300">Employers</Link>
            <Link to="/" className="font-semibold text-xl px-2 hover:underline hover:text-blue-500 duration-300">Collaborators</Link>
            <Link to="/aboutus" className="font-semibold text-xl px-2 hover:underline hover:text-blue-500 duration-300">About Us</Link>
            <Link to="/contactus" className="font-semibold text-xl px-2 hover:underline hover:text-blue-500 duration-300">Contact Us</Link>
          </div>
          <div className="flex space-x-4">
            <Link to="/login">
              <button className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700">LOGIN</button>
            </Link>
            <Link to="/signup">
              <button className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700">REGISTER</button>
            </Link>
          </div>
        </div>
      </div>
    )
};

export default Navbar;