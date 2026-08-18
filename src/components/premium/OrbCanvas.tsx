"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";

/**
 * The assistant as a living surface rather than an icon.
 *
 * An icosahedron whose vertices are pushed along their normals by two octaves
 * of 3D simplex noise: one slow layer for breathing, one fast layer that only
 * wakes up while it is speaking. A fresnel term lights the silhouette, so the
 * thing reads as volume without a single light in the scene — no shadow maps,
 * no environment, one draw call.
 *
 * It also leans toward the cursor. That is the whole trick behind why these
 * feel alive: the surface acknowledges you before you have done anything.
 */

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uSpeak;
  uniform vec3  uPointer;
  varying float vDisp;
  varying vec3  vNormal;
  varying vec3  vView;

  // Ashima 3D simplex noise.
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec3 n = normalize(position);

    // Breathing: always on, slow enough to read as alive rather than busy.
    float calm = snoise(n * 2.1 + vec3(0.0, uTime * 0.14, 0.0));
    // Voice: a tighter, faster band that only exists while speaking.
    float voice = snoise(n * 5.2 + vec3(uTime * 1.5, 0.0, uTime * 0.9));
    // Attention: swells on the side facing the cursor.
    float lean = pow(max(0.0, dot(n, normalize(uPointer))), 2.0);

    float disp = calm * 0.085 + voice * 0.03 + uSpeak * voice * 0.15 + lean * 0.06;

    vec3 p = position + normal * disp;
    vDisp = disp;
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vView = -mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uSky;
  uniform vec3 uTeal;
  uniform float uSpeak;
  varying float vDisp;
  varying vec3  vNormal;
  varying vec3  vView;

  void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vView);

    // Fresnel: the rim carries the whole read of volume here, so it is the one
    // value worth tuning by eye rather than by formula.
    float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.1);

    float t = clamp(vDisp * 2.4 + 0.5, 0.0, 1.0);
    vec3 body = mix(uSky, uTeal, t) * (0.035 + 0.16 * t);
    vec3 rim  = mix(uSky, uTeal, 0.35 + 0.4 * uSpeak);

    vec3 col = body + rim * fres * (1.9 + 1.1 * uSpeak);
    gl_FragColor = vec4(col, 1.0);
  }
`;

function Orb({ speaking }: { speaking: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const cage = useRef<THREE.LineSegments>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSpeak: { value: 0 },
      uPointer: { value: new THREE.Vector3(0, 0, 1) },
      uSky: { value: new THREE.Color("#0EA5E9") },
      uTeal: { value: new THREE.Color("#22E0C8") },
    }),
    [],
  );

  useFrame((state, delta) => {
    const u = uniforms;
    u.uTime.value = state.clock.elapsedTime;

    // Ease toward the target instead of snapping: the point of the speaking
    // state is that you can see it arrive and leave.
    const target = speaking ? 1 : 0;
    u.uSpeak.value += (target - u.uSpeak.value) * Math.min(1, delta * 4.5);

    u.uPointer.value.lerp(
      new THREE.Vector3(state.pointer.x, state.pointer.y, 0.85).normalize(),
      Math.min(1, delta * 3),
    );

    if (mesh.current) mesh.current.rotation.y += delta * 0.09;
    // Counter-rotation on a different axis: two solids turning the same way
    // read as one object, turning against each other they read as a mechanism.
    if (cage.current) {
      cage.current.rotation.y -= delta * 0.05;
      cage.current.rotation.x += delta * 0.03;
    }
    if (mat.current) mat.current.uniformsNeedUpdate = true;
  });

  const props: ThreeElements["mesh"] = { ref: mesh };
  const cageProps: ThreeElements["lineSegments"] = { ref: cage };

  return (
    <group>
      <mesh {...props}>
        <icosahedronGeometry args={[1, 48]} />
        <shaderMaterial
          ref={mat}
          vertexShader={VERT}
          fragmentShader={FRAG}
          uniforms={uniforms}
        />
      </mesh>

      {/* Containment cage. Without it the orb is just a glowing blob; a rigid
          geodesic counter-rotating around soft light is what makes it read as
          something engineered rather than something organic. */}
      <lineSegments {...cageProps} scale={1.42}>
        <edgesGeometry args={[new THREE.IcosahedronGeometry(1, 1)]} />
        <lineBasicMaterial
          color="#22E0C8"
          transparent
          opacity={0.16}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

export default function OrbCanvas({
  speaking,
  still = false,
}: {
  speaking: boolean;
  /** Reduced motion: render one frame and stop the loop entirely. */
  still?: boolean;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.5], fov: 42 }}
      // Retina costs 4x the fragments for a shape this soft-edged; 1.6 is the
      // point past which nobody can tell.
      dpr={[1, 1.6]}
      frameloop={still ? "demand" : "always"}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <Orb speaking={speaking && !still} />
    </Canvas>
  );
}
