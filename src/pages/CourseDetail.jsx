import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from "../api";
import {
  ArrowLeftIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  PhotoIcon,
  AcademicCapIcon,
  StarIcon,
  ChatBubbleLeftIcon,
  ClockIcon,
  CalendarDaysIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid, CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/react/24/solid';
import axios from 'axios';

function ConfirmationModal({ isOpen, onConfirm, onCancel, message }) {
  if (!isOpen) return null;

  return (
    <div  className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Confirm Action</h3>
          <p className="text-slate-600">{message}</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function SuccessModal({ isOpen, onClose, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIconSolid className="h-8 w-8 text-emerald-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Success!</h3>
          <p className="text-slate-600 mb-6">{message}</p>
          <button
            onClick={onClose}
            className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function RatingStars({ rating, setRating, disabled = false }) {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !disabled && setRating(star)}
          className={`${!disabled ? 'hover:scale-110 cursor-pointer' : 'cursor-default'} transition-transform duration-200`}
          disabled={disabled}
        >
          {(rating || 0) >= star ? (
            <StarIconSolid className="h-6 w-6 text-amber-400" />
          ) : (
            <StarIcon className="h-6 w-6 text-slate-300 hover:text-amber-400" />
          )}
        </button>
      ))}
    </div>
  );
}

function RatingModal({ isOpen, onClose, onSubmit, currentRating }) {
  const [rating, setRating] = useState(currentRating || 0);

  const handleSubmit = () => {
    onSubmit(rating);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h3 className="text-xl font-semibold text-slate-800 mb-6 text-center">Rate This Course</h3>
        <div className="flex justify-center mb-8">
          <RatingStars rating={rating} setRating={setRating} />
        </div>
        <div className="text-center mb-6">
          <p className="text-slate-600">
            {rating === 0 && "Select a rating"}
            {rating === 1 && "Poor - Needs significant improvement"}
            {rating === 2 && "Fair - Below expectations"}
            {rating === 3 && "Good - Meets expectations"}
            {rating === 4 && "Very Good - Exceeds expectations"}
            {rating === 5 && "Excellent - Outstanding course!"}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={rating === 0}
            className={`flex-1 px-6 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors ${rating === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Submit Rating
          </button>
        </div>
      </div>
    </div>
  );
}

function FeedbackModal({ isOpen, onClose, feedbacks }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-4xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-800">Student Feedback</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-96">
          {feedbacks.length === 0 ? (
            <div className="text-center py-12">
              <ChatBubbleLeftIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No feedback available yet</p>
              <p className="text-slate-400">Students haven't provided feedback for this course.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((feedback, index) => (
                <div key={index} className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <RatingStars rating={feedback.userRating} disabled={true} />
                      <span className="text-slate-600 font-medium">
                        {feedback.userRating}/5 stars
                      </span>
                    </div>
                    <span className="text-sm text-slate-500">
                      {new Date(feedback.updatedAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  {feedback.feedback && (
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <p className="text-slate-700 leading-relaxed">{feedback.feedback}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CourseProgressSection({ progressData, setProgressData, userId, courseId, setSuccessMessage, setShowSuccessModal }) {
  const [showFeedbackSection, setShowFeedbackSection] = useState(false);
  const [feedback, setFeedback] = useState(progressData.feedback || "");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const { getToken } = useAuth();

 const submitFeedback = async () => {
  try {
    const { data } = await api.post("/course-progress", {
      userId,
      courseId,
      progress: progressData.progress,
      userRating: progressData.userRating,
      feedback,
      completedContents: progressData.completedContents,
    });

    setProgressData(data);
    setFeedback(data.feedback || "");
    setShowFeedbackSection(false);
    setSuccessMessage('Feedback submitted successfully!');
    setShowSuccessModal(true);
  } catch (err) {
    console.error('Error submitting feedback:', err);
  }
};

const submitRating = async (rating) => {
  try {
    const { data } = await api.post("/course-progress", {
      userId,
      courseId,
      progress: progressData.progress,
      userRating: rating,
      feedback: progressData.feedback,
      completedContents: progressData.completedContents,
    });

    setProgressData(data);
    setSuccessMessage('Rating submitted successfully!');
    setShowSuccessModal(true);
  } catch (err) {
    console.error('Error submitting rating:', err);
  }
};

  const { progress, userRating } = progressData;

  return (
    <div className="bg-slate-50 rounded-2xl p-6 mt-8 ">
      <h3 className="text-lg font-semibold text-slate-800 mb-6">Your Progress</h3>
      
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-600">Course Completion</span>
          <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Rating Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-slate-700">Course Rating</h4>
          <button
            onClick={() => setShowRatingModal(true)}
            className="text-sm font-medium text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-lg transition-colors"
          >
            {userRating > 0 ? "Update Rating" : "Rate Course"}
          </button>
        </div>
        <div className="flex items-center space-x-3">
          <RatingStars rating={userRating} disabled={true} />
          <span className="text-slate-600">
            {userRating ? `${userRating.toFixed(1)}/5 stars` : "Not rated yet"}
          </span>
        </div>
      </div>

      {/* Feedback Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-slate-700">Your Feedback</h4>
          <button
            onClick={() => setShowFeedbackSection(!showFeedbackSection)}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg transition-colors"
          >
            {showFeedbackSection ? "Hide" : feedback ? "Edit Feedback" : "Add Feedback"}
          </button>
        </div>

        {!showFeedbackSection && feedback && (
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <p className="text-slate-700 leading-relaxed">{feedback}</p>
          </div>
        )}

        {showFeedbackSection && (
          <div className="space-y-4">
            <textarea
              className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              placeholder="Share your thoughts about this course..."
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowFeedbackSection(false)}
                className="px-6 py-2 border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitFeedback}
                disabled={!feedback.trim()}
                className={`px-6 py-2 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors ${
                  !feedback.trim() ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {progressData.feedback ? "Update Feedback" : "Submit Feedback"}
              </button>
            </div>
          </div>
        )}
      </div>

      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={submitRating}
        currentRating={userRating}
      />
    </div>
  );
}

