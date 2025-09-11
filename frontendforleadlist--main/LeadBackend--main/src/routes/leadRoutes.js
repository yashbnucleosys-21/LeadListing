// backend/src/routes/leadRoutes.js
import express from 'express';
import {
  createLead, getAllLeads, updateLead
} from '../controllers/leadController.js';

const router = express.Router();

router.post('/', createLead);          // POST /api/leads
router.get('/', getAllLeads);          // GET /api/leads
router.patch('/:id', updateLead);
router.put('/:id', updateLead);        // PUT /api/leads/:id

export default router;
