import axios from 'axios';

// Centralized API configuration using Axios.
export const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});
