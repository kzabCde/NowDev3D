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
    <main className="motion-shell boot-shell phase51 phase52">
      <div className="boot-frame" aria-live="polite" aria-busy="true">
        <span className="boot-index">05.2</span>
        <div className="boot-copy">
          <p>NOWHEREDEV / INTERACTIVE MOTION</p>
          <h1>Loading<br />the demos.</h1>
        </div>
        <div className="boot-line"><span /></div>
        <small>TYPE / MOTION / TOUCH / INTERACTIVE SYSTEMS</small>
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
    console.error("[NowDev3D Phase05.2] interactive motion deck crashed", error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="motion-shell fallback-shell phase51 phase52">
        <section className="fallback-card">
          <p className="motion-kicker">NOWHEREDEV / INTERACTIVE RECOVERY VIEW</p>
          <h1>Demo interrupted.<br />Portfolio available.</h1>
          <p>Interactive runtime ถูกแยกออกเพื่อไม่ให้ micro-demo ที่มีปัญหาทำให้ทั้ง presentation ล้ม คุณยังสามารถเปิด portfolio หลักได้ตามปกติ</p>
          <small>DIAGNOSTIC: {this.state.message}</small>
          <div className="fallback-actions"><button type="button" onClick={() => window.location.reload()}>RETRY DEMOS</button><a href="https://nowheredev.vercel.app/" target="_blank" rel="noreferrer">OPEN NOWHEREDEV ↗</a></div>
        </section>
      </main>
    );
  }
}

export function ClientExperience() {
  return <MotionBoundary><ExperienceClient /></MotionBoundary>;
}
