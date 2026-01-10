import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  membershipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Membership',
    required: [true, 'กรุณาระบุแพ็คเกจสมาชิก']
  },
  registrationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Registration',
    required: false
  },
  name: {
    type: String,
    required: [true, 'กรุณากรอกชื่อ'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'กรุณากรอกอีเมล'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'กรุณากรอกอีเมลที่ถูกต้อง']
  },
  phone: {
    type: String,
    required: [true, 'กรุณากรอกเบอร์โทรศัพท์'],
    trim: true
  },
  membershipType: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: [true, 'กรุณาระบุวันที่เริ่มต้น'],
    default: Date.now
  },
  endDate: {
    type: Date,
    required: [true, 'กรุณาระบุวันที่สิ้นสุด']
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled', 'suspended'],
    default: 'active'
  },
  autoRenew: {
    type: Boolean,
    default: false
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'bank_transfer', 'cash'],
    default: 'credit_card'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Create indexes
memberSchema.index({ email: 1 });
memberSchema.index({ membershipId: 1 });
memberSchema.index({ status: 1 });
memberSchema.index({ startDate: 1 });
memberSchema.index({ endDate: 1 });

// Virtual to check if membership is active
memberSchema.virtual('isActive').get(function() {
  const now = new Date();
  return this.status === 'active' && this.endDate > now;
});

const Member = mongoose.model('Member', memberSchema);

export default Member;

