import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaUser,
  FaCalendar,
  FaClock,
  FaNotesMedical,
  FaPrescriptionBottleAlt,
  FaSave
} from 'react-icons/fa';
import DashboardLayout from '../../components/DashboardLayout';
import VideoCall from '../../components/VideoCall';
import { appointmentAPI, consultationAPI } from '../../services/api';
import toast from 'react-hot-toast';

/**
 * Doctor Consultation Page
 * Handles video consultation with patient using WebRTC
 * Allows doctor to take notes and create prescriptions during consultation
 * The ID in the URL is the APPOINTMENT ID, not consultation ID
 */
const DoctorConsultation = () => {
  const { id } = useParams(); // Appointment ID
  const navigate = useNavigate();

  // State management
  const [consultation, setConsultation] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [callStarted, setCallStarted] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  // Consultation notes state
  const [notes, setNotes] = useState({
    chiefComplaint: '',
    presentIllness: '',
    diagnosis: [], // Array of diagnosis objects as per schema
    treatmentPlan: '',
    doctorNotes: ''
  });

  /**
   * Fetch consultation details on component mount
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

      // Load existing notes if any
      if (consultationData.chiefComplaint) {
        setNotes({
          chiefComplaint: consultationData.chiefComplaint || '',
          presentIllness: consultationData.presentIllness || '',
          diagnosis: consultationData.diagnosis || '',
          treatmentPlan: consultationData.treatmentPlan || '',
          doctorNotes: consultationData.doctorNotes || ''
        });
      }

      // Fetch appointment details
      const appointmentRes = await appointmentAPI.getById(id);
      setAppointment(appointmentRes.data.data);

      // Patient details are already populated in consultation
      if (consultationData.patient) {
        setPatient(consultationData.patient);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching consultation:', err);
      setError('Failed to load consultation details');
      setLoading(false);
      toast.error('Failed to load consultation details');
    }
  };

  /**
   * Save consultation notes
   */
  const handleSaveNotes = async () => {
    try {
      if (consultation?._id) {
        await consultationAPI.update(consultation._id, notes);
        toast.success('Notes saved successfully');
      }
    } catch (err) {
      console.error('Error saving notes:', err);
      toast.error('Failed to save notes');
    }
  };

  /**
   * Handle call end - save notes and navigate
   */
  const handleCallEnd = async () => {
    try {
      // Save notes and update status
      if (consultation?._id) {
        await consultationAPI.update(consultation._id, {
          ...notes,
          status: 'completed',
          endTime: new Date()
        });
      }

      toast.success('Consultation ended');
      navigate('/doctor/appointments');
    } catch (err) {
      console.error('Error ending consultation:', err);
      navigate('/doctor/appointments');
    }
  };

  /**
   * Start the video call
   */
  const handleStartCall = () => {
    setCallStarted(true);
  };

  /**
   * Navigate to prescription creation
   */
  const handleCreatePrescription = () => {
    if (patient && consultation) {
      navigate(`/doctor/prescription/${patient._id}`, {
        state: { consultationId: consultation._id, appointmentId: id }
      });
    }
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
          <button onClick={() => navigate('/doctor/appointments')} className="btn-primary">
            Back to Appointments
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
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Video Consultation</h1>
            <p className="text-neutral-600">
              {callStarted ? 'Consultation in progress' : 'Ready to start consultation'}
            </p>
          </div>

          {callStarted && (
            <div className="flex space-x-3">
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="btn-outline"
              >
                <FaNotesMedical className="mr-2" />
                {showNotes ? 'Hide Notes' : 'Show Notes'}
              </button>
              <button
                onClick={handleCreatePrescription}
                className="btn-secondary"
              >
                <FaPrescriptionBottleAlt className="mr-2" />
                Create Prescription
              </button>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Area */}
          <div className={`${showNotes && callStarted ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            {/* Patient Info Card */}
            {!callStarted && patient && appointment && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card mb-6"
              >
                <h2 className="text-xl font-semibold text-neutral-900 mb-4">Patient Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <FaUser className="text-primary-500 text-xl" />
                    <div>
                      <p className="text-sm text-neutral-600">Patient</p>
                      <p className="font-medium text-neutral-900">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-sm text-neutral-600">
                        Age: {patient.dateOfBirth ?
                          new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()
                          : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <FaCalendar className="text-primary-500 text-xl" />
                    <div>
                      <p className="text-sm text-neutral-600">Date & Time</p>
                      <p className="font-medium text-neutral-900">
                        {new Date(appointment.appointmentDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-neutral-600">{appointment.appointmentTime}</p>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <p className="text-sm text-neutral-600 mb-1">Reason for Visit</p>
                    <p className="font-medium text-neutral-900">{appointment.reasonForVisit}</p>
                  </div>

                  {appointment.symptoms && (
                    <div className="col-span-2">
                      <p className="text-sm text-neutral-600 mb-1">Symptoms</p>
                      <p className="font-medium text-neutral-900">{appointment.symptoms}</p>
                    </div>
                  )}
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
                  isInitiator={true} // Doctor is the initiator
                  onCallEnd={handleCallEnd}
                />
              </motion.div>
            )}
          </div>

          {/* Notes Panel */}
          {showNotes && callStarted && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="card sticky top-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-neutral-900">Consultation Notes</h3>
                  <button onClick={handleSaveNotes} className="btn-primary text-sm py-2 px-4">
                    <FaSave className="mr-2" />
                    Save
                  </button>
                </div>

                <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Chief Complaint
                    </label>
                    <textarea
                      value={notes.chiefComplaint}
                      onChange={(e) => setNotes({ ...notes, chiefComplaint: e.target.value })}
                      className="input-field resize-none"
                      rows="2"
                      placeholder="Main reason for visit..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Present Illness
                    </label>
                    <textarea
                      value={notes.presentIllness}
                      onChange={(e) => setNotes({ ...notes, presentIllness: e.target.value })}
                      className="input-field resize-none"
                      rows="3"
                      placeholder="History of present illness..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Diagnosis
                    </label>
                    <textarea
                      value={notes.diagnosis}
                      onChange={(e) => setNotes({ ...notes, diagnosis: e.target.value })}
                      className="input-field resize-none"
                      rows="2"
                      placeholder="Diagnosis..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Treatment Plan
                    </label>
                    <textarea
                      value={notes.treatmentPlan}
                      onChange={(e) => setNotes({ ...notes, treatmentPlan: e.target.value })}
                      className="input-field resize-none"
                      rows="3"
                      placeholder="Treatment plan..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Additional Notes
                    </label>
                    <textarea
                      value={notes.doctorNotes}
                      onChange={(e) => setNotes({ ...notes, doctorNotes: e.target.value })}
                      className="input-field resize-none"
                      rows="4"
                      placeholder="Additional notes..."
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorConsultation;

