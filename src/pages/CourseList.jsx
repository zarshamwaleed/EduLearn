import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import CreateCourseForm from "../components/CreateCourseForm";

function CourseList() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [unenrolledCourses, setUnenrolledCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);

  useEffect(() => {
    const fetchCoursesAndProgress = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/courses");
        const allCourses = response.data;

        if (!isAuthenticated || !user) {
          setUnenrolledCourses(allCourses);
          setEnrolledCourses([]);
          setCourses([]);
          setIsLoading(false);
          return;
        }

        if (user.role === "instructor") {
          // Filter courses to show only those created by the logged-in instructor
          const instructorCourses = allCourses.filter(
            (course) => String(course.instructorId) === String(user._id)
          );
          setCourses(instructorCourses);
          setEnrolledCourses([]);
          setUnenrolledCourses([]);
        } else if (user.role === "student") {
          const userResponse = await api.get("/auth/profile");
          const enrolledCourseIds = userResponse.data.enrolledCourses || [];

          const progressPromises = enrolledCourseIds.map(async (courseId) => {
            try {
              const progressResponse = await api.get(`/course-progress/${user._id}/${courseId}`);
              return { courseId, progress: progressResponse.data.progress || 0 };
            } catch (err) {
              console.error(`Error fetching progress for course ${courseId}:`, err);
              return { courseId, progress: 0 };
            }
          });

          const progressData = await Promise.all(progressPromises);
          const progressMap = progressData.reduce((acc, { courseId, progress }) => {
            acc[courseId] = progress;
            return acc;
          }, {});

          const enrolled = allCourses
            .filter((course) => enrolledCourseIds.includes(course._id))
            .map((course) => ({
              ...course,
              progress: progressMap[course._id] || 0,
              status: progressMap[course._id] >= 100 ? "completed" : "in_progress",
            }));
          const unenrolled = allCourses.filter(
            (course) => !enrolledCourseIds.includes(course._id)
          );

          setEnrolledCourses(enrolled);
          setUnenrolledCourses(unenrolled);
          setCourses([]);
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoursesAndProgress();
  }, [user, isAuthenticated]);

  const handleEnroll = async (courseId) => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    try {
      await api.post(`/courses/enroll/${courseId}`);
      const courseToEnroll = unenrolledCourses.find(
        (course) => course._id === courseId
      );
      if (courseToEnroll) {
        const newEnrolledCourse = {
          ...courseToEnroll,
          progress: 0,
          status: "in_progress",
        };

        setEnrolledCourses((prev) => [...prev, newEnrolledCourse]);
        setUnenrolledCourses((prev) =>
          prev.filter((course) => course._id !== courseId)
        );
      }

      alert("Successfully enrolled in course!");
    } catch (err) {
      console.error("Error enrolling in course:", err.response?.data || err);
      setError(
        err.response?.data?.message || "Failed to enroll in course. Please try again."
      );
    }
  };

  const handleNewCourse = () => {
    setCourseToEdit(null);
    setShowCreateForm(true);
  };

  const handleCloseForm = () => {
    setShowCreateForm(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-700">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6 border border-red-300">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 p-2 rounded-lg">
              <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-medium text-red-600">Error</h3>
          </div>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="px-6 py-8 w-[1410px] ml-16 -mt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {isAuthenticated && user ? "My Learning Dashboard" : "Log in to continue your learning journey"}
            </h1>
            <p className="text-gray-600 mt-2">
              {isAuthenticated && user
                ? user.role === "instructor"
                  ? "Manage and create your courses"
                  : "Continue your learning journey"
                : "Sign in to access your courses and start learning today"}
            </p>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="mt-4 inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md transition duration-200"
              >
                Login
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
          {user?.role === "instructor" && (
            <button
              onClick={handleNewCourse}
              className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-3 rounded-lg shadow-md transition duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Course
            </button>
          )}
        </div>

        {user?.role === "student" && (
          <>
            {/* Enrolled Courses Section */}
            <section className="mb-12">
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2 sm:mb-0">
                      My Courses
                    </h2>
                    <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
                      {enrolledCourses.length} enrolled
                    </span>
                  </div>

                  {enrolledCourses.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">
                        No courses yet
                      </h3>
                      <p className="mt-1 text-gray-600">
                        Get started by enrolling in a course below.
                      </p>
                      <div className="mt-6">
                        <button
                          onClick={() =>
                            document.getElementById("available-courses").scrollIntoView({ behavior: "smooth" })
                          }
                          className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-200"
                        >
                          Browse Courses
                          <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {enrolledCourses.map((course) => (
                        <div
                          key={course._id}
                          className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 hover:border-indigo-300"
                        >
                          <div className="h-48 bg-gray-100 relative overflow-hidden">
                            <img
                              src={course.image_url || "https://via.placeholder.com/400x225"}
                              alt={course.title}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/400x225";
                              }}
                            />
                            <div className="absolute top-3 right-3">
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  course.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {course.status === "completed" ? "Completed" : "In Progress"}
                              </span>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                              <h3 className="font-bold text-white text-lg">
                                {course.title}
                              </h3>
                              <p className="text-gray-200 text-sm mt-1">
                                {course.instructor_name}
                              </p>
                            </div>
                          </div>
                          <div className="p-5">
                            <div className="mb-4">
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-medium text-gray-900">{Math.round(course.progress)}%</span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full">
                                <div
                                  className={`h-full rounded-full ${
                                    course.status === "completed" ? "bg-green-500" : "bg-indigo-600"
                                  }`}
                                  style={{ width: `${course.progress}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-600">
                                {course.duration_weeks
                                  ? `${course.duration_weeks} weeks`
                                  : "Self-paced"}
                              </span>
                              <button
                                onClick={() => navigate(`/courses/${course._id}`)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm py-2 px-4 rounded-lg transition duration-200 flex items-center"
                              >
                                {course.progress > 0 ? "Continue" : "Start"}
                                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Available Courses Section */}
            <section id="available-courses">
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2 sm:mb-0">
                      Available Courses
                    </h2>
                    <span className="bg-gray-100 text-gray-600 text-sm font-medium px-3 py-1 rounded-full">
                      {unenrolledCourses.length} available
                    </span>
                  </div>

                  {unenrolledCourses.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <div className="bg-gray-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">
                        No available courses
                      </h3>
                      <p className="mt-1 text-gray-600">
                        Check back later for new courses.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {unenrolledCourses.map((course) => (
                        <div
                          key={course._id}
                          className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 hover:border-indigo-300"
                        >
                          <div className="h-48 bg-gray-100 relative overflow-hidden">
                            <img
                              src={course.image_url || "https://via.placeholder.com/400x225"}
                              alt={course.title}
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/400x225";
                              }}
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                              <h3 className="font-bold text-white text-lg">
                                {course.title}
                              </h3>
                              <p className="text-gray-200 text-sm mt-1">
                                {course.instructor_name || "Not specified"}
                              </p>
                            </div>
                          </div>
                          <div className="p-5">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-sm text-gray-600">4.8 (120)</span>
                              </div>
                              {course.price && (
                                <span className="text-sm font-medium text-gray-900 bg-indigo-100 py-1 px-2 rounded">
                                  ${course.price}
                                </span>
                              )}
                            </div>

                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                              {course.description || "No description available"}
                            </p>

                            <button
                              onClick={() => handleEnroll(course._id)}
                              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              Enroll Now
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </>
        )}

        {user?.role === "instructor" && (
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">My Courses</h2>
              <span className="bg-gray-100 text-gray-600 text-sm font-medium px-3 py-1 rounded-full mt-2 sm:mt-0">
                {courses.length} courses
              </span>
            </div>

            {courses.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-md border border-gray-200">
                <div className="bg-gray-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  No courses created yet
                </h3>
                <p className="mt-1 text-gray-600">
                  Get started by creating your first course.
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleNewCourse}
                    className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-200"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Course
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-indigo-300"
                  >
                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                      <img
                        src={course.image_url || "https://via.placeholder.com/400x225"}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x225";
                        }}
                      />
                      <div className="absolute top-3 right-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            course.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {course.status || "draft"}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {course.description || "No description provided"}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span>{course.duration_weeks || "0"} weeks</span>
                        {course.price && (
                          <span className="font-medium text-gray-900">${course.price}</span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Link
                          to={`/courses/${course._id}`}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 px-4 rounded-lg transition duration-200"
                        >
                          View
                        </Link>
                        <Link
                          to={`/courses/${course._id}/edit`}
                          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-center py-2 px-4 rounded-lg transition duration-200"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Create/Edit Course Modal */}
        {showCreateForm && (
          <CreateCourseForm
            onClose={handleCloseForm}
            courseToEdit={courseToEdit}
          />
        )}
      </div>
    </div>
  );
}

export default CourseList;