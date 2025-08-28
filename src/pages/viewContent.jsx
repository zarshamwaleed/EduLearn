import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  DocumentIcon, 
  CalendarIcon, 
  DownloadIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const mockContent = {
  content_id: 1,
  file_name: "Advanced_JavaScript_Programming.pdf",
  content_type: "application/pdf",
  uploaded_at: "2025-08-01T10:00:00Z",
  file_size: "2.4 MB",
  description: "Comprehensive guide to advanced JavaScript concepts including closures, promises, async/await, and modern ES6+ features.",
  file_data: "mockBase64Data" // Simulated base64 data
};

function ViewContent() {
  const { courseId, contentId } = useParams();
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Simulate fetching content data
    setTimeout(() => {
      if (contentId) {
        console.log('Simulating fetching content for ID:', contentId);
        setContent(mockContent);
        setIsLoading(false);
      } else {
        setError('No content ID provided.');
        setIsLoading(false);
      }
    }, 1000);
  }, [contentId]);

  const handleDownload = () => {
    setIsDownloading(true);
    // Simulate file download
    console.log('Initiating download for:', content.file_name);
    
    setTimeout(() => {
      alert('Download completed successfully!');
      setIsDownloading(false);
    }, 1500);
  };

  const handleView = () => {
    // Simulate file viewing
    console.log('Viewing content:', content.file_name);
    alert('This would open the file in a viewer (mock implementation)');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-gray-300">Loading content...</p>
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
          <p className="text-gray-300 mb-6">{error}</p>
          <Link
            to={`/courses/${courseId}`}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Course
          </Link>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 text-center">
          <DocumentIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Content Not Found</h3>
          <p className="text-gray-400 mb-6">The requested content could not be found.</p>
          <Link
            to={`/courses/${courseId}`}
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to={`/courses/${courseId}`}
            className="inline-flex items-center text-gray-300 hover:text-white transition duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Course
          </Link>
          <div className="flex items-center text-gray-400">
            <DocumentIcon className="w-5 h-5 mr-2" />
            <span>Course Content</span>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-6 mb-8">
          <div className="flex items-start mb-6">
            <div className="bg-indigo-500/10 p-3 rounded-lg mr-4">
              <DocumentIcon className="w-8 h-8 text-indigo-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-2">{content.file_name}</h1>
              <div className="flex items-center text-gray-400 text-sm">
                <CalendarIcon className="w-4 h-4 mr-1" />
                <span>Uploaded {new Date(content.uploaded_at).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span>{content.file_size}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {content.description && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-300 mb-2">Description</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{content.description}</p>
            </div>
          )}

          {/* File Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-750 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-2">File Type</h3>
              <p className="text-white font-mono text-sm">{content.content_type}</p>
            </div>
            <div className="bg-gray-750 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-300 mb-2">File Size</h3>
              <p className="text-white text-sm">{content.file_size}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleView}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
            >
              <EyeIcon className="w-5 h-5 mr-2" />
              View Content
            </button>
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center ${
                isDownloading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Downloading...
                </>
              ) : (
                <>
                  <DownloadIcon className="w-5 h-5 mr-2" />
                  Download
                </>
              )}
            </button>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">About This Content</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Best Practices</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Save a copy for offline reference</li>
                <li>• Review material before assignments</li>
                <li>• Take notes while studying</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-2">Technical Requirements</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• PDF reader installed</li>
                <li>• Stable internet connection</li>
                <li>• Updated web browser</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewContent;