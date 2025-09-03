  import React, { useState } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import axios from 'axios';
  import { useAuth } from '../context/AuthContext';
  import api from "../api";
  const UploadFile = () => {
    const { courseId } = useParams();
    const { getToken, user } = useAuth();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [contentType, setContentType] = useState('file');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (e) => {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile ? selectedFile.name : '');
    };

    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const droppedFile = e.dataTransfer.files[0];
        setFile(droppedFile);
        setFileName(droppedFile.name);
      }
    };

    const handleContentTypeChange = (e) => {
      setContentType(e.target.value);
    };

    const getFileIcon = () => {
      switch (contentType) {
        case 'pdf': return '📄';
        case 'image': return '🖼️';
        case 'video': return '🎬';
        case 'audio': return '🎵';
        case 'presentation': return '📊';
        case 'spreadsheet': return '📈';
        case 'document': return '📝';
        case 'ebook': return '📚';
        default: return '📁';
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!file) {
        setError('Please select a file to upload.');
        setMessage('');
        return;
      }

      if (!user || user.role !== 'instructor') {
        setError('Unauthorized: Only instructors can upload content.');
        setMessage('');
        navigate('/login');
        return;
      }

      try {
        setIsUploading(true);
        setMessage('');
        setError('');

        const token = getToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('contentType', contentType);

    const res = await api.post(`/upload/${courseId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // Authorization handled automatically
    },
  });

        setMessage(res.data.message);
        setError('');
        console.log('Upload response:', res.data);

        // Reset form
        setFile(null);
        setFileName('');
        setContentType('file');
        document.getElementById('file').value = null;
      } catch (err) {
        console.error('Upload error:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Failed to upload file. Please try again.');
        setMessage('');
        if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/login');
        }
      } finally {
        setIsUploading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Content</h1>
            {/* <p className="text-gray-600 text-lg">Course ID: <span className="font-semibold text-indigo-600">{courseId}</span></p> */}
          </div>

          {/* Main Upload Card */}
          <div className="bg-white shadow-2xl rounded-3xl p-8 border border-gray-100 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Drag & Drop File Upload Area */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Upload File
                </label>
                
                <div
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ease-in-out ${
                    dragActive
                      ? 'border-indigo-500 bg-indigo-50 scale-105'
                      : file
                      ? 'border-green-400 bg-green-50'
                      : 'border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                    required
                  />
                  
                  {file ? (
                    <div className="space-y-3">
                      <div className="text-4xl">{getFileIcon()}</div>
                      <div>
                        <p className="text-lg font-medium text-green-700">{fileName}</p>
                        <p className="text-sm text-green-600 mt-1">File selected successfully</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setFileName('');
                          document.getElementById('file').value = null;
                        }}
                        className="text-sm text-red-600 hover:text-red-700 underline"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-5xl text-gray-400">📁</div>
                      <div>
                        <p className="text-xl font-medium text-gray-700">
                          Drop your file here, or <span className="text-indigo-600 underline">browse</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Supports various file formats including PDF, images, videos, and documents
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Content Type Selection */}
              <div className="space-y-4">
                <label htmlFor="contentType" className="block text-sm font-semibold text-gray-700">
                  Content Type
                </label>
                <div className="relative">
                  <select
                    id="contentType"
                    className="block w-full pl-4 pr-12 py-4 text-base border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm transition-all duration-200 hover:border-gray-400"
                    value={contentType}
                    onChange={handleContentTypeChange}
                  >
                    <option value="file">📁 General File</option>
                    <option value="pdf">📄 PDF Document</option>
                    <option value="image">🖼️ Image (JPEG, PNG, GIF)</option>
                    <option value="video">🎬 Video (MP4, AVI)</option>
                    <option value="audio">🎵 Audio (MP3, WAV)</option>
                    <option value="presentation">📊 Presentation (PPT, PPTX)</option>
                    <option value="spreadsheet">📈 Spreadsheet (XLS, XLSX)</option>
                    <option value="document">📝 Document (DOC, DOCX)</option>
                    <option value="ebook">📚 eBook (EPUB, MOBI)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Upload Button */}
              <button
                type="submit"
                disabled={isUploading || !file}
                className={`w-full py-4 px-6 text-base font-semibold rounded-xl transition-all duration-300 transform ${
                  isUploading
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : !file
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:scale-105 shadow-lg hover:shadow-xl'
                } focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50`}
              >
                {isUploading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>Upload File</span>
                  </div>
                )}
              </button>
            </form>

            {/* Success/Error Messages */}
            {message && (
              <div className="mt-6 p-4 rounded-xl bg-green-50 border border-green-200 animate-in slide-in-from-top duration-300">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-green-800 font-medium">{message}</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 animate-in slide-in-from-top duration-300">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Only instructors can upload content to courses. Ensure your file meets the course requirements.
            </p>
          </div>
        </div>
      </div>
    );
  };

  export default UploadFile;