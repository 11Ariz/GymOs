import express from 'express';
import nodemailer from 'nodemailer';
import { emailTemplate } from '../emailTemplate.js';

const router = express.Router();

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
  const { name, email, plan, expiryDate, feeStatus } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Member has no email address.' });
  }

  try {
    await sendReminderEmail({ name, email, plan, expiryDate, feeStatus });
    return res.json({ success: true, message: `Reminder sent to ${email}` });
  } catch (err) {
    console.error('❌ Send reminder error:', err.message);
    console.error('   Gmail user:', process.env.GMAIL_USER);
    console.error('   App password set:', !!process.env.GMAIL_APP_PASSWORD);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/email/send-all  — array of members
router.post('/send-all', async (req, res) => {
  const { members } = req.body;

  if (!Array.isArray(members) || members.length === 0) {
    return res.status(400).json({ success: false, error: 'No members provided.' });
  }

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
});

export default router;
