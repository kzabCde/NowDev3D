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

type SceneCanvasProps = {
  enabled: boolean;
  selectedId: string | null;
  activeId: string | null;
  scrollProgress: number;
  onSelect: (id: string) => void;
};

type ProjectNodeProps = {
  project: Project;
  selected: boolean;
  active: boolean;
  enabled: boolean;
  onSelect: (id: string) => void;
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
    return () => {
      document.body.style.cursor = "default";
    };
  }, [hovered]);

  useFrame((state, delta) => {
    if (!group.current) return;

    const targetScale = targetScaleRef.current;
    targetScale.setScalar(emphasized ? 1.14 : 1);
    group.current.scale.lerp(targetScale, 1 - Math.exp(-8 * delta));

    if (enabled) {
      group.current.rotation.y += delta * 0.18;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.42 + project.position[0]) * 0.06;
    }

    if (halo.current) {
      if (enabled) halo.current.rotation.z -= delta * 0.16;
      const material = halo.current.material as THREE.MeshBasicMaterial;
      material.opacity = THREE.MathUtils.damp(material.opacity, emphasized ? 0.72 : 0.18, 7, delta);
    }
  });

  const handleSelect = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelect(project.id);
  };

  return (
    <Float
      speed={enabled ? 1.15 : 0}
      rotationIntensity={enabled ? 0.12 : 0}
      floatIntensity={enabled ? 0.28 : 0}
      position={project.position}
    >
      <group
        ref={group}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={handleSelect}
      >
        <Suspense fallback={<NodeFallback color={project.accent} />}>
          <ProjectModel project={project} />
        </Suspense>

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
          <button
            className={`node-label ${emphasized ? "is-selected" : ""}`}
            type="button"
            onClick={() => onSelect(project.id)}
          >
            <span>{project.shortName}</span>
            <small>{project.chapter}</small>
          </button>
        </Html>
      </group>
    </Float>
  );
}

function NodeFallback({ color }: { color: string }) {
  return (
    <mesh>
      <icosahedronGeometry args={[0.72, 1]} />
      <meshBasicMaterial color={color} wireframe transparent opacity={0.42} toneMapped={false} />
    </mesh>
  );
}

function NeuralCore({ enabled }: { enabled: boolean }) {
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
      <mesh>
        <sphereGeometry args={[0.92, 48, 48]} />
        <MeshDistortMaterial
          color="#16224f"
          emissive="#667cff"
          emissiveIntensity={1.2}
          roughness={0.25}
          metalness={0.2}
          distort={0.34}
          speed={enabled ? 1.3 : 0}
        />
      </mesh>
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.22, 2]} />
        <meshBasicMaterial color="#a5b1ff" wireframe transparent opacity={0.42} toneMapped={false} />
      </mesh>
      <mesh ref={ringA} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[1.62, 0.018, 8, 96]} />
        <meshBasicMaterial color="#7f91ff" transparent opacity={0.48} toneMapped={false} />
      </mesh>
      <mesh ref={ringB} rotation={[0.5, 0.34, 0]}>
        <torusGeometry args={[1.95, 0.009, 8, 96]} />
        <meshBasicMaterial color="#5df7d2" transparent opacity={0.28} toneMapped={false} />
      </mesh>
      <pointLight color="#8092ff" intensity={9} distance={6} />
    </group>
  );
}

function NeuralLink({ project, enabled, offset }: { project: Project; enabled: boolean; offset: number }) {
  const pulse = useRef<THREE.Mesh>(null);
  const points = useMemo(
    () => [new THREE.Vector3(0, 0.15, 0), new THREE.Vector3(...project.position)],
    [project.position],
  );

  useFrame((state) => {
    if (!pulse.current || !enabled) return;
    const t = (state.clock.elapsedTime * 0.105 + offset) % 1;
    pulse.current.position.lerpVectors(points[0], points[1], t);
  });

  return (
    <>
      <Line points={points} color={project.accent} lineWidth={0.55} transparent opacity={0.24} />
      <mesh ref={pulse}>
        <sphereGeometry args={[0.055, 10, 10]} />
        <meshBasicMaterial color={project.accent} toneMapped={false} />
      </mesh>
    </>
  );
}

type Waypoint = {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
};

