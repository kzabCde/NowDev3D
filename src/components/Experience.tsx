"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/projects";
import { MotionStage } from "./MotionStage";

const sections = ["intro", ...projects.map((project) => project.id), "outro"];

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function VisualFrame({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="visual-frame" data-motion-graphic>
      <span className="frame-corner top-left" />
      <span className="frame-corner top-right" />
      <span className="frame-corner bottom-left" />
      <span className="frame-corner bottom-right" />
      <small>{label}</small>
      {children}
    </div>
  );
}

function IntroGraphic() {
  return (
    <VisualFrame label="MOTION SYSTEM / 05">
      <div className="intro-graphic">
        <div className="intro-orbit orbit-a" />
        <div className="intro-orbit orbit-b" />
        <div className="intro-disc"><span>ND</span></div>
        <div className="intro-axis axis-x" />
        <div className="intro-axis axis-y" />
        <div className="intro-ticker">SELECTED SYSTEMS / DATA / UTILITY / EXPERIMENTAL WEB</div>
      </div>
    </VisualFrame>
  );
}

function AirGraphic() {
  return (
    <VisualFrame label="ATMOSPHERIC DATA">
      <div className="air-graphic">
        <svg viewBox="0 0 520 420" role="img" aria-label="Abstract air quality contour visualization">
          <g className="contours">
            {[70, 105, 140, 175].map((r) => <circle key={r} cx="260" cy="205" r={r} />)}
          </g>
          <path className="air-line line-one" d="M20 230 C120 120, 165 310, 275 190 S430 145, 500 230" />
          <path className="air-line line-two" d="M10 270 C110 205, 180 335, 290 230 S420 185, 510 260" />
          <g className="air-dots">{Array.from({ length: 16 }, (_, index) => <circle key={index} cx={70 + (index % 8) * 54} cy={105 + Math.floor(index / 8) * 190} r={index % 3 === 0 ? 4 : 2} />)}</g>
        </svg>
        <div className="air-reading"><strong>18</strong><span>µg/m³</span><small>PM2.5 / FORECAST SIGNAL</small></div>
      </div>
    </VisualFrame>
  );
}

function StockGraphic() {
  const bars = [28, 48, 37, 74, 58, 92, 67, 84, 62, 100, 76, 114];
  return (
    <VisualFrame label="MARKET MOTION">
      <div className="stock-graphic">
        <div className="stock-grid" />
        <div className="stock-bars">{bars.map((height, index) => <i key={index} style={{ "--bar-h": `${height}px`, "--bar-i": index } as CSSProperties} />)}</div>
        <svg viewBox="0 0 600 280" preserveAspectRatio="none" aria-hidden="true"><polyline points="0,220 55,198 110,210 160,150 210,174 265,108 320,125 365,74 420,102 475,44 530,66 600,22" /></svg>
        <div className="market-readout"><span>NVX / 07</span><strong>+18.42%</strong></div>
      </div>
    </VisualFrame>
  );
}

