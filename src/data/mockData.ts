import { Exam, ExamAttempt, Certificate } from '../types';
import { addDays, format } from 'date-fns';

// Mock exams
export const MOCK_EXAMS: Exam[] = [
  {
    id: '1',
    title: 'Web Development Fundamentals',
    description: 'Test your knowledge of HTML, CSS, and JavaScript basics.',
    duration: 60, // 60 minutes
    totalMarks: 100,
    passingMarks: 70,
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    questions: [
      {
        id: '1-1',
        text: 'What does HTML stand for?',
        type: 'mcq',
        options: [
          'Hyper Text Markup Language',
          'High Tech Modern Language',
          'Hyper Transfer Markup Language',
          'Hyper Text Modern Language'
        ],
        correctAnswer: 'Hyper Text Markup Language',
        marks: 10
      },
      {
        id: '1-2',
        text: 'Which CSS property is used to change the text color?',
        type: 'mcq',
        options: ['color', 'text-color', 'font-color', 'text-style'],
        correctAnswer: 'color',
        marks: 10
      },
      {
        id: '1-3',
        text: 'What is the correct way to declare a JavaScript variable?',
        type: 'mcq',
        options: ['var x = 5;', 'variable x = 5;', 'v x = 5;', 'x = 5;'],
        correctAnswer: 'var x = 5;',
        marks: 10
      },
      {
        id: '1-4',
        text: 'Explain the difference between let and const in JavaScript.',
        type: 'subjective',
        marks: 20
      },
      {
        id: '1-5',
        text: 'What is the box model in CSS?',
        type: 'subjective',
        marks: 20
      }
    ],
    allowRetake: true,
    maxRetakes: 2,
    createdBy: '1'
  },
  {
    id: '2',
    title: 'React.js Essentials',
    description: 'Test your knowledge of React.js fundamentals and hooks.',
    duration: 90, // 90 minutes
    totalMarks: 100,
    passingMarks: 75,
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    questions: [
      {
        id: '2-1',
        text: 'What is JSX in React?',
        type: 'mcq',
        options: [
          'JavaScript XML - A syntax extension for JavaScript',
          'JavaScript Extra - A new JavaScript version',
          'Java Syntax Extension',
          'JavaScript XML - A new programming language'
        ],
        correctAnswer: 'JavaScript XML - A syntax extension for JavaScript',
        marks: 10
      },
      {
        id: '2-2',
        text: 'Which hook is used for side effects in React?',
        type: 'mcq',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correctAnswer: 'useEffect',
        marks: 10
      },
      {
        id: '2-3',
        text: 'What is the purpose of keys in React lists?',
        type: 'mcq',
        options: [
          'To help React identify which items have changed, added, or removed',
          'To style list items differently',
          'To add event listeners to list items',
          'To make lists sortable'
        ],
        correctAnswer: 'To help React identify which items have changed, added, or removed',
        marks: 10
      },
      {
        id: '2-4',
        text: 'Explain the concept of React component lifecycle.',
        type: 'subjective',
        marks: 20
      },
      {
        id: '2-5',
        text: 'Describe the differences between controlled and uncontrolled components in React.',
        type: 'subjective',
        marks: 20
      }
    ],
    allowRetake: true,
    maxRetakes: 1,
    createdBy: '1'
  },
  {
    id: '3',
    title: 'Node.js Fundamentals',
    description: 'Test your knowledge of Node.js and server-side JavaScript.',
    duration: 75, // 75 minutes
    totalMarks: 100,
    passingMarks: 70,
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    questions: [
      {
        id: '3-1',
        text: 'What is Node.js?',
        type: 'mcq',
        options: [
          'A JavaScript runtime built on Chrome\'s V8 JavaScript engine',
          'A JavaScript framework for building user interfaces',
          'A programming language',
          'A database management system'
        ],
        correctAnswer: 'A JavaScript runtime built on Chrome\'s V8 JavaScript engine',
        marks: 10
      },
      {
        id: '3-2',
        text: 'Which of the following is NOT a core module in Node.js?',
        type: 'mcq',
        options: ['jQuery', 'http', 'fs', 'path'],
        correctAnswer: 'jQuery',
        marks: 10
      },
      {
        id: '3-3',
        text: 'What does the package.json file contain?',
        type: 'mcq',
        options: [
          'Project metadata and dependencies',
          'Server configuration',
          'Database schema',
          'Client-side code'
        ],
        correctAnswer: 'Project metadata and dependencies',
        marks: 10
      },
      {
        id: '3-4',
        text: 'Explain the event-driven architecture in Node.js.',
        type: 'subjective',
        marks: 20
      },
      {
        id: '3-5',
        text: 'Describe the purpose of middleware in Express.js.',
        type: 'subjective',
        marks: 20
      }
    ],
    allowRetake: false,
    createdBy: '1'
  }
];

// Mock exam attempts
export const MOCK_EXAM_ATTEMPTS: ExamAttempt[] = [
  {
    id: '1',
    examId: '1',
    userId: '3',
    startTime: format(addDays(new Date(), -5), 'yyyy-MM-dd HH:mm:ss'),
    endTime: format(addDays(new Date(), -5), 'yyyy-MM-dd HH:mm:ss'),
    answers: [
      {
        questionId: '1-1',
        answer: 'Hyper Text Markup Language'
      },
      {
        questionId: '1-2',
        answer: 'color'
      },
      {
        questionId: '1-3',
        answer: 'var x = 5;'
      },
      {
        questionId: '1-4',
        answer: 'let allows reassignment but not redeclaration within the same scope, while const doesn\'t allow reassignment or redeclaration.'
      },
      {
        questionId: '1-5',
        answer: 'The CSS box model is a box that wraps around every HTML element. It consists of margins, borders, padding, and the actual content.'
      }
    ],
    score: 85,
    passed: true,
    certificateId: '1'
  },
  {
    id: '2',
    examId: '2',
    userId: '3',
    startTime: format(addDays(new Date(), -2), 'yyyy-MM-dd HH:mm:ss'),
    endTime: format(addDays(new Date(), -2), 'yyyy-MM-dd HH:mm:ss'),
    answers: [
      {
        questionId: '2-1',
        answer: 'JavaScript XML - A syntax extension for JavaScript'
      },
      {
        questionId: '2-2',
        answer: 'useState'
      },
      {
        questionId: '2-3',
        answer: 'To help React identify which items have changed, added, or removed'
      },
      {
        questionId: '2-4',
        answer: 'React components go through a lifecycle of mounting, updating, and unmounting. In modern React, this is managed through hooks like useEffect.'
      },
      {
        questionId: '2-5',
        answer: 'Controlled components have their state controlled by React, while uncontrolled components maintain their own state internally.'
      }
    ],
    score: 70,
    passed: false
  }
];

// Mock certificates
export const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: '1',
    userId: '3',
    examId: '1',
    examTitle: 'Web Development Fundamentals',
    userName: 'Student User',
    score: 85,
    issueDate: format(addDays(new Date(), -5), 'yyyy-MM-dd'),
    expiryDate: format(addDays(new Date(), 365), 'yyyy-MM-dd')
  }
];