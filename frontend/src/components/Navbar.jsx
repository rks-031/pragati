import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';

function NavigationBar() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">Pragati</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown title="My Learning" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/assessment">Assessments</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/modules-courses">Modules & Courses</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/exam-preparation">Exam Preparation</NavDropdown.Item>
            </NavDropdown>
            <Nav.Link as={Link} to="/teach">Teach</Nav.Link>
            <Nav.Link as={Link} to="/explore">Explore</Nav.Link>
            <Nav.Link as={Link} to="/community">Community</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Item>
              <Button variant="primary" as={Link} to="/login" className='mx-2'>Login</Button>
            </Nav.Item>
            <Nav.Item>
              <Button variant="success" as={Link} to="/register">Register</Button>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
