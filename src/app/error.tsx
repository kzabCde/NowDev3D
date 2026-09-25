"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[NowDev3D] route error", error);
  }, [error]);

  return (
    <main className="experience-shell phase04-shell">
      <section className="story-chapter genesis">
        <div className="story-card story-card-large">
          <p className="eyebrow">NOWDEV3D / MONOCHROME RECOVERY MODE</p>
          <h1>Signal interrupted.<br /><span>System recovered.</span></h1>
          <p className="story-lead">
            เกิด client-side error ระหว่างโหลดประสบการณ์ 3D แต่ recovery layer แยกความผิดพลาดออกจากหน้าเว็บหลักเรียบร้อยแล้ว
          </p>
          <p className="story-lead" style={{ fontFamily: "var(--font-mono)", fontSize: 11, opacity: 0.72 }}>
            DIAGNOSTIC: {error.message || "Unknown runtime error"}{error.digest ? ` · ${error.digest}` : ""}
          </p>
          <button className="ghost-button" type="button" onClick={reset} style={{ marginTop: 28 }}>
            RETRY EXPERIENCE
          </button>
          <a className="scroll-link" href="https://github.com/kzabCde/NowDev3D" target="_blank" rel="noreferrer">
            OPEN SOURCE <b aria-hidden="true">↗</b>
          </a>
        </div>
      </section>
    </main>
  );
}
