import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import { Award, Clock, Shield, BarChart, CheckCircle, ArrowRight, User, BookOpen, ChevronRight } from 'lucide-react';

// TypeScript interfaces
interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  avatarUrl: string;
}

interface StatProps {
  value: string;
  label: string;
}

interface ExamCategoryProps {
  icon: React.ElementType;
  title: string;
  count: number;
  color: string;
}

// Component for animated stats
const AnimatedStat: React.FC<StatProps> = ({ value, label }) => (
  <div className="text-center px-6">
    <div className="text-4xl font-bold text-indigo-600 mb-2">{value}</div>
    <div className="text-gray-600">{label}</div>
  </div>
);

// Component for testimonials
const Testimonial: React.FC<TestimonialProps> = ({ quote, author, role, avatarUrl }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
    <div className="flex flex-col h-full">
      <div className="mb-4 text-indigo-600">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.667 18.667V21.333C10.667 22.4 9.76695 23.333 8.66699 23.333H6.66699C5.56699 23.333 4.66699 22.4 4.66699 21.333V18.667C4.66699 17.6 5.56699 16.667 6.66699 16.667H7.33366C8.06699 16.667 8.66699 16.067 8.66699 15.333V14C8.66699 13.267 8.06699 12.667 7.33366 12.667H6.66699" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M24.0003 18.667V21.333C24.0003 22.4 23.1003 23.333 22.0003 23.333H20.0003C18.9003 23.333 18.0003 22.4 18.0003 21.333V18.667C18.0003 17.6 18.9003 16.667 20.0003 16.667H20.667C21.4003 16.667 22.0003 16.067 22.0003 15.333V14C22.0003 13.267 21.4003 12.667 20.667 12.667H20.0003" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <p className="text-gray-700 mb-6 flex-grow">{quote}</p>
      <div className="flex items-center mt-auto">
        <img 
          src={avatarUrl || "/api/placeholder/40/40"} 
          alt={author} 
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <div className="font-semibold text-gray-900">{author}</div>
          <div className="text-sm text-gray-500">{role}</div>
        </div>
      </div>
    </div>
  </div>
);

