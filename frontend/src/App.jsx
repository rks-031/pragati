import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import NavigationBar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Footer from './components/Footer';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Assessment from './components/Assessment';
import ExamPrep from './components/ExamPrep';
import Modules from './components/Modules';
import Quiz from './components/Quiz';
import { AuthProvider } from './context/AuthContext';
import Chapter from './components/Chapter';

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavigationBar />
        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/exam-preparation" element={<ExamPrep />} />
            <Route path="/modules-courses" element={<Modules />} />
            <Route path="/chapter/:subject/:topic" element={<Chapter />} />
            <Route path="/quiz" element={<Quiz />} />
          </Routes>
        </Container>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
