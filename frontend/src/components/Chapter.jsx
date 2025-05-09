import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Container, Card, Modal, Button, Row, Col } from 'react-bootstrap';
import "../styles/chapter.css";

const Chapter = () => {
  const { subject, topic } = useParams();
  const { state } = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

  const handleModuleClick = (content) => {
    setSelectedContent(content);
    setShowModal(true);
  };

  const handleDownloadNotes = async (notesUrl) => {
    try {
      const response = await fetch(notesUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Extract filename from URL or use default name
      const filename = notesUrl.substring(notesUrl.lastIndexOf('/') + 1) || 'notes.pdf';
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading notes:', error);
    }
  };

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">{subject} - {topic}</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {Object.entries(state.modules).map(([module, content]) => (
          <Col key={module}>
            <Card 
              className="h-100 shadow-sm cursor-pointer" 
              onClick={() => handleModuleClick(content)}
            >
              <Card.Body>
                <Card.Title>{module.replace(/mod-\d+:/, "Module ")}</Card.Title>
                <Card.Text>
                  <small className="text-muted">
                    Click to View Contents
                  </small>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Title className='text-center'>Module Content</Modal.Title>
        <Modal.Body>
          {selectedContent?.videos?.[0] && (
            <div className="ratio ratio-16x9 mb-1">
              <iframe
                src={selectedContent.videos[0]}
                title="Module Video"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button 
            variant="primary"
            onClick={() => selectedContent?.notes?.[0] && handleDownloadNotes(selectedContent.notes[0])}
            disabled={!selectedContent?.notes?.[0]}
          >
            Download Notes
          </Button>
          <Button 
            variant="secondary"
            onClick={() => selectedContent?.notes?.[0] && window.open(selectedContent.notes[0], '_blank')}
            disabled={!selectedContent?.notes?.[0]}
          >
            View Notes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Chapter;