import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../axiosConfig';
import '../styles/quizPortal.css';

const QuizPortal = () => {
  const { assessmentId } = useParams();
  const { userName } = useAuth();
  const navigate = useNavigate();
  
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get(`/api/v1/get_quiz/${assessmentId}`);
        const extractedText = response.data.extracted_text;
        const parsedQuestions = parseExtractedText(extractedText);
        setQuizData(parsedQuestions);
      } catch (error) {
        setError('Failed to load quiz data');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [assessmentId]);

  const parseExtractedText = (text) => {
    const questions = [];
    const lines = text.split('\n');
    let currentQuestion = null;

    lines.forEach(line => {
      // Match question line starting with number
      if (line.match(/^\d+\./)) {
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        currentQuestion = {
          question: line.replace(/^\d+\./, '').trim(),
          options: [],
          correctAnswer: ''
        };
      } 
      // Match option lines starting with A), B), C), or D)
      else if (line.match(/^[A-D]\)/)) {
        currentQuestion?.options.push({
          text: line.trim(),
          id: line.match(/^[A-D]/)[0]
        });
      } 
      // Match answer line and extract the correct letter
      else if (line.includes('Answer:')) {
        // Extract everything after "Answer:" and find the letter
        const answerPart = line.split('Answer:')[1].trim();
        // Match the first occurrence of A, B, C, or D
        const answerMatch = answerPart.match(/[A-D]/);
        if (answerMatch) {
          currentQuestion.correctAnswer = answerMatch[0];
        }
      }
    });

    // Don't forget to push the last question
    if (currentQuestion) {
      questions.push(currentQuestion);
    }

    // Debug log to verify answers
    console.log('Parsed questions:', questions);
    return questions;
  };

  const handleOptionSelect = (optionId) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion]: optionId
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    Object.entries(selectedAnswers).forEach(([questionIndex, selectedOption]) => {
      if (quizData[questionIndex].correctAnswer === selectedOption) {
        correctAnswers++;
      }
    });
    return correctAnswers;
  };

  const handleFinish = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setShowResults(true);
  };

  const handleSubmit = async () => {
    setQuizSubmitted(true);

    const submissions = Object.entries(selectedAnswers).map(([index, answer]) => ({
      questionIndex: parseInt(index),
      selected: answer
    }));

    try {
      const response = await axios.post(`/api/v1/mark_assessment_attempted/${assessmentId}`, {
        score: `${calculateScore()}/${quizData.length}`
      });

      navigate('/assessment', {
        state: { 
          message: 'Quiz completed successfully!',
          score: response.data.score
        }
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      setError('Failed to submit quiz');
    }
  };

  if (loading) return <div className="quiz-loading">Loading quiz...</div>;
  if (error) return <div className="quiz-error">{error}</div>;
  if (!quizData) return <div className="quiz-error">No quiz data available</div>;

  if (showResults) {
    return (
      <div className="quiz-results container">
        <h2>Quiz Results</h2>
        <div className="score-card">
          <p>Student: {userName}</p>
          <p>Total Questions: {quizData.length}</p>
          <p>Correct Answers: {score}</p>
          <p>Score: {Math.round((score / quizData.length) * 100)}%</p>
        </div>
        <div className="answers-review">
          {quizData.map((question, index) => (
            <div key={index} className="question-review">
              <p>{question.question}</p>
              <p className={selectedAnswers[index] === question.correctAnswer ? 'correct' : 'incorrect'}>
                Your Answer: {selectedAnswers[index] || 'Not answered'}
                {selectedAnswers[index] !== question.correctAnswer && 
                  ` (Correct: ${question.correctAnswer})`}
              </p>
            </div>
          ))}
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/assessment')}>
          Back to Assessments
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-container container">
      <div className="quiz-header">
        <h2>Quiz</h2>
        <p>Question {currentQuestion + 1} of {quizData.length}</p>
      </div>

      <div className="question-card">
        <h3>{quizData[currentQuestion].question}</h3>
        <div className="options-list">
          {quizData[currentQuestion].options.map((option) => (
            <button
              key={option.id}
              className={`option-button ${
                selectedAnswers[currentQuestion] === option.id ? 'selected' : ''
              }`}
              onClick={() => handleOptionSelect(option.id)}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>

      <div className="navigation-buttons">
        <button 
          className="btn btn-secondary" 
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </button>
        {currentQuestion === quizData.length - 1 ? (
          <button 
            className="btn btn-success" 
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length < quizData.length}
          >
            Finish Quiz
          </button>
        ) : (
          <button 
            className="btn btn-primary" 
            onClick={handleNext}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPortal;