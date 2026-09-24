export type Project = {
  id: string;
  shortName: string;
  name: string;
  category: string;
  description: string;
  accent: string;
  position: [number, number, number];
  shape: "icosa" | "box" | "octa" | "torus" | "sphere" | "dodeca";
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
    accent: "#65f4c2",
    position: [-3.2, 1.35, -0.6],
    shape: "icosa",
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
    accent: "#8ea8ff",
    position: [3.1, 1.7, -0.9],
    shape: "box",
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
    accent: "#ffb36b",
    position: [-3.65, -1.35, -1.4],
    shape: "octa",
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
    accent: "#ef8cff",
    position: [3.45, -1.2, -1.25],
    shape: "torus",
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
    accent: "#74d7ff",
    position: [-1.45, -2.25, -2.4],
    shape: "dodeca",
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
    accent: "#f3f5ff",
    position: [1.2, -2.45, -2.5],
    shape: "sphere",
    stack: ["Next.js", "Vercel", "Design System", "Projects"],
    liveUrl: "https://nowheredev.vercel.app/",
  },
];
