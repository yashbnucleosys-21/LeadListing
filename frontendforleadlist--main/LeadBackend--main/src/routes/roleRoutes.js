// backend/src/routes/roleRoutes.js
import express from 'express';
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole
} from '../controllers/roleController.js';

const router = express.Router();

// ✅ Routes for roles
router.get('/roles', getAllRoles);       // Handles GET request to /roles
router.post('/roles', createRole);      // Handles POST request to /roles
router.get('/roles/:id', getRoleById);    // Handles GET request to /roles/1, /roles/2, etc.
router.put('/roles/:id', updateRole);     // Handles PUT request to /roles/1, /roles/2, etc.
router.delete('/roles/:id', deleteRole);  // Handles DELETE request to /roles/1, /roles/2, etc.

export default router;