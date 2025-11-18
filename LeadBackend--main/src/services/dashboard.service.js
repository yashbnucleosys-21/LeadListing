// backend/src/services/dashboard.service.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getDashboardStats = async () => {
  // Calculate total leads
  const totalLeads = await prisma.lead.count();

  // Calculate new leads (e.g., created in the last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const newLeads = await prisma.lead.count({
    where: {
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
  });

  // Calculate today's follow-ups (leads with nextFollowUpDate today and 'pending' status)
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1); // Start of tomorrow

  const todayFollowUps = await prisma.lead.count({
    where: {
      nextFollowUpDate: {
        gte: today, // Greater than or equal to start of today
        lt: tomorrow, // Less than start of tomorrow
      },
      status: 'pending', // Assuming 'pending' is the status for scheduled follow-ups
    },
  });

  // Calculate active calls (e.g., calls logged in the last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const activeCalls = await prisma.callLog.count({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
  });

  // Calculate conversion rate (example: (won leads / qualified leads) * 100)
  const wonLeads = await prisma.lead.count({ where: { status: 'won' } });
  const qualifiedLeads = await prisma.lead.count({ where: { status: 'qualified' } });
  const conversionRate = qualifiedLeads > 0 ? (wonLeads / qualifiedLeads) * 100 : 0;

  return {
    totalLeads,
    newLeads,
    todayFollowUps,
    activeCalls,
    conversionRate: parseFloat(conversionRate.toFixed(2)), // Format to 2 decimal places
  };
};