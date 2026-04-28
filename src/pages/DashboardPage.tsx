import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import { useAuth } from '../context/AuthContext';
import { MOCK_EXAMS, MOCK_EXAM_ATTEMPTS } from '../data/mockData';
import { Award, BookOpen, Clock, CheckCircle, ChevronRight, Zap, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Interfaces
interface Exam {
  id: string;
  title: string;
  category: string;
  description: string;
  questionCount: number;
  duration: number;
  passingMarks: number;
  totalMarks: number;
  difficulty: string;
}

interface Attempt {
  id: string;
  userId: string;
  examId: string;
  score: number;
  passed: boolean;
  completedAt: string;
  certificateId?: string;
}

interface EnhancedStatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
}

// Enhanced Stat Card Component
const EnhancedStatCard: React.FC<EnhancedStatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  change 
}) => (
  <div className={`bg-gradient-to-br ${color} text-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
    <div className="p-6 relative">
      <div className="absolute top-0 right-0 opacity-10">
        <Icon className="h-24 w-24" />
      </div>
      <div className="flex items-center justify-between mb-4">
        <div className="bg-white bg-opacity-20 p-3 rounded-xl">
          <Icon className="h-6 w-6" />
        </div>
        {change && (
          <div className={`text-sm font-medium flex items-center ${change.isPositive ? 'text-green-200' : 'text-red-200'}`}>
            {change.isPositive ? '+' : '-'}{change.value}%
            <span className={`ml-1 ${change.isPositive ? 'transform rotate-45' : 'transform -rotate-45'}`}>↗</span>
          </div>
        )}
      </div>
      <h2 className="text-4xl font-bold mb-2">{value}</h2>
      <p className="text-sm opacity-80">{title}</p>
    </div>
  </div>
);

// Enhanced Recent Exam Card
const EnhancedRecentExamCard = ({ attempt, exam }: { attempt: Attempt; exam: Exam }) => {
  const scorePercentage = Math.round((attempt.score / exam.totalMarks) * 100);
  const isPassed = attempt.passed;
  
  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-100 hover:border-indigo-200 transition-all duration-300 transform hover:scale-105">
      <div className="p-6 relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full opacity-50"></div>
        <div className="flex justify-between items-start mb-4 relative z-10">
          <h3 className="text-lg font-bold text-gray-900">{exam.title}</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isPassed ? 'Passed' : 'Failed'}
          </span>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-500">Performance</span>
            <span className="font-medium text-indigo-600">{scorePercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-2 ${isPassed ? 'bg-green-500' : 'bg-red-500'}`} 
              style={{ width: `${scorePercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-indigo-500" />
            <span>{exam.duration} min</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
            <span>{new Date(attempt.completedAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        <Link
          to={`/exams/${exam.id}/results/${attempt.id}`}
          className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-300 group"
        >
          View Results
          <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

// Enhanced Recommended Exam Card
const EnhancedRecommendedExamCard = ({ exam }: { exam: Exam }) => (
  <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-100 hover:border-indigo-200 transition-all duration-300 transform hover:scale-105">
    <div className="p-6 relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full opacity-50"></div>
      <div className="flex items-start justify-between mb-4 relative z-10">
        <h3 className="text-lg font-bold text-gray-900">{exam.title}</h3>
        <div className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold">
          {exam.category}
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-12">{exam.description}</p>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        {[
          { label: 'Questions', value: exam.questionCount },
          { label: 'Duration', value: `${exam.duration} min` },
          { label: 'Passing', value: `${exam.passingMarks}/${exam.totalMarks}` },
          { label: 'Level', value: exam.difficulty }
        ].map(({ label, value }) => (
          <div key={label} className="bg-gray-50 p-3 rounded-lg flex flex-col items-center">
            <span className="text-xs text-gray-500 mb-1">{label}</span>
            <span className="font-semibold text-indigo-600">{value}</span>
          </div>
        ))}
      </div>
      
      <div className="flex space-x-3">
        <Link
          to={`/exams/${exam.id}`}
          className="flex-1 inline-flex items-center justify-center px-4 py-2.5 border-2 border-indigo-600 text-indigo-600 text-sm font-semibold rounded-lg hover:bg-indigo-50 transition-colors duration-300"
        >
          View Details
        </Link>
        <Link
          to={`/exams/${exam.id}/start`}
          className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-300 group"
        >
          Start Exam 
          <Zap className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
        </Link>
      </div>
    </div>
  </div>
);

// Dashboard Page Component
const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  // Filter exam attempts for the current user
  const userAttempts = MOCK_EXAM_ATTEMPTS.filter(
    (attempt) => attempt.userId === user?.id
  );

  // Get exams for the attempts
  const attemptExams = userAttempts.map((attempt) => {
    const exam = MOCK_EXAMS.find((exam) => exam.id === attempt.examId);
    return {
      attempt,
      exam: exam!,
    };
  });

  // Performance data for chart
  const performanceData = attemptExams.map((item) => ({
    name: item.exam.title,
    score: item.attempt.score || 0,
    passingScore: item.exam.passingMarks,
  }));

  // Enhance mock exams with additional properties
  const enhancedMockExams = MOCK_EXAMS.map(exam => ({
    ...exam,
    category: exam.category || "General",
    questionCount: exam.questionCount || Math.floor(Math.random() * 30) + 10,
    difficulty: exam.difficulty || ["Beginner", "Intermediate", "Advanced"][Math.floor(Math.random() * 3)]
  }));

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-gray-50 via-white to-indigo-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Dashboard Header */}
          <div className="mb-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">Dashboard</h1>
                <p className="text-lg text-gray-600">
                  Welcome back, 
                  <span className="font-bold text-indigo-600 ml-2">{user?.name}</span>
                </p>
              </div>
              <div className="bg-white rounded-xl shadow-lg p-3 border border-gray-100">
                <div className="text-xs text-gray-500 mb-1">Current Time</div>
                <div className="font-semibold text-indigo-600">{new Date().toLocaleTimeString()}</div>
              </div>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <EnhancedStatCard
              title="Total Exams"
              value={userAttempts.length}
              icon={BookOpen}
              color="from-blue-500 to-blue-700"
              change={{ value: 20, isPositive: true }}
            />
            <EnhancedStatCard
              title="Passed Exams"
              value={userAttempts.filter((a) => a.passed).length}
              icon={CheckCircle}
              color="from-green-500 to-green-700"
              change={{ value: 15, isPositive: true }}
            />
            <EnhancedStatCard
              title="Certificates"
              value={userAttempts.filter((a) => a.certificateId).length}
              icon={Award}
              color="from-yellow-500 to-yellow-700"
              change={{ value: 10, isPositive: true }}
            />
            <EnhancedStatCard
              title="Upcoming Exams"
              value={2}
              icon={Clock}
              color="from-purple-500 to-purple-700"
              change={undefined}
            />
          </div>

          {/* Performance Chart */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-10 border-2 border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Performance Overview</h2>
              <div className="flex space-x-4">
                {[
                  { color: 'bg-indigo-500', label: 'Your Score' },
                  { color: 'bg-gray-300', label: 'Passing Score' }
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center">
                    <div className={`w-3 h-3 ${color} rounded-full mr-2`}></div>
                    <span className="text-sm text-gray-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={60} 
                    tick={{fill: '#6B7280', fontSize: 12}} 
                  />
                  <YAxis tick={{fill: '#6B7280', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="score" fill="#6366F1" name="Your Score" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="passingScore" fill="#D1D5DB" name="Passing Score" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Exams Section */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Exams</h2>
              <Link
                to="/exams"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
              >
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            {userAttempts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {attemptExams.slice(0, 3).map(({ attempt, exam }) => (
                  <EnhancedRecentExamCard key={attempt.id} attempt={attempt} exam={exam} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-2xl p-8 text-center border-2 border-gray-100">
                <div className="flex flex-col items-center">
                  <div className="bg-indigo-100 p-4 rounded-full mb-4">
                    <BookOpen className="h-8 w-8 text-indigo-600" />
                  </div>
                  <p className="text-gray-600 mb-4 text-lg">You haven't taken any exams yet.</p>
                  <Link
                    to="/exams"
                    className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Browse Available Exams
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Recommended Exams Section */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recommended Exams</h2>
              <Link
                to="/exams"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center"
              >
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enhancedMockExams
                .filter(exam => !userAttempts.some(a => a.examId === exam.id))
                .slice(0, 3)
                .map((exam) => (
                  <EnhancedRecommendedExamCard key={exam.id} exam={exam} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;