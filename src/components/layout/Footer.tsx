import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';
import Logo from '../shared/Logo';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <Logo size="small" />
              <h3 className="ml-2 text-xl font-bold text-gray-800">PillSprint</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Your trusted partner for emergency medicine delivery and healthcare needs.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-primary-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/medicines" 
                  className="text-gray-600 hover:text-primary-500 transition-colors"
                >
                  All Medicines
                </Link>
              </li>
              <li>
                <Link 
                  to="/emergency" 
                  className="text-gray-600 hover:text-primary-500 transition-colors"
                >
                  Emergency Medicines
                </Link>
              </li>
              <li>
                <Link 
                  to="/ai-assistant" 
                  className="text-gray-600 hover:text-primary-500 transition-colors"
                >
                  AI Health Assistant
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className="text-gray-600 hover:text-primary-500 transition-colors"
                >
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Help & Support</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/faq" 
                  className="text-gray-600 hover:text-primary-500 transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link 
                  to="/shipping" 
                  className="text-gray-600 hover:text-primary-500 transition-colors"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/returns" 
                  className="text-gray-600 hover:text-primary-500 transition-colors"
                >
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-gray-600 hover:text-primary-500 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-primary-500 mr-2 mt-0.5" />
                <span className="text-gray-600">support@pillsprint.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-primary-500 mr-2 mt-0.5" />
                <span className="text-gray-600">+91 98765 43210</span>
              </li>
              <li className="mt-4">
                <button className="btn-primary">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {currentYear} PillSprint. All rights reserved. | A project by <span className="font-semibold text-primary-600">Priyakshi Baruah</span>
            </p>
            <div className="flex space-x-6">
              <Link to="/terms" className="text-gray-500 text-sm hover:text-primary-500 transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-gray-500 text-sm hover:text-primary-500 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/disclaimer" className="text-gray-500 text-sm hover:text-primary-500 transition-colors">
                Medical Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;