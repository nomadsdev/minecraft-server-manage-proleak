const express = require('express');
const obscureRouter = express.Router();
const obscureDB = require('../lib/mysql'); // เรียกใช้ฐานข้อมูล MySQL ที่เชื่อมต่อผ่าน lib/mysql
const bcrypt = require('bcrypt'); // เรียกใช้ bcrypt เพื่อเข้ารหัสรหัสผ่าน
const jwt = require('jsonwebtoken'); // เรียกใช้ jwt สำหรับสร้าง token หลังจากผู้ใช้ล็อกอิน
const { v4: obscureUuidv4 } = require('uuid'); // เรียกใช้ uuid เพื่อสร้างค่า uuid แบบสุ่ม
require('dotenv').config(); // เรียกใช้ dotenv เพื่อดึง environment variables จากไฟล์ .env

// ฟังก์ชันแปลง binary ให้เป็น string
const obscureBinaryToString = (bin) => {
    return bin.split(' ').map((b) => {
        return String.fromCharCode(parseInt(b, 2));
    }).join('');
};

// API สำหรับการสมัครสมาชิก
obscureRouter.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body; // ดึงข้อมูลจาก body ของ request

    // ตรวจสอบว่าข้อมูลครบถ้วนหรือไม่
    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบทุกช่อง' });
    }

    const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailCheck.test(email)) {
        return res.status(400).json({ message: 'ที่อยู่อีเมลไม่ถูกต้อง' }); // ถ้าอีเมลไม่ถูกต้อง ส่งข้อความแจ้งเตือน
    }

    // ตรวจสอบความยาวของรหัสผ่าน
    if (password.length < 6) {
        return res.status(400).json({ message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' }); // ถ้ารหัสผ่านสั้นเกินไป ส่งข้อความแจ้งเตือน
    }

    // ตรวจสอบว่ารหัสผ่านและการยืนยันรหัสผ่านตรงกันหรือไม่
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'รหัสผ่านไม่ตรงกัน' }); // ถ้ารหัสผ่านไม่ตรงกัน ส่งข้อความแจ้งเตือน
    }

    // ตรวจสอบว่าชื่อผู้ใช้หรืออีเมลมีอยู่ในฐานข้อมูลหรือไม่
    obscureDB.query(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [username, email],
        async (err, results) => {
            if (err) {
                console.error('DB Error'); // แสดงข้อความถ้ามีข้อผิดพลาดในฐานข้อมูล
                return res.status(500).json({ message: 'สมัครไม่สำเร็จ' }); // ส่งข้อความแจ้งเตือนข้อผิดพลาด
            }

            // ถ้ามีชื่อผู้ใช้หรืออีเมลในฐานข้อมูลแล้ว
            if (results.length > 0) {
                return res.status(400).json({
                    message: 'ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้แล้ว' // แจ้งว่าไม่สามารถใช้ชื่อผู้ใช้หรืออีเมลนี้ได้
                });
            }

            try {
                const obscureUuid = obscureUuidv4(); // สร้าง uuid สำหรับผู้ใช้ใหม่
                const hashedPwd = await bcrypt.hash(password, 10); // เข้ารหัสรหัสผ่านด้วย bcrypt

                // เพิ่มข้อมูลผู้ใช้ใหม่ลงในฐานข้อมูล
                obscureDB.query(
                    'INSERT INTO users (username, email, password, uuid) VALUES (?, ?, ?, ?)',
                    [username, email, hashedPwd, obscureUuid],
                    async (err, result) => {
                        if (err) {
                            console.error('DB Error'); // แสดงข้อความถ้ามีข้อผิดพลาดในฐานข้อมูล
                            return res.status(500).json({
                                message: 'สมัครไม่สำเร็จ' // ส่งข้อความแจ้งเตือนข้อผิดพลาด
                            });
                        }

                        // ดึงข้อมูลผู้ใช้ที่เพิ่งลงทะเบียนเสร็จ
                        obscureDB.query(
                            'SELECT * FROM users WHERE id = ?',
                            [result.insertId],
                            (err, userResults) => {
                                if (err) {
                                    console.error('DB Error'); // แสดงข้อความถ้ามีข้อผิดพลาดในฐานข้อมูล
                                    return res.status(500).json({
                                        message: 'สมัครไม่สำเร็จ' // ส่งข้อความแจ้งเตือนข้อผิดพลาด
                                    });
                                }

                                const user = userResults[0]; // รับข้อมูลของผู้ใช้
                                const jwtToken = jwt.sign(
                                    { id: user.id },
                                    process.env.KEY_AUTH,
                                    { expiresIn: '1h' } // สร้าง token ด้วย jwt
                                );

                                // ส่งผลลัพธ์การสมัครสมาชิก
                                res.status(201).json({
                                    message: 'สมัครสำเร็จ กรุณาเข้าสู่ระบบ', // แจ้งว่าการสมัครสมาชิกสำเร็จ
                                    proleak_token: jwtToken, // ส่ง token ที่สร้างขึ้น
                                    token: user.token // ส่ง token ของผู้ใช้
                                });
                            }
                        );
                    }
                );
            } catch (error) {
                console.error('DB Error'); // แสดงข้อความถ้ามีข้อผิดพลาดในฐานข้อมูล
                return res.status(500).json({
                    message: 'สมัครไม่สำเร็จ' // ส่งข้อความแจ้งเตือนข้อผิดพลาด
                });
            }
        }
    );
});

