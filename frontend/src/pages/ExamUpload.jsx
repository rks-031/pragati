import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import axios from "../axiosConfig";
import "react-datepicker/dist/react-datepicker.css";

const ExamUpload = () => {
    const [courseContent, setCourseContent] = useState(null);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedChapters, setSelectedChapters] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [questionPaper, setQuestionPaper] = useState(null);
    const [loading, setLoading] = useState(true);

    // Class options from 1 to 10
    const classOptions = Array.from({ length: 10 }, (_, i) => i + 1);

    useEffect(() => {
        const fetchCourseContent = async () => {
            try {
                const response = await axios.get("/api/v1/courses");
                setCourseContent(response.data.content || {});
            } catch (err) {
                console.error("Error fetching course content:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseContent();
    }, []);

    // Get available subjects from course content
    const subjects = courseContent ? Object.keys(courseContent) : [];

    // Get available chapters for selected subject
    const chapters = selectedSubject && courseContent
        ? Object.keys(courseContent[selectedSubject])
        : [];

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('class', selectedClass);
        formData.append('subject', selectedSubject);
        formData.append('chapters', JSON.stringify(selectedChapters));
        formData.append('startDate', startDate.toISOString());
        formData.append('endDate', endDate.toISOString());
        formData.append('questionPaper', questionPaper);

        try {
            const response = await axios.post('/api/v1/upload-exam', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                alert('Exam uploaded successfully!');
                // Reset form
                setSelectedClass('');
                setSelectedSubject('');
                setSelectedChapters([]);
                setStartDate(null);
                setEndDate(null);
                setQuestionPaper(null);
            }
        } catch (error) {
            console.error('Error uploading exam:', error);
            alert('Failed to upload exam');
        }
    };

    if (loading) return <div className="text-center mt-3">Loading course content...</div>;

    return (
        <Container fluid className="py-4 px-4" style={{ maxWidth: '1200px' }}>
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-center mb-2">Upload Question Paper</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-2">
                                <Form.Label>Class</Form.Label>
                                <Form.Select
                                    value={selectedClass}
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    required
                                >
                                    <option value="">Select Class</option>
                                    {classOptions.map((cls) => (
                                        <option key={cls} value={cls}>Class {cls}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label>Subject</Form.Label>
                                <Form.Select
                                    value={selectedSubject}
                                    onChange={(e) => {
                                        setSelectedSubject(e.target.value);
                                        setSelectedChapters([]);
                                    }}
                                    required
                                >
                                    <option value="">Select Subject</option>
                                    {subjects.map((subject) => (
                                        <option key={subject} value={subject}>{subject}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label>Chapters</Form.Label>
                                <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                    {chapters.map((chapter) => (
                                        <Form.Check
                                            key={chapter}
                                            type="checkbox"
                                            id={`chapter-${chapter}`}
                                            label={chapter}
                                            checked={selectedChapters.includes(chapter)}
                                            onChange={(e) => {
                                                setSelectedChapters(prev =>
                                                    e.target.checked
                                                        ? [...prev, chapter]
                                                        : prev.filter(ch => ch !== chapter)
                                                );
                                            }}
                                            className="mb-2"
                                        />
                                    ))}
                                    {chapters.length === 0 && (
                                        <p className="text-muted mb-0">Select a subject to view chapters</p>
                                    )}
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label>Exam Duration</Form.Label>
                                <div className="d-flex gap-3">
                                    <DatePicker
                                        selected={startDate}
                                        onChange={date => setStartDate(date)}
                                        selectsStart
                                        startDate={startDate}
                                        endDate={endDate}
                                        className="form-control"
                                        placeholderText="Start Date"
                                        required
                                    />
                                    <DatePicker
                                        selected={endDate}
                                        onChange={date => setEndDate(date)}
                                        selectsEnd
                                        startDate={startDate}
                                        endDate={endDate}
                                        minDate={startDate}
                                        className="form-control"
                                        placeholderText="End Date"
                                        required
                                    />
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-2">
                                <Form.Label>Question Paper</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={(e) => setQuestionPaper(e.target.files[0])}
                                    accept=".pdf,.doc,.docx"
                                    required
                                />
                                <Form.Text className="text-muted">
                                    Accepted formats: PDF, DOC, DOCX
                                </Form.Text>
                            </Form.Group>

                            <div className="text-center">
                                <Button variant="success" type="submit" size="md">
                                    Upload Exam
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ExamUpload;