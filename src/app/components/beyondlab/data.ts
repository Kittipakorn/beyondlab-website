type ServiceItem = {
  title: string;
  tag: string;
  description: string;
  points: string[];
  status: "open" | "coming-soon";
  href?: string;
  cta?: string;
  image?: string;
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

export type CourseItem = {
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
  href: string;
  status: "open" | "soon";
  points: string[];
};

export type PortfolioCategoryItem = {
  title: string;
  description: string;
  badge: string;
  href?: string;
  image?: string;
};

export type PortfolioCategory = {
  title: string;
  description: string;
  items: PortfolioCategoryItem[];
};

export const navItems = [
   { label: "หน้าแรก", href: "/" },
  { label: "คอร์สเรียน", href: "/courses" },
  { label: "เข้าเรียน", href: "/learn" },
  { label: "ผลงาน", href: "/portfolio" },
  { label: "Grader", href: "/grader" },
];

export const aboutStats = [
  ["Learning", "คอร์สเรียนพื้นฐานและคอร์สต่อยอดสำหรับคนอยากสร้างผลงาน"],
  ["Building", "พื้นที่ทดลองทำโปรเจกต์ เดโม และผลงานที่จับต้องได้"],
  ["Sharing", "แชร์วิธีคิด เครื่องมือ และกระบวนการทำงานจริงแบบเข้าใจง่าย"],
];

export const mentorStats = [
  {
    value: "15+",
    label: "โปรเจกต์ที่ให้คำปรึกษา",
  },
  {
    value: "4+ ปี",
    label: "ประสบการณ์พัฒนาโปรเจกต์",
  },
  {
    value: "20+",
    label: "โปรเจกต์ Web, AI และ IoT",
  },
  {
    value: "10+",
    label: "ประสบการณ์แข่งขัน Hackathon และนวัตกรรม",
  },
];

export const tutors = [
  {
    name: "พี่โม",
    handle: "@kittmkrn_",
    image: "/mo-profile.png",
    role: "นักพัฒนาซอฟต์แวร์",
    credentials: [
      {
        highlight: "CEDT จุฬาฯ",
        text: "วิศวกรรมคอมพิวเตอร์และเทคโนโลยีดิจิทัล",
      },
      {
        highlight: "TOI 2 ปีซ้อน",
        text: "ผู้แทนศูนย์ สอวน. คอมพิวเตอร์โอลิมปิกระดับชาติ (TOI 19, TOI 20)",
      },
      {
        highlight: "เหรียญทองแดง",
        text: "Online International Math Challenge 2023",
      },
      {
        highlight: "Thailand Cyber Top Talent 2024",
        text: "ตัวแทนภาคตะวันออกเฉียงเหนือ",
      },
      {
        highlight: "ชนะเลิศระดับภูมิภาค",
        text: "การแข่งขันเขียนโปรแกรมด้วยภาษา C คอมพิวเตอร์ 2 ปีซ้อน",
      },
      {
        highlight: "ที่ปรึกษา 5+ โครงการ",
        text: "โครงงานคอมพิวเตอร์และนวัตกรรม",
      },
    ],
  },
  {
    name: "พี่มิคค์",
    handle: "@onyou_exe",
    image: "/mick-profile.png",
    role: "นักพัฒนาซอฟต์แวร์",
    credentials: [
      {
        highlight: "CEDT จุฬาฯ",
        text: "วิศวกรรมคอมพิวเตอร์และเทคโนโลยีดิจิทัล",
      },
      {
        highlight: "TOI 2 ปีซ้อน",
        text: "ผู้แทนศูนย์ สอวน. คอมพิวเตอร์โอลิมปิกระดับชาติ (TOI 19, TOI 20)",
      },
      {
        highlight: "เหรียญทองแดง",
        text: "NCSA CTF Boot Camp 2024",
      },
      {
        highlight: "รองชนะเลิศ",
        text: "AI Thailand Hackathon 2024 EP.2 AI for Thai 'APIs on Shelf'",
      },
      {
        highlight: "BangMod Hackathon",
        text: "ผ่านเข้ารอบการแข่งขัน",
      },
      {
        highlight: "ที่ปรึกษา 5+ โครงการ",
        text: "โครงงานคอมพิวเตอร์และนวัตกรรม",
      },
    ],
  },
];

export const courses: CourseItem[] = [
  {
    title: "ZERO TO CODE",
    label: "คอร์สออนไลน์",
    subtitle: "เขียนโปรแกรม C++ พื้นฐาน จาก 0",
    description: "",
    audience: "มือใหม่ / ไม่มีพื้นฐาน / เตรียมสอบ",
    format: "ออนไลน์ 8 ชั่วโมง + กลุ่มถามตอบ",
    price: "688.-",
    originalPrice: "990.-",
    duration: "8 hr.",
    students: "80+",
    image: "/courses/zero-to-code.png",
    cta: "สมัครเรียน 688.-",
    href: "http://lin.ee/VbDTcyo",
    status: "open",
    points: ["เรียนซ้ำได้ในกลุ่ม Facebook", "ใช้แท็บเล็ตหรือ iPad เรียนได้"],
  },
];

export const portfolioPreview = [
  {
    title: "ให้คำปรึกษาโปรเจกต์กล่องฆ่าเชื้อ UV",
    text: "ช่วยวางแนวทางการออกแบบวงจร เลือกอุปกรณ์ และเขียนโปรแกรมควบคุมด้วยไมโครคอนโทรลเลอร์",
    badge: "Consulting",
    image: "/project/uv.jpg",
  },
  {
    title: "QuizFlow",
    text: "เครื่องมือช่วยครูและติวเตอร์สร้างข้อสอบพร้อมเฉลย แก้ไข และส่งออกเป็น PDF ได้ทันที",
    badge: "Product",
    href: "https://quizflow.kittipakorn.com/",
    image: "/services/quizflow.png",
  },
];

export const portfolioCategories: PortfolioCategory[] = [
  {
    title: "ผลงานที่เคยทำ",
    description: "รวมผลงานและโปรเจกต์ต่างๆ ที่ทีม BeyondLab เคยลงมือทำจริง",
    items: [
      {
        title: "A.group Air & Network",
        description:
          "พัฒนาเว็บไซต์ให้ธุรกิจติดตั้งแอร์ ล้างแอร์ และงานไฟฟ้าครบวงจร ให้บริการในนครราชสีมาและจังหวัดใกล้เคียง พร้อมช่องทางโทรจองคิวและขอคำปรึกษาฟรีผ่าน Messenger ได้ทันที",
        badge: "Next.js",
        href: "https://agroup-air.vercel.app/",
        image: "/project/agroup-air.webp",
      },
      {
        title: "Nightmare",
        description:
          "เกมสยองขวัญ (Horror) ที่พัฒนาด้วย Unreal Engine ผู้เล่นต้องสำรวจด่านเพื่อเก็บไอเทมภารกิจ ปลดล็อกประตู และผ่านด่านไปเรื่อยๆ ระหว่างทางมีทั้งไอเทมเสริมพลังและไอเทมฟื้นฟูเลือดให้เก็บสะสม พร้อมผีที่ไล่ล่าผู้เล่นด้วยระบบ AI ตรวจจับระยะสายตา ผู้เล่นสามารถป้องกันตัวด้วยระบบยิงผี ใช้ไฟฉายส่องทาง และกด F เพื่อเก็บของ ครบทั้งระบบอินเตอร์เฟสแสดงเลือดและออกแบบแมพให้เข้ากับธีมเกมสยองขวัญ",
        badge: "Unreal Engine / C++",
        image: "/project/nightmare.webp",
      },
      {
        title: "Discord Bot",
        description:
          "ชุดบอท Discord ที่พัฒนาด้วย Python เพื่อช่วยจัดการเซิร์ฟเวอร์แบบครบวงจร ทั้งระบบพนักงาน ระบบคะแนน และฟังก์ชันตามวัตถุประสงค์ของแต่ละเซิร์ฟเวอร์ พร้อมบอทบันทึกกิจกรรม (Log) เช่น การเข้าออก การแก้ไขข้อความ และการเปลี่ยนชื่อ นอกจากนี้ยังมีบอทผ่อนคลาย อย่างบอทเปิดเพลงและบอทแชทด้วยระบบ AI โดยทุกบอททำงานออนไลน์ตลอด 24 ชั่วโมง",
        badge: "Python",
        image: "/project/discord-bot.webp",
      },
      {
        title: "โปรแกรมจัดตารางเรียน",
        description:
          "โปรแกรมจัดตารางเรียนที่ช่วยจัดสรรตารางสอนแต่ละห้อง/ระดับชั้นให้มีประสิทธิภาพ ลดการเดินทางย้ายอาคารหรือย้ายห้องของทั้งครูผู้สอนและนักเรียนให้น้อยที่สุด แสดงผลเป็นตารางรายสัปดาห์แยกตามห้องเรียน พร้อมฟีเจอร์ส่งออกตารางเป็นรูปภาพให้ใช้งานและแชร์ต่อได้ทันที",
        badge: "Python",
        image: "/project/class-schedule.webp",
      },
      {
        title:
          "ระบบประตูไฟฟ้าสแกนลายนิ้วมือและเซนเซอร์ตรวจจับวัตถุเพื่อความปลอดภัยในบ้านพร้อมการถ่ายภาพแจ้งเตือนผ่านแอปพลิเคชั่นไลน์",
        description:
          "ระบบล็อกประตูอัจฉริยะที่ปลดล็อกได้ทั้งการสแกนลายนิ้วมือและกดรหัสผ่านคีย์แพดสำรอง พร้อมเซนเซอร์ตรวจจับวัตถุ/การบุกรุกภายในบ้าน เมื่อตรวจพบความผิดปกติระบบจะถ่ายภาพและส่งแจ้งเตือนไปยังแอปพลิเคชัน LINE ของเจ้าของบ้านทันที เพิ่มความปลอดภัยและอุ่นใจได้แม้ไม่อยู่บ้าน",
        badge: "ESP32 / Fingerprint Sensor / LINE Notify",
        image: "/project/fingerprint-door-lock.webp",
      },
    ],
  },
  {
    title: "Consulting",
    description: "งานให้คำปรึกษาโปรเจกต์ ตั้งแต่ช่วยวางแนวทาง เลือกอุปกรณ์ ไปจนถึงแนวคิดการเขียนโปรแกรมควบคุม",
    items: [
      {
        title: "ให้คำปรึกษาโปรเจกต์กล่องฆ่าเชื้อ UV",
        description:
          "ช่วยวางแนวทางการออกแบบวงจร เลือกอุปกรณ์ และเขียนโปรแกรมควบคุมด้วยไมโครคอนโทรลเลอร์ สำหรับโปรเจกต์กล่องฆ่าเชื้ออัตโนมัติด้วยแสง UV",
        badge: "Microcontroller / Ultrasonic Sensor / Relay",
        image: "/project/uv.jpg",
      },
    ],
  },
  {
    title: "Products",
    description: "เครื่องมือและโปรดักต์ที่ BeyondLab สร้างเพื่อช่วยให้การเรียน การสอน และการทำงานสะดวกขึ้น",
    items: [
      {
        title: "QuizFlow",
        description: "เครื่องมือช่วยครูและติวเตอร์สร้างข้อสอบพร้อมเฉลย แก้ไข และส่งออกเป็น PDF ได้ทันที",
        badge: "Question Generator / PDF Export",
        href: "https://quizflow.kittipakorn.com/",
        image: "/services/quizflow.png",
      },
    ],
  },
];

export const services: ServiceItem[] = [
  {
    title: "BeyondLab Academy",
    tag: "Courses",
    description:
      "รวบรวมคอร์สเรียนเขียนโปรแกรมและเทคโนโลยีที่ปูพื้นฐานตั้งแต่เริ่มต้น เน้นการลงมือปฏิบัติจริงเพื่อนำไปต่อยอด",
    points: [
      "มีหลักสูตรหลากหลายครอบคลุมทักษะจำเป็น",
      "เน้นการคิดวิเคราะห์ แก้โจทย์ และทำโปรเจกต์จริง",
      "ดูแลใกล้ชิดพร้อมกลุ่มคอมมูนิตี้คอยถามตอบ",
    ],
    status: "open",
    href: "/courses",
    cta: "ดูคอร์สเรียน",
    image: "/services/courses.png",
  },
  {
    title: "BeyondLab Project Mentor",
    tag: "Consulting",
    description:
      "ช่วยดูไอเดีย วางแผน เลือกเทคโนโลยี และจัดทางเดินให้โปรเจกต์หรือพอร์ตไปต่อได้จริง",
    points: [
      "ปรึกษาโครงงานและโปรเจกต์",
      "รีวิวไอเดีย แผนงาน หรือพอร์ต",
      "แนะนำลำดับการเรียนรู้และเครื่องมือ",
    ],
    status: "open",
    href: "http://lin.ee/VbDTcyo",
    cta: "ติดต่อผ่าน LINE",
    image: "/services/project-mentor.png",
  },
  {
    title: "QuizFlow",
    tag: "Product",
    description: "ช่วยครูและติวเตอร์ สร้างข้อสอบพร้อมเฉลยในไม่กี่นาที แก้ไขและส่งออกเป็น PDF ได้ทันที",
    points: [
      "กำหนดวิชา หัวข้อ ระดับชั้น และความยากได้เอง",
      "แก้โจทย์ ตัวเลือก และเฉลยได้ในหน้าเดียว",
      "ส่งออกเป็น PDF พร้อมพิมพ์หรือแจกได้ทันที",
    ],
    status: "open",
    href: "https://quizflow.kittipakorn.com/",
    cta: "ลองใช้งานฟรี",
    image: "/services/quizflow.png",
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
