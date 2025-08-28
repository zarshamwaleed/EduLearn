import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  BookOpenIcon,
  UserGroupIcon,
  ChartBarIcon,
  PencilIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import CreateCourseForm from "../components/CreateCourseForm";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";

const InstructorDashboard = () => {
  const {
    user,
    setUser,
    getToken,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editProfile, setEditProfile] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const filteredCourses = courses.filter(
    (course) => String(course.instructorId) === String(user._id)
  );


  // Sync editUser with user from context
  useEffect(() => {
    setEditUser(user);
  }, [user]);

  // Fetch courses from backend
  const fetchCourses = async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await axios.get("http://localhost:5000/api/courses/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Courses response:", response.data); // Debug log
      setCourses(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(
        "Error fetching courses:",
        err.response?.data || err.message
      );
      if (err.response?.status === 404) {
        // Handle missing endpoint gracefully
        setCourses([]);
        console.log(
          "Courses endpoint not found, defaulting to empty course list"
        );
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Unauthorized: Please log in again");
        localStorage.removeItem("authToken");
        navigate("/login");
      } else {
        setError(
          `Failed to load courses: ${
            err.response?.data?.message || err.message
          }`
        );
      }
    }
  };

  // Fetch analytics (placeholder, as endpoint not implemented)
  const fetchAnalytics = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("No authentication token found");
      const response = await axios.get("http://localhost:5000/api/analytics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Analytics response:", response.data);
      setAnalytics(response.data);
    } catch (err) {
      console.error(
        "Error fetching analytics:",
        err.response?.data || err.message
      );
      setError(
        `Failed to load analytics: ${
          err.response?.data?.message || err.message
        }`
      );
    }
  };

  // Fetch feedback (placeholder, as endpoint not implemented)
  const fetchFeedbacks = async () => {
    try {
      setFeedbackLoading(true);
      const token = getToken();
      if (!token) throw new Error("No authentication token found");
      const response = await axios.get("http://localhost:5000/api/feedback", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Feedback response:", response.data);
      setFeedbacks(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error(
        "Error fetching feedback:",
        err.response?.data || err.message
      );
      setError(
        `Failed to load feedback: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setFeedbackLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setError("User not authenticated");
      navigate("/login");
      return;
    }

    if (authLoading) return; // Wait for auth to complete

    // Fetch data based on active tab
    if (activeTab === "dashboard") {
      fetchCourses();
    } else if (activeTab === "analytics") {
      fetchAnalytics();
    } else if (activeTab === "feedback") {
      fetchFeedbacks();
    }
  }, [activeTab, authLoading, isAuthenticated, navigate]);

  const handleNewCourse = () => {
    setCourseToEdit(null);
    setShowCreateForm(true);
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const token = getToken();
      await axios.delete(`http://localhost:5000/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(courses.filter((course) => course._id !== courseId));
    } catch (err) {
      console.error(
        "Error deleting course:",
        err.response?.data || err.message
      );
      setError(
        `Failed to delete course: ${err.response?.data?.message || err.message}`
      );
    }
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
  };

  const handleProfileChange = (e) => {
    setEditUser({
      ...editUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append("profilePic", file);
        const token = getToken();
        const response = await axios.put(
          "http://localhost:5000/api/auth/profile/picture",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Updated profile picture:", response.data);
        setUser(response.data);
      } catch (err) {
        console.error(
          "Error updating profile picture:",
          err.response?.data || err.message
        );
        setError(
          `Failed to update profile picture: ${
            err.response?.data?.message || err.message
          }`
        );
      }
    }
  };

  const saveProfile = async () => {
    try {
      const token = getToken();
      const response = await axios.put(
        "http://localhost:5000/api/auth/profile",
        editUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Updated profile:", response.data);
      setUser(response.data);
      setEditProfile(false);
    } catch (err) {
      console.error("Error saving profile:", err.response?.data || err.message);
      setError(
        `Failed to save profile: ${err.response?.data?.message || err.message}`
      );
    }
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <StarIcon
          key={i}
          className={`h-5 w-5 ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
        />
      ));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">
          No user data available. Please log in again.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8 relative">
                <img
                  className="h-24 w-24 rounded-full border-4 border-white shadow-md"
                  src={
                    user.profilePic
                      ? `http://localhost:5000/${user.profilePic}`
                      : "https://via.placeholder.com/150"
                  }
                  alt="Instructor profile"
                />
                <button
                  onClick={() => setEditProfile(true)}
                  className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100"
                >
                  <PencilIcon className="h-4 w-4 text-indigo-600" />
                </button>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Welcome back, {user.name || "Instructor"}!
                </h1>
                <p className="mt-2 text-purple-100 max-w-lg">
                  {user.bio || "No bio available"}
                </p>
                <p className="mt-2 text-purple-100">
                  {user.email || "No email available"}
                </p>
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={handleNewCourse}
                    className="bg-white text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-lg font-medium shadow-sm transition duration-200"
                  >
                    Create New Course
                  </button>
                  <button
                    onClick={() => setActiveTab("analytics")}
                    className="text-white border border-white hover:bg-purple-700 px-4 py-2 rounded-lg font-medium shadow-sm transition duration-200"
                  >
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`${
                activeTab === "dashboard"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`${
                activeTab === "analytics"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab("feedback")}
              className={`${
                activeTab === "feedback"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Student Feedback
            </button>
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <>
            {/* Your Courses */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Your Courses
              </h2>
              {filteredCourses.length === 0 ? (
                <p className="text-gray-500">
                  No courses available. Create a new course to get started!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <div
                      key={course._id}
                      className="bg-white rounded-lg shadow-md overflow-hidden"
                    >
                      <div className="h-48 w-full overflow-hidden">
                        <img
                          src={
                            course.image_url ||
                            "https://via.placeholder.com/300x200"
                          }
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          {course.description}
                        </p>
                        <p className="text-gray-600 mb-2">
                          Price: ${course.price}
                        </p>
                        <p className="text-gray-600 mb-2">
                          Duration: {course.duration_weeks} weeks
                        </p>
                        <p className="text-gray-600 mb-4">
                          Status: {course.status}
                        </p>
                        <div className="flex justify-between">
                          <button
                            onClick={() => navigate(`/courses/${course._id}`)}
                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course._id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                        <BookOpenIcon className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-5">
                        <h3 className="text-lg font-medium text-gray-800">
                          Create New Course
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Start building your next course
                        </p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={handleNewCourse}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition duration-200"
                      >
                        Get Started
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                        <ChartBarIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="ml-5">
                        <h3 className="text-lg font-medium text-gray-800">
                          View Analytics
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          See detailed course performance
                        </p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={() => setActiveTab("analytics")}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-200"
                      >
                        View Dashboard
                      </button>
                    </div>
                  </div>
                </div>
                <div className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                        <UserGroupIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="ml-5">
                        <h3 className="text-lg font-medium text-gray-800">
                          Student Feedback
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Read recent student reviews
                        </p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={() => setActiveTab("feedback")}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition duration-200"
                      >
                        View Feedback
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && analytics && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Course Analytics
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800">
                  Total Students
                </h3>
                <p className="text-xl font-semibold text-indigo-600">
                  {analytics.stats.totalStudents}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800">
                  Total Revenue
                </h3>
                <p className="text-xl font-semibold text-green-600">
                  {formatCurrency(analytics.stats.totalRevenue)}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800">
                  Average Rating
                </h3>
                <p className="text-xl font-semibold text-yellow-600">
                  {analytics.stats.averageRating.toFixed(1)}/5
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-800">
                  Total Courses
                </h3>
                <p className="text-xl font-semibold text-blue-600">
                  {analytics.stats.courseCount}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Monthly Enrollments
              </h3>
              <div className="h-64">
                <LineChart
                  width={600}
                  height={300}
                  data={analytics.charts.monthlyEnrollments}
                >
                  <Line
                    type="monotone"
                    dataKey="enrollments"
                    stroke="#4f46e5"
                  />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                </LineChart>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Monthly Revenue
              </h3>
              <div className="h-64">
                <LineChart
                  width={600}
                  height={300}
                  data={analytics.charts.monthlyRevenue}
                >
                  <Line type="monotone" dataKey="revenue" stroke="#16a34a" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                </LineChart>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mb-8">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Top Performing Courses
              </h3>
              <div className="space-y-4">
                {analytics.charts.topCourses.map((course, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2/5 font-medium text-gray-700 truncate">
                      {course.title}
                    </div>
                    <div className="w-3/5">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-indigo-600 h-2.5 rounded-full"
                          style={{
                            width: `${
                              (course.enrollments /
                                Math.max(
                                  ...analytics.charts.topCourses.map(
                                    (c) => c.enrollments
                                  )
                                )) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-1/5 text-right text-sm text-gray-500">
                      {course.enrollments.toLocaleString()} students
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === "feedback" && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Student Feedback
            </h2>
            {feedbackLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : feedbacks.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                No feedback received yet for your courses.
              </div>
            ) : (
              <div className="space-y-6">
                {feedbacks.map((feedback) => (
                  <div
                    key={feedback._id}
                    className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-indigo-600 font-medium">
                            {feedback.student_name?.charAt(0) || "S"}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-800">
                            {feedback.student_name || "Anonymous Student"}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {new Date(
                              feedback.feedback_date
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center">
                          {renderStars(feedback.rating || 0)}
                          <span className="ml-2 text-xs text-gray-500">
                            {feedback.rating?.toFixed(1) || "0.0"} rating
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          {feedback.feedback || "No feedback text provided"}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            Course: {feedback.course_title || "Unknown Course"}
                          </span>
                          <button
                            className="text-xs text-indigo-600 hover:text-indigo-800"
                            onClick={() => {
                              console.log("Reply to feedback:", feedback._id);
                            }}
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Create/Edit Course Modal */}
        {showCreateForm && (
          <CreateCourseForm
            onClose={handleCloseForm}
            courseToEdit={courseToEdit}
          />
        )}

        {/* Edit Profile Modal */}
        {editProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Edit Profile
                  </h2>
                  <button
                    onClick={() => setEditProfile(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="h-6 w-6"
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
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4">
                      <img
                        className="h-24 w-24 rounded-full border-4 border-white shadow-md"
                        src={
                          editUser?.profilePic
                            ? `http://localhost:5000/${editUser.profilePic}`
                            : "https://via.placeholder.com/150"
                        }
                        alt="Profile preview"
                      />
                      <label className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 cursor-pointer">
                        <PencilIcon className="h-4 w-4 text-indigo-600" />
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
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editUser?.name || ""}
                      onChange={handleProfileChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editUser?.email || ""}
                      onChange={handleProfileChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      rows={4}
                      value={editUser?.bio || ""}
                      onChange={handleProfileChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setEditProfile(false)}
                      className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={saveProfile}
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Save Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
