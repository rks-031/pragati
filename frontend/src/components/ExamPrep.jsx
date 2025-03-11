import React from 'react';
import '../styles/exam.css';

const ExamPrep = () => {
  return (
    <div className="exam-prep-container">
      <h1 className="exam-prep-title">EXAM PREPARATION</h1>
      
      <div className="subject-cards">
        {/* History Card */}
        <div className="subject-card purple">
          <div className="card-left">
            <h2 className="subject-title">HISTORY</h2>
            
            <div className="notes-button" style={{ textAlign: 'left' }}>
              <span className="icon">📚</span> NOTES
            </div>
            
            <div className="pyq-items">
              <div className="pyq-item">
                <span className="icon">📄</span>
                <span className="pyq-text">PYQ BANK 2024</span>
              </div>
              
              <div className="pyq-item">
                <span className="icon">📄</span>
                <span className="pyq-text">PYQ BANK 2023</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* English Card */}
        <div className="subject-card pink">
          <div className="card-left">
            <h2 className="subject-title">ENGLISH</h2>
            
            <div className="notes-button" style={{ textAlign: 'left' }}>
              <span className="icon">📚</span> NOTES
            </div>
            
            <div className="pyq-items">
              <div className="pyq-item">
                <span className="icon">📄</span>
                <span className="pyq-text">PYQ BANK 2024</span>
              </div>
              
              <div className="pyq-item">
                <span className="icon">📄</span>
                <span className="pyq-text">PYQ BANK 2023</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Science Card */}
        <div className="subject-card blue">
          <div className="card-left">
            <h2 className="subject-title">SCIENCE</h2>
            
            <div className="notes-button" style={{ textAlign: 'left' }}>
              <span className="icon">📚</span> NOTES
            </div>
            
            <div className="pyq-items">
              <div className="pyq-item">
                <span className="icon">📄</span>
                <span className="pyq-text">PYQ BANK 2024</span>
              </div>
              
              <div className="pyq-item">
                <span className="icon">📄</span>
                <span className="pyq-text">PYQ BANK 2023</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPrep;