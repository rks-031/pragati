import React, { useState, useEffect, useMemo } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import axios from "../axiosConfig";
import { useAuth } from '../context/AuthContext';
import "react-datepicker/dist/react-datepicker.css";

const ExamUpload = () => {
    const { userName, userRole, qualification } = useAuth();
    const [courseContent, setCourseContent] = useState(null);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedChapters, setSelectedChapters] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [questionPaper, setQuestionPaper] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allowedClasses, setAllowedClasses] = useState([]);
    const [error, setError] = useState('');

    const getTeacherAllowedClasses = (qualification) => {
        const juniorQualifications = ["JUNIOR", "ELEMENTARY", "BED", "DIPLOMA"];
        const seniorQualifications = ["TGT", "PGT"];

        if (juniorQualifications.includes(qualification)) {
            return Array.from({ length: 5 }, (_, i) => (i + 1).toString());
        } else if (seniorQualifications.includes(qualification)) {
            return Array.from({ length: 5 }, (_, i) => (i + 6).toString());
        }
        return [];
    };
    const parseContentStructure = (rawContent) => {
        const organized = {};
        
        // Iterate through each class
        Object.entries(rawContent).forEach(([classNum, classContent]) => {
            organized[classNum] = {};
            
            // Iterate through subjects
            Object.entries(classContent).forEach(([subject, chapters]) => {
                if (subject !== 'videos' && subject !== 'notes') {
                    organized[classNum][subject] = Object.keys(chapters);
                }
            });
        });
        
        return organized;
    };
    useEffect(() => {
        const fetchCourseContent = async () => {
            try {
                const response = await axios.get("/api/v1/courses");
                console.log("Raw course content structure:", {
                    classes: Object.keys(response.data.content),
                    sampleClass: response.data.content['5'],
                    subjects: Object.keys(response.data.content['5'] || {})
                });
    
                const coursesByClass = parseContentStructure(response.data.content || {});
                console.log("Organized course content:", coursesByClass);
                
                const teacherAllowedClasses = getTeacherAllowedClasses(qualification);
                const filteredClasses = Object.keys(coursesByClass)
                    .filter(cls => teacherAllowedClasses.includes(cls));
    
                setAllowedClasses(filteredClasses);
                setCourseContent(coursesByClass);
            } catch (err) {
                console.error("Error fetching course content:", err);
                setError('Failed to fetch course content. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
    
        if (qualification) {
            fetchCourseContent();
        }
    }, [qualification]);
    const subjects = useMemo(() => {
        if (!selectedClass || !courseContent || !courseContent[selectedClass]) {
            return [];
        }
        console.log("Getting subjects for class:", selectedClass, courseContent[selectedClass]);
        return Object.keys(courseContent[selectedClass]);
    }, [selectedClass, courseContent]);

    // Update chapters memo
    const chapters = useMemo(() => {
        if (!selectedClass || !selectedSubject || !courseContent?.[selectedClass]?.[selectedSubject]) {
            return [];
        }
        console.log("Getting chapters for subject:", selectedSubject, courseContent[selectedClass][selectedSubject]);
        return courseContent[selectedClass][selectedSubject];
    }, [selectedClass, selectedSubject, courseContent]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
    
        // Validate form data
        if (!startDate || !endDate) {
            setError('Please select both start and end dates');
            return;
        }
    
        if (!questionPaper) {
            setError('Please select a question paper file');
            return;
        }
    
        if (selectedChapters.length === 0) {
            setError('Please select at least one chapter');
            return;
        }
    
        const formData = new FormData();
        formData.append('class_name', selectedClass);
        formData.append('subject', selectedSubject);
        formData.append('chapters', JSON.stringify(selectedChapters));
        formData.append('start_date', startDate.toISOString().split('T')[0]);
        formData.append('end_date', endDate.toISOString().split('T')[0]);
        formData.append('file', questionPaper);
    
        try {
            const response = await axios.post('/api/v1/upload_assessment', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            if (response.status === 200) {
                alert('Assessment uploaded successfully!');
                // Reset form
                setSelectedClass('');
                setSelectedSubject('');
                setSelectedChapters([]);
                setStartDate(null);
                setEndDate(null);
                setQuestionPaper(null);
            }
        } catch (error) {
            console.error('Error uploading assessment:', error);
            const errorMessage = error.response?.data?.detail || 'Failed to upload assessment';
            setError(errorMessage);
            
            // Log detailed error information
            if (error.response) {
                console.log('Error response:', {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                });
            }
        }
    };
    if (loading) return <div className="text-center mt-3">Loading course content...</div>;

    return (
        <Container fluid className="py-4 px-4" style={{ maxWidth: '1200px' }}>
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-center mb-2">Upload Question Paper</h2>
                        {error && <Alert variant="danger">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-2">
                                <Form.Label>Class</Form.Label>
                                <Form.Select
                                    value={selectedClass}
                                    onChange={(e) => {
                                        setSelectedClass(e.target.value);
                                        setSelectedSubject('');
                                        setSelectedChapters([]);
                                    }}
                                    required
                                >
                                    <option value="">Select Class</option>
                                    {allowedClasses.map((cls) => (
                                        <option key={cls} value={cls}>{cls}</option>
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
                                    disabled={!selectedClass}
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
                                        <p className="text-muted mb-0">
                                            {!selectedClass
                                                ? 'Select a class first'
                                                : !selectedSubject
                                                    ? 'Select a subject to view chapters'
                                                    : 'No chapters available'}
                                        </p>
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
                                        minDate={new Date()}
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
                                <Form.Label>Add Question Paper</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={(e) => setQuestionPaper(e.target.files[0])}
                                    accept=".pdf,.doc,.docx"
                                    required
                                />
                                {/* <Form.Text className="text-muted">
                                    Accepted formats: PDF, DOC, DOCX
                                </Form.Text> */}
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