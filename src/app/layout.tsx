import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./phase5.css";
import "./phase51.css";
import "./phase51-runtime.css";

export const metadata: Metadata = {
  title: "NowDev3D — Motion Art Direction",
  description:
    "A monochrome motion-design portfolio by NowhereDEV with cinematic slide transitions, kinetic typography, SVG path animation and lightweight WebGL.",
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
