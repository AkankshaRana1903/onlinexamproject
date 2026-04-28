// pages/AdminDashboardPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Clock, Users, FileText, Award } from 'lucide-react';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalExams: 0,
    totalAttempts: 0,
    totalCertificates: 0,
    recentActivities: [],
    examPerformance: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const [usersRes, examsRes, attemptsRes, certificatesRes] = await Promise.all([
          axios.get('/api/users', config),
          axios.get('/api/exams', config),
          axios.get('/api/attempts/exam/all', config),
          axios.get('/api/certificates', config)
        ]);

        const performanceData = attemptsRes.data.attempts.reduce((acc, attempt) => {
          const examTitle = attempt.examId.title;
          const existing = acc.find(item => item.name === examTitle);
          if (existing) {
            existing.score += attempt.score;
            existing.count += 1;
          } else {
            acc.push({ name: examTitle, score: attempt.score, count: 1 });
          }
          return acc;
        }, []).map(item => ({
          name: item.name,
          avgScore: item.score / item.count
        }));

        setStats({
          totalUsers: usersRes.data.count,
          totalExams: examsRes.data.count,
          totalAttempts: attemptsRes.data.count,
          totalCertificates: certificatesRes.data.count,
          recentActivities: attemptsRes.data.attempts.slice(0, 5),
          examPerformance: performanceData
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-black min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-800">
          {/* Header */}
          <div className="bg-gradient-to-r from-black via-gray-900 to-black px-6 py-6 border-b border-gray-800">
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="from-blue-900 to-blue-700" />
              <StatCard title="Total Exams" value={stats.totalExams} icon={FileText} color="from-green-900 to-green-700" />
              <StatCard title="Total Attempts" value={stats.totalAttempts} icon={Clock} color="from-yellow-900 to-yellow-700" />
              <StatCard title="Certificates Issued" value={stats.totalCertificates} icon={Award} color="from-purple-900 to-purple-700" />
            </div>

            {/* Charts and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              {/* Exam Performance Chart */}
              <div className="bg-gray-900/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-6 border-b pb-3 border-gray-800">
                  Exam Performance
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.examPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="avgScore" fill="#8884d8" name="Average Score" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Recent Activities */}
              <div className="bg-gray-900/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-800">
                <h2 className="text-xl font-semibold text-white mb-6 border-b pb-3 border-gray-800">
                  Recent Activities
                </h2>
                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                  {stats.recentActivities.map((activity) => (
                    <div key={activity._id} className="border-b border-gray-800 pb-3">
                      <p className="text-sm text-gray-300">
                        {activity.userId.name} attempted <span className="font-medium">{activity.examId.title}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(activity.startTime).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-300 mt-1">
                        Score: <span className="font-medium">{activity.score || 'Pending'}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Admin Controls */}
            <div className="bg-gray-900/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-800">
              <h2 className="text-xl font-semibold text-white mb-6 border-b pb-3 border-gray-800">
                Admin Controls
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-900 to-blue-700 text-white text-sm font-semibold rounded-lg hover:from-blue-800 hover:to-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Manage Users
                </button>
                <button className="inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-900 to-green-700 text-white text-sm font-semibold rounded-lg hover:from-green-800 hover:to-green-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                  System Settings
                </button>
                <button className="inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-900 to-purple-700 text-white text-sm font-semibold rounded-lg hover:from-purple-800 hover:to-purple-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                  View Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// StatCard Component
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className={`bg-gradient-to-r ${color} rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-800`}>
    <div className="flex items-center">
      <div className="bg-gray-800/50 p-3 rounded-full mr-4">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
      </div>
    </div>
  </div>
);

export default AdminDashboardPage;