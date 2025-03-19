import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { Card, Container, Row, Col, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const cardColors = [
  'primary',
  'success',
  'danger',
  'warning',
  'info',
  'secondary'
];

const Modules = () => {
  const [courseContent, setCourseContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        const response = await axios.get("/api/v1/courses");
        setCourseContent(response.data.content || {}); 
      } catch (err) {
        console.error("Error fetching course content:", err);
        setError("Failed to load course content.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseContent();
  }, []);

  const handleChapterClick = (subject, topic) => {
    navigate(`/chapter/${subject}/${topic}`, { 
      state: { modules: courseContent[subject][topic] }
    });
  };

  if (loading) return <div className="text-center mt-5">Loading course content...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;
  if (!courseContent || Object.keys(courseContent).length === 0) {
    return <div className="text-center mt-5">No course content available.</div>;
  }

  return (
    <Container className="py-4">
      <h2 className="text-center mb-4">Your Courses</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {Object.entries(courseContent).map(([subject, subjectContent], index) => (
          <Col key={subject}>
            <Card className="h-100 shadow-sm">
              <Card.Header className={`bg-${cardColors[index % cardColors.length]} text-white`}>
                <h4 className="mb-0">{subject}</h4>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {Object.keys(subjectContent).map((topic) => (
                    <ListGroup.Item 
                      key={topic}
                      action
                      onClick={() => handleChapterClick(subject, topic)}
                      className="d-flex justify-content-between align-items-center"
                    >
                      {topic}
                      <i className="bi bi-chevron-right"></i>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Modules;