import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig'; 

function Login() {
  const [formData, setFormData] = useState({
    phone: '',
    pin: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); 

    try {
      const response = await axios.post('/api/v1/login', {
        phone: Number(formData.phone), // Ensure phone number is an integer
        pin: formData.pin
      });

      alert(response.data.msg);
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error) {
      console.error('Login error:', error);

      if (error.response) {
        const errorDetail = error.response.data.detail;
        setErrorMessage(typeof errorDetail === 'object' ? 'Invalid credentials.' : errorDetail || 'Login failed');
      } else if (error.request) {
        setErrorMessage('No response from server. Check your connection.');
      } else {
        setErrorMessage('An error occurred during login. Please try again.');
      }
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={4}>
          <h2 className="text-center">Login</h2>

          {errorMessage && <Alert variant="danger" className="text-center">{errorMessage}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicPhone">
              <Form.Label>Phone Number:</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                required
                pattern="\d{10}" // Ensure 10-digit numeric input
                title="Enter a valid 10-digit phone number"
              />
            </Form.Group>

            <Form.Group controlId="formBasicPin">
              <Form.Label>PIN (4-digit):</Form.Label>
              <Form.Control
                type="password"
                name="pin"
                placeholder="Enter 4-digit PIN"
                value={formData.pin}
                onChange={handleChange}
                required
                pattern="\d{4}" // Ensure 4-digit PIN
                title="Enter a valid 4-digit PIN"
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-4 mb-4">Login</Button>
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