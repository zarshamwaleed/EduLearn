import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";

const EditCourseForm = () => {
  const { courseId } = useParams();
  const [formData, setFormData] = useState({
    courseid: courseId,
    title: "",
    description: "",
    price: "",
    duration_weeks: "",
    created_at: "",
    updated_at: "",
    imageFile: null,
    imagePreview: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        console.log(`Fetching course with ID: ${courseId}`);
        const response = await api.get(`/create-course/${courseId}`);
        const course = response.data;
        setFormData({
          courseid: courseId,
          title: course.title || "",
          description: course.description || "",
          price: course.price || "",
          duration_weeks: course.duration_weeks || "",
          created_at: course.created_at || "",
          updated_at: course.updated_at || "",
          imagePreview: course.image_url || "",
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching course:", err.response?.data || err);
        setError(`Failed to fetch course data: ${err.response?.data?.error || err.message}`);
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    } else {
      setError("No course ID provided.");
      setLoading(false);
    }
  }, [courseId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("duration_weeks", formData.duration_weeks);
    if (formData.imageFile) {
      formDataToSend.append("image", formData.imageFile);
    }

    try {
      const token = localStorage.getItem("authToken");
      console.log("Submitting with token:", token);
      console.log("Form data:", Object.fromEntries(formDataToSend));

      if (!token) {
        alert("No token found. Please log in again.");
        setIsSubmitting(false);
        return;
      }

      await api.put(`/create-course/${courseId}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Course updated successfully!");
    } catch (err) {
      console.error("Error updating course:", err.response?.data || err);
      if (err.response?.status === 403) {
        alert("You are not authorized to update this course. Please ensure you are logged in as the course instructor.");
      } else {
        alert(`Failed to update course: ${err.response?.data?.error || err.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-700">Loading course data...</p>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 0v4m0-4h4m-4 0H8m12-4a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-medium text-red-600">Error</h3>
          </div>
          <p className="text-gray-700">{error}</p>
          <Link
            to="/courses"
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md border border-gray-200">
          {/* Header */}
          <div className="bg-indigo-600 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Edit Course</h1>
                <p className="text-white mt-1">Update your course information</p>
              </div>
              <Link
                to="/courses"
                className="text-white hover:text-gray-200 transition duration-200"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                { label: "Course Title", name: "title", type: "text", placeholder: "Enter course title" },
                { label: "Description", name: "description", type: "text", placeholder: "Enter course description" },
                { label: "Price ($)", name: "price", type: "number", placeholder: "Enter course price" },
                { label: "Duration (weeks)", name: "duration_weeks", type: "number", placeholder: "Enter course duration" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  <input
                    name={field.name}
                    type={field.type}
                    value={formData[field.name] ?? ""}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full bg-gray-100 border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>
              ))}

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Image
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer inline-flex items-center bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-900 px-4 py-2 rounded-lg transition duration-200"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Select Image
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {formData.imagePreview && (
                    <div className="relative">
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="h-20 w-20 rounded-lg object-cover border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, imagePreview: "", imageFile: null })}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-2">Recommended: 400x225 pixels</p>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/courses"
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-center py-3 px-4 rounded-lg transition duration-200"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Update Course
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCourseForm;