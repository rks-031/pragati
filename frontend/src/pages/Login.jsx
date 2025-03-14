import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Login() {
  const [pinError, setPinError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
    // If PIN is incorrect, set pinError to true
    setPinError(true);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={4}>
          <h2 className="text-center">Login</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicName">
              <Form.Label>Name:</Form.Label>
              <Form.Control type="text" placeholder="Enter name" />
            </Form.Group>
            <Form.Group controlId="formBasicPhone">
              <Form.Label>Phone Number:</Form.Label>
              <Form.Control type="text" placeholder="Enter phone number" />
            </Form.Group>
            <Form.Group controlId="formBasicPin">
              <Form.Label>PIN (4-digit):</Form.Label>
              <Form.Control type="password" placeholder="Enter 4-digit PIN" />
            </Form.Group>
            {pinError && (
              <p className="text-danger text-center mt-2">
                Incorrect PIN. <Link to="/forgot-password">Forgot Password?</Link>
              </p>
            )}
            <Button variant="primary" type="submit" className="btn-block mt-4 mb-4">Login</Button>
          </Form>
          <p className="text-center mt-3">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
