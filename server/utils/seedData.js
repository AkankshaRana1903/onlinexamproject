import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Exam from '../models/Exam.js';
import ExamAttempt from '../models/ExamAttempt.js';
import Certificate from '../models/Certificate.js';

// Seed users
export const seedUsers = async () => {
  try {
    // Check if users already exist
    const userCount = await User.countDocuments();
    
    if (userCount > 0) {
      console.log('Users already seeded');
      return;
    }
    
    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    });
    
    // Create examiner user
    const examinerUser = await User.create({
      name: 'Examiner User',
      email: 'examiner@example.com',
      password: 'examiner123',
      role: 'examiner',
      profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    });
    
    // Create student user
    const studentUser = await User.create({
      name: 'Student User',
      email: 'student@example.com',
      password: 'student123',
      role: 'student',
      profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    });
    
    console.log('Users seeded successfully');
    
    return { adminUser, examinerUser, studentUser };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

// Seed exams
export const seedExams = async (adminId) => {
  try {
    // Check if exams already exist
    const examCount = await Exam.countDocuments();
    
    if (examCount > 0) {
      console.log('Exams already seeded');
      return;
    }
    
    // Create exams
    const exams = [
      {
        title: 'Web Development Fundamentals',
        description: 'Test your knowledge of HTML, CSS, and JavaScript basics.',
        duration: 60, // 60 minutes
        totalMarks: 100,
        passingMarks: 70,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        questions: [
          {
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
            text: 'Which CSS property is used to change the text color?',
            type: 'mcq',
            options: ['color', 'text-color', 'font-color', 'text-style'],
            correctAnswer: 'color',
            marks: 10
          },
          {
            text: 'What is the correct way to declare a JavaScript variable?',
            type: 'mcq',
            options: ['var x = 5;', 'variable x = 5;', 'v x = 5;', 'x = 5;'],
            correctAnswer: 'var x = 5;',
            marks: 10
          },
          {
            text: 'Explain the difference between let and const in JavaScript.',
            type: 'subjective',
            marks: 20
          },
          {
            text: 'What is the box model in CSS?',
            type: 'subjective',
            marks: 20
          }
        ],
        allowRetake: true,
        maxRetakes: 2,
        createdBy: adminId,
        category: 'Web Development'
      },
      {
        title: 'React.js Essentials',
        description: 'Test your knowledge of React.js fundamentals and hooks.',
        duration: 90, // 90 minutes
        totalMarks: 100,
        passingMarks: 75,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        questions: [
          {
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
            text: 'Which hook is used for side effects in React?',
            type: 'mcq',
            options: ['useEffect', 'useState', 'useContext', 'useReducer'],
            correctAnswer: 'useEffect',
            marks: 10
          },
          {
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
            text: 'Explain the concept of React component lifecycle.',
            type: 'subjective',
            marks: 20
          },
          {
            text: 'Describe the differences between controlled and uncontrolled components in React.',
            type: 'subjective',
            marks: 20
          }
        ],
        allowRetake: true,
        maxRetakes: 1,
        createdBy: adminId,
        category: 'Web Development'
      },
      {
        title: 'Node.js Fundamentals',
        description: 'Test your knowledge of Node.js and server-side JavaScript.',
        duration: 75, // 75 minutes
        totalMarks: 100,
        passingMarks: 70,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        questions: [
          {
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
            text: 'Which of the following is NOT a core module in Node.js?',
            type: 'mcq',
            options: ['jQuery', 'http', 'fs', 'path'],
            correctAnswer: 'jQuery',
            marks: 10
          },
          {
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
            text: 'Explain the event-driven architecture in Node.js.',
            type: 'subjective',
            marks: 20
          },
          {
            text: 'Describe the purpose of middleware in Express.js.',
            type: 'subjective',
            marks: 20
          }
        ],
        allowRetake: false,
        createdBy: adminId,
        category: 'Backend Development'
      }
    ];
    
    await Exam.insertMany(exams);
    
    console.log('Exams seeded successfully');
  } catch (error) {
    console.error('Error seeding exams:', error);
    throw error;
  }
};

// Run seed function
export const runSeed = async () => {
  try {
    const { adminUser } = await seedUsers();
    await seedExams(adminUser._id);
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};