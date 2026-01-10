import User from '../models/User.js';

// GET /api/users - ดึงข้อมูลผู้ใช้ทั้งหมด
export const getAllUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;
    let query = {};

    if (role) {
      query.role = role;
    }

    if (status) {
      query.status = status;
    }

    let result = await User.find(query).select('-password'); // Exclude password from results

    // Filter by search term if provided
    if (search) {
      const searchTerm = search.toLowerCase();
      result = result.filter(u => 
        u.name.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm) ||
        u.phone.includes(searchTerm)
      );
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' });
  }
};

// GET /api/users/:id - ดึงข้อมูลผู้ใช้ตาม ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findById(id).select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลผู้ใช้' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' });
  }
};

// POST /api/users - เพิ่มผู้ใช้ใหม่
export const createUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
    }

    if (!password) {
      return res.status(400).json({ error: 'กรุณากรอกรหัสผ่าน' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' });
    }

    const userData = {
      name,
      email: email.toLowerCase(),
      phone,
      password: password, // In production, should hash password here
      role: req.body.role || 'user',
      status: req.body.status || 'active'
    };

    const newUser = await User.create(userData);
    
    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      data: userResponse,
      message: 'เพิ่มผู้ใช้สำเร็จ'
    });
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' });
    }
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่มผู้ใช้' });
  }
};

// PUT /api/users/:id - อัปเดตข้อมูลผู้ใช้
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลผู้ใช้' });
    }

    // Check if email is being changed and if it already exists
    if (req.body.email && req.body.email.toLowerCase() !== user.email) {
      const existingUser = await User.findOne({ email: req.body.email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' });
      }
    }

    const updateData = {
      name: req.body.name !== undefined ? req.body.name : user.name,
      email: req.body.email !== undefined ? req.body.email.toLowerCase() : user.email,
      phone: req.body.phone !== undefined ? req.body.phone : user.phone,
      role: req.body.role !== undefined ? req.body.role : user.role,
      status: req.body.status !== undefined ? req.body.status : user.status
    };

    // Only update password if provided
    if (req.body.password && req.body.password.trim() !== '') {
      updateData.password = req.body.password; // In production, should hash password here
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    }).select('-password'); // Exclude password from response

    res.json({
      success: true,
      data: updatedUser,
      message: 'อัปเดตข้อมูลผู้ใช้สำเร็จ'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ error: 'อีเมลนี้ถูกใช้งานแล้ว' });
    }
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลผู้ใช้' });
  }
};

// DELETE /api/users/:id - ลบผู้ใช้
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if id is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลผู้ใช้' });
    }

    res.json({
      success: true,
      message: `ลบผู้ใช้ ID ${id} สำเร็จ`
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบผู้ใช้' });
  }
};

