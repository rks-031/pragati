import React, { useEffect, useState } from "react";
import axios from "../axiosConfig";

const Modules = () => {
  const [courseContent, setCourseContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        const response = await axios.get("/api/v1/courses");
        console.log("Response data:", response.data);
        setCourseContent(response.data.content || {}); 
      } catch (err) {
        console.error("Error fetching course content:", err);
        setError("Failed to load course content.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseContent();
  }, []);

  if (loading) return <p>Loading course content...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!courseContent || Object.keys(courseContent).length === 0) {
    return <p>No course content available.</p>;
  }

  return (
    <div>
      <h2>Your Course Modules</h2>
      {Object.entries(courseContent).map(([subject, subjectContent]) => (
        <div key={subject}>
          <h3>{subject}</h3>
          {Object.entries(subjectContent).map(([topic, modules]) => (
            <div key={topic} style={{ marginLeft: "20px" }}>
              <h4>{topic}</h4>
              {Object.entries(modules).map(([module, content]) => (
                <div key={module} style={{ marginLeft: "40px" }}>
                  <h5>{module.replace(/mod-\d+:/, "Module ")} </h5>
                  <p>Videos:</p>
                  <ul>
                    {content.videos?.length > 0 ? (
                      content.videos.map((video, index) => (
                        <li key={index}>
                          <a href={video} target="_blank" rel="noopener noreferrer">
                            {video}
                          </a>
                        </li>
                      ))
                    ) : (
                      <li>No videos available</li>
                    )}
                  </ul>
                  <p>Notes:</p>
                  <ul>
                    {content.notes?.length > 0 ? (
                      content.notes.map((note, index) => (
                        <li key={index}>
                          <a href={note} target="_blank" rel="noopener noreferrer">
                            {note}
                          </a>
                        </li>
                      ))
                    ) : (
                      <li>No notes available</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Modules;
