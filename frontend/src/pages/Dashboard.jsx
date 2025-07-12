import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { BookOpen, Users, Brain, CreditCard, TrendingUp, Clock, Award } from 'lucide-react';
import useAuthStore from '../ZustandStore/Auth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const cardsRef = useRef(null);
  const statsRef = useRef(null);
  const {isAuthenticated} = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    
    gsap.fromTo(
      statsRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
    );

    gsap.fromTo(
      cardsRef.current.children,
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, delay: 0.3, ease: 'back.out(1.7)' }
    );
    if(isAuthenticated) navigate("/dashboard")
  }, []);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome Back, Student!</h1>
        <p className="text-gray-600 mt-2">Ready to continue your learning journey?</p>
      </div>

      {/* Stats Cards */}
      <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Study Hours</p>
              <p className="text-2xl font-bold text-gray-900">24.5</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Quizzes Completed</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <Brain className="h-8 w-8 text-cyan-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Achievement Score</p>
              <p className="text-2xl font-bold text-gray-900">87%</p>
            </div>
            <Award className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Learning Resources Grid */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Learning Resources</h2>
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mathematics</h3>
            <p className="text-gray-600 text-sm mb-4">Advanced algebra and calculus concepts</p>
            <div className="bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-xs text-gray-500">75% Complete</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Science</h3>
            <p className="text-gray-600 text-sm mb-4">Physics, Chemistry, and Biology</p>
            <div className="bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            <p className="text-xs text-gray-500">60% Complete</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">English</h3>
            <p className="text-gray-600 text-sm mb-4">Literature and language skills</p>
            <div className="bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
            <p className="text-xs text-gray-500">85% Complete</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Social Studies</h3>
            <p className="text-gray-600 text-sm mb-4">History and geography</p>
            <div className="bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-orange-600 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <p className="text-xs text-gray-500">45% Complete</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="bg-pink-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Computer Science</h3>
            <p className="text-gray-600 text-sm mb-4">Programming and algorithms</p>
            <div className="bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-pink-600 h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
            <p className="text-xs text-gray-500">30% Complete</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Art & Design</h3>
            <p className="text-gray-600 text-sm mb-4">Creative and visual arts</p>
            <div className="bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '90%' }}></div>
            </div>
            <p className="text-xs text-gray-500">90% Complete</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-2 rounded-lg">
              <Brain className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Completed Math Quiz</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Joined Study Group</p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-2 rounded-lg">
              <CreditCard className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Created New Flashcard Set</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;