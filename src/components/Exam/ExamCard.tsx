import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Award } from 'lucide-react';
import { Exam } from '../../types';
import { format } from 'date-fns';

interface ExamCardProps {
  exam: Exam;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{exam.title}</h3>
        <p className="text-gray-600 mb-4">{exam.description}</p>
        
        <div className="flex flex-col space-y-2 mb-4">
          <div className="flex items-center text-gray-500">
            <Clock className="w-4 h-4 mr-2" />
            <span>{exam.duration} minutes</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Award className="w-4 h-4 mr-2" />
            <span>Passing: {exam.passingMarks}/{exam.totalMarks}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Available until: {format(new Date(exam.endDate), 'MMM dd, yyyy')}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium px-2.5 py-0.5 rounded bg-green-100 text-green-800">
            {exam.allowRetake ? `Retakes allowed (${exam.maxRetakes || 'unlimited'})` : 'No retakes'}
          </span>
          <Link
            to={`/exams/${exam.id}`}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;