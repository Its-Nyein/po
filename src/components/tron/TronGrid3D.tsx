"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Grid() {
  const gridRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const { geometry, material } = useMemo(() => {
    const points: number[] = [];
    const gridSize = 100;
    const divisions = 50;
    const step = gridSize / divisions;

    for (let i = -divisions / 2; i <= divisions / 2; i++) {
      points.push(-gridSize / 2, 0, i * step);
      points.push(gridSize / 2, 0, i * step);
      points.push(i * step, 0, -gridSize / 2);
      points.push(i * step, 0, gridSize / 2);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3),
    );

    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color("var(--tron)").convertSRGBToLinear(),
      transparent: true,
      opacity: 0.4,
    });

    material.color.setStyle(
      getComputedStyle(document.documentElement)
        .getPropertyValue("--tron")
        .trim() || "#00d4ff",
    );

    return { geometry, material };
  }, []);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = ((state.clock.elapsedTime * 2) % 2) - 1;
    }

    const tronColor =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--tron")
        .trim() || "#00d4ff";
    if (linesRef.current) {
      (linesRef.current.material as THREE.LineBasicMaterial).color.setStyle(
        tronColor,
      );
    }
  });

  return (
    <group
      ref={gridRef}
      rotation={[-Math.PI / 2.5, 0, 0]}
      position={[0, -2, -10]}
    >
      <lineSegments ref={linesRef} geometry={geometry} material={material} />
    </group>
  );
}

function HorizonGlow() {
  const glowRef = useRef<THREE.Mesh>(null);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color("#00d4ff") },
        time: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float time;
        varying vec2 vUv;
        void main() {
          float glow = 1.0 - vUv.y;
          glow = pow(glow, 3.0);
          float pulse = 0.8 + 0.2 * sin(time * 2.0);
          gl_FragColor = vec4(color * glow * pulse, glow * 0.5);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, []);

  useFrame((state) => {
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.time.value = state.clock.elapsedTime;

      const tronColor =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--tron")
          .trim() || "#00d4ff";
      mat.uniforms.color.value.setStyle(tronColor);
    }
  });

  return (
    <mesh ref={glowRef} position={[0, 0, -30]} material={material}>
      <planeGeometry args={[100, 20]} />
    </mesh>
  );
}

const PARTICLE_COUNT = 200;
const PARTICLE_DATA = (() => {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = Math.random() * 20 - 5;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50 - 10;
    sizes[i] = Math.random() * 2 + 0.5;
  }
  return { positions, sizes };
})();

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);

  const { geometry, material } = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(PARTICLE_DATA.positions.slice(), 3),
    );
    geometry.setAttribute(
      "size",
      new THREE.BufferAttribute(PARTICLE_DATA.sizes.slice(), 1),
    );

    const material = new THREE.PointsMaterial({
      size: 0.1,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });

    return { geometry, material };
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;

      const tronColor =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--tron")
          .trim() || "#00d4ff";
      (particlesRef.current.material as THREE.PointsMaterial).color.setStyle(
        tronColor,
      );
    }
  });

  return <points ref={particlesRef} geometry={geometry} material={material} />;
}

interface TronGrid3DProps {
  className?: string;
  showParticles?: boolean;
  showHorizon?: boolean;
}

export function TronGrid3D({
  className = "",
  showParticles = true,
  showHorizon = true,
}: TronGrid3DProps) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      <Canvas
        camera={{ position: [0, 5, 15], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <fog attach="fog" args={["#0a0a0f", 10, 50]} />
        <ambientLight intensity={0.2} />
        <Grid />
        {showHorizon && <HorizonGlow />}
        {showParticles && <FloatingParticles />}
      </Canvas>
    </div>
  );
}
