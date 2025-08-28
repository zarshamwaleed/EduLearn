import React, { useState } from 'react';
import { DocumentTextIcon, ShieldCheckIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const PrivacyPolicy = () => {
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
      content: 'At EduLearn, we are committed to protecting the privacy of our users, including students, instructors, and administrators. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Learning Management System (LMS).'
    },
    {
      id: 'information-collected',
      title: 'Information We Collect',
      content: [
        'Personal Information: Name, email address, profile picture, and role (student or instructor) provided during registration.',
        'Course Data: Course progress, quiz results, assignments, and interactions with course content.',
        'Usage Data: IP address, browser type, device information, and activity logs (e.g., pages visited, time spent).',
        'Communication Data: Messages or feedback submitted through the platform.'
      ]
    },
    {
      id: 'information-use',
      title: 'How We Use Your Information',
      content: [
        'To provide and improve the LMS, including course delivery and user support.',
        'To personalize your learning experience, such as recommending courses or tracking progress.',
        'To communicate with you, including sending course updates or platform notifications.',
        'To ensure platform security and prevent unauthorized access.'
      ]
    },
    {
      id: 'data-sharing',
      title: 'Data Sharing',
      content: [
        'Instructors, to facilitate course management and grading.',
        'Third-party service providers (e.g., payment processors, analytics tools) under strict confidentiality agreements.',
        'Legal authorities, if required by law or to protect platform security.'
      ],
      note: 'We do not sell your personal information.'
    },
    {
      id: 'data-security',
      title: 'Data Security',
      content: 'We use industry-standard encryption and security measures to protect your data. However, no system is completely secure, and we encourage users to safeguard their account credentials.'
    },
    {
      id: 'your-rights',
      title: 'Your Rights',
      content: [
        'Access or update your personal information via the Profile page.',
        'Request deletion of your account by contacting support.',
        'Opt out of non-essential communications (e.g., promotional emails).'
      ]
    },
    {
      id: 'contact',
      title: 'Contact Us',
      content: 'For questions about this Privacy Policy, contact us at support@edulearn.com.'
    }
  ];

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto ml-34">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <ShieldCheckIcon className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            Last updated: August 26, 2025
          </p>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we protect and use your information.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-gray-600">Data Encryption</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-gray-600">Data Sold</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">24/7</div>
              <div className="text-gray-600">Security Monitoring</div>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Policy Navigation</h2>
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

        {/* Privacy Content */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8">
          {sections.map((section, index) => (
            <div key={section.id} id={section.id} className="border-b border-gray-200 last:border-b-0">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-6 py-4 text-left hover:bg-gray-50 transition duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-lg mr-4">
                      <span className="text-green-600 font-semibold">{index + 1}</span>
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
                        <span className="text-green-600 mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">{section.content}</p>
                )}
                
                {section.note && (
                  <div className="mt-4 bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-green-700 text-sm">{section.note}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Your Privacy Rights */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ShieldCheckIcon className="h-5 w-5 mr-2 text-green-600" />
            Your Privacy Rights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-medium text-gray-900 mb-2">Data Access</h4>
              <p className="text-gray-600 text-sm">View and download your personal data from your profile settings</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-medium text-gray-900 mb-2">Data Correction</h4>
              <p className="text-gray-600 text-sm">Update inaccurate information in your account settings</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-medium text-gray-900 mb-2">Data Deletion</h4>
              <p className="text-gray-600 text-sm">Request permanent deletion of your account and data</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-medium text-gray-900 mb-2">Communication Preferences</h4>
              <p className="text-gray-600 text-sm">Manage your email notification settings</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Support</h3>
          <p className="text-gray-600 mb-4">
            Our dedicated privacy team is here to help with any questions or concerns about your data:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-medium text-gray-900 mb-2">Email Support</h4>
              <a href="mailto:privacy@edulearn.com" className="text-green-600 hover:text-green-700 transition duration-200">
                privacy@edulearn.com
              </a>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-medium text-gray-900 mb-2">Response Time</h4>
              <p className="text-gray-600">Within 24 hours for privacy-related inquiries</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;