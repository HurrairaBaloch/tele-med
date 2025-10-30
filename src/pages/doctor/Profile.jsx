import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';

const DoctorProfile = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-6">
        <h1 className="text-3xl font-bold text-neutral-900">My Profile</h1>
        <div className="card">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Name</label>
              <p className="text-lg">Dr. {user?.firstName} {user?.lastName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Specialization</label>
              <p className="text-lg">{user?.specialization}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
              <p className="text-lg">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Phone</label>
              <p className="text-lg">{user?.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DoctorProfile;

