import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    phone: '',
    pin: '',
    role: 'student',
    apaar_id: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [validationError, setValidationError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationError('');
  };

  const validateForm = () => {
    if (formData.role === 'teacher' && formData.apaar_id.length !== 12) {
      setValidationError('APAAR ID must be exactly 12 digits');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setValidationError('');

    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        pin: formData.pin,
        role: formData.role
      };

      if (formData.role === 'student') {
        payload.phone = Number(formData.phone);
      } else {
        payload.apaar_id = Number(formData.apaar_id);
      }

      const response = await axios.post('/api/v1/login', payload);
      console.log("Login response:", response.data);
      alert(response.data.msg);

      login(
            response.data.name, 
            response.data.role, 
            response.data.qualification
        );
        
      if (formData.role === 'teacher') {
        navigate('/upload-exam');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage(error.response?.data?.detail || 'Login failed');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={4}>
          <h2 className="text-center">Login</h2>
          {errorMessage && <Alert variant="danger" className="text-center">{errorMessage}</Alert>}
          {validationError && <Alert variant="warning" className="text-center">{validationError}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formRole">
              <Form.Label>Role:</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </Form.Select>
            </Form.Group>

            {formData.role === 'student' ? (
              <Form.Group controlId="formBasicPhone">
                <Form.Label>Parent's Phone Number:</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  placeholder="Enter parent's phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  required
                />
              </Form.Group>
            ) : (
              <Form.Group controlId="formBasicAparId">
                <Form.Label>APAAR ID:</Form.Label>
                <Form.Control
                  type="text"
                  name="apaar_id"
                  placeholder="Enter 12-digit APAAR ID"
                  value={formData.apaar_id}
                  onChange={handleChange}
                  pattern="[0-9]{12}"
                  maxLength={12}
                  required
                  isInvalid={formData.apaar_id && formData.apaar_id.length !== 12}
                />
                <Form.Control.Feedback type="invalid">
                  APAAR ID must be exactly 12 digits
                </Form.Control.Feedback>
              </Form.Group>
            )}

            <Form.Group controlId="formBasicPin">
              <Form.Label>PIN (4-digit):</Form.Label>
              <Form.Control
                type="password"
                name="pin"
                placeholder="Enter 4-digit PIN"
                value={formData.pin}
                onChange={handleChange}
                pattern="[0-9]{4}"
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-4 mb-4">
              Login
            </Button>

            <div className="text-center mt-2">
              <Link to="/forgot-password">Forgot PIN?</Link>
            </div>
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