import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container-custom section-padding">
        <h1 className="text-4xl font-bold text-neutral-900 mb-6">Contact Us</h1>
        <div className="max-w-2xl">
          <p className="text-neutral-600 mb-8">Have questions? We'd love to hear from you.</p>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Name</label>
              <input type="text" className="input-field" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
              <input type="email" className="input-field" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Message</label>
              <textarea className="input-field" rows="5" placeholder="Your message"></textarea>
            </div>
            <button type="submit" className="btn-primary">Send Message</button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;

