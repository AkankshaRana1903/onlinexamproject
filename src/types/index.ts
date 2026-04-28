export type UserRole = 'admin' | 'examiner' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePicture?: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'mcq' | 'subjective';
  options?: string[];
  correctAnswer?: string | string[];
  marks: number;
}

export interface Exam {
  category: string;
  questionCount: number;
  difficulty: string;
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  totalMarks: number;
  passingMarks: number;
  startDate: string;
  endDate: string;
  questions: Question[];
  allowRetake: boolean;
  maxRetakes?: number;
  createdBy: string;
}

export interface ExamAttempt {
  completedAt: string;
  id: string;
  examId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  answers: {
    questionId: string;
    answer: string | string[];
  }[];
  score?: number;
  passed?: boolean;
  certificateId?: string;
}

export interface Certificate {
  id: string;
  userId: string;
  examId: string;
  examTitle: string;
  userName: string;
  score: number;
  issueDate: string;
  expiryDate?: string;
}