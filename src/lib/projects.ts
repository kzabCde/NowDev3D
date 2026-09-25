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

const MODEL_REVISION = "20260925b";
const model = (file: string) => `/models/${file}?v=${MODEL_REVISION}`;

export const projects: Project[] = [
  {
    id: "air",
    shortName: "AIR",
    name: "Thai Air Intelligence",
    category: "Environmental Intelligence",
    description:
      "ระบบติดตาม PM2.5, AQI และพยากรณ์คุณภาพอากาศ 7 วัน พร้อม pipeline สำหรับ model evaluation และ production forecasting.",
    accent: "#f4f4ef",
    position: [-3.6, 1.65, -1.2],
    modelPath: model("air-node.glb"),
    chapter: "Atmospheric signal object",
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
    accent: "#d7d7d1",
    position: [3.35, 1.75, -1.55],
    modelPath: model("stock-node.glb"),
    chapter: "Market structure object",
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
    accent: "#a8a8a2",
    position: [-4.1, -1.55, -2.25],
    modelPath: model("obd-node.glb"),
    chapter: "Telemetry instrument object",
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
    accent: "#e5e5e0",
    position: [3.85, -1.25, -2.05],
    modelPath: model("mark-node.glb"),
    chapter: "Visual frame object",
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
    accent: "#bdbdb7",
    position: [-1.7, -3.05, -3.15],
    modelPath: model("erp-node.glb"),
    chapter: "Operations module object",
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
    accent: "#ffffff",
    position: [1.55, -3.15, -3.3],
    modelPath: model("portfolio-node.glb"),
    chapter: "Root monolith object",
    stack: ["Next.js", "Vercel", "Design System", "Projects"],
    liveUrl: "https://nowheredev.vercel.app/",
  },
];