function CourseDetail() {
  const { user, getToken } = useAuth();
  const role = user?.role || 'student';
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [content, setContent] = useState([]);
  const [progressData, setProgressData] = useState({
    progress: 0,
    userRating: 0,
    feedback: "",
    completedContents: []
  });
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
   const fetchCourseAndContent = async () => {
  setIsLoading(true);
  try {
    // Fetch course details
    const courseResponse = await api.get(`/create-course/${id}`);
    setCourse(courseResponse.data);

    // Fetch course content
    const contentResponse = await api.get(`/upload/${id}`);
    setContent(contentResponse.data);

    if (role === 'student') {
      // Fetch progress for students
      const progressResponse = await api.get(`/course-progress/${user._id}/${id}`);
      setProgressData(progressResponse.data);
    }

    if (role === 'instructor') {
      // Fetch course feedback for instructors
      const feedbackResponse = await api.get(`/course-progress/course/${id}`);
      setFeedbacks(feedbackResponse.data);
    }
  } catch (err) {
    console.error('Error fetching course or content:', err);
    setError(err.response?.data?.error || err.message);
  } finally {
    setIsLoading(false);
  }
};

    if (user) {
      fetchCourseAndContent();
    } else {
      setError('User not authenticated');
      navigate('/login');
    }
  }, [id, user, getToken, navigate, role]);

