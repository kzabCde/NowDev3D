"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ComponentType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "@/lib/projects";
import { MotionStage } from "./MotionStage";
import {
  AirGraphic,
  DevGraphic,
  ErpGraphic,
  IntroGraphic,
  MarkGraphic,
  OutroGraphic,
  StockGraphic,
  TuneupGraphic,
} from "./InteractiveVisuals";

const sections = ["intro", ...projects.map((project) => project.id), "outro"];

const graphicById: Record<string, ComponentType> = {
  air: AirGraphic,
  stock: StockGraphic,
  tuneup: TuneupGraphic,
  mark: MarkGraphic,
  erp: ErpGraphic,
  portfolio: DevGraphic,
};

const titleLines: Record<string, string[]> = {
  air: ["Thai Air", "Intelligence"],
  stock: ["Nowhere", "Inside Stock"],
  tuneup: ["Now", "TuneUp"],
  mark: ["Nowhere", "Mark"],
  erp: ["Nowerp"],
  portfolio: ["Nowhere", "DEV"],
};

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

        paths.forEach((path) => {
          try {
            const length = path.getTotalLength();
            gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          } catch {
            // Ignore SVG elements that do not expose measurable path length.
          }
        });

        if (!effectiveMotion) {
          gsap.set([content, graphic, metadata, words, slate, wipePanels, wipeLabel, paths], { clearProps: "all" });
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
            scrub: 0.72,
            onEnter: () => {
              setActiveIndex(index);
              if (flash) gsap.fromTo(flash, { opacity: 0.13 }, { opacity: 0, duration: 0.22, overwrite: true });
            },
            onEnterBack: () => {
              setActiveIndex(index);
              if (flash) gsap.fromTo(flash, { opacity: 0.1 }, { opacity: 0, duration: 0.18, overwrite: true });
            },
          },
        });

        timeline
          .fromTo(slate, { autoAlpha: 0, yPercent: 7 }, { autoAlpha: 1, yPercent: 0, duration: 0.08 }, 0)
          .to(wipePanels[0], { scaleX: 0, transformOrigin: "right center", duration: 0.16 }, 0.04)
          .to(wipePanels[1], { scaleX: 0, transformOrigin: "left center", duration: 0.18 }, 0.08)
          .to(wipeLabel, { xPercent: 30, autoAlpha: 0, duration: 0.12 }, 0.08)
          .fromTo(words, { yPercent: 112, rotateX: 68, skewY: 4, autoAlpha: 0 }, { yPercent: 0, rotateX: 0, skewY: 0, autoAlpha: 1, stagger: 0.035, duration: 0.22 }, 0.13)
          .fromTo(content, { xPercent: index % 2 ? 4 : -4 }, { xPercent: 0, duration: 0.24 }, 0.14)
          .fromTo(graphic, { clipPath: "inset(18% 10% 18% 10%)", scale: 0.93, autoAlpha: 0.15 }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, autoAlpha: 1, duration: 0.28 }, 0.16)
          .fromTo(metadata, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.025, duration: 0.18 }, 0.2)
          .to(paths, { strokeDashoffset: 0, stagger: 0.018, duration: 0.28 }, 0.22)
          .to(slate, { autoAlpha: 0.08, yPercent: -4, duration: 0.16 }, 0.42)
          .to(content, { yPercent: -6, autoAlpha: 0.35, duration: 0.17 }, 0.78)
          .to(graphic, { scale: 1.025, autoAlpha: 0.24, duration: 0.17 }, 0.78)
          .fromTo(wipePanels[0], { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.12 }, 0.88)
          .fromTo(wipePanels[1], { scaleX: 0, transformOrigin: "right center" }, { scaleX: 1, duration: 0.1 }, 0.91);
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

  const progressLabel = useMemo(
    () => `${String(activeIndex + 1).padStart(2, "0")} / ${String(sections.length).padStart(2, "0")}`,
    [activeIndex],
  );

  const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: effectiveMotion ? "smooth" : "auto" });

  return (
    <main ref={rootRef} className={`motion-shell phase51 phase52 ${effectiveMotion ? "motion-on" : "motion-off"}`}>
      <div className="frame-flash" aria-hidden="true" />
      <div className="presentation-progress" aria-hidden="true"><i /></div>
      <div className="motion-background" aria-hidden="true"><MotionStage activeIndex={activeIndex} reducedMotion={!effectiveMotion} /><div className="motion-grid" /><div className="motion-grain" /></div>

      <header className="motion-nav">
        <button className="motion-brand" type="button" onClick={() => goTo("intro")}><b>ND</b><span>NOWHEREDEV<small>INTERACTIVE MOTION / 05.2</small></span></button>
        <div className="nav-right"><span className="slide-counter">{progressLabel}</span><button className="motion-toggle" type="button" onClick={() => setMotionEnabled((value) => !value)}>{effectiveMotion ? "MOTION ON" : "MOTION OFF"}</button></div>
      </header>

      <aside className="slide-rail" aria-label="Presentation sections">
        {sections.map((id, index) => <button key={id} type="button" className={index === activeIndex ? "is-active" : ""} onClick={() => goTo(id)} aria-label={`Go to slide ${index + 1}`}><span>{String(index + 1).padStart(2, "0")}</span><i /></button>)}
      </aside>

      <section className="motion-slide intro-slide" id="intro">
        <div className="slide-sticky two-column">
          <SectionSlate index={0} label="INTERACTIVE MOTION PORTFOLIO" code="INTRO" />
          <SlideWipe code="ND" />
          <div className="slide-copy">
            <p className="motion-kicker">NOWHEREDEV / INDEPENDENT DIGITAL LAB</p>
            <KineticHeading level={1} lines={["Selected", "systems."]} outlineLast />
            <p className="slide-lead">Motion presentation ที่แต่ละ visual ไม่ได้แค่เล่น animation แต่เปิดให้ผู้ใช้ทดลองข้อมูลและ interaction ของแต่ละผลิตภัณฑ์ได้โดยตรง</p>
            <div className="slide-stack"><span>INTERACTIVE</span><span>MOTION</span><span>DATA</span><span>PRODUCT</span></div>
          </div>
          <IntroGraphic />
          <div className="scroll-cue">SCROLL TO PRESENT <span>↓</span></div>
        </div>
      </section>

      {projects.map((project, index) => {
        const Graphic = graphicById[project.id] ?? DevGraphic;
        const slideIndex = index + 1;
        return (
          <section className={`motion-slide project-slide slide-${project.id}`} id={project.id} key={project.id}>
            <div className={`slide-sticky two-column ${index % 2 ? "reverse" : ""}`}>
              <SectionSlate index={slideIndex} label={project.category} code={project.shortName} />
              <SlideWipe code={project.shortName} />
              <div className="slide-copy">
                <div className="slide-meta"><span>{String(index + 2).padStart(2, "0")}</span><span>{project.category}</span></div>
                <p className="motion-kicker">{project.shortName} / INTERACTIVE SYSTEM</p>
                <KineticHeading lines={titleLines[project.id] ?? [project.name]} outlineLast={(index + 1) % 2 === 0} />
                <p className="slide-lead">{project.description}</p>
                <div className="slide-stack">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
                <a className="slide-link" href={project.liveUrl} target="_blank" rel="noreferrer">VIEW PROJECT <b>↗</b></a>
              </div>
              <Graphic />
            </div>
          </section>
        );
      })}

      <section className="motion-slide outro-slide" id="outro">
        <div className="slide-sticky two-column reverse">
          <SectionSlate index={sections.length - 1} label="SYSTEM INDEX" code="END" />
          <SlideWipe code="END" />
          <div className="slide-copy">
            <p className="motion-kicker">NOWHEREDEV / END FRAME</p>
            <KineticHeading lines={["Six systems.", "One direction."]} outlineLast />
            <p className="slide-lead">ทุกตัวอย่างถูกทำให้เป็น interactive micro-demo เพื่อให้ portfolio สื่อ “สิ่งที่ระบบทำได้” ก่อนผู้ใช้ตัดสินใจเปิดโปรเจกต์จริง</p>
            <a className="slide-link" href="https://nowheredev.vercel.app/" target="_blank" rel="noreferrer">OPEN FULL PORTFOLIO <b>↗</b></a>
          </div>
          <OutroGraphic />
        </div>
      </section>

      <footer className="motion-footer"><span>© 2026 NOWHEREDEV</span><span>PHASE 05.2 / INTERACTIVE MOTION</span><a href="https://github.com/kzabCde/NowDev3D" target="_blank" rel="noreferrer">SOURCE ↗</a></footer>
    </main>
  );
}
