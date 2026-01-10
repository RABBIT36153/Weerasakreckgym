// Helper function to create scheduleDays from schedule text (for backward compatibility)
const parseScheduleToDays = (scheduleText) => {
  const weekDays = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์']
  const scheduleDays = weekDays.map(() => ({
    enabled: false,
    startTime: '',
    endTime: ''
  }))
  
  if (!scheduleText) return scheduleDays
  
  // Try to parse old format: "จันทร์-ศุกร์: 18:00-21:00" or "ทุกวัน: 06:00-08:00"
  const parts = scheduleText.split(',')
  parts.forEach(part => {
    const match = part.match(/([^:]+):\s*(\d{2}:\d{2})-(\d{2}:\d{2})/)
    if (match) {
      const dayRange = match[1].trim()
      const startTime = match[2]
      const endTime = match[3]
      
      // Check if it's "ทุกวัน" (every day)
      if (dayRange.includes('ทุกวัน')) {
        for (let i = 0; i < weekDays.length; i++) {
          scheduleDays[i] = {
            enabled: true,
            startTime,
            endTime
          }
        }
      }
      // Check if it's a range like "จันทร์-ศุกร์"
      else {
        const rangeMatch = dayRange.match(/(.+?)-(.+)/)
        if (rangeMatch) {
          const startDay = rangeMatch[1].trim()
          const endDay = rangeMatch[2].trim()
          const startIndex = weekDays.indexOf(startDay)
          const endIndex = weekDays.indexOf(endDay)
          
          if (startIndex !== -1 && endIndex !== -1) {
            for (let i = startIndex; i <= endIndex; i++) {
              scheduleDays[i] = {
                enabled: true,
                startTime,
                endTime
              }
            }
          }
        } else {
          // Single day
          const dayIndex = weekDays.indexOf(dayRange)
          if (dayIndex !== -1) {
            scheduleDays[dayIndex] = {
              enabled: true,
              startTime,
              endTime
            }
          }
        }
      }
    }
  })
  
  return scheduleDays
}

import Trainer from '../models/Trainer.js';

// GET /api/trainers - ดึงข้อมูลครูมวยทั้งหมด
export const getAllTrainers = async (req, res) => {
  try {
  const { skill, status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    let result = await Trainer.find(query);

    // Filter by skill if provided
  if (skill) {
    result = result.filter(t => 
      t.skills.some(s => s.includes(skill))
    );
  }

    res.json(result);
  } catch (error) {
    console.error('Error fetching trainers:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลครูมวย' });
  }
};

// GET /api/trainers/:id - ดึงข้อมูลครูมวยตาม ID
export const getTrainerById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid trainer ID' });
    }

    const trainer = await Trainer.findById(id);

  if (!trainer) {
    return res.status(404).json({ error: 'ไม่พบข้อมูลครูมวย' });
  }

  res.json(trainer);
  } catch (error) {
    console.error('Error fetching trainer:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลครูมวย' });
  }
};

// Helper function to format schedule from scheduleDays
const formatScheduleFromDays = (scheduleDays) => {
  if (!scheduleDays || !Array.isArray(scheduleDays)) return ''
  
  const weekDays = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์']
  const enabledDays = scheduleDays
    .map((day, index) => {
      if (day.enabled && day.startTime && day.endTime) {
        return `${weekDays[index]}: ${day.startTime}-${day.endTime}`
      }
      return null
    })
    .filter(day => day !== null)
  
  return enabledDays.length > 0 ? enabledDays.join(', ') : ''
}

