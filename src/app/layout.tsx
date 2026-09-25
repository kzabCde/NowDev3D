import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./phase5.css";
import "./phase51.css";
import "./phase51-runtime.css";
import "./phase52.css";

export const metadata: Metadata = {
  title: "NowDev3D — Interactive Motion Portfolio",
  description:
    "A responsive monochrome motion portfolio by NowhereDEV with interactive project micro-demos, cinematic transitions and lightweight WebGL.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#050505",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