// Component for exam categories
const ExamCategory: React.FC<ExamCategoryProps> = ({ icon: Icon, title, count, color }) => (
  <Link to="/exams" className="block">
    <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`${color.replace('border-', 'bg-').replace('-600', '-100')} p-3 rounded-lg mr-4`}>
            <Icon className={`h-6 w-6 ${color.replace('border-', 'text-')}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{count} exams available</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  </Link>
);

const HomePage: React.FC = () => {
  // Sample data for testimonials
  const testimonials: TestimonialProps[] = [
    {
      quote: "This platform helped me earn my certification in just two weeks. The practice exams were incredibly similar to the real thing!",
      author: "Bama Charan",
      role: "Software Developer",
      avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhK9MxBINB4mJpEqcOMrx7okw5qpL-fSn9SA&s"
    },
    {
      quote: "The immediate feedback and detailed explanations helped me understand where I was going wrong. Highly recommended!",
      author: "Sourav Jana",
      role: "Network Engineer",
      avatarUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0ehRHD5eBxV0RAfvCu9snEZ9Ctk-yPhSYNQ&s"
    },
    {
      quote: "I've tried several exam platforms, but this one stands out for its user experience and quality of questions.",
      author: "Emma Rodriguez",
      role: "Project Manager",
      avatarUrl: "https://pbs.twimg.com/profile_images/1755044540866850816/td8KFaRm_400x400.jpg"
    }
  ];

  // Sample data for exam categories
  const examCategories: ExamCategoryProps[] = [
    { icon: BookOpen, title: "IT & Technology", count: 42, color: "border-blue-600" },
    { icon: Shield, title: "Cybersecurity", count: 28, color: "border-red-600" },
    { icon: User, title: "Management", count: 35, color: "border-green-600" },
    { icon: Award, title: "Professional Skills", count: 21, color: "border-purple-600" }
  ];

  return (
    <MainLayout>
      {/* Hero Section with Background Overlay */}
      <section className="relative bg-indigo-800 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="relative py-24 container mx-auto px-4 z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <span className="inline-block px-4 py-1 bg-indigo-500 bg-opacity-30 rounded-full text-sm font-medium mb-6">
                Trusted by 50,000+ professionals
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Secure Online Exams <span className="text-indigo-300">&</span> Certifications
              </h1>
              <p className="text-lg md:text-xl mb-8 text-indigo-100 max-w-xl">
                Take timed exams, get instant results, and earn verifiable certificates all in one platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="bg-white text-indigo-700 px-8 py-3 rounded-lg font-medium text-lg hover:bg-indigo-50 transition-colors flex items-center justify-center"
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/exams"
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-medium text-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                >
                  Browse Exams
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 pl-0 md:pl-10">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl border border-white border-opacity-20 shadow-2xl">
                <div className="relative">
                  <img
                    src="https://akm-img-a-in.tosshub.com/indiatoday/images/story/202501/karnataka-sslc--puc-ii-exam-dates-out--objections-open-until-december-16-020624150-16x9.jpg?VersionId=xBvA7UMDAhwr_CdonP4U1qdP3gbb9GSa&size=690:388"
                    alt="Online examination platform"
                    className="rounded-lg w-full"
                  />
                  <div className="absolute -bottom-5 -right-5 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-lg">
                    <div className="text-sm font-medium">Start in minutes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="#F9FAFB">
            <path fillOpacity="1" d="M0,96L60,90.7C120,85,240,75,360,64C480,53,600,43,720,48C840,53,960,75,1080,85.3C1200,96,1320,96,1380,96L1440,96L1440,120L1380,120C1320,120,1200,120,1080,120C960,120,840,120,720,120C600,120,480,120,360,120C240,120,120,120,60,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600 mb-8">Trusted by leading companies and organizations</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {/* Replace with actual company logos */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                <div className="bg-gray-400 h-8 w-32 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Enhanced Cards */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
              Platform Features
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools you need for seamless exam-taking and certification.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Timed Exams</h3>
              <p className="text-gray-600 mb-5">
                Take exams with automated timing and get notified when time is running out.
              </p>
              <div className="pt-4 border-t border-gray-100">
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Auto-submission when time expires
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Flexible time settings per exam
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Secure Environment</h3>
              <p className="text-gray-600 mb-5">
                Anti-cheating measures ensure fair and secure examination conditions.
              </p>
              <div className="pt-4 border-t border-gray-100">
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Advanced proctoring options
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Tab switching detection
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <BarChart className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Instant Results</h3>
              <p className="text-gray-600 mb-5">
                Get immediate feedback and detailed performance analytics after completion.
              </p>
              <div className="pt-4 border-t border-gray-100">
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Detailed question analysis
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Performance comparison
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Digital Certificates</h3>
              <p className="text-gray-600 mb-5">
                Earn verifiable certificates that can be downloaded and shared instantly.
              </p>
              <div className="pt-4 border-t border-gray-100">
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Blockchain verification
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    One-click sharing to LinkedIn
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center">
            <AnimatedStat value="50,000+" label="Active Users" />
            <AnimatedStat value="200+" label="Certification Exams" />
            <AnimatedStat value="98%" label="Satisfaction Rate" />
            <AnimatedStat value="24/7" label="Support Available" />
          </div>
        </div>
      </section>

      {/* Exam Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
              Exam Categories
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse by Category</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of certification exams across various industries and skill levels.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {examCategories.map((category, index) => (
              <ExamCategory key={index} {...category} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link 
              to="/exams" 
              className="inline-flex items-center text-indigo-700 font-medium hover:text-indigo-600 transition-colors"
            >
              View all categories <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
              Simple Process
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get certified in three simple steps
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-indigo-100 transform -translate-x-1/2"></div>
              
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-center mb-16 relative">
                <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12 text-center md:text-right">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-2">
                    Step 1
                  </span>
                  <h3 className="text-2xl font-semibold mb-3">Register & Browse</h3>
                  <p className="text-gray-600">
                    Create an account and browse through available exams in various categories.
                  </p>
                </div>
                <div className="hidden md:flex absolute left-1/2 items-center justify-center bg-indigo-600 text-white w-10 h-10 rounded-full transform -translate-x-1/2 z-10">
                  1
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    <img
                      src=""
                      alt="Register and browse"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col md:flex-row-reverse items-center mb-16 relative">
                <div className="md:w-1/2 mb-8 md:mb-0 md:pl-12 text-center md:text-left">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-2">
                    Step 2
                  </span>
                  <h3 className="text-2xl font-semibold mb-3">Take the Exam</h3>
                  <p className="text-gray-600">
                    Complete the exam within the allocated time, answering multiple-choice and subjective questions.
                  </p>
                </div>
                <div className="hidden md:flex absolute left-1/2 items-center justify-center bg-indigo-600 text-white w-10 h-10 rounded-full transform -translate-x-1/2 z-10">
                  2
                </div>
                <div className="md:w-1/2 md:pr-12">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    <img
                      src="https://images.unsplash.com/photo-1523287562758-66c7fc58967f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                      alt="Take the exam"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-center relative">
                <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12 text-center md:text-right">
                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-2">
                    Step 3
                  </span>
                  <h3 className="text-2xl font-semibold mb-3">Get Certified</h3>
                  <p className="text-gray-600">
                    Receive your results instantly and download your certificate if you pass the exam.
                  </p>
                </div>
                <div className="hidden md:flex absolute left-1/2 items-center justify-center bg-indigo-600 text-white w-10 h-10 rounded-full transform -translate-x-1/2 z-10">
                  3
                </div>
                <div className="md:w-1/2 md:pl-12">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    <img
                      src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                      alt="Get certified"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from professionals who have successfully earned certifications through our platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Testimonial key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Enhanced Design */}
      <section className="py-20 bg-gradient-to-r from-indigo-700 to-indigo-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Advance Your Career?</h2>
            <p className="text-xl mb-8 text-indigo-100">
              Join thousands of students and professionals who have enhanced their skills and credibility with our certification platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="bg-white text-indigo-700 px-8 py-4 rounded-lg font-medium text-lg hover:bg-indigo-50 transition-colors inline-flex items-center justify-center"
              >
                Create Your Account <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-indigo-800 transition-colors inline-flex items-center justify-center"
              >
                Sign In
              </Link>
            </div>
            <p className="mt-6 text-sm text-indigo-200">
              No credit card required. Start with our free exams today.
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;