import mongoose from 'mongoose';

const uiSettingsSchema = new mongoose.Schema({
  // Header Settings
  header: {
    bannerImage: { type: String, default: '' },
    mobileBannerImage: { type: String, default: '' },
    headerText: { type: String, default: 'ยินดีต้อนรับสู่ Muay Thai Academy' },
    subText: { type: String, default: 'โรงเรียนมวยไทยคุณภาพ สอนโดยครูมวยมืออาชีพ พร้อมอุปกรณ์ครบครัน' },
    overlayColor: { type: String, default: '#000000' },
    overlayOpacity: { type: Number, default: 40, min: 0, max: 100 },
    showOverlay: { type: Boolean, default: true }
  },

  // Logo & Branding Settings
  branding: {
    mainLogo: { type: String, default: '' },
    mobileLogo: { type: String, default: '' },
    favicon: { type: String, default: '' },
    primaryColor: { type: String, default: '#dc2626' },
    secondaryColor: { type: String, default: '#fbbf24' },
    companyName: { type: String, default: 'Muay Thai Academy' },
    companyDescription: { type: String, default: 'โรงเรียนมวยไทยคุณภาพ' }
  },

  // Homepage Settings
  homepage: {
    hero: {
      title: { type: String, default: 'ยินดีต้อนรับสู่ Muay Thai Academy' },
      subtitle: { type: String, default: 'โรงเรียนมวยไทยคุณภาพ สอนโดยครูมวยมืออาชีพ พร้อมอุปกรณ์ครบครัน' },
      button1Text: { type: String, default: 'ดูคอร์สเรียน' },
      button1Link: { type: String, default: '/courses' },
      button2Text: { type: String, default: 'ดูครูมวย' },
      button2Link: { type: String, default: '/trainers' }
    },
    about: {
      title: { type: String, default: 'เกี่ยวกับเรา' },
      content: { type: String, default: '' },
      image: { type: String, default: '' }
    },
    features: [{
      title: { type: String, default: '' },
      description: { type: String, default: '' }
    }]
  },

  // Services Section Settings (จำกัด 4 services)
  services: {
    title: { type: String, default: 'บริการของเรา' },
    subtitle: { type: String, default: 'เรามอบบริการที่หลากหลายเพื่อตอบสนองความต้องการทุกประเภท' },
    items: [{
      image: { type: String, default: '' },
      title: { type: String, default: 'คอร์สเรียนมวยไทย' },
      description: { type: String, default: 'เรียนมวยไทยกับครูมวยมืออาชีพ พัฒนาทักษะการต่อสู้ตั้งแต่พื้นฐานไปจนถึงขั้นสูง' },
      link: { type: String, default: '/courses' }
    }, {
      image: { type: String, default: '' },
      title: { type: String, default: 'ครูมวยมืออาชีพ' },
      description: { type: String, default: 'เรียนแบบตัวต่อตัวหรือกลุ่มเล็กกับครูมวยที่ผ่านการฝึกอบรมและมีประสบการณ์' },
      link: { type: String, default: '/trainers' }
    }, {
      image: { type: String, default: '' },
      title: { type: String, default: 'จ้างครูมวยไปต่างประเทศ' },
      description: { type: String, default: 'บริการจัดหาครูมวยมืออาชีพเพื่อไปสอนยังต่างประเทศ พร้อมดูแลเรื่องเอกสารและวีซ่า' },
      link: { type: String, default: '/hire-trainer' }
    }, {
      image: { type: String, default: '' },
      title: { type: String, default: 'สมาชิกรายเดือน' },
      description: { type: String, default: 'แพ็คเกจสมาชิกรายเดือนที่คุ้มค่า เข้าคลาสได้ไม่จำกัด พร้อมสิทธิพิเศษต่างๆ' },
      link: { type: String, default: '/memberships' }
    }]
  },

  // Content Section Settings (สำหรับเนื้อหาล่างสุดของหน้าแรก)
  content: {
    enabled: { type: Boolean, default: false },
    title: { type: String, default: '' },
    items: [{ // Array of content items
      type: { type: String, enum: ['text', 'image'], default: 'text' }, // 'text' or 'image'
      content: { type: String, default: '' }, // HTML content for text, image URL for image
      order: { type: Number, default: 0 } // Order of items
    }]
  },

  // Footer Settings
  footer: {
    companyName: { type: String, default: 'Muay Thai Academy' },
    description: { type: String, default: 'โรงเรียนมวยไทยคุณภาพ' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' },
    email: { type: String, default: '' },
    social: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      line: { type: String, default: '' }
    },
    footerLinks: [{
      text: { type: String, default: '' },
      url: { type: String, default: '' }
    }]
  },

  // Contact Information Settings
  contact: {
    address: {
      line1: { type: String, default: '' },
      line2: { type: String, default: '' },
      line3: { type: String, default: '' },
      postalCode: { type: String, default: '' }
    },
    phones: [{
      number: { type: String, default: '' },
      label: { type: String, default: '' }
    }],
    email: { type: String, default: '' },
    operatingHours: {
      weekday: { type: String, default: '09:00 - 21:00' },
      weekend: { type: String, default: '08:00 - 18:00' },
      note: { type: String, default: 'ปิดวันหยุดนักขัตฤกษ์' }
    },
    social: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      line: { type: String, default: '' }
    }
  },

  // Gallery Images
  gallery: [{
    url: { type: String, required: true },
    title: { type: String, default: '' },
    category: { type: String, default: '' }
  }],

  // Slider Settings
  slider: [{
    image: { type: String, required: true },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    link: { type: String, default: '' },
    order: { type: Number, default: 1 },
    active: { type: Boolean, default: true }
  }]
}, {
  timestamps: true
});

// Create index
uiSettingsSchema.index({ createdAt: -1 });

// Ensure only one document exists
uiSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const UISettings = mongoose.model('UISettings', uiSettingsSchema);

export default UISettings;

