import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaUserMd, 
  FaCalendarCheck, 
  FaVideo, 
  FaPrescriptionBottleAlt,
  FaShieldAlt,
  FaClock,
  FaGlobe,
  FaStar
} from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/**
 * Landing Page
 * Main homepage with hero section, features, and call-to-action
 */
const LandingPage = () => {
  const features = [
    {
      icon: <FaUserMd className="text-4xl text-primary-500" />,
      title: 'Expert Doctors',
      description: 'Connect with certified and experienced doctors across various specializations'
    },
    {
      icon: <FaCalendarCheck className="text-4xl text-primary-500" />,
      title: 'Easy Scheduling',
      description: 'Book appointments instantly with real-time availability checking'
    },
    {
      icon: <FaVideo className="text-4xl text-primary-500" />,
      title: 'Video Consultations',
      description: 'High-quality video calls for face-to-face consultations from anywhere'
    },
    {
      icon: <FaPrescriptionBottleAlt className="text-4xl text-primary-500" />,
      title: 'Digital Prescriptions',
      description: 'Receive and manage your prescriptions digitally with ease'
    },
    {
      icon: <FaShieldAlt className="text-4xl text-primary-500" />,
      title: 'Secure & Private',
      description: 'Your health data is encrypted and protected with industry-standard security'
    },
    {
      icon: <FaClock className="text-4xl text-primary-500" />,
      title: '24/7 Availability',
      description: 'Access healthcare services anytime, day or night'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Patients' },
    { number: '500+', label: 'Expert Doctors' },
    { number: '50,000+', label: 'Consultations' },
    { number: '4.9/5', label: 'Average Rating' }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Patient',
      rating: 5,
      comment: 'Amazing service! I was able to consult with a specialist within minutes. Highly recommended!'
    },
    {
      name: 'Michael Chen',
      role: 'Patient',
      rating: 5,
      comment: 'The video quality is excellent and the doctors are very professional. Great platform!'
    },
    {
      name: 'Emily Davis',
      role: 'Patient',
      rating: 5,
      comment: 'So convenient! No more waiting rooms. I can see my doctor from the comfort of my home.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="gradient-bg text-white section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Your Health,
                <br />
                <span className="text-accent-200">Anytime, Anywhere</span>
              </h1>
              <p className="text-xl mb-8 text-white/90">
                Connect with certified doctors online for instant consultations. 
                Book appointments, get prescriptions, and manage your health records all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-neutral-100 transition-all duration-300 text-center shadow-lg">
                  Get Started Free
                </Link>
                <Link to="/about" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300 text-center">
                  Learn More
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl transform rotate-6"></div>
                <div className="relative bg-white/20 backdrop-blur-lg rounded-3xl p-8 border border-white/30">
                  <div className="grid grid-cols-2 gap-4">
                    {features.slice(0, 4).map((feature, index) => (
                      <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                        <div className="flex justify-center mb-2">{feature.icon}</div>
                        <h3 className="font-semibold text-sm">{feature.title}</h3>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-neutral-50 py-12">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <h3 className="text-4xl font-bold text-primary-600 mb-2">{stat.number}</h3>
                <p className="text-neutral-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">Why Choose Us?</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Experience healthcare reimagined with our comprehensive telemedicine platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card hover:scale-105 transition-transform duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">{feature.title}</h3>
                <p className="text-neutral-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-neutral-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">How It Works</h2>
            <p className="text-xl text-neutral-600">Get started in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Create Account', description: 'Sign up in minutes with your basic information' },
              { step: '2', title: 'Find a Doctor', description: 'Search and select from our network of certified doctors' },
              { step: '3', title: 'Start Consultation', description: 'Book an appointment and connect via video call' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold text-neutral-900 mb-2">{item.title}</h3>
                <p className="text-neutral-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4">What Our Patients Say</h2>
            <p className="text-xl text-neutral-600">Real experiences from real people</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-warning" />
                  ))}
                </div>
                <p className="text-neutral-700 mb-4 italic">"{testimonial.comment}"</p>
                <div>
                  <p className="font-semibold text-neutral-900">{testimonial.name}</p>
                  <p className="text-sm text-neutral-500">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gradient-bg text-white py-20">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of patients who trust us with their healthcare needs
          </p>
          <Link to="/register" className="bg-white text-primary-600 px-10 py-4 rounded-lg font-semibold hover:bg-neutral-100 transition-all duration-300 inline-block shadow-lg">
            Create Free Account
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;

