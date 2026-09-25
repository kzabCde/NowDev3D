"use client";

import { useGLTF, useProgress } from "@react-three/drei";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { projects } from "@/lib/projects";
import { SceneCanvas, type PerformanceMetrics, type QualityTier } from "./SceneCanvas";

const QUALITY_ORDER: QualityTier[] = ["low", "balanced", "ultra"];

function LoadingOverlay() {
  const { active, progress, loaded, total, item } = useProgress();
  const visible = active || progress < 100;
  return (
    <div className={`loading-screen ${visible ? "is-visible" : "is-complete"}`} aria-live="polite" aria-busy={visible}>
      <div className="loading-core" aria-hidden="true"><span /><i /><b /></div>
      <p>MONOCHROME GRID / CALIBRATING SURFACES</p>
      <strong>{Math.round(progress)}%</strong>
      <div className="loading-track"><span style={{ width: `${progress}%` }} /></div>
      <small>{total > 0 ? `${loaded}/${total} OBJECTS` : "INITIALIZING WEBGL"}{item ? ` · ${item.split("/").pop()}` : ""}</small>
    </div>
  );
}

type NavigatorWithHints = Navigator & { deviceMemory?: number; connection?: { saveData?: boolean; effectiveType?: string } };
function detectCapability(): { tier: QualityTier; ceiling: QualityTier } {
  const nav = navigator as NavigatorWithHints;
  const cores = nav.hardwareConcurrency || 4;
  const memory = nav.deviceMemory || 4;
  const saveData = Boolean(nav.connection?.saveData);
  const narrow = window.innerWidth < 760;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (saveData || cores <= 4 || memory <= 3) return { tier: "low", ceiling: coarse || narrow ? "balanced" : "ultra" };
  if (narrow || coarse || cores < 8 || memory < 6) return { tier: "balanced", ceiling: "balanced" };
  return { tier: "ultra", ceiling: "ultra" };
}
function lowerQuality(tier: QualityTier): QualityTier { return QUALITY_ORDER[Math.max(0, QUALITY_ORDER.indexOf(tier) - 1)]; }
function raiseQuality(tier: QualityTier, ceiling: QualityTier): QualityTier { return QUALITY_ORDER[Math.min(QUALITY_ORDER.indexOf(tier) + 1, QUALITY_ORDER.indexOf(ceiling))]; }
function compactGpuName(gpu: string) { return gpu.replace(/ANGLE \(/i, "").replace(/Direct3D.*$/i, "").replace(/OpenGL.*$/i, "").replace(/\)$/g, "").trim().slice(0, 42); }

