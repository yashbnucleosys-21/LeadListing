// backend/src/controllers/callLog.controller.js
import * as CallLogService from '../services/callLog.service.js';

// Controller to create a new CallLog
export const createCallLog = async (req, res) => {
  try {
    const callLogData = req.body;
    // Basic validation
    if (!callLogData.leadId || !callLogData.description) {
      return res.status(400).json({ message: 'Lead ID and description are required for a call log.' });
    }
    const newLog = await CallLogService.createCallLog(callLogData);
    res.status(201).json(newLog);
  } catch (error) {
    console.error('Error creating CallLog:', error);
    res.status(500).json({ message: 'Server error while creating CallLog' });
  }
};

// Controller to get all CallLogs
export const getAllCallLogs = async (req, res) => {
  try {
    const callLogs = await CallLogService.getAllCallLogs();
    res.status(200).json(callLogs);
  } catch (error) {
    console.error('Error fetching CallLogs:', error);
    res.status(500).json({ message: 'Server error while fetching call logs' });
  }
};