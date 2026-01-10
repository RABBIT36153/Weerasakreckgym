import Registration from '../models/Registration.js';

// GET /api/registrations - ดึงข้อมูลการลงทะเบียนทั้งหมด
export const getAllRegistrations = async (req, res) => {
  try {
    const { status, type, search, paymentStatus, courseId, itemId } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    if (type) {
      query.type = type;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // Filter by courseId (itemId with type=course)
    if (courseId) {
      query.itemId = courseId;
      query.type = 'course';
    }

    // Filter by itemId (generic)
    if (itemId && !courseId) {
      query.itemId = itemId;
    }

    let result = await Registration.find(query).sort({ createdAt: -1 });

    // Filter by search term if provided
    if (search) {
      const searchTerm = search.toLowerCase();
      result = result.filter(r => 
        (r.userName && r.userName.toLowerCase().includes(searchTerm)) ||
        (r.userEmail && r.userEmail.toLowerCase().includes(searchTerm)) ||
        (r.itemName && r.itemName.toLowerCase().includes(searchTerm))
      );
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลการลงทะเบียน' });
  }
};

// GET /api/registrations/:id - ดึงข้อมูลการลงทะเบียนตาม ID
export const getRegistrationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid registration ID' });
    }

    const registration = await Registration.findById(id);

    if (!registration) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลการลงทะเบียน' });
    }

    res.json(registration);
  } catch (error) {
    console.error('Error fetching registration:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลการลงทะเบียน' });
  }
};

// POST /api/registrations - เพิ่มการลงทะเบียนใหม่
export const createRegistration = async (req, res) => {
  try {
    const { courseId, trainerId, membershipId, type, itemName, price, userEmail, userPhone, userName, cardNumber, cardHolder } = req.body;

    // Determine type and itemId from courseId, trainerId, or membershipId
    let registrationType = type;
    let itemId = null;
    let itemModel = null;

    if (courseId) {
      registrationType = 'course';
      itemId = courseId;
      itemModel = 'Course';
    } else if (trainerId) {
      registrationType = 'trainer';
      itemId = trainerId;
      itemModel = 'Trainer';
    } else if (membershipId) {
      registrationType = 'membership';
      itemId = membershipId;
      itemModel = 'Membership';
    } else if (type && req.body.itemId) {
      // Fallback for old format
      registrationType = type;
      itemId = req.body.itemId;
      if (type === 'course') {
        itemModel = 'Course';
      } else if (type === 'trainer') {
        itemModel = 'Trainer';
      } else if (type === 'membership') {
        itemModel = 'Membership';
      }
    } else {
      return res.status(400).json({ error: 'กรุณาระบุ courseId, trainerId หรือ membershipId' });
    }

    // Validate required fields
    if (!itemId || !price || !userEmail || !userPhone) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    // Check if itemId is valid MongoDB ObjectId
    if (!itemId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid item ID' });
    }

    // Extract last 4 digits of card number if provided
    let cardLast4 = null;
    if (cardNumber) {
      const cleanedCard = cardNumber.replace(/\s/g, '');
      cardLast4 = cleanedCard.slice(-4);
    }

    const registrationData = {
      type: registrationType,
      itemId: itemId,
      itemModel: itemModel,
      itemName: itemName || 'Unknown',
      price: typeof price === 'string' ? parseInt(price.replace(/,/g, '')) : parseInt(price),
      userEmail: userEmail.toLowerCase().trim(),
      userPhone: userPhone.trim(),
      userName: userName || '',
      paymentMethod: req.body.paymentMethod || 'credit_card',
      paymentStatus: 'pending',
      status: 'pending',
      cardLast4: cardLast4,
      cardHolder: cardHolder || ''
    };

    const newRegistration = await Registration.create(registrationData);

    res.status(201).json({
      success: true,
      data: newRegistration,
      message: 'ลงทะเบียนสำเร็จ'
    });
  } catch (error) {
    console.error('Error creating registration:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลงทะเบียน' });
  }
};

// PUT /api/registrations/:id - อัปเดตข้อมูลการลงทะเบียน
export const updateRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid registration ID' });
    }

    const registration = await Registration.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!registration) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลการลงทะเบียน' });
    }

    res.json({
      success: true,
      data: registration,
      message: 'อัปเดตข้อมูลการลงทะเบียนสำเร็จ'
    });
  } catch (error) {
    console.error('Error updating registration:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลการลงทะเบียน' });
  }
};

// PUT /api/registrations/:id/status - อัปเดตสถานะการลงทะเบียน
export const updateRegistrationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid registration ID' });
    }

    if (!req.body.status) {
      return res.status(400).json({ error: 'กรุณาระบุสถานะ' });
    }

    const registration = await Registration.findByIdAndUpdate(
      id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!registration) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลการลงทะเบียน' });
    }

    res.json({
      success: true,
      data: registration,
      message: 'อัปเดตสถานะสำเร็จ'
    });
  } catch (error) {
    console.error('Error updating registration status:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตสถานะ' });
  }
};

// DELETE /api/registrations/:id - ลบการลงทะเบียน
export const deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid registration ID' });
    }

    const registration = await Registration.findByIdAndDelete(id);

    if (!registration) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลการลงทะเบียน' });
    }

    res.json({
      success: true,
      message: `ลบการลงทะเบียน ID ${id} สำเร็จ`
    });
  } catch (error) {
    console.error('Error deleting registration:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบการลงทะเบียน' });
  }
};

