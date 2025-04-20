import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import axios from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logoGradient.png';

function NavigationBar() {
  const { userName, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isTeacherOnDashboard = userRole === 'teacher' && location.pathname === '/';

  const handleLogout = async () => {
    try {
      await axios.post('/api/v1/logout');
      logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img
            src={logo}
            height="40"
            className="d-inline-block align-top font-weight-bold"
            alt="Pragati Logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {(!userName || userRole !== 'teacher') && (
              <>
                <Nav.Link
                  as={Link}
                  to="/assessment"
                  className={isActive('/assessment') ? 'active' : ''}
                >
                  Assessments
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/modules-courses"
                  className={isActive('/modules-courses') ? 'active' : ''}
                >
                  Your Courses
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/exam-preparation"
                  className={isActive('/exam-preparation') ? 'active' : ''}
                >
                  Exam Preparation
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/teach"
                  className={isActive('/teach') ? 'active' : ''}
                >
                  Teach
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/explore"
                  className={isActive('/explore') ? 'active' : ''}
                >
                  Explore
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/community"
                  className={isActive('/community') ? 'active' : ''}
                >
                  Community
                </Nav.Link>
              </>
            )}

            {isTeacherOnDashboard && (
              <Nav.Item>
                <Button
                  variant="success"
                  as={Link}
                  to="/upload-exam"
                  className="mx-2"
                >
                  Upload Question Paper
                </Button>
              </Nav.Item>
            )}
          </Nav>

          <Nav className="ms-auto">
            {userName ? (
              <Nav.Item>
                <Button variant="danger" onClick={handleLogout}>
                  Logout
                </Button>
              </Nav.Item>
            ) : (
              <>
                <Nav.Item>
                  <Button
                    variant="primary"
                    as={Link}
                    to="/login"
                    className="mx-2"
                  >
                    Login
                  </Button>
                </Nav.Item>
                <Nav.Item>
                  <Button variant="success" as={Link} to="/register">
                    Register
                  </Button>
                </Nav.Item>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;