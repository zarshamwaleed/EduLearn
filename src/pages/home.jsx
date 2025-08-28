import HeroSection from '../components/HeroSection';
import { Link } from "react-router-dom";
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />

      {/* Features Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent sm:text-4xl">
            Learn from the best
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-700 mx-auto">
            Join millions of learners from around the world already learning on EduLearn.
          </p>
        </div>

        {/* Course categories */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {[
            {
              name: 'Business',
              description: 'Develop skills to advance your career',
              icon: '💼',
              color: 'from-blue-600 to-blue-500',
            },
            {
              name: 'Technology',
              description: 'Stay ahead with the latest tech skills',
              icon: '💻',
              color: 'from-green-600 to-green-500',
            },
            {
              name: 'Personal Development',
              description: 'Grow personally and professionally',
              icon: '🧠',
              color: 'from-purple-600 to-purple-500',
            },
          ].map((category) => (
            <div key={category.name} className="group">
              <div className="bg-white rounded-xl p-6 h-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-200">
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-r ${category.color} text-white text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-gray-600">{category.description}</p>
               <Link
  to="/courses"
  className="mt-4 text-indigo-600 hover:text-indigo-700 text-sm font-medium transition duration-200 flex items-center"
>
  Explore courses
  <svg
    className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-200"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gray-50 rounded-2xl p-8 border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '10K+', label: 'Active Students' },
              { number: '500+', label: 'Expert Instructors' },
              { number: '1K+', label: 'Courses Available' },
              { number: '95%', label: 'Satisfaction Rate' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-12">
            What Our Students Say
          </h3>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                text: 'EduLearn transformed my career. The courses are comprehensive and the instructors are amazing!',
                author: 'Sarah Johnson',
                role: 'Software Developer',
              },
              {
                text: "The best learning platform I've used. The interactive lessons made complex topics easy to understand.",
                author: 'Michael Chen',
                role: 'Business Analyst',
              },
              {
                text: 'As a busy professional, the flexible learning schedule was perfect for me. Highly recommended!',
                author: 'Emily Rodriguez',
                role: 'Marketing Manager',
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200"
              >
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-600 text-white font-bold">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <div className="font-semibold text-gray-900">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
                <div className="flex mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 mt-20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to start your learning journey?
          </h2>
          <p className="mt-4 text-lg text-indigo-100">
            Join thousands of students achieving their goals with our courses
          </p>
          <div className="mt-8">
           <Link to="/courses">
  <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200 shadow-lg">
    Get Started Today
  </button>
</Link>
          </div>
        </div>
      </div>
    </div>
  );
}