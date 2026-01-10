import Course from '../models/Course.js';
import Registration from '../models/Registration.js';

// GET /api/courses - ดึงข้อมูลคอร์สเรียนทั้งหมด
export const getAllCourses = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    const result = await Course.find(query);
    res.json(result);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลคอร์สเรียน' });
  }
};

// GET /api/courses/:id - ดึงข้อมูลคอร์สเรียนตาม ID
export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลคอร์สเรียน' });
    }

    res.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลคอร์สเรียน' });
  }
};

// POST /api/courses - เพิ่มคอร์สเรียนใหม่
export const createCourse = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    // Handle benefits - can be array or empty array
    let benefits = req.body.benefits
    if (!Array.isArray(benefits)) {
      benefits = []
    }
    // Filter out empty strings
    benefits = benefits.filter(b => b && b.trim() !== '')

    // Handle sessionDates - can be array or empty array
    let sessionDates = req.body.sessionDates
    if (!Array.isArray(sessionDates)) {
      sessionDates = []
    }
    // Filter out empty strings
    sessionDates = sessionDates.filter(d => d && d.trim() !== '')

    // Handle numberOfSessions
    const numberOfSessions = req.body.numberOfSessions ? parseInt(req.body.numberOfSessions) : (sessionDates.length > 0 ? sessionDates.length : 1)

    const courseData = {
      name,
      description,
      price: parseInt(price),
      originalPrice: parseInt(req.body.originalPrice) || parseInt(price),
      image: req.body.image || '',
      benefits: benefits,
      startTime: req.body.startTime || '09:00',
      endTime: req.body.endTime || '10:30',
      numberOfSessions: numberOfSessions,
      sessionDates: sessionDates,
      status: req.body.status || 'active'
    };

    const newCourse = await Course.create(courseData);

    res.status(201).json({
      success: true,
      data: newCourse,
      message: 'เพิ่มคอร์สเรียนสำเร็จ'
    });
  } catch (error) {
    console.error('Error creating course:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่มคอร์สเรียน' });
  }
};

// PUT /api/courses/:id - อัปเดตข้อมูลคอร์สเรียน
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลคอร์สเรียน' });
    }

    // Handle benefits - can be array or empty array
    let benefits = req.body.benefits
    if (benefits !== undefined) {
      if (!Array.isArray(benefits)) {
        benefits = []
      }
      // Filter out empty strings
      benefits = benefits.filter(b => b && b.trim() !== '')
    } else {
      benefits = course.benefits
    }

    // Handle sessionDates - can be array or empty array
    let sessionDates = req.body.sessionDates
    if (sessionDates !== undefined) {
      if (!Array.isArray(sessionDates)) {
        sessionDates = []
      }
      // Filter out empty strings
      sessionDates = sessionDates.filter(d => d && d.trim() !== '')
    } else {
      sessionDates = course.sessionDates || []
    }

    // Handle numberOfSessions
    let numberOfSessions = req.body.numberOfSessions
    if (numberOfSessions !== undefined) {
      numberOfSessions = parseInt(numberOfSessions) || 1
    } else {
      // If numberOfSessions not provided, use sessionDates length or course value
      numberOfSessions = course.numberOfSessions || (sessionDates.length > 0 ? sessionDates.length : 1)
    }

    const updateData = {
      name: req.body.name !== undefined ? req.body.name : course.name,
      description: req.body.description !== undefined ? req.body.description : course.description,
      price: req.body.price !== undefined ? parseInt(req.body.price) : course.price,
      originalPrice: req.body.originalPrice !== undefined ? parseInt(req.body.originalPrice) : course.originalPrice,
      image: req.body.image !== undefined ? req.body.image : course.image,
      benefits: benefits,
      startTime: req.body.startTime !== undefined ? req.body.startTime : (course.startTime || '09:00'),
      endTime: req.body.endTime !== undefined ? req.body.endTime : (course.endTime || '10:30'),
      numberOfSessions: numberOfSessions,
      sessionDates: sessionDates,
      status: req.body.status !== undefined ? req.body.status : course.status
    };

    const updatedCourse = await Course.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: updatedCourse,
      message: 'อัปเดตข้อมูลคอร์สเรียนสำเร็จ'
    });
  } catch (error) {
    console.error('Error updating course:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลคอร์สเรียน' });
  }
};

// DELETE /api/courses/:id - ลบคอร์สเรียน
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid course ID' });
    }

    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลคอร์สเรียน' });
    }

    res.json({
      success: true,
      message: `ลบคอร์สเรียน ID ${id} สำเร็จ`
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบคอร์สเรียน' });
  }
};

// GET /api/courses/popular - ดึงคอร์ส 3 อันดับที่มีการลงทะเบียนเยอะที่สุด
export const getPopularCourses = async (req, res) => {
  try {
    // Get all active courses
    const courses = await Course.find({ status: 'active' });
    
    // Count registrations for each course
    const coursesWithCount = await Promise.all(
      courses.map(async (course) => {
        const registrationCount = await Registration.countDocuments({
          type: 'course',
          itemId: course._id,
          itemModel: 'Course'
        });
        
        return {
          ...course.toObject(),
          registrationCount: registrationCount
        };
      })
    );
    
    // Sort by registration count (descending) and get top 3
    const popularCourses = coursesWithCount
      .sort((a, b) => b.registrationCount - a.registrationCount)
      .slice(0, 3);
    
    res.json(popularCourses);
  } catch (error) {
    console.error('Error fetching popular courses:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลคอร์สยอดนิยม' });
  }
};

