"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  Float,
  Html,
  Line,
  MeshDistortMaterial,
  Sparkles,
  Stars,
  useGLTF,
} from "@react-three/drei";
import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise } from "@react-three/postprocessing";
import * as THREE from "three";
import { projects, type Project } from "@/lib/projects";

export type QualityTier = "low" | "balanced" | "ultra";

export type PerformanceMetrics = {
  fps: number;
  calls: number;
  triangles: number;
  gpu: string;
};

type SceneCanvasProps = {
  enabled: boolean;
  selectedId: string | null;
  activeId: string | null;
  scrollProgress: number;
  quality: QualityTier;
  onSelect: (id: string) => void;
  onMetrics: (metrics: PerformanceMetrics) => void;
};

type ProjectNodeProps = {
  project: Project;
  selected: boolean;
  active: boolean;
  enabled: boolean;
  onSelect: (id: string) => void;
};

type QualityConfig = {
  dpr: [number, number];
  stars: number;
  sparkles: number;
  coreNeurons: number;
  bloom: number;
  noise: boolean;
};

const QUALITY_CONFIG: Record<QualityTier, QualityConfig> = {
  low: { dpr: [1, 1], stars: 520, sparkles: 24, coreNeurons: 0, bloom: 0, noise: false },
  balanced: { dpr: [1, 1.35], stars: 1250, sparkles: 72, coreNeurons: 16, bloom: 0.58, noise: false },
  ultra: { dpr: [1, 1.7], stars: 2200, sparkles: 135, coreNeurons: 34, bloom: 0.82, noise: true },
};

function ProjectModel({ project }: { project: Project }) {
  const { scene } = useGLTF(project.modelPath);
  const model = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={model} scale={0.82} />;
}

function ProjectNode({ project, selected, active, enabled, onSelect }: ProjectNodeProps) {
  const group = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Mesh>(null);
  const targetScaleRef = useRef(new THREE.Vector3(1, 1, 1));
  const [hovered, setHovered] = useState(false);
  const emphasized = hovered || selected || active;

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "default";
    return () => { document.body.style.cursor = "default"; };
  }, [hovered]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const targetScale = targetScaleRef.current;
    targetScale.setScalar(emphasized ? 1.16 : 1);
    group.current.scale.lerp(targetScale, 1 - Math.exp(-8 * delta));
    if (enabled) {
      group.current.rotation.y += delta * 0.18;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.42 + project.position[0]) * 0.06;
    }
    if (halo.current) {
      if (enabled) halo.current.rotation.z -= delta * 0.16;
      const material = halo.current.material as THREE.MeshBasicMaterial;
      material.opacity = THREE.MathUtils.damp(material.opacity, emphasized ? 0.74 : 0.18, 7, delta);
    }
  });

  const handleSelect = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(project.id);
  };

  return (
    <group position={project.position}>
      <Float speed={enabled ? 1.15 : 0} rotationIntensity={enabled ? 0.12 : 0} floatIntensity={enabled ? 0.28 : 0}>
        <group ref={group} onPointerOver={(event) => { event.stopPropagation(); setHovered(true); }} onPointerOut={() => setHovered(false)} onClick={handleSelect}>
          <Suspense fallback={<NodeFallback color={project.accent} />}><ProjectModel project={project} /></Suspense>
          <mesh ref={halo} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.18, 0.018, 8, 72]} />
            <meshBasicMaterial color={project.accent} transparent opacity={0.2} toneMapped={false} />
          </mesh>
          <mesh rotation={[0.72, 0.2, 0]}>
            <torusGeometry args={[1.43, 0.008, 6, 64]} />
            <meshBasicMaterial color={project.accent} transparent opacity={active ? 0.34 : 0.1} toneMapped={false} />
          </mesh>
          <pointLight color={project.accent} intensity={emphasized ? 7 : 2.3} distance={3.8} />
          <Html center position={[0, -1.52, 0]} distanceFactor={8.6} zIndexRange={[20, 0]}>
            <button className={`node-label ${emphasized ? "is-selected" : ""}`} type="button" onClick={() => onSelect(project.id)}>
              <span>{project.shortName}</span><small>{project.chapter}</small>
            </button>
          </Html>
        </group>
      </Float>
    </group>
  );
}

function NodeFallback({ color }: { color: string }) {
  return <mesh><icosahedronGeometry args={[0.72, 1]} /><meshBasicMaterial color={color} wireframe transparent opacity={0.42} toneMapped={false} /></mesh>;
}

function ProceduralCore({ enabled }: { enabled: boolean }) {
  const shell = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  useFrame((state, delta) => {
    if (!enabled) return;
    if (shell.current) {
      shell.current.rotation.x += delta * 0.08;
      shell.current.rotation.y -= delta * 0.12;
      shell.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.25) * 0.035);
    }
    if (ringA.current) ringA.current.rotation.z += delta * 0.14;
    if (ringB.current) ringB.current.rotation.x -= delta * 0.1;
  });
  return (
    <group position={[0, 0.15, 0]}>
      <mesh><sphereGeometry args={[0.92, 28, 28]} /><MeshDistortMaterial color="#16224f" emissive="#667cff" emissiveIntensity={0.9} roughness={0.3} metalness={0.15} distort={0.26} speed={enabled ? 1 : 0} /></mesh>
      <mesh ref={shell}><icosahedronGeometry args={[1.22, 1]} /><meshBasicMaterial color="#a5b1ff" wireframe transparent opacity={0.36} toneMapped={false} /></mesh>
      <mesh ref={ringA} rotation={[Math.PI / 2.2, 0, 0]}><torusGeometry args={[1.62, 0.018, 6, 64]} /><meshBasicMaterial color="#7f91ff" transparent opacity={0.4} toneMapped={false} /></mesh>
      <mesh ref={ringB} rotation={[0.5, 0.34, 0]}><torusGeometry args={[1.95, 0.009, 6, 64]} /><meshBasicMaterial color="#5df7d2" transparent opacity={0.24} toneMapped={false} /></mesh>
      <pointLight color="#8092ff" intensity={6} distance={5} />
    </group>
  );
}

function HeroCoreModel({ enabled }: { enabled: boolean }) {
  const { scene } = useGLTF("/models/neural-core-hero.glb");
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const source = object.material;
      if (!source) return;
      const material = source.clone();
      object.material = material;
      if (material instanceof THREE.MeshStandardMaterial) {
        material.emissive.set("#5268ff");
        material.emissiveIntensity = object.name.toLowerCase().includes("inner") ? 1.35 : 0.5;
        material.metalness = Math.max(material.metalness, 0.35);
        material.roughness = Math.min(material.roughness, 0.38);
      }
    });
    return clone;
  }, [scene]);
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current || !enabled) return;
    group.current.rotation.y += delta * 0.075;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.28) * 0.035;
  });
  return <group ref={group} position={[0, 0.15, 0]} scale={1.08}><primitive object={model} /></group>;
}

