import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from "../utils/getImageUrl";
import {
  HomeIcon,
  AcademicCapIcon,
  InformationCircleIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';
import '../index.css';

function Sidebar({ isOpen: propIsOpen, onToggle }) {
  const [isOpen, setIsOpen] = useState(propIsOpen || true);
  const [activePath, setActivePath] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Sync with parent state and track active path
  useEffect(() => {
    setIsOpen(propIsOpen);
    setActivePath(location.pathname);
  }, [propIsOpen, location.pathname]);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(true);
  };

  const toggleSidebar = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    onToggle?.(newIsOpen);
  };

  // Navigation items configuration
  const navItems = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/courses', label: 'Courses', icon: AcademicCapIcon },
    { path: '/about', label: 'About', icon: InformationCircleIcon },
    { path: '/contact', label: 'Contact', icon: EnvelopeIcon },
    { path: '/privacy-policy', label: 'Privacy Policy', icon: DocumentTextIcon },
    { path: '/terms-and-conditions', label: 'Terms & Conditions', icon: DocumentTextIcon },
    { path: '/help', label: 'Help', icon: QuestionMarkCircleIcon },
  ];

  const userNavItems = user
    ? [
        {
          path: user.role === 'student' ? '/student-dashboard' : '/instructor-dashboard',
          label: 'Dashboard',
          icon: ChartBarIcon,
        },
        { path: '/profile', label: 'Profile', icon: UserIcon }
      ]
    : [];

  return (
    <div
      className={`h-screen ${
        isOpen ? 'w-64' : 'w-20'
      } transition-all duration-300 flex flex-col fixed z-40 ${
        isScrolled
          ? 'bg-gradient-to-b from-gray-900 to-gray-800 text-white border-r border-gray-700'
          : 'bg-white text-gray-900 border-r border-transparent'
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-19 px-5 border-b border-gray-700">
        {isOpen && (
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-500 p-2 rounded-lg">
              <AcademicCapIcon
                className={`h-6 w-6 ${isScrolled ? 'text-white' : 'text-gray-900'}`}
              />
            </div>
            <span
              className={`text-xl font-bold ${
                isScrolled
                  ? 'bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent'
                  : 'text-gray-900'
              }`}
            >
              EduLearn
            </span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-md focus:outline-none transition duration-200 ${
            isScrolled ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
          aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isOpen ? (
            <svg
              className={`h-5 w-5 ${isScrolled ? 'text-gray-300' : 'text-gray-600'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className={`h-5 w-5 ${isScrolled ? 'text-gray-300' : 'text-gray-600'}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* User Profile Section */}
      {user && (
        <div
          className={`p-5 border-b ${isScrolled ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
 <img
  src={user?.profilePic || "/default-profile-pic.jpg"}
  alt="Profile"
  className={`h-10 w-10 rounded-full border-2 ${
    isScrolled ? "border-indigo-400" : "border-indigo-500"
  }`}
  onError={(e) => {
    e.currentTarget.src = "/default-profile-pic.jpg";
  }}
/>

              <div
                className={`absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 ${
                  isScrolled ? 'border-gray-800' : 'border-white'
                }`}
              ></div>
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p
                  className={`font-semibold text-sm truncate ${
                    isScrolled ? 'text-gray-200' : 'text-gray-900'
                  }`}
                >
                  {user.name || 'User'}
                </p>
                <p
                  className={`text-xs truncate ${
                    isScrolled ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  {user.email}
                </p>
                <div
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    user.role === 'student'
                      ? isScrolled
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-blue-100 text-blue-800'
                      : isScrolled
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {user.role === 'student' ? 'Student' : 'Instructor'}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
   <nav className="flex-1 p-4 space-y-1 overflow-visible">

        {/* Main Navigation Items */}
        {navItems.map((item) => {
          const isActive =
            activePath === item.path ||
            (item.path !== '/' && activePath.startsWith(item.path));
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? isScrolled
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-indigo-100 text-indigo-900 shadow-sm'
                  : isScrolled
                  ? 'text-gray-300 hover:bg-gray-750 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
              }`}
            >
              <div className="relative group/icon">
                <Icon
                  className={`h-5 w-5 ${
                    isActive
                      ? isScrolled
                        ? 'text-white'
                        : 'text-indigo-900'
                      : isScrolled
                      ? 'text-gray-400'
                      : 'text-gray-600'
                  }`}
                />
                {!isOpen && (
             <div
  className={`absolute left-full ml-3 px-2 py-1 rounded-md shadow-lg text-xs font-medium transition-opacity duration-200 whitespace-nowrap z-50 ${
    isScrolled ? 'bg-gray-900 text-white' : 'bg-gray-800 text-gray-200'
  } opacity-0 group-hover/icon:opacity-100`}
>
  {item.label}
</div>

                )}
              </div>
              {isOpen && <span className="ml-3">{item.label}</span>}
            </Link>
          );
        })}

        {/* User-specific Navigation Items */}
        {userNavItems.length > 0 && (
          <div
            className={`pt-4 mt-4 border-t ${
              isScrolled ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            {userNavItems.map((item) => {
              const isActive = activePath === item.path;
              const Icon = item.icon;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? isScrolled
                        ? 'bg-indigo-600 text-white shadow-lg'
                        : 'bg-indigo-100 text-indigo-900 shadow-sm'
                      : isScrolled
                      ? 'text-gray-300 hover:bg-gray-750 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  <div className="relative group/icon">
                    <Icon
                      className={`h-5 w-5 ${
                        isActive
                          ? isScrolled
                            ? 'text-white'
                            : 'text-indigo-900'
                          : isScrolled
                          ? 'text-gray-400'
                          : 'text-gray-600'
                      }`}
                    />
                    {!isOpen && (
                      <div
                        className={`absolute left-full ml-3 px-2 py-1 rounded-md shadow-lg text-xs font-medium transition-opacity duration-200 whitespace-nowrap pointer-events-none ${
                          isScrolled
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-800 text-gray-200'
                        } opacity-0 group-hover/icon:opacity-100`}
                      >
                        {item.label}
                      </div>
                    )}
                  </div>
                  {isOpen && <span className="ml-3">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Logout/Login Section */}
      <div
        className={`p-4 border-t ${isScrolled ? 'border-gray-700' : 'border-gray-200'}`}
      >
        {user ? (
          <button
            onClick={handleLogout}
            className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 w-full ${
              isScrolled
                ? 'text-gray-300 hover:bg-red-500/20 hover:text-red-300'
                : 'text-gray-700 hover:bg-red-100 hover:text-red-600'
            }`}
          >
            <div className="relative group/icon">
              <ArrowRightOnRectangleIcon
                className={`h-5 w-5 ${
                  isScrolled ? 'text-gray-400' : 'text-gray-600'
                }`}
              />
              {!isOpen && (
                <div
                  className={`absolute left-full ml-3 px-2 py-1 rounded-md shadow-lg text-xs font-medium transition-opacity duration-200 whitespace-nowrap pointer-events-none ${
                    isScrolled
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-800 text-gray-200'
                  } opacity-0 group-hover/icon:opacity-100`}
                >
                  Logout
                </div>
              )}
            </div>
            {isOpen && <span className="ml-3">Logout</span>}
          </button>
        ) : (
          <Link
            to="/login"
            className={`flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              activePath === '/login'
                ? isScrolled
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-indigo-100 text-indigo-900 shadow-sm'
                : isScrolled
                ? 'text-gray-300 hover:bg-gray-750 hover:text-white'
                : 'text-gray-700 hover:bg-gray-200 hover:text-gray-900'
            }`}
          >
            <div className="relative group/icon">
              <ArrowRightOnRectangleIcon
                className={`h-5 w-5 ${
                  activePath === '/login'
                    ? isScrolled
                      ? 'text-white'
                      : 'text-indigo-900'
                    : isScrolled
                    ? 'text-gray-400'
                    : 'text-gray-600'
                }`}
              />
              {!isOpen && (
                <div
                  className={`absolute left-full ml-3 px-2 py-1 rounded-md shadow-lg text-xs font-medium transition-opacity duration-200 whitespace-nowrap pointer-events-none ${
                    isScrolled
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-800 text-gray-200'
                  } opacity-0 group-hover/icon:opacity-100`}
                >
                  Login
                </div>
              )}
            </div>
            {isOpen && <span className="ml-3">Login</span>}
          </Link>
        )}
      </div>
    </div>
  );
}

export default Sidebar;