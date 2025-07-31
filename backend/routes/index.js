import express from 'express';
import multer from 'multer';

// Import all controller functions
import { uploadFile } from '../controllers/uploadController.js';
import { getChartData } from '../controllers/chartController.js';
import { getMetrics } from '../controllers/metricsController.js';
import { askQuestion } from '../controllers/chatbotController.js';

const router = express.Router();

// --- Multer Setup for File Uploads ---
// We'll store the file in memory to be processed directly
const storage = multer.memoryStorage();
const upload = multer({ storage })




router.post('/upload', upload.single('jsonFile'), uploadFile);

router.get('/charts/:type', getChartData);

router.get('/metrics', getMetrics);

router.post('/chatbot', askQuestion);

export default router;
