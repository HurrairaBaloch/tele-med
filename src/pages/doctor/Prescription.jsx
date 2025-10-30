import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';

const DoctorPrescription = () => {
  const { patientId } = useParams();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-neutral-900">Create Prescription</h1>
        <div className="card">
          <p className="text-neutral-600">Prescription form will be implemented here</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorPrescription;

