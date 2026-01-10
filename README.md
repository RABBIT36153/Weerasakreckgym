# Muay Thai Academy - API Server

API Server สำหรับ Muay Thai Academy สร้างด้วย Express.js และ MongoDB

## การติดตั้ง

```bash
# ติดตั้ง dependencies
npm install

# ติดตั้ง mongoose (ถ้ายังไม่ได้ติดตั้ง)
npm install mongoose
```

## การตั้งค่า

1. สร้างไฟล์ `.env` ในโฟลเดอร์ `api/`:

```env
PORT=4002
MONGODB_URI=mongodb://localhost:27017/muaythai
```

2. ตรวจสอบว่า MongoDB ทำงานอยู่:
   - Local MongoDB: ตรวจสอบว่า MongoDB service ทำงานอยู่
   - หรือใช้ MongoDB Atlas: เปลี่ยน MONGODB_URI เป็น connection string จาก Atlas

## การรัน

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Trainers
- `GET /api/trainers` - ดึงข้อมูลครูมวยทั้งหมด
- `GET /api/trainers/:id` - ดึงข้อมูลครูมวยตาม ID
- `POST /api/trainers` - เพิ่มครูมวยใหม่
- `PUT /api/trainers/:id` - อัปเดตข้อมูลครูมวย
- `DELETE /api/trainers/:id` - ลบครูมวย

### Courses
- `GET /api/courses` - ดึงข้อมูลคอร์สทั้งหมด
- `GET /api/courses/:id` - ดึงข้อมูลคอร์สตาม ID
- `POST /api/courses` - เพิ่มคอร์สใหม่
- `PUT /api/courses/:id` - อัปเดตข้อมูลคอร์ส
- `DELETE /api/courses/:id` - ลบคอร์ส

### Users
- `GET /api/users` - ดึงข้อมูลผู้ใช้ทั้งหมด
- `GET /api/users/:id` - ดึงข้อมูลผู้ใช้ตาม ID
- `POST /api/users` - เพิ่มผู้ใช้ใหม่
- `PUT /api/users/:id` - อัปเดตข้อมูลผู้ใช้
- `DELETE /api/users/:id` - ลบผู้ใช้

### Registrations
- `GET /api/registrations` - ดึงข้อมูลการลงทะเบียนทั้งหมด
- `GET /api/registrations/:id` - ดึงข้อมูลการลงทะเบียนตาม ID
- `POST /api/registrations` - เพิ่มการลงทะเบียนใหม่
- `PUT /api/registrations/:id` - อัปเดตข้อมูลการลงทะเบียน
- `DELETE /api/registrations/:id` - ลบการลงทะเบียน

### Stats
- `GET /api/stats` - ดึงข้อมูลสถิติ

## เทคโนโลยีที่ใช้

- Express.js
- MongoDB (Mongoose)
- CORS
- dotenv

## Port

Default port: **4002**
