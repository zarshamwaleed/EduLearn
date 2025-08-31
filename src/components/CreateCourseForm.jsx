import { useState, useEffect } from 'react';
import { XMarkIcon, CloudArrowUpIcon, PhotoIcon } from '@heroicons/react/24/outline';

export default function CreateCourseForm({ onClose, courseToEdit }) {
  const [courseData, setCourseData] = useState({
    title: '',
    price: '',
    duration_weeks: '',
    description: '',
    imageFile: null,
    imagePreview: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const navigate = (path) => {
    console.log(`Navigating to: ${path}`);
    window.history.pushState({}, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  useEffect(() => {
    if (courseToEdit) {
      setCourseData((prev) => ({
        ...prev,
        title: courseToEdit.title,
        price: courseToEdit.price || '',
        duration_weeks: courseToEdit.duration_weeks || '',
        description: courseToEdit.description || '',
        imagePreview: courseToEdit.image_url || '',
      }));
    }
  }, [courseToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCourseData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      if (!courseData.title.trim()) {
        throw new Error("Course title is required");
      }

      const token = localStorage.getItem("authToken");
      console.log("Sending token:", token);
      if (!token) {
        throw new Error("You must be logged in to create a course.");
      }

      const formData = new FormData();
      formData.append("title", courseData.title);
      formData.append("description", courseData.description);
      formData.append("price", parseFloat(courseData.price) || 0);
      formData.append("duration_weeks", parseInt(courseData.duration_weeks) || 1);
      formData.append("status", "draft");
      if (courseData.imageFile) {
        formData.append("image", courseData.imageFile);
      }

     const API_URL = import.meta.env.VITE_API_URL;

const res = await fetch(`${API_URL}/api/create-course`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create course");
      }

      console.log("Course saved:", data.course);

      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        setCourseData({
          title: "",
          price: "",
          duration_weeks: "",
          description: "",
          imageFile: null,
          imagePreview: "",
        });

        if (onClose) onClose();
        else navigate("/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Error:", err);
      alert(err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-800">
            {courseToEdit ? 'Edit Course' : 'Create New Course'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mx-6 mt-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Course {courseToEdit ? 'updated' : 'created'} successfully!</span>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Course Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={courseData.title}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="e.g., Advanced JavaScript Programming"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (USD)</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="price"
                  value={courseData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="block w-full pl-7 pr-12 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="0.00"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">USD</span>
                </div>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (weeks)</label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  name="duration_weeks"
                  value={courseData.duration_weeks}
                  onChange={handleChange}
                  min="1"
                  className="block w-full py-3 pl-4 pr-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="Enter duration in weeks"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">weeks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={courseData.description}
              onChange={handleChange}
              rows="4"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Describe what students will learn in this course..."
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Image</label>
            
            {courseData.imagePreview ? (
              <div className="mt-1 flex flex-col items-start">
            <img
  src={courseData?.imagePreview || "https://via.placeholder.com/400x200"}
  alt="Preview"
  className="h-40 w-full object-cover rounded-lg border border-gray-200 mb-4"
  onError={(e) => {
    e.currentTarget.src = "https://via.placeholder.com/400x200";
  }}
/>

                <label className="cursor-pointer bg-white text-indigo-600 hover:text-indigo-500 font-medium py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 inline-flex items-center">
                  <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                  Change Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </label>
              </div>
            ) : (
              <label className="flex justify-center items-center px-6 py-10 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                <div className="text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4 flex text-sm text-gray-600">
                    <span className="relative rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      Upload an image
                    </span>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                </div>
              </label>
            )}
          </div>
        </div>

        {/* Footer with Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || !courseData.title.trim()}
            className="inline-flex items-center px-5 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isSubmitting
              ? courseToEdit ? 'Updating...' : 'Creating...'
              : courseToEdit ? 'Update Course' : 'Create Course'}
          </button>
        </div>
      </div>
    </div>
  );
}