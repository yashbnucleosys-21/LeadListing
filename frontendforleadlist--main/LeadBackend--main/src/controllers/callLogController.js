import * as callLogService from '../services/callLogService.js';

export const createCallLog = async (req, res) => {
  const { leadId, name, email, phone, description } = req.body;

  try {
    const newLog = await prisma.callLog.create({
      data: {
        leadId: Number(leadId),
        name,            // ✅ Must match field in schema
        email,
        phone,
        description,
      },
    });
    res.status(201).json(newLog);
  } catch (error) {
    console.error('❌ Prisma Error in createCallLog:', error);
    res.status(500).json({ error: error.message || 'Failed to save call log' });
  }
};
