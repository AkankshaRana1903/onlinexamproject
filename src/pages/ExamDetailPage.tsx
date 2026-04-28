import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import { MOCK_EXAMS, MOCK_EXAM_ATTEMPTS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { Clock, Calendar, Award, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { format } from 'date-fns';

const ExamDetailPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Find the exam
  const exam = MOCK_EXAMS.find((e) => e.id === examId);

  // Find user's attempts for this exam
  const userAttempts = user
    ? MOCK_EXAM_ATTEMPTS.filter(
        (attempt) => attempt.examId === examId && attempt.userId === user.id
      )
    : [];

  const canTakeExam = () => {
    if (!user) return false;
    
    // Only students can take exams
    if (user.role !== 'student') return false;

    // Check if the exam is currently available
    const now = new Date();
    if (now < new Date(exam.startDate) || now > new Date(exam.endDate)) return false;

    if (userAttempts.length === 0) return true;
    
    if (!exam?.allowRetake) return false;
    
    const passedAttempt = userAttempts.find(attempt => attempt.passed);
    if (passedAttempt) return false;
    
    if (!exam?.maxRetakes) return true;
    
    return userAttempts.length < exam.maxRetakes;
  };

  const handleStartExam = () => {
    navigate(`/take-exam/${examId}`);
  };

  if (!exam) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-2xl shadow-2xl p-10 text-center">
            <div className="bg-red-900/20 p-4 rounded-full inline-block mb-6">
              <Info className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Exam Not Found</h2>
            <p className="text-gray-300 mb-8 text-lg">
              The exam you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate('/exams')}
              className="px-6 py-3 bg-gray-700 text-white text-sm font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Browse Exams
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-black via-gray-900 to-black min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-800">
            {/* Exam Header with Dark Gradient */}
            <div className="bg-gradient-to-r from-black via-gray-900 to-black px-6 py-6 border-b border-gray-800">
              <h1 className="text-3xl font-bold text-white">{exam.title}</h1>
            </div>

            {/* Exam Details */}
            <div className="p-8">
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">{exam.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {/* Exam Information Card */}
                <div className="bg-gray-900/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-800">
                  <h3 className="text-xl font-semibold text-white mb-6 border-b pb-3 border-gray-800">
                    Exam Information
                  </h3>
                  <ul className="space-y-4">
                    {[
                      { icon: Clock, text: `Duration: ${exam.duration} minutes` },
                      { 
                        icon: Award, 
                        text: `Passing Score: ${exam.passingMarks} out of ${exam.totalMarks} (${Math.round((exam.passingMarks / exam.totalMarks) * 100)}%)` 
                      },
                      { icon: Calendar, text: `Available until: ${format(new Date(exam.endDate), 'MMMM dd, yyyy')}` },
                      { 
                        icon: AlertTriangle, 
                        text: `Retake Policy: ${exam.allowRetake 
                          ? `Allowed (${exam.maxRetakes ? `${exam.maxRetakes} times` : 'unlimited'})` 
                          : 'Not allowed'}` 
                      }
                    ].map(({ icon: Icon, text }, index) => (
                      <li key={index} className="flex items-center text-gray-300">
                        <div className="bg-gray-800 p-2 rounded-full mr-4">
                          <Icon className="w-5 h-5 text-gray-400" />
                        </div>
                        <span className="text-sm">{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exam Structure Card */}
                <div className="bg-gray-900/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-800">
                  <h3 className="text-xl font-semibold text-white mb-6 border-b pb-3 border-gray-800">
                    Exam Structure
                  </h3>
                  <ul className="space-y-4">
                    {[
                      { 
                        count: exam.questions.filter((q) => q.type === 'mcq').length, 
                        text: 'Multiple Choice Questions' 
                      },
                      { 
                        count: exam.questions.filter((q) => q.type === 'subjective').length, 
                        text: 'Subjective Questions' 
                      },
                      { 
                        count: exam.questions.length, 
                        text: 'Total Questions' 
                      }
                    ].map(({ count, text }, index) => (
                      <li key={index} className="flex items-center text-gray-300">
                        <div className="bg-gray-800 w-8 h-8 rounded-full mr-4 flex items-center justify-center">
                          <span className="text-gray-400 font-semibold text-sm">{count}</span>
                        </div>
                        <span className="text-sm">{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Previous Attempts Section */}
              {user && user.role === 'student' && userAttempts.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-2xl font-semibold text-white mb-6">Your Previous Attempts</h3>
                  <div className="bg-gray-900/50 rounded-2xl shadow-xl overflow-hidden border border-gray-800">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-800">
                          <tr>
                            {['Date', 'Score', 'Result'].map((header) => (
                              <th key={header} className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                          {userAttempts.map((attempt) => (
                            <tr key={attempt.id} className="hover:bg-gray-800/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {format(new Date(attempt.startTime), 'MMM dd, yyyy')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                {attempt.score !== undefined
                                  ? `${attempt.score}/${exam.totalMarks} (${Math.round((attempt.score / exam.totalMarks) * 100)}%)`
                                  : 'Pending'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {attempt.passed !== undefined ? (
                                  <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                      attempt.passed
                                        ? 'bg-green-900/30 text-green-400'
                                        : 'bg-red-900/30 text-red-400'
                                    }`}
                                  >
                                    {attempt.passed ? (
                                      <>
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Passed
                                      </>
                                    ) : (
                                      <>
                                        <XCircle className="w-3 h-3 mr-1" />
                                        Failed
                                      </>
                                    )}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-400">
                                    Pending
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end">
                {!user ? (
                  <button
                    onClick={() => navigate('/login')}
                    className="inline-flex items-center px-6 py-3 bg-gray-700 text-white text-sm font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Login to Take Exam
                  </button>
                ) : user.role !== 'student' ? (
                  <button
                    disabled
                    className="inline-flex items-center px-6 py-3 bg-gray-800 text-gray-500 text-sm font-semibold rounded-lg cursor-not-allowed"
                  >
                    Only Students Can Take Exams
                  </button>
                ) : canTakeExam() ? (
                  <button
                    onClick={() => setShowConfirmModal(true)}
                    className="inline-flex items-center px-6 py-3 bg-gray-700 text-white text-sm font-semibold rounded-lg hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Start Exam
                  </button>
                ) : (
                  <button
                    disabled
                    className="inline-flex items-center px-6 py-3 bg-gray-800 text-gray-500 text-sm font-semibold rounded-lg cursor-not-allowed"
                  >
                    {userAttempts.some((a) => a.passed)
                      ? 'Already Passed'
                      : 'No Retakes Available'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl max-w-md w-full p-8 shadow-2xl border border-gray-800">
              <div className="bg-gray-800 p-4 rounded-full inline-block mb-6">
                <Info className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Start Exam Confirmation</h3>
              <div className="mb-6">
                <p className="text-gray-300 mb-4">
                  You are about to start the exam "{exam.title}". Please review the following:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-400 text-sm">
                  {[
                    `The exam is timed and will last ${exam.duration} minutes.`,
                    'Once started, the timer cannot be paused.',
                    'Ensure you have a stable internet connection.',
                    'Leaving the exam page may result in automatic submission.'
                  ].map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-5 py-2.5 border border-gray-700 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartExam}
                  className="px-5 py-2.5 bg-gray-700 text-white text-sm font-semibold rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Start Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ExamDetailPage;