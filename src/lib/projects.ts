export type Project = {
  id: string;
  shortName: string;
  name: string;
  category: string;
  description: string;
  accent: string;
  position: [number, number, number];
  modelPath: string;
  chapter: string;
  stack: string[];
  liveUrl: string;
};

export const projects: Project[] = [
  {
    id: "air",
    shortName: "AIR",
    name: "Thai Air Intelligence",
    category: "Environmental Intelligence",
    description:
      "ระบบติดตาม PM2.5, AQI และพยากรณ์คุณภาพอากาศ 7 วัน พร้อม pipeline สำหรับ model evaluation และ production forecasting.",
    accent: "#5df7d2",
    position: [-3.6, 1.65, -1.2],
    modelPath: "/models/air-node.glb",
    chapter: "Atmospheric signal node",
    stack: ["Next.js", "LightGBM", "Supabase", "Vercel"],
    liveUrl: "https://northeastthailand-airquality.vercel.app/system",
  },
  {
    id: "stock",
    shortName: "STOCK",
    name: "NowhereInsideStock",
    category: "Market Intelligence",
    description:
      "แดชบอร์ดหุ้นแบบ interactive สำหรับติดตาม Magnificent Seven, watchlist, ranking, momentum และการเปรียบเทียบผลตอบแทนหลายช่วงเวลา.",
    accent: "#7b8dff",
    position: [3.35, 1.75, -1.55],
    modelPath: "/models/stock-node.glb",
    chapter: "Market pulse node",
    stack: ["Next.js", "Yahoo Finance", "Charts", "i18n"],
    liveUrl: "https://nowhereinsidestock.vercel.app/",
  },
  {
    id: "tuneup",
    shortName: "OBD",
    name: "NowTuneUp",
    category: "Vehicle Diagnostics",
    description:
      "แอปเครื่องมือรถยนต์สำหรับ OBD monitoring, performance measurement และข้อมูลการขับขี่ที่อ่านง่ายบนอุปกรณ์พกพา.",
    accent: "#ff9b5d",
    position: [-4.1, -1.55, -2.25],
    modelPath: "/models/obd-node.glb",
    chapter: "Telemetry signal node",
    stack: ["Android", "OBD2", "Telemetry", "UX"],
    liveUrl: "https://nowtuneup.vercel.app/",
  },
  {
    id: "mark",
    shortName: "MARK",
    name: "NowhereMark",
    category: "Creative Utility",
    description:
      "เครื่องมือจัดการภาพบนเว็บที่รวม watermark, resize, transform, live preview และ export workflow ไว้ในพื้นที่ทำงานเดียว.",
    accent: "#e77cff",
    position: [3.85, -1.25, -2.05],
    modelPath: "/models/mark-node.glb",
    chapter: "Visual creation node",
    stack: ["Next.js", "Canvas", "Image Tools", "UX"],
    liveUrl: "https://nowhere-mark.vercel.app/editor",
  },
  {
    id: "erp",
    shortName: "ERP",
    name: "Nowerp",
    category: "Business Platform",
    description:
      "ระบบ ERP แบบ multi-company และ multi-account พร้อมโครงสร้าง subscription และอินเทอร์เฟซสองภาษา.",
    accent: "#55c9ff",
    position: [-1.7, -3.05, -3.15],
    modelPath: "/models/erp-node.glb",
    chapter: "Operations system node",
    stack: ["Next.js", "Database", "Multi-tenant", "i18n"],
    liveUrl: "https://nowerp.vercel.app/th",
  },
  {
    id: "portfolio",
    shortName: "DEV",
    name: "NowhereDEV",
    category: "Portfolio System",
    description:
      "ศูนย์รวมโปรเจกต์และงานทดลองของ NowhereDEV ที่พัฒนาอย่างต่อเนื่อง ตั้งแต่ AI, data, utility ไปจนถึง interactive web experiences.",
    accent: "#f2f4ff",
    position: [1.55, -3.15, -3.3],
    modelPath: "/models/portfolio-node.glb",
    chapter: "Constellation root node",
    stack: ["Next.js", "Vercel", "Design System", "Projects"],
    liveUrl: "https://nowheredev.vercel.app/",
  },
];
