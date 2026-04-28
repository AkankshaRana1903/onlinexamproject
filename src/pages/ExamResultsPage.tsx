import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, XCircle, Award, ChevronLeft, Download } from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import { useAuth } from '../context/AuthContext';

const ExamResultsPage: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get attempt and exam data from navigation state or API
  const { attempt, exam } = location.state || {};
  
  // Redirect if no data is available
  if (!attempt || !exam || !user) {
    navigate('/dashboard');
    return null;
  }

  const scorePercentage = Math.round((attempt.score / exam.totalMarks) * 100);
  const passed = attempt.passed;
  const answeredCorrectly = attempt.answers.filter(a => a.isCorrect).length;
  const subjectivePending = attempt.answers.some(a => a.isCorrect === null);

  const handleDownloadCertificate = () => {
    // Placeholder for certificate download logic
    alert('Certificate download functionality to be implemented');
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-black min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700 transition-colors duration-300"
              >
                <ChevronLeft className="h-5 w-5 text-gray-400" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">{exam.title} - Results</h1>
                <p className="text-sm text-gray-400 mt-1">
                  Completed on {new Date(attempt.endTime).toLocaleString()}
                </p>
              </div>
            </div>
            {attempt.certificateId && (
              <button
                onClick={handleDownloadCertificate}
                className="flex items-center px-4 py-2 bg-indigo-600/90 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-all duration-300"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Certificate
              </button>
            )}
          </div>

          {/* Overview Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Score Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 border border-gray-700/50">
              <h2 className="text-lg font-semibold text-white mb-4">Score</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-indigo-400">{attempt.score}/{exam.totalMarks}</p>
                  <p className="text-sm text-gray-400 mt-1">{scorePercentage}%</p>
                </div>
                <div className={`p-3 rounded-full ${passed ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
                  {passed ? (
                    <CheckCircle className="h-6 w-6 text-emerald-400" />
                  ) : (
                    <XCircle className="h-6 w-6 text-rose-400" />
                  )}
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full ${passed ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${scorePercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 border border-gray-700/50">
              <h2 className="text-lg font-semibold text-white mb-4">Performance</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Correct Answers</span>
                  <span className="text-white font-medium">{answeredCorrectly}/{exam.questions.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Passing Marks</span>
                  <span className="text-white font-medium">{exam.passingMarks}/{exam.totalMarks}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tab Switches</span>
                  <span className={`font-medium ${attempt.tabSwitchCount > 3 ? 'text-rose-400' : 'text-white'}`}>
                    {attempt.tabSwitchCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 border border-gray-700/50">
              <h2 className="text-lg font-semibold text-white mb-4">Status</h2>
              <div className="flex items-center justify-between">
                <span className={`text-xl font-bold ${passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {passed ? 'Passed' : 'Failed'}
                </span>
                {attempt.certificateId && (
                  <div className="bg-amber-500/20 p-2 rounded-full">
                    <Award className="h-5 w-5 text-amber-400" />
                  </div>
                )}
              </div>
              {subjectivePending && (
                <p className="text-xs text-yellow-400 mt-2">
                  *Some subjective answers are pending evaluation
                </p>
              )}
            </div>
          </div>

          {/* Detailed Results */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 border border-gray-700/50">
            <h2 className="text-xl font-bold text-white mb-6">Question Breakdown</h2>
            <div className="space-y-6">
              {attempt.answers.map((answer, index) => {
                const question = exam.questions.find(q => q.id === answer.questionId);
                if (!question) return null;

                const isCorrect = answer.isCorrect;
                const isPending = isCorrect === null;

                return (
                  <div
                    key={answer.questionId}
                    className="border border-gray-700/50 rounded-lg p-4 bg-gray-800/50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-gray-400 mb-1">
                          Question {index + 1} • {question.type === 'mcq' ? 'Multiple Choice' : 'Subjective'}
                        </p>
                        <p className="text-white font-medium">{question.text}</p>
                      </div>
                      <div className="ml-4">
                        {isPending ? (
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full">
                            Pending
                          </span>
                        ) : (
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm text-gray-400">Your Answer:</p>
                      <p className="text-white text-sm mt-1">
                        {Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer || 'Not answered'}
                      </p>
                    </div>

                    {question.type === 'mcq' && question.correctAnswer && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-400">Correct Answer:</p>
                        <p className="text-emerald-400 text-sm mt-1">{question.correctAnswer}</p>
                      </div>
                    )}

                    <div className="mt-2 flex justify-between text-sm">
                      <span className="text-gray-400">Marks Awarded:</span>
                      <span className="text-white font-medium">{answer.marksAwarded}/{question.marks}</span>
                    </div>

                    {answer.feedback && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-400">Feedback:</p>
                        <p className="text-white text-sm mt-1">{answer.feedback}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Suspicious Activity Warning */}
          {attempt.suspiciousActivity && (
            <div className="mt-8 bg-red-900/30 border border-red-800 rounded-lg p-4 text-red-400">
              <p className="font-bold">Suspicious Activity Detected</p>
              <p className="text-sm mt-1">
                Excessive tab switching or other suspicious behavior was recorded during this attempt.
                This may be reviewed by the examiner.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ExamResultsPage;