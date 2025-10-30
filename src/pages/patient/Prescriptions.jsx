import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { patientAPI } from '../../services/api';
import { FaPrescriptionBottleAlt } from 'react-icons/fa';

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await patientAPI.getPrescriptions();
      setPrescriptions(response.data.data || []);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-neutral-900">My Prescriptions</h1>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="card text-center py-12">
            <FaPrescriptionBottleAlt className="text-6xl text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-600">No prescriptions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((prescription) => (
              <div key={prescription._id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">Prescription #{prescription.prescriptionNumber}</h3>
                    <p className="text-sm text-neutral-600">
                      Dr. {prescription.doctor?.firstName} {prescription.doctor?.lastName}
                    </p>
                  </div>
                  <span className="badge badge-primary">
                    {new Date(prescription.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="space-y-2">
                  {prescription.medications?.map((med, index) => (
                    <div key={index} className="p-3 bg-neutral-50 rounded-lg">
                      <p className="font-medium">{med.name}</p>
                      <p className="text-sm text-neutral-600">{med.dosage} - {med.frequency}</p>
                      <p className="text-sm text-neutral-500">{med.duration}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientPrescriptions;

