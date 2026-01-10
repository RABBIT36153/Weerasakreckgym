import mongoose from 'mongoose';

const hireRequestSchema = new mongoose.Schema({
  trainerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trainer',
    required: [true, 'กรุณาระบุ ID ของครูมวย']
  },
  name: {
    type: String,
    required: [true, 'กรุณากรอกชื่อ-นามสกุล'],
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
  country: {
    type: String,
    required: [true, 'กรุณาระบุประเทศที่ต้องการจ้าง'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'กรุณากรอกที่อยู่'],
    trim: true
  },
  province: {
    type: String,
    required: [true, 'กรุณากรอกจังหวัด/รัฐ'],
    trim: true
  },
  district: {
    type: String,
    required: [true, 'กรุณากรอกอำเภอ/เมือง'],
    trim: true
  },
  postalCode: {
    type: String,
    required: [true, 'กรุณากรอกรหัสไปรษณีย์'],
    trim: true
  },
  duration: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'approved', 'rejected', 'completed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Create indexes
hireRequestSchema.index({ trainerId: 1 });
hireRequestSchema.index({ email: 1 });
hireRequestSchema.index({ status: 1 });
hireRequestSchema.index({ createdAt: -1 });

const HireRequest = mongoose.model('HireRequest', hireRequestSchema);

export default HireRequest;

