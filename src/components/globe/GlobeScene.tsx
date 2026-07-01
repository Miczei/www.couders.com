"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line, Html } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import {
  LOCATIONS,
  CONNECTIONS,
  GLOBE_RADIUS,
  latLngToVector3,
  buildArc,
  locationActive,
  arcActive,
  type Region,
} from "./globeData";

const ACTIVE = "#eaf1ff";
const DIM = "#5566a0";
const ACCENT = "#5b74ff";
const OCEAN = "#070910";
// Land in earth-dark.jpg is ~0 (black); ocean is ~13-16 (grey). Threshold cleanly separates.
const LAND_THRESHOLD = 10;

/** Soft round sprite used for continent dots and node halos. */
function makeGlowTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(210,224,255,0.6)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/** Sample the dark earth map → dot positions on land (continents). */
function useLandDots() {
  const [positions, setPositions] = useState<Float32Array | null>(null);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const W = 520;
      const H = 260;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, W, H);
      const data = ctx.getImageData(0, 0, W, H).data;

      const pts: number[] = [];
      const latStep = 1.3;
      for (let lat = -84; lat <= 84; lat += latStep) {
        const cos = Math.cos((lat * Math.PI) / 180);
        // Equal-area-ish: widen the longitude step toward the poles.
        const lngStep = Math.max(1.3, 1.3 / Math.max(0.06, cos));
        for (let lng = -180; lng < 180; lng += lngStep) {
          const u = (lng + 180) / 360;
          const v = (90 - lat) / 180;
          const x = Math.min(W - 1, (u * W) | 0);
          const y = Math.min(H - 1, (v * H) | 0);
          const idx = (y * W + x) * 4;
          const b = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
          if (b < LAND_THRESHOLD) {
            const jLat = lat + (Math.random() - 0.5) * latStep * 0.55;
            const jLng = lng + (Math.random() - 0.5) * lngStep * 0.55;
            const p = latLngToVector3(jLat, jLng, GLOBE_RADIUS);
            pts.push(p.x, p.y, p.z);
          }
        }
      }
      if (!cancelled) setPositions(new Float32Array(pts));
    };
    img.src = "/textures/earth-dark.jpg";
    return () => {
      cancelled = true;
    };
  }, []);

  return positions;
}