function TuneupGraphic() {
  return (
    <VisualFrame label="VEHICLE TELEMETRY">
      <div className="tuneup-graphic">
        <svg viewBox="0 0 500 360" aria-hidden="true">
          <path className="gauge-track" d="M80 275 A175 175 0 0 1 420 275" />
          <path className="gauge-value" d="M80 275 A175 175 0 0 1 420 275" />
          {Array.from({ length: 13 }, (_, index) => {
            const angle = Math.PI * (1 + index / 12);
            const x1 = 250 + Math.cos(angle) * 150;
            const y1 = 275 + Math.sin(angle) * 150;
            const x2 = 250 + Math.cos(angle) * 166;
            const y2 = 275 + Math.sin(angle) * 166;
            return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </svg>
        <div className="speed-readout"><strong>128</strong><span>KM/H</span><small>LIVE TELEMETRY</small></div>
        <div className="telemetry-row"><span>RPM 3.2K</span><span>BOOST 0.8</span><span>TEMP 89°C</span></div>
      </div>
    </VisualFrame>
  );
}

function MarkGraphic() {
  return (
    <VisualFrame label="VISUAL WORKSPACE">
      <div className="mark-graphic">
        <div className="mark-sheet sheet-a" /><div className="mark-sheet sheet-b" />
        <div className="crop-frame"><span className="crop-handle a" /><span className="crop-handle b" /><span className="crop-handle c" /><span className="crop-handle d" /><b>NOWHERE / MARK</b></div>
        <div className="mark-toolbar"><i /><i /><i /><i /><i /></div>
      </div>
    </VisualFrame>
  );
}

function ErpGraphic() {
  return (
    <VisualFrame label="OPERATIONS SYSTEM">
      <div className="erp-graphic">
        <div className="erp-rail">{["01", "02", "03", "04"].map((item) => <span key={item}>{item}</span>)}</div>
        <div className="erp-modules">
          <article className="erp-module module-wide"><small>REVENUE</small><strong>84.7</strong><i /></article>
          <article className="erp-module"><small>ORDERS</small><strong>128</strong></article>
          <article className="erp-module"><small>TEAMS</small><strong>06</strong></article>
          <article className="erp-module module-wide lines"><span /><span /><span /><span /></article>
        </div>
      </div>
    </VisualFrame>
  );
}

function DevGraphic() {
  return (
    <VisualFrame label="NOWHEREDEV SYSTEM">
      <div className="dev-graphic">
        <div className="dev-stack stack-one"><span>AI</span></div>
        <div className="dev-stack stack-two"><span>DATA</span></div>
        <div className="dev-stack stack-three"><span>WEB</span></div>
        <div className="dev-stack stack-four"><span>LAB</span></div>
        <div className="dev-crosshair"><i /><b /></div>
      </div>
    </VisualFrame>
  );
}

function OutroGraphic() {
  return (
    <VisualFrame label="SYSTEM INDEX">
      <div className="outro-grid">
        {projects.map((project, index) => <div key={project.id}><small>{String(index + 1).padStart(2, "0")}</small><strong>{project.shortName}</strong><span>{project.category}</span></div>)}
      </div>
    </VisualFrame>
  );
}

const graphicById: Record<string, () => ReactNode> = {
  air: AirGraphic,
  stock: StockGraphic,
  tuneup: TuneupGraphic,
  mark: MarkGraphic,
  erp: ErpGraphic,
  portfolio: DevGraphic,
};

export function Experience() {
  const rootRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const reducedMotion = useReducedMotion();
  const effectiveMotion = motionEnabled && !reducedMotion;

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;

    const context = gsap.context(() => {
      const slides = gsap.utils.toArray<HTMLElement>(".motion-slide", root);
      slides.forEach((slide, index) => {
        const content = slide.querySelector(".slide-copy");
        const graphic = slide.querySelector("[data-motion-graphic]");
        const metadata = slide.querySelectorAll(".slide-meta, .slide-stack, .slide-link");

        if (!effectiveMotion) {
          gsap.set([content, graphic, metadata], { clearProps: "all" });
          return;
        }

        gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: slide,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.65,
            onEnter: () => setActiveIndex(index),
            onEnterBack: () => setActiveIndex(index),
          },
        })
          .fromTo(content, { yPercent: 18, autoAlpha: 0.15 }, { yPercent: 0, autoAlpha: 1, duration: 0.34 }, 0.05)
          .fromTo(graphic, { scale: 0.86, rotate: -2, autoAlpha: 0.12 }, { scale: 1, rotate: 0, autoAlpha: 1, duration: 0.4 }, 0.08)
          .fromTo(metadata, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.04, duration: 0.24 }, 0.2)
          .to(content, { yPercent: -10, autoAlpha: 0.2, duration: 0.22 }, 0.76)
          .to(graphic, { scale: 1.05, autoAlpha: 0.18, duration: 0.22 }, 0.76);
      });
    }, root);

    ScrollTrigger.refresh();
    return () => context.revert();
  }, [effectiveMotion]);

  useEffect(() => {
    if (!reducedMotion) return;
    const frame = requestAnimationFrame(() => setMotionEnabled(false));
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);

  const progressLabel = useMemo(() => `${String(activeIndex + 1).padStart(2, "0")} / ${String(sections.length).padStart(2, "0")}`, [activeIndex]);
  const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: effectiveMotion ? "smooth" : "auto" });

  return (
    <main ref={rootRef} className={`motion-shell ${effectiveMotion ? "motion-on" : "motion-off"}`}>
      <div className="motion-background" aria-hidden="true"><MotionStage activeIndex={activeIndex} reducedMotion={!effectiveMotion} /><div className="motion-grid" /><div className="motion-grain" /></div>

      <header className="motion-nav">
        <button className="motion-brand" type="button" onClick={() => goTo("intro")}><b>ND</b><span>NOWHEREDEV<small>MOTION PRESENTATION / 05</small></span></button>
        <div className="nav-right"><span className="slide-counter">{progressLabel}</span><button className="motion-toggle" type="button" onClick={() => setMotionEnabled((value) => !value)}>{effectiveMotion ? "MOTION ON" : "MOTION OFF"}</button></div>
      </header>

      <aside className="slide-rail" aria-label="Presentation sections">
        {sections.map((id, index) => <button key={id} type="button" className={index === activeIndex ? "is-active" : ""} onClick={() => goTo(id)} aria-label={`Go to slide ${index + 1}`}><span>{String(index + 1).padStart(2, "0")}</span><i /></button>)}
      </aside>

      <section className="motion-slide intro-slide" id="intro">
        <div className="slide-sticky two-column">
          <div className="slide-copy">
            <p className="motion-kicker">NOWHEREDEV / INDEPENDENT DIGITAL LAB</p>
            <h1>Selected<br /><em>systems.</em></h1>
            <p className="slide-lead">Portfolio ในรูปแบบ motion presentation ที่เล่าแต่ละโปรเจกต์เหมือน slide deck — ใช้ typography, data graphics และ precise motion แทนการสำรวจ node</p>
            <div className="slide-stack"><span>DATA</span><span>WEB</span><span>UTILITY</span><span>EXPERIMENTS</span></div>
          </div>
          <IntroGraphic />
          <div className="scroll-cue">SCROLL TO PRESENT <span>↓</span></div>
        </div>
      </section>

      {projects.map((project, index) => {
        const Graphic = graphicById[project.id];
        return (
          <section className={`motion-slide project-slide slide-${project.id}`} id={project.id} key={project.id}>
            <div className={`slide-sticky two-column ${index % 2 ? "reverse" : ""}`}>
              <div className="slide-copy">
                <div className="slide-meta"><span>{String(index + 2).padStart(2, "0")}</span><span>{project.category}</span></div>
                <p className="motion-kicker">{project.shortName} / SELECTED SYSTEM</p>
                <h2>{project.name}</h2>
                <p className="slide-lead">{project.description}</p>
                <div className="slide-stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
                <a className="slide-link" href={project.liveUrl} target="_blank" rel="noreferrer">VIEW PROJECT <b>↗</b></a>
              </div>
              {Graphic ? <Graphic /> : <DevGraphic />}
            </div>
          </section>
        );
      })}

      <section className="motion-slide outro-slide" id="outro">
        <div className="slide-sticky two-column reverse">
          <div className="slide-copy">
            <p className="motion-kicker">NOWHEREDEV / END FRAME</p>
            <h2>Six systems.<br /><em>One direction.</em></h2>
            <p className="slide-lead">จาก environmental intelligence ถึง creative utility — ทั้งหมดถูกนำเสนอเป็น motion deck เดียวที่อ่านง่ายบน desktop และ mobile</p>
            <a className="slide-link" href="https://nowheredev.vercel.app/" target="_blank" rel="noreferrer">OPEN FULL PORTFOLIO <b>↗</b></a>
          </div>
          <OutroGraphic />
        </div>
      </section>

      <footer className="motion-footer"><span>© 2026 NOWHEREDEV</span><span>PHASE 05 / MOTION PRESENTATION</span><a href="https://github.com/kzabCde/NowDev3D" target="_blank" rel="noreferrer">SOURCE ↗</a></footer>
    </main>
  );
}
