import * as RoleService from '../services/role.service.js';

// ✅ Get all roles
export const getAllRoles = async (req, res) => {
  try {
    const roles = await RoleService.getAllRoles();
    res.status(200).json(roles);
  } catch (error) {
    console.error('Error in getAllRoles:', error);
    res.status(500).json({ message: 'Server error while fetching roles' });
  }
};

// ✅ Get role by ID
export const getRoleById = async (req, res) => {
  try {
    const role = await RoleService.getRoleById(req.params.id);
    if (role) {
      res.status(200).json(role);
    } else {
      res.status(404).json({ message: 'Role not found' });
    }
  } catch (error) {
    console.error('Error in getRoleById:', error);
    res.status(500).json({ message: 'Server error while fetching role' });
  }
};

// ✅ Create new role
export const createRole = async (req, res) => {
  try {
    const roleData = req.body;

    if (!roleData.name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const newRole = await RoleService.createRole(roleData);
    res.status(201).json(newRole);
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ message: 'Server error while creating role' });
  }
};

// ✅ Update role by ID
export const updateRole = async (req, res) => {
  try {
    const roleId = req.params.id;
    const updateData = req.body;

    const updatedRole = await RoleService.updateRole(roleId, updateData);

    if (updatedRole) {
      return res.status(200).json(updatedRole);
    } else {
      return res.status(404).json({ message: 'Role not found or update failed' });
    }
  } catch (error) {
    console.error('🔥 Error in updateRole controller:', error);
    return res.status(500).json({ message: 'Server error while updating role' });
  }
};

// ✅ Delete role by ID
export const deleteRole = async (req, res) => {
  try {
    const roleId = req.params.id;
    const deleted = await RoleService.deleteRole(roleId);

    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Role not found or delete failed' });
    }
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ message: 'Server error while deleting role' });
  }
};