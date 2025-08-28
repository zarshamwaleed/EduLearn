import React from "react";
import {
  AcademicCapIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

function Footer() {
  const { user } = useAuth();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${
          user ? "pt-6 pb-12" : "py-12"
        }`} // Adjust padding based on login status
      >
        {/* Show full footer only if user is not logged in */}
        {!user && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-4">
                <AcademicCapIcon className="h-8 w-8 text-indigo-500 mr-2" />
                <span className="text-xl font-bold">EduLearn</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering educators and students through innovative learning
                platforms.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/share/19yEoeDv1h/?mibextid=wwXIfr"
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="https://wa.me/923042825000?text=Hello%20I%20just%20visited%20your%20LMS%20website%20portfolio.%20I%20am%20interested%20in%20learning%20more%20about%20your%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-500 transition-colors"
                >
                  <span className="sr-only">WhatsApp</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.52 3.48A11.93 11.93 0 0012 0C5.37 0 0 5.37 0 12c0 2.12.55 4.19 1.61 6.02L0 24l6.21-1.63A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.21-3.48-8.52zM12 22c-1.94 0-3.84-.52-5.49-1.52l-.39-.23-3.69.97.99-3.6-.25-.37A9.94 9.94 0 012 12c0-5.52 4.48-10 10-10 2.67 0 5.18 1.04 7.07 2.93A9.94 9.94 0 0122 12c0 5.52-4.48 10-10 10zm5.07-7.61c-.28-.14-1.66-.82-1.91-.91-.26-.09-.45-.14-.64.14s-.74.91-.91 1.1c-.17.18-.34.2-.62.07-.28-.14-1.18-.44-2.25-1.41-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.12-.12.28-.34.42-.51.14-.17.19-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.64-1.55-.88-2.12-.23-.55-.47-.47-.64-.48-.16-.01-.34-.01-.52-.01s-.48.07-.74.34c-.26.28-1 1-1 2.43s1.02 2.82 1.16 3.01c.14.18 2.01 3.06 4.87 4.29.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.12.55-.08 1.66-.68 1.89-1.34.23-.66.23-1.23.16-1.34-.07-.11-.25-.18-.52-.32z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/zarshambutt?igsh=MTRzNGw4NXRteXUxeA%3D%3D&utm_source=qr"
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com/in/zarsham-waleed-8376bb35b/"
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="text-base text-gray-400 hover:text-white transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/courses"
                    className="text-base text-gray-400 hover:text-white transition-colors"
                  >
                    Courses
                  </a>
                </li>
                <li>
                  <a
                    href="/about"
                    className="text-base text-gray-400 hover:text-white transition-colors"
                  >
                    About
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Support
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/help"
                    className="text-base text-gray-400 hover:text-white transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy-policy"
                    className="text-base text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms-and-conditions"
                    className="text-base text-gray-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
                Contact Us
              </h3>
              <ul className="space-y-3">
                <li className="flex">
                  <PhoneIcon className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
                  <span className="text-base text-gray-400">
                    +92 (304) 2825000
                  </span>
                </li>
                <li className="flex">
                  <EnvelopeIcon className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
                  <span className="text-base text-gray-400">
                    zarshamwaleedbutt@gmail.com
                  </span>
                </li>
                <li className="flex">
                  <GlobeAltIcon className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
                  <a
                    href="https://portfolio-frontend-alpha-livid.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-gray-400 hover:text-indigo-500"
                  >
                    My-Portfolio
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Copyright Section (always shown) */}
        <div className={`${user ? "mt-0" : "mt-8"} pt-8 border-t border-gray-700`}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-base text-gray-400">
              &copy; 2025 EduLearn. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <span className="text-gray-400 mr-4">Made with</span>
              <span className="text-red-500">❤️</span>
              <span className="text-gray-400 ml-4">for educators and learners</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;