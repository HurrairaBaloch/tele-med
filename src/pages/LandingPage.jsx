import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import {
  FaUserMd,
  FaCalendarCheck,
  FaVideo,
  FaPrescriptionBottleAlt,
  FaShieldAlt,
  FaClock,
  FaGlobe,
  FaStar,
  FaHeartbeat,
  FaStethoscope,
  FaAmbulance,
  FaHospital,
  FaMobileAlt,
  FaCheckCircle,
  FaArrowRight,
  FaQuoteLeft,
  FaPlay
} from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';


const CountUp = ({ end, suffix = '', duration = 3.5, decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      let currentCount = easeOutQuart * end;
      
      // Round based on decimals
      if (decimals === 0) {
        currentCount = Math.floor(currentCount);
      } else {
        currentCount = Math.round(currentCount * Math.pow(10, decimals)) / Math.pow(10, decimals);
      }
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration, decimals]);

  const formatNumber = (num) => {
    if (decimals > 0) {
      return num.toFixed(decimals);
    }
    return num.toLocaleString();
  };

  return (
    <span ref={ref}>
      {formatNumber(count)}{suffix}
    </span>
  );
};

/**
 * Enhanced Landing Page
 * Modern homepage with hero carousel, features, testimonials, and comprehensive content
 */
