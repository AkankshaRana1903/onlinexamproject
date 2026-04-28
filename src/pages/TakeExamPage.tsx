import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { shuffle } from 'lodash';
import { MOCK_EXAMS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import ExamTimer from '../components/Exam/ExamTimer';
import QuestionCard from '../components/Exam/QuestionCard';
import { AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

const TakeExamPage: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [exam, setExam] = useState(MOCK_EXAMS.find((e) => e.id === examId));
  const [questions, setQuestions] = useState<typeof exam.questions>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  
  // Redirect if no exam found or user not logged in
  useEffect(() => {
    if (!exam || !user) {
      navigate('/exams');
    } else {
      // Randomize questions
      setQuestions(shuffle([...exam.questions]));
    }
  }, [exam, user, navigate]);

  // Handle tab visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => prev + 1);
        setShowWarning(true);
        
        // Auto-hide warning after 5 seconds
        setTimeout(() => {
          setShowWarning(false);
        }, 5000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Disable right-click
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };
    
    document.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  // Handle copy-paste
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };
    
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCopy);
    
    return () => {
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCopy);
    };
  }, []);

  if (!exam || !user || questions.length === 0) {
    return (
      <div className="bg-gradient-to-br from-black via-gray-900 to-black min-h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerChange = (answer: string | string[]) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: answer,
    });
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmitExam = () => {
    setIsSubmitting(true);
    
    // Submission logic remains the same as in the original code
    setTimeout(() => {
      let score = 0;
      let totalPossible = 0;
      
      questions.forEach(question => {
        if (question.type === 'mcq' && question.correctAnswer) {
          totalPossible += question.marks;
          
          const userAnswer = answers[question.id];
          if (userAnswer === question.correctAnswer) {
            score += question.marks;
          }
        }
      });
      
      questions.forEach(question => {
        if (question.type === 'subjective') {
          totalPossible += question.marks;
          
          const userAnswer = answers[question.id] as string;
          if (userAnswer && userAnswer.length > 50) {
            score += Math.floor(question.marks * 0.7);
          } else if (userAnswer && userAnswer.length > 0) {
            score += Math.floor(question.marks * 0.3);
          }
        }
      });
      
      const attempt = {
        id: `${Date.now()}`,
        examId: exam.id,
        userId: user.id,
        startTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        endTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          answer,
        })),
        score,
        passed: score >= exam.passingMarks,
        certificateId: score >= exam.passingMarks ? `cert-${Date.now()}` : undefined,
      };
      
      navigate(`/exam-results/${attempt.id}`, { state: { attempt, exam } });
    }, 2000);
  };

  const handleTimeUp = () => {
    handleSubmitExam();
  };

  const answeredQuestions = Object.keys(answers).length;
  const progressPercentage = (answeredQuestions / questions.length) * 100;

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-black min-h-screen pb-8 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 shadow-md py-4 px-6 mb-6 border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">{exam.title}</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-400">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
        </div>
      </div>

      {/* Timer */}
      <ExamTimer duration={exam.duration} onTimeUp={handleTimeUp} />

      {/* Warning Alert */}
      {showWarning && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50 bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded flex items-start max-w-md">
          <AlertTriangle className="w-5 h-5 mr-2 mt-0.5" />
          <div>
            <p className="font-bold">Warning!</p>
            <p className="text-sm">
              Leaving the exam tab is not allowed. This incident has been recorded.
              {tabSwitchCount > 1 && ` (${tabSwitchCount} violations)`}
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        {/* Progress Bar */}
        <div className="bg-gray-900/50 rounded-lg border border-gray-800 shadow-md p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-400">
              Progress: {answeredQuestions} of {questions.length} questions answered
            </span>
            <span className="text-sm font-medium text-gray-400">
              {progressPercentage.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          answer={answers[currentQuestion.id]}
          onAnswerChange={handleAnswerChange}
        />

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 border border-gray-700 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex space-x-4">
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleNextQuestion}
                className="px-4 py-2 bg-gray-700 text-white text-sm font-medium rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmitExam}
                disabled={isSubmitting}
                className="px-4 py-2 bg-green-800 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Exam'}
              </button>
            )}
          </div>
        </div>

        {/* Question Navigation */}
        <div className="mt-8 bg-gray-900/50 rounded-lg border border-gray-800 shadow-md p-4">
          <h3 className="text-lg font-medium text-white mb-4">Question Navigation</h3>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-full h-10 rounded-md flex items-center justify-center text-sm font-medium ${
                  index === currentQuestionIndex
                    ? 'bg-indigo-700 text-white'
                    : answers[questions[index].id]
                    ? 'bg-green-900/30 text-green-400 border border-green-800'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeExamPage;