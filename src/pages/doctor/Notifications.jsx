import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { FaBell } from 'react-icons/fa';

const DoctorNotifications = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-neutral-900">Notifications</h1>
        <div className="card text-center py-12">
          <FaBell className="text-6xl text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-600">No new notifications</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorNotifications;