const handleDeleteContent = async () => {
  try {
    await api.delete(`/upload/${id}/${selectedContentId}`);

    setContent(content.filter(item => item.content_id !== selectedContentId));
    setSuccessMessage('Content deleted successfully!');
    setShowSuccessModal(true);
    setShowDeleteModal(false);
    setSelectedContentId(null);
  } catch (err) {
    console.error('Error deleting content:', err);
    setError(err.response?.data?.error || 'Failed to delete content');
  }
};

  const handleToggleComplete = async (contentId) => {
    const completedContents = progressData.completedContents || [];
    const isCompleted = completedContents.includes(contentId);

    const newCompleted = isCompleted
      ? completedContents.filter((cid) => cid !== contentId)
      : [...completedContents, contentId];

    const totalContent = content.length;
    const newProgress = totalContent > 0 ? (newCompleted.length / totalContent) * 100 : 0;

try {
  const { data } = await api.post("/course-progress", {
    userId: user._id,
    courseId: id,
    progress: newProgress,
    userRating: progressData.userRating,
    feedback: progressData.feedback,
    completedContents: newCompleted,
  });

  setProgressData(data);
  setSuccessMessage('Progress updated successfully!');
  setShowSuccessModal(true);
} catch (err) {
  console.error('Error updating progress:', err);
}
  };

  const getContentTypeIcon = (type) => {
    const iconClasses = "h-6 w-6";
    switch (type) {
      case 'video': return <VideoCameraIcon className={`${iconClasses} text-red-500`} />;
      case 'file': return <DocumentTextIcon className={`${iconClasses} text-blue-500`} />;
      case 'audio': return <MusicalNoteIcon className={`${iconClasses} text-green-500`} />;
      case 'pdf': return <DocumentTextIcon className={`${iconClasses} text-purple-500`} />;
      case 'image': return <PhotoIcon className={`${iconClasses} text-pink-500`} />;
      default: return <DocumentTextIcon className={`${iconClasses} text-slate-500`} />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Something went wrong</h3>
          <p className="text-red-500 mb-6">{error}</p>
          <Link
            to="/courses"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AcademicCapIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Course Not Found</h3>
          <p className="text-slate-600 mb-6">The course you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/courses"
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="px-6 py-8 w-[1410px] ml-16 -mt-6">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/courses"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Courses
          </Link>
        </div>

        {/* Course Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1 mb-6 lg:mb-0">
                <h1 className="text-4xl font-bold text-slate-800 mb-4 leading-tight">
                  {course.title}
                </h1>
                
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                    <AcademicCapIcon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-slate-600 font-medium">Instructor</p>
                    <p className="text-lg font-semibold text-slate-800">{course.instructor_name}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-6">
                  {course.duration_weeks && (
                    <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl text-sm font-medium flex items-center">
                      <ClockIcon className="w-4 h-4 mr-2" />
                      {course.duration_weeks} weeks
                    </div>
                  )}
                  {role === 'instructor' && (
                    <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-xl text-sm font-medium flex items-center">
                      <CurrencyDollarIcon className="w-4 h-4 mr-2" />
                      ${course.price}
                    </div>
                  )}
                  {role === 'instructor' && (
                    <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-xl text-sm font-medium flex items-center">
                      <CalendarDaysIcon className="w-4 h-4 mr-2" />
                      Created {new Date(course.created_at).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                <p className="text-slate-700 text-lg leading-relaxed">{course.description}</p>
              </div>

              {role === 'instructor' && (
                <div className="lg:ml-8">
                  <button
                    onClick={() => navigate(`/courses/${id}/edit`)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
                  >
                    <PencilIcon className="h-5 w-5" />
                    <span>Edit Course</span>
                  </button>
                </div>
              )}
            </div>

            {role === 'student' && (
              <CourseProgressSection
                progressData={progressData}
                setProgressData={setProgressData}
                userId={user._id}
                courseId={id}
                setSuccessMessage={setSuccessMessage}
                setShowSuccessModal={setShowSuccessModal}
              />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {role === 'instructor' && (
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={() => navigate(`/courses/${id}/content/create`)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Content</span>
            </button>
            <button
              onClick={() => navigate(`/course/${id}/quiz`)}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
            >
              <AcademicCapIcon className="h-5 w-5" />
              <span>Quiz Management</span>
            </button>
            <button
              onClick={() => navigate(`/courses/${id}/assignments`)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
            >
              <DocumentTextIcon className="h-5 w-5" />
              <span>Assignments</span>
            </button>
            <button
              onClick={() => setShowFeedbackModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
            >
              <ChatBubbleLeftIcon className="h-5 w-5" />
              <span>View Feedback</span>
            </button>
          </div>
        )}

        {role === 'student' && (
          <div className="flex flex-wrap gap-4 mb-8">
            <button   
              onClick={() => navigate(`/courses/${id}/quizzes`)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
            >
              <AcademicCapIcon className="h-5 w-5" />
              <span>Take Quizzes</span>
            </button>
            <button
              onClick={() => navigate(`/courses/${id}/assignment`)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center space-x-2"
            >
              <DocumentTextIcon className="h-5 w-5" />
              <span>View Assignments</span>
            </button>
          </div>
        )}

        {/* Course Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
              <DocumentTextIcon className="w-7 h-7 text-indigo-600 mr-3" />
              Course Content
            </h2>
          </div>

          {content.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <DocumentTextIcon className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No Content Yet</h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                {role === 'instructor' 
                  ? "Start building your course by adding your first piece of content."
                  : "The instructor hasn't added any content to this course yet."
                }
              </p>
              {role === 'instructor' && (
                <button
                  onClick={() => navigate(`/courses/${id}/content/create`)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center space-x-2"
                >
                  <PlusIcon className="h-5 w-5" />
                  <span>Add First Content</span>
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {content.map((item) => {
                const completedContents = progressData.completedContents || [];
                const isItemCompleted = completedContents.includes(item.content_id);
                
                return (
                  <div key={item.content_id} className="p-6 hover:bg-slate-50/50 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center min-w-0 flex-1">
                        <div className="flex-shrink-0 mr-4 p-3 bg-slate-100 rounded-xl">
                          {getContentTypeIcon(item.content_type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-semibold text-slate-800 truncate mb-1">
                            {item.file_name}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-slate-500">
                            <span className="flex items-center">
                              <CalendarDaysIcon className="w-4 h-4 mr-1" />
                              {new Date(item.uploaded_at).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                            <span className="capitalize bg-slate-200 px-2 py-1 rounded-full text-xs font-medium">
                              {item.content_type}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 ml-4">
                        <a
                          href={item.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
                        >
                          <PlayIcon className="w-4 h-4" />
                          <span>View</span>
                        </a>
                        
                        {role === 'instructor' && (
                          <button
                            onClick={() => {
                              setSelectedContentId(item.content_id);
                              setShowDeleteModal(true);
                            }}
                            className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-xl transition-colors duration-200"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}
                        
                        {role === 'student' && (
                          <button
                            onClick={() => handleToggleComplete(item.content_id)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                              isItemCompleted 
                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {isItemCompleted ? (
                              <CheckCircleIconSolid className="w-4 h-4" />
                            ) : (
                              <CheckIcon className="w-4 h-4" />
                            )}
                            <span>{isItemCompleted ? 'Completed' : 'Mark Complete'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modals */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onConfirm={handleDeleteContent}
          onCancel={() => setShowDeleteModal(false)}
          message="Are you sure you want to delete this content? This action cannot be undone."
        />
        
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          message={successMessage}
        />
        
        {role === 'instructor' && (
          <FeedbackModal
            isOpen={showFeedbackModal}
            onClose={() => setShowFeedbackModal(false)}
            feedbacks={feedbacks}
          />
        )}
      </div>
    </div>
  );
}

export default CourseDetail;