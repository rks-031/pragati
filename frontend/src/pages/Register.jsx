import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';

function Register() {
  const [selectedClass, setSelectedClass] = useState('');

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={4}>
          <h2 className="text-center">Register</h2>
          <Form>
            <Form.Group controlId="formBasicName">
              <Form.Label>Name:</Form.Label>
              <Form.Control type="text" placeholder="Enter name" />
            </Form.Group>
            <Form.Group controlId="formBasicClass">
              <Form.Label>Class:</Form.Label>
              <Form.Select value={selectedClass} onChange={handleClassChange}>
                <option value="">Select class</option>
                {[...Array(10).keys()].map((i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="formBasicSchool">
              <Form.Label>School/Anganbadi Name:</Form.Label>
              <Form.Control type="text" placeholder="Enter school/anganbadi name" />
            </Form.Group>
            <Form.Group controlId="formBasicLocation">
              <Form.Label>Location:</Form.Label>
              <Form.Control type="text" placeholder="Enter location" />
            </Form.Group>
            <Form.Group controlId="formBasicPhone">
              <Form.Label>Parent's Phone Number:</Form.Label>
              <Form.Control type="text" placeholder="Enter parent's phone number" />
            </Form.Group>
            <Form.Group controlId="formBasicPin">
              <Form.Label>PIN (4-digit):</Form.Label>
              <Form.Control type="password" placeholder="Enter 4-digit PIN" />
            </Form.Group>
            <Button variant="success" type="submit" className="btn-block mt-4 mb-4">Register</Button>
          </Form>
          <p className="text-center mt-3">
            Already have an account? <a href="/login">Login</a>
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;
