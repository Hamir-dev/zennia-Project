"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 2600;

function Particles({ pointer }: { pointer: React.RefObject<THREE.Vector2> }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const { positions, basePositions, speeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const basePositions = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 6;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      basePositions[i * 3] = x;
      basePositions[i * 3 + 1] = y;
      basePositions[i * 3 + 2] = z;
      speeds[i] = 0.2 + Math.random() * 0.8;
    }
    return { positions, basePositions, speeds };
  }, []);

  useFrame((state) => {
    const pts = pointsRef.current;
    if (!pts) return;
    const t = state.clock.elapsedTime;
    const arr = pts.geometry.attributes.position.array as Float32Array;

    // Cursor in world space
    const mx = (pointer.current?.x ?? 0) * (viewport.width / 2);
    const my = (pointer.current?.y ?? 0) * (viewport.height / 2);

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3;
      const bx = basePositions[ix];
      const by = basePositions[ix + 1];
      const s = speeds[i];

      // Ambient drift
      let x = bx + Math.sin(t * 0.15 * s + bx) * 0.25;
      let y = by + Math.cos(t * 0.12 * s + by) * 0.25;

      // Gravity toward cursor with inverse falloff
      const dx = mx - x;
      const dy = my - y;
      const dist2 = dx * dx + dy * dy + 0.6;
      const pull = Math.min(0.9, 1.4 / dist2);
      x += dx * pull * 0.06;
      y += dy * pull * 0.06;

      arr[ix] = x;
      arr[ix + 1] = y;
    }
    pts.geometry.attributes.position.needsUpdate = true;
    pts.rotation.z = Math.sin(t * 0.04) * 0.04;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        sizeAttenuation
        color="#f0f0fa"
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ParticleField({
  className = "",
  opacity = 1,
}: {
  className?: string;
  opacity?: number;
}) {
  const pointer = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div
      className={className}
      style={{ opacity }}
      aria-hidden
    >
      <Canvas
        camera={{ position: [0, 0, 9], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Particles pointer={pointer} />
      </Canvas>
    </div>
  );
}
