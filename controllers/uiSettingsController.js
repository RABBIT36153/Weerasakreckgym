import UISettings from '../models/UISettings.js';

// GET /api/ui-settings - ดึงการตั้งค่า UI ทั้งหมด
export const getUISettings = async (req, res) => {
  try {
    const settings = await UISettings.getSettings();
    res.json(settings);
  } catch (error) {
    console.error('Error fetching UI settings:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลการตั้งค่า UI' });
  }
};

// PUT /api/ui-settings - อัปเดตการตั้งค่า UI ทั้งหมด
export const updateUISettings = async (req, res) => {
  try {
    let settings = await UISettings.findOne();
    
    if (!settings) {
      // Create new settings if doesn't exist
      settings = await UISettings.create(req.body);
    } else {
      // Update existing settings
      settings = await UISettings.findOneAndUpdate(
        {},
        { $set: req.body },
        { new: true, runValidators: true }
      );
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Error updating UI settings:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตการตั้งค่า UI' });
  }
};

// PUT /api/ui-settings/header - อัปเดตการตั้งค่า Header
export const updateHeaderSettings = async (req, res) => {
  try {
    let settings = await UISettings.getSettings();
    settings.header = { ...settings.header, ...req.body };
    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error('Error updating header settings:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตการตั้งค่า Header' });
  }
};

// PUT /api/ui-settings/branding - อัปเดตการตั้งค่า Branding
export const updateBrandingSettings = async (req, res) => {
  try {
    let settings = await UISettings.getSettings();
    
    // อัปเดตเฉพาะ fields ที่ส่งมา (รองรับ mainLogo และ mobileLogo)
    if (req.body.mainLogo !== undefined) {
      settings.branding.mainLogo = req.body.mainLogo;
    }
    if (req.body.mobileLogo !== undefined) {
      settings.branding.mobileLogo = req.body.mobileLogo;
    }
    if (req.body.favicon !== undefined) {
      settings.branding.favicon = req.body.favicon;
    }
    if (req.body.primaryColor !== undefined) {
      settings.branding.primaryColor = req.body.primaryColor;
    }
    if (req.body.secondaryColor !== undefined) {
      settings.branding.secondaryColor = req.body.secondaryColor;
    }
    if (req.body.companyName !== undefined) {
      settings.branding.companyName = req.body.companyName;
    }
    if (req.body.companyDescription !== undefined) {
      settings.branding.companyDescription = req.body.companyDescription;
    }
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error('Error updating branding settings:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตการตั้งค่า Branding' });
  }
};

// PUT /api/ui-settings/homepage - อัปเดตการตั้งค่าหน้าแรก
export const updateHomepageSettings = async (req, res) => {
  try {
    let settings = await UISettings.getSettings();
    settings.homepage = { ...settings.homepage, ...req.body };
    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error('Error updating homepage settings:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตการตั้งค่าหน้าแรก' });
  }
};

// PUT /api/ui-settings/footer - อัปเดตการตั้งค่า Footer
export const updateFooterSettings = async (req, res) => {
  try {
    let settings = await UISettings.getSettings();
    settings.footer = { ...settings.footer, ...req.body };
    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error('Error updating footer settings:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตการตั้งค่า Footer' });
  }
};

// PUT /api/ui-settings/contact - อัปเดตการตั้งค่าข้อมูลติดต่อ
export const updateContactSettings = async (req, res) => {
  try {
    let settings = await UISettings.getSettings();
    
    // อัปเดตเฉพาะ fields ที่ส่งมา
    if (req.body.address) {
      settings.contact.address = { ...settings.contact.address, ...req.body.address };
    }
    if (req.body.phones !== undefined) {
      settings.contact.phones = req.body.phones;
    }
    if (req.body.email !== undefined) {
      settings.contact.email = req.body.email;
    }
    if (req.body.operatingHours) {
      settings.contact.operatingHours = { ...settings.contact.operatingHours, ...req.body.operatingHours };
    }
    if (req.body.social) {
      settings.contact.social = { ...settings.contact.social, ...req.body.social };
    }
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error('Error updating contact settings:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตการตั้งค่าข้อมูลติดต่อ' });
  }
};

// PUT /api/ui-settings/services - อัปเดตการตั้งค่าบริการ
export const updateServicesSettings = async (req, res) => {
  try {
    let settings = await UISettings.getSettings();
    
    // ตรวจสอบว่า services มีครบ 4 รายการ
    if (req.body.items && req.body.items.length !== 4) {
      return res.status(400).json({ error: 'ต้องมีบริการครบ 4 รายการ' });
    }
    
    // อัปเดต services settings
    if (req.body.title !== undefined) {
      settings.services.title = req.body.title;
    }
    if (req.body.subtitle !== undefined) {
      settings.services.subtitle = req.body.subtitle;
    }
    if (req.body.items !== undefined) {
      settings.services.items = req.body.items;
    }
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error('Error updating services settings:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตการตั้งค่าบริการ' });
  }
};

