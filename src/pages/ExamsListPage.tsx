import React, { useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import ExamCard from '../components/Exam/ExamCard';
import { MOCK_EXAMS } from '../data/mockData';
import { Search, Filter, BookOpen } from 'lucide-react';

const ExamsListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock categories
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'web', name: 'Web Development' },
    { id: 'programming', name: 'Programming' },
    { id: 'data', name: 'Data Science' },
    { id: 'design', name: 'Design' },
  ];

  // Filter exams based on search term and category
  const filteredExams = MOCK_EXAMS.filter((exam) => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          exam.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || true; // Mock category filtering
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <div className="flex justify-center mb-4">
              <BookOpen className="h-12 w-12 text-indigo-400" strokeWidth={1.5} />
            </div>
            <h1 className="text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              Explore Exams
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              Discover and take exams across various domains to enhance your skills and earn certifications
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Search exams..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-auto relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-500" />
                  </div>
                  <select
                    className="block w-full pl-3 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option 
                        key={category.id} 
                        value={category.id} 
                        className="bg-gray-800 text-white"
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Exams Grid */}
          {filteredExams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {filteredExams.map((exam) => (
                <div 
                  key={exam.id} 
                  className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <ExamCard exam={exam} />
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800 rounded-xl shadow-2xl p-12 text-center max-w-xl mx-auto border border-gray-700">
              <div className="flex justify-center mb-6">
                <Search className="h-12 w-12 text-gray-600" strokeWidth={1.5} />
              </div>
              <p className="text-gray-400 mb-2 text-xl">No exams found</p>
              <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ExamsListPage;