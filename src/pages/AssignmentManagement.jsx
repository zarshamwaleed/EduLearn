import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  Download, 
  FileText, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  Calendar,
  GraduationCap,
  X,
  Save
} from 'lucide-react';
import jsPDF from 'jspdf';
import api from "../api";
const AssignmentManagement = () => {
  const { courseId } = useParams();
  const { user, getToken } = useAuth();
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    total_marks: '',
    due_date: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    total_marks: '',
    due_date: '',
  });
  const [editSelectedFile, setEditSelectedFile] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [marks, setMarks] = useState({});
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentAssignmentDetails, setCurrentAssignmentDetails] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);
  const createFileInputRef = useRef(null);
  const editFileInputRef = useRef(null);

  // Fetch assignments for the course
  useEffect(() => {
    const fetchAssignments = async () => {
  setIsLoading(true);
  try {
    if (!user || user.role !== "instructor") {
      throw new Error("Unauthorized: Instructor access only");
    }

    const response = await api.get(`/courses/${courseId}/assignments`);
    setAssignments(response.data);
  } catch (err) {
    console.error("Error fetching assignments:", err);
    setError(err.response?.data?.message || "Failed to fetch assignments");

    if (err.response?.status === 401 || err.response?.status === 403) {
      navigate("/login");
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

  // Fetch submissions and assignment details
    const handleViewSubmissions = async (assignmentId) => {
  setIsLoading(true);
  try {
    // Fetch assignment details
    const assignmentResponse = await api.get(`/assignments/${assignmentId}`);
    setCurrentAssignmentDetails(assignmentResponse.data);

    // Fetch submissions
    const submissionsResponse = await api.get(
      `/assignments/${assignmentId}/submissions`
    );
    setSubmissions(submissionsResponse.data);
    setSelectedAssignment(assignmentId);

    // Initialize marks with existing grades
    const initialMarks = {};
    submissionsResponse.data.forEach((sub) => {
      if (sub.marks !== null) {
        initialMarks[sub.studentId] = sub.marks;
      }
    });
    setMarks(initialMarks);
  } catch (err) {
    console.error("Error fetching submissions:", err);
    setError(err.response?.data?.message || "Failed to fetch submissions");

    if (err.response?.status === 401 || err.response?.status === 403) {
      navigate("/login");
    }
  } finally {
    setIsLoading(false);
  }
};


  // Handle input changes for marks
  const handleMarksChange = (studentId, value) => {
    setMarks((prevMarks) => ({ ...prevMarks, [studentId]: value }));
  };

  // Grade a submission
 const handleGrade = async (submissionId, studentId) => {
  const markValue = marks[studentId];

  if (markValue === undefined || markValue === "") {
    setError("Please enter a valid mark before submitting.");
    return;
  }
  if (markValue > currentAssignmentDetails.totalMarks) {
    setError(`Marks cannot exceed ${currentAssignmentDetails.totalMarks}`);
    return;
  }

  try {
    await api.put(`/assignment-submissions/${submissionId}/grade`, {
      marks: markValue,
    });

    setSuccessMessage("Submission graded successfully!");
    handleViewSubmissions(selectedAssignment); // Refresh submissions
    setError("");
  } catch (err) {
    console.error("Error grading submission:", err);
    setError(err.response?.data?.message || "Failed to grade submission");
    if (err.response?.status === 401 || err.response?.status === 403) {
      navigate("/login");
    }
  }
};
  // Download a submission file
const handleDownload = async (submissionId, studentName) => {
  try {
    // First, get the signed URL from your backend
    const response = await api.get(
      `/assignment-submissions/${submissionId}/download`
      // Note: No responseType: "blob" here since we're getting JSON with signedUrl
    );

    console.log("Response from backend:", response.data);

    if (!response.data.signedUrl) {
      throw new Error("No signed URL received from server");
    }

    // Now use the signed URL to download the file
    const fileResponse = await fetch(response.data.signedUrl);
    
    if (!fileResponse.ok) {
      throw new Error(`Failed to download file: ${fileResponse.status} ${fileResponse.statusText}`);
    }

    // Get the file as a blob
    const blob = await fileResponse.blob();

    // Extract file extension from the original file URL if possible
    let fileExtension = 'pdf'; // default
    try {
      // Try to extract extension from the Cloudinary URL
      const urlParts = response.data.signedUrl.split('?')[0]; // Remove query params
      const pathParts = urlParts.split('.');
      if (pathParts.length > 1) {
        fileExtension = pathParts.pop();
      }
    } catch (e) {
      console.warn("Could not extract file extension, using default");
    }

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${studentName}_submission.${fileExtension}`);
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    setSuccessMessage("Submission downloaded successfully!");
    setError("");
  } catch (err) {
    console.error("Error downloading submission:", err);
    setError(err.message || "Failed to download submission");
    
    if (err.response?.status === 401 || err.response?.status === 403) {
      navigate("/login");
    }
  }
};

  // Download assignment details as PDF
  const handleDownloadAssignmentDetails = async (assignment) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

const response = await api.get(`/assignments/${assignment._id}`);
      const fullAssignmentData = response.data;
      const doc = new jsPDF();

      // Set document properties
      doc.setProperties({
        title: `${fullAssignmentData.title}_details`,
        author: 'LMS System',
        creator: 'AssignmentManagement',
      });

      // Header
      doc.setFillColor(59, 130, 246);
      doc.rect(0, 0, 210, 30, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text('Assignment Details', 20, 20);

      // Content
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');

      // Title
      doc.setFont('helvetica', 'bold');
      doc.text('Title:', 20, 40);
      doc.setFont('helvetica', 'normal');
      doc.text(fullAssignmentData.title, 50, 40);

      // Description
      doc.setFont('helvetica', 'bold');
      doc.text('Description:', 20, 50);
      doc.setFont('helvetica', 'normal');
      
      let description;
      if (fullAssignmentData.description && 
          fullAssignmentData.description !== null && 
          fullAssignmentData.description !== undefined && 
          fullAssignmentData.description.toString().trim() !== '') {
        description = fullAssignmentData.description.toString().trim();
      } else {
        description = 'No description provided';
      }
      
      const splitDescription = doc.splitTextToSize(description, 150);
      doc.text(splitDescription, 20, 60);

      // Calculate dynamic offset based on description length
      const descriptionHeight = splitDescription.length * 5;
      const yOffset = 60 + descriptionHeight + 10;

      // Total Marks
      doc.setFont('helvetica', 'bold');
      doc.text('Total Marks:', 20, yOffset);
      doc.setFont('helvetica', 'normal');
      doc.text(`${fullAssignmentData.totalMarks}`, 80, yOffset);

      // Due Date
      doc.setFont('helvetica', 'bold');
      doc.text('Due Date:', 20, yOffset + 10);
      doc.setFont('helvetica', 'normal');
      doc.text(formatDate(fullAssignmentData.dueDate), 80, yOffset + 10);

      // File info
      doc.setFont('helvetica', 'bold');
      doc.text('Assignment File:', 20, yOffset + 20);
      doc.setFont('helvetica', 'normal');
      doc.text(fullAssignmentData.file ? 'File attached' : 'No file attached', 80, yOffset + 20);

      // Footer
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Generated by LMS System', 20, 280);
      doc.text(`Date: ${new Date().toLocaleString()}`, 120, 280);

      // Save PDF
      doc.save(`${fullAssignmentData.title}_details.pdf`);
      setSuccessMessage('Assignment details downloaded successfully!');
      setError('');
    } catch (err) {
      console.error('Error generating PDF:', err);
      setError('Failed to generate assignment details PDF');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Submit new assignment
  const handleSubmitAssignment = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.total_marks || !formData.due_date) {
      setError('Please fill all required fields');
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('totalMarks', formData.total_marks);
      formDataToSend.append('dueDate', formData.due_date);
      if (selectedFile) {
        formDataToSend.append('file', selectedFile);
      }

    const response = await api.post(
  `/courses/${courseId}/assignments`,
  formDataToSend,
  {
    headers: { "Content-Type": "multipart/form-data" },
  }
);

      setAssignments([...assignments, response.data.assignment]);
      setSuccessMessage('Assignment created successfully!');
      setShowCreateForm(false);
      setFormData({
        title: '',
        description: '',
        total_marks: '',
        due_date: '',
      });
      setSelectedFile(null);
      if (createFileInputRef.current) {
        createFileInputRef.current.value = '';
      }
      setError('');
    } catch (err) {
      console.error('Error creating assignment:', err);
      setError(err.response?.data?.message || 'Failed to create assignment');
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      }
    }
  };

  // Handle edit form input changes
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // Handle edit file selection
  const handleEditFileChange = (e) => {
    setEditSelectedFile(e.target.files[0]);
  };

  // Open edit form
  const handleEdit = (assignment) => {
    setEditFormData({
      title: assignment.title,
      description: assignment.description || '',
      total_marks: assignment.totalMarks,
      due_date: new Date(assignment.dueDate).toISOString().slice(0, 16),
    });
    setSelectedAssignment(assignment._id);
    setShowEditForm(true);
  };

  // Submit edited assignment
  const handleSubmitEdit = async (e) => {
    e.preventDefault();

    if (!editFormData.title || !editFormData.total_marks || !editFormData.due_date) {
      setError('Please fill all required fields');
      return;
    }

    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formDataToSend = new FormData();
      formDataToSend.append('title', editFormData.title);
      formDataToSend.append('description', editFormData.description);
      formDataToSend.append('totalMarks', editFormData.total_marks);
      formDataToSend.append('dueDate', editFormData.due_date);
      if (editSelectedFile) {
        formDataToSend.append('file', editSelectedFile);
      }

     const response = await api.put(
  `/assignments/${selectedAssignment}`,
  formDataToSend,
  {
    headers: {
      'Content-Type': 'multipart/form-data', // Authorization header is already handled by interceptor
    },
  }
);

      setAssignments(assignments.map(ass =>
        ass._id === selectedAssignment ? response.data.assignment : ass
      ));
      setSuccessMessage('Assignment updated successfully!');
      setShowEditForm(false);
      setEditFormData({
        title: '',
        description: '',
        total_marks: '',
        due_date: '',
      });
      setEditSelectedFile(null);
      if (editFileInputRef.current) {
        editFileInputRef.current.value = '';
      }
      setError('');
    } catch (err) {
      console.error('Error updating assignment:', err);
      setError(err.response?.data?.message || 'Failed to update assignment');
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      }
    }
  };

  // Confirm delete
const handleConfirmDelete = async () => {
  try {
    await api.delete(`/assignments/${assignmentToDelete}`);

    // Update state after successful delete
    setAssignments(assignments.filter(ass => ass._id !== assignmentToDelete));
    setSuccessMessage('Assignment deleted successfully!');
    setShowDeleteModal(false);
    setAssignmentToDelete(null);
    setError('');
  } catch (err) {
    console.error('Error deleting assignment:', err);
    setError(err.response?.data?.message || 'Failed to delete assignment');

    if (err.response?.status === 401 || err.response?.status === 403) {
      navigate('/login'); // interceptor already removes token too
    }
  }
};

  // Utility function for date formatting
  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleString() : 'N/A';
  };

  // Check for late submission
  const isLateSubmission = (submission) => {
    if (!submission.submittedOn || !currentAssignmentDetails?.dueDate) return false;
    return new Date(submission.submittedOn) > new Date(currentAssignmentDetails.dueDate);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          <p className="text-gray-600 font-medium">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assignment Management</h1>
          <p className="text-gray-600 text-lg">Manage assignments <span className="font-semibold text-orange-600"></span></p>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 animate-in slide-in-from-top duration-300">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 animate-in slide-in-from-top duration-300">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="text-green-800 font-medium">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Create Assignment Button */}
        <div className="bg-white shadow-2xl rounded-3xl border border-gray-100 backdrop-blur-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-amber-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-semibold text-gray-800">Course Assignments</h2>
              </div>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl hover:from-orange-600 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                {showCreateForm ? 'Cancel' : 'Create Assignment'}
              </button>
            </div>
          </div>

          {/* Create Assignment Form */}
          {showCreateForm && (
            <div className="p-8 border-b border-gray-200">
              <form onSubmit={handleSubmitAssignment} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Assignment Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter assignment title"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Total Marks *</label>
                    <input
                      type="number"
                      name="total_marks"
                      value={formData.total_marks}
                      onChange={handleInputChange}
                      placeholder="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      required
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide assignment instructions and details..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-200"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date *</label>
                    <input
                      type="datetime-local"
                      name="due_date"
                      value={formData.due_date}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Assignment File</label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      ref={createFileInputRef}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl hover:from-orange-600 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                  >
                    Create Assignment
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Assignment List */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Marks</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submissions</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {assignments.map((assignment, index) => (
                  <tr key={assignment._id} className={`hover:bg-orange-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{assignment.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs">
                        {assignment.description?.length > 60
                          ? `${assignment.description.substring(0, 60)}...`
                          : assignment.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{formatDate(assignment.dueDate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {assignment.totalMarks} pts
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{assignment.submissionsCount || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewSubmissions(assignment._id)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Submissions"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(assignment)}
                          className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Assignment"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadAssignmentDetails(assignment)}
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setAssignmentToDelete(assignment._id);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Assignment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Assignment Form Modal */}
        {showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Edit Assignment</h3>
                <button
                  onClick={() => setShowEditForm(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmitEdit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Assignment Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Total Marks *</label>
                    <input
                      type="number"
                      name="total_marks"
                      value={editFormData.total_marks}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      required
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-200"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date *</label>
                    <input
                      type="datetime-local"
                      name="due_date"
                      value={editFormData.due_date}
                      onChange={handleEditInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Update Assignment File (optional)</label>
                    <input
                      type="file"
                      onChange={handleEditFileChange}
                      ref={editFileInputRef}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-xl hover:from-orange-600 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                  >
                    Update Assignment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Submissions Section */}
        {selectedAssignment && currentAssignmentDetails && (
          <div className="bg-white shadow-2xl rounded-3xl border border-gray-100 backdrop-blur-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Submissions: {currentAssignmentDetails.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {formatDate(currentAssignmentDetails.dueDate)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GraduationCap className="w-4 h-4" />
                      <span>Total Marks: {currentAssignmentDetails.totalMarks}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAssignment(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submitted On</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Grade</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {submissions.map((submission, index) => (
                    <tr key={submission._id} className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {submission.studentName?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{submission.studentName}</div>
                            <div className="text-sm text-gray-500">{submission.studentEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {submission.submittedOn ? formatDate(submission.submittedOn) : 'Not submitted'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {submission.submittedOn ? (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            isLateSubmission(submission) 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {isLateSubmission(submission) ? (
                              <>
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Late
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                On Time
                              </>
                            )}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <X className="w-3 h-3 mr-1" />
                            Not Submitted
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            placeholder="Grade"
                            min="0"
                            max={currentAssignmentDetails.totalMarks}
                            value={marks[submission.studentId] ?? ''}
                            onChange={(e) => handleMarksChange(submission.studentId, e.target.value)}
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                          <span className="text-sm text-gray-500">/ {currentAssignmentDetails.totalMarks}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleGrade(submission._id, submission.studentId)}
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                            title="Save Grade"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          {submission.file && (
                            <button
                              onClick={() => handleDownload(submission._id, submission.studentName)}
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Download Submission"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Assignment</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete this assignment? All submissions and grades will be permanently removed.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
                >
                  Delete Assignment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Only instructors can manage assignments. Students will be able to view and submit assignments from their dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssignmentManagement;