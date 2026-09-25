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

function KineticHeading({ lines, level = 2, outlineLast = false }: { lines: string[]; level?: 1 | 2; outlineLast?: boolean }) {
  const content = lines.map((line, index) => (
    <span className={`kinetic-line ${outlineLast && index === lines.length - 1 ? "is-outline" : ""}`} key={`${line}-${index}`}>
      <span data-kinetic-word>{line}</span>
    </span>
  ));
  return level === 1 ? <h1 className="kinetic-title">{content}</h1> : <h2 className="kinetic-title">{content}</h2>;
}

function SectionSlate({ index, label, code }: { index: number; label: string; code: string }) {
  return (
    <div className="section-slate" data-section-slate aria-hidden="true">
      <span className="slate-number">{String(index + 1).padStart(2, "0")}</span>
      <div className="slate-copy"><span className="slate-rule" /><b>{code}</b><span>{label}</span></div>
    </div>
  );
}

function SlideWipe({ code }: { code: string }) {
  return (
    <div className="slide-wipe" data-slide-wipe aria-hidden="true">
      <span className="wipe-panel wipe-a" />
      <span className="wipe-panel wipe-b" />
      <strong className="slide-wipe-label">{code}</strong>
    </div>
  );
}

function VisualFrame({ children, label, code }: { children: ReactNode; label: string; code: string }) {
  return (
    <div className="visual-frame" data-motion-graphic>
      <span className="frame-corner top-left" />
      <span className="frame-corner top-right" />
      <span className="frame-corner bottom-left" />
      <span className="frame-corner bottom-right" />
      <span className="graphic-axis" aria-hidden="true" />
      <span className="graphic-index">{code}</span>
      <small>{label}</small>
      {children}
      <span className="cinematic-caption">MOTION STUDY / NOWHEREDEV</span>
    </div>
  );
}

function IntroGraphic() {
  return (
    <VisualFrame label="MOTION SYSTEM / 05.1" code="INTRO">
      <div className="intro-graphic">
        <div className="intro-orbit orbit-a" />
        <div className="intro-orbit orbit-b" />
        <div className="intro-disc"><span>ND</span></div>
        <div className="intro-axis axis-x" />
        <div className="intro-axis axis-y" />
        <svg viewBox="0 0 600 420" aria-hidden="true"><path data-draw-path d="M55 312 C130 115 220 90 300 212 S470 342 548 102" fill="none" stroke="rgba(255,255,255,.42)" strokeWidth="1" /></svg>
        <div className="intro-ticker">SELECTED SYSTEMS / DATA / UTILITY / EXPERIMENTAL WEB / MOTION DESIGN</div>
      </div>
    </VisualFrame>
  );
}

function AirGraphic() {
  return (
    <VisualFrame label="ATMOSPHERIC DATA" code="AIR">
      <div className="air-graphic">
        <span className="air-scan" />
        <svg viewBox="0 0 520 420" role="img" aria-label="Abstract air quality contour visualization">
          <g className="contours">{[70, 105, 140, 175].map((r) => <circle key={r} cx="260" cy="205" r={r} />)}</g>
          <path data-draw-path className="air-line line-one" d="M20 230 C120 120, 165 310, 275 190 S430 145, 500 230" />
          <path data-draw-path className="air-line line-two" d="M10 270 C110 205, 180 335, 290 230 S420 185, 510 260" />
          <path data-draw-path className="wind-vector" d="M38 78 C142 34 198 92 260 72 S396 36 484 84" />
          <g className="air-dots">{Array.from({ length: 16 }, (_, index) => <circle className="path-dot" key={index} cx={70 + (index % 8) * 54} cy={105 + Math.floor(index / 8) * 190} r={index % 3 === 0 ? 4 : 2} />)}</g>
        </svg>
        <div className="air-reading"><strong>18</strong><span>µg/m³</span><small>PM2.5 / FORECAST SIGNAL</small></div>
      </div>
    </VisualFrame>
  );
}

