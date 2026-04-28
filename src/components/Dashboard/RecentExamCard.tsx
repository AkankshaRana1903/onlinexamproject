import React from 'react';
import { Link } from 'react-router-dom';
import { ExamAttempt, Exam } from '../../types';
import { format } from 'date-fns';
import { CheckCircle, XCircle } from 'lucide-react';

interface RecentExamCardProps {
  attempt: ExamAttempt;
  exam: Exam;
}

const RecentExamCard: React.FC<RecentExamCardProps> = ({ attempt, exam }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-medium text-gray-900">{exam.title}</h3>
        {attempt.passed !== undefined && (
          <div
            className={`flex items-center ${
              attempt.passed ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {attempt.passed ? (
              <CheckCircle className="w-5 h-5 mr-1" />
            ) : (
              <XCircle className="w-5 h-5 mr-1" />
            )}
            <span>{attempt.passed ? 'Passed' : 'Failed'}</span>
          </div>
        )}
      </div>

      <div className="mb-4">
        <p className="text-gray-600 text-sm mb-1">
          Date: {format(new Date(attempt.startTime), 'MMM dd, yyyy')}
        </p>
        {attempt.score !== undefined && (
          <p className="text-gray-600 text-sm">
            Score: {attempt.score}/{exam.totalMarks} ({Math.round((attempt.score / exam.totalMarks) * 100)}%)
          </p>
        )}
      </div>

      <div className="flex justify-between items-center">
        {attempt.certificateId ? (
          <Link
            to={`/certificates/${attempt.certificateId}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View Certificate
          </Link>
        ) : (
          <span className="text-sm text-gray-500">
            {attempt.passed === false && exam.allowRetake
              ? 'Eligible for retake'
              : attempt.passed === undefined
              ? 'Pending evaluation'
              : ''}
          </span>
        )}
        <Link
          to={`/exam-results/${attempt.id}`}
          className="inline-flex items-center px-3 py-1.5 border border-indigo-600 text-indigo-600 text-sm font-medium rounded hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default RecentExamCard;