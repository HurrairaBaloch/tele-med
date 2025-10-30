import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container-custom section-padding">
        <h1 className="text-4xl font-bold text-neutral-900 mb-6">About Us</h1>
        <div className="prose max-w-none">
          <p className="text-lg text-neutral-700 mb-4">
            Smart Telemedicine is a revolutionary healthcare platform that connects patients with certified doctors through secure video consultations.
          </p>
          <p className="text-neutral-600">
            Our mission is to make quality healthcare accessible to everyone, anywhere, anytime.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;