function NeuralCrown({ count, enabled, ultra }: { count: number; enabled: boolean; ultra: boolean }) {
  const group = useRef<THREE.Group>(null);
  const nodes = useRef<THREE.InstancedMesh>(null);
  const positions = useMemo(() => Array.from({ length: count }, (_, index) => {
    const y = 1 - (index / Math.max(count - 1, 1)) * 2;
    const radius = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = index * Math.PI * (3 - Math.sqrt(5));
    const distance = 1.65 + (index % 4) * 0.13;
    return new THREE.Vector3(Math.cos(theta) * radius * distance, y * distance, Math.sin(theta) * radius * distance);
  }), [count]);
  const linkGeometry = useMemo(() => {
    const vertices = new Float32Array(count * 6);
    positions.forEach((position, index) => {
      const cursor = index * 6;
      vertices[cursor] = 0; vertices[cursor + 1] = 0; vertices[cursor + 2] = 0;
      vertices[cursor + 3] = position.x; vertices[cursor + 4] = position.y; vertices[cursor + 5] = position.z;
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    return geometry;
  }, [count, positions]);
  useEffect(() => {
    if (!nodes.current) return;
    const matrix = new THREE.Matrix4();
    positions.forEach((position, index) => {
      matrix.makeTranslation(position.x, position.y, position.z);
      nodes.current?.setMatrixAt(index, matrix);
    });
    nodes.current.instanceMatrix.needsUpdate = true;
  }, [positions]);
  useEffect(() => () => linkGeometry.dispose(), [linkGeometry]);
  useFrame((_, delta) => {
    if (!group.current || !enabled) return;
    group.current.rotation.y -= delta * (ultra ? 0.075 : 0.045);
    group.current.rotation.z += delta * 0.012;
  });
  if (count === 0) return null;
  return (
    <group ref={group} position={[0, 0.15, 0]}>
      <lineSegments geometry={linkGeometry}><lineBasicMaterial color="#7286ff" transparent opacity={ultra ? 0.22 : 0.14} toneMapped={false} /></lineSegments>
      <instancedMesh ref={nodes} args={[undefined, undefined, count]}><sphereGeometry args={[ultra ? 0.052 : 0.045, 8, 8]} /><meshBasicMaterial color={ultra ? "#b8c4ff" : "#8193ff"} toneMapped={false} /></instancedMesh>
      {ultra && <mesh rotation={[0.82, 0.2, 0.35]}><torusGeometry args={[2.35, 0.008, 6, 128]} /><meshBasicMaterial color="#5df7d2" transparent opacity={0.2} toneMapped={false} /></mesh>}
    </group>
  );
}

function NeuralCore({ enabled, quality }: { enabled: boolean; quality: QualityTier }) {
  const config = QUALITY_CONFIG[quality];
  if (quality === "low") return <ProceduralCore enabled={enabled} />;
  return <><Suspense fallback={<ProceduralCore enabled={enabled} />}><HeroCoreModel enabled={enabled} /></Suspense><NeuralCrown count={config.coreNeurons} enabled={enabled} ultra={quality === "ultra"} /><pointLight position={[0, 0.15, 0]} color="#7186ff" intensity={quality === "ultra" ? 12 : 8} distance={6.5} /></>;
}

function NeuralLink({ project, enabled, offset }: { project: Project; enabled: boolean; offset: number }) {
  const pulse = useRef<THREE.Mesh>(null);
  const points = useMemo(() => [new THREE.Vector3(0, 0.15, 0), new THREE.Vector3(...project.position)], [project.position]);
  useFrame((state) => {
    if (!pulse.current || !enabled) return;
    const t = (state.clock.elapsedTime * 0.105 + offset) % 1;
    pulse.current.position.lerpVectors(points[0], points[1], t);
  });
  return <><Line points={points} color={project.accent} lineWidth={0.55} transparent opacity={0.24} /><mesh ref={pulse}><sphereGeometry args={[0.055, 10, 10]} /><meshBasicMaterial color={project.accent} toneMapped={false} /></mesh></>;
}

type Waypoint = { position: THREE.Vector3; lookAt: THREE.Vector3; };

function CameraRig({ enabled, selectedId, activeId, scrollProgress }: { enabled: boolean; selectedId: string | null; activeId: string | null; scrollProgress: number; }) {
  const { camera, pointer, invalidate, gl } = useThree();
  const targetRef = useRef(new THREE.Vector3());
  const lookAtRef = useRef(new THREE.Vector3());
  const orbitOffsetRef = useRef(new THREE.Vector3());
  const yAxisRef = useRef(new THREE.Vector3(0, 1, 0));
  const swipeYawRef = useRef(0);
  const swipePitchRef = useRef(0);
  const draggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const transitionRef = useRef(0);
  const previousFocusRef = useRef<string | null>(null);
  const waypoints = useMemo<Waypoint[]>(() => {
    const projectWaypoints = projects.map((project) => ({
      position: new THREE.Vector3(project.position[0] * 0.42, project.position[1] * 0.34 + 0.42, project.position[2] + 6.55),
      lookAt: new THREE.Vector3(project.position[0] * 0.76, project.position[1] * 0.68, project.position[2]),
    }));
    return [{ position: new THREE.Vector3(0, 0.55, 9.5), lookAt: new THREE.Vector3(0, 0, 0) }, ...projectWaypoints, { position: new THREE.Vector3(0, -0.25, 10.3), lookAt: new THREE.Vector3(0, -0.55, -1.3) }];
  }, []);
  useEffect(() => { if (!enabled) invalidate(); }, [enabled, invalidate, scrollProgress, selectedId]);
  useEffect(() => {
    const canvas = gl.domElement;
    const onPointerDown = (event: PointerEvent) => { if (event.pointerType !== "touch") return; draggingRef.current = true; lastPointerRef.current = { x: event.clientX, y: event.clientY }; };
    const onPointerMove = (event: PointerEvent) => {
      if (!draggingRef.current || event.pointerType !== "touch") return;
      const previous = lastPointerRef.current;
      const dx = event.clientX - previous.x;
      const dy = event.clientY - previous.y;
      lastPointerRef.current = { x: event.clientX, y: event.clientY };
      swipeYawRef.current = THREE.MathUtils.clamp(swipeYawRef.current - dx * 0.0045, -0.58, 0.58);
      swipePitchRef.current = THREE.MathUtils.clamp(swipePitchRef.current + dy * 0.0022, -0.2, 0.2);
    };
    const endPointer = () => { draggingRef.current = false; };
    canvas.addEventListener("pointerdown", onPointerDown, { passive: true });
    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerup", endPointer, { passive: true });
    canvas.addEventListener("pointercancel", endPointer, { passive: true });
    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", endPointer);
      canvas.removeEventListener("pointercancel", endPointer);
    };
  }, [gl]);
  useFrame((_, delta) => {
    const target = targetRef.current;
    const lookAt = lookAtRef.current;
    const selected = projects.find((project) => project.id === selectedId);
    const focusId = selectedId ?? activeId;
    if (focusId !== previousFocusRef.current) { previousFocusRef.current = focusId; transitionRef.current = 1; }
    if (selected) {
      target.set(selected.position[0] * 0.35, selected.position[1] * 0.28 + 0.45, selected.position[2] + 5.15);
      lookAt.set(selected.position[0], selected.position[1], selected.position[2]);
    } else {
      const scaled = THREE.MathUtils.clamp(scrollProgress, 0, 1) * (waypoints.length - 1);
      const fromIndex = Math.min(Math.floor(scaled), waypoints.length - 2);
      const toIndex = fromIndex + 1;
      const local = scaled - fromIndex;
      const eased = local * local * (3 - 2 * local);
      target.lerpVectors(waypoints[fromIndex].position, waypoints[toIndex].position, eased);
      lookAt.lerpVectors(waypoints[fromIndex].lookAt, waypoints[toIndex].lookAt, eased);
      if (enabled) target.set(target.x + pointer.x * 0.22, target.y + pointer.y * 0.14, target.z);
    }
    const orbitOffset = orbitOffsetRef.current.copy(target).sub(lookAt);
    orbitOffset.applyAxisAngle(yAxisRef.current, swipeYawRef.current);
    target.copy(lookAt).add(orbitOffset);
    target.y += swipePitchRef.current * 2.2;
    if (!draggingRef.current) {
      swipeYawRef.current = THREE.MathUtils.damp(swipeYawRef.current, 0, 1.4, delta);
      swipePitchRef.current = THREE.MathUtils.damp(swipePitchRef.current, 0, 1.6, delta);
    }
    transitionRef.current = THREE.MathUtils.damp(transitionRef.current, 0, 2.7, delta);
    const cinematicSpeed = 3.2 + transitionRef.current * 5.6;
    if (enabled) camera.position.lerp(target, 1 - Math.exp(-cinematicSpeed * delta)); else camera.position.copy(target);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.damp(camera.fov, 43 - transitionRef.current * 4.5, 6, delta);
      camera.updateProjectionMatrix();
    }
    camera.lookAt(lookAt);
  });
  return null;
}

