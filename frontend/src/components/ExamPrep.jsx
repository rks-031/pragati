import React from 'react';
import '../styles/exam.css';

const ExamPrep = () => {
  const subjects = [
    {
      name: 'HISTORY',
      color: 'purple',
      credit: '02',
      years: ['2024', '2023']
    },
    {
      name: 'ENGLISH',
      color: 'pink',
      credit: '02',
      years: ['2024', '2023']
    },
    {
      name: 'SCIENCE',
      color: 'blue',
      credit: '02',
      years: ['2024', '2023']
    }
  ];

  return (
    <div className="exam-prep-container">
      <h1 className="exam-prep-title">EXAM PREPARATION</h1>
      <div className="subject-cards">
        {subjects.map((subject, index) => (
          <div key={index} className={`subject-card ${subject.color}`}>
            <div className="card-left">
              <h2 className="subject-title">{subject.name}</h2>
              
              <div className="notes-button">
                <span className="icon">📚</span>
                <span className="button-text">NOTES</span>
              </div>
              
              <div className="pyq-items">
                {subject.years.map((year, yearIndex) => (
                  <div key={yearIndex} className="pyq-item">
                    <span className="icon">📄</span>
                    <span className="pyq-text">PYQ BANK {year}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card-right">
              <div className="syllabus-box">
                <div className="syllabus-label">SYLLABUS</div>
                <div className="credit-label">CREDIT {subject.credit}</div>
              </div>
              
              <div className="demo-quiz-button">
                <span className="quiz-text">DEMO<br />QUIZ</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamPrep;