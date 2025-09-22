import prisma from '../prisma.js';

export async function createCallLog(data) {
  return await prisma.callLog.create({
    data,
  });
}

export async function getCallLogs() {
  return await prisma.callLog.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
}