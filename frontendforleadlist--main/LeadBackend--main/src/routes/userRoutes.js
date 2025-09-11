// backend/src/routes/userRoutes.js
import express from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser, // import new controller
  deleteUser  // import new controller
} from '../controllers/userController.js';

const router = express.Router();

router.get('/users', getAllUsers);
router.post('/users', createUser);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser); 

// NEW ROUTES
// PUT /api/users/:id
// ✅ Use controller logic backed by Prisma
router.put('/users/:id', updateUser);


    // Handles PUT request to /users/1, /users/2, etc.
router.delete('/users/:id', deleteUser); // Handles DELETE request to /users/1, /users/2, etc.

export default router;