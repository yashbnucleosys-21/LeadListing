import express from 'express';
import { createCallLog, getCallLogs } from '../controllers/callLogController.js';

const router = express.Router();

router.post('/', createCallLog);
router.get('/', getCallLogs);

export default router;