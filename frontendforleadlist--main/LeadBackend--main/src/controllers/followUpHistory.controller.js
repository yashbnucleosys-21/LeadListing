// backend/src/controllers/followUpHistory.controller.js
import * as FollowUpHistoryService from '../services/followUpHistory.service.js';

// Controller to handle fetching the history for a single lead
export const getHistoryForLead = async (req, res) => {
  try {
    const { leadId } = req.params; // Get the lead's ID from the URL
    const history = await FollowUpHistoryService.getHistoryForLead(Number(leadId));
    res.status(200).json(history);
  } catch (error) {
    console.error(`Error fetching history for lead ${req.params.leadId}:`, error);
    res.status(500).json({ message: 'Server error while fetching follow-up history' });
  }
};