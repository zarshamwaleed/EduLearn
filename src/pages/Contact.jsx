import React, { useState } from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, QuestionMarkCircleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const Contact = () => {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const faqSections = [
    {
      id: 'general-inquiries',
      title: 'How do I get started with EduLearn?',
      content: 'To get started, create an account on our platform by visiting the Sign Up page. Once registered, you can explore available courses and enroll as a student or create courses as an instructor.'
    },
    {
      id: 'course-access',
      title: 'How can I access my enrolled courses?',
      content: 'After logging in, navigate to the Courses page from the sidebar to view your enrolled courses. Click on a course to continue your learning journey.'
    },
    {
      id: 'technical-support',
      title: 'What should I do if I encounter technical issues?',
      content: 'For technical issues, try refreshing the page or clearing your browser cache. If the problem persists, reach out to our support team via the contact details provided below.'
    },
    {
      id: 'account-management',
      title: 'How do I update my profile or account settings?',
      content: 'Visit the Profile or Settings page from the sidebar to update your personal information, change your password, or manage notification preferences.'
    }
  ];

  const navLinks = [
    { path: '/about', label: 'About Us' },
    { path: '/privacy-policy', label: 'Privacy Policy' },
    { path: '/terms-and-conditions', label: 'Terms & Conditions' },
    { path: '/help', label: 'Help Center' }
  ];

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 pt-19 pl-64 ">
     <div className="max-w-7xl mx-auto ml-34 -mt-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-100 p-3 rounded-xl">
              <EnvelopeIcon className="h-10 w-10 text-indigo-600" />
            </div>
          </div>
          <div className="inline-block bg-indigo-50 rounded-lg px-6 py-3 shadow-sm">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Contact Us
            </h1>
          </div>
          <p className="mt-4 text-lg text-gray-700">
            We're here to help with any questions or inquiries
          </p>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Reach out to our team for support, feedback, or general inquiries about EduLearn.
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Explore More</h2>
          <div className="flex flex-wrap gap-2">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm transition duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
       <div className="bg-white rounded-lg p-4 shadow-sm">
  <div className="flex items-center mb-2">
    <EnvelopeIcon className="h-5 w-5 text-indigo-600 mr-2" />
    <h4 className="font-medium text-gray-900">Email</h4>
  </div>
  <a
    href="mailto:zarshamwaleedbutt@gmail.com"
    className="text-indigo-600 hover:text-indigo-700 transition duration-200"
  >
    zarshamwaleedbutt@gmail.com
  </a>
</div>
<div className="bg-white rounded-lg p-4 shadow-sm">
  <div className="flex items-center mb-2">
    <PhoneIcon className="h-5 w-5 text-indigo-600 mr-2" />
    <h4 className="font-medium text-gray-900">Phone</h4>
  </div>
  <a
    href="tel:03042825000"
    className="text-indigo-600 hover:text-indigo-700 transition duration-200"
  >
    0304 2825000
  </a>
</div>

            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center mb-2">
                <MapPinIcon className="h-5 w-5 text-indigo-600 mr-2" />
                <h4 className="font-medium text-gray-900">Address</h4>
              </div>
              <p className="text-gray-600">Pakistan</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8">
          <h2 className="text-lg font-semibold text-gray-900 px-6 py-4">Frequently Asked Questions</h2>
          {faqSections.map((section, index) => (
            <div key={section.id} id={section.id} className="border-t border-gray-200">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 transition duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 p-2 rounded-lg mr-4">
                      <span className="text-indigo-600 font-semibold">{index + 1}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                  </div>
                  {openSections[section.id] ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-600" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-600" />
                  )}
                </div>
              </button>
              
              <div className={`px-6 pb-4 ${openSections[section.id] ? 'block' : 'hidden'}`}>
                <p className="text-gray-600">{section.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Support Note */}
        <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg mr-4">
              <QuestionMarkCircleIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Need More Help?</h3>
              <p className="text-gray-600 mt-1">
                Our support team is available to assist you with any additional questions. Reach out via email or phone for personalized support.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;