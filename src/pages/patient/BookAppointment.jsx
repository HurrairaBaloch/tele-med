import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { doctorAPI, appointmentAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FaSearch, FaStar, FaTimes, FaCalendar, FaClock } from 'react-icons/fa';

/**
 * BookAppointment Component
 * Allows patients to search for doctors and book appointments
 * Features: Search, filter by specialization, view available slots, book appointments
 */
const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');

  // Booking modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    reason: '',
    type: 'video'
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialization]);

  /**
   * Fetch doctors based on selected specialization
   */
  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.search({ specialization: selectedSpecialization });
      setDoctors(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load doctors');
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter doctors by search term
   */
  const filteredDoctors = doctors.filter(doctor =>
    `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Open booking modal for selected doctor
   */
  const handleBookNow = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
    setBookingData({
      date: '',
      time: '',
      reason: '',
      type: 'video'
    });
  };

  /**
   * Fetch available time slots when date is selected
   */
  const handleDateChange = async (date) => {
    setBookingData({ ...bookingData, date, time: '' });

    if (!date || !selectedDoctor) return;

    try {
      setLoadingSlots(true);
      const response = await appointmentAPI.getAvailableSlots(selectedDoctor._id, { date });
      setAvailableSlots(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load available slots');
      console.error('Error fetching slots:', error);
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  /**
   * Submit appointment booking
   */
  const handleBookAppointment = async (e) => {
    e.preventDefault();

    if (!bookingData.date || !bookingData.time || !bookingData.reason) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setBookingLoading(true);

      // Match backend API field names
      const appointmentPayload = {
        doctorId: selectedDoctor._id,
        appointmentDate: bookingData.date,
        appointmentTime: bookingData.time,
        reasonForVisit: bookingData.reason,
        type: bookingData.type
      };

      await appointmentAPI.create(appointmentPayload);

      toast.success('Appointment booked successfully! 🎉');
      setShowBookingModal(false);
      setSelectedDoctor(null);
      setBookingData({ date: '', time: '', reason: '', type: 'video' });

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
      console.error('Error booking appointment:', error);
    } finally {
      setBookingLoading(false);
    }
  };

  /**
   * Close booking modal
   */
  const closeModal = () => {
    setShowBookingModal(false);
    setSelectedDoctor(null);
    setBookingData({ date: '', time: '', reason: '', type: 'video' });
    setAvailableSlots([]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-neutral-900">Book Appointment</h1>

        {/* Search & Filter */}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="input-field"
            >
              <option value="">All Specializations</option>
              <option value="General Physician">General Physician</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Pediatrician">Pediatrician</option>
            </select>
          </div>
        </div>

        {/* Doctors List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div key={doctor._id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-600">
                      {doctor.firstName?.charAt(0)}{doctor.lastName?.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-neutral-900">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </h3>
                    <p className="text-sm text-neutral-600">{doctor.specialization}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < Math.floor(doctor.averageRating || 0) ? 'text-warning' : 'text-neutral-300'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-neutral-600">
                    {doctor.averageRating?.toFixed(1) || 'N/A'} ({doctor.totalReviews || 0} reviews)
                  </span>
                </div>
                <p className="text-sm text-neutral-600 mb-4">{doctor.yearsOfExperience} years experience</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary-600">${doctor.consultationFee}</span>
                  <button
                    onClick={() => handleBookNow(doctor)}
                    className="btn-primary text-sm"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredDoctors.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-neutral-600">No doctors found. Try adjusting your search criteria.</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-neutral-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">Book Appointment</h2>
                <p className="text-neutral-600 mt-1">
                  Dr. {selectedDoctor.firstName} {selectedDoctor.lastName} - {selectedDoctor.specialization}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleBookAppointment} className="p-6 space-y-6">
              {/* Appointment Type */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Appointment Type *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setBookingData({ ...bookingData, type: 'video' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      bookingData.type === 'video'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">📹</div>
                      <div className="font-semibold">Video Call</div>
                      <div className="text-xs text-neutral-600">Online consultation</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingData({ ...bookingData, type: 'chat' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      bookingData.type === 'chat'
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">💬</div>
                      <div className="font-semibold">Chat</div>
                      <div className="text-xs text-neutral-600">Text consultation</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  <FaCalendar className="inline mr-2" />
                  Select Date *
                </label>
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="input-field"
                  required
                />
              </div>

              {/* Time Slots */}
              {bookingData.date && (
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    <FaClock className="inline mr-2" />
                    Select Time Slot *
                  </label>
                  {loadingSlots ? (
                    <div className="flex justify-center py-8">
                      <div className="spinner"></div>
                    </div>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {availableSlots.map((slot, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setBookingData({ ...bookingData, time: slot })}
                          className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                            bookingData.time === slot
                              ? 'border-primary-500 bg-primary-500 text-white'
                              : 'border-neutral-200 hover:border-primary-300 text-neutral-700'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 bg-neutral-50 rounded-lg">
                      <p className="text-neutral-600">No available slots for this date</p>
                      <p className="text-sm text-neutral-500 mt-1">Please select another date</p>
                    </div>
                  )}
                </div>
              )}

              {/* Reason for Visit */}
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  Reason for Visit *
                </label>
                <textarea
                  value={bookingData.reason}
                  onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
                  placeholder="Please describe your symptoms or reason for consultation..."
                  rows="4"
                  className="input-field resize-none"
                  required
                />
              </div>

              {/* Consultation Fee */}
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-700 font-medium">Consultation Fee:</span>
                  <span className="text-2xl font-bold text-primary-600">
                    ${selectedDoctor.consultationFee}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 btn-outline"
                  disabled={bookingLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                  disabled={bookingLoading || !bookingData.date || !bookingData.time || !bookingData.reason}
                >
                  {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default BookAppointment;

