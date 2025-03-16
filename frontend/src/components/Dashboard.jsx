import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';

function Dashboard() {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    } else {
      setUserName(null); // Ensures name disappears on logout
    }
  }, []);

  return (
    <Container className="text-center mt-5">
      {userName && <h3>Hi {userName.toUpperCase()}!</h3>}
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