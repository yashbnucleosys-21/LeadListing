// backend/src/routes/followUpHistory.routes.js
import express from 'express';
import { getHistoryForLead } from '../controllers/followUpHistory.controller.js';

const router = express.Router();

// Defines the endpoint: GET /api/leads/:leadId/history
router.get('/:leadId/history', getHistoryForLead);

export default router;