import { useNavigate } from "react-router-dom";
import { PlayIcon, AcademicCapIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import home from '../assets/home.jpg'
export default function HeroSection() {
  const navigate = useNavigate();
  
  return (
    <div className="relative bg-gray-200 min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover"
          src={home}
          alt="Students learning together"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/90 to-gray-900/70" aria-hidden="true" />
      </div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-500 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <div>
            <div className="flex items-center mb-6">
              <div className="flex items-center bg-indigo-500/10 px-4 py-2 rounded-full">
                <AcademicCapIcon className="h-5 w-5 text-indigo-400 mr-2" />
                <span className="text-indigo-300 text-sm font-medium">The future of learning is here</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Unlock Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400"> Potential</span>
            </h1>
            
            <p className="mt-6 text-xl text-gray-300 max-w-2xl">
              Transform your life through learning. Access world-class education from expert instructors, anytime and anywhere.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                onClick={() => navigate('/courses')}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-indigo-600 rounded-xl shadow-2xl hover:bg-indigo-700 transition-all duration-300 hover:shadow-indigo-700/50"
              >
                Explore Courses
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-transparent border-2 border-gray-700 rounded-xl hover:border-indigo-500 transition-all duration-300">
                <div className="flex items-center">
                  <PlayIcon className="h-5 w-5 mr-2 text-indigo-400 group-hover:text-indigo-300" />
                  Watch Video
                </div>
              </button>
            </div>
            
            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-gray-400 mt-1">Active Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">200+</div>
                <div className="text-gray-400 mt-1">Expert Instructors</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-gray-400 mt-1">Courses Available</div>
              </div>
            </div>
          </div>
          
          {/* Right column - Card/Testimonial */}
          <div className="relative">
            <div className="bg-white/5 backdrop-filter backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl">
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0">
                  <div className="inline-flex rounded-full bg-indigo-500 p-2">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <blockquote>
                    <p className="text-xl font-medium text-white">
                      "Education is the most powerful weapon which you can use to change the world."
                    </p>
                    <footer className="mt-4">
                      <div className="font-semibold text-indigo-300">Nelson Mandela</div>
                      <div className="text-gray-400">Former President of South Africa</div>
                    </footer>
                  </blockquote>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-gray-300">
                  Join thousands of students who have transformed their careers through our platform.
                </p>
                <div className="mt-6 flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <img
                      key={item}
                      className="h-10 w-10 rounded-full border-2 border-white"
                      src={`https://i.pravatar.cc/150?img=${item + 10}`}
                      alt="Student"
                    />
                  ))}
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-xs font-medium text-white border-2 border-white">
                    +999
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-600 rounded-lg rotate-12 opacity-20 z-0"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-600 rounded-full opacity-20 z-0"></div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-400 mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>
      
      {/* Custom animation styles */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}