function CameraRig({
  enabled,
  selectedId,
  scrollProgress,
}: {
  enabled: boolean;
  selectedId: string | null;
  scrollProgress: number;
}) {
  const { camera, pointer, invalidate } = useThree();
  const targetRef = useRef(new THREE.Vector3());
  const lookAtRef = useRef(new THREE.Vector3());

  const waypoints = useMemo<Waypoint[]>(() => {
    const projectWaypoints = projects.map((project) => ({
      position: new THREE.Vector3(
        project.position[0] * 0.42,
        project.position[1] * 0.34 + 0.42,
        project.position[2] + 6.55,
      ),
      lookAt: new THREE.Vector3(project.position[0] * 0.76, project.position[1] * 0.68, project.position[2]),
    }));

    return [
      { position: new THREE.Vector3(0, 0.55, 9.5), lookAt: new THREE.Vector3(0, 0, 0) },
      ...projectWaypoints,
      { position: new THREE.Vector3(0, -0.25, 10.3), lookAt: new THREE.Vector3(0, -0.55, -1.3) },
    ];
  }, []);

  useEffect(() => {
    if (!enabled) invalidate();
  }, [enabled, invalidate, scrollProgress, selectedId]);

  useFrame((_, delta) => {
    const target = targetRef.current;
    const lookAt = lookAtRef.current;
    const selected = projects.find((project) => project.id === selectedId);

    if (selected) {
      target.set(
        selected.position[0] * 0.35,
        selected.position[1] * 0.28 + 0.45,
        selected.position[2] + 5.15,
      );
      lookAt.set(selected.position[0], selected.position[1], selected.position[2]);
    } else {
      const scaled = THREE.MathUtils.clamp(scrollProgress, 0, 1) * (waypoints.length - 1);
      const fromIndex = Math.min(Math.floor(scaled), waypoints.length - 2);
      const toIndex = fromIndex + 1;
      const local = scaled - fromIndex;
      const eased = local * local * (3 - 2 * local);

      target.lerpVectors(waypoints[fromIndex].position, waypoints[toIndex].position, eased);
      lookAt.lerpVectors(waypoints[fromIndex].lookAt, waypoints[toIndex].lookAt, eased);

      if (enabled) {
        target.set(target.x + pointer.x * 0.22, target.y + pointer.y * 0.14, target.z);
      }
    }

    if (enabled) {
      camera.position.lerp(target, 1 - Math.exp(-3.2 * delta));
    } else {
      camera.position.copy(target);
    }
    camera.lookAt(lookAt);
  });

  return null;
}

function Scene(props: SceneCanvasProps) {
  return (
    <>
      <color attach="background" args={["#02030a"]} />
      <fog attach="fog" args={["#02030a", 8.5, 24]} />
      <ambientLight intensity={0.22} />
      <directionalLight position={[3, 6, 7]} intensity={0.65} color="#dce1ff" />
      <pointLight position={[-7, 4, 2]} intensity={5} distance={12} color="#394fff" />
      <pointLight position={[6, -3, 1]} intensity={4} distance={10} color="#2bd9bb" />

      <CameraRig enabled={props.enabled} selectedId={props.selectedId} scrollProgress={props.scrollProgress} />
      <Stars radius={38} depth={28} count={1800} factor={2.4} saturation={0.12} fade speed={props.enabled ? 0.22 : 0} />
      <Sparkles
        count={props.enabled ? 110 : 50}
        scale={[15, 10, 12]}
        size={1.05}
        speed={props.enabled ? 0.18 : 0}
        opacity={0.36}
        color="#9aa9ff"
      />

      <NeuralCore enabled={props.enabled} />
      {projects.map((project, index) => (
        <NeuralLink key={`link-${project.id}`} project={project} enabled={props.enabled} offset={index / projects.length} />
      ))}
      {projects.map((project) => (
        <ProjectNode
          key={project.id}
          project={project}
          enabled={props.enabled}
          selected={project.id === props.selectedId}
          active={project.id === props.activeId}
          onSelect={props.onSelect}
        />
      ))}

      <EffectComposer>
        <Bloom intensity={0.72} luminanceThreshold={0.68} luminanceSmoothing={0.5} height={320} />
        <Noise opacity={0.018} />
      </EffectComposer>
    </>
  );
}

export function SceneCanvas(props: SceneCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.55, 9.5], fov: 43, near: 0.1, far: 60 }}
      dpr={[1, 1.45]}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      frameloop={props.enabled ? "always" : "demand"}
      fallback={<div className="webgl-fallback">3D unavailable on this device.</div>}
    >
      <Suspense fallback={null}>
        <Scene {...props} />
      </Suspense>
    </Canvas>
  );
}
