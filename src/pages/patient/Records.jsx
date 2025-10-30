import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { FaFileAlt } from 'react-icons/fa';

const PatientRecords = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-neutral-900">Medical Records</h1>
        <div className="card text-center py-12">
          <FaFileAlt className="text-6xl text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-600 mb-4">No medical records uploaded yet</p>
          <button className="btn-primary">Upload Record</button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientRecords;

