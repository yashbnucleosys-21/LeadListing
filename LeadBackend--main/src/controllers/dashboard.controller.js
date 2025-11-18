// backend/src/controllers/dashboard.controller.js
import * as DashboardService from '../services/dashboard.service.js';

export const getDashboardStats = async (req, res) => {
  try {
    const stats = await DashboardService.getDashboardStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error in getDashboardStats controller:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard statistics' });
  }
};