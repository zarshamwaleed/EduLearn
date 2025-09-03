import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';
import api from "../api";
const StudentAssignmentView = () => {
  const { courseId } = useParams();
  const { user, getToken } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);

  // Fetch assignments with submission info
  useEffect(() => {
    const fetchAssignments = async () => {
      setIsLoading(true);
      try {
        const token = getToken();
        if (!token) {
          throw new Error('No authentication token found');
        }
        if (!user || user.role !== 'student') {
          throw new Error('Unauthorized: Student access only');
        }

      const response = await api.get(`/courses/${courseId}/assignments/student`);
        setAssignments(response.data);
      } catch (err) {
        console.error('Error fetching assignments:', err);
        setError(err.response?.data?.message || 'Failed to fetch assignments');
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchAssignments();
    } else {
      setError('User not authenticated');
      navigate('/login');
    }
  }, [courseId, user, getToken, navigate]);

  // Handle file selection for submission
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Submit assignment
  const handleSubmit = async (e, assignmentId) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to submit.');
      return;
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formData = new FormData();
      formData.append('studentId', user._id);
      formData.append('studentName', user.name);
      formData.append('studentEmail', user.email);
      formData.append('courseId', courseId);
      formData.append('file', selectedFile);

      const response = await api.post(
  `/assignments/${assignmentId}/submissions`,
  formData,
  {
    headers: {
      'Content-Type': 'multipart/form-data', // Authorization is handled automatically
    },
  }
);

      console.log('Submission response:', response.data);
      setSuccessMessage('Assignment submitted successfully!');

      // Refresh assignments
      const updatedAssignments = assignments.map(ass =>
        ass.assignment_id === assignmentId
          ? { ...ass, submitted: true, submitted_on: new Date().toISOString(), marks: null, submission_id: response.data.submission._id }
          : ass
      );
      setAssignments(updatedAssignments);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setError('');
    } catch (err) {
      console.error('Error submitting assignment:', err);
      setError(err.response?.data?.message || 'Failed to submit assignment');
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Download submitted file
const handleDownloadSubmission = async (submissionId, assignment) => {
  if (!submissionId) {
    setError("No submission found to download.");
    return;
  }

  try {
    const token = getToken();
    if (!token) {
      throw new Error("No authentication token found");
    }

    // ✅ No need for responseType: "blob", we're just fetching JSON with signed URL
const response = await api.get(`/assignment-submissions/${submissionId}/download`);

    const signedUrl = response.data?.signedUrl;

    if (!signedUrl) {
      throw new Error("No signed URL returned from server");
    }

    // ✅ Open the Cloudinary secure URL in a new tab (or trigger a direct download)
    const link = document.createElement("a");
    link.href = signedUrl;
    link.download = `${assignment?.title || "submission"}_file`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSuccessMessage("Submission download started!");
    setError("");
  } catch (err) {
    console.error("Error downloading submission:", err);
    setError(err.response?.data?.message || "Failed to download submission");

    if (err.response?.status === 401 || err.response?.status === 403) {
      navigate("/login");
    }
  }
};


  // Download assignment file
  const handleDownloadAssignment = async (assignmentId, assignment) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

 const response = await api.get(`/assignments/${assignmentId}/download`, {
  responseType: 'blob', // required for downloading files
});

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `${assignment.title}_assignment${response.headers['content-disposition']?.match(/filename="(.+)"/)?.[1] || '.pdf'}`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setSuccessMessage('Assignment file downloaded successfully!');
      setError('');
    } catch (err) {
      console.error('Error downloading assignment file:', err);
      setError(err.response?.data?.message || 'Failed to download assignment file');
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      }
    }
  };

  // Download assignment details as PDF
  const handleDownloadAssignmentDetails = (assignment) => {
    try {
      const doc = new jsPDF();
      
      doc.setProperties({
        title: `${assignment.title}_details`,
        author: 'LMS System',
        creator: 'StudentAssignmentView',
      });

      doc.setFillColor(59, 130, 246);
      doc.rect(0, 0, 210, 30, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text('Assignment Details', 20, 20);

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      
      doc.setFont('helvetica', 'bold');
      doc.text('Title:', 20, 40);
      doc.setFont('helvetica', 'normal');
      doc.text(assignment.title, 50, 40);

      doc.setFont('helvetica', 'bold');
      doc.text('Description:', 20, 50);
      doc.setFont('helvetica', 'normal');
      const description = assignment.description || 'No description provided';
      const splitDescription = doc.splitTextToSize(description, 170);
      doc.text(splitDescription, 50, 50);

      doc.setFont('helvetica', 'bold');
      doc.text('Total Marks:', 20, 70 + (splitDescription.length - 1) * 10);
      doc.setFont('helvetica', 'normal');
      doc.text(`${assignment.total_marks}`, 50, 70 + (splitDescription.length - 1) * 10);

      doc.setFont('helvetica', 'bold');
      doc.text('Due Date:', 20, 80 + (splitDescription.length - 1) * 10);
      doc.setFont('helvetica', 'normal');
      doc.text(formatDate(assignment.due_date), 50, 80 + (splitDescription.length - 1) * 10);

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Generated by LMS System', 20, 280);
      doc.text(`Date: ${new Date().toLocaleString()}`, 150, 280);

      doc.save(`${assignment.title}_details.pdf`);
      setSuccessMessage('Assignment details downloaded successfully!');
      setError('');
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate assignment details PDF');
    }
  };

  // Utility functions for date handling
  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : 'N/A';
  };

  const isLateSubmission = (assignment) => {
    if (!assignment.submitted_on || !assignment.due_date) return false;
    return new Date(assignment.submitted_on) > new Date(assignment.due_date);
  };

  const getSubmissionStatus = (assignment) => {
    if (!assignment.submitted) {
      const dueDate = new Date(assignment.due_date);
      const now = new Date();
      const isOverdue = now > dueDate;
      
      return (
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${isOverdue ? 'bg-red-500' : 'bg-amber-400'}`}></div>
          <span className={`font-medium ${isOverdue ? 'text-red-600' : 'text-amber-600'}`}>
            {isOverdue ? 'Overdue' : 'Pending'}
          </span>
        </div>
      );
    }
    if (isLateSubmission(assignment)) {
      return (
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2 bg-orange-500"></div>
          <span className="text-orange-600 font-medium">Late</span>
        </div>
      );
    }
    return (
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full mr-2 bg-emerald-500"></div>
        <span className="text-emerald-600 font-medium">Submitted</span>
      </div>
    );
  };

  const getDaysUntilDue = (dueDate) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading Assignments</h3>
            <p className="text-gray-600">Please wait while we fetch your assignments...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
     <div className="px-6 py-8 w-[1420px] ml-18 -mt-6 ">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Course Assignments</h1>
              <p className="text-gray-600">Manage and submit your assignments</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{assignments.length}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">
                  {assignments.filter(a => a.submitted).length}
                </div>
                <div className="text-sm text-gray-500">Submitted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">
                  {assignments.filter(a => !a.submitted).length}
                </div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-r-xl shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {error}
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-400 text-emerald-700 rounded-r-xl shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              {successMessage}
            </div>
          </div>
        )}

        {/* Main Content */}
        {assignments.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Assignments Yet</h3>
            <p className="text-gray-500">There are no assignments available for this course at the moment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {assignments.map((assignment) => {
              const daysUntilDue = getDaysUntilDue(assignment.due_date);
              const isOverdue = daysUntilDue < 0;
              const scorePercentage = assignment.marks !== null ? (assignment.marks / assignment.total_marks) * 100 : null;

              return (
                <div key={assignment.assignment_id} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    {/* Left Section - Assignment Info */}
                    <div className="flex-1 mb-6 lg:mb-0">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{assignment.title}</h3>
                        {/* Status Badge - Moved to Left */}
                        <div className="mb-2">
                          {getSubmissionStatus(assignment)}
                        </div>
                        {/* Due Days Badge */}
                        {!assignment.submitted && (
                          <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            isOverdue ? 'bg-red-100 text-red-800' : 
                            daysUntilDue <= 1 ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` :
                             daysUntilDue === 0 ? 'Due today' :
                             daysUntilDue === 1 ? 'Due tomorrow' :
                             `${daysUntilDue} days left`}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          Due: {formatDate(assignment.due_date)}
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                          </svg>
                          Total Marks: {assignment.total_marks}
                        </div>
                      </div>

                      {/* Score Display */}
                      {assignment.marks !== null && (
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="flex items-center">
                            <div className={`px-4 py-2 rounded-lg font-semibold ${
                              scorePercentage >= 70 ? 'bg-emerald-100 text-emerald-800' :
                              scorePercentage >= 50 ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              Score: {assignment.marks}/{assignment.total_marks}
                            </div>
                            <div className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                              scorePercentage >= 70 ? 'bg-emerald-50 text-emerald-700' :
                              scorePercentage >= 50 ? 'bg-amber-50 text-amber-700' :
                              'bg-red-50 text-red-700'
                            }`}>
                              {Math.round(scorePercentage)}%
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Submission Info */}
                      {assignment.submitted && (
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            Submitted on: {formatDate(assignment.submitted_on)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex flex-col space-y-3 lg:w-64">
                      <button
                        onClick={() => handleDownloadAssignmentDetails(assignment)}
                        className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
                        disabled={isSubmitting}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        Download Details (PDF)
                      </button>
                 
                      {assignment.submitted ? (
                        <button
                          onClick={() => handleDownloadSubmission(assignment.submission_id, assignment)}
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
                          disabled={isSubmitting}
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                          </svg>
                          Download Submission
                        </button>
                      ) : (
                        <form
                          onSubmit={(e) => handleSubmit(e, assignment.assignment_id)}
                          className="space-y-3"
                        >
                          <div className="relative">
                            <input
                              type="file"
                              onChange={handleFileChange}
                              ref={fileInputRef}
                              className="w-full text-sm text-gray-600
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-xl file:border-0
                                file:text-sm file:font-medium
                                file:bg-gradient-to-r file:from-blue-50 file:to-indigo-50
                                file:text-blue-700 hover:file:from-blue-100 hover:file:to-indigo-100
                                file:transition-all file:duration-200
                                border border-gray-200 rounded-xl p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                              required
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                </svg>
                                Submit Assignment
                              </>
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAssignmentView;