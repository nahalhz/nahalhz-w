"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";
import { NODES } from "@/lib/nodes";

function Node({
  position,
  index,
}: {
  position: [number, number, number];
  index: number;
}) {
  const coreRef = useRef<THREE.Mesh>(null);
  const glow1Ref = useRef<THREE.Mesh>(null);
  const glow2Ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!coreRef.current) return;
    const t = state.clock.elapsedTime;
    const pulse = Math.sin(t * 1.8 + index * 0.7) * 0.1 + 1;
    coreRef.current.scale.setScalar(pulse);
  });

  return (
    <group position={position}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.3, 20, 20]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh ref={glow1Ref}>
        <sphereGeometry args={[0.7, 20, 20]} />
        <meshBasicMaterial color="#7ff0ff" transparent opacity={0.4} />
      </mesh>
      <mesh ref={glow2Ref}>
        <sphereGeometry args={[1.4, 20, 20]} />
        <meshBasicMaterial color="#9dc8ff" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

function NodeConnections() {
  const lines = [];
  for (let i = 0; i < NODES.length; i++) {
    for (let j = i + 1; j < NODES.length; j++) {
      if (Math.random() > 0.5) {
        const points = [
          new THREE.Vector3(...NODES[i].position),
          new THREE.Vector3(...NODES[j].position),
        ];
        const geom = new THREE.BufferGeometry().setFromPoints(points);
        lines.push(
          <line key={`${i}-${j}`}>
            <bufferGeometry attach="geometry" {...geom} />
            <lineBasicMaterial
              attach="material"
              color="#9dc8ff"
              transparent
              opacity={0.22}
            />
          </line>
        );
      }
    }
  }
  return <>{lines}</>;
}

function SceneContent() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.0012;
  });

  return (
    <group ref={groupRef}>
      {NODES.map((node, i) => (
        <Node key={node.id} position={node.position} index={i} />
      ))}
      <NodeConnections />
    </group>
  );
}

export default function NetworkScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 26], fov: 52 }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["#050814"]} />
      <fog attach="fog" args={["#050814", 18, 38]} />
      <SceneContent />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}