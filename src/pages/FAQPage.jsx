import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FAQPage = () => {
  const faqs = [
    {
      question: 'How do I book an appointment?',
      answer: 'Simply sign up, search for a doctor by specialization, and book an available time slot.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we use industry-standard encryption to protect all your health information.'
    },
    {
      question: 'What if I need to cancel?',
      answer: 'You can cancel appointments up to 2 hours before the scheduled time.'
    },
    {
      question: 'How do video consultations work?',
      answer: 'Once your appointment is confirmed, you can join the video call directly from your dashboard.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container-custom section-padding">
        <h1 className="text-4xl font-bold text-neutral-900 mb-6">Frequently Asked Questions</h1>
        <div className="max-w-3xl space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="card">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">{faq.question}</h3>
              <p className="text-neutral-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQPage;

