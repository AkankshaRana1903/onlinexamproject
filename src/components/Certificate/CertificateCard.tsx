import React from 'react';
import { Certificate } from '../../types';
import { format } from 'date-fns';
import { Award, Download, Calendar } from 'lucide-react';

interface CertificateCardProps {
  certificate: Certificate;
  onDownload: () => void;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ certificate, onDownload }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-indigo-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">{certificate.examTitle}</h3>
          <Award className="w-8 h-8 text-white" />
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <p className="text-gray-700">
            <span className="font-medium">Issued to:</span> {certificate.userName}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Score:</span> {certificate.score}%
          </p>
          <div className="flex items-center text-gray-700 mt-2">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              <span className="font-medium">Issued on:</span>{' '}
              {format(new Date(certificate.issueDate), 'MMMM dd, yyyy')}
            </span>
          </div>
          {certificate.expiryDate && (
            <div className="flex items-center text-gray-700 mt-1">
              <Calendar className="w-4 h-4 mr-2" />
              <span>
                <span className="font-medium">Valid until:</span>{' '}
                {format(new Date(certificate.expiryDate), 'MMMM dd, yyyy')}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <button
            onClick={onDownload}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Certificate
          </button>
        </div>
      </div>
    </div>
  );
};

export default CertificateCard;