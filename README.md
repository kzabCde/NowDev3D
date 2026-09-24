# NowDev3D

Experimental 3D portfolio lab for **NowhereDEV**. The first milestone is intentionally asset-light: the whole hero scene is procedural so the project stays fast, easy to study, and ready for later GLB/Blender upgrades.

## Stack

- Next.js 16 (App Router)
- React 19
- Three.js
- React Three Fiber
- Drei
- TypeScript

## Current MVP

- Full-screen interactive WebGL scene
- Six selectable project nodes
- Pointer-driven camera parallax
- Animated central core, orbit rings, sparkles, grid and lighting
- Hover/click interactions with project detail drawer
- Responsive project index and mobile layout
- Pause/resume 3D rendering control
- Reduced-motion CSS support
- No external 3D assets required

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Validation:

```bash
npm run typecheck
npm run lint
npm run build
```

## Structure

```text
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Experience.tsx
│   └── SceneCanvas.tsx
└── lib/
    └── projects.ts
```

## Learning roadmap

### Phase 1 — Procedural scene (current)
Learn the scene graph, camera, lights, geometry, materials, render loop and pointer events without depending on Blender assets.

### Phase 2 — 3D assets
Replace selected procedural nodes with optimized `.glb` models. Add compressed textures and preload important assets.

### Phase 3 — Scroll storytelling
Build camera waypoints linked to page sections so navigation moves through the 3D environment instead of only opening overlays.

### Phase 4 — Post-processing
Add subtle bloom/noise/vignette only after profiling desktop and mobile performance.

### Phase 5 — Advanced interaction
Introduce physics or drag interactions where they add meaning, not as decoration.

## Performance rules

- Keep DPR capped on high-density screens.
- Reuse geometry/materials where possible.
- Avoid React state updates inside `useFrame`.
- Prefer compressed GLB/KTX2 assets for future models.
- Always test real mobile devices before increasing effects.

## Deployment

The app is Vercel-ready. No environment variables are required for the current MVP.
