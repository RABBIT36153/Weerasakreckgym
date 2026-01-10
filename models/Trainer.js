import mongoose from 'mongoose';

const scheduleDaySchema = new mongoose.Schema({
  enabled: {
    type: Boolean,
    default: false
  },
  startTime: {
    type: String,
    default: ''
  },
  endTime: {
    type: String,
    default: ''
  }
}, { _id: false });

const trainerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'กรุณากรอกชื่อ'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'กรุณากรอกตำแหน่ง'],
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  document: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0,
    min: 0
  },
  price: {
    type: Number,
    required: [true, 'กรุณากรอกราคา'],
    min: 0
  },
  experience: {
    type: String,
    default: ''
  },
  skills: {
    type: [String],
    default: []
  },
  bio: {
    type: String,
    default: ''
  },
  schedule: {
    type: String,
    default: ''
  },
  scheduleDays: {
    type: [scheduleDaySchema],
    default: () => [
      { enabled: false, startTime: '', endTime: '' }, // จันทร์
      { enabled: false, startTime: '', endTime: '' }, // อังคาร
      { enabled: false, startTime: '', endTime: '' }, // พุธ
      { enabled: false, startTime: '', endTime: '' }, // พฤหัสบดี
      { enabled: false, startTime: '', endTime: '' }, // ศุกร์
      { enabled: false, startTime: '', endTime: '' }, // เสาร์
      { enabled: false, startTime: '', endTime: '' }  // อาทิตย์
    ]
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
trainerSchema.index({ name: 1 });
trainerSchema.index({ status: 1 });
trainerSchema.index({ skills: 1 });

const Trainer = mongoose.model('Trainer', trainerSchema);

export default Trainer;

