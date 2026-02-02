"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";

// ============================================
// TEXTURE HELPERS
// ============================================
function createTextTexture(
  text: string,
  fontSize: number,
  color: string,
  width: number = 512,
  height: number = 128
): THREE.CanvasTexture | null {
  if (typeof window === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, width, height);
  ctx.font = `800 ${fontSize}px "Courier New", monospace`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function createGridTexture(size = 512, divisions = 16): THREE.CanvasTexture | null {
  if (typeof window === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#f5f3ef";
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = "#d7d2cb";
  ctx.lineWidth = 2;

  const step = size / divisions;
  for (let i = 0; i <= divisions; i += 1) {
    const pos = i * step;
    ctx.beginPath();
    ctx.moveTo(pos, 0);
    ctx.lineTo(pos, size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, pos);
    ctx.lineTo(size, pos);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.needsUpdate = true;
  return texture;
}

function createSvgPatternTexture(repeat = 2): THREE.Texture | null {
  if (typeof window === "undefined") return null;

  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'>
    <rect width='120' height='120' fill='#f3f0eb'/>
    <path d='M10 10H110V110H10Z' fill='none' stroke='#d8d3cd' stroke-width='2'/>
    <path d='M10 60H110' stroke='#e4e0da' stroke-width='1'/>
    <path d='M60 10V110' stroke='#e4e0da' stroke-width='1'/>
  </svg>`;

  const url = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  const texture = new THREE.TextureLoader().load(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat, repeat);
  texture.anisotropy = 8;
  return texture;
}

// ============================================
// SHADER: PORTAL GLOW
// ============================================
const portalVertex = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const portalFragment = `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;

  float ring(vec2 uv, float radius, float width) {
    float dist = length(uv);
    return smoothstep(radius + width, radius, dist) - smoothstep(radius, radius - width, dist);
  }

  void main() {
    vec2 uv = vUv - 0.5;
    float dist = length(uv);

    float pulse = 0.6 + 0.4 * sin(uTime * 2.0 + dist * 12.0);
    float glow = smoothstep(0.6, 0.0, dist);
    float r1 = ring(uv, 0.28 + 0.04 * sin(uTime * 1.3), 0.05);
    float r2 = ring(uv, 0.42 + 0.03 * cos(uTime * 1.7), 0.06);
    float streak = abs(sin((uv.x + uv.y) * 12.0 + uTime * 2.0)) * 0.15;

    vec3 color = uColor * (glow * pulse + r1 + r2 + streak);
    float alpha = smoothstep(0.7, 0.2, dist);

    gl_FragColor = vec4(color, alpha);
  }
`;

// ============================================
// MAIN STUDIO SHELL + GLOBAL ELEMENTS
// ============================================
function StudioFloor() {
  const gridTex = useMemo(() => createGridTexture(), []);

  return (
    <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial
        color="#f5f3ef"
        map={gridTex}
        roughness={0.95}
        metalness={0.05}
      />
    </mesh>
  );
}

function StudioWall() {
  const titleTex = useMemo(() => createTextTexture("MZML", 140, "#1a1a1a"), []);
  const subtitleTex = useMemo(
    () => createTextTexture("DIGITAL STUDIO", 48, "#26538d"),
    []
  );
  const wallTex = useMemo(() => createSvgPatternTexture(3), []);

  return (
    <group position={[0, -0.2, -10]}>
      <mesh receiveShadow>
        <boxGeometry args={[18, 6, 0.4]} />
        <meshStandardMaterial
          color="#f6f1ea"
          map={wallTex}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>
      <mesh position={[0, 0.6, 0.21]}>
        <planeGeometry args={[8, 2]} />
        <meshBasicMaterial map={titleTex} transparent />
      </mesh>
      <mesh position={[0, -0.8, 0.21]}>
        <planeGeometry args={[6, 1]} />
        <meshBasicMaterial map={subtitleTex} transparent />
      </mesh>
      <mesh position={[0, -1.6, 0.22]}>
        <boxGeometry args={[6, 0.08, 0.02]} />
        <meshBasicMaterial color="#26538d" />
      </mesh>
    </group>
  );
}

function CeilingLights() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 10;

  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i += 1) {
      dummy.position.set(-10 + i * 2.2, 3.2, -2);
      dummy.scale.set(1, 0.2, 0.6);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as THREE.MeshStandardMaterial;
    material.emissiveIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 2.0) * 0.15;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.8, 0.1, 0.4]} />
      <meshStandardMaterial
        color="#efe9e2"
        emissive="#cfd8ff"
        emissiveIntensity={0.8}
        roughness={0.4}
      />
    </instancedMesh>
  );
}

// ============================================
// ROOM SHELL + PORTAL
// ============================================
function PortalDoor({
  label,
  color,
  onHover,
  onClick,
}: {
  label: string;
  color: string;
  onHover?: (state: boolean) => void;
  onClick: () => void;
}) {
  const shaderRef = useRef<THREE.ShaderMaterial>(null);
  const labelTex = useMemo(() => createTextTexture(label, 36, "#ffffff"), [label]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
    }),
    [color]
  );

  useFrame((state) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <group
      position={[0, 0.6, 0.9]}
      onPointerOver={() => onHover?.(true)}
      onPointerOut={() => onHover?.(false)}
      onClick={onClick}
    >
      <mesh castShadow>
        <boxGeometry args={[1.4, 2.2, 0.18]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0, 0.11]}>
        <planeGeometry args={[1.1, 1.8]} />
        <shaderMaterial
          ref={shaderRef}
          uniforms={uniforms}
          vertexShader={portalVertex}
          fragmentShader={portalFragment}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, -1.25, 0.11]}>
        <planeGeometry args={[1.4, 0.35]} />
        <meshBasicMaterial map={labelTex} transparent />
      </mesh>
    </group>
  );
}

function RoomShell({
  title,
  accent,
  children,
  position,
  onNavigate,
  onHoverChange,
}: {
  title: string;
  accent: string;
  children?: React.ReactNode;
  position: [number, number, number];
  onNavigate: () => void;
  onHoverChange: (zone: string | null) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const accentMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const wallTex = useMemo(() => createSvgPatternTexture(2), []);
  const titleTex = useMemo(() => createTextTexture(title, 48, "#1a1a1a"), [title]);

  useFrame(() => {
    if (!accentMaterialRef.current) return;
    accentMaterialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
      accentMaterialRef.current.emissiveIntensity || 0,
      hovered ? 0.6 : 0.2,
      0.1
    );
  });

  return (
    <group
      position={position}
      onPointerEnter={() => {
        setHovered(true);
        onHoverChange(title);
      }}
      onPointerLeave={() => {
        setHovered(false);
        onHoverChange(null);
      }}
    >
      {/* Floor */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[4, 0.2, 3.2]} />
        <meshStandardMaterial color="#f3efe9" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 1.2, -1.5]} receiveShadow>
        <boxGeometry args={[4, 2.4, 0.2]} />
        <meshStandardMaterial
          color="#f8f4ef"
          map={wallTex}
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>

      {/* Side walls */}
      <mesh position={[-2, 1.0, 0]} receiveShadow>
        <boxGeometry args={[0.2, 2.0, 3.2]} />
        <meshStandardMaterial color="#f4efe8" roughness={0.8} />
      </mesh>
      <mesh position={[2, 1.0, 0]} receiveShadow>
        <boxGeometry args={[0.2, 2.0, 3.2]} />
        <meshStandardMaterial color="#f4efe8" roughness={0.8} />
      </mesh>

      {/* Title plate */}
      <mesh position={[0, 2.1, -1.35]}>
        <planeGeometry args={[2.6, 0.5]} />
        <meshBasicMaterial map={titleTex} transparent />
      </mesh>

      {/* Accent rail */}
      <mesh position={[0, 0.3, -1.35]}>
        <boxGeometry args={[2.8, 0.06, 0.06]} />
        <meshStandardMaterial
          ref={accentMaterialRef}
          color={accent}
          emissive={new THREE.Color(accent)}
          emissiveIntensity={0.2}
          roughness={0.3}
          metalness={0.6}
        />
      </mesh>

      {/* Portal */}
      <PortalDoor
        label={title}
        color={accent}
        onHover={(state) => {
          document.body.style.cursor = state ? "pointer" : "auto";
        }}
        onClick={onNavigate}
      />

      {/* Content */}
      <group position={[0, 0.2, 0]}>{children}</group>
    </group>
  );
}

// ============================================
// ROOM CONTENTS
// ============================================
function ServicesContent() {
  const services: { icon: string; label: string; pos: [number, number, number] }[] = [
    { icon: "💻", label: "Web Dev", pos: [-1.2, 0.6, 0.2] },
    { icon: "📱", label: "Mobile", pos: [0, 0.9, 0.6] },
    { icon: "🎨", label: "UI/UX", pos: [1.2, 0.6, 0.2] },
    { icon: "⚙️", label: "Software", pos: [-0.6, 0.2, -0.5] },
    { icon: "☁️", label: "Cloud", pos: [0.6, 0.2, -0.5] },
  ];

  return (
    <>
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[1.1, 1.1, 0.2, 32]} />
        <meshStandardMaterial color="#1a3a5c" roughness={0.3} metalness={0.5} />
      </mesh>
      {services.map((svc, i) => (
        <FloatingServiceIcon
          key={svc.label}
          position={svc.pos}
          icon={svc.icon}
          label={svc.label}
          delay={i * 0.5}
        />
      ))}
    </>
  );
}

function FloatingServiceIcon({
  position,
  icon,
  label,
  delay,
}: {
  position: [number, number, number];
  icon: string;
  label: string;
  delay: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const iconTex = useMemo(() => createTextTexture(icon, 70, "#ffffff"), [icon]);
  const labelTex = useMemo(() => createTextTexture(label, 28, "#f0ffff"), [label]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 2 + delay) * 0.12;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.5 + delay;
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial color="#26538d" roughness={0.2} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.36]}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshBasicMaterial map={iconTex} transparent />
      </mesh>
      <mesh position={[0, -0.65, 0]}>
        <planeGeometry args={[1.1, 0.28]} />
        <meshBasicMaterial map={labelTex} transparent />
      </mesh>
    </group>
  );
}

function CaseStudiesContent() {
  const projects = [
    { name: "LurnRyte", type: "EdTech", color: "#ff6b6b" },
    { name: "E-Commerce", type: "Retail", color: "#4ecdc4" },
    { name: "Portfolio", type: "Design", color: "#ffe66d" },
  ];

  return (
    <group position={[0, 0.2, 0]}>
      {projects.map((proj, i) => (
        <ProjectCard
          key={proj.name}
          position={[Math.cos(i * 2.1) * 1.1, 0.7 + i * 0.25, Math.sin(i * 2.1) * 0.9]}
          project={proj}
          delay={i}
        />
      ))}
    </group>
  );
}

function ProjectCard({
  position,
  project,
  delay,
}: {
  position: [number, number, number];
  project: { name: string; type: string; color: string };
  delay: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const nameTex = useMemo(() => createTextTexture(project.name, 36, "#ffffff"), [project.name]);
  const typeTex = useMemo(() => createTextTexture(project.type, 24, "#f0ffff"), [project.type]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime + delay) * 0.08;
    meshRef.current.rotation.y += 0.005;
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[1.1, 0.75, 0.12]} />
        <meshStandardMaterial color={project.color} roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.1, 0.08]}>
        <planeGeometry args={[0.9, 0.28]} />
        <meshBasicMaterial map={nameTex} transparent />
      </mesh>
      <mesh position={[0, -0.2, 0.08]}>
        <planeGeometry args={[0.7, 0.2]} />
        <meshBasicMaterial map={typeTex} transparent />
      </mesh>
    </group>
  );
}

function LabsContent() {
  return (
    <>
      <LabBeaker position={[-0.8, 0.4, 0.3]} color="#ff6b6b" />
      <LabBeaker position={[0.1, 0.8, -0.2]} color="#4ecdc4" />
      <LabBeaker position={[0.9, 0.5, 0.4]} color="#ffe66d" />

      <FloatingFormula position={[-1.1, 1.3, 0]} text="AI" />
      <FloatingFormula position={[1.1, 1.5, 0.5]} text="ML" />
      <FloatingFormula position={[0, 1.7, -0.5]} text="IoT" />
    </>
  );
}

function LabBeaker({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    meshRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
  });

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <cylinderGeometry args={[0.25, 0.3, 0.6, 16]} />
      <meshPhysicalMaterial
        color={color}
        roughness={0.1}
        metalness={0.2}
        transmission={0.6}
        thickness={0.4}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

function FloatingFormula({ position, text }: { position: [number, number, number]; text: string }) {
  const tex = useMemo(() => createTextTexture(text, 48, "#ffffff"), [text]);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    meshRef.current.lookAt(0, 5, 10);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[0.8, 0.4]} />
      <meshBasicMaterial map={tex} transparent />
    </mesh>
  );
}

function StoriesContent() {
  return (
    <>
      <StoryBook position={[-0.6, 0.3, 0]} color="#ff6b6b" title="Case 1" />
      <StoryBook position={[0.6, 0.5, 0.2]} color="#4ecdc4" title="Case 2" />
      <StoryBook position={[0, 0.85, -0.1]} color="#ffe66d" title="Case 3" />
    </>
  );
}

function StoryBook({
  position,
  color,
  title,
}: {
  position: [number, number, number];
  color: string;
  title: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const titleTex = useMemo(() => createTextTexture(title, 28, "#ffffff"), [title]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    meshRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.03;
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[0.8, 0.12, 1.1]} />
        <meshStandardMaterial color={color} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.6, 0.1]} />
        <meshBasicMaterial map={titleTex} transparent />
      </mesh>
    </group>
  );
}

function ContactContent() {
  return (
    <>
      <ContactIcon position={[-0.6, 0.7, 0]} icon="✉️" label="Email" />
      <ContactIcon position={[0.6, 0.7, 0]} icon="📞" label="Call" />
      <ContactIcon position={[0, 1.2, 0.3]} icon="💬" label="Chat" />
    </>
  );
}

function ContactIcon({
  position,
  icon,
  label,
}: {
  position: [number, number, number];
  icon: string;
  label: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const iconTex = useMemo(() => createTextTexture(icon, 56, "#ffffff"), [icon]);
  const labelTex = useMemo(() => createTextTexture(label, 24, "#f0ffff"), [label]);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.08;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[0.33, 32, 32]} />
        <meshStandardMaterial color="#1a3a5c" roughness={0.2} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.36]}>
        <planeGeometry args={[0.4, 0.4]} />
        <meshBasicMaterial map={iconTex} transparent />
      </mesh>
      <mesh position={[0, -0.58, 0]}>
        <planeGeometry args={[0.8, 0.22]} />
        <meshBasicMaterial map={labelTex} transparent />
      </mesh>
    </group>
  );
}

function StudioHub() {
  const ringRef = useRef<THREE.Mesh>(null);
  const badgeTex = useMemo(() => createTextTexture("MZML", 48, "#ffffff"), []);

  useFrame((state) => {
    if (!ringRef.current) return;
    ringRef.current.rotation.z = state.clock.elapsedTime * 0.3;
  });

  return (
    <group position={[0, -1.2, -1]}>
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[2.5, 2.5, 0.2, 64]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.6} />
      </mesh>
      <mesh ref={ringRef} position={[0, 0.55, 0]}>
        <torusGeometry args={[1.2, 0.05, 16, 100]} />
        <meshStandardMaterial color="#26538d" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <planeGeometry args={[1.4, 0.6]} />
        <meshBasicMaterial map={badgeTex} transparent />
      </mesh>
    </group>
  );
}

// ============================================
// LIGHTS + POSTPROCESSING
// ============================================
function StudioLights() {
  useEffect(() => {
    RectAreaLightUniformsLib.init();
  }, []);

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[6, 10, 6]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-6, 5, -5]} intensity={0.5} color="#26538d" />
      <pointLight position={[6, 5, 5]} intensity={0.4} color="#1a3a5c" />
      <spotLight position={[0, 8, 2]} angle={0.6} penumbra={0.5} intensity={0.8} />
      <rectAreaLight
        position={[0, 3, -6]}
        width={6}
        height={2}
        intensity={5}
        color="#ffffff"
        lookAt={[0, 1, -10]}
      />
    </>
  );
}

function StudioPostProcessing() {
  const { gl, scene, camera, size } = useThree();
  const composerRef = useRef<EffectComposer | null>(null);

  useEffect(() => {
    const composer = new EffectComposer(gl);
    composer.addPass(new RenderPass(scene, camera));

    const bloom = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      0.6,
      0.5,
      0.85
    );
    composer.addPass(bloom);

    composer.setSize(size.width, size.height);
    composer.setPixelRatio(gl.getPixelRatio());
    composerRef.current = composer;

    return () => {
      composer.dispose();
    };
  }, [gl, scene, camera]);

  useEffect(() => {
    if (!composerRef.current) return;
    composerRef.current.setSize(size.width, size.height);
    composerRef.current.setPixelRatio(gl.getPixelRatio());
  }, [size, gl]);

  useFrame(() => {
    composerRef.current?.render();
  }, 1);

  return null;
}

// ============================================
// MAIN COMPONENT
// ============================================
export function Interactive3DHero() {
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);

  return (
    <section className="relative h-screen w-full bg-[#faf9f6]">
      <Canvas
        camera={{ position: [0, 2.2, 12], fov: 50 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <StudioLights />
        <StudioPostProcessing />
        <OrbitControls
          enablePan={false}
          enableZoom
          enableRotate
          minDistance={9}
          maxDistance={16}
          maxPolarAngle={Math.PI / 2.1}
          minPolarAngle={Math.PI / 3}
        />

        <StudioFloor />
        <StudioWall />
        <CeilingLights />
        <StudioHub />

        <RoomShell
          title="SERVICES"
          accent="#26538d"
          position={[-6, -1.6, -2]}
          onNavigate={() =>
            document.querySelector("#services")?.scrollIntoView({ behavior: "smooth" })
          }
          onHoverChange={setHoveredZone}
        >
          <ServicesContent />
        </RoomShell>

        <RoomShell
          title="CASE STUDIES"
          accent="#1a3a5c"
          position={[6, -1.6, -2]}
          onNavigate={() =>
            document.querySelector("#showcases")?.scrollIntoView({ behavior: "smooth" })
          }
          onHoverChange={setHoveredZone}
        >
          <CaseStudiesContent />
        </RoomShell>

        <RoomShell
          title="LABS"
          accent="#4ecdc4"
          position={[-6, -1.6, 3]}
          onNavigate={() =>
            document.querySelector("#who-we-are")?.scrollIntoView({ behavior: "smooth" })
          }
          onHoverChange={setHoveredZone}
        >
          <LabsContent />
        </RoomShell>

        <RoomShell
          title="STORIES"
          accent="#ffe66d"
          position={[6, -1.6, 3]}
          onNavigate={() =>
            document.querySelector("#stories")?.scrollIntoView({ behavior: "smooth" })
          }
          onHoverChange={setHoveredZone}
        >
          <StoriesContent />
        </RoomShell>

        <RoomShell
          title="CONTACT"
          accent="#ff6b6b"
          position={[0, -1.6, 6.2]}
          onNavigate={() =>
            document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
          }
          onHoverChange={setHoveredZone}
        >
          <ContactContent />
        </RoomShell>
      </Canvas>

      {/* Bottom navigation */}
      <div className="absolute bottom-6 left-0 right-0 z-10 px-4">
        <div className="flex justify-center flex-wrap gap-2">
          {["SERVICES", "SHOWCASES", "LABS", "STORIES", "CONTACT"].map((zone) => (
            <button
              key={zone}
              onClick={() => {
                const id = zone === "LABS" ? "#who-we-are" : `#${zone.toLowerCase()}`;
                document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-3 py-1.5 border-2 border-[#1a1a1a] text-[#1a1a1a] font-mono text-xs uppercase tracking-wider hover:border-[#26538d] hover:text-[#26538d] transition-all bg-[#faf9f6]"
            >
              {zone}
            </button>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute top-24 left-4 z-10">
        <div className="bg-[#faf9f6] border-4 border-[#26538d] p-4 shadow-lg">
          <p className="font-mono text-xs text-[#1a1a1a] uppercase tracking-wider mb-2">
            Navigation
          </p>
          <p className="font-typewriter text-sm text-[#26538d]">
            Hover rooms to preview
          </p>
          <p className="font-typewriter text-sm text-[#26538d]">Click portals to jump</p>
        </div>
      </div>

      {/* Hover badge */}
      <div className="absolute top-24 right-4 z-10">
        <div className="bg-[#1a1a1a] text-[#faf9f6] border-2 border-[#26538d] px-4 py-2 shadow-lg">
          <p className="font-mono text-xs uppercase tracking-wider">
            {hoveredZone ? `Exploring: ${hoveredZone}` : "Explore the Studio"}
          </p>
        </div>
      </div>
    </section>
  );
}
