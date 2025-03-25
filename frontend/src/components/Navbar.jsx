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

  return (
    <Navbar bg="light" expand="lg">
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
          {/* Show navigation items for students or non-logged in users */}
          {(!userName || userRole !== 'teacher') && (
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/assessment">Assessments</Nav.Link>
              <Nav.Link as={Link} to="/modules-courses">Your Courses</Nav.Link>
              <Nav.Link as={Link} to="/exam-preparation">Exam Preparation</Nav.Link>
              <Nav.Link as={Link} to="/teach">Teach</Nav.Link>
              <Nav.Link as={Link} to="/explore">Explore</Nav.Link>
              <Nav.Link as={Link} to="/community">Community</Nav.Link>
            </Nav>
          )}

          {/* Show Upload Question Paper link for teachers on dashboard */}
          {isTeacherOnDashboard && (
            <Nav className="me-auto">
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
            </Nav>
          )}

          <Nav className="ms-auto">
            {userName ? (
              <Nav.Item>
                <Button variant="danger" onClick={handleLogout}>Logout</Button>
              </Nav.Item>
            ) : (
              <>
                <Nav.Item>
                  <Button variant="primary" as={Link} to="/login" className="mx-2">Login</Button>
                </Nav.Item>
                <Nav.Item>
                  <Button variant="success" as={Link} to="/register">Register</Button>
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