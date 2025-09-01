import { LockClosedIcon, EnvelopeIcon, EyeIcon, EyeSlashIcon, UserIcon, PhoneIcon, CameraIcon } from '@heroicons/react/24/outline';
import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    profilePic: null,
    bio: '',
    role: ''
  });
  const [registerErrors, setRegisterErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleRegisterChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      setRegisterForm(prev => ({
        ...prev,
        [name]: file
      }));

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setRegisterForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateRegisterForm = () => {
    const errors = {};

    if (!registerForm.name) errors.name = 'Name is required';
    if (!registerForm.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
      errors.email = 'Email is invalid';
    }
    if (!registerForm.password) {
      errors.password = 'Password is required';
    } else if (registerForm.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!registerForm.role) {
      errors.role = 'Please select a role';
    }

    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

const handleRegisterSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  if (validateRegisterForm()) {
    const formData = new FormData();
    formData.append("name", registerForm.name);
    formData.append("email", registerForm.email);
    formData.append("phone", registerForm.phone);
    formData.append("password", registerForm.password);
    formData.append("confirmPassword", registerForm.confirmPassword);
    formData.append("role", registerForm.role);
    formData.append("bio", registerForm.bio);

    if (registerForm.profilePic) {
      formData.append("profilePic", registerForm.profilePic);
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        body: formData, // <-- FormData directly, no JSON
      });

      const result = await response.json();

      if (response.ok) {
        alert('Registration successful!');
        setRegisterForm({
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          profilePic: null,
          bio: '',
          role: ''
        });
        setImagePreview(null);
        navigate('/login');
      } else {
        alert(result.message || 'Error registering user');
      }
    } catch (error) {
      alert('There was an error connecting to the server');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  } else {
    setIsLoading(false);
  }
};



  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-600 p-3 rounded-xl">
              <UserIcon className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Create Your Account
          </h2>
          <p className="mt-2 text-gray-600">
            Join thousands of learners worldwide
          </p>
        </div>

        {/* Signup Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Profile Picture Upload */}
            <div className="text-center mb-4">
              <div className="relative inline-block">
                <div 
                  className="h-20 w-20 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center cursor-pointer hover:border-indigo-500 transition duration-200"
                  onClick={triggerFileInput}
                >
                  {imagePreview ? (
                 <img
  src={imagePreview || "/default-profile-pic.jpg"}
  alt="Profile preview"
  className="h-full w-full rounded-full object-cover"
  onError={(e) => {
    e.currentTarget.src = "/default-profile-pic.jpg";
  }}
/>

                  ) : (
                    <CameraIcon className="h-8 w-8 text-gray-500" />
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  id="profilePic"
                  name="profilePic"
                  type="file"
                  accept="image/*"
                  onChange={handleRegisterChange}
                  className="hidden"
                />
                <label 
                  htmlFor="profilePic" 
                  className="absolute bottom-0 right-0 bg-indigo-600 p-1 rounded-full cursor-pointer hover:bg-indigo-700 transition duration-200"
                >
                  <CameraIcon className="h-4 w-4 text-white" />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">Click to upload profile picture</p>
            </div>

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={registerForm.name}
                  onChange={handleRegisterChange}
                  className={`w-full bg-gray-50 border ${registerErrors.name ? 'border-red-500' : 'border-gray-300'} text-gray-900 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200`}
                  placeholder="Enter your full name"
                />
              </div>
              {registerErrors.name && <p className="mt-1 text-sm text-red-400">{registerErrors.name}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  className={`w-full bg-gray-50 border ${registerErrors.email ? 'border-red-500' : 'border-gray-300'} text-gray-900 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200`}
                  placeholder="email@example.com"
                />
              </div>
              {registerErrors.email && <p className="mt-1 text-sm text-red-400">{registerErrors.email}</p>}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={registerForm.phone}
                  onChange={handleRegisterChange}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            {/* Bio Field */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={registerForm.bio}
                onChange={handleRegisterChange}
                rows={3}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  className={`w-full bg-gray-50 border ${registerErrors.password ? 'border-red-500' : 'border-gray-300'} text-gray-900 rounded-lg pl-10 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500 transition duration-200" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500 transition duration-200" />
                  )}
                </button>
              </div>
              {registerErrors.password && <p className="mt-1 text-sm text-red-400">{registerErrors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                  className={`w-full bg-gray-50 border ${registerErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} text-gray-900 rounded-lg pl-10 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-500 transition duration-200" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500 transition duration-200" />
                  )}
                </button>
              </div>
              {registerErrors.confirmPassword && <p className="mt-1 text-sm text-red-400">{registerErrors.confirmPassword}</p>}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition duration-200 ${
                  registerForm.role === "student" 
                    ? "border-indigo-500 bg-indigo-500/10" 
                    : "border-gray-300 bg-gray-50 hover:border-gray-400"
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    onChange={handleRegisterChange}
                    checked={registerForm.role === "student"}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">Student</span>
                </label>
                <label className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition duration-200 ${
                  registerForm.role === "instructor" 
                    ? "border-indigo-500 bg-indigo-500/10" 
                    : "border-gray-300 bg-gray-50 hover:border-gray-400"
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="instructor"
                    onChange={handleRegisterChange}
                    checked={registerForm.role === "instructor"}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-900">Instructor</span>
                </label>
              </div>
              {registerErrors.role && <p className="mt-1 text-sm text-red-400">{registerErrors.role}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium transition duration-200 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-500 transition duration-200">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-500 transition duration-200">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}