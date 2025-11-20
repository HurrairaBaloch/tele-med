import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaPlus, FaMinus } from 'react-icons/fa';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How do I book an appointment?',
      answer: 'Simply sign up, search for a doctor by specialization, and book an available time slot. You can view available time slots and select the one that works best for you.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we use industry-standard encryption (HIPAA-compliant) to protect all your health information. All data is encrypted in transit and at rest, ensuring your privacy and security.'
    },
    {
      question: 'What if I need to cancel?',
      answer: 'You can cancel appointments up to 2 hours before the scheduled time through your dashboard. Cancellations made within 2 hours may be subject to a cancellation fee.'
    },
    {
      question: 'How do video consultations work?',
      answer: 'Once your appointment is confirmed, you can join the video call directly from your dashboard. Simply click the "Join Consultation" button at the scheduled time. Our platform uses secure, high-quality video technology for seamless consultations.'
    },
    {
      question: 'Can I get prescriptions through telemedicine?',
      answer: 'Yes, board-certified doctors can prescribe medications during video consultations when appropriate. Prescriptions are sent digitally and can be filled at any pharmacy. Controlled substances may have restrictions based on local regulations.'
    },
    {
      question: 'What devices can I use for consultations?',
      answer: 'Our platform works on desktop computers, laptops, tablets, and smartphones. You just need a device with a camera, microphone, and internet connection. No special software is required - it works through your web browser.'
    },
    {
      question: 'How much does a consultation cost?',
      answer: 'Consultation fees vary by doctor and specialization. Prices are displayed clearly before booking. Many consultations are covered by insurance, and we offer transparent pricing with no hidden fees.'
    },
    {
      question: 'Are the doctors licensed and verified?',
      answer: 'Yes, all doctors on our platform are board-certified, licensed, and thoroughly vetted. We verify credentials, licenses, and medical qualifications before allowing doctors to practice on our platform.'
    },
    {
      question: 'Can I access my medical records?',
      answer: 'Yes, you have full access to your medical records, prescriptions, appointment history, and consultation notes through your patient dashboard. All records are securely stored and easily accessible.'
    },
    {
      question: 'What if I have a medical emergency?',
      answer: 'Our platform is for non-emergency consultations. If you have a medical emergency, please call 911 or go to your nearest emergency room immediately. Do not use this platform for emergency situations.'
    },
    {
      question: 'How do I get technical support?',
      answer: 'Our support team is available 24/7. You can contact us through the contact page, email support, or use the live chat feature. We also provide troubleshooting guides and FAQs to help resolve common issues quickly.'
    },
    {
      question: 'Can I consult with the same doctor multiple times?',
      answer: 'Yes, you can book follow-up appointments with the same doctor. Many patients develop ongoing relationships with their preferred doctors for continuity of care.'
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="container-custom section-padding">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Find answers to common questions about our telemedicine platform
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="card border border-neutral-200">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-semibold text-neutral-900 pr-4">{faq.question}</h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <FaMinus className="text-primary-500 text-xl" />
                  ) : (
                    <FaPlus className="text-primary-500 text-xl" />
                  )}
                </div>
              </button>
              {openIndex === index && (
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <p className="text-neutral-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQPage;

