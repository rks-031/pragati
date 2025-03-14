import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/modules.css";

const Modules = () => {
  const [courseContent, setCourseContent] = useState({});

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCourseContent(res.data.course_content);
      } catch (error) {
        console.error("Error fetching course content:", error);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="modules-container">
      <h1 className="modules-header">MODULES & COURSES</h1>

      {Object.entries(courseContent).map(([subject, topics]) => (
        <div key={subject} className="content-section">
          <h2 className="content-title">{subject}</h2>

          {Object.entries(topics).map(([topic, content]) => (
            <div key={topic} className="topic-section">
              <h3 className="topic-title">{topic}</h3>

              <div className="videos-container">
                {content.videos.map((video, index) => (
                  <div key={index} className="video-item">
                    <a href={video} target="_blank" rel="noopener noreferrer" className="video-link">
                      <div className="video-thumbnail">
                        <img src="https://placehold.co/280x160/navy/white?text=Video" alt={`Thumbnail for ${topic}`} className="video-img" />
                        <div className="play-button">▶</div>
                      </div>
                    </a>
                    <p className="video-label">Video {index + 1}</p>
                  </div>
                ))}
              </div>

              <div className="notes-container">
                {content.notes.map((note, index) => (
                  <a key={index} href={note} download className="pdf-link">
                    <img src="https://placehold.co/24x24/black/white?text=PDF" alt="PDF icon" className="pdf-icon" />
                    Download PDF {index + 1}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Modules;
