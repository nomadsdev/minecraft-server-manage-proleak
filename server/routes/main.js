const express = require('express');
const obscureRouter = express.Router(); // สร้าง router สำหรับจัดการเส้นทางต่าง ๆ
const obscureRateLimit = require('express-rate-limit'); // นำเข้าฟังก์ชันสำหรับจำกัดการใช้งาน API
const obscureDB = require('../lib/mysql'); // นำเข้าการเชื่อมต่อฐานข้อมูล MySQL

const obscureAuthModule = require('../api/auth'); // นำเข้าโมดูลจัดการการยืนยันตัวตน (auth)
const obscureServerModule = require('../api/server'); // นำเข้าโมดูลจัดการเซิร์ฟเวอร์

// กำหนดข้อจำกัดการเข้าถึงเส้นทาง login เช่น ให้ลองได้ไม่เกิน 5 ครั้งใน 15 นาที
const obscureLoginLimiter = obscureRateLimit({
    windowMs: 15 * 60 * 1000, // กำหนดเวลา 15 นาที
    max: 5, // จำกัดจำนวนการลองเข้าสู่ระบบไม่เกิน 5 ครั้ง
    handler: (req, res) => {
        return res.status(429).json({
            message: 'คุณลองเข้าสู่ระบบบ่อยเกินไป กรุณารอ 15 นาทีแล้วลองใหม่อีกครั้ง'
        }); // ถ้าลองเกินกำหนด จะแสดงข้อความเตือน
    }
});

// เส้นทางที่ใช้สำหรับตั้งค่าเวลาในเซิร์ฟเวอร์เป็นช่วงกลางวัน
obscureRouter.get('/time/day', (req, res) => {
    if (!obscureServerModule) { // ตรวจสอบว่าเซิร์ฟเวอร์ทำงานหรือไม่
        return res.status(400).send('Server is not running.');
    }

    obscureServerModule.stdin.write('time set day\n'); // สั่งเซิร์ฟเวอร์ตั้งค่าเวลาเป็นกลางวัน
    return res.status(200).json('Time set to day.'); // ส่งกลับข้อความยืนยันว่าเซ็ตเวลาเป็นกลางวันแล้ว
});

// เส้นทางที่ใช้สำหรับตั้งค่าเวลาในเซิร์ฟเวอร์เป็นช่วงกลางคืน
obscureRouter.get('/time/night', (req, res) => {
    if (!obscureServerModule) { // ตรวจสอบว่าเซิร์ฟเวอร์ทำงานหรือไม่
        return res.status(400).send('Server is not running.');
    }

    obscureServerModule.stdin.write('time set night\n'); // สั่งเซิร์ฟเวอร์ตั้งค่าเวลาเป็นกลางคืน
    return res.status(200).json('Time set to night.'); // ส่งกลับข้อความยืนยันว่าเซ็ตเวลาเป็นกลางคืนแล้ว
});

// เส้นทางสำหรับการยืนยัน token ที่ส่งมาจาก client
obscureRouter.post('/verify', (req, res) => {
    const { token } = req.body; // ดึง token จาก request body
  
    if (!token) { // ถ้าไม่มี token จะส่งข้อความแจ้งเตือน
        return res.status(400).json({ message: 'Token is required.' });
    }

    const obscureToken = token; // เก็บ token ไว้ในตัวแปรใหม่

    // ค้นหา token ในฐานข้อมูลเพื่อยืนยันว่า valid หรือไม่
    obscureDB.query('SELECT * FROM users WHERE uuid = ?', [obscureToken], (err, results) => {
        if (err) { // ถ้ามีข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล
            console.error('Database error:', err); // แสดงข้อความข้อผิดพลาดใน console
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (results.length === 0) { // ถ้าไม่พบข้อมูลในฐานข้อมูล
            return res.status(401).json({ message: 'Invalid token' });
        }

        return res.status(200).json({ valid: true }); // ถ้า valid จะแสดงข้อความยืนยัน
    });
});

// ใช้ middleware สำหรับ auth และ server พร้อมกับ loginLimiter สำหรับป้องกันการลองเข้าสู่ระบบบ่อยเกินไป
obscureRouter.use('/auth', obscureLoginLimiter, obscureAuthModule);
obscureRouter.use('/server', obscureServerModule);

module.exports = obscureRouter; // ส่งออก router เพื่อใช้ในส่วนอื่นของแอปพลิเคชัน