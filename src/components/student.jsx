import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { PencilIcon, BookOpenIcon, ChartBarIcon, AcademicCapIcon, PlayIcon } from "@heroicons/react/24/solid";
import { ClockIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import axios from "axios";
import { getImageUrl } from "../utils/getImageUrl";
import { useAuth } from "../context/AuthContext";
import api from "../api"; 
export default function StudentDashboard() {
  const {
    user,
    setUser,
    getToken,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    email: "",
  });
  const [error, setError] = useState(null);

  console.log("user", user);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !user) {
      setError("User not authenticated");
      navigate("/login");
      return;
    }

    if (user) {
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        email: user.email || "",
      });
    }

    fetchEnrolledCourses();
  }, [authLoading, isAuthenticated, user, navigate]);

  const fetchEnrolledCourses = async () => {
  try {
    const { data } = await api.get("/courses/enrolled");
    console.log("Enrolled courses response:", data);
    setEnrolledCourses(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error("Error fetching enrolled courses:", err.response?.data || err.message);

    if (err.response?.status === 404 || err.response?.status === 403) {
      setEnrolledCourses([]);
      console.log("No enrolled courses found or unauthorized, defaulting to empty list");
    } else {
      setError(
        `Failed to load enrolled courses: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  } finally {
    setIsLoading(false);
  }
};

  const handleEditProfile = () => {
    setShowEditForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleProfileImageChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const formData = new FormData();
    formData.append("profilePic", file);

    const token = getToken(); // ensure token included
    const response = await api.put("/auth/profile/picture", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUser(response.data);
  } catch (err) {
    console.error("Error updating profile picture:", err.response?.data || err.message);
    setError(`Failed to update profile picture: ${err.response?.data?.message || err.message}`);
  }
};


 const handleSaveProfile = async () => {
  try {
    const response = await api.put("/auth/profile", formData);

    console.log("Updated profile:", response.data);
    setUser(response.data);
    setShowEditForm(false);
  } catch (err) {
    console.error("Error saving profile:", err.response?.data || err.message);
    setError(
      `Failed to save profile: ${err.response?.data?.message || err.message}`
    );
  }
};
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-600 font-medium">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-red-50">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-red-100">
          <div className="text-red-500 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="text-gray-500 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No User Data</h3>
            <p>No user data available. Please log in again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
 <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
  <div className="px-6 py-8 w-[1410px] ml-24">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Welcome back, {user.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-600 text-lg">Continue your learning journey</p>
        </div>

        {/* Student Profile Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
            <div className="relative">
<img
  src={user.profilePic || "/default-profile-pic.jpg"}
  alt={user.name || "Profile"}
  className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
/>

              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">{user.name}</h2>
              <div className="flex flex-col space-y-2 mb-4">
                <p className="text-slate-600 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  {user.email}
                </p>
                {/* <p className="text-slate-500 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v1a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2h5z" />
                  </svg>
                  Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p> */}
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-slate-700 mb-2">About</h3>
                <p className="text-slate-600 bg-slate-50 rounded-lg p-3">
                  {user.bio || "No bio available - tell us about yourself!"}
                </p>
              </div>
            </div>
            <div className="lg:ml-auto">
              <button
                onClick={handleEditProfile}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
              >
                <PencilIcon className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-1">
                  Total Courses
                </h3>
                <p className="text-3xl font-bold text-indigo-600">
                  {enrolledCourses.length}
                </p>
                <p className="text-sm text-slate-500 mt-1">Enrolled courses</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <BookOpenIcon className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-1">
                  In Progress
                </h3>
                <p className="text-3xl font-bold text-amber-500">
                  {enrolledCourses.filter((course) => course.status === "in_progress").length}
                </p>
                <p className="text-sm text-slate-500 mt-1">Active learning</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <ClockIcon className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-1">
                  Completed
                </h3>
                <p className="text-3xl font-bold text-emerald-600">
                  {enrolledCourses.filter((course) => course.status === "completed").length}
                </p>
                <p className="text-sm text-slate-500 mt-1">Achievements</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
              <AcademicCapIcon className="w-7 h-7 text-indigo-600 mr-3" />
              My Learning Path
            </h2>
            <Link
              to="/courses"
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Explore More
            </Link>
          </div>
          
          {enrolledCourses.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpenIcon className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No courses yet</h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                Start your learning journey by enrolling in your first course. Discover new skills and advance your career.
              </p>
              <Link
                to="/courses"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center space-x-2"
              >
                <BookOpenIcon className="w-5 h-5" />
                <span>Browse Courses</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <div
                  key={course._id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-slate-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.image_url || "https://via.placeholder.com/300x200"}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x200";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <span
                        className={`text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg ${
                          course.status === "completed"
                            ? "bg-emerald-500 text-white"
                            : "bg-amber-500 text-white"
                        }`}
                      >
                        {course.status === "completed" ? "Completed" : "In Progress"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {course.instructor_name || "Unknown Instructor"}
                    </p>
                    
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 font-medium">Progress</span>
                        <span className="text-slate-800 font-semibold">{course.progress}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            course.status === "completed" 
                              ? "bg-gradient-to-r from-emerald-400 to-emerald-600" 
                              : "bg-gradient-to-r from-indigo-400 to-purple-500"
                          }`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <button
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-2 group"
                      onClick={() => navigate(`/courses/${course._id}`)}
                    >
                      <PlayIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      <span>{course.progress > 0 ? "Continue Learning" : "Start Course"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Profile Modal */}
        {showEditForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">
                    Edit Profile
                  </h2>
                  <button
                    onClick={() => setShowEditForm(false)}
                    className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-6">
<img
  className="h-32 w-32 rounded-2xl border-4 border-white shadow-xl object-cover"
  src={user.profilePic || "/default-profile-pic.jpg"}
  alt="Profile preview"
  onError={(e) => {
    e.currentTarget.src = "/default-profile-pic.jpg"; // fallback agar Cloudinary image load fail ho jaye
  }}
/>

                      <label className="absolute -bottom-2 -right-2 bg-indigo-600 hover:bg-indigo-700 p-3 rounded-xl shadow-lg hover:shadow-xl cursor-pointer transition-all duration-200 group">
                        <PencilIcon className="h-4 w-4 text-white group-hover:rotate-12 transition-transform" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfileImageChange}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 outline-none resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                </div>
                
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="flex-1 px-6 py-3 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}