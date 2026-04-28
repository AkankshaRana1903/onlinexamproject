import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, Book, CheckCircle, BarChart2, Edit, Users } from 'lucide-react';
import MainLayout from '../components/Layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Define types for user, exam, and attempt
interface User {
  _id: string;
  email: string;
  role: 'student' | 'examiner' | 'admin';
  examStats: {
    totalAttempts: number;
    totalPassed: number;
    averageScore: number;
    totalCertificates: number;
  };
}

interface Exam {
  _id: string;
  title: string;
  createdAt: string;
}

interface ExamAttempt {
  _id: string;
  examId: {
    _id: string;
    title: string;
    totalMarks: number;
    passingMarks: number;
  };
  userId: {
    _id: string;
    name: string;
  };
  score: number;
  passed: boolean;
  endTime: string;
}

interface ProfileData {
  user: User;
  attempts?: ExamAttempt[];
  createdExams?: Exam[];
  allUsers?: User[];
  allAttempts?: ExamAttempt[];
  totalExams?: number;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get<{ success: boolean; profile: ProfileData }>(
          'http://localhost:5000/api/users/profile',
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );
        if (response.data.success) {
          setProfileData(response.data.profile);
        } else {
          throw new Error('Failed to fetch profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <MainLayout>
        <div className="text-white text-center py-20">Loading...</div>
      </MainLayout>
    );
  }

  if (!profileData) {
    return (
      <MainLayout>
        <div className="text-white text-center py-20">Unable to load profile</div>
      </MainLayout>
    );
  }

  const { user: profileUser } = profileData;

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-black min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">
              Profile - {profileUser.role.charAt(0).toUpperCase() + profileUser.role.slice(1)}
            </h1>
            <p className="text-gray-400 mt-1">{profileUser.email}</p>
          </div>

          {profileUser.role === 'student' && (
            <StudentProfile profileData={profileData} navigate={navigate} />
          )}
          {profileUser.role === 'examiner' && (
            <ExaminerProfile profileData={profileData} navigate={navigate} />
          )}
          {profileUser.role === 'admin' && (
            <AdminProfile profileData={profileData} navigate={navigate} />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

const StudentProfile: React.FC<{ profileData: ProfileData; navigate: (path: string, options?: any) => void }> = ({
  profileData,
  navigate,
}) => {
  const { user, attempts = [] } = profileData;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard
          icon={<Book className="h-6 w-6 text-indigo-400" />}
          title="Total Attempts"
          value={user.examStats.totalAttempts}
        />
        <StatCard
          icon={<CheckCircle className="h-6 w-6 text-emerald-400" />}
          title="Exams Passed"
          value={user.examStats.totalPassed}
        />
        <StatCard
          icon={<BarChart2 className="h-6 w-6 text-blue-400" />}
          title="Average Score"
          value={`${Math.round(user.examStats.averageScore)}%`}
        />
        <StatCard
          icon={<Award className="h-6 w-6 text-amber-400" />}
          title="Certificates"
          value={user.examStats.totalCertificates}
        />
      </div>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 border border-gray-700/50">
        <h2 className="text-xl font-bold text-white mb-6">Exam History</h2>
        {attempts.length === 0 ? (
          <p className="text-gray-400">No exam attempts yet</p>
        ) : (
          <div className="space-y-4">
            {attempts.map((attempt) => (
              <div
                key={attempt._id}
                className="border border-gray-700/50 rounded-lg p-4 bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => navigate(`/results/${attempt._id}`, { state: { attempt, exam: attempt.examId } })}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium">{attempt.examId.title}</p>
                    <p className="text-sm text-gray-400">{new Date(attempt.endTime).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">
                      {attempt.score}/{attempt.examId.totalMarks}
                    </p>
                    <p className={`text-sm ${attempt.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {attempt.passed ? 'Passed' : 'Failed'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const ExaminerProfile: React.FC<{ profileData: ProfileData; navigate: (path: string, options?: any) => void }> = ({
  profileData,
  navigate,
}) => {
  const { user, createdExams = [] } = profileData;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <StatCard icon={<Edit className="h-6 w-6 text-indigo-400" />} title="Created Exams" value={createdExams.length} />
      </div>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 border border-gray-700/50">
        <h2 className="text-xl font-bold text-white mb-6">Created Exams</h2>
        {createdExams.length === 0 ? (
          <p className="text-gray-400">No exams created yet</p>
        ) : (
          <div className="space-y-4">
            {createdExams.map((exam) => (
              <div
                key={exam._id}
                className="border border-gray-700/50 rounded-lg p-4 bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => navigate(`/exams/${exam._id}`)}
              >
                <p className="text-white font-medium">{exam.title}</p>
                <p className="text-sm text-gray-400">{new Date(exam.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const AdminProfile: React.FC<{ profileData: ProfileData; navigate: (path: string, options?: any) => void }> = ({
  profileData,
  navigate,
}) => {
  const { user, allUsers = [], allAttempts = [], totalExams = 0 } = profileData;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard icon={<Users className="h-6 w-6 text-indigo-400" />} title="Total Users" value={allUsers.length} />
        <StatCard icon={<Book className="h-6 w-6 text-blue-400" />} title="Total Exams" value={totalExams} />
        <StatCard
          icon={<CheckCircle className="h-6 w-6 text-emerald-400" />}
          title="Total Attempts"
          value={allAttempts.length}
        />
      </div>
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 border border-gray-700/50">
        <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {allAttempts.slice(0, 5).map((attempt) => (
            <div
              key={attempt._id}
              className="border border-gray-700/50 rounded-lg p-4 bg-gray-800/50 hover:bg-gray-800 transition-colors cursor-pointer"
              onClick={() => navigate(`/results/${attempt._id}`, { state: { attempt, exam: attempt.examId } })}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">{attempt.examId.title}</p>
                  <p className="text-sm text-gray-400">By {attempt.userId.name}</p>
                </div>
                <p className="text-sm text-gray-400">{new Date(attempt.endTime).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: number | string }> = ({ icon, title, value }) => (
  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 border border-gray-700/50">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
      <div className="p-2 bg-gray-800/50 rounded-full">{icon}</div>
    </div>
  </div>
);

export default ProfilePage;