export function Experience() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sceneEnabled, setSceneEnabled] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [quality, setQuality] = useState<QualityTier>("balanced");
  const [qualityCeiling, setQualityCeiling] = useState<QualityTier>("ultra");
  const [manualQuality, setManualQuality] = useState(false);
  const [transitionVisible, setTransitionVisible] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({ fps: 0, calls: 0, triangles: 0, gpu: "WEBGL GPU" });
  const lowFpsStreak = useRef(0);
  const highFpsStreak = useRef(0);
  const selectedProject = useMemo(() => projects.find((project) => project.id === selectedId) ?? null, [selectedId]);
  const activeProjectId = activeIndex > 0 && activeIndex <= projects.length ? projects[activeIndex - 1].id : null;
  const focusId = selectedId ?? activeProjectId;

  useEffect(() => { projects.forEach((project) => useGLTF.preload(project.modelPath)); }, []);
  useEffect(() => { if (quality !== "low") useGLTF.preload("/models/neural-core-hero.glb"); }, [quality]);
  useEffect(() => { const frame = requestAnimationFrame(() => { const detected = detectCapability(); setQuality(detected.tier); setQualityCeiling(detected.ceiling); }); return () => cancelAnimationFrame(frame); }, []);
  useEffect(() => { const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)"); if (!reducedMotion.matches) return; const frame = requestAnimationFrame(() => setSceneEnabled(false)); return () => cancelAnimationFrame(frame); }, []);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(window.scrollY / max, 0), 1);
      setScrollProgress(progress);
      setActiveIndex(Math.min(projects.length + 1, Math.round(progress * (projects.length + 1))));
    };
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);
  useEffect(() => {
    if (!focusId) return;
    const startFrame = requestAnimationFrame(() => setTransitionVisible(true));
    const timer = window.setTimeout(() => setTransitionVisible(false), 500);
    return () => { cancelAnimationFrame(startFrame); window.clearTimeout(timer); };
  }, [focusId]);
  useEffect(() => {
    if (manualQuality || metrics.fps === 0) return;
    if (metrics.fps < 40) { lowFpsStreak.current += 1; highFpsStreak.current = 0; }
    else if (metrics.fps > 57) { highFpsStreak.current += 1; lowFpsStreak.current = 0; }
    else { lowFpsStreak.current = 0; highFpsStreak.current = 0; }
    if (lowFpsStreak.current >= 2) {
      lowFpsStreak.current = 0;
      const next = lowerQuality(quality);
      if (next !== quality) { const frame = requestAnimationFrame(() => setQuality(next)); return () => cancelAnimationFrame(frame); }
    }
    if (highFpsStreak.current >= 6) {
      highFpsStreak.current = 0;
      const next = raiseQuality(quality, qualityCeiling);
      if (next !== quality) { const frame = requestAnimationFrame(() => setQuality(next)); return () => cancelAnimationFrame(frame); }
    }
  }, [manualQuality, metrics.fps, quality, qualityCeiling]);

  const handleMetrics = useCallback((next: PerformanceMetrics) => setMetrics(next), []);
  const chooseQuality = (tier: QualityTier) => { setManualQuality(true); setQuality(tier); lowFpsStreak.current = 0; highFpsStreak.current = 0; };
  const enableAutoQuality = () => { const detected = detectCapability(); setManualQuality(false); setQualityCeiling(detected.ceiling); setQuality(detected.tier); lowFpsStreak.current = 0; highFpsStreak.current = 0; };

  return (
    <main className="experience-shell phase04-shell">
      <LoadingOverlay />
      <header className="topbar">
        <a className="brand" href="#genesis" aria-label="NowDev3D home">
          <span className="brand-mark" aria-hidden="true">N3</span>
          <span><strong>NOWDEV3D</strong><small>MONOCHROME PRINTSTREAM / PHASE 04</small></span>
        </a>
        <div className="topbar-actions phase3-actions phase4-actions">
          <span className="status-pill phase3-status"><i aria-hidden="true" /> {activeProjectId ? `${activeProjectId.toUpperCase()} / FOCUS` : "SYSTEM ONLINE"}</span>
          <div className="quality-control" aria-label="3D quality controls">
            <button type="button" className={!manualQuality ? "is-active" : ""} onClick={enableAutoQuality}>AUTO</button>
            {QUALITY_ORDER.map((tier) => <button type="button" key={tier} className={manualQuality && quality === tier ? "is-active" : ""} onClick={() => chooseQuality(tier)}>{tier.toUpperCase()}</button>)}
          </div>
          <button className="ghost-button" type="button" onClick={() => setSceneEnabled((value) => !value)} aria-pressed={!sceneEnabled}>{sceneEnabled ? "FREEZE MOTION" : "RESUME MOTION"}</button>
        </div>
      </header>

      <div className="galaxy-stage" aria-label="Interactive monochrome 3D project showroom">
        <SceneCanvas enabled={sceneEnabled} selectedId={selectedId} activeId={activeProjectId} scrollProgress={scrollProgress} quality={quality} onSelect={setSelectedId} onMetrics={handleMetrics} />
        <div className="galaxy-vignette" aria-hidden="true" />
        <div className={`node-transition ${transitionVisible ? "is-active" : ""}`} aria-hidden="true"><span /><small>REFRACTING SIGNAL</small><strong>{focusId ? focusId.toUpperCase() : "CORE"}</strong></div>
        <div className="scene-hud hud-left" aria-hidden="true"><span>R3F / GLB / MONO FX</span><span>FRAME {String(activeIndex).padStart(2, "0")}</span></div>
        <div className="scene-hud hud-right" aria-hidden="true"><span>{manualQuality ? "MANUAL" : "ADAPTIVE"} / {quality.toUpperCase()}</span><span>{Math.round(scrollProgress * 100)}% / SIGNAL</span></div>
        <div className="swipe-hint" aria-hidden="true">↔ SWIPE / ORBIT</div>
      </div>

      <aside className="perf-monitor" aria-label="3D performance monitor">
        <div><span>FPS</span><strong>{metrics.fps || "--"}</strong></div>
        <div><span>DRAW</span><strong>{metrics.calls}</strong></div>
        <div><span>TRI</span><strong>{metrics.triangles >= 1000 ? `${(metrics.triangles / 1000).toFixed(1)}K` : metrics.triangles}</strong></div>
        <div className="perf-gpu"><span>GPU / RENDERER</span><strong>{compactGpuName(metrics.gpu)}</strong></div>
      </aside>

      <div className="story-layer">
        <section className="story-chapter genesis" id="genesis">
          <div className="story-card story-card-large">
            <p className="eyebrow">NOWHEREDEV / MONOCHROME SIGNAL SYSTEM</p>
            <h1>Black. White.<br /><span>Still alive.</span></h1>
            <p className="story-lead">Phase 04 เปลี่ยน Neural Galaxy ให้เป็น interactive sci-fi showroom แบบขาวดำ เน้น pearl-white object, graphite surface, technical graphics และ cinematic motion ที่นิ่ง คม และแม่นยำมากขึ้น โดยยังคง adaptive quality, touch orbit และ performance monitoring ครบทั้งหมด</p>
            <div className="printstream-rail" aria-label="Monochrome material system">
              <span>PS / 04<br />MONO SIGNAL</span>
              <span>PEARL<br />SURFACE</span>
              <span>GRAPHITE<br />CORE</span>
              <span>PRECISION<br />MOTION</span>
            </div>
            <div className="signal-tags" aria-label="Experience features"><span>MONO CORE</span><span>ADAPTIVE QUALITY</span><span>TOUCH ORBIT</span><span>GPU HUD</span></div>
            <a className="scroll-link" href="#node-air">ENTER SHOWROOM <b aria-hidden="true">↓</b></a>
          </div>
        </section>

        {projects.map((project, index) => (
          <section className={`story-chapter ${index % 2 === 0 ? "align-left" : "align-right"}`} id={`node-${project.id}`} key={project.id}>
            <article className="story-card project-story" style={{ "--project-accent": project.accent } as CSSProperties}>
              <div className="chapter-meta"><span>OBJECT {String(index + 1).padStart(2, "0")}</span><span>{project.chapter}</span></div>
              <p className="project-category">{project.category}</p>
              <h2>{project.name}</h2>
              <p className="story-description">{project.description}</p>
              <div className="tag-list">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
              <button className="inspect-button" type="button" onClick={() => setSelectedId(project.id)}>INSPECT OBJECT <span aria-hidden="true">↗</span></button>
            </article>
          </section>
        ))}

        <section className="story-chapter epilogue" id="network-map">
          <div className="story-card epilogue-card">
            <p className="eyebrow">SHOWROOM INDEX / SIGNAL COMPLETE</p>
            <h2>Six objects.<br />One monochrome system.</h2>
            <p className="story-lead">สีถูกลดเหลือเพียง white, silver และ graphite เพื่อให้ geometry, light, motion และข้อมูลเป็นตัวนำสายตา ขณะที่ Low / Balanced / Ultra ยังคงปรับภาระ GPU ตามอุปกรณ์เหมือนเดิม</p>
            <div className="project-mini-grid">
              {projects.map((project) => <button key={project.id} type="button" onClick={() => setSelectedId(project.id)} style={{ "--project-accent": project.accent } as CSSProperties}><small>{project.shortName}</small><strong>{project.name}</strong><i aria-hidden="true" /></button>)}
            </div>
          </div>
        </section>
      </div>

      <footer className="footer"><span>© 2026 NOWHEREDEV</span><span>PHASE 04 / MONOCHROME PRINTSTREAM SYSTEM</span><a href="https://github.com/kzabCde/NowDev3D" target="_blank" rel="noreferrer">SOURCE ↗</a></footer>

      {selectedProject && (
        <div className="detail-layer" role="presentation" onMouseDown={() => setSelectedId(null)}>
          <article className="detail-panel" role="dialog" aria-modal="true" aria-labelledby="detail-title" onMouseDown={(event) => event.stopPropagation()} style={{ "--project-accent": selectedProject.accent } as CSSProperties}>
            <div className="detail-head"><span>{selectedProject.shortName} / MONO OBJECT</span><button type="button" onClick={() => setSelectedId(null)} aria-label="Close project details">CLOSE ×</button></div>
            <div className="detail-signal" aria-hidden="true"><span /><i /><b /></div>
            <p className="detail-category">{selectedProject.category}</p>
            <h2 id="detail-title">{selectedProject.name}</h2>
            <p className="detail-description">{selectedProject.description}</p>
            <div className="tag-list" aria-label="Technology stack">{selectedProject.stack.map((item) => <span key={item}>{item}</span>)}</div>
            <a className="detail-link" href={selectedProject.liveUrl} target="_blank" rel="noreferrer">OPEN LIVE PROJECT <span aria-hidden="true">↗</span></a>
          </article>
        </div>
      )}
    </main>
  );
}
