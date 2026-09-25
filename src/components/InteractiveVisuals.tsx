"use client";

import {
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

function VisualFrame({
  children,
  label,
  index,
  hint,
}: {
  children: ReactNode;
  label: string;
  index: string;
  hint?: string;
}) {
  return (
    <div className="visual-frame interactive-visual" data-motion-graphic>
      <span className="frame-corner top-left" />
      <span className="frame-corner top-right" />
      <span className="frame-corner bottom-left" />
      <span className="frame-corner bottom-right" />
      <small>{label}</small>
      <span className="graphic-index">{index}</span>
      <span className="graphic-axis" />
      {children}
      {hint ? <div className="interaction-hint"><i />{hint}</div> : null}
    </div>
  );
}

export function IntroGraphic() {
  return (
    <VisualFrame label="MOTION SYSTEM / 05.2" index="00">
      <div className="intro-graphic">
        <div className="intro-orbit orbit-a" />
        <div className="intro-orbit orbit-b" />
        <div className="intro-disc"><span>ND</span></div>
        <div className="intro-axis axis-x" />
        <div className="intro-axis axis-y" />
        <div className="intro-ticker">INTERACTIVE / MOTION / DATA / PRODUCT SYSTEMS / NOWHEREDEV</div>
      </div>
    </VisualFrame>
  );
}

const airReadings: Record<number, { pm: number; aqi: number; confidence: number }> = {
  1: { pm: 14, aqi: 52, confidence: 94 },
  3: { pm: 18, aqi: 61, confidence: 88 },
  7: { pm: 24, aqi: 74, confidence: 79 },
};

export function AirGraphic() {
  const [horizon, setHorizon] = useState(3);
  const reading = airReadings[horizon];
  const pathA = horizon === 1
    ? "M20 245 C115 155,175 285,275 205 S425 160,500 224"
    : horizon === 3
      ? "M20 230 C120 120,165 310,275 190 S430 145,500 230"
      : "M20 260 C110 95,190 330,300 175 S430 210,500 180";
  const pathB = horizon === 1
    ? "M10 280 C120 220,190 320,300 250 S420 205,510 245"
    : horizon === 3
      ? "M10 270 C110 205,180 335,290 230 S420 185,510 260"
      : "M10 292 C115 180,195 355,315 225 S435 160,510 280";

  return (
    <VisualFrame label="ATMOSPHERIC FORECAST" index="01" hint="SELECT FORECAST HORIZON">
      <div className="air-graphic">
        <svg viewBox="0 0 520 420" role="img" aria-label={`Air-quality forecast for ${horizon} days`}>
          <g className="contours">
            {[70, 105, 140, 175].map((r) => <circle key={r} cx="260" cy="205" r={r} />)}
          </g>
          <path data-draw-path className="air-line line-one" d={pathA} />
          <path data-draw-path className="air-line line-two" d={pathB} />
          <path data-draw-path className="wind-vector" d="M78 112 C145 76, 215 92, 274 65 S402 56, 455 104" />
          <g className="air-dots">
            {Array.from({ length: 16 }, (_, index) => (
              <circle key={index} cx={70 + (index % 8) * 54} cy={105 + Math.floor(index / 8) * 190} r={index % 3 === 0 ? 4 : 2} />
            ))}
          </g>
        </svg>
        <div className="air-scan" />
        <div className="air-reading">
          <strong>{reading.pm}</strong><span>µg/m³</span><small>PM2.5 / {horizon}-DAY SIGNAL</small>
          <div className="mini-metrics"><b>AQI {reading.aqi}</b><b>{reading.confidence}% CONF.</b></div>
        </div>
        <div className="visual-controls horizon-controls" aria-label="Forecast horizon">
          {[1, 3, 7].map((days) => (
            <button key={days} className={horizon === days ? "is-active" : ""} type="button" onClick={() => setHorizon(days)}>{days}D</button>
          ))}
        </div>
      </div>
    </VisualFrame>
  );
}

const stockSeries = {
  "1M": [42, 49, 45, 54, 51, 63, 59, 66, 62, 72, 69, 78],
  "3M": [35, 41, 38, 50, 47, 58, 55, 68, 65, 74, 71, 83],
  "1Y": [28, 36, 33, 45, 42, 55, 51, 67, 62, 79, 73, 91],
} as const;

type StockRange = keyof typeof stockSeries;

export function StockGraphic() {
  const [range, setRange] = useState<StockRange>("1Y");
  const data = stockSeries[range];
  const points = useMemo(() => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    return data.map((value, index) => {
      const x = (index / (data.length - 1)) * 600;
      const y = 250 - ((value - min) / Math.max(1, max - min)) * 205;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
  }, [data]);
  const gain = ((data[data.length - 1] - data[0]) / data[0]) * 100;

  return (
    <VisualFrame label="MARKET EXPLORER" index="02" hint="SWITCH TIMEFRAME">
      <div className="stock-graphic">
        <div className="stock-grid" />
        <div className="stock-bars">
          {data.map((height, index) => (
            <i key={index} style={{ "--bar-h": `${Math.max(28, height * 1.45)}px`, "--bar-i": index } as CSSProperties} />
          ))}
        </div>
        <svg viewBox="0 0 600 280" preserveAspectRatio="none" aria-label={`${range} sample market chart`}>
          <polyline data-draw-path points={points} />
        </svg>
        <div className="market-readout"><span>NVX / {range}</span><strong>{gain >= 0 ? "+" : ""}{gain.toFixed(2)}%</strong></div>
        <div className="visual-controls stock-controls" aria-label="Chart timeframe">
          {(Object.keys(stockSeries) as StockRange[]).map((item) => (
            <button key={item} type="button" className={range === item ? "is-active" : ""} onClick={() => setRange(item)}>{item}</button>
          ))}
        </div>
        <div className="stock-tape"><div className="stock-tape-track"><span><b>NVDA</b> 181.42</span><span><b>AAPL</b> 267.11</span><span><b>MSFT</b> 492.08</span><span><b>GOOGL</b> 318.25</span><span><b>NVDA</b> 181.42</span><span><b>AAPL</b> 267.11</span></div></div>
      </div>
    </VisualFrame>
  );
}

export function TuneupGraphic() {
  const [throttle, setThrottle] = useState(56);
  const speed = Math.round(22 + throttle * 1.72);
  const rpm = (0.9 + throttle * 0.046).toFixed(1);
  const gaugeOffset = 440 - (throttle / 100) * 320;

  return (
    <VisualFrame label="LIVE TELEMETRY DEMO" index="03" hint="DRAG THROTTLE">
      <div className="tuneup-graphic">
        <div className="telemetry-bars">
          {Array.from({ length: 18 }, (_, index) => (
            <i key={index} style={{ "--telemetry-h": `${10 + ((index * 11 + throttle) % 28)}px` } as CSSProperties} />
          ))}
        </div>
        <svg viewBox="0 0 500 360" aria-hidden="true">
          <path className="gauge-track" d="M80 275 A175 175 0 0 1 420 275" />
          <path data-draw-path className="gauge-value" d="M80 275 A175 175 0 0 1 420 275" style={{ strokeDashoffset: gaugeOffset }} />
          {Array.from({ length: 13 }, (_, index) => {
            const angle = Math.PI * (1 + index / 12);
            const x1 = 250 + Math.cos(angle) * 150;
            const y1 = 275 + Math.sin(angle) * 150;
            const x2 = 250 + Math.cos(angle) * 166;
            const y2 = 275 + Math.sin(angle) * 166;
            return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} />;
          })}
        </svg>
        <div className="speed-readout"><strong>{speed}</strong><span>KM/H</span><small>SIMULATED LIVE TELEMETRY</small></div>
        <div className="telemetry-row"><span>RPM {rpm}K</span><span>LOAD {throttle}%</span><span>TEMP {82 + Math.round(throttle / 12)}°C</span></div>
        <label className="telemetry-slider"><span>THROTTLE</span><input type="range" min="0" max="100" value={throttle} onChange={(event) => setThrottle(Number(event.target.value))} /><b>{throttle}%</b></label>
      </div>
    </VisualFrame>
  );
}

type CropPoint = { x: number; y: number };

export function MarkGraphic() {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId: number; startX: number; startY: number; origin: CropPoint } | null>(null);
  const [crop, setCrop] = useState<CropPoint>({ x: 22, y: 20 });

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, origin: crop };
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const workspace = workspaceRef.current;
    if (!drag || !workspace || drag.pointerId !== event.pointerId) return;
    const rect = workspace.getBoundingClientRect();
    const dx = ((event.clientX - drag.startX) / rect.width) * 100;
    const dy = ((event.clientY - drag.startY) / rect.height) * 100;
    setCrop({ x: Math.max(5, Math.min(38, drag.origin.x + dx)), y: Math.max(10, Math.min(32, drag.origin.y + dy)) });
  };
  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId === event.pointerId) dragRef.current = null;
  };

  return (
    <VisualFrame label="EDIT WORKSPACE" index="04" hint="DRAG CROP FRAME">
      <div className="mark-graphic" ref={workspaceRef}>
        <div className="mark-sheet sheet-a" /><div className="mark-sheet sheet-b" />
        <div className="mark-type-layer">EDIT</div>
        <div
          className="crop-frame is-draggable"
          style={{ left: `${crop.x}%`, top: `${crop.y}%` }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          role="slider"
          aria-label="Crop frame position"
          aria-valuetext={`x ${Math.round(crop.x)}, y ${Math.round(crop.y)}`}
          tabIndex={0}
        >
          <span className="crop-handle a" /><span className="crop-handle b" /><span className="crop-handle c" /><span className="crop-handle d" /><b>NOWHERE / MARK</b>
        </div>
        <div className="mark-toolbar"><i /><i /><i /><i /><i /></div>
        <div className="crop-coordinates">X {Math.round(crop.x)} / Y {Math.round(crop.y)}</div>
      </div>
    </VisualFrame>
  );
}

