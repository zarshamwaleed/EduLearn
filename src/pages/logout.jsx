import { useNavigate } from "react-router-dom";
import { LockClosedIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  async function handleLogout() {
    try {
      // Clear all stored user data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('authData');
      sessionStorage.clear();
      
      // Call the auth context logout function
      await logout();
      
      console.log("Logged out successfully");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // Navigate to login page in any case
      navigate("/login");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/10 mb-4">
            <LockClosedIcon className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-3xl font-bold text-white">
            Ready to leave?
          </h2>
          <p className="mt-2 text-gray-400">
            We'll miss you! Come back soon.
          </p>
        </div>

        {/* Logout Card */}
        <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 p-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-red-500/20 p-4 rounded-full">
                <svg className="w-12 h-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-2">
              Confirm Logout
            </h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to sign out of your account?
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Go Back
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
              >
                <LockClosedIcon className="w-5 h-5 mr-2" />
                Sign Out
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <p className="text-xs text-gray-500">
                You can always sign back in anytime
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Having issues?{" "}
            <a href="#" className="text-indigo-400 hover:text-indigo-300 transition duration-200">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Logout;