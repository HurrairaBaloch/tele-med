import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaArrowLeft } from 'react-icons/fa';
import DashboardLayout from '../../components/DashboardLayout';
import { feedbackAPI, doctorAPI, appointmentAPI } from '../../services/api';
import toast from 'react-hot-toast';

/**
 * Patient Feedback Page
 * Allows patients to submit feedback and ratings for doctors
 */
const PatientFeedback = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [appointment, setAppointment] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    categories: {
      professionalism: 0,
      communication: 0,
      punctuality: 0,
      treatment: 0
    }
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState({ category: '', rating: 0 });

  /**
   * Fetch appointment and doctor details
   */
  useEffect(() => {
    if (appointmentId) {
      fetchAppointmentDetails();
    }
  }, [appointmentId]);

  /**
   * Fetch appointment details
   */
  const fetchAppointmentDetails = async () => {
    try {
      const response = await appointmentAPI.getById(appointmentId);
      const appointmentData = response.data.data;
      setAppointment(appointmentData);

      // Fetch doctor details
      if (appointmentData.doctor) {
        const doctorResponse = await doctorAPI.getById(appointmentData.doctor._id || appointmentData.doctor);
        setDoctor(doctorResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching appointment:', error);
      toast.error('Failed to load appointment details');
    }
  };

  /**
   * Handle overall rating change
   */
  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating });
  };

  /**
   * Handle category rating change
   */
  const handleCategoryRating = (category, rating) => {
    setFormData({
      ...formData,
      categories: {
        ...formData.categories,
        [category]: rating
      }
    });
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.rating === 0) {
      toast.error('Please provide an overall rating');
      return;
    }

    if (!formData.comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    try {
      setLoading(true);

      await feedbackAPI.create({
        doctor: doctor._id,
        appointment: appointmentId,
        rating: formData.rating,
        comment: formData.comment,
        categories: formData.categories
      });

      toast.success('Thank you for your feedback!');
      navigate('/patient/dashboard');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Render star rating component
   */
  const StarRating = ({ rating, onRatingChange, hovered, onHover, size = 'text-3xl' }) => {
    return (
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            onMouseEnter={() => onHover(star)}
            onMouseLeave={() => onHover(0)}
            className={`${size} transition-colors ${
              star <= (hovered || rating)
                ? 'text-yellow-400'
                : 'text-neutral-300'
            } hover:scale-110 transform`}
          >
            <FaStar />
          </button>
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-neutral-900">Leave Feedback</h1>
          <p className="text-neutral-600 mt-1">Share your experience with the doctor</p>
        </motion.div>

        {/* Doctor Info Card */}
        {doctor && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">
                  {doctor.firstName?.charAt(0)}{doctor.lastName?.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-900">
                  Dr. {doctor.firstName} {doctor.lastName}
                </h3>
                <p className="text-neutral-600">{doctor.specialization}</p>
                {appointment && (
                  <p className="text-sm text-neutral-500">
                    Appointment: {new Date(appointment.appointmentDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Feedback Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Overall Rating */}
            <div>
              <label className="block text-lg font-semibold text-neutral-900 mb-3">
                Overall Rating *
              </label>
              <div className="flex items-center space-x-4">
                <StarRating
                  rating={formData.rating}
                  onRatingChange={handleRatingChange}
                  hovered={hoveredRating}
                  onHover={setHoveredRating}
                />
                <span className="text-2xl font-bold text-neutral-700">
                  {hoveredRating || formData.rating || 0}/5
                </span>
              </div>
            </div>

            {/* Category Ratings */}
            <div>
              <label className="block text-lg font-semibold text-neutral-900 mb-3">
                Rate Specific Aspects
              </label>
              <div className="space-y-4">
                {[
                  { key: 'professionalism', label: 'Professionalism' },
                  { key: 'communication', label: 'Communication' },
                  { key: 'punctuality', label: 'Punctuality' },
                  { key: 'treatment', label: 'Treatment Effectiveness' }
                ].map((category) => (
                  <div key={category.key} className="flex items-center justify-between">
                    <span className="text-neutral-700 font-medium">{category.label}</span>
                    <StarRating
                      rating={formData.categories[category.key]}
                      onRatingChange={(rating) => handleCategoryRating(category.key, rating)}
                      hovered={hoveredCategory.category === category.key ? hoveredCategory.rating : 0}
                      onHover={(rating) => setHoveredCategory({ category: category.key, rating })}
                      size="text-xl"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-lg font-semibold text-neutral-900 mb-3">
                Your Feedback *
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="input-field"
                rows="6"
                placeholder="Share your experience with the doctor. What did you like? What could be improved?"
                required
              />
              <p className="text-sm text-neutral-500 mt-2">
                {formData.comment.length}/500 characters
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-outline flex-1"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-sm text-neutral-500"
        >
          <p>Your feedback helps us improve our services and assists other patients in making informed decisions.</p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default PatientFeedback;

