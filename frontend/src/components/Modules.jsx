import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";
import { Card, Container, Row, Col, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const subjectColors = {
  English: '#FFDD57',
  Maths: '#4A90E2',
  Science: '#FF6B6B',
  History: '#7ED321',
  Geography: '#F5A623',
  Art: '#9013FE'
};

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
      <h2 className="text-center mb-4" style={{ fontSize: '3rem', fontFamily: 'Arial Rounded MT Bold', color: '#FF6F61' }}>Your Courses</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {Object.entries(courseContent).map(([subject, subjectContent]) => (
          <Col key={subject}>
            <Card className="h-100 shadow-sm" style={{ borderRadius: '20px', overflow: 'hidden', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <Card.Header className={`text-white`} style={{ backgroundColor: subjectColors[subject] || '#FF6F61', fontSize: '2rem', fontFamily: 'Arial Rounded MT Bold' }}>
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
                      style={{ fontSize: '1.5rem', fontFamily: 'Arial Rounded MT Bold', cursor: 'pointer', transition: 'background-color 0.3s', backgroundColor: '#F9F9F9' }}
                    >
                      {topic}
                      <FaArrowRight style={{ fontSize: '2rem', color: subjectColors[subject] || '#FF6F61' }} />
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