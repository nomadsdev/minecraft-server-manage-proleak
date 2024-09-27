const express = require('express'); // นำเข้า Express framework ที่ช่วยในการสร้างเซิร์ฟเวอร์
const app = express(); // สร้างแอปพลิเคชัน Express
const bodyParser = require('body-parser'); // นำเข้า body-parser สำหรับแปลงข้อมูลที่ส่งมาใน request body
const cors = require('cors'); // นำเข้า CORS เพื่อกำหนดสิทธิ์การเข้าถึง API ข้ามโดเมน
const PORT = 3000; // ตั้งค่าพอร์ตที่เซิร์ฟเวอร์จะทำงาน

const helmet = require('helmet'); // นำเข้า helmet เพื่อเพิ่มการรักษาความปลอดภัยให้กับ HTTP headers
app.use(helmet()); // เปิดใช้งาน helmet เพื่อป้องกันการโจมตีทางเว็บบางประเภท

// ตั้งค่า body-parser ให้แอปแปลงข้อมูลที่มาจากฟอร์ม (urlencoded) และ JSON ให้ใช้งานได้ง่าย
app.use(bodyParser.urlencoded({ extended: true })); // รองรับการส่งข้อมูลในรูปแบบ URL encoded
app.use(bodyParser.json()); // รองรับการส่งข้อมูลในรูปแบบ JSON

// ตั้งค่า CORS (Cross-Origin Resource Sharing) ให้ API สามารถถูกเรียกใช้งานจากทุกแหล่งที่มา
app.use(cors({
    origin: '*', // อนุญาตให้ทุกโดเมนสามารถเข้าถึง API ได้
    methods: 'GET,POST,PUT,DELETE,OPTIONS', // อนุญาตให้ใช้เมธอดเหล่านี้
    allowedHeaders: 'Content-Type,Authorization' // กำหนดให้ header ที่อนุญาต คือ 'Content-Type' และ 'Authorization'
}));

const router = require('./routes/main'); // นำเข้า router หลักที่เก็บการกำหนดเส้นทาง (routes) ทั้งหมด

app.use('/', router); // ใช้ router ที่เรานำเข้ามาสำหรับเส้นทางหลัก (root path)

// ทำการเปิดเซิร์ฟเวอร์และรับฟังการร้องขอบนพอร์ตที่กำหนด (3000)
app.listen(PORT, () => {
  console.log(`Express server is running on http://localhost:${PORT}`); // แสดงข้อความว่าเซิร์ฟเวอร์กำลังทำงาน
});