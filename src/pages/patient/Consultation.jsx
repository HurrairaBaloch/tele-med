import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaCalendar, FaClock, FaStethoscope } from 'react-icons/fa';
import DashboardLayout from '../../components/DashboardLayout';
import VideoCall from '../../components/VideoCall';
import { appointmentAPI, consultationAPI } from '../../services/api';
import toast from 'react-hot-toast';

/**
 * Patient Consultation Page
 * Handles video consultation with doctor using WebRTC
 * The ID in the URL is the APPOINTMENT ID, not consultation ID
 */
const PatientConsultation = () => {
  const { id } = useParams(); // Appointment ID
  const navigate = useNavigate();

  // State management
  const [consultation, setConsultation] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [callStarted, setCallStarted] = useState(false);

  /**
   * Fetch consultation and appointment details on component mount
   */
  useEffect(() => {
    fetchConsultationDetails();
  }, [id]);

  /**
   * Fetch or create consultation by appointment ID
   */
  const fetchConsultationDetails = async () => {
    try {
      setLoading(true);

      // Get or create consultation by appointment ID
      const consultationRes = await consultationAPI.getByAppointmentId(id);
      const consultationData = consultationRes.data.data;
      setConsultation(consultationData);

      // Fetch appointment details
      const appointmentRes = await appointmentAPI.getById(id);
      setAppointment(appointmentRes.data.data);

      setLoading(false);
    } catch (err) {
      console.error('Error fetching consultation:', err);
      setError('Failed to load consultation details');
      setLoading(false);
      toast.error('Failed to load consultation details');
    }
  };

  /**
   * Handle call end - navigate back to dashboard
   */
  const handleCallEnd = async () => {
    try {
      // Update consultation status to completed
      if (consultation?._id) {
        await consultationAPI.update(consultation._id, { status: 'completed' });
      }
      toast.success('Consultation ended');
      navigate('/patient/dashboard');
    } catch (err) {
      console.error('Error ending consultation:', err);
      navigate('/patient/dashboard');
    }
  };

  /**
   * Start the video call
   */
  const handleStartCall = () => {
    setCallStarted(true);
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="spinner"></div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error || !consultation) {
    return (
      <DashboardLayout>
        <div className="card text-center py-12">
          <p className="text-red-600 mb-4">{error || 'Consultation not found'}</p>
          <button onClick={() => navigate('/patient/dashboard')} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Video Consultation</h1>
          <p className="text-neutral-600">
            {callStarted ? 'Consultation in progress' : 'Ready to start consultation'}
          </p>
        </motion.div>

        {/* Consultation Info Card */}
        {!callStarted && appointment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Consultation Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <FaUser className="text-primary-500 text-xl" />
                <div>
                  <p className="text-sm text-neutral-600">Doctor</p>
                  <p className="font-medium text-neutral-900">
                    Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                  </p>
                  <p className="text-sm text-neutral-600">{appointment.doctor?.specialization}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaCalendar className="text-primary-500 text-xl" />
                <div>
                  <p className="text-sm text-neutral-600">Date</p>
                  <p className="font-medium text-neutral-900">
                    {new Date(appointment.appointmentDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaClock className="text-primary-500 text-xl" />
                <div>
                  <p className="text-sm text-neutral-600">Time</p>
                  <p className="font-medium text-neutral-900">{appointment.appointmentTime}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FaStethoscope className="text-primary-500 text-xl" />
                <div>
                  <p className="text-sm text-neutral-600">Reason</p>
                  <p className="font-medium text-neutral-900">{appointment.reasonForVisit}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button onClick={handleStartCall} className="btn-primary px-8 py-3">
                Start Video Call
              </button>
            </div>
          </motion.div>
        )}

        {/* Video Call Interface */}
        {callStarted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="card p-0 overflow-hidden"
          >
            <VideoCall
              consultationId={consultation._id}
              isInitiator={false} // Patient is not the initiator
              onCallEnd={handleCallEnd}
            />
          </motion.div>
        )}

        {/* Instructions */}
        {!callStarted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card bg-primary-50"
          >
            <h3 className="text-lg font-semibold text-primary-900 mb-3">Before you start:</h3>
            <ul className="space-y-2 text-primary-800">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Ensure your camera and microphone are working properly</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Find a quiet, well-lit location for the consultation</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Have your medical history and current medications ready</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Prepare any questions you want to ask the doctor</span>
              </li>
            </ul>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientConsultation;

