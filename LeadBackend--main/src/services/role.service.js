import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ✅ Get all roles
export const getAllRoles = async () => {
  const roles = await prisma.role.findMany({
    orderBy: {
      id: 'asc'
    },
  });

  return roles;
};

// ✅ Get a role by ID
export const getRoleById = async (id) => {
  return await prisma.role.findUnique({
    where: { id: parseInt(id) },
  });
};

// ✅ Create a role
export const createRole = async (roleData) => {
  return await prisma.role.create({
    data: {
      name: roleData.name,
    },
  });
};


// ✅ Update role by ID
export const updateRole = async (id, updateData) => {
  return await prisma.role.update({
    where: { id: parseInt(id) },
    data: updateData,
  });
};


// ✅ Delete role by ID
export const deleteRole = async (id) => {
  await prisma.role.delete({
    where: { id: parseInt(id) },
  });
  return true;
};