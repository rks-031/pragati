import React, { useEffect, useState } from 'react';
import { getFileFromIndexedDB, deleteExpiredFiles } from '../utils/indexedDB';
import thumbnail from '../assets/thumbnail-image.jpg';

const EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

const MyDownloads = () => {
  const [downloads, setDownloads] = useState([]);

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        await deleteExpiredFiles(EXPIRY_TIME); // Clean up expired files

        const request = indexedDB.open('OfflineDownloadsDB', 1);

        request.onsuccess = (event) => {
          const db = event.target.result; // Get the database instance
          const transaction = db.transaction('downloads', 'readonly');
          const store = transaction.objectStore('downloads');
          const getAllRequest = store.getAll();

          getAllRequest.onsuccess = (event) => {
            const files = event.target.result.map((file) => {
              const remainingTime = Math.max(
                0,
                EXPIRY_TIME - (Date.now() - file.createdAt)
              );
              return { ...file, remainingTime };
            });
            setDownloads(files); // Set the downloads state
          };

          getAllRequest.onerror = (event) => {
            console.error('Error fetching downloads from IndexedDB:', event.target.error);
          };
        };

        request.onerror = (event) => {
          console.error('Error opening IndexedDB:', event.target.error);
        };
      } catch (error) {
        console.error('Error fetching downloads:', error);
      }
    };

    fetchDownloads();
  }, []);

  const handlePlayVideo = async (filename) => {
    try {
      const file = await getFileFromIndexedDB(filename);
      if (file) {
        const url = URL.createObjectURL(file.blob);

        // Open the video in a dialog box
        const videoDialog = document.createElement('div');
        videoDialog.style.position = 'fixed';
        videoDialog.style.top = '50%';
        videoDialog.style.left = '50%';
        videoDialog.style.transform = 'translate(-50%, -50%)';
        videoDialog.style.width = '80%';
        videoDialog.style.height = '60%';
        videoDialog.style.backgroundColor = '#000';
        videoDialog.style.zIndex = '1000';
        videoDialog.style.borderRadius = '8px';
        videoDialog.style.overflow = 'hidden';
        videoDialog.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';

        const videoElement = document.createElement('video');
        videoElement.controls = true;
        videoElement.autoplay = true;
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';

        const sourceElement = document.createElement('source');
        sourceElement.src = url;
        sourceElement.type = 'video/mp4';

        videoElement.appendChild(sourceElement);
        videoDialog.appendChild(videoElement);

        const closeButton = document.createElement('button');
        closeButton.textContent = '❌ ';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.backgroundColor = '#fff';
        closeButton.style.border = 'none';
        closeButton.style.padding = '8px 12px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.borderRadius = '4px';
        closeButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
        closeButton.onclick = () => {
          document.body.removeChild(videoDialog);
        };

        videoDialog.appendChild(closeButton);
        document.body.appendChild(videoDialog);
      } else {
        alert('Video not available offline. Please re-download.');
      }
    } catch (error) {
      console.error('Error playing video:', error);
    }
  };

  const formatRemainingTime = (milliseconds) => {
    const days = Math.floor(milliseconds / (24 * 60 * 60 * 1000));
    const hours = Math.floor((milliseconds % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((milliseconds % (60 * 60 * 1000)) / (60 * 1000));
    return `${days}d ${hours}h ${minutes}m`;
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">My Downloads</h2>
      <div className="row">
        {downloads.map((download) => (
          <div key={download.filename} className="col-md-4 mb-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <div className="mb-3">
                  <img
                    src={thumbnail} //thumbnail
                    alt={download.filename}
                    className="img-fluid"
                    style={{ maxWidth: '50%', height: 'auto', cursor: 'pointer' }} // Maintain aspect ratio and indicate clickable
                    onClick={() => handlePlayVideo(download.filename)} // Play video on thumbnail click
                  />
                </div>
                <h5 className="card-title">{download.filename}</h5>
                <p className="badge bg-secondary">
                  Expires in: {formatRemainingTime(download.remainingTime)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyDownloads;