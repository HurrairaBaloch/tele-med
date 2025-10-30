import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';

const DoctorPatients = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-neutral-900">My Patients</h1>
        <div className="card">
          <p className="text-neutral-600">Patient list will appear here</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorPatients;

