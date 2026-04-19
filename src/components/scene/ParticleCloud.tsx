"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 900;
const MAX_RADIUS = 16;

function colorAtRadius(r: number): THREE.Color {
  const t = Math.min(r / MAX_RADIUS, 1);
  const cyan = new THREE.Color("#7ff0ff");
  const light = new THREE.Color("#9dc8ff");
  const mid = new THREE.Color("#5a9eff");
  const dark = new THREE.Color("#1a3978");

  if (t < 0.33) return cyan.clone().lerp(light, t / 0.33);
  if (t < 0.66) return light.clone().lerp(mid, (t - 0.33) / 0.33);
  return mid.clone().lerp(dark, (t - 0.66) / 0.34);
}

export default function ParticleCloud() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const r = 4 + Math.pow(Math.random(), 0.55) * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      arr.push({
        origin: new THREE.Vector3(x, y, z),
        phase: Math.random() * Math.PI * 2,
        size: 0.025 + Math.random() * 0.11,
        baseOpacity: 0.35 + Math.random() * 0.55,
        twinkleSpeed: 1.2 + Math.random() * 2,
        color: colorAtRadius(r),
      });
    }
    return arr;
  }, []);

  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    particles.forEach((p, i) => {
      const x = p.origin.x + Math.sin(t * 0.7 + p.phase) * 0.14;
      const y = p.origin.y + Math.cos(t * 0.6 + p.phase * 1.3) * 0.14;
      const z = p.origin.z + Math.sin(t * 0.5 + p.phase * 0.7) * 0.14;

      tempObject.position.set(x, y, z);
      tempObject.scale.setScalar(p.size * 4); // InstancedMesh uses base geom at size 0.25
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);

      const twinkle = Math.sin(t * p.twinkleSpeed + p.phase * 2) * 0.25 + 0.75;
      const mult = p.baseOpacity * twinkle;
      tempColor.copy(p.color).multiplyScalar(mult);
      meshRef.current!.setColorAt(i, tempColor);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[0.25, 6, 6]} />
      <meshBasicMaterial transparent vertexColors />
    </instancedMesh>
  );
}