import express from 'express';
import User from '../models/User.js';
import { protect, superadmin } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes in this file - requires JWT AND Superadmin role
router.use(protect, superadmin);

// POST /api/admin/create-gym
router.post('/create-gym', async (req, res) => {
  const { email, password, gymName } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, error: 'User email already exists' });
    }

    const user = await User.create({
      email,
      password,
      role: 'GYM_OWNER',
      gymName,
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: 'Gym Owner created successfully',
        user: {
          _id: user._id,
          email: user.email,
          gymName: user.gymName
        }
      });
    } else {
      res.status(400).json({ success: false, error: 'Invalid user data provided' });
    }
  } catch (error) {
    console.error('Create gym error:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// GET /api/admin/gyms
// View all gyms
router.get('/gyms', async (req, res) => {
  try {
    const gyms = await User.find({ role: 'GYM_OWNER' }).select('-password');
    res.json({ success: true, gyms });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

export default router;
