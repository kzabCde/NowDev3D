import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./phase5.css";

export const metadata: Metadata = {
  title: "NowDev3D — Motion Presentation",
  description:
    "A monochrome motion-presentation portfolio by NowhereDEV with scroll-driven storytelling, project-specific graphics and lightweight WebGL.",
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
