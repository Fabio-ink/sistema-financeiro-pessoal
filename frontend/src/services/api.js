import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // A URL do nosso backend
});

export default api;