function PerformanceProbe({ onMetrics }: { onMetrics: (metrics: PerformanceMetrics) => void }) {
  const { gl } = useThree();
  const elapsedRef = useRef(0);
  const framesRef = useRef(0);
  const gpuRef = useRef("WEBGL GPU");
  useEffect(() => {
    const context = gl.getContext();
    const debugInfo = context.getExtension("WEBGL_debug_renderer_info") as { UNMASKED_RENDERER_WEBGL: number } | null;
    if (!debugInfo) return;
    const renderer = context.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    if (typeof renderer === "string" && renderer.trim()) gpuRef.current = renderer;
  }, [gl]);
  useFrame((_, delta) => {
    elapsedRef.current += delta; framesRef.current += 1;
    if (elapsedRef.current < 1) return;
    onMetrics({ fps: Math.round(framesRef.current / elapsedRef.current), calls: gl.info.render.calls, triangles: gl.info.render.triangles, gpu: gpuRef.current });
    elapsedRef.current = 0; framesRef.current = 0;
  });
  return null;
}

function Scene(props: SceneCanvasProps) {
  const config = QUALITY_CONFIG[props.quality];
  return (
    <>
      <color attach="background" args={["#02030a"]} /><fog attach="fog" args={["#02030a", 8.5, 24]} />
      <ambientLight intensity={props.quality === "low" ? 0.32 : 0.22} /><directionalLight position={[3, 6, 7]} intensity={0.65} color="#dce1ff" /><pointLight position={[-7, 4, 2]} intensity={5} distance={12} color="#394fff" /><pointLight position={[6, -3, 1]} intensity={4} distance={10} color="#2bd9bb" />
      <CameraRig enabled={props.enabled} selectedId={props.selectedId} activeId={props.activeId} scrollProgress={props.scrollProgress} /><PerformanceProbe onMetrics={props.onMetrics} />
      <Stars radius={38} depth={28} count={config.stars} factor={props.quality === "ultra" ? 2.7 : 2.25} saturation={0.12} fade speed={props.enabled ? 0.22 : 0} />
      <Sparkles count={config.sparkles} scale={[15, 10, 12]} size={props.quality === "ultra" ? 1.15 : 0.95} speed={props.enabled ? 0.18 : 0} opacity={0.36} color="#9aa9ff" />
      <NeuralCore enabled={props.enabled} quality={props.quality} />
      {projects.map((project, index) => <NeuralLink key={`link-${project.id}`} project={project} enabled={props.enabled} offset={index / projects.length} />)}
      {projects.map((project) => <ProjectNode key={project.id} project={project} enabled={props.enabled} selected={project.id === props.selectedId} active={project.id === props.activeId} onSelect={props.onSelect} />)}
      {props.quality !== "low" && <EffectComposer multisampling={props.quality === "ultra" ? 4 : 0}><Bloom intensity={config.bloom} luminanceThreshold={0.68} luminanceSmoothing={0.5} height={props.quality === "ultra" ? 420 : 280} />{config.noise && <Noise opacity={0.014} />}</EffectComposer>}
    </>
  );
}

export function SceneCanvas(props: SceneCanvasProps) {
  const config = QUALITY_CONFIG[props.quality];
  return (
    <Canvas camera={{ position: [0, 0.55, 9.5], fov: 43, near: 0.1, far: 60 }} dpr={config.dpr} gl={{ antialias: props.quality !== "low", alpha: false, powerPreference: "high-performance" }} frameloop={props.enabled ? "always" : "demand"} fallback={<div className="webgl-fallback">3D unavailable on this device.</div>}>
      <Suspense fallback={null}><Scene {...props} /></Suspense>
    </Canvas>
  );
}
