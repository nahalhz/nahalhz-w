"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { NODES, type NodeData } from "@/lib/nodes";
import ParticleCloud from "./ParticleCloud";

function Node({ node, index }: { node: NodeData; index: number }) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const glow1Ref = useRef<THREE.Mesh>(null);
  const glow2Ref = useRef<THREE.Mesh>(null);
  const glow3Ref = useRef<THREE.Mesh>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useFrame((state) => {
    if (!coreRef.current || !glow1Ref.current || !glow2Ref.current || !glow3Ref.current) return;
    const t = state.clock.elapsedTime;

    // Pulsing driver
    const corePulse = Math.sin(t * 1.3 + index * 0.7) * 0.08 + 1;
    const hoverScale = hovered ? 1.4 : 1;

    // Pulse progress: 0 at trough, 1 at peak
    const pulsePhase = (Math.sin(t * 1.3 + index * 0.7) + 1) / 2;
    // Ease it so warm state only shows near the peak
    const warmth = Math.pow(pulsePhase, 2.2);

    // Depth-based prominence
    if (groupRef.current) {
      const worldPos = new THREE.Vector3();
      groupRef.current.getWorldPosition(worldPos);
      const distance = worldPos.distanceTo(state.camera.position);

      const depthFactor = Math.max(0.8, Math.min(1.15, (33 - distance) / 10 + 0.65));
      const isInFront = distance < 26;
      const frontBoost = isInFront ? 1.1 : 1.0;

      // Scales (pulse + hover + front-boost)
      coreRef.current.scale.setScalar(corePulse * hoverScale * frontBoost);

      const glow1Pulse = Math.sin(t * 1.3 + index * 0.7 - 0.3) * 0.08 + 1;
      const glow2Pulse = Math.sin(t * 1.3 + index * 0.7 - 0.6) * 0.1 + 1;
      const glow3Pulse = Math.sin(t * 1.3 + index * 0.7 - 0.9) * 0.12 + 1;
      glow1Ref.current.scale.setScalar(glow1Pulse * hoverScale * frontBoost);
      glow2Ref.current.scale.setScalar(glow2Pulse * hoverScale * frontBoost);
      glow3Ref.current.scale.setScalar(glow3Pulse * hoverScale * frontBoost);

      // Opacity (front boost + warmth pulse brightening)
      const opacityMult = isInFront ? 1.2 : depthFactor;
      // Glows brighten with warmth — up to +35% at peak
      const warmthBoost = 1 + warmth * 0.35;
      (glow1Ref.current.material as THREE.MeshBasicMaterial).opacity = 0.55 * opacityMult * warmthBoost;
      (glow2Ref.current.material as THREE.MeshBasicMaterial).opacity = 0.22 * opacityMult * warmthBoost;
      (glow3Ref.current.material as THREE.MeshBasicMaterial).opacity = 0.1 * opacityMult * warmthBoost;

      // Warm color blending — lerp from cool to warm based on pulse phase
      const glow1Mat = glow1Ref.current.material as THREE.MeshBasicMaterial;
      const glow2Mat = glow2Ref.current.material as THREE.MeshBasicMaterial;
      const glow3Mat = glow3Ref.current.material as THREE.MeshBasicMaterial;
      const coreMat = coreRef.current.material as THREE.MeshBasicMaterial;

      const cool1 = new THREE.Color("#7ff0ff");
      const warm1 = new THREE.Color("#b8f5d4");  // inner halo: cyan shifted warm → warm mint
      const cool2 = new THREE.Color("#5a9eff");
      const warm2 = new THREE.Color("#c499e6");  // mid glow: light blue shifted warm → warm lavender
      const cool3 = new THREE.Color("#2a5eb8");
      const warm3 = new THREE.Color("#7a4a9e");  // outer aura: deep blue shifted warm → warm deep purple
      const coolCore = new THREE.Color(isInFront ? "#ffffff" : "#d5f0ff");
      const warmCore = new THREE.Color("#ffe8b3");  // core: bright warm cream (stays the "flash" focal point)

      glow1Mat.color.copy(cool1).lerp(warm1, warmth);
      glow2Mat.color.copy(cool2).lerp(warm2, warmth);
      glow3Mat.color.copy(cool3).lerp(warm3, warmth);
      coreMat.color.copy(coolCore).lerp(warmCore, warmth * 0.8);

      // Label
      if (labelRef.current) {
        const baseScale = Math.max(0.6, Math.min(1.4, (32 - distance) / 8 + 0.5));
        const finalScale = hovered ? baseScale * 1.2 : baseScale;
        labelRef.current.style.transform = `scale(${finalScale})`;
        const labelOpacity = hovered ? 1 : isInFront ? 0.95 : 0.6;
        labelRef.current.style.opacity = String(labelOpacity);
        labelRef.current.style.color = isInFront
          ? "rgba(255, 255, 255, 0.95)"
          : "rgba(230, 242, 255, 0.8)";
      }
    }
  });

  return (
    <group
      ref={groupRef}
      position={node.position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "default";
      }}
      onClick={(e) => {
        e.stopPropagation();
        router.push(node.route);
      }}
    >
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.3, 20, 20]} />
        <meshBasicMaterial color="#d5f0ff" />
      </mesh>
      <mesh ref={glow1Ref}>
        <sphereGeometry args={[0.7, 20, 20]} />
        <meshBasicMaterial color="#7ff0ff" transparent opacity={0.55} depthWrite={false} />
      </mesh>
      <mesh ref={glow2Ref}>
        <sphereGeometry args={[1.4, 20, 20]} />
        <meshBasicMaterial color="#5a9eff" transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <mesh ref={glow3Ref}>
        <sphereGeometry args={[2.3, 20, 20]} />
        <meshBasicMaterial color="#2a5eb8" transparent opacity={0.1} depthWrite={false} />
      </mesh>

      <Html
        position={[1.3, 0.2, 0]}
        center={false}
        zIndexRange={[0, 10]}
        style={{
          pointerEvents: "none",
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
      >
        <div
          ref={labelRef}
          style={{
            fontFamily: "var(--font-jetbrains-mono), ui-monospace, monospace",
            fontSize: "18px",
            fontWeight: 500,
            letterSpacing: "0.01em",
            color: "rgba(230, 242, 255, 0.85)",
            textShadow: "0 0 14px rgba(127, 240, 255, 0.3)",
            transformOrigin: "left center",
            transition: "transform 80ms linear, opacity 80ms linear, color 200ms linear",
          }}
        >
          {node.title}
        </div>
      </Html>
    </group>
  );
}

