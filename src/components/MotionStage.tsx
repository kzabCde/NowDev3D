"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { Bloom, EffectComposer, Noise } from "@react-three/postprocessing";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function ChromeForm({ activeIndex, reducedMotion }: { activeIndex: number; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const angle = activeIndex * 0.72;
    target.set(Math.sin(angle) * 1.15, Math.cos(angle * 0.7) * 0.55, 0);
    group.current.position.lerp(target, 1 - Math.exp(-3.2 * delta));
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, angle * 0.38, 3, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, Math.sin(angle) * 0.28, 3, delta);
    if (!reducedMotion) group.current.rotation.z += delta * 0.055;
    if (ring.current && !reducedMotion) ring.current.rotation.z -= delta * 0.11;
    const pulse = reducedMotion ? 1 : 1 + Math.sin(state.clock.elapsedTime * 0.7) * 0.025;
    group.current.scale.setScalar(pulse);
  });

  return (
    <group ref={group}>
      <Float speed={reducedMotion ? 0 : 0.55} floatIntensity={reducedMotion ? 0 : 0.16} rotationIntensity={0}>
        <mesh>
          <icosahedronGeometry args={[1.18, 3]} />
          <meshPhysicalMaterial
            color="#f4f4ef"
            metalness={0.82}
            roughness={0.18}
            clearcoat={1}
            clearcoatRoughness={0.12}
            envMapIntensity={1.6}
          />
        </mesh>
        <mesh scale={0.79}>
          <sphereGeometry args={[1, 48, 48]} />
          <meshPhysicalMaterial color="#050505" metalness={0.72} roughness={0.26} />
        </mesh>
        <mesh ref={ring} rotation={[1.05, 0.25, 0]}>
          <torusGeometry args={[1.7, 0.018, 10, 128]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.55} toneMapped={false} />
        </mesh>
        <mesh rotation={[0.25, 1.1, 0.3]}>
          <torusGeometry args={[2.05, 0.007, 8, 128]} />
          <meshBasicMaterial color="#9a9a94" transparent opacity={0.24} toneMapped={false} />
        </mesh>
      </Float>
    </group>
  );
}

export function MotionStage({ activeIndex, reducedMotion }: { activeIndex: number; reducedMotion: boolean }) {
  return (
    <div className="motion-webgl" aria-hidden="true">
      <Canvas
        dpr={[1, 1.35]}
        camera={{ position: [0, 0, 6.6], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[4, 5, 6]} intensity={3.6} color="#ffffff" />
        <directionalLight position={[-4, -2, 3]} intensity={1.8} color="#8f8f88" />
        <pointLight position={[0, 0, 3]} intensity={3.2} color="#ffffff" distance={8} />
        <ChromeForm activeIndex={activeIndex} reducedMotion={reducedMotion} />
        <Environment preset="studio" />
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.22} luminanceThreshold={0.82} luminanceSmoothing={0.12} mipmapBlur />
          {!reducedMotion && <Noise opacity={0.018} />}
        </EffectComposer>
      </Canvas>
    </div>
  );
}
