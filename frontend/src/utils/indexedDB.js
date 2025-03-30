export const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('OfflineDownloadsDB', 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('downloads')) {
        db.createObjectStore('downloads', { keyPath: 'filename' });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

export const saveFileToIndexedDB = async (filename, blob) => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('downloads', 'readwrite');
    const store = transaction.objectStore('downloads');
    const request = store.put({ filename, blob, createdAt: Date.now() });

    request.onsuccess = () => resolve();
    request.onerror = (event) => reject(event.target.error);
  });
};

export const getFileFromIndexedDB = async (filename) => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('downloads', 'readonly');
    const store = transaction.objectStore('downloads');
    const request = store.get(filename);

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

export const deleteExpiredFiles = async (expiryTime) => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('downloads', 'readwrite');
    const store = transaction.objectStore('downloads');
    const request = store.openCursor();

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const { createdAt, filename } = cursor.value;
        if (Date.now() - createdAt > expiryTime) {
          store.delete(filename);
        }
        cursor.continue();
      } else {
        resolve();
      }
    };

    request.onerror = (event) => reject(event.target.error);
  });
};