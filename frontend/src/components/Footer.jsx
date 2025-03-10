import React from 'react';
import { Container } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-dark text-white text-center pb-2 pt-2 mt-5 sticky-footer">
      <Container>
        <p>&copy; {new Date().getFullYear()} Pragati. All Rights Reserved.</p>
      </Container>
    </footer>
  );
}

export default Footer;
