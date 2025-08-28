import aboutImage from '../assets/about.avif'
import { useNavigate } from 'react-router-dom'
import { 
  AcademicCapIcon, 
  ClockIcon, 
  BriefcaseIcon, 
  CheckCircleIcon,
  UserGroupIcon,
  StarIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline'

const About = () => {
  const navigate = useNavigate()

  const handleStartLearning = () => {
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white -mt-12 ml-20 mr-4">
      {/* Header Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">EduLearn</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We're on a mission to make quality education accessible to everyone, everywhere. 
              Join millions of learners who have transformed their lives through our platform.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="relative">
                <img 
                  src={aboutImage} 
                  alt="People learning together" 
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                />
                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 w-3/4">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                      <UserGroupIcon className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">10M+</h3>
                      <p className="text-gray-600">Lifelong learners</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Transform Your Life Through Learning
              </h2>
              
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Welcome to <span className="font-semibold text-indigo-600">EduLearn</span>, where we believe 
                that education has the power to change lives. Our mission is to provide 
                world-class learning experiences to anyone, anywhere.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-3 rounded-xl mr-6 flex-shrink-0">
                    <AcademicCapIcon className="h-8 w-8 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Instructors</h3>
                    <p className="text-gray-600">Learn from industry professionals and academic experts with real-world experience</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-100 p-3 rounded-xl mr-6 flex-shrink-0">
                    <ClockIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Learning</h3>
                    <p className="text-gray-600">Study at your own pace with 24/7 access to all course materials</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-xl mr-6 flex-shrink-0">
                    <BriefcaseIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Career Advancement</h3>
                    <p className="text-gray-600">Gain in-demand skills and certifications that employers value</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleStartLearning}
                className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-10 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center"
              >
                Start Learning Today
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900 text-white -mr-4">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 " >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Impact in Numbers</h2>
            <p className="text-xl text-gray-300">
              Join over 10 million learners worldwide who have transformed their careers and lives through our platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-lg text-center">
              <div className="bg-indigo-500/20 p-4 rounded-xl inline-flex items-center justify-center mb-6">
                <div className="text-4xl font-bold text-white">98%</div>
              </div>
              <h3 className="text-2xl font-semibold mb-2">Career Improvement</h3>
              <p className="text-gray-300">of learners report career benefits</p>
            </div>
            
            <div className="bg-white/10 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-lg text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon key={star} className="h-8 w-8 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-2">Student Satisfaction</h3>
              <p className="text-gray-300">4.8/5 average course rating</p>
            </div>
            
            <div className="bg-white/10 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-lg text-center">
              <div className="bg-purple-500/20 p-4 rounded-xl inline-flex items-center justify-center mb-6">
                <BookOpenIcon className="h-8 w-8 text-white mr-3" />
                <div className="text-4xl font-bold text-white">5000+</div>
              </div>
              <h3 className="text-2xl font-semibold mb-2">Courses Available</h3>
              <p className="text-gray-300">across various disciplines</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Core Values</h2>
            <p className="text-xl text-gray-600">
              These principles guide everything we do at EduLearn
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-indigo-100 p-3 rounded-xl inline-flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Accessibility</h3>
              <p className="text-gray-600">We believe quality education should be accessible to everyone, regardless of background or location.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-purple-100 p-3 rounded-xl inline-flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-600">We continuously evolve our platform to incorporate the latest learning technologies and methodologies.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-blue-100 p-3 rounded-xl inline-flex items-center justify-center mb-6">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community</h3>
              <p className="text-gray-600">We foster a supportive learning community where students and instructors connect and grow together.</p>
            </div>
          </div>
        </div>
      </section>

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
};

export default About;