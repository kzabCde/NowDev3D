"use client";

import dynamic from "next/dynamic";
import { Component, type ErrorInfo, type ReactNode } from "react";

const ExperienceClient = dynamic(
  () => import("./Experience").then((module) => module.Experience),
  {
    ssr: false,
    loading: () => <BootScreen />,
  },
);

function BootScreen() {
  return (
    <main className="motion-shell boot-shell phase51">
      <div className="boot-frame" aria-live="polite" aria-busy="true">
        <span className="boot-index">05.1</span>
        <div className="boot-copy">
          <p>NOWHEREDEV / MOTION ART DIRECTION</p>
          <h1>Preparing<br />the reel.</h1>
        </div>
        <div className="boot-line"><span /></div>
        <small>MASK / TYPE / SVG / CINEMATIC WEBGL</small>
      </div>
    </main>
  );
}

type BoundaryState = { failed: boolean; message: string };

class MotionBoundary extends Component<{ children: ReactNode }, BoundaryState> {
  state: BoundaryState = { failed: false, message: "" };

  static getDerivedStateFromError(error: unknown): BoundaryState {
    return { failed: true, message: error instanceof Error ? error.message : "Unknown client runtime error" };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("[NowDev3D Phase05.1] motion reel crashed", error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="motion-shell fallback-shell phase51">
        <section className="fallback-card">
          <p className="motion-kicker">NOWHEREDEV / MOTION RECOVERY VIEW</p>
          <h1>Reel interrupted.<br />Portfolio available.</h1>
          <p>Motion runtime ถูกแยกออกเพื่อไม่ให้ presentation crash กระทบการเข้าถึงโปรเจกต์หลัก คุณยังสามารถเปิด portfolio ได้ตามปกติ</p>
          <small>DIAGNOSTIC: {this.state.message}</small>
          <div className="fallback-actions"><button type="button" onClick={() => window.location.reload()}>RETRY REEL</button><a href="https://nowheredev.vercel.app/" target="_blank" rel="noreferrer">OPEN NOWHEREDEV ↗</a></div>
        </section>
      </main>
    );
  }
}

export function ClientExperience() {
  return <MotionBoundary><ExperienceClient /></MotionBoundary>;
}