function NodeConnections() {
  const lines = [];
  for (let i = 0; i < NODES.length; i++) {
    for (let j = i + 1; j < NODES.length; j++) {
      if (Math.random() > 0.45) {
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
              opacity={0.3}
            />
          </line>
        );
      }
    }
  }
  return <>{lines}</>;
}

function SceneContent() {
  const nodesGroupRef = useRef<THREE.Group>(null);
  const particlesGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (nodesGroupRef.current) {
      nodesGroupRef.current.rotation.y += 0.0006;
      nodesGroupRef.current.rotation.x = Math.sin(t * 0.15) * 0.1;
    }
    if (particlesGroupRef.current) {
      particlesGroupRef.current.rotation.y -= 0.00025;
      particlesGroupRef.current.rotation.x = Math.sin(t * 0.08) * 0.05;
    }
  });

  return (
    <>
      <group ref={particlesGroupRef}>
        <ParticleCloud />
      </group>
      <group ref={nodesGroupRef}>
        {NODES.map((node, i) => (
          <Node key={node.id} node={node} index={i} />
        ))}
        <NodeConnections />
      </group>
    </>
  );
}

export default function NetworkScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 26], fov: 52 }}
      gl={{ antialias: true, alpha: true }}
    >
      <fog attach="fog" args={["#050814", 18, 38]} />
      <SceneContent />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}