const LandingPage = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useAuth();

  // Redirect authenticated users to their dashboard (except unapproved doctors)
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      // Allow unapproved doctors to stay on home page
      if (user.role === 'doctor' && !user.isApproved) {
        return; // Don't redirect unapproved doctors
      }
      
      const redirectPath = user.role === 'patient' 
        ? '/patient/dashboard' 
        : user.role === 'doctor' 
        ? '/doctor/dashboard' 
        : user.role === 'admin' 
        ? '/admin/dashboard' 
        : null;
      
      if (redirectPath) {
        navigate(redirectPath, { replace: true });
      }
    }
  }, [isAuthenticated, user, loading, navigate]);

  /**
   * Hero carousel slides with medical imagery themes
   */
  const heroSlides = [
    {
      title: 'Your Health, Anytime, Anywhere',
      subtitle: 'Connect with certified doctors online for instant consultations',
      gradient: 'from-primary-600 via-primary-500 to-secondary-500',
      image: '🏥'
    },
    {
      title: 'Expert Medical Care at Your Fingertips',
      subtitle: 'Book appointments, get prescriptions, and manage health records',
      gradient: 'from-secondary-500 via-primary-500 to-accent-400',
      image: '👨‍⚕️'
    },
    {
      title: 'Video Consultations Made Easy',
      subtitle: 'Face-to-face consultations from the comfort of your home',
      gradient: 'from-accent-500 via-secondary-500 to-primary-600',
      image: '💻'
    },
    {
      title: '24/7 Healthcare Support',
      subtitle: 'Access medical professionals anytime, day or night',
      gradient: 'from-primary-700 via-secondary-600 to-accent-500',
      image: '🌙'
    }
  ];

  const features = [
    {
      icon: <FaUserMd className="text-4xl text-primary-500" />,
      title: 'Expert Doctors',
      description: 'Connect with certified and experienced doctors across various specializations',
      color: 'bg-primary-50'
    },
    {
      icon: <FaCalendarCheck className="text-4xl text-secondary-500" />,
      title: 'Easy Scheduling',
      description: 'Book appointments instantly with real-time availability checking',
      color: 'bg-secondary-50'
    },
    {
      icon: <FaVideo className="text-4xl text-accent-500" />,
      title: 'Video Consultations',
      description: 'High-quality video calls for face-to-face consultations from anywhere',
      color: 'bg-accent-50'
    },
    {
      icon: <FaPrescriptionBottleAlt className="text-4xl text-primary-500" />,
      title: 'Digital Prescriptions',
      description: 'Receive and manage your prescriptions digitally with ease',
      color: 'bg-primary-50'
    },
    {
      icon: <FaShieldAlt className="text-4xl text-secondary-500" />,
      title: 'Secure & Private',
      description: 'Your health data is encrypted and protected with industry-standard security',
      color: 'bg-secondary-50'
    },
    {
      icon: <FaClock className="text-4xl text-accent-500" />,
      title: '24/7 Availability',
      description: 'Access healthcare services anytime, day or night',
      color: 'bg-accent-50'
    },
    {
      icon: <FaMobileAlt className="text-4xl text-primary-500" />,
      title: 'Mobile Friendly',
      description: 'Access from any device - desktop, tablet, or smartphone',
      color: 'bg-primary-50'
    },
    {
      icon: <FaHeartbeat className="text-4xl text-secondary-500" />,
      title: 'Health Records',
      description: 'Store and manage all your medical records in one secure place',
      color: 'bg-secondary-50'
    },
    {
      icon: <FaStethoscope className="text-4xl text-accent-500" />,
      title: 'Multiple Specialties',
      description: 'Access specialists in cardiology, dermatology, pediatrics, and more',
      color: 'bg-accent-50'
    }
  ];

  const stats = [
    { number: 10000, suffix: '+', label: 'Happy Patients', icon: <FaUserMd />, decimals: 0 },
    { number: 500, suffix: '+', label: 'Expert Doctors', icon: <FaStethoscope />, decimals: 0 },
    { number: 50000, suffix: '+', label: 'Consultations', icon: <FaVideo />, decimals: 0 },
    { number: 4.9, suffix: '/5', label: 'Average Rating', icon: <FaStar />, decimals: 1 }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Patient',
      location: 'New York, USA',
      rating: 5,
      comment: 'Amazing service! I was able to consult with a specialist within minutes. The video quality was crystal clear and the doctor was very professional. Highly recommended!',
      avatar: 'SJ'
    },
    {
      name: 'Michael Chen',
      role: 'Patient',
      location: 'Los Angeles, USA',
      rating: 5,
      comment: 'The video quality is excellent and the doctors are very professional. I love how easy it is to book appointments and access my medical records. Great platform!',
      avatar: 'MC'
    },
    {
      name: 'Emily Davis',
      role: 'Patient',
      location: 'Chicago, USA',
      rating: 5,
      comment: 'So convenient! No more waiting rooms or long drives to the clinic. I can see my doctor from the comfort of my home. This is the future of healthcare!',
      avatar: 'ED'
    },
    {
      name: 'Dr. Robert Smith',
      role: 'Cardiologist',
      location: 'Boston, USA',
      rating: 5,
      comment: 'As a doctor, this platform makes it so much easier to manage my appointments and connect with patients. The interface is intuitive and professional.',
      avatar: 'RS'
    },
    {
      name: 'Jennifer Martinez',
      role: 'Patient',
      location: 'Miami, USA',
      rating: 5,
      comment: 'I was skeptical at first, but the experience exceeded my expectations. The prescription delivery and follow-up care are exceptional!',
      avatar: 'JM'
    },
    {
      name: 'David Wilson',
      role: 'Patient',
      location: 'Seattle, USA',
      rating: 5,
      comment: 'Perfect for busy professionals like me. I can schedule appointments during my lunch break and get the care I need without disrupting my day.',
      avatar: 'DW'
    }
  ];

  const specialties = [
    { name: 'Cardiology', icon: <FaHeartbeat />, count: '50+ Doctors' },
    { name: 'Dermatology', icon: <FaUserMd />, count: '40+ Doctors' },
    { name: 'Pediatrics', icon: <FaStethoscope />, count: '60+ Doctors' },
    { name: 'Orthopedics', icon: <FaHospital />, count: '35+ Doctors' },
    { name: 'General Medicine', icon: <FaAmbulance />, count: '100+ Doctors' },
    { name: 'Psychiatry', icon: <FaUserMd />, count: '30+ Doctors' }
  ];

  const benefits = [
    {
      title: 'Save Time',
      description: 'No more waiting rooms or travel time. Get care when you need it.',
      icon: <FaClock className="text-2xl text-white" />,
      iconBg: 'bg-primary-500'
    },
    {
      title: 'Save Money',
      description: 'Affordable consultations without hidden fees or insurance hassles.',
      icon: <FaCheckCircle className="text-2xl text-white" />,
      iconBg: 'bg-secondary-500'
    },
    {
      title: 'Better Access',
      description: 'Connect with specialists who may not be available in your area.',
      icon: <FaGlobe className="text-2xl text-white" />,
      iconBg: 'bg-accent-500'
    },
    {
      title: 'Quality Care',
      description: 'All doctors are board-certified and thoroughly vetted.',
      icon: <FaShieldAlt className="text-2xl text-white" />,
      iconBg: 'bg-primary-500'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Enhanced Hero Section with Carousel */}
      <section className="relative overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            bulletActiveClass: 'swiper-pagination-bullet-active bg-white',
          }}
          navigation={false}
          loop={true}
          onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
          className="hero-swiper"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className={`bg-gradient-to-br ${slide.gradient} text-white min-h-[600px] flex items-center`}>
                <div className="container-custom py-20">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
                      >
                        <span className="text-sm font-semibold">🏆 Trusted by 10,000+ Patients</span>
                      </motion.div>

                      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                        {slide.title}
                      </h1>
                      <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
                        {slide.subtitle}
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <Link
                          to="/register"
                          className="group bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-neutral-100 transition-all duration-300 text-center shadow-lg flex items-center justify-center"
                        >
                          Get Started Free
                          <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                          to="/about"
                          className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-300 text-center flex items-center justify-center"
                        >
                          <FaPlay className="mr-2" />
                          Watch Demo
                        </Link>
                      </div>

                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <FaCheckCircle className="text-accent-200" />
                          <span>No credit card required</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaCheckCircle className="text-accent-200" />
                          <span>Free consultation</span>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="hidden lg:block"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl transform rotate-6 animate-pulse"></div>
                        <div className="relative bg-white/20 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-2xl">
                          <div className="text-center mb-6">
                            <div className="text-8xl mb-4">{slide.image}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            {features.slice(0, 4).map((feature, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + idx * 0.1 }}
                                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-all"
                              >
                                <div className="flex justify-center mb-2">{feature.icon}</div>
                                <h3 className="font-semibold text-sm">{feature.title}</h3>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </section>

      {/* Floating Stats Bar - Desktop Only */}
      <div className="hidden md:block relative -mt-20 mb-20 z-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-2xl p-8 border border-neutral-100"
          >
            <div className="grid grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-3 text-primary-500 text-4xl">
                    {stat.icon}
                  </div>
                  <h3 className="text-4xl font-bold text-primary-600 mb-2">
                    <CountUp 
                      end={stat.number} 
                      suffix={stat.suffix} 
                      duration={3.5}
                      decimals={stat.decimals}
                    />
                  </h3>
                  <p className="text-neutral-600 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Stats Section */}
      <section className="bg-neutral-50 py-12 md:hidden">
        <div className="container-custom">
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-white p-6 rounded-xl shadow-md"
              >
                <div className="flex justify-center mb-3 text-primary-500 text-3xl">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-primary-600 mb-2">
                  <CountUp 
                    end={stat.number} 
                    suffix={stat.suffix} 
                    duration={2}
                    decimals={stat.decimals}
                  />
                </h3>
                <p className="text-neutral-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block bg-primary-100 text-primary-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Why Choose Telemedicine
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                Healthcare That Fits Your Life
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                Experience the future of healthcare with our comprehensive telemedicine platform designed for modern living
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card bg-white text-center border-2 border-transparent hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 group"
              >
                <div className="mb-6 flex justify-center">
                  <div className={`w-16 h-16 ${benefit.iconBg} rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">{benefit.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gradient-to-b from-neutral-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block bg-secondary-100 text-secondary-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Our Features
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                Everything You Need for Better Health
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                Comprehensive healthcare services designed to make your medical journey seamless and stress-free
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`${feature.color} p-8 rounded-2xl hover:shadow-xl transition-all duration-300 group cursor-pointer border-2 border-transparent hover:border-primary-200`}
              >
                <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-3">{feature.title}</h3>
                <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block bg-accent-100 text-accent-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Medical Specialties
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                Connect with Specialists
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                Access a wide range of medical specialists from the comfort of your home
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {specialties.map((specialty, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-primary-50 to-secondary-50 p-6 rounded-xl text-center hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="text-4xl text-primary-500 mb-3 transform group-hover:scale-110 transition-transform">
                  {specialty.icon}
                </div>
                <h3 className="font-bold text-neutral-900 mb-1 text-sm">{specialty.name}</h3>
                <p className="text-xs text-neutral-600">{specialty.count}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/register"
              className="inline-flex items-center bg-primary-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-600 transition-all duration-300 shadow-lg"
            >
              Find Your Doctor
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block bg-primary-100 text-primary-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Simple Process
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                Get Started in 3 Easy Steps
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                Your journey to better health is just a few clicks away
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-1 bg-gradient-to-r from-primary-300 via-secondary-300 to-accent-300"></div>

            {[
              {
                step: '1',
                title: 'Create Your Account',
                description: 'Sign up in minutes with your basic information. No credit card required.',
                icon: <FaUserMd className="text-4xl" />
              },
              {
                step: '2',
                title: 'Find Your Doctor',
                description: 'Browse our network of certified doctors and choose the right specialist for you.',
                icon: <FaCalendarCheck className="text-4xl" />
              },
              {
                step: '3',
                title: 'Start Consultation',
                description: 'Book an appointment and connect via secure video call from anywhere.',
                icon: <FaVideo className="text-4xl" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center group">
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-md">
                      <div className="text-primary-500">
                        {item.icon}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-3">{item.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <Link
                to="/register"
                className="inline-flex items-center bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-10 py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Your Free Consultation
                <FaArrowRight className="ml-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block bg-warning/20 text-warning px-4 py-2 rounded-full text-sm font-semibold mb-4">
                ⭐ Testimonials
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                What Our Patients Say
              </h2>
              <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
                Real experiences from thousands of satisfied patients and healthcare professionals
              </p>
            </motion.div>
          </div>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              bulletActiveClass: 'swiper-pagination-bullet-active bg-primary-500',
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="testimonials-swiper pb-12"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-neutral-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full border border-neutral-100"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                      {testimonial.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-neutral-900">{testimonial.name}</p>
                      <p className="text-sm text-neutral-600">{testimonial.role}</p>
                      <p className="text-xs text-neutral-500">{testimonial.location}</p>
                    </div>
                  </div>

                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="text-warning text-lg" />
                    ))}
                  </div>

                  <div className="relative">
                    <FaQuoteLeft className="text-primary-200 text-3xl mb-2" />
                    <p className="text-neutral-700 leading-relaxed italic">
                      {testimonial.comment}
                    </p>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="text-center mt-12">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-primary-50 px-6 py-3 rounded-full"
            >
              <FaStar className="text-warning" />
              <span className="font-semibold text-neutral-900">4.9/5 Average Rating</span>
              <span className="text-neutral-600">from 10,000+ reviews</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 text-white py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-300 rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="text-sm font-semibold">🎉 Join 10,000+ Happy Patients</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Ready to Transform Your
              <br />
              <span className="text-accent-200">Healthcare Experience?</span>
            </h2>

            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-white/90 leading-relaxed">
              Join thousands of patients who trust us with their healthcare needs.
              Start your journey to better health today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Link
                to="/register"
                className="group bg-white text-primary-600 px-10 py-5 rounded-lg font-bold hover:bg-neutral-100 transition-all duration-300 shadow-2xl flex items-center text-lg"
              >
                Create Free Account
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white px-10 py-5 rounded-lg font-bold hover:bg-white hover:text-primary-600 transition-all duration-300 flex items-center text-lg"
              >
                Sign In
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-accent-200 text-xl" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-accent-200 text-xl" />
                <span>Free first consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-accent-200 text-xl" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-neutral-50 py-12">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-neutral-600"
            >
              <FaShieldAlt className="text-3xl text-primary-500" />
              <div>
                <p className="font-bold text-neutral-900">HIPAA Compliant</p>
                <p className="text-sm">Secure & Private</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 text-neutral-600"
            >
              <FaCheckCircle className="text-3xl text-secondary-500" />
              <div>
                <p className="font-bold text-neutral-900">Board Certified</p>
                <p className="text-sm">Licensed Doctors</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 text-neutral-600"
            >
              <FaStar className="text-3xl text-warning" />
              <div>
                <p className="font-bold text-neutral-900">4.9/5 Rating</p>
                <p className="text-sm">10,000+ Reviews</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 text-neutral-600"
            >
              <FaClock className="text-3xl text-accent-500" />
              <div>
                <p className="font-bold text-neutral-900">24/7 Support</p>
                <p className="text-sm">Always Available</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;

