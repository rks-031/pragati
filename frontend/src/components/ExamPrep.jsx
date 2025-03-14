import React from 'react';
import '../styles/exam.css';

const ExamPrep = () => {
  return (
    <div className="exam-prep-container">
      <h1 className="exam-prep-title">EXAM PREPARATION</h1>
      
      <div className="subject-cards">
        {/* History Card */}
        <div className="subject-card purple">
          <div className="card-content">
            <h2 className="subject-title">HISTORY</h2>
            <div className="notes-item">NOTES</div>
            <div className="pyq-item">PYQ BANK 2024</div>
            <div className="pyq-item">PYQ BANK 2023</div>
            <div className="syllabus-button">
              Syllabus <span className="credit-label">CREDIT 02</span>
            </div>
            <button className="demo-quiz-button">DEMO QUIZ</button>
          </div>
        </div>
        
        {/* English Card */}
        <div className="subject-card pink">
          <div className="card-content">
            <h2 className="subject-title">ENGLISH</h2>
            <div className="notes-item">NOTES</div>
            <div className="pyq-item">PYQ BANK 2024</div>
            <div className="pyq-item">PYQ BANK 2023</div>
            <div className="syllabus-button">
              Syllabus <span className="credit-label">CREDIT 02</span>
            </div>
            <button className="demo-quiz-button">DEMO QUIZ</button>
          </div>
        </div>
        
        {/* Science Card */}
        <div className="subject-card teal">
          <div className="card-content">
            <h2 className="subject-title">SCIENCE</h2>
            <div className="notes-item">NOTES</div>
            <div className="pyq-item">PYQ BANK 2024</div>
            <div className="pyq-item">PYQ BANK 2023</div>
            <div className="syllabus-button">
              Syllabus <span className="credit-label">CREDIT 02</span>
            </div>
            <button className="demo-quiz-button">DEMO QUIZ</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPrep;