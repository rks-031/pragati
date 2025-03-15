import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    selectedClass: '',
    school: '',
    parentPhone: '',
    pin: ''
  });
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await axios.post('/api/v1/register', {
        name: formData.name,
        class: formData.selectedClass,  
        school_anganbadi_name: formData.school,  
        parent_phone: parseInt(formData.parentPhone, 10), 
        pin: formData.pin
      });

      alert(response.data.msg);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);

      if (error.response) {
        const errorDetail = error.response.data.detail;
        setErrorMessage(typeof errorDetail === 'object' ? 'Validation error. Check your inputs.' : errorDetail || 'Registration failed');
      } else if (error.request) {
        setErrorMessage('No response from server. Check your connection.');
      } else {
        setErrorMessage('An error occurred during registration. Please try again.');
      }
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={4}>
          <h2 className="text-center">Register</h2>
          {errorMessage && (
            <div className="alert alert-danger text-center">{errorMessage}</div>
          )}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicName">
              <Form.Label>Name:</Form.Label>
              <Form.Control 
                type="text" 
                name="name" 
                placeholder="Enter name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </Form.Group>

            <Form.Group controlId="formBasicClass">
              <Form.Label>Class:</Form.Label>
              <Form.Select 
                name="selectedClass" 
                value={formData.selectedClass} 
                onChange={handleChange} 
                required
              >
                <option value="">Select class</option>
                {[...Array(10).keys()].map((i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="formBasicSchool">
              <Form.Label>School/Anganbadi Name:</Form.Label>
              <Form.Control 
                type="text" 
                name="school" 
                placeholder="Enter school/anganbadi name" 
                value={formData.school} 
                onChange={handleChange} 
                required 
              />
            </Form.Group>

            <Form.Group controlId="formBasicPhone">
              <Form.Label>Parent's Phone Number:</Form.Label>
              <Form.Control 
                type="number"  // ✅ Ensure numeric input
                name="parentPhone" 
                placeholder="Enter parent's phone number" 
                value={formData.parentPhone} 
                onChange={handleChange} 
                required 
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
              />
            </Form.Group>
            <Button variant="success" type="submit" className="w-100 mt-4 mb-4">
              Register
            </Button>
          </Form>

          <p className="text-center mt-3">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;