const erpModules = {
  revenue: { label: "REVENUE", value: "84.7K", detail: "MTD +12.4%", rows: [72, 88, 65, 92] },
  orders: { label: "ORDERS", value: "128", detail: "18 processing", rows: [44, 61, 79, 56] },
  teams: { label: "TEAMS", value: "06", detail: "3 companies", rows: [86, 52, 69, 94] },
} as const;

type ErpModule = keyof typeof erpModules;

export function ErpGraphic() {
  const [selected, setSelected] = useState<ErpModule>("revenue");
  const module = erpModules[selected];
  return (
    <VisualFrame label="OPERATIONS CONSOLE" index="05" hint="SELECT A MODULE">
      <div className="erp-graphic interactive-erp">
        <div className="erp-rail">{["01", "02", "03", "04"].map((item) => <span key={item}>{item}</span>)}</div>
        <div className="erp-modules">
          {(Object.keys(erpModules) as ErpModule[]).map((key) => {
            const item = erpModules[key];
            return <button type="button" key={key} className={`erp-module interactive-module ${selected === key ? "is-active" : ""}`} onClick={() => setSelected(key)}><small>{item.label}</small><strong>{item.value}</strong><span>{item.detail}</span></button>;
          })}
          <article className="erp-module module-wide lines" aria-live="polite">
            <small>{module.label} / LIVE SAMPLE</small>
            {module.rows.map((width, index) => <span key={index}><i style={{ width: `${width}%` }} /></span>)}
          </article>
        </div>
        <div className="erp-matrix">{Array.from({ length: 30 }, (_, index) => <i key={index} />)}</div>
      </div>
    </VisualFrame>
  );
}

