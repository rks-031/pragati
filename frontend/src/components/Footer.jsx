import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <Container>
        <Row className="mb-3">
          <Col className="text-center">
            <h5>Made with ❤️ by Team Strangers</h5>
            <p>
              Maintainers:{' '}
              <Link
                to="//github.com/rks-031"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-decoration-none"
              >
                Rajnish Kumar Singh
              </Link>{' | '}
              <Link
                to="//github.com/siddhant295"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-decoration-none"
              >
                Siddhant Srivastav
              </Link>{' | '}
              <Link
                to="//github.com/anushkabh"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-decoration-none"
              >
                Anushka Bhandari
              </Link>
            </p>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <small>&copy; {new Date().getFullYear()} Pragati. All Rights Reserved.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
