import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { doctorAPI, appointmentAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FaSearch, FaStar } from 'react-icons/fa';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialization]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await doctorAPI.search({ specialization: selectedSpecialization });
      setDoctors(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  <button className="btn-primary text-sm">Book Now</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BookAppointment;

