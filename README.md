# NowDev3D — Neural Galaxy

Interactive 3D portfolio experiment built with Next.js, Three.js and React Three Fiber.

## Phase 02

- Neural-galaxy visual language with a central animated core and six connected project nodes.
- Scroll-driven camera storytelling across the full page.
- Six project-specific low-poly GLB assets in `public/models`.
- Asset preloading with `useGLTF.preload` and a loading/progress screen.
- Immutable one-year cache headers for GLB assets plus Next.js HTTP compression.
- Lightweight post-processing using Bloom + subtle Noise.
- Responsive mobile presentation, WebGL fallback and reduced-motion behavior.
- Pause mode switches the canvas to demand rendering to reduce unnecessary GPU work.

## Project node assets

The GLB models are intentionally symbolic and small rather than photorealistic:

- `air-node.glb` — atmospheric orb + orbital rings
- `stock-node.glb` — market bars
- `obd-node.glb` — telemetry gauge
- `mark-node.glb` — visual/image frame
- `erp-node.glb` — stacked business modules
- `portfolio-node.glb` — constellation hub

All six models are roughly 1–9 KB each so the first interactive milestone remains practical on mobile networks.

## Development

```bash
npm install
npm run dev
```

Quality gates:

```bash
npm run typecheck
npm run lint
npm run build
```

## Architecture

- `src/components/Experience.tsx` — scroll storytelling UI, loading state and project detail layer.
- `src/components/SceneCanvas.tsx` — R3F scene, GLB nodes, neural links, camera rig and post FX.
- `src/lib/projects.ts` — project metadata, colors, node positions and asset paths.
- `public/models/*.glb` — compact project-specific 3D models.

## Next

Phase 03 can add Blender-authored hero assets, selective quality presets, touch gestures, route-level project scenes and performance telemetry before production release.
