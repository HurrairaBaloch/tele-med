import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserMd, FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';

/**
 * Footer Component
 * Site-wide footer with links and information
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                <FaUserMd className="text-white text-xl" />
              </div>
              <span className="text-xl font-bold text-white">Smart Telemedicine</span>
            </div>
            <p className="text-sm text-neutral-400">
              Connect with certified doctors anytime, anywhere. Your health, our priority.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm hover:text-primary-400 transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm hover:text-primary-400 transition-colors">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* For Patients */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Patients</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/patient/book-appointment" className="text-sm hover:text-primary-400 transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link to="/patient/prescriptions" className="text-sm hover:text-primary-400 transition-colors">
                  Prescriptions
                </Link>
              </li>
              <li>
                <Link to="/patient/records" className="text-sm hover:text-primary-400 transition-colors">
                  Medical Records
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-primary-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary-400 transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-neutral-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-neutral-400 mb-4 md:mb-0">
            © {currentYear} Smart Telemedicine. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors">
              <FaFacebook size={20} />
            </a>
            <a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors">
              <FaLinkedin size={20} />
            </a>
            <a href="#" className="text-neutral-400 hover:text-primary-400 transition-colors">
              <FaInstagram size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

