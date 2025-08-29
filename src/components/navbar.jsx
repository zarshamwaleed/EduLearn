import { Link, useNavigate } from 'react-router-dom';
import { AcademicCapIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
import '../index.css';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from "../utils/getImageUrl";
function Navbar({ toggleSidebar, isSidebarOpen }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');
  const [isScrolled, setIsScrolled] = useState(false); // New state for scroll position
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Update date and time every second
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formattedDateTime = now.toLocaleString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Karachi', // Set to PKT
      });
      setCurrentDateTime(formattedDateTime);
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Set isScrolled to true if user has scrolled down more than 0 pixels
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/login');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 h-19 transition-all duration-300 ${
        isSidebarOpen ? 'ml-64' : 'ml-20'
      } ${
        isScrolled
          ? 'bg-gradient-to-b from-gray-900 to-gray-800 shadow-lg border-b border-gray-700'
          : 'bg-white shadow-none border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-md text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200"
              aria-label="Toggle sidebar"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>

            <Link to="/" className="flex items-center ml-2 md:ml-4">
              <div className="bg-indigo-500 p-1.5 rounded-lg">
                <AcademicCapIcon className="h-6 w-6 text-white" />
              </div>
              <span
                className={`ml-2 text-xl font-bold ${
                  isScrolled
                    ? 'bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent'
                    : 'text-gray-900'
                }`}
              >
                EduLearn
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <div
              className={`text-sm hidden md:block px-3 py-1.5 rounded-lg font-medium ${
                isScrolled ? 'text-gray-300 bg-gray-700' : 'text-gray-700 bg-gray-100'
              }`}
            >
              <i className={`far fa-clock mr-2 ${isScrolled ? 'text-indigo-400' : 'text-indigo-600'}`}></i>
              {currentDateTime}
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className={`flex items-center space-x-2 text-sm font-medium p-1.5 rounded-lg transition-colors duration-200 ${
                    isScrolled
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-haspopup="true"
                  aria-expanded={showDropdown}
                >
       <img
  src={getImageUrl(user?.profilePic)}
  alt="Profile"
  className="h-8 w-8 rounded-full border-2 border-indigo-500/50"
  onError={(e) => {
    e.target.src = "/default-profile-pic.jpg";
  }}
/>
                  <span className={`hidden md:inline ${isScrolled ? 'text-gray-200' : 'text-gray-900'}`}>
                    {user.name}
                  </span>
                  <svg
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isScrolled ? 'text-gray-400' : 'text-gray-600'
                    } ${showDropdown ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-800 shadow-xl rounded-lg overflow-hidden z-50 border border-gray-700 animate-fadeIn">
                    <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-gray-750 to-gray-800">
                      <p className="font-semibold text-gray-200">{user.name}</p>
                      <p className="text-sm text-gray-400 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-750 transition-colors duration-150"
                        onClick={() => setShowDropdown(false)}
                      >
                        <i className="far fa-user-circle mr-3 text-indigo-400 w-5 text-center"></i>
                        Profile
                      </Link>
                
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors duration-150"
                      >
                        <i className="far fa-sign-out-alt mr-3 w-5 text-center"></i>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md ${
                  isScrolled
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-indigo-500 text-white hover:bg-indigo-600'
                }`}
                >
                <i className="far fa-sign-in-alt mr-2"></i>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;