"use client";

import { Float, Grid, Html, Sparkles } from "@react-three/drei";
import { Canvas, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { projects, type Project } from "@/lib/projects";

type SceneCanvasProps = {
  enabled: boolean;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function Shape({ shape }: { shape: Project["shape"] }) {
  switch (shape) {
    case "box": return <boxGeometry args={[1.05, 1.05, 1.05, 2, 2, 2]} />;
    case "octa": return <octahedronGeometry args={[0.8, 0]} />;
    case "torus": return <torusKnotGeometry args={[0.48, 0.16, 96, 12]} />;
    case "sphere": return <sphereGeometry args={[0.68, 24, 24]} />;
    case "dodeca": return <dodecahedronGeometry args={[0.72, 0]} />;
    default: return <icosahedronGeometry args={[0.78, 1]} />;
  }
}

function ProjectNode({ project, selected, onSelect }: { project: Project; selected: boolean; onSelect: (id: string) => void }) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const targetScaleRef = useRef(new THREE.Vector3(1, 1, 1));
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "default";
    return () => { document.body.style.cursor = "default"; };
  }, [hovered]);

  useFrame((state, delta) => {
    if (!group.current) return;

    const targetScale = targetScaleRef.current;
    targetScale.setScalar(hovered || selected ? 1.18 : 1);
    group.current.scale.lerp(targetScale, 1 - Math.exp(-8 * delta));
    group.current.rotation.y += delta * 0.16;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.45 + project.position[0]) * 0.08;

    if (ring.current) {
      ring.current.rotation.z -= delta * 0.2;
      const targetOpacity = hovered || selected ? 0.75 : 0.2;
      const material = ring.current.material as THREE.MeshBasicMaterial;
      material.opacity = THREE.MathUtils.damp(material.opacity, targetOpacity, 8, delta);
    }
  });

  const stopAndSelect = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(project.id);
  };

  return (
    <Float speed={1.25} rotationIntensity={0.18} floatIntensity={0.35} position={project.position}>
      <group
        ref={group}
        onPointerOver={(event) => { event.stopPropagation(); setHovered(true); }}
        onPointerOut={() => setHovered(false)}
        onClick={stopAndSelect}
      >
        <mesh castShadow>
          <Shape shape={project.shape} />
          <meshStandardMaterial
            color={project.accent}
            emissive={project.accent}
            emissiveIntensity={hovered || selected ? 1.8 : 0.55}
            roughness={0.32}
            metalness={0.42}
          />
        </mesh>
        <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.02, 0.012, 8, 96]} />
          <meshBasicMaterial color={project.accent} transparent opacity={0.22} />
        </mesh>
        <pointLight color={project.accent} intensity={hovered || selected ? 9 : 3.5} distance={3.2} />
        <Html center position={[0, -1.22, 0]} distanceFactor={8} zIndexRange={[20, 0]}>
          <button className={`node-label ${selected ? "is-selected" : ""}`} type="button" onClick={() => onSelect(project.id)}>
            <span>{project.shortName}</span><small>{project.category}</small>
          </button>
        </Html>
      </group>
    </Float>
  );
}

function Core() {
  const core = useRef<THREE.Mesh>(null);
  const ringOne = useRef<THREE.Mesh>(null);
  const ringTwo = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (core.current) {
      core.current.rotation.x += delta * 0.13;
      core.current.rotation.y -= delta * 0.19;
      core.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.04);
    }
    if (ringOne.current) ringOne.current.rotation.z += delta * 0.18;
    if (ringTwo.current) ringTwo.current.rotation.x -= delta * 0.13;
  });

  return (
    <group position={[0, 0.25, 0]}>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.05, 2]} />
        <meshStandardMaterial color="#dbe5ff" emissive="#7f9dff" emissiveIntensity={0.55} wireframe roughness={0.25} />
      </mesh>
      <mesh ref={ringOne} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[1.55, 0.018, 8, 128]} />
        <meshBasicMaterial color="#8ba1ff" transparent opacity={0.35} />
      </mesh>
      <mesh ref={ringTwo} rotation={[0.4, 0.4, 0]}>
        <torusGeometry args={[1.85, 0.009, 8, 128]} />
        <meshBasicMaterial color="#65f4c2" transparent opacity={0.22} />
      </mesh>
    </group>
  );
}

function CameraRig({ enabled, selectedId }: { enabled: boolean; selectedId: string | null }) {
  const { camera, pointer } = useThree();
  const targetRef = useRef(new THREE.Vector3(0, 0.2, 8.8));
  const lookAtRef = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, delta) => {
    const selected = projects.find((project) => project.id === selectedId);
    const target = targetRef.current;
    const lookAt = lookAtRef.current;

    if (selected) {
      target.set(selected.position[0] * 0.22, selected.position[1] * 0.18 + 0.25, 7.15);
      lookAt.set(selected.position[0] * 0.28, selected.position[1] * 0.24, selected.position[2]);
    } else {
      target.set(
        enabled ? pointer.x * 0.42 : 0,
        0.2 + (enabled ? pointer.y * 0.28 : 0),
        8.8,
      );
      lookAt.set(0, 0.05, 0);
    }

    camera.position.lerp(target, 1 - Math.exp(-2.7 * delta));
    camera.lookAt(lookAt);
  });

  return null;
}

function Scene({ enabled, selectedId, onSelect }: SceneCanvasProps) {
  return (
    <>
      <color attach="background" args={["#050608"]} />
      <fog attach="fog" args={["#050608", 8.5, 17]} />
      <ambientLight intensity={0.34} />
      <directionalLight position={[4, 5, 6]} intensity={1.2} color="#eef2ff" />
      <pointLight position={[-5, 2, 4]} intensity={7} distance={8} color="#5979ff" />
      <pointLight position={[5, -2, 2]} intensity={5} distance={7} color="#62efc3" />
      <CameraRig enabled={enabled} selectedId={selectedId} />
      <Core />
      {projects.map((project) => (
        <ProjectNode key={project.id} project={project} selected={project.id === selectedId} onSelect={onSelect} />
      ))}
      <Sparkles count={enabled ? 70 : 20} scale={[11, 7, 7]} size={1.25} speed={enabled ? 0.28 : 0} opacity={0.35} color="#b8c7ff" />
      <Grid
        position={[0, -3.65, -1.2]}
        args={[18, 18]}
        cellSize={0.6}
        cellThickness={0.4}
        cellColor="#253047"
        sectionSize={3}
        sectionThickness={0.65}
        sectionColor="#49617e"
        fadeDistance={11}
        fadeStrength={1.4}
        infiniteGrid
      />
    </>
  );
}

export function SceneCanvas(props: SceneCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 8.8], fov: 42, near: 0.1, far: 50 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      frameloop={props.enabled ? "always" : "demand"}
      fallback={<div className="webgl-fallback">3D unavailable on this device.</div>}
    >
      <Scene {...props} />
    </Canvas>
  );
}
