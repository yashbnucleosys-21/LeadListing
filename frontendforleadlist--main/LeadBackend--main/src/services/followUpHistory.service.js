// backend/src/services/followUpHistory.service.js
import prisma from '../prisma.js';

/**
 * Creates a new follow-up history record.
 * This is called automatically when a lead is updated.
 */
export const createFollowUpHistory = async (leadId, followUpData) => {
  return prisma.followUpHistory.create({
    data: {
      leadId: leadId,
      // Create a meaningful description of the change
      description: `Updated lead. Status: ${followUpData.status}, Priority: ${followUpData.priority}. Task: ${followUpData.service}`,
      notes: followUpData.notes,
      status: followUpData.status,
      priority: followUpData.priority,
    },
  });
};

/**
 * Gets all history records for a specific lead.
 * This is called when a user clicks the "History" button.
 */
export const getHistoryForLead = async (leadId) => {
  return prisma.followUpHistory.findMany({
    where: {
      leadId: leadId,
    },
    orderBy: {
      createdAt: 'desc', // Show the most recent history first
    },
  });
};