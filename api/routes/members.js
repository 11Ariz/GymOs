import express from 'express';
import Member from '../models/Member.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All member routes require a logged-in Gym Owner
router.use(protect);

// GET /api/members
// Get all members for the logged-in gym owner
router.get('/', async (req, res) => {
  try {
    const members = await Member.find({ gymOwnerId: req.user._id });
    res.json({ success: true, members });
  } catch (error) {
    console.error('Fetch members error:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

// POST /api/members
// Create a new member for the logged-in gym owner
router.post('/', async (req, res) => {
  try {
    const member = await Member.create({
      ...req.body,
      gymOwnerId: req.user._id
    });
    res.status(201).json({ success: true, member });
  } catch (error) {
    console.error('Create member error:', error);
    res.status(400).json({ success: false, error: 'Invalid member data' });
  }
});

// PUT /api/members/:id
// Update a member
router.put('/:id', async (req, res) => {
  try {
    const member = await Member.findOneAndUpdate(
      { _id: req.params.id, gymOwnerId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!member) {
      return res.status(404).json({ success: false, error: 'Member not found or unauthorized' });
    }

    res.json({ success: true, member });
  } catch (error) {
    console.error('Update member error:', error);
    res.status(400).json({ success: false, error: 'Invalid data' });
  }
});

// DELETE /api/members/:id
// Delete a member
router.delete('/:id', async (req, res) => {
  try {
    const member = await Member.findOneAndDelete({
      _id: req.params.id,
      gymOwnerId: req.user._id
    });

    if (!member) {
      return res.status(404).json({ success: false, error: 'Member not found or unauthorized' });
    }

    res.json({ success: true, message: 'Member deleted' });
  } catch (error) {
    console.error('Delete member error:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
});

export default router;
