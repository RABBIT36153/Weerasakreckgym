import HireRequest from '../models/HireRequest.js';

// GET /api/hire-requests - ดึงข้อมูลคำขอจ้างงานทั้งหมด
export const getAllHireRequests = async (req, res) => {
  try {
    const { status, trainerId } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (trainerId) {
      query.trainerId = trainerId;
    }

    const result = await HireRequest.find(query)
      .populate('trainerId', 'name title')
      .sort({ createdAt: -1 });

    res.json(result);
  } catch (error) {
    console.error('Error fetching hire requests:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลคำขอจ้างงาน' });
  }
};

// GET /api/hire-requests/:id - ดึงข้อมูลคำขอจ้างงานตาม ID
export const getHireRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid hire request ID' });
    }

    const hireRequest = await HireRequest.findById(id)
      .populate('trainerId', 'name title image');

    if (!hireRequest) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลคำขอจ้างงาน' });
    }

    res.json(hireRequest);
  } catch (error) {
    console.error('Error fetching hire request:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลคำขอจ้างงาน' });
  }
};

// POST /api/hire-requests - เพิ่มคำขอจ้างงานใหม่
export const createHireRequest = async (req, res) => {
  try {
    const { trainerId, name, email, phone, country, address, province, district, postalCode, duration, message } = req.body;

    // Validate required fields
    if (!trainerId || !name || !email || !phone || !country || !address || !province || !district || !postalCode) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    // Check if trainerId is valid MongoDB ObjectId
    if (!trainerId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid trainer ID' });
    }

    const hireRequestData = {
      trainerId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      country: country.trim(),
      address: address.trim(),
      province: province.trim(),
      district: district.trim(),
      postalCode: postalCode.trim(),
      duration: duration ? duration.trim() : '',
      message: message ? message.trim() : '',
      status: 'pending'
    };

    const newHireRequest = await HireRequest.create(hireRequestData);
    const populatedRequest = await HireRequest.findById(newHireRequest._id)
      .populate('trainerId', 'name title');

    res.status(201).json({
      success: true,
      data: populatedRequest,
      message: 'ส่งคำขอจ้างงานสำเร็จ'
    });
  } catch (error) {
    console.error('Error creating hire request:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการส่งคำขอจ้างงาน' });
  }
};

// PUT /api/hire-requests/:id - อัปเดตข้อมูลคำขอจ้างงาน
export const updateHireRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid hire request ID' });
    }

    const hireRequest = await HireRequest.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('trainerId', 'name title');

    if (!hireRequest) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลคำขอจ้างงาน' });
    }

    res.json({
      success: true,
      data: hireRequest,
      message: 'อัปเดตข้อมูลคำขอจ้างงานสำเร็จ'
    });
  } catch (error) {
    console.error('Error updating hire request:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลคำขอจ้างงาน' });
  }
};

// PUT /api/hire-requests/:id/status - อัปเดตสถานะคำขอจ้างงาน
export const updateHireRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid hire request ID' });
    }

    if (!req.body.status) {
      return res.status(400).json({ error: 'กรุณาระบุสถานะ' });
    }

    const hireRequest = await HireRequest.findByIdAndUpdate(
      id,
      { status: req.body.status },
      { new: true, runValidators: true }
    ).populate('trainerId', 'name title');

    if (!hireRequest) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลคำขอจ้างงาน' });
    }

    res.json({
      success: true,
      data: hireRequest,
      message: 'อัปเดตสถานะสำเร็จ'
    });
  } catch (error) {
    console.error('Error updating hire request status:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตสถานะ' });
  }
};

// DELETE /api/hire-requests/:id - ลบคำขอจ้างงาน
export const deleteHireRequest = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid hire request ID' });
    }

    const hireRequest = await HireRequest.findByIdAndDelete(id);

    if (!hireRequest) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลคำขอจ้างงาน' });
    }

    res.json({
      success: true,
      message: `ลบคำขอจ้างงาน ID ${id} สำเร็จ`
    });
  } catch (error) {
    console.error('Error deleting hire request:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบคำขอจ้างงาน' });
  }
};

