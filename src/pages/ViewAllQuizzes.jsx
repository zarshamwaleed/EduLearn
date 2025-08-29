import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { 
  ClockIcon, 
  DocumentTextIcon, 
  ArrowLeftIcon, 
  CheckCircleIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import api from "../api"; 
const ViewAllQuizzes = () => {
  const { courseId } = useParams();
  const { getToken, user } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseName, setCourseName] = useState('');

  useEffect(() => {
    const fetchQuizzesAndSubmissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        if (!token) {
          throw new Error('No authentication token found');
        }
        if (!user) {
          throw new Error('User not authenticated');
        }

        // Fetch course details to get the course name
  try {
  const courseResponse = await api.get(`/courses/${courseId}`);
  setCourseName(courseResponse.data.title || `Course ${courseId}`);
} catch (err) {
  console.error('Error fetching course details:', err);
  setCourseName(`Course ${courseId}`);
}

        // Fetch quizzes
        const quizResponse = await api.get(`/quizzes/${courseId}`);

        const quizData = quizResponse.data;
        setQuizzes(quizData);

        // Fetch submission status for each quiz
     const submissionPromises = quizData.map(async (quiz) => {
  try {
    const submissionResponse = await api.get(`/submissions/${quiz._id}`);
    return { quizId: quiz._id, hasSubmission: !!submissionResponse.data };
  } catch (err) {
    if (err.response?.status === 404) {
      return { quizId: quiz._id, hasSubmission: false };
    }
    throw err;
  }
});

        const submissionResults = await Promise.all(submissionPromises);
        const submissionMap = submissionResults.reduce((acc, { quizId, hasSubmission }) => {
          acc[quizId] = hasSubmission;
          return acc;
        }, {});
        setSubmissionStatus(submissionMap);
      } catch (err) {
        console.error('Error fetching quizzes or submissions:', err);
        setError(err.response?.data?.message || 'Failed to fetch quizzes');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchQuizzesAndSubmissions();
    } else {
      setError('User not authenticated');
      navigate('/login');
    }
  }, [courseId, user, getToken, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-600">Loading quizzes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 border border-red-500/30">
          <div className="flex items-center mb-4">
            <div className="bg-red-500/20 p-2 rounded-lg">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 0v4m0-4h4m-4 0H8m12-4a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-medium text-red-600">Error</h3>
          </div>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to={`/course/${courseId}`}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to={`/courses/${courseId}`}
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Course
          </Link>
          <div className="flex items-center text-gray-600">
            <DocumentTextIcon className="w-5 h-5 mr-2" />
            <span>Course Quizzes</span>
          </div>
        </div>

        {/* Page Title */}
        <div className="bg-white rounded-xl p-6 mb-8 border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Course Quizzes</h1>
          {/* <p className="text-gray-600">{courseName}</p> */}
        </div>

        {/* Quizzes List */}
        {quizzes.length > 0 ? (
          <div className="grid gap-6">
            {quizzes.map((quiz) => (
              <div key={quiz._id} className="bg-white rounded-xl p-6 border border-gray-200 hover:border-indigo-500/30 transition duration-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{quiz.title}</h3>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <DocumentTextIcon className="w-4 h-4 mr-1" />
                        <span>{quiz.questions?.length || 0} questions</span>
                      </div>
                      {quiz.duration && (
                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          <span>{quiz.duration}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      submissionStatus[quiz._id] 
                        ? 'bg-green-500/20 text-green-600' 
                        : 'bg-blue-500/20 text-blue-600'
                    }`}>
                      {submissionStatus[quiz._id] ? 'Completed' : 'Not Started'}
                    </div>
                    
                    <Link
                      to={`/course/${courseId}/quiz/${quiz._id}`}
                      className={`inline-flex items-center px-4 py-2 rounded-lg transition duration-200 ${
                        submissionStatus[quiz._id]
                          ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {submissionStatus[quiz._id] ? (
                        <>
                          <CheckCircleIcon className="w-4 h-4 mr-2" />
                          Review
                        </>
                      ) : (
                        <>
                          <PlayIcon className="w-4 h-4 mr-2" />
                          Start Quiz
                        </>
                      )}
                    </Link>
                  </div>
                </div>

                {/* Quiz Description */}
                {quiz.description && (
                  <p className="text-gray-600 mt-4 text-sm">{quiz.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
            <DocumentTextIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Quizzes Available</h3>
            <p className="text-gray-600 mb-4">This course doesn't have any quizzes yet.</p>
            {user?.role === 'instructor' && (
              <Link
                to={`/course/${courseId}/create-quiz`}
                className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create First Quiz
              </Link>
            )}
          </div>
        )}

        {/* Stats Footer */}
        <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{quizzes.length}</div>
              <div className="text-sm text-gray-600">Total Quizzes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {Object.values(submissionStatus).filter(status => status).length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {quizzes.length - Object.values(submissionStatus).filter(status => status).length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAllQuizzes;