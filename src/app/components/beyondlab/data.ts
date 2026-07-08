export const navItems = [
  { label: "คอร์ส", href: "/#courses" },
  { label: "ผลงาน", href: "/portfolio" },
  { label: "บริการ", href: "/services" },
  { label: "คอมมูนิตี้", href: "/#community" },
  { label: "เกี่ยวกับ", href: "/#about" },
];

export const aboutStats = [
  ["2", "ติวเตอร์ผู้ก่อตั้ง วิศวะคอม (CEDT) จุฬาฯ"],
  ["2 ปีซ้อน", "ผู้แทนศูนย์ สอวน. โอลิมปิกคอมพิวเตอร์"],
  ["C++", "ภาษาหลักที่ใช้ติวเข้มสายโอลิมปิก"],
];

export const tutors = [
  {
    name: "พี่โม",
    handle: "@kittmkrn_",
    role: "ติวเตอร์ผู้ก่อตั้ง BeyondLab",
    credentials: [
      "วิศวกรรมคอมพิวเตอร์ (CEDT) จุฬาลงกรณ์มหาวิทยาลัย",
      "ผู้แทนศูนย์ สอวน. โอลิมปิกคอมพิวเตอร์ 2 ปีซ้อน",
    ],
  },
  {
    name: "พี่มิก",
    handle: "@onyou_exe",
    role: "ติวเตอร์ผู้ก่อตั้ง BeyondLab",
    credentials: [
      "วิศวกรรมคอมพิวเตอร์ (CEDT) จุฬาลงกรณ์มหาวิทยาลัย",
      "ผู้แทนศูนย์ สอวน. โอลิมปิกคอมพิวเตอร์ 2 ปีซ้อน",
    ],
  },
];

export const buildCards = [
  {
    title: "พื้นฐาน C++ ที่แน่น",
    text: "เขียนโค้ดเป็น อ่านโจทย์ออก เข้าใจหลักการทำงานของภาษา C++ ตั้งแต่รากฐาน ไม่ท่องจำแบบผิวเผิน",
    meta: "Syntax / Logic / Debug",
    gradient: "from-blue-50 via-white to-white",
  },
  {
    title: "โครงสร้างข้อมูล & อัลกอริทึม",
    text: "เจาะลึก data structures และ algorithm ที่ใช้แข่งขันจริง ตั้งแต่พื้นฐานจนถึงระดับที่ใช้สอบคัดตัว",
    meta: "DSA / Complexity / Problem Solving",
    gradient: "from-white via-sky-50 to-white",
  },
  {
    title: "กลยุทธ์การแข่งขัน",
    text: "ฝึกวิเคราะห์โจทย์ บริหารเวลาในห้องสอบ และเทคนิคเลือกโจทย์ให้ทำคะแนนได้ทันเวลา",
    meta: "Contest Strategy / Time Management",
    gradient: "from-gray-50 via-white to-blue-50",
  },
  {
    title: "พร้อมลงสนามจริง",
    text: "ฝึกแข่งกับโจทย์จากสนามจริง จำลองบรรยากาศห้องสอบ สะสมผลงานที่พร้อมต่อยอด",
    meta: "Mock Contest / Practice / Portfolio",
    gradient: "from-white via-gray-50 to-white",
  },
];

export const roadmapItems = [
  ["01", "พื้นฐาน C++", "เริ่มจาก syntax ตัวแปร การรับส่งค่า และความมั่นใจในการเขียนโค้ดบรรทัดแรก"],
  ["02", "โครงสร้างข้อมูล & อัลกอริทึม", "เจาะลึก data structures และ algorithm ที่เป็นแกนหลักของการแข่งขันโอลิมปิกคอมพิวเตอร์"],
  ["03", "กลยุทธ์การแข่งขัน", "ฝึกวิเคราะห์โจทย์ บริหารเวลา และเทคนิคทำข้อสอบให้ครบและทันเวลา"],
  ["04", "ลงสนามจริง", "จำลองบรรยากาศห้องสอบ ฝึกแข่งกับโจทย์จากสนามจริงอย่างสม่ำเสมอ"],
  ["05", "Beyond", "ต่อยอดสู่เส้นทางสาย CS พร้อมเครือข่ายรุ่นพี่ เมนเทอร์ และคอมมูนิตี้นักแข่ง"],
];

export const portfolioPreview = [
  { title: "ผลการแข่งขัน", text: "รวบรวมผลงานและรางวัลจากสนามแข่งของนักเรียน BeyondLab", badge: "เร็วๆ นี้" },
  {
    title: "คอร์สที่เคยสอน",
    text: "ZERO TO CODE คอร์สปูพื้นฐานที่มีผู้เรียนแล้วกว่า 80+ คน",
    badge: "80+ คนเรียน",
    href: "/portfolio/zero-to-code",
  },
  { title: "กิจกรรม & ภาพบรรยากาศ", text: "ภาพและเรื่องราวจากคลาสเรียน แคมป์ และกิจกรรมต่าง ๆ", badge: "เร็วๆ นี้" },
];

export const pastCourses = [
  {
    slug: "zero-to-code",
    name: "ZERO TO CODE",
    students: "80+",
    description: "คอร์สปูพื้นฐานเขียนโปรแกรมสำหรับผู้เริ่มต้น ตั้งแต่ศูนย์จนเขียนโค้ดเป็น",
  },
];

export const portfolioCategories = [
  {
    title: "ผลการแข่งขัน",
    description: "รางวัลและผลงานการแข่งขันของนักเรียน BeyondLab จะถูกรวบรวมไว้ที่นี่",
  },
  {
    title: "กิจกรรม & ภาพบรรยากาศ",
    description: "ภาพและเรื่องราวจากคลาสเรียน แคมป์ และกิจกรรมต่าง ๆ ของ BeyondLab",
  },
];

export const services = [
  {
    title: "สอนเขียนโปรแกรมโอลิมปิก C++",
    tag: "Teaching",
    description:
      "ปูพื้นฐาน C++ โครงสร้างข้อมูล อัลกอริทึม และกลยุทธ์การแข่งขัน ตั้งแต่เริ่มต้นจนพร้อมลงสนามจริง ทั้งแบบตัวต่อตัวและกลุ่มเล็ก",
    points: [
      "เนื้อหาเข้มข้นแบบสาย สอวน. / โอลิมปิก",
      "ฝึกทำโจทย์จริงพร้อมรีวิวโค้ดรายคน",
      "ปรับหลักสูตรตามระดับผู้เรียน",
    ],
    status: "open",
  },
  {
    title: "รับให้คำปรึกษา",
    tag: "Consulting",
    description:
      "ให้คำปรึกษาด้านการเตรียมตัวแข่งขัน วางแผนเส้นทางสาย CS/โอลิมปิก หรือรีวิวแนวทางแก้โจทย์เป็นรายบุคคล",
    points: [
      "วางแผนเตรียมสอบและเตรียมแข่งขัน",
      "รีวิวแนวทางแก้โจทย์และโค้ด",
      "แนะแนวเส้นทางสาย computer science",
    ],
    status: "open",
  },
  {
    title: "งานอื่น ๆ ที่เปิดรับ",
    tag: "Coming Soon",
    description: "เรากำลังเตรียมเปิดบริการใหม่ ๆ เพิ่มเติม ติดตามอัปเดตได้ทางช่องทางคอมมูนิตี้ด้านล่าง",
    points: [],
    status: "coming-soon",
  },
];

export const contactChannels = [
  {
    label: "Instagram",
    handle: "@beyondlab.official",
    href: "https://www.instagram.com/beyondlab.official/?hl=th",
    status: "active",
    description: "ติดตามคอนเทนต์ อัปเดตคอร์ส และผลงานนักเรียน",
    logo: "/logos/instagram.png",
  },
  {
    label: "LINE Official",
    handle: "@546tmxqp",
    href: "https://lin.ee/813cTe5",
    status: "active",
    description: "ช่องทางแชทพูดคุยและสอบถามคอร์สโดยตรง",
    logo: "/logos/line.png",
  },
  {
    label: "Discord Community",
    handle: "เข้าร่วมเซิร์ฟเวอร์",
    href: "https://discord.gg/D4u2GBM4Mn",
    status: "active",
    description: "คอมมูนิตี้พูดคุย แลกเปลี่ยนโจทย์ และติดตามข่าวสาร",
    logo: "/logos/discord.png",
  },
];
