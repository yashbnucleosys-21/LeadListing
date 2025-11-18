// backend/src/services/callLog.service.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const createCallLog = async (callLogData) => {
  return prisma.callLog.create({
    data: {
      leadId: callLogData.leadId,
      name: callLogData.name,
      email: callLogData.email,
      phone: callLogData.phone,
      description: callLogData.description,
      callType: callLogData.callType,
      duration: callLogData.duration,
      outcome: callLogData.outcome,
      nextAction: callLogData.nextAction,
      nextFollowUp: callLogData.nextFollowUp ? new Date(callLogData.nextFollowUp) : null,
    },
  });
};

export const getAllCallLogs = async () => {
  return prisma.callLog.findMany({
    orderBy: {
      createdAt: 'desc', // Order by most recent calls
    },
  });
};