import * as UserService from '../services/user.service.js';

// ✅ Get all users
export const getAllUsers = async (req, res) => {
  try {
    const filters = req.query;
    const users = await UserService.getAllUsers(filters);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

// ✅ Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in getUserById:', error);
    res.status(500).json({ message: 'Server error while fetching user' });
  }
};

// ✅ Create new user
// export const createUser = async (req, res) => {
//   try {
//     const userData = req.body;

//     if (!userData.name || !userData.email || !userData.role) {
//       return res.status(400).json({ message: 'Name, email, and role are required' });
//     }

//     const newUser = await UserService.createUser(userData);
//     res.status(201).json(newUser);
//   } catch (error) {
//     console.error('Error creating user:', error);
//     res.status(500).json({ message: 'Server error while creating user' });
//   }
// };

export const createUser = async (req, res) => {
  try {
    const userData = req.body;

    // Add password to the list of required fields
    if (!userData.name || !userData.email || !userData.role || !userData.password) {
      return res.status(400).json({ message: 'Name, email, role, and password are required' });
    }

    const newUser = await UserService.createUser(userData);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    // Add a check for unique constraint violation (e.g., email already exists)
    if (error.code === 'P2002') {
       return res.status(409).json({ message: `An account with this email already exists.` });
    }
    res.status(500).json({ message: 'Server error while creating user' });
  }
};

// ✅ Update user by ID
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    console.log('🟡 Update Request for User:', userId);
    console.log('🟡 Update Data:', updateData);

    const updatedUser = await UserService.updateUser(userId, updateData);

    if (updatedUser) {
      return res.status(200).json(updatedUser);
    } else {
      return res.status(404).json({ message: 'User not found or update failed' });
    }
  } catch (error) {
    console.error('🔥 Error in updateUser controller:', error);
    return res.status(500).json({ message: 'Server error while updating user' });
  }
};


// ✅ Delete user by ID
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deleted = await UserService.deleteUser(userId);

    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'User not found or delete failed' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
};
