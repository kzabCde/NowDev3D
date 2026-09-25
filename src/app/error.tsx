"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[NowDev3D Phase05] route error", error);
  }, [error]);

  return (
    <main className="motion-shell fallback-shell">
      <section className="fallback-card">
        <p className="motion-kicker">NOWHEREDEV / MOTION RECOVERY</p>
        <h1>Slide interrupted.<br />Deck recovered.</h1>
        <p>
          เกิด client-side error ระหว่างโหลด motion presentation แต่ recovery layer ป้องกันไม่ให้หน้าเว็บล้มทั้งระบบ
        </p>
        <small>
          DIAGNOSTIC: {error.message || "Unknown runtime error"}{error.digest ? ` · ${error.digest}` : ""}
        </small>
        <div className="fallback-actions">
          <button type="button" onClick={reset}>RETRY PRESENTATION</button>
          <a href="https://github.com/kzabCde/NowDev3D" target="_blank" rel="noreferrer">OPEN SOURCE ↗</a>
        </div>
      </section>
    </main>
  );
}
