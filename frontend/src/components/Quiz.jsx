import React from 'react';
import '../styles/quiz.css';

const Quiz = () => {
  const subjects = [
    { title: 'Indian independence', mcqs: 35 },
    { title: 'Ashoka: The Great', mcqs: 45 },
    { title: 'The Mughals', mcqs: 40 },
  ];

  const englishSubjects = [
    { title: 'Shakespeare', mcqs: 30 },
    { title: 'Grammar', mcqs: 25 },
    { title: 'Literature', mcqs: 20 },
  ];

  return (
    <div className="quiz-container">
      <h1 className="quiz-header">HISTORY</h1>
      <div className="subject-list">
        {subjects.map((subject, index) => (
          <div className="subject-block" key={index}>
            <div className="subject-title">{subject.title}</div>
            <div className="mcq-count">{subject.mcqs} MCQS</div>
            <button className="attempt-quiz-button">Attempt Quiz</button>
          </div>
        ))}
      </div>
        <br/>
      <h1 className="quiz-header">ENGLISH</h1>
      <div className="subject-list">
        {englishSubjects.map((subject, index) => (
          <div className="subject-block" key={index}>
            <div className="subject-title">{subject.title}</div>
            <div className="mcq-count">{subject.mcqs} MCQS</div>
            <button className="attempt-quiz-button">Attempt Quiz</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Quiz;
