import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "./phase3.css";

export const metadata: Metadata = {
  title: "NowDev3D — Cinematic Neural Galaxy",
  description:
    "A cinematic adaptive 3D portfolio by NowhereDEV built with Next.js, Three.js and React Three Fiber.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#02030a",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
