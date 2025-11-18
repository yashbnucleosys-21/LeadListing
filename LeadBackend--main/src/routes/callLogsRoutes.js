import express from 'express';
import { createCallLog } from '../controllers/callLogController.js';

const router = express.Router();

router.post('/', createCallLog);

export default router;
