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
    <main className="motion-shell boot-shell">
      <div className="boot-frame" aria-live="polite" aria-busy="true">
        <span className="boot-index">05</span>
        <div className="boot-copy">
          <p>NOWHEREDEV / MOTION PRESENTATION</p>
          <h1>Loading<br />the deck.</h1>
        </div>
        <div className="boot-line"><span /></div>
        <small>PREPARING TYPOGRAPHY / MOTION / WEBGL</small>
      </div>
    </main>
  );
}

type BoundaryState = { failed: boolean; message: string };

class MotionBoundary extends Component<{ children: ReactNode }, BoundaryState> {
  state: BoundaryState = { failed: false, message: "" };

  static getDerivedStateFromError(error: unknown): BoundaryState {
    return {
      failed: true,
      message: error instanceof Error ? error.message : "Unknown client runtime error",
    };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("[NowDev3D Phase05] motion deck crashed", error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main className="motion-shell fallback-shell">
        <section className="fallback-card">
          <p className="motion-kicker">NOWHEREDEV / RECOVERY VIEW</p>
          <h1>Presentation<br />still accessible.</h1>
          <p>
            Motion runtime ถูกหยุดเพื่อป้องกันหน้าเว็บล้ม คุณยังสามารถเปิดโปรเจกต์ทั้งหมดจากหน้า portfolio หลักได้
          </p>
          <small>DIAGNOSTIC: {this.state.message}</small>
          <div className="fallback-actions">
            <button type="button" onClick={() => window.location.reload()}>RETRY EXPERIENCE</button>
            <a href="https://nowheredev.vercel.app/" target="_blank" rel="noreferrer">OPEN NOWHEREDEV ↗</a>
          </div>
        </section>
      </main>
    );
  }
}

export function ClientExperience() {
  return (
    <MotionBoundary>
      <ExperienceClient />
    </MotionBoundary>
  );
}
