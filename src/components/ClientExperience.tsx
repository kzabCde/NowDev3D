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

type SupportState = "checking" | "supported" | "unsupported" | "asset-error";

type BoundaryState = {
  failed: boolean;
  message: string;
};

const HERO_MODEL_URL = "/models/neural-core-hero.glb";

function BootScreen() {
  return (
    <main className="experience-shell">
      <div className="loading-screen is-visible" aria-live="polite" aria-busy="true">
        <div className="loading-core" aria-hidden="true"><span /><i /><b /></div>
        <p>NEURAL GALAXY / INITIALIZING CLIENT</p>
        <strong>3D</strong>
        <div className="loading-track"><span style={{ width: "42%" }} /></div>
        <small>CHECKING WEBGL + GLB INTEGRITY</small>
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
    window.location.reload();
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

async function refreshAndValidateHero(signal: AbortSignal): Promise<string | null> {
  try {
    // `reload` deliberately refreshes the exact legacy cache key. Earlier releases
    // served this mutable filename with `immutable`, so a normal fetch can preserve
    // a truncated GLB even after the CDN has a corrected asset.
    const response = await fetch(HERO_MODEL_URL, { cache: "reload", signal });
    if (!response.ok) return `Hero GLB returned HTTP ${response.status}.`;
    const buffer = await response.arrayBuffer();
    if (buffer.byteLength < 20) return `Hero GLB is too small (${buffer.byteLength} bytes).`;

    const bytes = new Uint8Array(buffer);
    if (bytes[0] !== 0x67 || bytes[1] !== 0x6c || bytes[2] !== 0x54 || bytes[3] !== 0x46) {
      return "Hero GLB magic header is invalid.";
    }

    const view = new DataView(buffer);
    const version = view.getUint32(4, true);
    const declaredLength = view.getUint32(8, true);
    if (version !== 2) return `Hero GLB version ${version} is unsupported.`;
    if (declaredLength !== buffer.byteLength) {
      return `Hero GLB length mismatch: header ${declaredLength}, response ${buffer.byteLength}.`;
    }

    let offset = 12;
    let hasJson = false;
    while (offset < buffer.byteLength) {
      if (offset + 8 > buffer.byteLength) return "Hero GLB has a truncated chunk header.";
      const chunkLength = view.getUint32(offset, true);
      const chunkType = view.getUint32(offset + 4, true);
      offset += 8;
      if (offset + chunkLength > buffer.byteLength) return "Hero GLB chunk exceeds response bounds.";
      if (chunkType === 0x4e4f534a) hasJson = true; // JSON
      offset += chunkLength;
    }
    if (!hasJson || offset !== buffer.byteLength) return "Hero GLB chunk table is invalid.";
    return null;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return "Hero GLB check was cancelled.";
    return `Hero GLB check failed: ${error instanceof Error ? error.message : String(error)}`;
  }
}

export function ClientExperience() {
  const [support, setSupport] = useState<SupportState>("checking");
  const [diagnostic, setDiagnostic] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let disposed = false;

    const initialize = async () => {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      if (disposed) return;
      if (!detectWebGL()) {
        setDiagnostic("WebGL is unavailable or blocked by this browser/device.");
        setSupport("unsupported");
        return;
      }

      const heroError = await refreshAndValidateHero(controller.signal);
      if (disposed) return;
      if (heroError) {
        setDiagnostic(heroError);
        setSupport("asset-error");
        return;
      }
      setSupport("supported");
    };

    void initialize();
    return () => {
      disposed = true;
      controller.abort();
    };
  }, []);

  if (support === "checking") return <BootScreen />;

  if (support === "unsupported" || support === "asset-error") {
    return <SafeExperience reason={diagnostic || "3D initialization failed."} onRetry={() => window.location.reload()} />;
  }

  return (
    <ExperienceBoundary>
      <ExperienceClient />
    </ExperienceBoundary>
  );
}
