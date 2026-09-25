"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useState, type ErrorInfo, type ReactNode } from "react";
import { projects } from "@/lib/projects";

const ExperienceClient = dynamic(
  () => import("./Experience").then((module) => module.Experience),
  {
    ssr: false,
    loading: () => <BootScreen />,
  },
);

type SupportState = "checking" | "supported" | "unsupported";

type BoundaryState = {
  failed: boolean;
  message: string;
};

function BootScreen() {
  return (
    <main className="experience-shell">
      <div className="loading-screen is-visible" aria-live="polite" aria-busy="true">
        <div className="loading-core" aria-hidden="true"><span /><i /><b /></div>
        <p>NEURAL GALAXY / INITIALIZING CLIENT</p>
        <strong>3D</strong>
        <div className="loading-track"><span style={{ width: "42%" }} /></div>
        <small>CHECKING WEBGL + CLIENT RUNTIME</small>
      </div>
    </main>
  );
}

function SafeExperience({ reason, onRetry }: { reason: string; onRetry: () => void }) {
  return (
    <main className="experience-shell">
      <header className="topbar">
        <a className="brand" href="#safe-projects" aria-label="NowDev3D safe mode">
          <span className="brand-mark" aria-hidden="true">N3</span>
          <span>
            <strong>NOWDEV3D</strong>
            <small>SAFE MODE / 2D FALLBACK</small>
          </span>
        </a>
        <div className="topbar-actions">
          <span className="status-pill"><i aria-hidden="true" /> SAFE MODE</span>
          <button className="ghost-button" type="button" onClick={onRetry}>RETRY 3D</button>
        </div>
      </header>

      <div className="story-layer">
        <section className="story-chapter genesis" id="safe-projects">
          <div className="story-card story-card-large">
            <p className="eyebrow">NOWHEREDEV / COMPATIBILITY FALLBACK</p>
            <h1>Galaxy online.<br /><span>3D isolated.</span></h1>
            <p className="story-lead">
              หน้าเว็บหลักยังใช้งานได้ แต่ระบบ 3D ถูกหยุดไว้เพื่อป้องกัน WebGL หรือ client runtime error
              จากการทำให้ทั้งหน้าเว็บล้ม คุณยังสามารถเปิดทุกโปรเจกต์ได้จาก Safe Mode นี้
            </p>
            <p className="story-lead" style={{ fontFamily: "var(--font-mono)", fontSize: 11, opacity: 0.72 }}>
              DIAGNOSTIC: {reason}
            </p>
            <div className="project-mini-grid" style={{ marginTop: 38 }}>
              {projects.map((project) => (
                <a
                  key={project.id}
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    minHeight: 108,
                    padding: 17,
                    borderRight: "1px solid var(--line)",
                    borderBottom: "1px solid var(--line)",
                    background: "rgba(5,7,18,.48)",
                    display: "block",
                  }}
                >
                  <small style={{ color: project.accent, fontFamily: "var(--font-mono)" }}>{project.shortName}</small>
                  <strong style={{ display: "block", marginTop: 11 }}>{project.name}</strong>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>

      <footer className="footer">
        <span>© 2026 NOWHEREDEV</span>
        <span>SAFE MODE / CLIENT RECOVERY</span>
        <a href="https://github.com/kzabCde/NowDev3D" target="_blank" rel="noreferrer">SOURCE ↗</a>
      </footer>
    </main>
  );
}

class ExperienceBoundary extends Component<{ children: ReactNode }, BoundaryState> {
  state: BoundaryState = { failed: false, message: "" };

  static getDerivedStateFromError(error: unknown): BoundaryState {
    const message = error instanceof Error ? error.message : "Unknown client-side 3D error";
    return { failed: true, message };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("[NowDev3D] client experience crashed", error, info.componentStack);
    try {
      const message = error instanceof Error ? error.message : String(error);
      sessionStorage.setItem("nowdev3d:last-client-error", message.slice(0, 500));
    } catch {
      // Storage can be unavailable in hardened/private browsing modes.
    }
  }

  private retry = () => {
    this.setState({ failed: false, message: "" });
  };

  render() {
    if (this.state.failed) {
      return <SafeExperience reason={this.state.message || "3D runtime failed"} onRetry={this.retry} />;
    }
    return this.props.children;
  }
}

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!context) return false;
    const loseContext = context.getExtension("WEBGL_lose_context");
    loseContext?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function ClientExperience() {
  const [support, setSupport] = useState<SupportState>("checking");

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setSupport(detectWebGL() ? "supported" : "unsupported");
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  if (support === "checking") return <BootScreen />;

  if (support === "unsupported") {
    return <SafeExperience reason="WebGL is unavailable or blocked by this browser/device." onRetry={() => window.location.reload()} />;
  }

  return (
    <ExperienceBoundary>
      <ExperienceClient />
    </ExperienceBoundary>
  );
}
