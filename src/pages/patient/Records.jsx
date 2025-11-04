import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaFileAlt,
  FaUpload,
  FaDownload,
  FaTrash,
  FaFilePdf,
  FaFileImage,
  FaFileWord,
  FaTimes
} from 'react-icons/fa';
import DashboardLayout from '../../components/DashboardLayout';
import { patientAPI } from '../../services/api';
import toast from 'react-hot-toast';

/**
 * Patient Medical Records Page
 * Allows patients to upload, view, and manage their medical records
 */
const PatientRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    category: 'lab-report',
    file: null
  });

  /**
   * Fetch medical records on component mount
   */
  useEffect(() => {
    fetchRecords();
  }, []);

  /**
   * Fetch all medical records
   */
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await patientAPI.getMedicalRecords();
      setRecords(response.data.data || []);
    } catch (error) {
      console.error('Error fetching records:', error);
      toast.error('Failed to load medical records');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle file selection
   */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only PDF, JPG, PNG, and DOC files are allowed');
        return;
      }

      setUploadData({ ...uploadData, file });
    }
  };

  /**
   * Handle upload form submission
   */
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!uploadData.file) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('file', uploadData.file);
      formData.append('title', uploadData.title);
      formData.append('description', uploadData.description);
      formData.append('category', uploadData.category);

      await patientAPI.uploadMedicalRecord(formData);

      toast.success('Medical record uploaded successfully');
      setShowUploadModal(false);
      setUploadData({ title: '', description: '', category: 'lab-report', file: null });
      fetchRecords();
    } catch (error) {
      console.error('Error uploading record:', error);
      toast.error('Failed to upload medical record');
    } finally {
      setUploading(false);
    }
  };

  /**
   * Handle record deletion
   */
  const handleDelete = async (recordId) => {
    if (!window.confirm('Are you sure you want to delete this record?')) {
      return;
    }

    try {
      await patientAPI.deleteMedicalRecord(recordId);
      toast.success('Record deleted successfully');
      fetchRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Failed to delete record');
    }
  };

  /**
   * Get file icon based on file type
   */
  const getFileIcon = (fileType) => {
    if (fileType?.includes('pdf')) return <FaFilePdf className="text-red-500" />;
    if (fileType?.includes('image')) return <FaFileImage className="text-blue-500" />;
    if (fileType?.includes('word') || fileType?.includes('doc')) return <FaFileWord className="text-blue-600" />;
    return <FaFileAlt className="text-neutral-500" />;
  };

  /**
   * Format file size
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Medical Records</h1>
            <p className="text-neutral-600 mt-1">Upload and manage your medical documents</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="btn-primary flex items-center"
          >
            <FaUpload className="mr-2" />
            Upload Record
          </button>
        </motion.div>

        {/* Records List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : records.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center py-12"
          >
            <FaFileAlt className="text-6xl text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-600 mb-4">No medical records uploaded yet</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-primary"
            >
              Upload Your First Record
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {records.map((record, index) => (
              <motion.div
                key={record._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-4xl">
                    {getFileIcon(record.fileType)}
                  </div>
                  <span className="badge badge-primary">{record.category}</span>
                </div>

                <h3 className="font-semibold text-lg text-neutral-900 mb-2">
                  {record.title}
                </h3>

                {record.description && (
                  <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                    {record.description}
                  </p>
                )}

                <div className="text-xs text-neutral-500 mb-4">
                  <p>Size: {formatFileSize(record.fileSize)}</p>
                  <p>Uploaded: {new Date(record.uploadedAt).toLocaleDateString()}</p>
                </div>

                <div className="flex space-x-2">
                  <a
                    href={record.fileUrl}
                    download
                    className="btn-outline flex-1 flex items-center justify-center text-sm"
                  >
                    <FaDownload className="mr-1" />
                    Download
                  </a>
                  <button
                    onClick={() => handleDelete(record._id)}
                    className="btn-outline text-red-600 hover:bg-red-50 flex items-center justify-center px-3"
                  >
                    <FaTrash />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-neutral-900">Upload Medical Record</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-neutral-500 hover:text-neutral-700"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={uploadData.title}
                    onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                    className="input-field"
                    required
                    placeholder="e.g., Blood Test Results"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={uploadData.category}
                    onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="lab-report">Lab Report</option>
                    <option value="prescription">Prescription</option>
                    <option value="xray">X-Ray</option>
                    <option value="mri">MRI Scan</option>
                    <option value="ct-scan">CT Scan</option>
                    <option value="ultrasound">Ultrasound</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={uploadData.description}
                    onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                    className="input-field"
                    rows="3"
                    placeholder="Add any additional notes..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    File * (PDF, JPG, PNG, DOC - Max 5MB)
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="input-field"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    required
                  />
                  {uploadData.file && (
                    <p className="text-sm text-neutral-600 mt-2">
                      Selected: {uploadData.file.name} ({formatFileSize(uploadData.file.size)})
                    </p>
                  )}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="btn-outline flex-1"
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientRecords;