function StockGraphic() {
  const bars = [28, 48, 37, 74, 58, 92, 67, 84, 62, 100, 76, 114];
  return (
    <VisualFrame label="MARKET MOTION" code="STOCK">
      <div className="stock-graphic">
        <div className="stock-grid" />
        <div className="stock-bars">{bars.map((height, index) => <i key={index} style={{ "--bar-h": `${height}px`, "--bar-i": index } as CSSProperties} />)}</div>
        <svg viewBox="0 0 600 280" preserveAspectRatio="none" aria-hidden="true"><polyline data-draw-path points="0,220 55,198 110,210 160,150 210,174 265,108 320,125 365,74 420,102 475,44 530,66 600,22" /></svg>
        <div className="market-readout"><span>NVX / 07</span><strong>+18.42%</strong></div>
        <div className="stock-tape"><div className="stock-tape-track"><span><b>NVDA</b> +2.81</span><span><b>AAPL</b> +0.91</span><span><b>MSFT</b> +1.23</span><span><b>GOOGL</b> +1.48</span><span><b>META</b> +3.06</span><span><b>NVDA</b> +2.81</span><span><b>AAPL</b> +0.91</span><span><b>MSFT</b> +1.23</span></div></div>
      </div>
    </VisualFrame>
  );
}

function TuneupGraphic() {
  const bars = [12, 18, 27, 21, 34, 29, 31, 19, 24, 16, 28, 32];
  return (
    <VisualFrame label="VEHICLE TELEMETRY" code="OBD">
      <div className="tuneup-graphic">
        <div className="telemetry-bars">{bars.map((height, index) => <i key={index} style={{ "--telemetry-h": `${height}px` } as CSSProperties} />)}</div>
        <svg viewBox="0 0 500 360" aria-hidden="true">
          <path className="gauge-track" d="M80 275 A175 175 0 0 1 420 275" />
          <path data-draw-path className="gauge-value" d="M80 275 A175 175 0 0 1 420 275" />
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
    <VisualFrame label="VISUAL WORKSPACE" code="MARK">
      <div className="mark-graphic">
        <div className="mark-type-layer">EDIT</div>
        <div className="mark-sheet sheet-a" /><div className="mark-sheet sheet-b" />
        <div className="crop-frame"><span className="crop-handle a" /><span className="crop-handle b" /><span className="crop-handle c" /><span className="crop-handle d" /><b>NOWHERE / MARK</b></div>
        <div className="mark-toolbar"><i /><i /><i /><i /><i /></div>
      </div>
    </VisualFrame>
  );
}

function ErpGraphic() {
  return (
    <VisualFrame label="OPERATIONS SYSTEM" code="ERP">
      <div className="erp-graphic">
        <div className="erp-matrix">{Array.from({ length: 30 }, (_, index) => <i key={index} />)}</div>
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
    <VisualFrame label="NOWHEREDEV SYSTEM" code="DEV">
      <div className="dev-graphic">
        <div className="dev-stack stack-one"><span>AI</span></div>
        <div className="dev-stack stack-two"><span>DATA</span></div>
        <div className="dev-stack stack-three"><span>WEB</span></div>
        <div className="dev-stack stack-four"><span>LAB</span></div>
        <div className="dev-crosshair"><i /><b /></div>
        <div className="dev-wordmark">NOWHEREDEV</div>
      </div>
    </VisualFrame>
  );
}

function OutroGraphic() {
  return (
    <VisualFrame label="SYSTEM INDEX" code="END">
      <div className="outro-grid">{projects.map((project, index) => <div key={project.id}><small>{String(index + 1).padStart(2, "0")}</small><strong>{project.shortName}</strong><span>{project.category}</span></div>)}</div>
    </VisualFrame>
  );
}

