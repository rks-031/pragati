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
        const classId = localStorage.getItem('studentClass');
        if (!classId) {
          setError('Student class not found');
          return;
        }
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

  const renderSkeletonLoader = () => {
    return Array(2).fill().map((_, i) => (
      <div className="assessment-card skeleton-card" key={`skeleton-${i}`}>
        <div className="skeleton-image"></div>
        <div className="skeleton-content">
          <div className="skeleton-title"></div>
          <div className="skeleton-badge"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-button"></div>
        </div>
      </div>
    ));
  };

  const renderAssessmentCard = (assessment, index, isUpcoming = false) => {
    const currentDate = new Date();
    const endDate = new Date(assessment.end_date);
    const isExpired = endDate < currentDate;
    
    let daysRemaining = null;
    if (!isUpcoming && !isExpired && !assessment.attempted) {
      const diffTime = Math.abs(endDate - currentDate);
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    return (
      <div className="assessment-card" key={index}>
        <div className="assessment-card-inner">
          <div className="assessment-image">
            <img src={assessment.image || maths} alt={`${assessment.subject} resources`} />
            {assessment.attempted && (
              <div className="status-badge completed">
                <span>Completed</span>
              </div>
            )}
            {isExpired && !assessment.attempted && (
              <div className="status-badge expired">
                <span>Expired</span>
              </div>
            )}
            {isUpcoming && (
              <div className="status-badge upcoming">
                <span>Upcoming</span>
              </div>
            )}
          </div>
          <div className="assessment-content">
            <div className="assessment-header">
              <h3 className="assessment-title">{assessment.subject}</h3>
              {assessment.score && (
                <span className="score-badge" style={{ backgroundColor: assessment.color || '#A4B8C4' }}>
                  {assessment.score}
                </span>
              )}
            </div>
            <div className="assessment-dates">
              <div className="date-item">
                <span className="date-label">Start:</span>
                <span className="date-value">{formatDate(assessment.start_date)}</span>
              </div>
              <div className="date-item">
                <span className="date-label">End:</span>
                <span className="date-value">{formatDate(assessment.end_date)}</span>
              </div>
            </div>
            
            <div className="assessment-actions">
              {assessment.attempted ? (
                <div className="assessment-result">
                  <span className="result-label">Score:</span>
                  <span className="result-value">{assessment.score}</span>
                </div>
              ) : isExpired ? (
                <div className="tooltip-container">
                  <button className="btn-disabled" disabled>
                    Expired
                  </button>
                  <div className="tooltip-message">
                    <p>😔 Sorry, the final date to attempt this exam has passed. You cannot attempt it now. Be aware for next time! 🕒📚</p>
                  </div>
                </div>
              ) : !isUpcoming && (
                <div className="action-container">
                  <button 
                    className="btn-primary"
                    onClick={() => handleStartQuiz(assessment)}
                    disabled={!assessment.id}
                  >
                    Start Quiz
                  </button>
                  {daysRemaining && (
                    <span className="days-remaining">
                      {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining
                    </span>
                  )}
                </div>
              )}
              {isUpcoming && (
                <span className="upcoming-message">
                  Available from {formatDate(assessment.start_date)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAssessmentSection = (title, assessmentList, isUpcoming = false) => {
    return (
      <section className="assessment-section">
        <h2 className="section-title">{title}</h2>
        {loading ? (
          <div className="assessment-list">{renderSkeletonLoader()}</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="assessment-list">
            {(assessmentList || []).map((assessment, index) => 
              renderAssessmentCard(assessment, index, isUpcoming)
            )}
            {assessmentList?.length === 0 && (
              <div className="empty-state">
                <p>No {title.toLowerCase()} found</p>
              </div>
            )}
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <main className="assessments-container">
          {renderAssessmentSection("Active Assessments", assessments.active)}
          {renderAssessmentSection("Upcoming Assessments", assessments.upcoming, true)}
          {renderAssessmentSection("Previous Assessments", assessments.previous)}
        </main>
        
        <aside className="profile-container">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-image">
                <img src="https://placehold.co/150x150?text=Profile" alt="Student profile" />
              </div>
              <h2 className="profile-name">{studentReport.name}</h2>
            </div>
            
            <div className="report-section">
              <h3 className="report-title">Performance Report</h3>
              
              <div className="report-stats">
                <div className="stat-item">
                  <div className="stat-value">{studentReport.examGiven}</div>
                  <div className="stat-label">Exams Taken</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{studentReport.passedIn}</div>
                  <div className="stat-label">Passed</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{studentReport.failedIn}</div>
                  <div className="stat-label">Failed</div>
                </div>
              </div>
              
              <div className="grade-display">
                <div className="grade-circle">
                  <span className="grade-text">{studentReport.grade}</span>
                </div>
                <span className="grade-label">Overall Grade</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AssessmentDashboard;