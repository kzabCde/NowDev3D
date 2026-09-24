"use client";

import { useProgress, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { projects } from "@/lib/projects";
import { SceneCanvas } from "./SceneCanvas";

function LoadingOverlay() {
  const { active, progress, loaded, total, item } = useProgress();
  const visible = active || progress < 100;

  return (
    <div className={`loading-screen ${visible ? "is-visible" : "is-complete"}`} aria-live="polite" aria-busy={visible}>
      <div className="loading-core" aria-hidden="true"><span /><i /><b /></div>
      <p>NEURAL GALAXY / SYNCHRONIZING NODES</p>
      <strong>{Math.round(progress)}%</strong>
      <div className="loading-track"><span style={{ width: `${progress}%` }} /></div>
      <small>{total > 0 ? `${loaded}/${total} ASSETS` : "INITIALIZING WEBGL"}{item ? ` · ${item.split("/").pop()}` : ""}</small>
    </div>
  );
}

export function Experience() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sceneEnabled, setSceneEnabled] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedId) ?? null,
    [selectedId],
  );

  const activeProjectId = activeIndex > 0 && activeIndex <= projects.length
    ? projects[activeIndex - 1].id
    : null;

  useEffect(() => {
    projects.forEach((project) => useGLTF.preload(project.modelPath));
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!reducedMotion.matches) return;

    const frame = requestAnimationFrame(() => setSceneEnabled(false));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(window.scrollY / max, 0), 1);
      setScrollProgress(progress);
      setActiveIndex(Math.min(projects.length + 1, Math.round(progress * (projects.length + 1))));
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <main className="experience-shell">
      <LoadingOverlay />

      <header className="topbar">
        <a className="brand" href="#genesis" aria-label="NowDev3D home">
          <span className="brand-mark" aria-hidden="true">N3</span>
          <span>
            <strong>NOWDEV3D</strong>
            <small>NEURAL GALAXY / PHASE 02</small>
          </span>
        </a>

        <div className="topbar-actions">
          <span className="status-pill"><i aria-hidden="true" /> {activeProjectId ? `${activeProjectId.toUpperCase()} NODE` : "GALAXY ONLINE"}</span>
          <button
            className="ghost-button"
            type="button"
            onClick={() => setSceneEnabled((value) => !value)}
            aria-pressed={!sceneEnabled}
          >
            {sceneEnabled ? "PAUSE SIGNAL" : "RESUME SIGNAL"}
          </button>
        </div>
      </header>

      <div className="galaxy-stage" aria-label="Interactive neural galaxy project map">
        <SceneCanvas
          enabled={sceneEnabled}
          selectedId={selectedId}
          activeId={activeProjectId}
          scrollProgress={scrollProgress}
          onSelect={setSelectedId}
        />
        <div className="galaxy-vignette" aria-hidden="true" />
        <div className="scene-hud hud-left" aria-hidden="true">
          <span>R3F / GLB / POST FX</span>
          <span>SCROLL VECTOR {String(activeIndex).padStart(2, "0")}</span>
        </div>
        <div className="scene-hud hud-right" aria-hidden="true">
          <span>NEURAL LINKS 06</span>
          <span>{Math.round(scrollProgress * 100)}% JOURNEY</span>
        </div>
      </div>

      <div className="story-layer">
        <section className="story-chapter genesis" id="genesis">
          <div className="story-card story-card-large">
            <p className="eyebrow">NOWHEREDEV / NEURAL GALAXY EXPERIMENT</p>
            <h1>Enter the<br /><span>neural galaxy.</span></h1>
            <p className="story-lead">
              โปรเจกต์แต่ละตัวถูกแปลงเป็น neural node ที่เชื่อมกับแกนกลางของ NowhereDEV
              เลื่อนหน้าเว็บเพื่อให้กล้องเดินทางตาม signal path และคลิก node เพื่อ inspect ระบบแต่ละตัว
            </p>
            <div className="signal-tags" aria-label="Experience features">
              <span>SCROLL CAMERA</span><span>GLB NODES</span><span>BLOOM</span><span>LIVE SIGNALS</span>
            </div>
            <a className="scroll-link" href="#node-air">START TRANSMISSION <b aria-hidden="true">↓</b></a>
          </div>
        </section>

        {projects.map((project, index) => (
          <section className={`story-chapter ${index % 2 === 0 ? "align-left" : "align-right"}`} id={`node-${project.id}`} key={project.id}>
            <article className="story-card project-story" style={{ "--project-accent": project.accent } as CSSProperties}>
              <div className="chapter-meta">
                <span>NODE {String(index + 1).padStart(2, "0")}</span>
                <span>{project.chapter}</span>
              </div>
              <p className="project-category">{project.category}</p>
              <h2>{project.name}</h2>
              <p className="story-description">{project.description}</p>
              <div className="tag-list">
                {project.stack.map((item) => <span key={item}>{item}</span>)}
              </div>
              <button className="inspect-button" type="button" onClick={() => setSelectedId(project.id)}>
                INSPECT NODE <span aria-hidden="true">↗</span>
              </button>
            </article>
          </section>
        ))}

        <section className="story-chapter epilogue" id="network-map">
          <div className="story-card epilogue-card">
            <p className="eyebrow">NETWORK MAP / SIGNAL COMPLETE</p>
            <h2>Six systems.<br />One constellation.</h2>
            <p className="story-lead">
              Phase 02 ใช้โมเดล GLB ขนาดเล็ก, preload assets, static immutable caching และ post-processing ที่ตั้งใจให้เบาพอสำหรับงานเว็บจริง
            </p>
            <div className="project-mini-grid">
              {projects.map((project) => (
                <button key={project.id} type="button" onClick={() => setSelectedId(project.id)} style={{ "--project-accent": project.accent } as CSSProperties}>
                  <small>{project.shortName}</small><strong>{project.name}</strong><i aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      <footer className="footer">
        <span>© 2026 NOWHEREDEV</span>
        <span>NEURAL GALAXY / NEXT.JS + THREE.JS + R3F</span>
        <a href="https://github.com/kzabCde/NowDev3D" target="_blank" rel="noreferrer">SOURCE ↗</a>
      </footer>

      {selectedProject && (
        <div className="detail-layer" role="presentation" onMouseDown={() => setSelectedId(null)}>
          <article
            className="detail-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-title"
            onMouseDown={(event) => event.stopPropagation()}
            style={{ "--project-accent": selectedProject.accent } as CSSProperties}
          >
            <div className="detail-head">
              <span>{selectedProject.shortName} / NEURAL NODE</span>
              <button type="button" onClick={() => setSelectedId(null)} aria-label="Close project details">CLOSE ×</button>
            </div>
            <div className="detail-signal" aria-hidden="true"><span /><i /><b /></div>
            <p className="detail-category">{selectedProject.category}</p>
            <h2 id="detail-title">{selectedProject.name}</h2>
            <p className="detail-description">{selectedProject.description}</p>
            <div className="tag-list" aria-label="Technology stack">
              {selectedProject.stack.map((item) => <span key={item}>{item}</span>)}
            </div>
            <a className="detail-link" href={selectedProject.liveUrl} target="_blank" rel="noreferrer">
              OPEN LIVE PROJECT <span aria-hidden="true">↗</span>
            </a>
          </article>
        </div>
      )}
    </main>
  );
}