// POST /api/trainers - เพิ่มครูมวยใหม่
export const createTrainer = async (req, res) => {
  try {
  const { name, title, price } = req.body;

  if (!name || !title || !price) {
    return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

    // Handle scheduleDays - if provided, use it; otherwise parse from schedule text
    let scheduleDays = req.body.scheduleDays
    let schedule = req.body.schedule || ''
    
    if (scheduleDays && Array.isArray(scheduleDays)) {
      // Format schedule text from scheduleDays
      schedule = formatScheduleFromDays(scheduleDays)
    } else if (schedule && !scheduleDays) {
      // Parse schedule text to scheduleDays for backward compatibility
      scheduleDays = parseScheduleToDays(schedule)
    } else {
      // Default empty scheduleDays
      const weekDays = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์']
      scheduleDays = weekDays.map(() => ({
        enabled: false,
        startTime: '',
        endTime: ''
      }))
    }

    // Handle skills - can be array or comma-separated string
    let skills = req.body.skills
    if (skills && !Array.isArray(skills)) {
      skills = skills.split(',').map(s => s.trim()).filter(s => s)
    } else if (!skills) {
      skills = []
    }

    const trainerData = {
    name,
    title,
    image: req.body.image || '',
      document: req.body.document || '',
      rating: parseFloat(req.body.rating) || 0,
      reviews: parseInt(req.body.reviews) || 0,
    price: parseInt(price),
    experience: req.body.experience || '',
      skills: skills,
    bio: req.body.bio || '',
      schedule: schedule,
      scheduleDays: scheduleDays,
      status: req.body.status || 'active'
    };

    const newTrainer = await Trainer.create(trainerData);

  res.status(201).json({
    success: true,
    data: newTrainer,
    message: 'เพิ่มครูมวยสำเร็จ'
  });
  } catch (error) {
    console.error('Error creating trainer:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่มครูมวย' });
  }
};

// PUT /api/trainers/:id - อัปเดตข้อมูลครูมวย
export const updateTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid trainer ID' });
    }

    const trainer = await Trainer.findById(id);
    if (!trainer) {
    return res.status(404).json({ error: 'ไม่พบข้อมูลครูมวย' });
  }

    // Handle scheduleDays - if provided, use it; otherwise parse from schedule text
    let scheduleDays = req.body.scheduleDays
    let schedule = req.body.schedule
    
    if (scheduleDays && Array.isArray(scheduleDays)) {
      // Format schedule text from scheduleDays
      schedule = formatScheduleFromDays(scheduleDays)
    } else if (schedule && !scheduleDays) {
      // Parse schedule text to scheduleDays for backward compatibility
      scheduleDays = parseScheduleToDays(schedule)
    } else if (!scheduleDays) {
      // Keep existing scheduleDays if not provided
      scheduleDays = trainer.scheduleDays || parseScheduleToDays(trainer.schedule || '')
    }

    // Handle skills - can be array or comma-separated string
    let skills = req.body.skills
    if (skills !== undefined) {
      if (!Array.isArray(skills)) {
        skills = skills.split(',').map(s => s.trim()).filter(s => s)
      }
    } else {
      skills = trainer.skills
    }

    // Update trainer data
    const updateData = {
      name: req.body.name !== undefined ? req.body.name : trainer.name,
      title: req.body.title !== undefined ? req.body.title : trainer.title,
      image: req.body.image !== undefined ? req.body.image : trainer.image,
      document: req.body.document !== undefined ? req.body.document : trainer.document,
      rating: req.body.rating !== undefined ? parseFloat(req.body.rating) : trainer.rating,
      reviews: req.body.reviews !== undefined ? parseInt(req.body.reviews) : trainer.reviews,
      price: req.body.price !== undefined ? parseInt(req.body.price) : trainer.price,
      experience: req.body.experience !== undefined ? req.body.experience : trainer.experience,
      skills: skills,
      bio: req.body.bio !== undefined ? req.body.bio : trainer.bio,
      schedule: schedule !== undefined ? schedule : trainer.schedule,
      scheduleDays: scheduleDays,
      status: req.body.status !== undefined ? req.body.status : trainer.status
    };

    const updatedTrainer = await Trainer.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

  res.json({
    success: true,
      data: updatedTrainer,
    message: 'อัปเดตข้อมูลครูมวยสำเร็จ'
  });
  } catch (error) {
    console.error('Error updating trainer:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลครูมวย' });
  }
};

// DELETE /api/trainers/:id - ลบครูมวย
export const deleteTrainer = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid trainer ID' });
    }

    const trainer = await Trainer.findByIdAndDelete(id);

    if (!trainer) {
    return res.status(404).json({ error: 'ไม่พบข้อมูลครูมวย' });
  }

  res.json({
    success: true,
    message: `ลบครูมวย ID ${id} สำเร็จ`
  });
  } catch (error) {
    console.error('Error deleting trainer:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบครูมวย' });
  }
};

