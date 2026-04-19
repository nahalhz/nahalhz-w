"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 900;
const MAX_RADIUS = 16;

type Particle = {
  origin: THREE.Vector3;
  phase: number;
  size: number;
  twinkleSpeed: number;
  colorBand: 0 | 1 | 2;
};

function makeParticles(): Particle[] {
  const arr: Particle[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const r = 4 + Math.pow(Math.random(), 0.55) * 12;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi);

    const t = Math.min(r / MAX_RADIUS, 1);
    const colorBand: 0 | 1 | 2 = t < 0.4 ? 0 : t < 0.7 ? 1 : 2;

    arr.push({
      origin: new THREE.Vector3(x, y, z),
      phase: Math.random() * Math.PI * 2,
      size: 0.04 + Math.random() * 0.12,
      twinkleSpeed: 1.2 + Math.random() * 2,
      colorBand,
    });
  }
  return arr;
}

function ParticleBand({
  particles,
  color,
  opacity,
}: {
  particles: Particle[];
  color: string;
  opacity: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tempObject = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    particles.forEach((p, i) => {
      const x = p.origin.x + Math.sin(t * 0.7 + p.phase) * 0.14;
      const y = p.origin.y + Math.cos(t * 0.6 + p.phase * 1.3) * 0.14;
      const z = p.origin.z + Math.sin(t * 0.5 + p.phase * 0.7) * 0.14;

      const twinkle = Math.sin(t * p.twinkleSpeed + p.phase * 2) * 0.15 + 0.85;

      tempObject.position.set(x, y, z);
      tempObject.scale.setScalar(p.size * 4 * twinkle);
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, particles.length]}
    >
      <sphereGeometry args={[0.25, 6, 6]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

function ParticleSynapses({ particles }: { particles: Particle[] }) {
  const geometry = useMemo(() => {
    const positions: number[] = [];
    const maxDist = 3;
    const maxPerParticle = 4;

    for (let i = 0; i < particles.length; i++) {
      let count = 0;
      for (let j = i + 1; j < particles.length && count < maxPerParticle; j++) {
        const dist = particles[i].origin.distanceTo(particles[j].origin);
        if (dist < maxDist && Math.random() > 0.55) {
          positions.push(
            particles[i].origin.x,
            particles[i].origin.y,
            particles[i].origin.z,
            particles[j].origin.x,
            particles[j].origin.y,
            particles[j].origin.z
          );
          count++;
        }
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    return geom;
  }, [particles]);

  return (
    <lineSegments>
      <primitive object={geometry} attach="geometry" />
      <lineBasicMaterial
        color="#5a9eff"
        transparent
        opacity={0.05}
        depthWrite={false}
      />
    </lineSegments>
  );
}

export default function ParticleCloud() {
  const particles = useMemo(() => makeParticles(), []);

  const inner = useMemo(() => particles.filter((p) => p.colorBand === 0), [particles]);
  const mid = useMemo(() => particles.filter((p) => p.colorBand === 1), [particles]);
  const outer = useMemo(() => particles.filter((p) => p.colorBand === 2), [particles]);

  return (
    <>
      <ParticleBand particles={inner} color="#7ff0ff" opacity={0.75} />
      <ParticleBand particles={mid} color="#5a9eff" opacity={0.6} />
      <ParticleBand particles={outer} color="#2a5eb8" opacity={0.45} />
      <ParticleSynapses particles={inner} />
      <ParticleSynapses particles={mid} />
    </>
  );
}