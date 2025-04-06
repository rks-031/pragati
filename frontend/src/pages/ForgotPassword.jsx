import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/v1/forgot-password', { phone: parseInt(phone) });
      if (response.data.msg) {
        alert(response.data.msg);
        setStep(2);
      }
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to send OTP');
    }
  };

  const handleResetPin = async (e) => {
    e.preventDefault();
    try {
      if (newPin !== confirmPin) {
        setError('PINs do not match');
        return;
      }
      if (newPin.length !== 4) {
        setError('PIN must be 4 digits');
        return;
      }
      const response = await axios.post('/api/v1/reset-password', {
        phone: parseInt(phone),
        otp,
        new_pin: newPin
      });
      if (response.data.msg) {
        alert(response.data.msg);
        navigate('/login');
      }
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to reset PIN');
      console.error('Reset PIN error:', error.response?.data);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={4}>
          <h2 className="text-center">Reset PIN</h2>
          {error && <Alert variant="danger" className="text-center">{error}</Alert>}

          {step === 1 ? (
            <Form onSubmit={handleSendOTP}>
              <Form.Group controlId="formPhone">
                <Form.Label>Phone Number:</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  pattern="[0-9]{10}"
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100 mt-4">
                Send OTP
              </Button>
            </Form>
          ) : (
            <Form onSubmit={handleResetPin}>
              <Form.Group controlId="formOTP">
                <Form.Label>Enter OTP:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formNewPin">
                <Form.Label>New PIN:</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter 4-digit PIN"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  pattern="[0-9]{4}"
                  required
                />
              </Form.Group>

              <Form.Group controlId="formConfirmPin">
                <Form.Label>Confirm PIN:</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm 4-digit PIN"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  pattern="[0-9]{4}"
                  required
                />
              </Form.Group>

              <Button variant="success" type="submit" className="w-100 mt-4">
                Reset PIN
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ForgotPassword;