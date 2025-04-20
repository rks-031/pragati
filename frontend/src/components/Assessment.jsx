import React, { useState, useEffect } from 'react';
import axios from '../axiosConfig';
import studyingImage from '../assets/studying.webp';
import maths from '../assets/maths.png';
import '../styles/assessment.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const AssessmentDashboard = () => {
  const { userName } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [assessments, setAssessments] = useState({
    previous: [],
    active: [],
    upcoming: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const classId = localStorage.getItem('studentClass') || '5'; // Fetch student's class
        const response = await axios.get(`/api/v1/get_assessments/${classId}`);
        
        if (response.data.status === 'success') {
          setAssessments({
            previous: response.data.data.previous_assessments,
            active: response.data.data.active_assessments,
            upcoming: response.data.data.upcoming_assessments
          });
        }
      } catch (err) {
        setError('Failed to load assessments');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  const studentReport = {
    name: userName?.toUpperCase() || 'STUDENT',
    examGiven: '03',
    passedIn: '03',
    failedIn: '00',
    grade: '8/10'
  };

  const handleStartQuiz = (assessment) => {
    console.log('Starting quiz for assessment:', assessment);
    if (!assessment.id) {
      console.error('No assessment ID found:', assessment);
      return;
    }
    navigate(`/quiz/${assessment.id}`);
  };

  const renderAssessmentCard = (assessment, index, isUpcoming = false) => {
    const currentDate = new Date();
    const endDate = new Date(assessment.end_date);
    const isExpired = endDate < currentDate;

    return (
      <div className="card mb-3" key={index}>
        <div className="row g-0">
          <div className="col-md-4">
            <img src={assessment.image || maths} className="img-fluid rounded-start" alt={`${assessment.subject} resources`} />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h5 className="card-title">{assessment.subject}</h5>
              <span className="badge" style={{ backgroundColor: assessment.color || '#A4B8C4' }}>
                {assessment.score}
              </span>
              <p className="card-text">
                <small className="text-muted">Start: {formatDate(assessment.start_date)}</small><br />
                <small className="text-muted">End: {formatDate(assessment.end_date)}</small>
              </p>
            </div>
            <div className="card-footer">
              {assessment.attempted ? (
                <div className="text-success">
                  Completed - Score: {assessment.score}
                </div>
              ) : isExpired ? (
                <div className="tooltip-container">
                  <button 
                    className="btn btn-secondary" 
                    disabled
                  >
                    Start Quiz
                  </button>
                  <div className="tooltip-message">
                    😔 Sorry, the final date to attempt this exam has been passed. You cannot attempt it now. Be aware from next time! 🕒📚
                  </div>
                </div>
              ) : !isUpcoming && (
                <button 
                  className="btn btn-primary"
                  onClick={() => handleStartQuiz(assessment)}
                  disabled={!assessment.id}
                >
                  Start Quiz
                </button>
              )}
              {isUpcoming && (
                <span className="text-muted">
                  Available from {formatDate(assessment.start_date)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8">
          <div className="text-center mb-4">
            <img src={studyingImage} alt="Student studying" className="img-fluid" style={{ height: '300px' }} />
          </div>
          
          <h2 className="section-title">Active Assessments</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div className="assessment-cards">
              {(assessments.active || []).map((assessment, index) => 
                renderAssessmentCard(assessment, index)
              )}
              {assessments.active?.length === 0 && (
                <p>No active assessments available</p>
              )}
            </div>
          )}
          
          <h2 className="section-title">Upcoming Assessments</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div className="assessment-cards">
              {(assessments.upcoming || []).map((assessment, index) => 
                renderAssessmentCard(assessment, index, true)
              )}
              {assessments.upcoming?.length === 0 && (
                <p>No upcoming assessments scheduled</p>
              )}
            </div>
          )}
          
          <h2 className="section-title">Previous Assessments</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <div className="assessment-cards">
              {(assessments.previous || []).map((assessment, index) => 
                renderAssessmentCard(assessment, index)
              )}
              {assessments.previous?.length === 0 && (
                <p>No previous assessments found</p>
              )}
            </div>
          )}
        </div>
        
        <div className="col-md-4">
          <div className="profile-section">
            <div className="text-center mb-3">
              <img src="https://placehold.co/150x150?text=Profile" alt="Student profile" className="img-fluid rounded-circle" />
            </div>
            <h2 className="student-name">{studentReport.name}</h2>
            <div className="report-header">REPORT</div>
            
            <div className="report-card">
              <div className="report-item">
                <span className="report-label">Exam given:</span>
                <span className="report-value">{studentReport.examGiven}</span>
              </div>
              <div className="report-item">
                <span className="report-label">Passed in:</span>
                <span className="report-value">{studentReport.passedIn}</span>
              </div>
              <div className="report-item">
                <span className="report-label">Failed in:</span>
                <span className="report-value">{studentReport.failedIn}</span>
              </div>
              <div className="grade-container">
                <span className="grade-label">Grade:</span>
                <span className="grade-value">{studentReport.grade}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentDashboard;