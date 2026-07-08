type ServiceItem = {
  title: string;
  tag: string;
  description: string;
  points: string[];
  status: "open" | "coming-soon";
  href?: string;
  hidden?: boolean;
};

type ContactChannel = {
  label: string;
  handle: string;
  href: string;
  status: "active";
  description: string;
  logo?: string;
};

type CourseItem = {
  title: string;
  label: string;
  subtitle: string;
  description: string;
  audience: string;
  format: string;
  price: string;
  originalPrice: string;
  duration: string;
  students: string;
  image: string;
  cta: string;
  status: "open" | "soon";
  points: string[];
};

export const navItems = [
  { label: "Courses", href: "/#courses" },
  { label: "Services", href: "/#services" },
  { label: "Projects", href: "/#projects" },
  { label: "Contact", href: "/#contact" },
];

export const aboutStats = [
  ["Learning", "คอร์สเรียนพื้นฐานและคอร์สต่อยอดสำหรับคนอยากสร้างผลงาน"],
  ["Building", "พื้นที่ทดลองทำโปรเจกต์ เดโม และผลงานที่จับต้องได้"],
  ["Sharing", "แชร์วิธีคิด เครื่องมือ และกระบวนการทำงานจริงแบบเข้าใจง่าย"],
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

export const courses: CourseItem[] = [
  {
    title: "ZERO TO CODE",
    label: "คอร์สออนไลน์",
    subtitle: "เขียนโปรแกรม C++ พื้นฐาน จาก 0",
    description:
      "ปูพื้นฐาน C++ แบบเป็นขั้นตอน สำหรับคนเริ่มจากศูนย์",
    audience: "มือใหม่ / ไม่มีพื้นฐาน / เตรียมสอบ",
    format: "ออนไลน์ 8 ชั่วโมง + กลุ่มถามตอบ",
    price: "688.-",
    originalPrice: "990.-",
    duration: "8 hr.",
    students: "80+",
    image: "/courses/zero-to-code.png",
    cta: "สมัครเรียน 688.-",
    status: "open",
    points: ["เริ่มจาก 0 เขียนโค้ดได้จริง", "เรียนซ้ำได้ในกลุ่ม Facebook", "ใช้แท็บเล็ตหรือ iPad เรียนได้"],
  },
];

export const roadmapItems = [
  ["01", "เลือกเป้าหมาย", "เริ่มจากสิ่งที่อยากทำ ไม่ว่าจะเรียนพื้นฐาน ทำโครงงาน หรืออยากมีผลงานไว้ต่อยอด"],
  ["02", "แตกเป็นแผน", "วางลำดับเนื้อหา เครื่องมือ และ milestone ให้เห็นว่าต้องลงมืออะไรทีละขั้น"],
  ["03", "ลงมือทดลอง", "เรียนจากโจทย์ ตัวอย่าง และโปรเจกต์จริง เพื่อให้เข้าใจทั้งแนวคิดและการใช้งานจริง"],
  ["04", "ปรับและต่อยอด", "รีวิวสิ่งที่ทำ แก้ปัญหา และจัดผลงานให้เล่าเรื่องได้ชัดขึ้น"],
];

export const portfolioPreview = [
  { title: "Project Demos", text: "เดโมและตัวอย่างโปรเจกต์ที่ใช้เล่าแนวคิด วิธีทำ และผลลัพธ์จากการลงมือจริง", badge: "เร็วๆ นี้" },
  {
    title: "ZERO TO CODE",
    text: "ZERO TO CODE คอร์สปูพื้นฐานที่มีผู้เรียนแล้วกว่า 80+ คน",
    badge: "ผู้เรียน 80+",
    href: "/portfolio/zero-to-code",
  },
  { title: "Learning Notes", text: "บันทึกวิธีคิด เครื่องมือ และสิ่งที่เรียนรู้จากการทดลองทำโปรเจกต์", badge: "เร็วๆ นี้" },
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
    title: "Project Demos",
    description: "เดโมและตัวอย่างโปรเจกต์จากการทดลองทำจริงของ BeyondLab จะถูกรวบรวมไว้ที่นี่",
  },
  {
    title: "Learning Notes",
    description: "บันทึกแนวคิด เครื่องมือ และกระบวนการทำงานจริงจากคอร์สและโปรเจกต์ของ BeyondLab",
  },
];

export const services: ServiceItem[] = [
  {
    title: "คอร์สเรียน",
    tag: "Courses",
    description:
      "คอร์ส ZERO TO CODE สำหรับมือใหม่ที่อยากเริ่มเขียนโปรแกรม C++ จากพื้นฐานและนำไปต่อยอดได้จริง",
    points: [
      "เรียนออนไลน์ 8 ชั่วโมง",
      "ราคา 688.- จากปกติ 990.-",
      "เหมาะกับผู้เริ่มต้นและคนไม่มีพื้นฐาน",
    ],
    status: "open",
  },
  {
    title: "รับปรึกษาโปรเจกต์",
    tag: "Consulting",
    description:
      "ช่วยดูไอเดีย วางแผน เลือกเทคโนโลยี และจัดทางเดินให้โปรเจกต์หรือพอร์ตไปต่อได้จริง",
    points: [
      "ปรึกษาโครงงานและโปรเจกต์",
      "รีวิวไอเดีย แผนงาน หรือพอร์ต",
      "แนะนำลำดับการเรียนรู้และเครื่องมือ",
    ],
    status: "open",
  },
  {
    title: "QuizFlow",
    tag: "Product",
    description:
      "สร้างข้อสอบพร้อมเฉลยในไม่กี่นาที แก้ไขได้ทันที และส่งออกเป็น PDF พร้อมใช้งาน",
    points: [
      "ช่วยออกโจทย์ให้ตรงห้องเรียน ครูกำหนดวิชา หัวข้อ ระดับชั้น จำนวนข้อ และความยากได้ตามแผนการสอนจริง",
      "ช่วยปรับก่อนนำไปใช้ แก้โจทย์ ตัวเลือก เฉลย และคำอธิบายได้ในหน้าเดียว ก่อนส่งให้นักเรียน",
      "ช่วยจัดไฟล์ให้พร้อมแจก ส่งออกข้อสอบและเฉลยเป็น PDF ที่พร้อมพิมพ์หรือส่งต่อได้ทันที",
    ],
    status: "open",
    href: "https://quizflow.kittipakorn.com/dashboard",
  },
  {
    title: "IoT Kit / ชุดโครงงาน",
    tag: "Future",
    description:
      "ชุดอุปกรณ์ โค้ด เอกสาร และคลิปสอนสำหรับซื้อไปทำตามได้ทันที เช่น Smart Farm หรือถังขยะอัตโนมัติ",
    points: ["อยู่ในแผนพัฒนา", "เหมาะกับโครงงานและการเรียนแบบลงมือทำ"],
    status: "coming-soon",
    hidden: true,
  },
  {
    title: "LINE Bot",
    tag: "Future",
    description:
      "บริการออกแบบและพัฒนา LINE Bot สำหรับธุรกิจหรือโปรเจกต์ เช่น FAQ จองคิว แจ้งเตือน และเชื่อมระบบหลังบ้าน",
    points: ["วางเป็นบริการอนาคต", "ยังไม่ใช่บริการหลักในตอนนี้"],
    status: "coming-soon",
    hidden: true,
  },
];

export const visibleServices = services.filter((service) => !service.hidden);

export const contactChannels: ContactChannel[] = [
  {
    label: "Instagram",
    handle: "@beyondlab.official",
    href: "https://www.instagram.com/beyondlab.official/",
    status: "active",
    description: "ติดตามคอนเทนต์ อัปเดตคอร์ส และผลงานนักเรียน",
    logo: "/logos/instagram.png",
  },
  {
    label: "LINE Official",
    handle: "BeyondLab",
    href: "http://lin.ee/VbDTcyo",
    status: "active",
    description: "ช่องทางแชทพูดคุย สอบถามคอร์ส และปรึกษาโปรเจกต์",
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
