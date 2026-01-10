import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'กรุณากรอกชื่อแพ็คเกจ'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'กรุณากรอกคำอธิบาย'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'กรุณากรอกราคารายเดือน'],
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  image: {
    type: String,
    default: ''
  },
  features: {
    type: [String],
    default: []
  },
  benefits: {
    type: [String],
    default: []
  },
  duration: {
    type: Number,
    default: 30, // days
    required: true
  },
  classAccess: {
    type: String,
    enum: ['unlimited', 'limited'],
    default: 'limited'
  },
  classLimit: {
    type: Number,
    default: 12 // classes per month
  },
  personalTraining: {
    type: Boolean,
    default: false
  },
  equipmentAccess: {
    type: Boolean,
    default: true
  },
  lockerAccess: {
    type: Boolean,
    default: false
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
membershipSchema.index({ name: 1 });
membershipSchema.index({ status: 1 });
membershipSchema.index({ price: 1 });

const Membership = mongoose.model('Membership', membershipSchema);

export default Membership;

