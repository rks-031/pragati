import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import axios from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logoGradient.png';

function NavigationBar() {
  const { userName, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/api/v1/logout');
      logout(); // Using context logout function
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
          <Nav className="me-auto">
            <NavDropdown title="My Learning" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/assessment">Assessments</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/modules-courses">Your Courses</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/exam-preparation">Exam Preparation</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/teach">Teach</Nav.Link>
            <Nav.Link as={Link} to="/explore">Explore</Nav.Link>
            <Nav.Link as={Link} to="/community">Community</Nav.Link>
          </Nav>
          <Nav>
            {userName ? (
              <Nav.Item>
                <Button variant="danger" onClick={handleLogout} className="mx-2">Logout</Button>
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