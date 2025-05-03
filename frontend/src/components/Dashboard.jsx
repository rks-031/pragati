import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function Dashboard() {
  const { userName } = useAuth();

  return (
    <Container className="text-center mt-5">
      {userName && <h3 className="fade-in">Hi {userName.toUpperCase()}!</h3>}
      <h2 className="fade-in">Welcome to Pragati!</h2>
      <p className="lead fade-in">Empowering Rural India Through Accessible Learning.</p>
      <div className="my-5">
        <video controls className="video-responsive fade-in">
          <source src="path-to-your-video.mp4" type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>
      </div>
      <Button variant="primary" className="fade-in">Get Started</Button>
    </Container>
  );
}