import axios from 'axios';

// Centralized API configuration using Axios.
export const api = axios.create({
    baseURL: 'https://localhost:3000/api',
});