const graphicById: Record<string, () => ReactNode> = { air: AirGraphic, stock: StockGraphic, tuneup: TuneupGraphic, mark: MarkGraphic, erp: ErpGraphic, portfolio: DevGraphic };

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
      ScrollTrigger.create({
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => root.style.setProperty("--deck-progress", self.progress.toFixed(4)),
      });

      const flash = root.querySelector(".frame-flash");
      const slides = gsap.utils.toArray<HTMLElement>(".motion-slide", root);
      slides.forEach((slide, index) => {
        const content = slide.querySelector(".slide-copy");
        const graphic = slide.querySelector("[data-motion-graphic]");
        const metadata = slide.querySelectorAll(".slide-meta, .slide-stack, .slide-link, .slide-lead, .motion-kicker");
        const words = slide.querySelectorAll("[data-kinetic-word]");
        const slate = slide.querySelector("[data-section-slate]");
        const wipePanels = slide.querySelectorAll(".wipe-panel");
        const wipeLabel = slide.querySelector(".slide-wipe-label");
        const paths = slide.querySelectorAll<SVGGeometryElement>("[data-draw-path]");
        const bars = slide.querySelectorAll(".stock-bars i, .telemetry-bars i, .erp-module, .dev-stack");

        paths.forEach((path) => {
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        });

        if (!effectiveMotion) {
          gsap.set([content, graphic, metadata, words, slate, wipePanels, wipeLabel, paths, bars], { clearProps: "all" });
          return;
        }

        gsap.set(wipePanels, { scaleX: 1 });
        gsap.set(wipeLabel, { autoAlpha: 1, xPercent: 0 });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: slide,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.7,
            onEnter: () => { setActiveIndex(index); if (flash) gsap.fromTo(flash, { opacity: 0.16 }, { opacity: 0, duration: 0.24, overwrite: true }); },
            onEnterBack: () => { setActiveIndex(index); if (flash) gsap.fromTo(flash, { opacity: 0.12 }, { opacity: 0, duration: 0.2, overwrite: true }); },
          },
        });

        timeline
          .fromTo(slate, { autoAlpha: 0, yPercent: 8 }, { autoAlpha: 1, yPercent: 0, duration: 0.08 }, 0)
          .to(wipePanels[0], { scaleX: 0, transformOrigin: "right center", duration: 0.16 }, 0.04)
          .to(wipePanels[1], { scaleX: 0, transformOrigin: "left center", duration: 0.18 }, 0.08)
          .to(wipeLabel, { xPercent: 35, autoAlpha: 0, duration: 0.12 }, 0.08)
          .fromTo(words, { yPercent: 118, rotateX: 74, skewY: 5, autoAlpha: 0, letterSpacing: ".02em" }, { yPercent: 0, rotateX: 0, skewY: 0, autoAlpha: 1, letterSpacing: "-.07em", stagger: 0.035, duration: 0.22 }, 0.13)
          .fromTo(content, { xPercent: index % 2 ? 5 : -5 }, { xPercent: 0, duration: 0.24 }, 0.14)
          .fromTo(graphic, { clipPath: "inset(18% 12% 18% 12%)", scale: 0.92, rotate: index % 2 ? 2.2 : -2.2, autoAlpha: 0.2 }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, rotate: 0, autoAlpha: 1, duration: 0.28 }, 0.16)
          .fromTo(metadata, { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.025, duration: 0.17 }, 0.2)
          .to(paths, { strokeDashoffset: 0, stagger: 0.035, duration: 0.32 }, 0.22)
          .fromTo(bars, { scaleY: 0.08, autoAlpha: 0.15 }, { scaleY: 1, autoAlpha: 1, stagger: 0.012, duration: 0.25, transformOrigin: "bottom" }, 0.24)
          .to(slate, { autoAlpha: 0, yPercent: -6, duration: 0.12 }, 0.34)
          .to(graphic, { scale: 1.035, xPercent: index % 2 ? -2 : 2, duration: 0.26 }, 0.55)
          .to(words, { yPercent: -86, rotateX: -48, autoAlpha: 0.1, stagger: 0.02, duration: 0.18 }, 0.78)
          .to(metadata, { y: -18, autoAlpha: 0.08, duration: 0.16 }, 0.8)
          .to(graphic, { clipPath: "inset(12% 8% 12% 8%)", scale: 1.08, autoAlpha: 0.14, duration: 0.18 }, 0.8)
          .fromTo(wipePanels[0], { scaleX: 0 }, { scaleX: 1, transformOrigin: "left center", duration: 0.14 }, 0.88)
          .fromTo(wipePanels[1], { scaleX: 0 }, { scaleX: 1, transformOrigin: "right center", duration: 0.14 }, 0.9);
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
    <main ref={rootRef} className={`motion-shell phase51 ${effectiveMotion ? "motion-on" : "motion-off"}`}>
      <div className="frame-flash" aria-hidden="true" />
      <div className="presentation-progress" aria-hidden="true"><i /></div>
      <div className="motion-background" aria-hidden="true"><MotionStage activeIndex={activeIndex} reducedMotion={!effectiveMotion} /><div className="motion-grid" /><div className="motion-grain" /></div>

      <header className="motion-nav">
        <button className="motion-brand" type="button" onClick={() => goTo("intro")}><b>ND</b><span>NOWHEREDEV<small>MOTION ART DIRECTION / 05.1</small></span></button>
        <div className="nav-right"><span className="slide-counter">{progressLabel}</span><button className="motion-toggle" type="button" onClick={() => setMotionEnabled((value) => !value)}>{effectiveMotion ? "MOTION ON" : "MOTION OFF"}</button></div>
      </header>

      <aside className="slide-rail" aria-label="Presentation sections">
        {sections.map((id, index) => <button key={id} type="button" className={index === activeIndex ? "is-active" : ""} onClick={() => goTo(id)} aria-label={`Go to slide ${index + 1}`}><span>{String(index + 1).padStart(2, "0")}</span><i /></button>)}
      </aside>

      <section className="motion-slide intro-slide" id="intro">
        <div className="slide-sticky two-column">
          <SectionSlate index={0} label="OPENING FRAME" code="MOTION REEL" /><SlideWipe code="05.1" />
          <div className="slide-copy"><p className="motion-kicker">NOWHEREDEV / INDEPENDENT DIGITAL LAB</p><KineticHeading level={1} lines={["Selected", "systems."]} outlineLast /><p className="slide-lead">Portfolio ที่ถูกกำกับแบบ motion-design reel: ทุกโปรเจกต์มี opening slate, kinetic typography, graphic performance และ transition ของตัวเอง</p><div className="slide-stack"><span>KINETIC TYPE</span><span>SVG MOTION</span><span>MASK / WIPE</span><span>WEBGL</span></div></div>
          <IntroGraphic /><div className="scroll-cue">SCROLL TO PRESENT <span>↓</span></div>
        </div>
      </section>

      {projects.map((project, index) => {
        const Graphic = graphicById[project.id];
        const titleLines = project.id === "air" ? ["Thai Air", "Intelligence"] : project.id === "stock" ? ["Inside", "Stock"] : project.id === "tuneup" ? ["Now", "TuneUp"] : project.id === "mark" ? ["Nowhere", "Mark"] : project.id === "erp" ? ["Nowerp", "System"] : ["Nowhere", "DEV"];
        return (
          <section className={`motion-slide project-slide slide-${project.id}`} id={project.id} key={project.id}>
            <div className={`slide-sticky two-column ${index % 2 ? "reverse" : ""}`}>
              <SectionSlate index={index + 1} label={project.category} code={project.shortName} /><SlideWipe code={project.shortName} />
              <div className="slide-copy"><div className="slide-meta"><span>{String(index + 2).padStart(2, "0")}</span><span>{project.category}</span></div><p className="motion-kicker">{project.shortName} / SELECTED SYSTEM</p><KineticHeading lines={titleLines} outlineLast={index % 2 === 1} /><p className="slide-lead">{project.description}</p><div className="slide-stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div><a className="slide-link" href={project.liveUrl} target="_blank" rel="noreferrer">VIEW PROJECT <b>↗</b></a></div>
              {Graphic ? <Graphic /> : <DevGraphic />}
            </div>
          </section>
        );
      })}

      <section className="motion-slide outro-slide" id="outro">
        <div className="slide-sticky two-column reverse">
          <SectionSlate index={7} label="CLOSING FRAME" code="END" /><SlideWipe code="END" />
          <div className="slide-copy"><p className="motion-kicker">NOWHEREDEV / END FRAME</p><KineticHeading lines={["Six systems.", "One direction."]} outlineLast /><p className="slide-lead">Motion language เดียวเชื่อม environmental intelligence, finance, automotive, creative tools และ business systems เข้าด้วยกันโดยยังคงเอกลักษณ์ของแต่ละโปรเจกต์</p><a className="slide-link" href="https://nowheredev.vercel.app/" target="_blank" rel="noreferrer">OPEN FULL PORTFOLIO <b>↗</b></a></div><OutroGraphic />
        </div>
      </section>

      <footer className="motion-footer"><span>© 2026 NOWHEREDEV</span><span>PHASE 05.1 / MOTION ART DIRECTION</span><a href="https://github.com/kzabCde/NowDev3D" target="_blank" rel="noreferrer">SOURCE ↗</a></footer>
    </main>
  );
}
