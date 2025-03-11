import React from 'react';
import '../styles/modules.css';

const Modules = () => {
  return (
    <div className="modules-container">
      <h1 className="modules-header">MODULES & COURSES</h1>
      
      <div className="subject-buttons">
        <button className="subject-btn">Elementary Maths</button>
        <button className="subject-btn">E.V.S</button>
        <button className="subject-btn">Hindi</button>
      </div>

      <div className="content-section">
        <h2 className="content-title">Elementary Maths</h2>
        
        <div className="topic-section">
          <h3 className="topic-title">Rational Numbers</h3>
          <div className="videos-container">
            <div className="video-item">
              <a 
                href="https://placehold.co/320x180/navy/white?text=Video+1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="video-link"
              >
                <div className="video-thumbnail">
                  <img 
                    src="https://placehold.co/280x160/navy/white?text=Video+1" 
                    alt="Rational Numbers Video 1 Thumbnail"
                    className="video-img"
                  />
                  <div className="play-button">▶</div>
                </div>
              </a>
              <p className="video-label">video 1</p>
              <a 
                href="path-to-pdf-file.pdf" 
                download 
                className="pdf-link"
              >
                <img 
                  src="https://placehold.co/24x24/black/white?text=PDF" 
                  alt="PDF icon" 
                  className="pdf-icon"
                />
                Download PDF
              </a>
            </div>
            
            <div className="video-item">
              <a 
                href="https://placehold.co/320x180/navy/white?text=Video+2" 
                target="_blank" 
                rel="noopener noreferrer"
                className="video-link"
              >
                <div className="video-thumbnail">
                  <img 
                    src="https://placehold.co/280x160/navy/white?text=Video+2" 
                    alt="Rational Numbers Video 2 Thumbnail"
                    className="video-img"
                  />
                  <div className="play-button">▶</div>
                </div>
              </a>
              <p className="video-label">video 2</p>
              <a 
                href="path-to-pdf-file.pdf" 
                download 
                className="pdf-link"
              >
                <img 
                  src="https://placehold.co/24x24/black/white?text=PDF" 
                  alt="PDF icon" 
                  className="pdf-icon"
                />
                Download PDF
              </a>
            </div>
          </div>
        </div>

        <div className="topic-section">
          <h3 className="topic-title">Polynomials</h3>
          <div className="videos-container">
            <div className="video-item">
              <a 
                href="https://placehold.co/320x180/navy/white?text=Video+1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="video-link"
              >
                <div className="video-thumbnail">
                  <img 
                    src="https://placehold.co/280x160/navy/white?text=Video+1" 
                    alt="Polynomials Video 1 Thumbnail"
                    className="video-img"
                  />
                  <div className="play-button">▶</div>
                </div>
              </a>
              <p className="video-label">video 1</p>
              <a 
                href="path-to-pdf-file.pdf" 
                download 
                className="pdf-link"
              >
                <img 
                  src="https://placehold.co/24x24/black/white?text=PDF" 
                  alt="PDF icon" 
                  className="pdf-icon"
                />
                Download PDF
              </a>
            </div>
            
            <div className="video-item">
              <a 
                href="https://placehold.co/320x180/navy/white?text=Video+2" 
                target="_blank" 
                rel="noopener noreferrer"
                className="video-link"
              >
                <div className="video-thumbnail">
                  <img 
                    src="https://placehold.co/280x160/navy/white?text=Video+2" 
                    alt="Polynomials Video 2 Thumbnail"
                    className="video-img"
                  />
                  <div className="play-button">▶</div>
                </div>
              </a>
              <p className="video-label">video 2</p>
              <a 
                href="path-to-pdf-file.pdf" 
                download 
                className="pdf-link"
              >
                <img 
                  src="https://placehold.co/24x24/black/white?text=PDF" 
                  alt="PDF icon" 
                  className="pdf-icon"
                />
                Download PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modules;
