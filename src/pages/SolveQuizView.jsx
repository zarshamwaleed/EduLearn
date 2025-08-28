import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const SolveQuizView = () => {
  const { quizId, courseId } = useParams();
  const { getToken, user } = useAuth();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [message, setMessage] = useState({ text: '', type: '' });
  const [submission, setSubmission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isTimedOut, setIsTimedOut] = useState(false);

  // Parse duration string (HH:mm:ss) to seconds
  const parseDuration = (duration) => {
    const [hours, minutes, seconds] = duration.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  // Format seconds to HH:mm:ss
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // Get timer color based on time remaining
  const getTimerColor = (seconds, totalSeconds) => {
    const percentage = (seconds / totalSeconds) * 100;
    if (percentage > 50) return 'text-emerald-600';
    if (percentage > 25) return 'text-amber-600';
    return 'text-red-600';
  };

  // Fetch Quiz Data and Submission Status
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setMessage({ text: '', type: '' });
      try {
        const token = getToken();
        if (!token) {
          throw new Error('No authentication token found');
        }
        if (!user) {
          throw new Error('User not authenticated');
        }

        console.log('Fetching quiz for quizId:', quizId, 'courseId:', courseId, 'userId:', user._id);

        // Fetch quiz data
        const quizResponse = await axios.get(`http://localhost:5000/api/quizzes/single/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const quizData = quizResponse.data;
        setQuiz({ id: quizData._id, title: quizData.title, duration: quizData.duration });
        setQuestions(quizData.questions.map((q, index) => ({
          questionID: index + 1,
          qContent: q.qContent,
          options: q.options.map((opt, optIndex) => ({
            option_id: `${index + 1}-${optIndex}`,
            text: opt.text,
            correct: opt.correct ? 1 : 0,
          })),
        })));

        // Initialize answers state
        const initialAnswers = {};
        quizData.questions.forEach((_, index) => {
          initialAnswers[index + 1] = null;
        });
        setAnswers(initialAnswers);

        // Set timer
        const durationInSeconds = parseDuration(quizData.duration);
        setTimeLeft(durationInSeconds);

        // Fetch submission status
        console.log('Fetching submission for quizId:', quizId);
        const submissionResponse = await axios.get(`http://localhost:5000/api/submissions/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (submissionResponse.data) {
          // Recompute questionResults for display
          const questionResults = submissionResponse.data.answers.map((answer) => {
            const question = quizData.questions[answer.questionId - 1];
            const correctOption = question.options.find((opt) => opt.correct);
            const isCorrect = answer.selectedOptionId === `${answer.questionId}-${question.options.indexOf(correctOption)}`;
            return {
              questionId: answer.questionId,
              questionText: question.qContent,
              selectedAnswer: answer.selectedOptionId,
              correctAnswer: `${answer.questionId}-${question.options.indexOf(correctOption)}`,
              isCorrect,
            };
          });
          setSubmission({ ...submissionResponse.data, questionResults });
          console.log('Submission found:', submissionResponse.data);
        } else {
          console.log('No submission found for quizId:', quizId);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage({
          text: error.response?.data?.message || 'Failed to load quiz data. Please try again later.',
          type: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchData();
    } else {
      setMessage({ text: 'User not authenticated', type: 'error' });
      navigate('/login');
    }
  }, [quizId, courseId, user, getToken, navigate]);

  // Timer logic
  useEffect(() => {
    if (submission || isTimedOut || timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimedOut(true);
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submission, isTimedOut]);

  const handleAnswerSelect = (questionId, optionId) => {
    if (submission || isTimedOut) return;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const calculateScore = (userAnswers) => {
    let score = 0;
    const questionResults = [];

    questions.forEach((question) => {
      const userAnswer = userAnswers[question.questionID];
      const correctOption = question.options.find((opt) => opt.correct === 1);
      const isCorrect = userAnswer === correctOption?.option_id;

      if (isCorrect) score++;

      questionResults.push({
        questionId: question.questionID,
        questionText: question.qContent,
        selectedAnswer: userAnswer || null,
        correctAnswer: correctOption?.option_id || null,
        isCorrect: isCorrect || false,
      });
    });

    return { score, questionResults };
  };

  const handleSubmit = async (isAutoSubmit = false) => {
    if (submission || (isAutoSubmit && isSubmitting)) return;

    try {
      setIsSubmitting(true);
      setMessage({ text: '', type: '' });

      const { score, questionResults } = calculateScore(answers);

      const submissionData = {
        quizId,
        courseId,
        userId: user._id,
        answers: Object.entries(answers)
          .filter(([_, optionId]) => optionId !== null)
          .map(([questionId, optionId]) => ({
            questionId: parseInt(questionId),
            selectedOptionId: optionId,
          })),
        score,
        totalQuestions: questions.length,
        submitted_on: new Date().toISOString(),
      };

      console.log('Submitting:', submissionData);

      const token = getToken();
      const response = await axios.post(`http://localhost:5000/api/submissions/${quizId}`, submissionData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const savedSubmission = {
        ...submissionData,
        questionResults,
        message: isAutoSubmit
          ? `Quiz timed out! You scored ${score}/${questions.length}`
          : `Quiz submitted successfully! You scored ${score}/${questions.length}`,
      };
      setSubmission(savedSubmission);

      setMessage({
        text: savedSubmission.message,
        type: isAutoSubmit ? 'error' : 'success',
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setMessage({
        text: error.response?.data?.message || 'Error submitting quiz. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetakeQuiz = async () => {
    try {
      const token = getToken();
      await axios.delete(`http://localhost:5000/api/submissions/${quizId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubmission(null);
      setIsTimedOut(false);
      setAnswers(Object.fromEntries(Object.keys(answers).map((key) => [key, null])));
      setMessage({ text: '', type: '' });
      setTimeLeft(parseDuration(quiz.duration));
    } catch (error) {
      console.error('Error resetting quiz:', error);
      setMessage({
        text: error.response?.data?.message || 'Error resetting quiz. Please try again.',
        type: 'error',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading Quiz</h3>
            <p className="text-gray-600">Please wait while we prepare your quiz...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Quiz Not Found</h2>
          <p className="text-red-600 mb-6">{message.text}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-6 rounded-xl font-medium hover:from-gray-700 hover:to-gray-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // If submission exists or timed out, show results
  if (submission || isTimedOut) {
    const percentage = submission ? Math.round((submission.score / submission.totalQuestions) * 100) : 0;
    const getScoreColor = (percent) => {
      if (percent >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      if (percent >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
      if (percent >= 40) return 'text-amber-600 bg-amber-50 border-amber-200';
      return 'text-red-600 bg-red-50 border-red-200';
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Results</h1>
                <h2 className="text-xl text-gray-600">{quiz.title}</h2>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">Submitted on</div>
                <div className="text-gray-700 font-medium">
                  {new Date(submission?.submitted_on).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Score Card */}
          <div className={`rounded-2xl shadow-xl p-8 mb-8 border-2 ${getScoreColor(percentage)}`}>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="opacity-20"/>
                    <circle 
                      cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8"
                      strokeDasharray={`${percentage * 2.83} 283`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold">{percentage}%</span>
                  </div>
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">
                Your Score: {submission?.score}/{submission?.totalQuestions}
              </h3>
              <p className="text-lg opacity-90">
                {percentage >= 80 ? 'Excellent work! 🎉' : 
                 percentage >= 60 ? 'Good job! 👍' : 
                 percentage >= 40 ? 'Keep practicing! 📚' : 'Need more study! 💪'}
              </p>
            </div>
          </div>

          {/* Message */}
          {message.text && (
            <div className={`rounded-xl p-4 mb-8 border ${
              message.type === 'error' 
                ? 'bg-red-50 border-red-200 text-red-800' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              <div className="flex items-center">
                <svg className={`w-5 h-5 mr-3 ${message.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`} 
                     fill="currentColor" viewBox="0 0 20 20">
                  {message.type === 'error' ? (
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  ) : (
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  )}
                </svg>
                {message.text}
              </div>
            </div>
          )}

          {/* Question Results */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Detailed Results</h3>
            <div className="space-y-6">
              {submission?.questionResults.map((result, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-semibold text-gray-800 text-lg flex-1">
                      Question {index + 1}: {result.questionText}
                    </h4>
                    <div className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${
                      result.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {result.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {questions.find((q) => q.questionID === result.questionId)?.options.map((option) => {
                      const isSelected = result.selectedAnswer === option.option_id;
                      const isCorrect = option.correct === 1;

                      return (
                        <div
                          key={option.option_id}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            isSelected && isCorrect
                              ? 'bg-emerald-50 border-emerald-300 shadow-sm'
                              : isSelected && !isCorrect
                              ? 'bg-red-50 border-red-300 shadow-sm'
                              : isCorrect
                              ? 'bg-emerald-50 border-emerald-200'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`h-5 w-5 rounded-full mr-4 flex items-center justify-center ${
                                isSelected && isCorrect
                                  ? 'bg-emerald-500'
                                  : isSelected && !isCorrect
                                  ? 'bg-red-500'
                                  : isCorrect
                                  ? 'bg-emerald-500'
                                  : 'bg-gray-300'
                              }`}>
                                {(isSelected || isCorrect) && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                  </svg>
                                )}
                              </div>
                              <span className={`${isCorrect ? 'font-medium text-gray-800' : 'text-gray-700'}`}>
                                {option.text}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {isSelected && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Your Answer
                                </span>
                              )}
                              {isCorrect && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                  Correct Answer
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(`/courses/${courseId}/quizzes`)}
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 px-8 rounded-xl font-medium hover:from-indigo-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Back to Quizzes
            </button>
            <button
              onClick={handleRetakeQuiz}
              className="bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-8 rounded-xl font-medium hover:from-gray-700 hover:to-gray-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If no submission and not timed out, show the quiz
  const totalDuration = parseDuration(quiz.duration);
  const answeredCount = Object.values(answers).filter(answer => answer !== null).length;
  const progress = (answeredCount / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 sticky top-4 z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{quiz.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Question {answeredCount} of {questions.length}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span>{Math.round(progress)}%</span>
                </div>
              </div>
            </div>
            <div className={`text-right ${getTimerColor(timeLeft, totalDuration)}`}>
              <div className="text-sm font-medium mb-1">Time Remaining</div>
              <div className="text-2xl font-bold font-mono bg-white border-2 px-4 py-2 rounded-lg shadow-sm">
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`rounded-xl p-4 mb-8 border ${
            message.type === 'error' 
              ? 'bg-red-50 border-red-200 text-red-800' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <div className="flex items-center">
              <svg className={`w-5 h-5 mr-3 ${message.type === 'error' ? 'text-red-500' : 'text-emerald-500'}`} 
                   fill="currentColor" viewBox="0 0 20 20">
                {message.type === 'error' ? (
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                ) : (
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                )}
              </svg>
              {message.text}
            </div>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-8">
          {questions.map((question, qIndex) => (
            <div key={question.questionID} className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  {qIndex + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 leading-relaxed">
                  {question.qContent}
                </h3>
              </div>

              <div className="space-y-3 pl-14">
                {question.options.map((option, optIndex) => {
                  const isSelected = answers[question.questionID] === option.option_id;
                  return (
                    <label
                      key={option.option_id}
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                        isSelected 
                          ? 'border-indigo-300 bg-indigo-50 shadow-sm' 
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        id={`q-${question.questionID}-o-${option.option_id}`}
                        name={`question-${question.questionID}`}
                        checked={isSelected}
                        onChange={() => handleAnswerSelect(question.questionID, option.option_id)}
                        className="sr-only"
                        disabled={submission || isTimedOut}
                      />
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mr-4 transition-all ${
                        isSelected 
                          ? 'border-indigo-500 bg-indigo-500' 
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <div className="w-full h-full rounded-full bg-indigo-500 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <span className={`text-gray-700 ${isSelected ? 'font-medium' : ''}`}>
                        {String.fromCharCode(65 + optIndex)}. {option.text}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <button
              onClick={() => handleSubmit(false)}
              disabled={isSubmitting || submission || isTimedOut}
              className={`px-12 py-4 rounded-xl text-white font-semibold text-lg transition-all duration-200 ${
                isSubmitting || submission || isTimedOut
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting Quiz...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Submit Quiz
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolveQuizView;