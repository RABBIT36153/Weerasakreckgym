import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
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
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'กรุณากรอกอีเมลที่ถูกต้อง']
  },
  phone: {
    type: String,
    required: [true, 'กรุณากรอกเบอร์โทรศัพท์'],
    trim: true
  },
  password: {
    type: String,
    // Password is optional for edit, required for create (will be validated in controller)
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Create indexes
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ name: 1 });

const User = mongoose.model('User', userSchema);

export default User;

