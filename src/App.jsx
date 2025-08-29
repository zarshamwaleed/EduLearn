import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import axios from 'axios';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
import Footer from './components/footer';
import Home from './pages/home';
import Dashboard from './pages/dashboard';
import About from './pages/About';
import Login from './pages/login';
import Signup from './pages/Signup';
import Logout from './pages/logout';
import CourseList from './pages/CourseList';
import EditQuiz from './pages/EditQuiz';
import CourseDetail from './pages/CourseDetail';
// import ViewContent from './pages/ViewContent';
import UploadFile from './pages/UploadFile';
import EditCourseForm from './pages/editCourse';
import QuizManagement from './pages/QuizManagement';
import UploadQuiz from './pages/UploadQuiz';
import SolveQuizView from './pages/SolveQuizView';
import ViewAllQuizzes from './pages/ViewAllQuizzes';
import AssignmentManagement from './pages/AssignmentManagement';
import StudentAssignmentView from './pages/StudentAssignmentView';
import StudentDashboard from './components/student';
import InstructorDashboard from './components/instructor';
import Profile from './components/Profile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import Help from './pages/Help';
import AnalyticsDashboard from './pages/analytics';
import Contact from './pages/Contact';
function AppRoutes() {
  const [editProfile, setEditProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    bio: '',
    profilePic: '',
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      axios.get('/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
        .then(response => setProfileData(response.data))
        .catch(error => console.error("Error fetching profile:", error));
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Fixed on desktop, hidden when closed */}
      <div
        className={`fixed top-0 left-0 h-full z-50 transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-0'
        } bg-white shadow-lg md:block hidden overflow-hidden`}
      >
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Mobile Sidebar - Overlay when open */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="bg-white w-64 h-full">
            <Sidebar isOpen={true} toggleSidebar={toggleSidebar} />
          </div>
        </div>
      )}

      {/* Main Container - Compresses/expands based on sidebar */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 w-full ${
          isSidebarOpen ? 'md:ml-64' : 'md:ml-0'
        }`}
      >
     <nav
   className={`bg-white shadow-xl fixed top-0 left-0 right-0 z-40 transition-all duration-300
     ${isSidebarOpen ? "ml-64" : "ml-20"}`}
 >
   <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
 </nav>
<main className="flex-1 w-full px-0 pt-16">


          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/help" element={<Help />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/course/:courseId/quiz/edit/:quizId" element={<EditQuiz />} />
            <Route path="/courses/:courseId/content/create" element={<UploadFile />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/course/:courseId/quiz" element={<QuizManagement />} />
            <Route path="/courses/:courseId/edit" element={<EditCourseForm />} />
            <Route path="/courses/:courseId/quiz/upload" element={<UploadQuiz />} />
            <Route path="/course/:courseId/quiz/:quizId" element={<SolveQuizView />} />
            <Route path="/courses/:courseId/quizzes" element={<ViewAllQuizzes />} />
            <Route path="/courses/:courseId/assignments" element={<AssignmentManagement />} />
            <Route path="/courses/:courseId/assignment" element={<StudentAssignmentView />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;