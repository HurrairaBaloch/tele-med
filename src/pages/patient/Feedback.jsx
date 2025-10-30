import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';

const PatientFeedback = () => {
  const { doctorId } = useParams();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-neutral-900">Leave Feedback</h1>
        <div className="card">
          <p className="text-neutral-600">Feedback form will be implemented here</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PatientFeedback;

