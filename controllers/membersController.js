import mongoose from 'mongoose';
import Member from '../models/Member.js';
import Membership from '../models/Membership.js';

// GET /api/members - ดึงข้อมูลสมาชิกทั้งหมด
export const getAllMembers = async (req, res) => {
  try {
    const { status, membershipId, email } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (membershipId) {
      query.membershipId = membershipId;
    }

    if (email) {
      query.email = email.toLowerCase().trim();
    }

    const members = await Member.find(query)
      .populate('membershipId', 'name price duration')
      .populate('registrationId', 'paymentStatus')
      .sort({ createdAt: -1 });

    res.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสมาชิก' });
  }
};

// GET /api/members/:id - ดึงข้อมูลสมาชิกตาม ID
export const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid member ID' });
    }

    const member = await Member.findById(id)
      .populate('membershipId', 'name price duration benefits')
      .populate('registrationId', 'paymentStatus paymentMethod');

    if (!member) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลสมาชิก' });
    }

    res.json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลสมาชิก' });
  }
};

// POST /api/members - เพิ่มสมาชิกใหม่
export const createMember = async (req, res) => {
  try {
    const { 
      userId, 
      membershipId, 
      registrationId,
      name, 
      email, 
      phone, 
      membershipType,
      startDate, 
      endDate, 
      status,
      autoRenew,
      paymentMethod,
      notes 
    } = req.body;

    if (!membershipId || !name || !email || !phone || !membershipType) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'กรุณากรอกอีเมลที่ถูกต้อง' });
    }

    // Check if phone number already exists and get the latest endDate
    let calculatedStartDate = startDate ? new Date(startDate) : null;
    const trimmedPhone = phone.trim();
    
    if (!calculatedStartDate) {
      // Find the latest member with the same phone number
      const existingMember = await Member.findOne({ phone: trimmedPhone })
        .sort({ endDate: -1 }); // Sort by endDate descending to get the latest one
      
      if (existingMember && existingMember.endDate) {
        // Set startDate to the day after the latest endDate
        calculatedStartDate = new Date(existingMember.endDate);
        calculatedStartDate.setDate(calculatedStartDate.getDate() + 1);
      } else {
        // No existing member found, use current date
        calculatedStartDate = new Date();
      }
    }

    // Calculate endDate if not provided
    let calculatedEndDate = endDate;
    if (!calculatedEndDate && membershipId) {
      // Get membership duration to calculate endDate
      const membership = await Membership.findById(membershipId);
      if (membership && membership.duration) {
        calculatedEndDate = new Date(calculatedStartDate);
        calculatedEndDate.setDate(calculatedEndDate.getDate() + membership.duration);
      }
    }

    const memberData = {
      userId: userId || undefined,
      membershipId: membershipId,
      registrationId: registrationId || undefined,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: trimmedPhone,
      membershipType: membershipType,
      startDate: calculatedStartDate,
      endDate: calculatedEndDate ? new Date(calculatedEndDate) : undefined,
      status: status || 'active',
      autoRenew: autoRenew || false,
      paymentMethod: paymentMethod || 'credit_card',
      notes: notes ? notes.trim() : undefined
    };

    // Validate required fields
    if (!memberData.endDate) {
      return res.status(400).json({ error: 'กรุณาระบุวันที่สิ้นสุดหรือกรอกข้อมูล membershipId ที่ถูกต้อง' });
    }

    const newMember = await Member.create(memberData);

    // Populate before sending response
    const populatedMember = await Member.findById(newMember._id)
      .populate('membershipId', 'name price duration')
      .populate('registrationId', 'paymentStatus');

    res.status(201).json({
      success: true,
      data: populatedMember,
      message: 'เพิ่มข้อมูลสมาชิกสำเร็จ'
    });
  } catch (error) {
    console.error('Error creating member:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูลสมาชิก' });
  }
};

// PUT /api/members/:id - อัปเดตข้อมูลสมาชิก
export const updateMember = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid member ID' });
    }

    // Validate email if provided
    if (req.body.email) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(req.body.email)) {
        return res.status(400).json({ error: 'กรุณากรอกอีเมลที่ถูกต้อง' });
      }
      req.body.email = req.body.email.toLowerCase().trim();
    }

    const member = await Member.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('membershipId', 'name price duration')
      .populate('registrationId', 'paymentStatus');

    if (!member) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลสมาชิก' });
    }

    res.json({
      success: true,
      data: member,
      message: 'อัปเดตข้อมูลสมาชิกสำเร็จ'
    });
  } catch (error) {
    console.error('Error updating member:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลสมาชิก' });
  }
};

// DELETE /api/members/:id - ลบสมาชิก
export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid member ID' });
    }

    const member = await Member.findByIdAndDelete(id);

    if (!member) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลสมาชิก' });
    }

    res.json({
      success: true,
      message: `ลบข้อมูลสมาชิก ID ${id} สำเร็จ`
    });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบข้อมูลสมาชิก' });
  }
};

