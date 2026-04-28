import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MainLayout from '../components/Layout/MainLayout';
import { Save, X } from 'lucide-react';

const CreateExamPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 0,
    totalMarks: 0,
    passingMarks: 0,
    startDate: '',
    endDate: '',
    questions: [{ text: '', type: 'mcq', options: ['', '', '', ''], correctAnswer: '', marks: 1 }],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'duration' || name === 'totalMarks' || name === 'passingMarks' ? parseInt(value) || 0 : value }));
  };

  const handleQuestionChange = (index: number, field: string, value: string | number) => {
    const updatedQuestions = [...formData.questions];
    if (field === 'options') {
      updatedQuestions[index].options = value as string[];
    } else {
      updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    }
    setFormData((prev) => ({ ...prev, questions: updatedQuestions }));
  };

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [...prev.questions, { text: '', type: 'mcq', options: ['', '', '', ''], correctAnswer: '', marks: 1 }],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create exam');
      navigate('/manage-exams');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-black min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Create New Exam
            </h1>
            <Link to="/manage-exams" className="text-gray-400 hover:text-gray-300">
              <X className="w-6 h-6" />
            </Link>
          </div>
          {error && <p className="text-red-400 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-lg p-6 border border-gray-700/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-400 mb-1 block">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="text-gray-400 mb-1 block">Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="text-gray-400 mb-1 block">Total Marks</label>
                <input
                  type="number"
                  name="totalMarks"
                  value={formData.totalMarks}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="text-gray-400 mb-1 block">Passing Marks</label>
                <input
                  type="number"
                  name="passingMarks"
                  value={formData.passingMarks}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="text-gray-400 mb-1 block">Start Date</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="text-gray-400 mb-1 block">End Date</label>
                <input
                  type="datetime-local"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="text-gray-400 mb-1 block">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={4}
                required
              />
            </div>
            <div className="mt-6">
              <h2 className="text-xl font-bold text-white mb-4">Questions</h2>
              {formData.questions.map((q, index) => (
                <div key={index} className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <input
                    type="text"
                    value={q.text}
                    onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                    placeholder="Question text"
                    className="w-full p-2 mb-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  {q.options.map((opt, optIndex) => (
                    <input
                      key={optIndex}
                      type="text"
                      value={opt}
                      onChange={(e) => {
                        const newOptions = [...q.options];
                        newOptions[optIndex] = e.target.value;
                        handleQuestionChange(index, 'options', newOptions);
                      }}
                      placeholder={`Option ${optIndex + 1}`}
                      className="w-full p-2 mb-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  ))}
                  <input
                    type="text"
                    value={q.correctAnswer}
                    onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                    placeholder="Correct Answer"
                    className="w-full p-2 mb-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <input
                    type="number"
                    value={q.marks}
                    onChange={(e) => handleQuestionChange(index, 'marks', parseInt(e.target.value) || 1)}
                    placeholder="Marks"
                    className="w-full p-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addQuestion}
                className="mt-2 px-4 py-2 bg-indigo-600/90 text-white rounded-lg hover:bg-indigo-500 transition-all duration-300"
              >
                Add Question
              </button>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-indigo-600/90 text-white rounded-lg hover:bg-indigo-500 transition-all duration-300 flex items-center disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Creating...' : 'Create Exam'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateExamPage;