import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'กรุณากรอกชื่อคอร์ส'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'กรุณากรอกคำอธิบาย'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'กรุณากรอกราคา'],
    min: 0
  },
  originalPrice: {
    type: Number,
    required: [true, 'กรุณากรอกราคาเดิม'],
    min: 0
  },
  image: {
    type: String,
    default: ''
  },
  benefits: {
    type: [String],
    default: []
  },
  numberOfSessions: {
    type: Number,
    default: 1,
    min: 1
  },
  sessionDates: {
    type: [String],
    default: []
  },
  startTime: {
    type: String,
    default: '09:00'
  },
  endTime: {
    type: String,
    default: '10:30'
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
courseSchema.index({ name: 1 });
courseSchema.index({ status: 1 });

const Course = mongoose.model('Course', courseSchema);

export default Course;

