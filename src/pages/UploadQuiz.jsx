import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, CheckCircle, Clock, HelpCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const UploadQuiz = () => {
  const { courseId } = useParams();
  const { getToken, user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState({ hours: '', minutes: '', seconds: '' });
  const [questions, setQuestions] = useState([{ qContent: '', options: [{ text: '', correct: false }] }]);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

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

  // Submit to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (!user || user.role !== 'instructor') {
      setMessage({ text: 'Unauthorized: Only instructors can create quizzes', type: 'error' });
      navigate('/login');
      return;
    }

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

      const res = await axios.post(`http://localhost:5000/api/quizzes/${courseId}`, quizData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('✅ Quiz created:', res.data);
      setMessage({ text: 'Quiz created successfully!', type: 'success' });

      // Reset form and navigate back
      setTitle('');
      setDuration({ hours: '', minutes: '', seconds: '' });
      setQuestions([{ qContent: '', options: [{ text: '', correct: false }] }]);
      setTimeout(() => navigate(`/course/${courseId}/quiz`), 1500);
    } catch (err) {
      console.error('Error creating quiz:', err.response?.data || err);
      setMessage({ text: err.response?.data?.message || 'Error creating quiz. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = () => {
    const h = duration.hours ? `${duration.hours}h` : '';
    const m = duration.minutes ? `${duration.minutes}m` : '';
    const s = duration.seconds ? `${duration.seconds}s` : '';
    return [h, m, s].filter(Boolean).join(' ') || 'Not set';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Quiz</h1>
          <p className="text-gray-600 text-lg">Design an engaging quiz<span className="font-semibold text-indigo-600"></span></p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white shadow-2xl rounded-3xl border border-gray-100 backdrop-blur-sm overflow-hidden">
          
          {/* Success/Error Messages */}
          {message.text && (
            <div className={`p-6 border-b ${
              message.type === 'error'
                ? 'bg-red-50 border-red-100'
                : 'bg-green-50 border-green-100'
            }`}>
              <div className="flex items-center space-x-3">
                {message.type === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                <p className={`font-medium ${
                  message.type === 'error' ? 'text-red-800' : 'text-green-800'
                }`}>
                  {message.text}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Quiz Details Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold text-sm">1</span>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Quiz Information</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quiz Title */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Quiz Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter an engaging quiz title"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
                    required
                  />
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Duration *</label>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <input
                        type="number"
                        value={duration.hours}
                        onChange={(e) => setDuration({ ...duration, hours: e.target.value })}
                        min="0"
                        placeholder="Hours"
                        className="w-full px-3 py-3 border border-gray-300 rounded-xl text-center focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      />
                      <p className="text-xs text-gray-500 text-center mt-1">Hours</p>
                    </div>
                    <div>
                      <input
                        type="number"
                        value={duration.minutes}
                        onChange={(e) => setDuration({ ...duration, minutes: e.target.value })}
                        min="0"
                        max="59"
                        placeholder="Minutes"
                        className="w-full px-3 py-3 border border-gray-300 rounded-xl text-center focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      />
                      <p className="text-xs text-gray-500 text-center mt-1">Minutes</p>
                    </div>
                    <div>
                      <input
                        type="number"
                        value={duration.seconds}
                        onChange={(e) => setDuration({ ...duration, seconds: e.target.value })}
                        min="0"
                        max="59"
                        placeholder="Seconds"
                        className="w-full px-3 py-3 border border-gray-300 rounded-xl text-center focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      />
                      <p className="text-xs text-gray-500 text-center mt-1">Seconds</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Total time: {formatDuration()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions Section */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold text-sm">2</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Questions ({questions.length})</h2>
                </div>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </button>
              </div>

              <div className="space-y-6">
                {questions.map((question, qIndex) => (
                  <div key={qIndex} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                          <span className="text-gray-600 font-semibold text-sm">Q{qIndex + 1}</span>
                        </div>
                        <h3 className="font-semibold text-gray-800">Question {qIndex + 1}</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        disabled={questions.length <= 1}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <textarea
                        value={question.qContent}
                        onChange={(e) => handleInputChange(e, qIndex, 'qContent')}
                        placeholder="Enter your question here..."
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-200"
                      />

                      {/* Options */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-semibold text-gray-700">Answer Options</h4>
                          <button
                            type="button"
                            onClick={() => addOption(qIndex)}
                            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1 rounded-lg transition-colors"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Option
                          </button>
                        </div>

                        <div className="space-y-3">
                          {question.options.map((option, oIndex) => (
                            <div key={oIndex} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
                              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-medium text-gray-600">{String.fromCharCode(65 + oIndex)}</span>
                              </div>
                              <input
                                type="text"
                                value={option.text}
                                onChange={(e) => handleOptionChange(e, qIndex, oIndex, 'text')}
                                placeholder={`Option ${oIndex + 1}`}
                                className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                              />
                              <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={option.correct}
                                  onChange={(e) => handleOptionChange(e, qIndex, oIndex, 'correct')}
                                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <span className="text-sm text-gray-700 font-medium">Correct</span>
                              </label>
                              <button
                                type="button"
                                onClick={() => removeOption(qIndex, oIndex)}
                                disabled={question.options.length <= 1}
                                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        
                        {/* Correct answers indicator */}
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <CheckCircle className="w-3 h-3" />
                          <span>{question.options.filter(opt => opt.correct).length} correct answer(s) selected</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Section */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 py-3 px-6 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 px-6 inline-flex justify-center items-center gap-2 rounded-xl font-semibold transition-all duration-300 transform ${
                    loading
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Quiz...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Create Quiz
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Only instructors can create quizzes. Make sure all questions have at least one correct answer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadQuiz;