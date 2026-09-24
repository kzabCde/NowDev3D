"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { projects } from "@/lib/projects";
import { SceneCanvas } from "./SceneCanvas";

export function Experience() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sceneEnabled, setSceneEnabled] = useState(true);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedId) ?? null,
    [selectedId],
  );

  return (
    <main className="experience-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="#top" aria-label="NowDev3D home">
          <span className="brand-mark" aria-hidden="true">N3</span>
          <span>
            <strong>NOWDEV3D</strong>
            <small>INTERACTIVE LAB / 001</small>
          </span>
        </a>

        <div className="topbar-actions">
          <span className="status-pill"><i aria-hidden="true" /> LIVE SCENE</span>
          <button
            className="ghost-button"
            type="button"
            onClick={() => setSceneEnabled((value) => !value)}
            aria-pressed={!sceneEnabled}
          >
            {sceneEnabled ? "PAUSE 3D" : "RESUME 3D"}
          </button>
        </div>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">NOWHEREDEV / EXPERIMENTAL WEBGL SPACE</p>
          <h1 id="hero-title">Explore projects<span>in three dimensions.</span></h1>
          <p className="hero-lead">
            ห้องทดลอง 3D บนเว็บที่รวมโปรเจกต์ของ NowhereDEV ไว้เป็นวัตถุใน space เดียว
            ขยับเมาส์เพื่อสำรวจ และคลิกแต่ละ node เพื่อดูรายละเอียด
          </p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={() => setSelectedId("air")}>
              OPEN FIRST NODE <span aria-hidden="true">↗</span>
            </button>
            <a className="text-link" href="#project-index">VIEW PROJECT INDEX <span aria-hidden="true">↓</span></a>
          </div>
        </div>

        <div className="scene-frame" aria-label="Interactive 3D project map">
          <div className="scene-corner corner-a" aria-hidden="true" />
          <div className="scene-corner corner-b" aria-hidden="true" />
          <SceneCanvas enabled={sceneEnabled} selectedId={selectedId} onSelect={setSelectedId} />
          <div className="scene-hud scene-hud-top" aria-hidden="true"><span>WEBGL / R3F</span><span>6 NODES</span></div>
          <div className="scene-hud scene-hud-bottom" aria-hidden="true"><span>MOVE POINTER</span><span>CLICK TO INSPECT</span></div>
        </div>

        <div className="scroll-cue" aria-hidden="true"><span /> SCROLL TO INDEX</div>
      </section>

      <section className="project-index" id="project-index" aria-labelledby="project-heading">
        <div className="section-heading">
          <p className="eyebrow">PROJECT INDEX / SELECTABLE NODES</p>
          <h2 id="project-heading">Digital systems, visualized.</h2>
        </div>

        <div className="project-list">
          {projects.map((project, index) => (
            <button
              className="project-row"
              type="button"
              key={project.id}
              onClick={() => setSelectedId(project.id)}
              style={{ "--project-accent": project.accent } as CSSProperties}
            >
              <span className="project-number">0{index + 1}</span>
              <span className="project-name"><strong>{project.name}</strong><small>{project.category}</small></span>
              <span className="project-stack">{project.stack.slice(0, 2).join(" / ")}</span>
              <span className="project-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span>© 2026 NOWHEREDEV</span>
        <span>BUILT WITH NEXT.JS + THREE.JS + R3F</span>
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
              <span>{selectedProject.shortName} / NODE</span>
              <button type="button" onClick={() => setSelectedId(null)} aria-label="Close project details">CLOSE ×</button>
            </div>
            <div className="detail-orb" aria-hidden="true" />
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
