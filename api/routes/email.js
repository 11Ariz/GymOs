import express from 'express';
import nodemailer from 'nodemailer';
import { emailTemplate } from '../emailTemplate.js';
import { protect } from '../middleware/auth.js';
import Member from '../models/Member.js';

const router = express.Router();

// Protect all email routes
router.use(protect);

// Create reusable transporter
const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

// Helper: send one email
async function sendReminderEmail(member) {
  if (!member.email) throw new Error(`No email address for member: ${member.name}`);

  const transporter = createTransporter();
  const html = emailTemplate(member);

  await transporter.sendMail({
    from: `"GymOS" <${process.env.GMAIL_USER}>`,
    to: member.email,
    subject: `🏋️ GymOS – Membership Reminder for ${member.name}`,
    html,
  });
}

// POST /api/email/send-reminder  — single member
router.post('/send-reminder', async (req, res) => {
  const { memberId } = req.body;

  if (!memberId) {
    return res.status(400).json({ success: false, error: 'Member ID is required.' });
  }

  try {
    // Verify member belongs to this gym owner
    const member = await Member.findOne({ _id: memberId, gymOwnerId: req.user._id });
    if (!member) {
      return res.status(404).json({ success: false, error: 'Member not found or unauthorized.' });
    }
    if (!member.email) {
      return res.status(400).json({ success: false, error: 'Member has no email address.' });
    }

    await sendReminderEmail(member);
    return res.json({ success: true, message: `Reminder sent to ${member.email}` });
    
  } catch (err) {
    console.error('❌ Send reminder error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});


// POST /api/email/send-all  — array of members
router.post('/send-all', async (req, res) => {
  const { memberIds } = req.body;

  if (!Array.isArray(memberIds) || memberIds.length === 0) {
    return res.status(400).json({ success: false, error: 'No members provided.' });
  }

  try {
    // Fetch all confirmed members belonging to this gym
    const members = await Member.find({ 
      _id: { $in: memberIds },
      gymOwnerId: req.user._id 
    });

    const results = await Promise.allSettled(
      members.map(m => sendReminderEmail(m))
    );

  const summary = results.map((r, i) => ({
    name: members[i].name,
    email: members[i].email,
    success: r.status === 'fulfilled',
    error: r.status === 'rejected' ? r.reason?.message : undefined,
  }));

  const successCount = summary.filter(s => s.success).length;
  console.log(`Sent ${successCount}/${members.length} reminder emails.`);

  return res.json({ success: true, summary });
    
  } catch (err) {
    console.error('❌ Send all reminders error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
