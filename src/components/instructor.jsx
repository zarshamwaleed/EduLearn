import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import {
  BookOpenIcon,
  UserGroupIcon,
  ChartBarIcon,
  PencilIcon,
  StarIcon,
  XMarkIcon,
  PlusIcon,
  EyeIcon,
  TrashIcon,
  CurrencyDollarIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import CreateCourseForm from "../components/CreateCourseForm";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
} from "recharts";

const InstructorDashboard = () => {
  const { user, setUser, getToken, isAuthenticated, loading: authLoading } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editProfile, setEditProfile] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [profilePreview, setProfilePreview] = useState("");

  const filteredCourses = courses.filter(
    (course) => String(course.instructorId) === String(user._id)
  );

  // Sample data for graphs
  const monthlyRevenueData = [
    { month: "Jan", revenue: 4000, students: 240 },
    { month: "Feb", revenue: 3000, students: 139 },
    { month: "Mar", revenue: 2000, students: 980 },
    { month: "Apr", revenue: 2780, students: 390 },
    { month: "May", revenue: 1890, students: 480 },
    { month: "Jun", revenue: 2390, students: 380 },
    { month: "Jul", revenue: 3490, students: 430 },
  ];

  const coursePerformanceData = filteredCourses.length > 0
    ? filteredCourses.map((course, index) => ({
        name: course.title.slice(0, 20) + (course.title.length > 20 ? "..." : ""),
        students: Math.floor(Math.random() * 100) + 10,
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
        revenue: Math.floor(Math.random() * 5000) + 1000,
      }))
    : [
        { name: "React Fundamentals", students: 45, rating: 4.5, revenue: 2250 },
        { name: "Advanced JavaScript", students: 32, rating: 4.2, revenue: 1600 },
        { name: "Node.js Masterclass", students: 28, rating: 4.8, revenue: 1400 },
        { name: "Web Development", students: 55, rating: 4.1, revenue: 2750 },
      ];

  const studentEngagementData = [
    { name: "Active", value: 65, color: "#10B981" },
    { name: "Completed", value: 25, color: "#3B82F6" },
    { name: "Dropped", value: 10, color: "#EF4444" },
  ];

  const weeklyEnrollmentData = [
    { week: "Week 1", enrollments: 12 },
    { week: "Week 2", enrollments: 19 },
    { week: "Week 3", enrollments: 8 },
    { week: "Week 4", enrollments: 15 },
    { week: "Week 5", enrollments: 22 },
    { week: "Week 6", enrollments: 18 },
    { week: "Week 7", enrollments: 25 },
  ];

  const ratingDistributionData = [
    { rating: "5 Stars", count: 45, color: "#F59E0B" },
    { rating: "4 Stars", count: 32, color: "#10B981" },
    { rating: "3 Stars", count: 18, color: "#6366F1" },
    { rating: "2 Stars", count: 8, color: "#EF4444" },
    { rating: "1 Star", count: 3, color: "#6B7280" },
  ];

  useEffect(() => {
    setEditUser(user);
  }, [user]);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses");
      setCourses(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching courses:", err.response?.data || err.message);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Unauthorized: Please log in again");
        localStorage.removeItem("authToken");
        navigate("/login");
      } else {
        setError(`Failed to load courses: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await api.get("/analytics/instructor");
      setAnalytics(response.data);
    } catch (err) {
      console.error("Error fetching analytics:", err.response?.data || err.message);
      setError(`Failed to load analytics: ${err.response?.data?.message || err.message}`);
    }
  };

  useEffect(() => {
    console.log("Analytics state:", analytics);
    if (!authLoading && !isAuthenticated) {
      setError("User not authenticated");
      navigate("/login");
      return;
    }
    if (authLoading) return;
    fetchCourses();
    fetchAnalytics();
  }, [activeTab, authLoading, isAuthenticated, navigate]);

  const handleNewCourse = () => {
    setCourseToEdit(null);
    setShowCreateForm(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await api.delete(`/create-course/${courseId}`);
      setCourses(courses.filter((course) => course._id !== courseId));
    } catch (err) {
      console.error("Error deleting course:", err.response?.data || err.message);
      setError(`Failed to delete course: ${err.response?.data?.message || err.message}`);
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

  useEffect(() => {
    if (editUser?.profilePic && typeof editUser.profilePic === "string") {
      setProfilePreview(`${import.meta.env.VITE_API_URL.replace("/api", "")}/${editUser.profilePic}`);
    } else {
      setProfilePreview("");
    }
  }, [editUser?.profilePic]);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePreview(reader.result);
      reader.readAsDataURL(file);
      setEditUser((prev) => ({ ...prev, profilePic: file }));
    }
  };

  const saveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editUser.name || "");
      formData.append("email", editUser.email || "");
      formData.append("bio", editUser.bio || "");
      if (editUser.profilePic instanceof File) {
        formData.append("profilePic", editUser.profilePic);
      }

      const token = getToken();
      const response = await api.put("/auth/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
      setEditProfile(false);
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Error saving profile:", err.response?.data || err.message);
      setError(`Failed to save profile: ${err.response?.data?.message || err.message}`);
    }
  };

  const renderStars = (rating) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <StarIcon
          key={i}
          className={`h-5 w-5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
        />
      ));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-600 font-medium">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.dataKey === "revenue" ? formatCurrency(entry.value) : entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 text-center font-medium">{error}</div>
          <button
            onClick={() => {
              setError(null);
              fetchCourses();
              fetchAnalytics();
            }}
            className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-gray-500 mb-4">
            No user data available. Please log in again.
          </div>
          <button
            onClick={() => navigate("/login")}
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-8 w-[1410px] ml-24">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8 relative">
                <div className="relative">
                  <img
                    className="h-24 w-24 rounded-full border-4 border-white shadow-lg object-cover"
                    src={
                      user?.profilePic ||
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?..."
                    }
                    alt="Instructor profile"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?...";
                    }}
                  />
                  <button
                    onClick={() => setEditProfile(true)}
                    className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  >
                    <PencilIcon className="h-4 w-4 text-indigo-600" />
                  </button>
                </div>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-white">
                  Welcome back, {user.name || "Instructor"}!
                </h1>
                <p className="mt-2 text-indigo-100 max-w-lg">
                  {user.bio || "Share your knowledge and inspire students around the world."}
                </p>
                <p className="mt-1 text-indigo-100">
                  {user.email || "No email available"}
                </p>
                <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
                  <button
                    onClick={handleNewCourse}
                    className="bg-white text-indigo-600 hover:bg-indigo-50 px-5 py-3 rounded-lg font-medium shadow-sm transition duration-200 flex items-center"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Create New Course
                  </button>
                  <button
                    onClick={() => setActiveTab("analytics")}
                    className="text-white border border-indigo-300 hover:bg-indigo-700 px-5 py-3 rounded-lg font-medium shadow-sm transition duration-200 flex items-center"
                  >
                    <ChartBarIcon className="h-5 w-5 mr-2" />
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <nav className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`${
                activeTab === "dashboard"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } flex-1 whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`${
                activeTab === "analytics"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } flex-1 whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm`}
            >
              Analytics
            </button>
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-indigo-400">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                    <AcademicCapIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-500">Total Courses</h3>
                    <p className="text-2xl font-semibold text-gray-900">
                      {analytics?.stats.courseCount || filteredCourses.length || 0}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-400">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <UserGroupIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-500">Total Students</h3>
                    <p className="text-2xl font-semibold text-gray-900">
                      {analytics?.stats.totalStudents ? formatNumber(analytics.stats.totalStudents) : "0"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-400">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                    <StarIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-500">Average Rating</h3>
                    <p className="text-2xl font-semibold text-gray-900">
                      {analytics?.stats.averageRating ? analytics.stats.averageRating.toFixed(1) : "0.0"}/5
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-400">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                    <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-500">Total Revenue</h3>
                    <p className="text-2xl font-semibold text-gray-900">
                      {analytics?.stats.totalRevenue ? formatCurrency(analytics.stats.totalRevenue) : "$0"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Courses */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Your Courses</h2>
                <button
                  onClick={handleNewCourse}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  New Course
                </button>
              </div>
              {filteredCourses.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No courses</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new course.</p>
                  <div className="mt-6">
                    <button
                      onClick={handleNewCourse}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <PlusIcon className="h-5 w-5 mr-2" />
                      New Course
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <div
                      key={course._id}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="h-48 w-full overflow-hidden">
                        <img
                          src={
                            course?.image_url ||
                            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                          }
                          alt={course?.title || "Course image"}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80";
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {course.description}
                        </p>
                        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                          <span>${course.price}</span>
                          <span>{course.duration_weeks} weeks</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              course.status === "published"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {course.status || "published"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <button
                            onClick={() => navigate(`/courses/${course._id}`)}
                            className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center text-sm"
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(course._id)}
                            className="text-red-600 hover:text-red-800 font-medium flex items-center text-sm"
                          >
                            <TrashIcon className="h-4 w-4 mr-1" />
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
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                      <BookOpenIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-800">
                        Create New Course
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Start building your next course and share your expertise with students worldwide.
                  </p>
                  <button
                    onClick={handleNewCourse}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition duration-200 text-sm font-medium"
                  >
                    Get Started
                  </button>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                      <ChartBarIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-800">
                        View Analytics
                      </h3>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    Analyze your course performance, student engagement, and revenue metrics.
                  </p>
                  <button
                    onClick={() => setActiveTab("analytics")}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition duration-200 text-sm font-medium"
                  >
                    View Dashboard
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                    <UserGroupIcon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-500">Total Students</h3>
                    <p className="text-2xl font-semibold text-gray-900">
                      {analytics?.stats.totalStudents ? formatNumber(analytics.stats.totalStudents) : "0"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                    <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-500">Total Revenue</h3>
                    <p className="text-2xl font-semibold text-gray-900">
                      {analytics?.stats.totalRevenue ? formatCurrency(analytics.stats.totalRevenue) : "$0"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                    <StarIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-500">Average Rating</h3>
                    <p className="text-2xl font-semibold text-gray-900">
                      {analytics?.stats.averageRating ? analytics.stats.averageRating.toFixed(1) : "0.0"}/5
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                    <BookOpenIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-5">
                    <h3 className="text-lg font-medium text-gray-500">Total Courses</h3>
                    <p className="text-2xl font-semibold text-gray-900">
                      {analytics?.stats.courseCount || filteredCourses.length || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Analytics Graph */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Students & Revenue Analytics</h3>
                <div className="flex space-x-4 text-sm">
                  <span className="flex items-center text-gray-600">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    Students: {analytics?.stats.totalStudents || 0}
                  </span>
                  <span className="flex items-center text-gray-600">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    Revenue: {analytics?.stats.totalRevenue ? formatCurrency(analytics.stats.totalRevenue) : "$0"}
                  </span>
                </div>
              </div>
              {analytics?.stats ? (
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: "Your Analytics",
                          students: analytics.stats.totalStudents || 0,
                          revenue: analytics.stats.totalRevenue || 0,
                        },
                      ]}
                      margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis
                        dataKey="name"
                        stroke="#6B7280"
                        tick={{ fontSize: 14 }}
                        axisLine={{ stroke: "#D1D5DB" }}
                      />
                      <YAxis
                        yAxisId="students"
                        orientation="left"
                        stroke="#3B82F6"
                        label={{
                          value: "Total Students",
                          angle: -90,
                          position: "insideLeft",
                          style: { textAnchor: "middle", fill: "#3B82F6" },
                        }}
                        axisLine={{ stroke: "#3B82F6" }}
                        tickLine={{ stroke: "#3B82F6" }}
                      />
                      <YAxis
                        yAxisId="revenue"
                        orientation="right"
                        stroke="#10B981"
                        label={{
                          value: "Total Revenue ($)",
                          angle: 90,
                          position: "insideRight",
                          style: { textAnchor: "middle", fill: "#10B981" },
                        }}
                        axisLine={{ stroke: "#10B981" }}
                        tickLine={{ stroke: "#10B981" }}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip
                        formatter={(value, name) => [
                          name === "students" ? `${value} Students` : formatCurrency(value),
                          name === "students" ? "Total Students" : "Total Revenue",
                        ]}
                        labelFormatter={() => "Your Performance"}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="rect" />
                      <Bar
                        yAxisId="students"
                        dataKey="students"
                        fill="#3B82F6"
                        name="Total Students"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={80}
                      />
                      <Bar
                        yAxisId="revenue"
                        dataKey="revenue"
                        fill="#10B981"
                        name="Total Revenue"
                        radius={[4, 4, 0, 0]}
                        maxBarSize={80}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Analytics...</h3>
                    <p className="text-gray-500">Please wait while we fetch your data.</p>
                  </div>
                </div>
              )}

              {/* Summary Cards */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-center mb-3">
                    <UserGroupIcon className="h-8 w-8 text-blue-600 mr-3" />
                    <h4 className="text-xl font-semibold text-blue-700">Total Students</h4>
                  </div>
                  <p className="text-4xl font-bold text-blue-800 mb-2">
                    {analytics?.stats.totalStudents || 0}
                  </p>
                  <p className="text-sm text-blue-600">Students enrolled in your courses</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                  <div className="flex items-center justify-center mb-3">
                    <CurrencyDollarIcon className="h-8 w-8 text-green-600 mr-3" />
                    <h4 className="text-xl font-semibold text-green-700">Total Revenue</h4>
                  </div>
                  <p className="text-4xl font-bold text-green-800 mb-2">
                    {analytics?.stats.totalRevenue ? formatCurrency(analytics.stats.totalRevenue) : "$0"}
                  </p>
                  <p className="text-sm text-green-600">Total earnings from all courses</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create/Edit Course Modal */}
        {showCreateForm && (
          <CreateCourseForm onClose={handleCloseForm} courseToEdit={courseToEdit} />
        )}

        {/* Edit Profile Modal */}
        {editProfile && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Edit Profile</h2>
                  <button
                    onClick={() => setEditProfile(false)}
                    className="text-gray-400 hover:text-gray-500 rounded-full p-1 hover:bg-gray-100"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="flex flex-col items-center mb-4">
                  <div className="relative">
                    <img
                      className="h-24 w-24 rounded-full border-4 border-white shadow-md object-cover"
                      src={
                        profilePreview
                          ? profilePreview.startsWith("data:")
                            ? profilePreview
                            : `${import.meta.env.VITE_API_URL.replace("/api", "")}/${profilePreview}`
                          : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      }
                      alt="Profile preview"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";
                      }}
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
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={editUser?.name || ""}
                      onChange={handleProfileChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editUser?.email || ""}
                      onChange={handleProfileChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      name="bio"
                      rows={4}
                      value={editUser?.bio || ""}
                      onChange={handleProfileChange}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                      placeholder="Tell students about your background and expertise..."
                    />
                  </div>
                </div>
                <div className="pt-4 flex justify-end space-x-3">
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
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;