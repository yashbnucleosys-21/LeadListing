// clearLeads.js
import prisma from './src/prisma.js'; // Adjust path if your prisma.js is elsewhere

async function clearLeads() {
  try {
    await prisma.lead.deleteMany(); // 🚨 Deletes all lead records
    console.log('✅ All leads deleted successfully.');
  } catch (error) {
    console.error('❌ Error deleting leads:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearLeads();
