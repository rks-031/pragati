import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    student_class: '',
    school: '',
    parent_phone: '',
    pin: '',
    role: 'student', // Default role
    qualification: '',
    apaar_id: '',
    phone: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [validationError, setValidationError] = useState('');

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
        name: formData.name,
        role: formData.role,
        school: formData.school,
        pin: formData.pin
      };

      if (formData.role === 'student') {
        payload.student_class = formData.student_class;
        payload.parent_phone = parseInt(formData.parent_phone, 10);
      } else {
        payload.qualification = formData.qualification;
        payload.apaar_id = formData.apaar_id;
        payload.phone = parseInt(formData.phone, 10);
      }

      const response = await axios.post('/api/v1/register', payload);
      if (response.data.msg) {
        alert(response.data.msg);
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      let errorMsg = 'Registration failed';
      
      if (error.response) {
        if (typeof error.response.data.detail === 'object') {
          errorMsg = error.response.data.detail.msg || errorMsg;
        } else if (typeof error.response.data.detail === 'string') {
          errorMsg = error.response.data.detail;
        } else if (Array.isArray(error.response.data.detail)) {
          errorMsg = error.response.data.detail[0]?.msg || errorMsg;
        }
      }
      
      setErrorMessage(errorMsg);
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

            {formData.role === 'student' ? (
              <>
                <Form.Group controlId="formBasicClass">
                  <Form.Label>Class:</Form.Label>
                  <Form.Select
                    name="student_class"
                    value={formData.student_class}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select class</option>
                    {[...Array(10).keys()].map((i) => (
                      <option key={i + 1} value={String(i + 1)}>{i + 1}</option>
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
                    type="tel"
                    name="parent_phone"
                    placeholder="Enter parent's phone number"
                    value={formData.parent_phone}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    required
                  />
                </Form.Group>
              </>
            ) : (
              <>
                <Form.Group controlId="formBasicQualification">
                  <Form.Label>Qualification:</Form.Label>
                  <Form.Select
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select qualification</option>
                    <option value="BED">BED</option>
                    <option value="JUNIOR">Junior</option>
                    <option value="DIPLOMA">Diploma</option>
                    <option value="ELEMENTARY">Elementary</option>
                    <option value="TGT">TGT</option>
                    <option value="PGT">PGT</option>
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

                <Form.Group controlId="formBasicAparId">
                  <Form.Label>APAAR ID:</Form.Label>
                  <Form.Control
                    type="text"
                    name="apaar_id"
                    placeholder="Enter APAAR ID"
                    value={formData.apaar_id}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formBasicTeacherPhone">
                  <Form.Label>Phone Number:</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    pattern="[0-9]{10}"
                    required
                  />
                </Form.Group>
              </>
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