import * as callLogService from '../services/callLogService.js';

export const createCallLog = async (req, res) => {
  const { leadId, name, email, phone, description, callType, duration, outcome, nextAction, nextFollowUp } = req.body;
  try {
    const newLog = await callLogService.createCallLog({
      leadId: Number(leadId),
      name,
      email,
      phone,
      description,
      callType,
      duration,
      outcome,
      nextAction,
      nextFollowUp,
    });
    res.status(201).json(newLog);
  } catch (error) {
    console.error('❌ Prisma Error in createCallLog:', error);
    res.status(500).json({ error: error.message || 'Failed to save call log' });
  }
};

export const getCallLogs = async (req, res) => {
  try {
    const callLogs = await callLogService.getCallLogs();
    res.status(200).json(callLogs);
  } catch (error) {
    console.error('❌ Prisma Error in getCallLogs:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch call logs' });
  }
};