const devSystems = {
  AI: { title: "AI SYSTEMS", copy: "Forecasting, evaluation and language workflows." },
  DATA: { title: "DATA PRODUCTS", copy: "Dashboards, signals and decision-oriented interfaces." },
  WEB: { title: "WEB EXPERIENCES", copy: "Motion, product UI and interactive utilities." },
  LAB: { title: "EXPERIMENTAL LAB", copy: "New interaction models and prototype systems." },
} as const;

type DevSystem = keyof typeof devSystems;

export function DevGraphic() {
  const [selected, setSelected] = useState<DevSystem>("WEB");
  const current = devSystems[selected];
  return (
    <VisualFrame label="NOWHEREDEV SYSTEM MAP" index="06" hint="SELECT A SYSTEM">
      <div className="dev-graphic interactive-dev">
        <div className="dev-system-buttons">
          {(Object.keys(devSystems) as DevSystem[]).map((system, index) => (
            <button key={system} type="button" className={`dev-stack stack-${index + 1} ${selected === system ? "is-active" : ""}`} onClick={() => setSelected(system)}><span>{system}</span><small>0{index + 1}</small></button>
          ))}
        </div>
        <div className="dev-crosshair"><i /><b /></div>
        <div className="dev-detail" aria-live="polite"><small>ACTIVE SYSTEM</small><strong>{current.title}</strong><p>{current.copy}</p></div>
        <div className="dev-wordmark">NOWHEREDEV</div>
      </div>
    </VisualFrame>
  );
}

export function OutroGraphic() {
  const items = [
    ["01", "AIR", "Environmental Intelligence"],
    ["02", "STOCK", "Market Intelligence"],
    ["03", "OBD", "Vehicle Diagnostics"],
    ["04", "MARK", "Creative Utility"],
    ["05", "ERP", "Business Platform"],
    ["06", "DEV", "Portfolio System"],
  ];
  return (
    <VisualFrame label="SYSTEM INDEX" index="07">
      <div className="outro-grid">
        {items.map(([index, name, category]) => <div key={name}><small>{index}</small><strong>{name}</strong><span>{category}</span></div>)}
      </div>
    </VisualFrame>
  );
}
