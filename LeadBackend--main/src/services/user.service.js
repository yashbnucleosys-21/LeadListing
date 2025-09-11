import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ✅ Get all users with optional filtering
export const getAllUsers = async (filters) => {
  const where = {};

  if (filters.role) {
    where.role = filters.role;
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: {
      createdAt: 'desc' // Make sure `createdAt` exists in your model
    },
  });

  return users;
};

// ✅ Get a user by ID
export const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id: parseInt(id) },
  });
};


// export const createUser = async (userData) => {
//   return await prisma.user.create({
//     data: {
//       name: userData.name,
//       email: userData.email,
//       phone: userData.phone || '',
//       role: userData.role,
//       department: userData.department || 'General',
//       status: userData.status || 'active',   // ✅ Include status
//     },
//   });
// };



// export const updateUser = async (id, updateData) => {
//   return await prisma.user.update({
//     where: { id: parseInt(id) },
//     data: updateData,
//   });
// };


// ✅ Delete user by ID
export const createUser = async (userData) => {
  // Hash the password before storing it
  // The '10' is the salt round - a standard value for strength vs. speed
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  return await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: hashedPassword, // Store the hashed password, not the plain text one
      phone: userData.phone || '',
      role: userData.role,
      department: userData.department || 'General',
      status: userData.status || 'active',
    },
    // Exclude the password from the returned object for security
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      department: true,
      status: true,
      createdAt: true
    }
  });
};


// ✅ 3. Modify the updateUser function
export const updateUser = async (id, updateData) => {
  // If the password is being updated, hash the new one
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  return await prisma.user.update({
    where: { id: parseInt(id) },
    data: updateData,
    // Also exclude the password from the returned object on update
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      department: true,
      status: true,
      createdAt: true
    }
  });
};

export const deleteUser = async (id) => {
  await prisma.user.delete({
    where: { id: parseInt(id) },
  });
  return true;
};
