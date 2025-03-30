import React, { useEffect, useState } from 'react';
import { getFileFromIndexedDB, deleteExpiredFiles } from '../utils/indexedDB';

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
        const videoWindow = window.open();
        videoWindow.document.body.style.margin = '0';
        const videoElement = videoWindow.document.createElement('video');
        videoElement.controls = true;
        videoElement.autoplay = true;
        videoElement.style.width = '100%';
        videoElement.style.height = '100%';
        const sourceElement = videoWindow.document.createElement('source');
        sourceElement.src = url;
        sourceElement.type = 'video/mp4';
        videoElement.appendChild(sourceElement);
        videoWindow.document.body.appendChild(videoElement);
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
    <div>
      <h2>My Downloads</h2>
      <ul>
        {downloads.map((download) => (
          <li key={download.filename}>
            <span>{download.filename}</span>
            <span> - Expires in: {formatRemainingTime(download.remainingTime)}</span>
            <button onClick={() => handlePlayVideo(download.filename)}>Play</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyDownloads;