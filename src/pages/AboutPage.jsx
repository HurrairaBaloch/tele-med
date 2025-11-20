import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  FaUserMd,
  FaHeartbeat,
  FaShieldAlt,
  FaUsers,
  FaGlobe,
  FaClock,
  FaStethoscope,
  FaAward,
  FaMobileAlt,
  FaVideo,
  FaLock
} from 'react-icons/fa';

const AboutPage = () => {
  const values = [
    {
      icon: <FaHeartbeat className="text-4xl text-primary-500" />,
      title: 'Patient-Centered Care',
      description: 'We prioritize patient well-being and satisfaction in every decision we make, ensuring the best possible healthcare experience.'
    },
    {
      icon: <FaShieldAlt className="text-4xl text-secondary-500" />,
      title: 'Privacy & Security',
      description: 'HIPAA-compliant platform with end-to-end encryption to protect your sensitive health information.'
    },
    {
      icon: <FaUsers className="text-4xl text-accent-500" />,
      title: 'Accessibility',
      description: 'Breaking down barriers to healthcare access, making quality medical care available to everyone regardless of location.'
    },
    {
      icon: <FaAward className="text-4xl text-primary-500" />,
      title: 'Excellence',
      description: 'Committed to maintaining the highest standards of medical practice and platform quality.'
    }
  ];

  const features = [
    {
      icon: <FaUserMd className="text-3xl text-primary-500" />,
      title: 'Expert Doctors',
      description: '500+ board-certified doctors across various specializations'
    },
    {
      icon: <FaVideo className="text-3xl text-secondary-500" />,
      title: 'Video Consultations',
      description: 'High-quality, secure video calls for face-to-face consultations'
    },
    {
      icon: <FaMobileAlt className="text-3xl text-accent-500" />,
      title: 'Mobile Access',
      description: 'Access healthcare services from any device, anywhere'
    },
    {
      icon: <FaClock className="text-3xl text-primary-500" />,
      title: '24/7 Availability',
      description: 'Round-the-clock access to healthcare professionals'
    },
    {
      icon: <FaStethoscope className="text-3xl text-secondary-500" />,
      title: 'Multiple Specialties',
      description: 'Comprehensive range of medical specialties available'
    },
    {
      icon: <FaLock className="text-3xl text-accent-500" />,
      title: 'Secure Records',
      description: 'Digital health records management with top-tier security'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Patients', icon: <FaUsers /> },
    { number: '500+', label: 'Expert Doctors', icon: <FaUserMd /> },
    { number: '50,000+', label: 'Consultations', icon: <FaVideo /> },
    { number: '4.9/5', label: 'Average Rating', icon: <FaAward /> }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-16 md:py-24">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
              About Smart Telemedicine
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 leading-relaxed">
              Revolutionizing healthcare access through innovative telemedicine technology
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-full h-64 md:h-96 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
                <FaUserMd className="text-white text-8xl md:text-9xl opacity-50" />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">Our Mission</h2>
              <p className="text-lg text-neutral-700 mb-4 leading-relaxed">
                Smart Telemedicine is a revolutionary healthcare platform that connects patients with certified doctors through secure video consultations. We believe that quality healthcare should be accessible to everyone, regardless of their location or circumstances.
              </p>
              <p className="text-lg text-neutral-700 mb-4 leading-relaxed">
                Our mission is to make quality healthcare accessible to everyone, anywhere, anytime. We're breaking down traditional barriers to healthcare access by leveraging cutting-edge technology to bring doctors and patients together.
              </p>
              <p className="text-lg text-neutral-700 leading-relaxed">
                We're committed to providing a seamless, secure, and user-friendly platform that empowers patients to take control of their health while enabling healthcare professionals to deliver exceptional care.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-gradient-to-b from-neutral-50 to-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card text-center hover:shadow-xl transition-all duration-300"
              >
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">{value.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Platform Features</h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Comprehensive healthcare solutions designed for modern living
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary-500"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">{feature.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Trusted by thousands of patients and healthcare professionals
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <div className="flex justify-center mb-3 text-white text-3xl">
                  {stat.icon}
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</h3>
                <p className="text-white/90 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">Why Choose Us?</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2 flex items-center">
                    <FaGlobe className="text-primary-500 mr-3" />
                    Global Reach, Local Care
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Connect with specialists from around the world while receiving personalized, compassionate care that feels local.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2 flex items-center">
                    <FaShieldAlt className="text-secondary-500 mr-3" />
                    HIPAA Compliant
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    Your health data is protected with industry-leading security measures and full HIPAA compliance.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2 flex items-center">
                    <FaAward className="text-accent-500 mr-3" />
                    Verified Professionals
                  </h3>
                  <p className="text-neutral-600 leading-relaxed">
                    All doctors are thoroughly vetted, licensed, and board-certified to ensure the highest quality of care.
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-full h-64 md:h-96 bg-gradient-to-br from-secondary-500 to-accent-500 rounded-2xl flex items-center justify-center">
                <FaHeartbeat className="text-white text-8xl md:text-9xl opacity-50" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="section-padding bg-gradient-to-b from-neutral-50 to-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6">Our Vision</h2>
            <p className="text-lg md:text-xl text-neutral-700 leading-relaxed mb-6">
              We envision a world where geographical boundaries, time constraints, and accessibility challenges no longer prevent anyone from receiving excellent healthcare. Through continuous innovation and a patient-first approach, we're building the future of healthcare delivery.
            </p>
            <p className="text-lg md:text-xl text-neutral-700 leading-relaxed">
              Our platform is constantly evolving to incorporate the latest medical technologies, improve user experience, and expand our network of healthcare professionals. We're committed to making telemedicine the primary choice for accessible, quality healthcare.
            </p>
          </motion.div>
      </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;

