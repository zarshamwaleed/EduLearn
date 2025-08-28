import React, { useState } from 'react';
import { DocumentTextIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const TermsAndConditions = () => {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      content: 'Welcome to EduLearn. By using our Learning Management System (LMS), you agree to these Terms and Conditions, which govern your access to and use of the platform.'
    },
    {
      id: 'user-responsibilities',
      title: 'User Responsibilities',
      content: [
        'Account Security: Keep your login credentials confidential and notify us of any unauthorized access.',
        'Content Submission: Ensure all content (e.g., assignments, quizzes) you submit is original and complies with academic integrity policies.',
        'Conduct: Do not engage in harassment, cheating, or misuse of platform features.'
      ]
    },
    {
      id: 'content-ownership',
      title: 'Content Ownership',
      content: [
        'User Content: You retain ownership of content you submit (e.g., assignments), but grant EduLearn a non-exclusive license to use it for educational purposes.',
        'Instructor Content: Instructors retain ownership of course materials, but agree to share them with enrolled students via the platform.',
        'EduLearn Content: All platform content (e.g., UI, templates) is owned by EduLearn and may not be reproduced without permission.'
      ]
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable Use',
      content: [
        'Use the platform for illegal activities.',
        'Distribute malicious content (e.g., viruses, spam).',
        'Attempt to bypass platform security or access unauthorized data.'
      ]
    },
    {
      id: 'termination',
      title: 'Termination',
      content: 'We may suspend or terminate your account for violating these terms, with or without notice. Upon termination, you will lose access to courses and content.'
    },
    {
      id: 'contact',
      title: 'Contact Us',
      content: 'For questions about these Terms and Conditions, contact us at support@edulearn.com.'
    }
  ];

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto ml-34">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-100 p-3 rounded-xl">
              <DocumentTextIcon className="h-10 w-10 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Terms & Conditions
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            Last updated: August 26, 2025
          </p>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before using our Learning Management System
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h2>
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm transition duration-200"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>

        {/* Terms Content */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {sections.map((section, index) => (
            <div key={section.id} id={section.id} className="border-b border-gray-200 last:border-b-0">
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
                {Array.isArray(section.content) ? (
                  <ul className="text-gray-600 space-y-2">
                    {section.content.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-indigo-600 mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">{section.content}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Acceptance Section */}
        <div className="mt-8 bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acceptance of Terms</h3>
          <p className="text-gray-600 mb-4">
            By using EduLearn, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
          </p>
          <div className="flex items-center bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="bg-green-100 p-2 rounded-lg mr-4">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-green-700 text-sm">
              Your continued use of the platform constitutes acceptance of these terms
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you have any questions about these Terms and Conditions, please contact us:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-medium text-gray-900 mb-2">Email Support</h4>
              <a href="mailto:support@edulearn.com" className="text-indigo-600 hover:text-indigo-700 transition duration-200">
                support@edulearn.com
              </a>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-medium text-gray-900 mb-2">Response Time</h4>
              <p className="text-gray-600">Typically within 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;