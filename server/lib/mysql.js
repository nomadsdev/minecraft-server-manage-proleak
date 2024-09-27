const mysql = require('mysql'); // นำเข้าโมดูล mysql เพื่อใช้เชื่อมต่อกับฐานข้อมูล
require('dotenv').config(); // นำเข้า dotenv เพื่อโหลดตัวแปรสภาพแวดล้อม (environment variables) จากไฟล์ .env

// สร้างการเชื่อมต่อกับฐานข้อมูลโดยใช้ค่าจากไฟล์ .env (host, user, password, และ database)
const connectMysql = mysql.createConnection({
    host: process.env.DB_HOST,       // ที่อยู่ของเซิร์ฟเวอร์ฐานข้อมูล
    user: process.env.DB_USER,       // ชื่อผู้ใช้ของฐานข้อมูล
    password: process.env.DB_PASS,   // รหัสผ่านของฐานข้อมูล
    database: process.env.DB_DATA,   // ชื่อฐานข้อมูล
});

// เริ่มต้นการเชื่อมต่อกับฐานข้อมูล
connectMysql.connect((err) => {
    if (err) {
        console.error('Error connection Mysql'); // หากเกิดข้อผิดพลาดในการเชื่อมต่อ จะแสดงข้อความ "Error connection Mysql"
    }
    console.log('Connected to Mysql'); // หากเชื่อมต่อสำเร็จ จะแสดงข้อความ "Connected to Mysql"
});

module.exports = connectMysql; // ส่งออกโมดูลการเชื่อมต่อเพื่อให้สามารถนำไปใช้ในส่วนอื่น ๆ ของแอปพลิเคชัน