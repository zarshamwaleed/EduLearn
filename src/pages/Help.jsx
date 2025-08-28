import React from 'react';
import { 
  QuestionMarkCircleIcon, 
  AcademicCapIcon,
  EnvelopeIcon,
  PhoneIcon,
  BookOpenIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const Help = () => {
  const faqs = [
    {
      question: "How do I enroll in a course?",
      answer: "Navigate to the Courses page, select a course, and click 'Enroll.' You may need to log in or sign up first."
    },
    {
      question: "How do I upload course content as an instructor?",
      answer: "Go to the Instructor Dashboard, select your course, and use the 'Upload Content' or 'Create Quiz' options."
    },
    {
      question: "How do I reset my password?",
      answer: "Click 'Forgot Password' on the Login page and follow the instructions to reset your password via email."
    },
    {
      question: "Can I access courses offline?",
      answer: "Currently, courses require an internet connection. However, you can download materials for offline viewing from the course content page."
    },
    {
      question: "How do I track my learning progress?",
      answer: "Visit your Student Dashboard to see completed courses, quiz scores, and overall progress statistics."
    }
  ];

  const tutorials = [
    {
      title: "Getting Started as a Student",
      icon: BookOpenIcon,
      link: "/tutorials/student-guide"
    },
    {
      title: "Creating Courses as an Instructor",
      icon: VideoCameraIcon,
      link: "/tutorials/instructor-guide"
    },
    {
      title: "Using the Quiz System",
      icon: QuestionMarkCircleIcon,
      link: "/tutorials/quiz-guide"
    }
  ];

  const contactMethods = [
    {
      method: "Email Support",
      details: "zarshamwaleedbutt@gmail.com",
      icon: EnvelopeIcon,
      description: "Get help via email with 24-hour response time"
    },
    {
      method: "Help Center",
      details: "Knowledge Base",
      icon: BookOpenIcon,
      description: "Browse our comprehensive documentation"
    },
    {
      method: "Community Forum",
      details: "Join Discussion",
      icon: ChatBubbleLeftRightIcon,
      description: "Connect with other students and instructors"
    }
  ];

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 pt-19 pl-64">
     <div className="max-w-7xl mx-auto ml-34 -mt-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-100 p-3 rounded-xl">
              <QuestionMarkCircleIcon className="h-10 w-10 text-indigo-600" />
            </div>
          </div>
          <div className="inline-block bg-indigo-50 rounded-lg px-6 py-3 shadow-sm">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Help & Support
            </h1>
          </div>
          <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
            Get assistance with using the EduLearn platform. We're here to help you succeed in your learning journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Quick Stats */}
          <div className="lg:col-span-3 bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">24/7</div>
                <div className="text-gray-600">Support Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">98%</div>
                <div className="text-gray-600">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600">1h</div>
                <div className="text-gray-600">Avg. Response Time</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQs Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <QuestionMarkCircleIcon className="h-6 w-6 mr-2 text-indigo-600" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tutorials Section */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mt-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <VideoCameraIcon className="h-6 w-6 mr-2 text-indigo-600" />
                Video Tutorials & Guides
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tutorials.map((tutorial, index) => {
                  const IconComponent = tutorial.icon;
                  return (
                    <a
                      key={index}
                      href={tutorial.link}
                      className="bg-white rounded-xl p-4 border border-gray-200 hover:border-indigo-500 transition duration-200 group shadow-sm"
                    >
                      <div className="flex items-center">
                        <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                          <IconComponent className="h-5 w-5 text-indigo-600" />
                        </div>
                        <span className="text-gray-900 group-hover:text-indigo-600 transition duration-200">
                          {tutorial.title}
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 sticky top-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <EnvelopeIcon className="h-6 w-6 mr-2 text-indigo-600" />
                Contact Support
              </h2>
              <div className="space-y-6">
                {contactMethods.map((method, index) => {
                  const IconComponent = method.icon;
                  return (
                    <div key={index} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <div className="flex items-center mb-2">
                        <IconComponent className="h-5 w-5 text-indigo-600 mr-2" />
                        <h3 className="font-medium text-gray-900">{method.method}</h3>
                      </div>
                      <p className="text-indigo-600 font-semibold">{method.details}</p>
                      <p className="text-gray-600 text-sm mt-1">{method.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* Emergency Support */}
              <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-xl">
                <h3 className="font-medium text-red-700 mb-2">Urgent Support</h3>
                <p className="text-gray-600 text-sm">
                  For critical issues affecting your learning experience, call our emergency support line:
                </p>
                <div className="flex items-center mt-2">
                  <PhoneIcon className="h-4 w-4 text-red-600 mr-2" />
                  <span className="text-gray-900">+92 (304) 2825000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-12 bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Additional Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-indigo-100 p-4 rounded-xl inline-flex mb-3">
                <BookOpenIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Documentation</h3>
              <p className="text-gray-600 text-sm">Comprehensive guides and manuals</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-xl inline-flex mb-3">
                <AcademicCapIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600 text-sm">Connect with other learners</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-xl inline-flex mb-3">
                <VideoCameraIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Webinars</h3>
              <p className="text-gray-600 text-sm">Live training sessions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;