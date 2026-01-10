import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['course', 'trainer', 'membership'],
    required: [true, 'กรุณาระบุประเภทการลงทะเบียน']
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'กรุณาระบุ ID ของคอร์ส, ครูมวย หรือแพ็คเกจสมาชิก'],
    refPath: 'itemModel'
  },
  itemModel: {
    type: String,
    enum: ['Course', 'Trainer', 'Membership'],
    required: true
  },
  itemName: {
    type: String,
    required: [true, 'กรุณาระบุชื่อคอร์สหรือครูมวย']
  },
  price: {
    type: Number,
    required: [true, 'กรุณาระบุราคา'],
    min: 0
  },
  userName: {
    type: String,
    trim: true
  },
  userEmail: {
    type: String,
    required: [true, 'กรุณากรอกอีเมล'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'กรุณากรอกอีเมลที่ถูกต้อง']
  },
  userPhone: {
    type: String,
    required: [true, 'กรุณากรอกเบอร์โทรศัพท์'],
    trim: true
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'bank_transfer', 'cash'],
    default: 'credit_card'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  // Payment card info (for demo purposes - in production, this should be handled securely by payment gateway)
  cardLast4: {
    type: String,
    maxlength: 4
  },
  cardHolder: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Create indexes
registrationSchema.index({ type: 1 });
registrationSchema.index({ itemId: 1 });
registrationSchema.index({ userEmail: 1 });
registrationSchema.index({ status: 1 });
registrationSchema.index({ paymentStatus: 1 });
registrationSchema.index({ createdAt: -1 });

const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;

