import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Container, Card, Modal, Button, Row, Col } from 'react-bootstrap';
import "../styles/chapter.css";
import { saveFileToIndexedDB, getFileFromIndexedDB } from '../utils/indexedDB'; // Import IndexedDB utility

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

  const handleDownloadVideo = async (videoUrl, filename) => {
    try {
      // Check if the file already exists in IndexedDB
      const existingFile = await getFileFromIndexedDB(filename);
      if (existingFile) {
        alert('This video is already downloaded!');
        return;
      }

      // Fetch the video file
      const response = await fetch(videoUrl);
      const blob = await response.blob();

      // Save the video to IndexedDB
      await saveFileToIndexedDB(filename, blob);
      alert('Video downloaded successfully!');
    } catch (error) {
      console.error('Error downloading video:', error);
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
          {selectedContent?.videos?.map((videoUrl, index) => (
            <div key={index} className="mb-3">
              <div className="ratio ratio-16x9 mb-1">
                <iframe
                  src={videoUrl}
                  title={`Module Video ${index + 1}`}
                  allowFullScreen
                ></iframe>
              </div>
              <Button
                variant="primary"
                onClick={() => handleDownloadVideo(videoUrl, `${selectedContent.moduleName}_video_${index + 1}.mp4`)}
              >
                Download Video
              </Button>
            </div>
          ))}
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