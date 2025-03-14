import React from 'react';
import { Container, Button } from 'react-bootstrap';

function Dashboard() {
  return (
    <Container className="text-center mt-5">
      <h2>Welcome to Pragati!</h2>
      <p className="lead">Empowering Rural India Through Accessible Learning.</p>
      <div className="my-5">
        <video controls style={{ width: '100%', maxWidth: '600px', margin: '0 auto', display: 'block' }}>
          <source src="path-to-your-video.mp4" type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>
      </div>
    </Container>
  );
}

export default Dashboard;
