import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import StudyBuddy from './pages/StudyBuddy';
import Quizzes from './pages/Quizzes';
import Flashcards from './pages/Flashcards';
import ChatBot from './pages/ChatBot';
import DashboardLayout from './layouts/DashboardLayout';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <>
                <Navbar />
                <HomePage />
                <Footer />
              </>
            } />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            } />
            <Route path="/studybuddy" element={
              <DashboardLayout>
                <StudyBuddy />
              </DashboardLayout>
            } />
            <Route path="/quizzes" element={
              <DashboardLayout>
                <Quizzes />
              </DashboardLayout>
            } />
            <Route path="/flashcards" element={
              <DashboardLayout>
                <Flashcards />
              </DashboardLayout>
            } />
            <Route path="/chatbot" element={
              <DashboardLayout>
                <ChatBot />
              </DashboardLayout>
            } />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;