import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "./phase3.css";
import "./phase4.css";

export const metadata: Metadata = {
  title: "NowDev3D — Monochrome Printstream",
  description:
    "A monochrome cinematic 3D portfolio by NowhereDEV with adaptive WebGL, precision motion and premium black-and-white visual design.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070707",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
