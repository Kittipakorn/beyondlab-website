const { spawn } = require('child_process');
const os = require('os');
const fs = require('fs');

// 1. ค้นหา IP Address เครื่องจริงในวง Wi-Fi/LAN
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

const localIP = getLocalIP();

// 2. เคลียร์แคช Next.js ก่อนเริ่มระบบเสมอ
if (fs.existsSync('.next/cache')) {
  fs.rmSync('.next/cache', { recursive: true, force: true });
}

// 3. เริ่มต้นรัน Next.js dev server โดยส่งค่า FORCE_COLOR เพื่อบังคับให้แสดงสีในทอร์มินัล
const devProcess = spawn('npx', ['next', 'dev', '-H', '0.0.0.0', '-p', '3000'], {
  shell: true,
  stdio: ['inherit', 'pipe', 'inherit'],
  env: { 
    ...process.env, 
    FORCE_COLOR: '3' // บังคับแสดงผลแถบสี (ANSI True Color) แม้จะถูกดักจับท่อส่งข้อมูล (Piped)
  }
});

devProcess.stdout.on('data', (data) => {
  const lines = data.toString().split('\n');
  for (const line of lines) {
    // กรองเอา log ที่เยอะเกินไปออก (เช่น การคอมไพล์สำเร็จ/กำลังคอมไพล์ และ GET requests ของไฟล์ static)
    if (
      line.includes('Compiling') || 
      line.includes('Compiled') || 
      line.includes('GET /_next/') ||
      line.includes('HMR')
    ) {
      continue;
    }
    
    // แทนที่คำว่า 0.0.0.0 ด้วย IP จริง
    const output = line.replace(/0\.0\.0\.0/g, localIP);
    
    // พิมพ์เฉพาะบรรทัดที่เหลือ
    if (output.trim() !== '') {
      process.stdout.write(output + '\n');
    }
  }
});
