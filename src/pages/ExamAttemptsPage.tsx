import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/Layout/MainLayout';
import { ChevronLeft } from 'lucide-react';

const ExamAttemptsPage: React.FC = () => {
  const { user } = useAuth();
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState([]);
  const [examTitle, setExamTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/attempts/exam/${examId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch attempts');
        setAttempts(data.attempts || []);

        const examResponse = await fetch(`http://localhost:5000/api/exams/${examId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const examData = await examResponse.json();
        if (!examResponse.ok) throw new Error(examData.message || 'Failed to fetch exam');
        setExamTitle(examData.exam.title);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, [examId, token]);

  if (loading) {
    return <div className="text-white text-center py-12">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-400 text-center py-12">{error}</div>;
  }

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-black min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate('/manage-exams')}
              className="mr-4 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700 transition-colors duration-300"
            >
              <ChevronLeft className="h-5 w-5 text-gray-400" />
            </button>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Attempts for {examTitle}
            </h1>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700/50">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Completed At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {attempts.map((attempt: any) => (
                    <tr key={attempt._id} className="hover:bg-gray-800/50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{attempt.userId.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{attempt.score}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            attempt.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {attempt.passed ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {format(new Date(attempt.endTime), 'MMM dd, yyyy HH:mm')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ExamAttemptsPage;