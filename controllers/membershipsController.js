import Membership from '../models/Membership.js';

// GET /api/memberships - ดึงข้อมูลแพ็คเกจสมาชิกทั้งหมด
export const getAllMemberships = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    const result = await Membership.find(query).sort({ price: 1 });
    res.json(result);
  } catch (error) {
    console.error('Error fetching memberships:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลแพ็คเกจสมาชิก' });
  }
};

// GET /api/memberships/:id - ดึงข้อมูลแพ็คเกจสมาชิกตาม ID
export const getMembershipById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid membership ID' });
    }

    const membership = await Membership.findById(id);

    if (!membership) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลแพ็คเกจสมาชิก' });
    }

    res.json(membership);
  } catch (error) {
    console.error('Error fetching membership:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลแพ็คเกจสมาชิก' });
  }
};

// POST /api/memberships - เพิ่มแพ็คเกจสมาชิกใหม่
export const createMembership = async (req, res) => {
  try {
    const { name, description, price, originalPrice, image, features, benefits, duration, classAccess, classLimit, personalTraining, equipmentAccess, lockerAccess } = req.body;

    if (!name || !description || !price) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    const membershipData = {
      name,
      description,
      price: parseInt(price),
      originalPrice: originalPrice ? parseInt(originalPrice) : undefined,
      image: image || '',
      features: Array.isArray(features) ? features.filter(f => f.trim()) : [],
      benefits: Array.isArray(benefits) ? benefits.filter(b => b.trim()) : [],
      duration: duration || 30,
      classAccess: classAccess || 'limited',
      classLimit: classLimit || 12,
      personalTraining: personalTraining || false,
      equipmentAccess: equipmentAccess !== undefined ? equipmentAccess : true,
      lockerAccess: lockerAccess || false,
      status: req.body.status || 'active'
    };

    const newMembership = await Membership.create(membershipData);

    res.status(201).json({
      success: true,
      data: newMembership,
      message: 'เพิ่มแพ็คเกจสมาชิกสำเร็จ'
    });
  } catch (error) {
    console.error('Error creating membership:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่มแพ็คเกจสมาชิก' });
  }
};

// PUT /api/memberships/:id - อัปเดตข้อมูลแพ็คเกจสมาชิก
export const updateMembership = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid membership ID' });
    }

    const membership = await Membership.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!membership) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลแพ็คเกจสมาชิก' });
    }

    res.json({
      success: true,
      data: membership,
      message: 'อัปเดตข้อมูลแพ็คเกจสมาชิกสำเร็จ'
    });
  } catch (error) {
    console.error('Error updating membership:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลแพ็คเกจสมาชิก' });
  }
};

// DELETE /api/memberships/:id - ลบแพ็คเกจสมาชิก
export const deleteMembership = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid membership ID' });
    }

    const membership = await Membership.findByIdAndDelete(id);

    if (!membership) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลแพ็คเกจสมาชิก' });
    }

    res.json({
      success: true,
      message: `ลบแพ็คเกจสมาชิก ID ${id} สำเร็จ`
    });
  } catch (error) {
    console.error('Error deleting membership:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบแพ็คเกจสมาชิก' });
  }
};

