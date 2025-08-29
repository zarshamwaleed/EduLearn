import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, CheckCircle, ArrowLeft, Clock, FileText } from 'lucide-react';
import axios from 'axios';
import api from "../api";

const EditQuiz = () => {
  const { courseId, quizId } = useParams();
  const { getToken, user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState({ hours: '', minutes: '', seconds: '' });
  const [questions, setQuestions] = useState([{ qContent: '', options: [{ text: '', correct: false }] }]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);

  // Fetch quiz data
  useEffect(() => {
    const fetchQuiz = async () => {
      setIsFetching(true);
      try {
        const token = getToken();
        if (!token) {
          throw new Error('No authentication token found');
        }
        if (!user || user.role !== 'instructor') {
          throw new Error('Unauthorized: Only instructors can edit quizzes');
        }

     const response = await api.get(`/quizzes/single/${quizId}`);
        const quiz = response.data;
        const [hours, minutes, seconds] = quiz.duration.split(':').map(Number);
        setTitle(quiz.title);
        setDuration({ hours: String(hours || ''), minutes: String(minutes || ''), seconds: String(seconds || '') });
        setQuestions(quiz.questions || [{ qContent: '', options: [{ text: '', correct: false }] }]);
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError(err.response?.data?.message || 'Failed to fetch quiz');
      } finally {
        setIsFetching(false);
      }
    };

    if (user) {
      fetchQuiz();
    } else {
      setError('User not authenticated');
      navigate('/login');
    }
  }, [quizId, user, getToken, navigate]);

  // Handle question & option changes
  const handleInputChange = (e, index, field) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (e, qIndex, oIndex, field) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex][field] =
      field === 'correct' ? e.target.checked : e.target.value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { qContent: '', options: [{ text: '', correct: false }] }]);
  };

  const addOption = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options.push({ text: '', correct: false });
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, qIndex) => qIndex !== index));
    }
  };

  const removeOption = (qIndex, oIndex) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[qIndex].options.length > 1) {
      updatedQuestions[qIndex].options = updatedQuestions[qIndex].options.filter((_, i) => i !== oIndex);
      setQuestions(updatedQuestions);
    }
  };

  // Validate form
  const validateForm = () => {
    if (!title.trim()) {
      setMessage({ text: 'Quiz title is required', type: 'error' });
      return false;
    }

    if (!duration.hours && !duration.minutes && !duration.seconds) {
      setMessage({ text: 'Duration is required', type: 'error' });
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.qContent.trim()) {
        setMessage({ text: `Question ${i + 1} cannot be empty`, type: 'error' });
        return false;
      }
      if (question.options.length === 0) {
        setMessage({ text: `Question ${i + 1} must have at least one option`, type: 'error' });
        return false;
      }
      const hasCorrectOption = question.options.some((option) => option.correct);
      if (!hasCorrectOption) {
        setMessage({ text: `Question ${i + 1} must have at least one correct option`, type: 'error' });
        return false;
      }
      for (let j = 0; j < question.options.length; j++) {
        if (!question.options[j].text.trim()) {
          setMessage({ text: `Option ${j + 1} in Question ${i + 1} cannot be empty`, type: 'error' });
          return false;
        }
      }
    }
    return true;
  };

  // Submit updated quiz
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (!validateForm()) return;
    setLoading(true);

    const quizData = {
      title: title.trim(),
      duration: `${duration.hours || '00'}:${duration.minutes || '00'}:${duration.seconds || '00'}`,
      questions,
    };

    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

const res = await api.put(`/quizzes/${quizId}`, quizData, {
  headers: {
    'Content-Type': 'application/json', // still needed for JSON body
  },
});

      setMessage({ text: 'Quiz updated successfully!', type: 'success' });
      setTimeout(() => navigate(`/course/${courseId}/quiz`), 1000);
    } catch (err) {
      console.error('Error updating quiz:', err);
      setMessage({ text: err.response?.data?.message || 'Error updating quiz. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-300">Loading quiz data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-lg p-6 border border-red-500/30">
          <div className="flex items-center mb-4">
            <div className="bg-red-500/20 p-2 rounded-lg">
              <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 0v4m0-4h4m-4 0H8m12-4a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="ml-3 text-lg font-medium text-red-300">Error</h3>
          </div>
          <p className="text-gray-300">{error}</p>
          <Link
            to={`/course/${courseId}`}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to={`/course/${courseId}`}
            className="inline-flex items-center text-gray-300 hover:text-white transition duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Course
          </Link>
          <div className="flex items-center text-gray-400">
            <FileText className="w-5 h-5 mr-2" />
            <span>Editing Quiz</span>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <h1 className="text-2xl font-bold text-white">Edit Quiz</h1>
            <p className="text-indigo-200 mt-1">Update your quiz questions and settings</p>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {message.text && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  message.type === 'error'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : 'bg-green-500/20 text-green-300 border border-green-500/30'
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Quiz Title*</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter quiz title"
                    className="w-full bg-gray-750 border border-gray-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Duration*
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      value={duration.hours}
                      onChange={(e) => setDuration({ ...duration, hours: e.target.value })}
                      min="0"
                      placeholder="HH"
                      className="w-full bg-gray-750 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      value={duration.minutes}
                      onChange={(e) => setDuration({ ...duration, minutes: e.target.value })}
                      min="0"
                      max="59"
                      placeholder="MM"
                      className="w-full bg-gray-750 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      value={duration.seconds}
                      onChange={(e) => setDuration({ ...duration, seconds: e.target.value })}
                      min="0"
                      max="59"
                      placeholder="SS"
                      className="w-full bg-gray-750 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Questions Section */}
              <div className="border-t border-gray-700 pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-white">Questions</h2>
                  <button
                    type="button"
                    onClick={addQuestion}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Question
                  </button>
                </div>

                <div className="space-y-4">
                  {questions.map((question, qIndex) => (
                    <div key={qIndex} className="bg-gray-750 rounded-lg p-4 border border-gray-600">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-white">Question {qIndex + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeQuestion(qIndex)}
                          disabled={questions.length <= 1}
                          className="text-red-400 hover:text-red-300 disabled:opacity-50 transition duration-200"
                          title="Remove question"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={question.qContent}
                        onChange={(e) => handleInputChange(e, qIndex, 'qContent')}
                        placeholder="Enter your question"
                        className="w-full mb-4 bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-medium text-gray-300">Options</h4>
                          <button
                            type="button"
                            onClick={() => addOption(qIndex)}
                            className="inline-flex items-center text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Option
                          </button>
                        </div>

                        {question.options.map((option, oIndex) => (
                          <div key={oIndex} className="flex items-center gap-3">
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) => handleOptionChange(e, qIndex, oIndex, 'text')}
                              placeholder={`Option ${oIndex + 1}`}
                              className="flex-grow bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <label className="flex items-center text-sm text-gray-300">
                              <input
                                type="checkbox"
                                checked={option.correct}
                                onChange={(e) => handleOptionChange(e, qIndex, oIndex, 'correct')}
                                className="rounded text-indigo-600 focus:ring-indigo-500"
                              />
                              <span className="ml-2">Correct</span>
                            </label>
                            <button
                              type="button"
                              onClick={() => removeOption(qIndex, oIndex)}
                              disabled={question.options.length <= 1}
                              className="text-red-400 hover:text-red-300 disabled:opacity-50 transition duration-200"
                              title="Remove option"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200 ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Update Quiz
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

export default EditQuiz;