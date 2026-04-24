"use client";

import { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

// ── types ──────────────────────────────────────────────────────────────────
type ClusterNode = {
  id: string;
  label: string;
  sublabel: string;
  color: string;
  position: [number, number, number];
  targetSection: string;
};

const NODES: ClusterNode[] = [
  {
    id: "compneuro",
    label: "Computational\nNeuroscience",
    sublabel: "3 projects",
    color: "#67e8f9",
    position: [-2.2, 0.4, 0],
    targetSection: "compneuro",
  },
  {
    id: "robotics",
    label: "Robotics & RL",
    sublabel: "1 project",
    color: "#a78bfa",
    position: [2.2, -0.4, 0],
    targetSection: "robotics",
  },
];

// ── tiny satellite nodes (decorative) ────────────────────────────────────
const SATELLITES = [
  { pos: [-3.2, 1.4, -0.8] as [number, number, number], color: "#67e8f9", r: 0.12 },
  { pos: [-1.0, 1.8, 0.6] as [number, number, number], color: "#67e8f9", r: 0.08 },
  { pos: [-2.8, -1.0, 0.4] as [number, number, number], color: "#67e8f9", r: 0.1 },
  { pos: [1.2, 1.2, -0.6] as [number, number, number], color: "#a78bfa", r: 0.09 },
  { pos: [3.0, 0.6, 0.8] as [number, number, number], color: "#a78bfa", r: 0.11 },
  { pos: [2.6, -1.6, -0.4] as [number, number, number], color: "#a78bfa", r: 0.07 },
  // bridge nodes
  { pos: [0, 0.8, -1.0] as [number, number, number], color: "#818cf8", r: 0.09 },
  { pos: [0.2, -0.6, 0.8] as [number, number, number], color: "#818cf8", r: 0.07 },
];

// ── particles ──────────────────────────────────────────────────────────────
function Particles({ count = 600 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const cyanColor = new THREE.Color("#67e8f9");
    const violetColor = new THREE.Color("#a78bfa");
    const deepBlue = new THREE.Color("#0a1628");

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.0 + Math.random() * 2.8;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      pos[i * 3 + 2] = r * Math.cos(phi);

      const t = Math.random();
      const side = pos[i * 3] < 0 ? cyanColor : violetColor;
      const mixed = new THREE.Color().lerpColors(deepBlue, side, t * 0.7 + 0.1);
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.04;
      mesh.current.rotation.x += delta * 0.015;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} vertexColors transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

// ── synapse connections ────────────────────────────────────────────────────
function Synapses() {
  const lines = useMemo(() => {
    const result: { points: THREE.Vector3[]; color: string; opacity: number }[] = [];
    // node-to-node bridge
    result.push({
      points: [new THREE.Vector3(-2.2, 0.4, 0), new THREE.Vector3(2.2, -0.4, 0)],
      color: "#818cf8",
      opacity: 0.25,
    });
    // node to satellites
    SATELLITES.forEach((sat) => {
      const nearNode = sat.pos[0] < 0 ? NODES[0] : NODES[1];
      result.push({
        points: [
          new THREE.Vector3(...nearNode.position),
          new THREE.Vector3(...sat.pos),
        ],
        color: sat.color,
        opacity: 0.15,
      });
    });
    return result;
  }, []);

  return (
    <>
      {lines.map((line, i) => {
        const geo = new THREE.BufferGeometry().setFromPoints(line.points);
        return (
          <line key={i} geometry={geo}>
            <lineBasicMaterial
              color={line.color}
              transparent
              opacity={line.opacity}
            />
          </line>
        );
      })}
    </>
  );
}

// ── satellite dots ─────────────────────────────────────────────────────────
function SatelliteNodes() {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    meshRefs.current.forEach((m, i) => {
      if (m) m.scale.setScalar(1 + Math.sin(t * 1.2 + i * 0.9) * 0.12);
    });
  });

  return (
    <>
      {SATELLITES.map((sat, i) => (
        <mesh
          key={i}
          position={sat.pos}
          ref={(el) => { meshRefs.current[i] = el; }}
        >
          <sphereGeometry args={[sat.r, 8, 8]} />
          <meshStandardMaterial
            color={sat.color}
            emissive={sat.color}
            emissiveIntensity={0.6}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </>
  );
}

// ── main cluster node ──────────────────────────────────────────────────────
function ClusterNodeMesh({
  node,
  onNavigate,
}: {
  node: ClusterNode;
  onNavigate: (section: string) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * 1.5 + node.position[0]) * 0.06;
    const hover = hovered ? 1.18 : 1;
    meshRef.current.scale.setScalar(pulse * hover);
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = hovered ? 1.4 : 0.8 + Math.sin(t * 1.5) * 0.2;
  });

  const dist = useMemo(() => {
    const pos = new THREE.Vector3(...node.position);
    return pos.distanceTo(camera.position);
  }, [camera.position, node.position]);

  const labelScale = Math.max(0.6, Math.min(1.2, 6 / dist));

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}
        onClick={() => onNavigate(node.targetSection)}
      >
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>

      {/* glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.44, 0.02, 8, 48]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.color}
          emissiveIntensity={hovered ? 1.2 : 0.4}
          transparent
          opacity={0.5}
        />
      </mesh>

      <Html
        center
        position={[0, 0.75, 0]}
        style={{ pointerEvents: "none", transform: `scale(${labelScale})` }}
      >
        <div
          style={{
            textAlign: "center",
            userSelect: "none",
            cursor: "pointer",
            transition: "opacity 0.2s",
            opacity: hovered ? 1 : 0.85,
          }}
        >
          <div
            style={{
              color: node.color,
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              lineHeight: 1.35,
              whiteSpace: "pre-line",
              textShadow: `0 0 12px ${node.color}88`,
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            {node.label}
          </div>
          <div
            style={{
              color: "#94a3b8",
              fontSize: "9px",
              marginTop: "3px",
              letterSpacing: "0.04em",
              fontFamily: "var(--font-mono, monospace)",
            }}
          >
            {node.sublabel}
          </div>
        </div>
      </Html>
    </group>
  );
}

// ── scene inner (with useThree access) ────────────────────────────────────
function SceneInner({ onNavigate }: { onNavigate: (s: string) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const [paused, setPaused] = useState(false);

  useFrame((_, delta) => {
    if (groupRef.current && !paused) {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[-4, 3, 2]} intensity={1.2} color="#67e8f9" />
      <pointLight position={[4, -2, -2]} intensity={1.0} color="#a78bfa" />
      <pointLight position={[0, 0, 4]} intensity={0.5} color="#ffffff" />

      <Particles />

      <group
        ref={groupRef}
        onPointerOver={() => setPaused(true)}
        onPointerOut={() => setPaused(false)}
      >
        <Synapses />
        <SatelliteNodes />
        {NODES.map((node) => (
          <ClusterNodeMesh key={node.id} node={node} onNavigate={onNavigate} />
        ))}
      </group>
    </>
  );
}

// ── exported component ────────────────────────────────────────────────────
export default function ResearchScene({
  onNavigate,
}: {
  onNavigate: (section: string) => void;
}) {
  const handleNavigate = useCallback(
    (section: string) => {
      onNavigate(section);
    },
    [onNavigate]
  );

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 50 }}
      style={{ background: "transparent" }}
      gl={{ antialias: true, alpha: true }}
    >
      <SceneInner onNavigate={handleNavigate} />
    </Canvas>
  );
}