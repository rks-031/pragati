import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logoGradient.png';
import '../styles/navbar.css';

const NavigationBar = () => {
  const { userName, userRole, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); // Navigate to home page after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path) => location.pathname === path;
  
  const closeNavbar = () => setExpanded(false);

  return (
    <Navbar 
      expand="lg" 
      className={`modern-navbar ${scrolled ? 'navbar-scrolled' : ''}`} 
      expanded={expanded}
      onToggle={setExpanded}
      fixed="top"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="navbar-brand-modern">
          <img
            src={logo}
            height="40"
            className="brand-logo"
            alt="Pragati Logo"
          />
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggler-modern">
          <div className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </Navbar.Toggle>
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto nav-links-container">
            <Nav.Link
              as={Link}
              to="/assessment"
              className={`nav-link-modern ${isActive('/assessment') ? 'active' : ''}`}
              onClick={closeNavbar}
            >
              Assessments
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/modules-courses"
              className={`nav-link-modern ${isActive('/modules-courses') ? 'active' : ''}`}
              onClick={closeNavbar}
            >
              Courses
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/exam-preparation"
              className={`nav-link-modern ${isActive('/exam-preparation') ? 'active' : ''}`}
              onClick={closeNavbar}
            >
              Exam Prep
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/teach"
              className={`nav-link-modern ${isActive('/exam-preparation') ? 'active' : ''}`}
              onClick={closeNavbar}
            >
              Teach
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/explore"
              className={`nav-link-modern ${isActive('/exam-preparation') ? 'active' : ''}`}
              onClick={closeNavbar}
            >
              Explore
            </Nav.Link>
            {userRole === 'teacher' && (
              <Nav.Link
                as={Link}
                to="/upload-exam"
                className={`nav-link-modern ${isActive('/upload-exam') ? 'active' : ''}`}
                onClick={closeNavbar}
              >
                Upload Exam
              </Nav.Link>
            )}
          </Nav>

          <Nav className="auth-buttons">
            {userName ? (
              <div className="user-profile-section">
                <div className="user-info d-none d-lg-block">
                  <span className="user-name">{userName}</span>
                </div>
                <div className="user-avatar">
                  <span>{userName.charAt(0).toUpperCase()}</span>
                </div>
                <Button 
                  variant="outline-danger" 
                  onClick={handleLogout} 
                  className="logout-btn"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="auth-buttons-container">
                <Button
                  variant="success"
                  as={Link}
                  to="/login"
                  className="login-btn"
                  onClick={closeNavbar}
                >
                  Login
                </Button>
                <Button 
                  variant="outline-primary" 
                  as={Link} 
                  to="/register" 
                  className="register-btn"
                  onClick={closeNavbar}
                >
                  Register
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;