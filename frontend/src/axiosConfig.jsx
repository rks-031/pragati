import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8012', // Your backend URL
  withCredentials: true, // Ensures cookies are sent with requests
  headers: {
    'Content-Type': 'application/json',
  }
});

export default instance;
