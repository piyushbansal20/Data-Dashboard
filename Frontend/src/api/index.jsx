import axios from 'axios';


const backend = import.meta.env.VITE_BACKEND_URL
// Centralized API configuration using Axios.
export const api = axios.create({
    baseURL: `${backend}/api`,
});