// API สำหรับการเข้าสู่ระบบ
obscureRouter.post('/login', async (req, res) => {
    const { username, password } = req.body; // ดึงข้อมูลชื่อผู้ใช้และรหัสผ่านจาก body

    // ตรวจสอบว่าชื่อผู้ใช้และรหัสผ่านถูกกรอกหรือไม่
    if (!username || !password) {
        return res.status(400).json({
            message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' // ส่งข้อความแจ้งเตือนถ้าข้อมูลไม่ครบ
        });
    }

    const decodedUser = obscureBinaryToString(username); // แปลงชื่อผู้ใช้จาก binary เป็น string
    const decodedPwd = obscureBinaryToString(password); // แปลงรหัสผ่านจาก binary เป็น string

    const query = 'SELECT * FROM users WHERE username = ?'; // คำสั่ง SQL สำหรับค้นหาผู้ใช้

    obscureDB.query(query, [decodedUser], async (err, result) => {
        if (err) {
            console.error('DB Error'); // แสดงข้อความถ้ามีข้อผิดพลาดในฐานข้อมูล
            return res.status(500).json({
                message: 'เกิดข้อผิดพลาดในระบบ' // ส่งข้อความแจ้งเตือนข้อผิดพลาด
            });
        }

        // ถ้าหาผู้ใช้ไม่พบ
        if (result.length === 0) {
            return res.status(401).json({
                message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' // แจ้งว่าชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง
            });
        }

        const user = result[0]; // รับข้อมูลของผู้ใช้
        const isPasswordMatch = await bcrypt.compare(decodedPwd, user.password); // ตรวจสอบว่ารหัสผ่านตรงกันไหม

        // ถ้ารหัสผ่านไม่ตรงกัน
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' // แจ้งว่าชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง
            });
        }

        // สร้าง token สำหรับผู้ใช้ที่เข้าสู่ระบบสำเร็จ
        const token = jwt.sign(
            { id: user.id },
            process.env.KEY_AUTH,
            { expiresIn: '1h' } // กำหนดเวลาหมดอายุของ token
        );

        // ส่งผลลัพธ์การเข้าสู่ระบบ
        res.status(200).json({
            message: 'เข้าสู่ระบบสำเร็จ', // แจ้งว่าการเข้าสู่ระบบสำเร็จ
            proleak_token: token, // ส่ง token ที่สร้างขึ้น
            token: user.uuid // ส่ง uuid ของผู้ใช้
        });
    });
});

module.exports = obscureRouter; // ส่งออก router สำหรับใช้งานในส่วนอื่น