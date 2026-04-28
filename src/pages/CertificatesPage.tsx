import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import CertificateCard from '../components/Certificate/CertificateCard';
import { MOCK_CERTIFICATES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { Award } from 'lucide-react';

const CertificatesPage: React.FC = () => {
  const { user } = useAuth();

  // Filter certificates for the current user
  const userCertificates = user
    ? MOCK_CERTIFICATES.filter((cert) => cert.userId === user.id)
    : [];

  const handleDownloadCertificate = (certificateId: string) => {
    // In a real app, this would trigger a PDF download
    alert(`Certificate ${certificateId} download would start here`);
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Your Certificates</h1>
            <p className="text-gray-600">View and download your earned certificates</p>
          </div>

          {userCertificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCertificates.map((certificate) => (
                <CertificateCard
                  key={certificate.id}
                  certificate={certificate}
                  onDownload={() => handleDownloadCertificate(certificate.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="flex justify-center mb-4">
                <Award className="w-16 h-16 text-indigo-300" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No Certificates Yet</h2>
              <p className="text-gray-600 mb-6">
                You haven't earned any certificates yet. Complete and pass exams to earn certificates.
              </p>
              <a
                href="/exams"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Browse Exams
              </a>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default CertificatesPage;