function Continents({ texture }: { texture: THREE.Texture }) {
  const positions = useLandDots();
  if (!positions) return null;
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        size={0.02}
        sizeAttenuation
        transparent
        depthWrite={false}
        opacity={0.82}
        color={"#b9c6f7"}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Backside fresnel shell → thin atmospheric rim. */
function Atmosphere() {
  const uniforms = useMemo(() => ({ uColor: { value: new THREE.Color(ACCENT) } }), []);
  return (
    <mesh scale={1.12}>
      <sphereGeometry args={[GLOBE_RADIUS, 48, 48]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vView = mv.xyz;
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          varying vec3 vNormal;
          varying vec3 vView;
          void main() {
            vec3 viewDir = normalize(-vView);
            float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 4.5);
            gl_FragColor = vec4(uColor, fresnel * 0.5);
          }
        `}
      />
    </mesh>
  );
}

function Node({
  position,
  active,
  label,
  hovered,
  onOver,
  onOut,
  texture,
  earthRef,
  seed,
}: {
  position: THREE.Vector3;
  active: boolean;
  label: string;
  hovered: boolean;
  onOver: () => void;
  onOut: () => void;
  texture: THREE.Texture;
  earthRef: React.RefObject<THREE.Mesh | null>;
  seed: number;
}) {
  const core = useRef<THREE.Mesh>(null);
  const color = active ? ACTIVE : DIM;

  useFrame((state) => {
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2 + seed) * 0.18;
    if (core.current) core.current.scale.setScalar((active ? 1.35 : 0.85) * pulse);
  });

  return (
    <group position={position}>
      <mesh ref={core}>
        <sphereGeometry args={[0.014, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <sprite scale={active ? 0.13 : 0.07}>
        <spriteMaterial
          map={texture}
          color={color}
          transparent
          depthWrite={false}
          opacity={active ? 0.95 : 0.45}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>

      {/* Invisible, larger hit area so the tiny node is easy to hover */}
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          onOver();
        }}
        onPointerOut={() => onOut()}
      >
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Tooltip only on hover; occluded by the globe when on the far side */}
      {hovered && (
        <Html
          occlude={[earthRef as React.RefObject<THREE.Object3D>]}
          zIndexRange={[30, 0]}
          pointerEvents="none"
        >
          <div className="globe-label">{label}</div>
        </Html>
      )}
    </group>
  );
}

function Arc({
  points,
  curve,
  active,
  offset,
}: {
  points: THREE.Vector3[];
  curve: THREE.QuadraticBezierCurve3;
  active: boolean;
  offset: number;
}) {
  const pulse = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!pulse.current) return;
    const t = (state.clock.elapsedTime * 0.22 + offset) % 1;
    pulse.current.position.copy(curve.getPointAt(t));
    (pulse.current.material as THREE.Material).opacity = active ? 1 : 0.2;
  });

  return (
    <group>
      <Line
        points={points}
        color={active ? "#93a6ff" : "#28325a"}
        lineWidth={active ? 1.3 : 0.6}
        transparent
        opacity={active ? 0.85 : 0.28}
        toneMapped={false}
      />
      <mesh ref={pulse}>
        <sphereGeometry args={[0.009, 8, 8]} />
        <meshBasicMaterial color="#dbe6ff" transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

function GlobeGroup({
  region,
  labels,
  texture,
}: {
  region: Region;
  labels: string[];
  texture: THREE.Texture;
}) {
  const earthRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.cursor = hovered ? "pointer" : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  const nodes = useMemo(
    () =>
      LOCATIONS.map((l, i) => ({
        id: l.id,
        label: labels[i] ?? l.id.toUpperCase(),
        pos: latLngToVector3(l.lat, l.lng, GLOBE_RADIUS * 1.012),
        seed: i * 1.7,
      })),
    [labels]
  );

  const arcs = useMemo(() => {
    const posById = new Map(
      LOCATIONS.map((l) => [l.id, latLngToVector3(l.lat, l.lng, GLOBE_RADIUS * 1.012)])
    );
    return CONNECTIONS.map(([a, b], i) => {
      const curve = buildArc(posById.get(a)!, posById.get(b)!);
      return { a, b, curve, points: curve.getPoints(64), offset: i * 0.16 };
    });
  }, []);

  return (
    <group rotation={[0.22, 0, 0.16]}>
      {/* Opaque occluder — clearly smaller than the dot layer so no z-fighting */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[GLOBE_RADIUS * 0.985, 64, 64]} />
        <meshBasicMaterial color={OCEAN} />
      </mesh>

      <Continents texture={texture} />
      <Atmosphere />

      {arcs.map((arc, i) => (
        <Arc
          key={i}
          points={arc.points}
          curve={arc.curve}
          offset={arc.offset}
          active={arcActive(region, arc.a, arc.b)}
        />
      ))}

      {nodes.map((n) => (
        <Node
          key={n.id}
          position={n.pos}
          label={n.label}
          seed={n.seed}
          texture={texture}
          earthRef={earthRef}
          active={locationActive(region, n.id)}
          hovered={hovered === n.id}
          onOver={() => setHovered(n.id)}
          onOut={() => setHovered((h) => (h === n.id ? null : h))}
        />
      ))}
    </group>
  );
}

export default function GlobeScene({
  activeRegion,
  paused,
  labels,
}: {
  activeRegion: Region;
  paused: boolean;
  labels: string[];
}) {
  const texture = useMemo(() => makeGlowTexture(), []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0.25, 3.15], fov: 42, near: 0.1, far: 20 }}
      gl={{ antialias: true, powerPreference: "high-performance", stencil: false }}
      frameloop={paused ? "never" : "always"}
    >
      <color attach="background" args={["#06070b"]} />
      <GlobeGroup region={activeRegion} labels={labels} texture={texture} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        rotateSpeed={0.4}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI * 0.28}
        maxPolarAngle={Math.PI * 0.72}
      />
      <EffectComposer>
        <Bloom
          mipmapBlur
          luminanceThreshold={0.5}
          luminanceSmoothing={0.3}
          intensity={0.85}
          radius={0.6}
        />
      </EffectComposer>
    </Canvas>
  );
}
