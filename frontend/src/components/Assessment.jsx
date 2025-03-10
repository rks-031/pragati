import React from 'react';
import '../styles/assessment.css';
import studyingImage from '../assets/studying.webp';

const AssessmentDashboard = () => {
  // Previous assessment data
  const previousAssessments = [
    { subject: 'Maths', score: '07/10', color: '#A4B8C4', image: 'https://placehold.co/100x100?text=Books' },
    { subject: 'Hindi', score: '08/10', color: '#D9A566', image: 'https://placehold.co/100x100?text=Notebook' },
    { subject: 'E.V.S', score: '09/10', color: '#C99A9A', image: 'https://placehold.co/100x100?text=Books' }
  ];

  // Upcoming assessment data
  const upcomingAssessments = [
    { subject: 'English', score: '00/10', color: '#A4B8C4', image: 'https://placehold.co/100x100?text=Books' },
    { subject: 'History', score: '00/10', color: '#D9A566', image: 'https://placehold.co/100x100?text=Books' },
    { subject: 'Science', score: '00/10', color: '#C99A9A', image: 'https://placehold.co/100x100?text=Books' }
  ];

  // Student report data
  const studentReport = {
    name: 'ARYAN VERMA',
    examGiven: '03',
    passedIn: '03',
    failedIn: '00',
    grade: '8/10'
  };

  return (
    <div className="assessment-dashboard">
      <div className="dashboard-left">
        <div className="dashboard-header-image"
         style={{ height: '300px' }}>
          <img 
            src={studyingImage} 
            alt="Student studying at a desk with computer and books" 
            className="header-illustration"
           
          />
        </div>
        
        <h2 className="section-title">Previous Assessments</h2>
        <div className="assessment-cards">
          {previousAssessments.map((assessment, index) => (
            <div className="assessment-card" key={index}>
              <div className="card-image">
                <img src={assessment.image} alt={`${assessment.subject} books`} />
              </div>
              <div className="card-details">
                <span className="subject-name">{assessment.subject}</span>
                <span className="score-badge" style={{ backgroundColor: assessment.color }}>
                  {assessment.score}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <h2 className="section-title">Upcoming Assessments</h2>
        <div className="assessment-cards">
          {upcomingAssessments.map((assessment, index) => (
            <div className="assessment-card" key={index}>
              <div className="card-image">
                <img src={assessment.image} alt={`${assessment.subject} books`} />
              </div>
              <div className="card-details">
                <span className="subject-name">{assessment.subject}</span>
                <span className="score-badge" style={{ backgroundColor: assessment.color }}>
                  {assessment.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="dashboard-right">
        <div className="profile-section">
          <div className="profile-image-container">
            <img 
              src="https://placehold.co/150x150?text=Profile" 
              alt="Student profile picture" 
              className="profile-image"
            />
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
              <span className="report-label">failed in:</span>
              <span className="report-value">{studentReport.failedIn}</span>
            </div>
            <div className="grade-container">
              <span className="grade-label">grade:</span>
              <span className="grade-value">{studentReport.grade}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentDashboard;