import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  gymOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  plan: { type: String, required: true },
  joinDate: { type: String, required: true },
  expiryDate: { type: String, required: true },
  feeStatus: { type: String, enum: ['Paid', 'Pending'], required: true },
  avatar: { type: String, default: 'https://i.pravatar.cc/150' }
}, { timestamps: true });

const Member = mongoose.model('Member', memberSchema);
export default Member;
