// axiosConfig.js
import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? 'https://twopdfapi.eduzenship.com/api/' : 'http://127.0.0.1:8000/api/',
   // baseURL:"https://twopdfapi.eduzenship.com/api/",
});

export default instance;
