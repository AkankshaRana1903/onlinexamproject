import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import { Edit, Trash, Eye, Plus, Search } from 'lucide-react';
import { format } from 'date-fns';

const ManageExamsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [exams, setExams] = useState([]);
  const [attemptCounts, setAttemptCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = 'http://localhost:5000';
  const token = localStorage.getItem('token'); // Move token outside useEffect

  useEffect(() => {
    console.log('User:', user);
    console.log('Token:', token);

    if (!user || !token || (user.role !== 'admin' && user.role !== 'examiner')) {
      console.log('Redirecting to dashboard - User not authorized or token missing');
      navigate('/dashboard');
      return;
    }

    const fetchExams = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/exams/my/exams`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const text = await response.text();
          if (response.status === 401) {
            setError('Unauthorized access. Please log in again.');
            console.log('Raw 401 response:', text);
            localStorage.removeItem('token'); // Clear invalid token
            navigate('/login');
            return;
          }
          throw new Error(`Failed to fetch exams: ${response.status} - ${text}`);
        }

        const data = await response.json();
        if (data.success) {
          setExams(data.exams || []);
          const counts: Record<string, number> = {};
          await Promise.all(
            data.exams.map(async (exam: any) => {
              try {
                const attemptResponse = await fetch(`${API_BASE_URL}/api/attempts/exam/${exam._id}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });

                if (!attemptResponse.ok) {
                  const text = await attemptResponse.text();
                  console.warn(`Failed to fetch attempts for exam ${exam._id}: ${text}`);
                  counts[exam._id] = 0;
                  return;
                }

                const attemptData = await attemptResponse.json();
                counts[exam._id] = attemptData.total || 0;
              } catch (err) {
                console.warn(`Error fetching attempts for exam ${exam._id}:`, err);
                counts[exam._id] = 0;
              }
            })
          );
          setAttemptCounts(counts);
        } else {
          setError(data.message || 'Failed to load exams');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching exams');
        console.error('Fetch exams error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [user, token, navigate, API_BASE_URL]);

  const filteredExams = exams.filter((exam: any) =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteExam = async (examId: string) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/exams/${examId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`, // Now accessible
        },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to delete exam: ${text}`);
      }

      const data = await response.json();
      if (data.success) {
        setExams(exams.filter((exam: any) => exam._id !== examId));
      } else {
        alert(data.message || 'Failed to delete exam');
      }
    } catch (err: any) {
      console.error('Delete exam error:', err);
      alert(`Error deleting exam: ${err.message}`);
    }
  };

  const handleViewAttempts = (examId: string) => {
    navigate(`/exam-attempts/${examId}`);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-black min-h-screen flex items-center justify-center">
          <div className="text-white text-lg animate-pulse">Loading exams...</div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-black min-h-screen flex items-center justify-center">
          <div className="text-red-400 text-lg">{error}</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-black min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Manage Exams
              </h1>
              <p className="text-sm text-gray-400 mt-1">Create, edit, and oversee your exams</p>
            </div>
            <Link
              to="/create-exam"
              className="inline-flex items-center px-4 py-2 bg-indigo-600/90 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Exam
            </Link>
          </div>

          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-4 mb-10 border border-gray-700/50">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search exams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {filteredExams.length > 0 ? (
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700/50">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Exam Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Date Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Attempts
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredExams.map((exam: any) => (
                      <tr
                        key={exam._id}
                        className="hover:bg-gray-800/50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{exam.title}</div>
                          <div className="text-xs text-gray-400 truncate max-w-xs">
                            {exam.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {format(new Date(exam.startDate), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              exam.isActive && new Date(exam.endDate) > new Date()
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {exam.isActive && new Date(exam.endDate) > new Date() ? 'Active' : 'Expired'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {attemptCounts[exam._id] || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => handleViewAttempts(exam._id)}
                              className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
                              title="View Attempts"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <Link
                              to={`/edit-exam/${exam._id}`}
                              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                              title="Edit"
                            >
                              <Edit className="w-5 h-5" />
                            </Link>
                            <button
                              onClick={() => handleDeleteExam(exam._id)}
                              className="text-red-400 hover:text-red-300 transition-colors duration-200"
                              title="Delete"
                            >
                              <Trash className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-8 text-center border border-gray-700/50">
              <p className="text-gray-400 mb-4 text-lg">No exams found.</p>
              <Link
                to="/create-exam"
                className="inline-flex items-center px-6 py-3 bg-indigo-600/90 text-white text-sm font-medium rounded-lg hover:bg-indigo-500 transition-all duration-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Exam
              </Link>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ManageExamsPage;