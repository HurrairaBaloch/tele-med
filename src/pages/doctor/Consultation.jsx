import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';

const DoctorConsultation = () => {
  const { id } = useParams();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-neutral-900">Video Consultation</h1>
        <div className="card">
          <div className="aspect-video bg-neutral-900 rounded-lg flex items-center justify-center">
            <p className="text-white">Video consultation interface (WebRTC)</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorConsultation;

