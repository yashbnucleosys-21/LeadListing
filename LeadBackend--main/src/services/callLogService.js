import prisma from '../prisma.js';

export async function createCallLog(data) {
  return await prisma.callLog.create({   // ✅ use camelCase `callLog`
    data,                                // ✅ data must have `name`, not `contactName`
  });
}