// PUT /api/ui-settings/content - อัปเดตการตั้งค่าเนื้อหา
export const updateContentSettings = async (req, res) => {
  try {
    let settings = await UISettings.getSettings();
    
    // อัปเดต content settings
    if (req.body.enabled !== undefined) {
      settings.content.enabled = req.body.enabled;
    }
    if (req.body.title !== undefined) {
      settings.content.title = req.body.title;
    }
    if (req.body.items !== undefined) {
      // Sort items by order
      const sortedItems = req.body.items.sort((a, b) => (a.order || 0) - (b.order || 0));
      settings.content.items = sortedItems;
    }
    
    // Support legacy format (single content field)
    if (req.body.content !== undefined && (!req.body.items || req.body.items.length === 0)) {
      settings.content.items = [{
        type: 'text',
        content: req.body.content,
        order: 0
      }];
    }
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error('Error updating content settings:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตการตั้งค่าเนื้อหา' });
  }
};

// POST /api/ui-settings/gallery - เพิ่มรูปภาพในแกลเลอรี
export const addGalleryImage = async (req, res) => {
  try {
    const { url, title, category } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'กรุณาระบุ URL ของรูปภาพ' });
    }
    
    let settings = await UISettings.getSettings();
    settings.gallery.push({ url, title: title || '', category: category || '' });
    await settings.save();
    
    res.json(settings);
  } catch (error) {
    console.error('Error adding gallery image:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่มรูปภาพในแกลเลอรี' });
  }
};

// PUT /api/ui-settings/gallery/:index - อัปเดตรูปภาพในแกลเลอรี
export const updateGalleryImage = async (req, res) => {
  try {
    const { index } = req.params;
    const { url, title, category } = req.body;
    
    let settings = await UISettings.getSettings();
    
    if (!settings.gallery[index]) {
      return res.status(404).json({ error: 'ไม่พบรูปภาพที่ต้องการแก้ไข' });
    }
    
    if (url) settings.gallery[index].url = url;
    if (title !== undefined) settings.gallery[index].title = title;
    if (category !== undefined) settings.gallery[index].category = category;
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error('Error updating gallery image:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตรูปภาพในแกลเลอรี' });
  }
};

// DELETE /api/ui-settings/gallery/:index - ลบรูปภาพจากแกลเลอรี
export const deleteGalleryImage = async (req, res) => {
  try {
    const { index } = req.params;
    
    let settings = await UISettings.getSettings();
    
    if (!settings.gallery[index]) {
      return res.status(404).json({ error: 'ไม่พบรูปภาพที่ต้องการลบ' });
    }
    
    settings.gallery.splice(index, 1);
    await settings.save();
    
    res.json(settings);
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบรูปภาพจากแกลเลอรี' });
  }
};

// POST /api/ui-settings/slider - เพิ่มสไลด์
export const addSlider = async (req, res) => {
  try {
    const { image, title, subtitle, link, order, active } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'กรุณาระบุ URL ของรูปภาพสไลด์' });
    }
    
    let settings = await UISettings.getSettings();
    
    const newOrder = order || (settings.slider.length > 0 
      ? Math.max(...settings.slider.map(s => s.order)) + 1 
      : 1);
    
    settings.slider.push({
      image,
      title: title || '',
      subtitle: subtitle || '',
      link: link || '',
      order: newOrder,
      active: active !== undefined ? active : true
    });
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error('Error adding slider:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเพิ่มสไลด์' });
  }
};

// PUT /api/ui-settings/slider/:index - อัปเดตสไลด์
export const updateSlider = async (req, res) => {
  try {
    const { index } = req.params;
    const { image, title, subtitle, link, order, active } = req.body;
    
    let settings = await UISettings.getSettings();
    
    if (!settings.slider[index]) {
      return res.status(404).json({ error: 'ไม่พบสไลด์ที่ต้องการแก้ไข' });
    }
    
    if (image !== undefined) settings.slider[index].image = image;
    if (title !== undefined) settings.slider[index].title = title;
    if (subtitle !== undefined) settings.slider[index].subtitle = subtitle;
    if (link !== undefined) settings.slider[index].link = link;
    if (order !== undefined) settings.slider[index].order = order;
    if (active !== undefined) settings.slider[index].active = active;
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error('Error updating slider:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตสไลด์' });
  }
};

// DELETE /api/ui-settings/slider/:index - ลบสไลด์
export const deleteSlider = async (req, res) => {
  try {
    const { index } = req.params;
    
    let settings = await UISettings.getSettings();
    
    if (!settings.slider[index]) {
      return res.status(404).json({ error: 'ไม่พบสไลด์ที่ต้องการลบ' });
    }
    
    settings.slider.splice(index, 1);
    await settings.save();
    
    res.json(settings);
  } catch (error) {
    console.error('Error deleting slider:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการลบสไลด์' });
  }
};

// PUT /api/ui-settings/slider/reorder - เรียงลำดับสไลด์ใหม่
export const reorderSlider = async (req, res) => {
  try {
    const { slides } = req.body; // Array of { index, order }
    
    if (!Array.isArray(slides)) {
      return res.status(400).json({ error: 'ข้อมูลไม่ถูกต้อง' });
    }
    
    let settings = await UISettings.getSettings();
    
    slides.forEach(({ index, order }) => {
      if (settings.slider[index]) {
        settings.slider[index].order = order;
      }
    });
    
    // Sort slider by order
    settings.slider.sort((a, b) => a.order - b.order);
    
    await settings.save();
    res.json(settings);
  } catch (error) {
    console.error('Error reordering slider:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการเรียงลำดับสไลด์' });
  }
};

