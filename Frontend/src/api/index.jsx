import axios from 'axios';

// Centralized API configuration using Axios.
export const api = axios.create({
    baseURL: 'https://data-dashboard-e3mq.onrender.com/api',
});
