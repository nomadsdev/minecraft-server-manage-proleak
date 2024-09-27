const express = require('express'); // นำเข้า express
const router = express.Router(); // สร้าง router ใหม่
const { spawn } = require('child_process'); // นำเข้า spawn จาก child_process เพื่อเรียกใช้โปรเซสใหม่
const path = require('path'); // นำเข้า path สำหรับจัดการเส้นทางไฟล์
const fs = require('fs'); // นำเข้า fs สำหรับการทำงานกับไฟล์ระบบ
let server; // ตัวแปรเก็บข้อมูลเซิร์ฟเวอร์

// กำหนดเส้นทางไปยังไฟล์เซิร์ฟเวอร์และไฟล์ properties
const serverPath = path.resolve(__dirname, '../bedrock-server-1.21.30.03', 'bedrock_server.exe');
const propertiesPath = path.resolve(__dirname, '../bedrock-server-1.21.30.03', 'server.properties');

// Route สำหรับเริ่มเซิร์ฟเวอร์
router.get('/start', (req, res) => {
    if (server) {
        return res.status(400).json({ message: 'Server is already running.' }); // แจ้งว่าเซิร์ฟเวอร์กำลังทำงานอยู่แล้ว
    }

    // เริ่มเซิร์ฟเวอร์
    server = spawn(serverPath);

    // รับข้อมูลจาก stdout ของเซิร์ฟเวอร์
    server.stdout.on('data', (data) => {
        console.log(`Server output: ${data}`); // แสดงข้อมูลที่เซิร์ฟเวอร์ส่งออก
    });

    // รับข้อมูลจาก stderr ของเซิร์ฟเวอร์
    server.stderr.on('data', (data) => {
        console.error(`Server error: ${data}`); // แสดงข้อผิดพลาดที่เซิร์ฟเวอร์ส่งออก
    });

    // เมื่อเซิร์ฟเวอร์หยุดทำงาน
    server.on('close', (code) => {
        console.log(`Server stopped with code: ${code}`); // แสดงรหัสการหยุดทำงานของเซิร์ฟเวอร์
        server = null; // รีเซ็ตตัวแปรเซิร์ฟเวอร์
    });

    // หากไม่สามารถเริ่มเซิร์ฟเวอร์ได้
    server.on('error', (err) => {
        console.error(`Failed to start server: ${err}`); // แสดงข้อผิดพลาดเมื่อไม่สามารถเริ่มเซิร์ฟเวอร์ได้
        return res.status(500).json({ message: 'Failed to start server.' }); // แจ้งข้อผิดพลาด
    });

    res.json({ message: 'Server is starting...', status: 'starting' }); // แจ้งว่าเซิร์ฟเวอร์กำลังเริ่มทำงาน
});

// Route สำหรับหยุดเซิร์ฟเวอร์
router.get('/stop', (req, res) => {
    if (!server) {
        return res.status(400).send('Server is not running.'); // แจ้งว่าเซิร์ฟเวอร์ยังไม่ได้ทำงาน
    }

    server.kill(); // หยุดเซิร์ฟเวอร์
    server = null; // รีเซ็ตตัวแปรเซิร์ฟเวอร์
    res.json({ message: 'Server has been stopped.', status: 'stopped' }); // แจ้งว่าเซิร์ฟเวอร์หยุดทำงานแล้ว
});

// Route เพื่อตรวจสอบสถานะเซิร์ฟเวอร์
router.get('/status', (req, res) => {
    const statusMessage = server ? 'running' : 'stopped'; // ตรวจสอบสถานะเซิร์ฟเวอร์
    return res.json({ status: statusMessage }); // ส่งสถานะเซิร์ฟเวอร์
});

// ฟังก์ชันสำหรับอัปเดต property ในไฟล์ server.properties
const updateServerProperty = (property, value, callback) => {
    fs.readFile(propertiesPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading server.properties:', err); // แสดงข้อผิดพลาดเมื่ออ่านไฟล์
            return callback(err); // ส่งคืนข้อผิดพลาด
        }

        // สร้าง regex เพื่อตรวจสอบและแทนที่ค่า property
        const regex = new RegExp(`^${property}=.*`, 'm');
        const newData = data.replace(regex, `${property}=${value}`); // แทนที่ค่าในไฟล์

        fs.writeFile(propertiesPath, newData, 'utf8', (err) => {
            if (err) {
                console.error('Error writing to server.properties:', err); // แสดงข้อผิดพลาดเมื่อเขียนไฟล์
                return callback(err); // ส่งคืนข้อผิดพลาด
            }
            callback(null); // ส่งคืนค่า null หากสำเร็จ
        });
    });
};

// Route สำหรับตั้งชื่อเซิร์ฟเวอร์
router.post('/setname', (req, res) => {
    const { serverName } = req.body; // ดึงชื่อเซิร์ฟเวอร์จาก body

    if (!serverName) {
        return res.status(400).json({ message: 'Server name is required.' }); // แจ้งว่าไม่พบชื่อเซิร์ฟเวอร์
    }

    // อัปเดตชื่อเซิร์ฟเวอร์ใน properties
    updateServerProperty('server-name', serverName, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to update server name.' }); // แจ้งว่าการอัปเดตชื่อเซิร์ฟเวอร์ล้มเหลว
        }
        res.json({ message: 'Server name updated successfully.', serverName }); // แจ้งว่าการอัปเดตชื่อเซิร์ฟเวอร์สำเร็จ
    });
});

module.exports = router; // ส่งออก router เพื่อใช้งานในส่วนอื่น