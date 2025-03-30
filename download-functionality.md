# Download Functionality Documentation

This document explains the **Download Functionality** implemented in the project, including how it works, the features it provides, the files involved, and how to test it.

---

## **Overview**

The download functionality allows users to:
1. Download video files for offline access.
2. Store the downloaded files in **IndexedDB** for persistent storage.
3. View the list of downloaded files in the "My Downloads" page.
4. Play the downloaded videos in a dialog box within the same tab.
5. Display the remaining time before the downloaded file expires (7 days from the time of download).

---

## **How It Works**

### **1. Downloading a Video**
- When a user clicks the **Download** button for a video:
  1. The filename is extracted from the GCS URL.
  2. The system checks if the file already exists in **IndexedDB**.
  3. If the file is not already downloaded:
     - The video is fetched from the GCS URL.
     - The video is stored in **IndexedDB** with a `createdAt` timestamp.
  4. If the file is already downloaded, an alert is shown: `This video is already downloaded!`.

### **2. Storing Files in IndexedDB**
- **IndexedDB** is used to store the downloaded files persistently.
- Each file is stored with the following properties:
  - `filename`: The name of the file.
  - `blob`: The binary data of the file.
  - `createdAt`: The timestamp when the file was downloaded.

### **3. Viewing Downloads**
- The "My Downloads" page displays:
  - A thumbnail for each downloaded file.
  - The filename of the video.
  - The remaining time before the file expires.
  - A **Play** button to play the video in a dialog box.

### **4. Playing Videos**
- When the **Play** button is clicked:
  - The video is retrieved from **IndexedDB**.
  - A dialog box is created dynamically in the same tab.
  - The video is played inside the dialog box.

### **5. Expiration of Downloads**
- Files expire 7 days after they are downloaded.
- Expired files are automatically removed from **IndexedDB** when the "My Downloads" page is loaded.

---

## **Features**

1. **Download Videos**:
   - Users can download videos for offline access.
   - Duplicate downloads are prevented.

2. **Persistent Storage**:
   - Videos are stored in **IndexedDB**, allowing them to persist even after the browser is closed.

3. **View Downloads**:
   - Users can view a list of all downloaded files with thumbnails, filenames, and expiration times.

4. **Play Videos**:
   - Videos can be played in a dialog box within the same tab.

5. **Automatic Cleanup**:
   - Expired files are automatically removed from **IndexedDB**.

---

## **Files Involved**

### **1. `Chapter.jsx`**
- **Purpose**: Handles the download functionality for videos.
- **Key Functions**:
  - Downloads videos and stores them in **IndexedDB**.
  - Prevents duplicate downloads.
  - Handles the download of notes.

---

### **2. `MyDownloads.jsx`**
- **Purpose**: Displays the list of downloaded files and allows users to play them.
- **Key Features**:
  - Fetches all downloaded files from **IndexedDB**.
  - Displays thumbnails, filenames, and remaining expiration time.
  - Plays videos in a dialog box within the same tab.

---

### **3. `indexedDB.js`**
- **Purpose**: Provides utility functions for interacting with **IndexedDB**.
- **Key Features**:
  - Saves files to **IndexedDB**.
  - Retrieves files from **IndexedDB**.
  - Deletes expired files from **IndexedDB**.

---

## **How to Test**

1. **Download a Video**:
   - Navigate to a chapter and click the **Download** button for a video.
   - Verify that the video is saved in **IndexedDB**.

2. **Prevent Duplicate Downloads**:
   - Try downloading the same video again.
   - Verify that an alert appears: `This video is already downloaded!`.

3. **View Downloads**:
   - Navigate to the "My Downloads" page.
   - Verify that all downloaded files are listed with thumbnails, filenames, and remaining time.

4. **Play a Video**:
   - Click the **Play** button for a video.
   - Verify that the video plays in a dialog box within the same tab.

5. **Check Expiration**:
   - Wait for a file to expire (or manually adjust the `createdAt` timestamp in **IndexedDB**).
   - Verify that the expired file is removed from the "My Downloads" page.

---

## **Conclusion**

This functionality provides a seamless way for users to download, view, and play videos offline while ensuring that expired files are automatically cleaned up. The use of **IndexedDB** ensures persistent storage and efficient management of downloaded files.