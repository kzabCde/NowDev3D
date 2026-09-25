"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { Bloom, EffectComposer, Noise } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function HeroGeometry({ variant }: { variant: number }) {
  if (variant === 1) return <torusKnotGeometry args={[0.88, 0.22, 120, 18, 2, 3]} />;
  if (variant === 2) return <octahedronGeometry args={[1.18, 2]} />;
  if (variant === 3) return <sphereGeometry args={[1.08, 64, 64]} />;
  return <icosahedronGeometry args={[1.18, 3]} />;
}

function ChromeForm({ activeIndex, reducedMotion }: { activeIndex: number; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const slab = useRef<THREE.Mesh>(null);
  const target = useMemo(() => new THREE.Vector3(), []);
  const variant = activeIndex % 4;

  useFrame((state, delta) => {
    if (!group.current) return;
    const angle = activeIndex * 0.68;
    target.set(Math.sin(angle) * 1.2, Math.cos(angle * 0.63) * 0.58, Math.sin(angle * 0.37) * 0.2);
    group.current.position.lerp(target, 1 - Math.exp(-3 * delta));
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, angle * 0.42, 3.4, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, Math.sin(angle) * 0.34, 3.1, delta);
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, Math.cos(angle * 0.72) * 0.13, 3, delta);
    if (!reducedMotion) {
      group.current.rotation.y += delta * 0.045;
      if (ringA.current) ringA.current.rotation.z -= delta * (0.08 + activeIndex * 0.004);
      if (ringB.current) ringB.current.rotation.x += delta * 0.05;
      if (slab.current) slab.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.35 + activeIndex) * 0.08;
    }
    const pulse = reducedMotion ? 1 : 1 + Math.sin(state.clock.elapsedTime * 0.72 + activeIndex * 0.4) * 0.022;
    group.current.scale.setScalar(pulse);
  });

  return (
    <group ref={group}>
      <Float speed={reducedMotion ? 0 : 0.48} floatIntensity={reducedMotion ? 0 : 0.14} rotationIntensity={0}>
        <mesh key={variant}>
          <HeroGeometry variant={variant} />
          <meshPhysicalMaterial color="#f5f5ef" metalness={0.88} roughness={variant === 3 ? 0.12 : 0.2} clearcoat={1} clearcoatRoughness={0.1} envMapIntensity={1.8} />
        </mesh>
        <mesh scale={variant === 1 ? 0.57 : 0.76}>
          <sphereGeometry args={[1, 48, 48]} />
          <meshPhysicalMaterial color="#050505" metalness={0.76} roughness={0.24} />
        </mesh>
        <mesh ref={ringA} rotation={[1.05, 0.25, activeIndex * 0.08]}>
          <torusGeometry args={[1.72 + (activeIndex % 3) * 0.09, 0.015, 10, 128]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} toneMapped={false} />
        </mesh>
        <mesh ref={ringB} rotation={[0.25, 1.1, 0.3]}>
          <torusGeometry args={[2.03, 0.006, 8, 128]} />
          <meshBasicMaterial color="#9a9a94" transparent opacity={0.2} toneMapped={false} />
        </mesh>
        <mesh ref={slab} position={[1.75, -0.9, -0.8]} rotation={[0.18, -0.42, 0.06]}>
          <boxGeometry args={[1.65, 0.025, 0.72]} />
          <meshPhysicalMaterial color="#d8d8d2" metalness={0.72} roughness={0.22} transparent opacity={0.32} />
        </mesh>
      </Float>
    </group>
  );
}

export function MotionStage({ activeIndex, reducedMotion }: { activeIndex: number; reducedMotion: boolean }) {
  return (
    <div className="motion-webgl" aria-hidden="true">
      <Canvas dpr={[1, 1.35]} camera={{ position: [0, 0, 6.6], fov: 38 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
        <ambientLight intensity={0.58} />
        <directionalLight position={[4, 5, 6]} intensity={3.8} color="#ffffff" />
        <directionalLight position={[-4, -2, 3]} intensity={1.65} color="#909089" />
        <pointLight position={[0, 0, 3]} intensity={3.3} color="#ffffff" distance={8} />
        <ChromeForm activeIndex={activeIndex} reducedMotion={reducedMotion} />
        <Environment preset="studio" />
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.2} luminanceThreshold={0.84} luminanceSmoothing={0.1} mipmapBlur />
          {!reducedMotion && <Noise opacity={0.015} />}
        </EffectComposer>
      </Canvas>
    </div>
  );
}
