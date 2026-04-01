# 🎮 React Three Fiber — Study Notes

> A personal study journal covering the basics of **3D rendering in React** using `react-three-fiber`, `@react-three/drei`, and `leva` — all written in **TypeScript**.

---

## 🧰 Tech Stack

| Library              | Purpose                      |
| -------------------- | ---------------------------- |
| `three`              | Core 3D engine               |
| `@react-three/fiber` | React renderer for Three.js  |
| `@react-three/drei`  | Handy helpers & abstractions |
| `leva`               | Debug GUI panel              |
| `TypeScript`         | Type safety throughout       |

---

## 📚 Topics Covered

### 1. 🏗️ Geometries & Materials

The building blocks of any 3D scene. A `<mesh>` always needs two children: a **geometry** (shape) and a **material** (appearance).

```tsx
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";

export const GeometryDemo = () => {
  return (
    <Canvas>
      {/* ✅ Box — default 1x1x1 cube */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        {/*              ↑  ↑  ↑
                       width height depth  */}
        <meshBasicMaterial color="purple" />
      </mesh>

      {/* ✅ Plane — visible from both sides */}
      <mesh position={[-3, 0, 0]}>
        <planeGeometry args={[2, 5]} />
        {/*               ↑  ↑
                        width height  */}
        <meshBasicMaterial color="red" side={THREE.DoubleSide} />
      </mesh>

      {/* ✅ Wireframe mode — see the geometry edges */}
      <mesh position={[3, 0, 0]}>
        <sphereGeometry args={[1, 16, 16]} />
        {/*                ↑   ↑   ↑
                        radius wSeg hSeg  */}
        <meshBasicMaterial color="cyan" wireframe={true} />
      </mesh>

      {/* ✅ meshNormalMaterial — color driven by face normals, no light needed */}
      <mesh position={[0, 2, 0]}>
        <torusGeometry args={[1, 0.3, 16, 100]} />
        <meshNormalMaterial />
      </mesh>
    </Canvas>
  );
};
```

> 💡 `args` maps directly to Three.js constructor arguments — check the [Three.js docs](https://threejs.org/docs/) for the exact order.

---

### 2. 🔧 Custom Geometry

Build your own shape from scratch using `BufferGeometry` and raw vertex positions via `Float32Array`.

```tsx
import * as THREE from "three";
import { useMemo, useRef } from "react";
import type { BufferGeometry } from "three";

// ✅ A custom triangle shape built from scratch
export const CustomTriangle = () => {
  const geoRef = useRef<BufferGeometry>(null);

  // useMemo so vertices are only computed once
  const vertices = useMemo(() => {
    return new Float32Array([
      // x,    y,    z   ← each row is one vertex
      0.0,
      1.0,
      0.0, // top
      -1.0,
      -1.0,
      0.0, // bottom-left
      1.0,
      -1.0,
      0.0, // bottom-right
    ]);
  }, []);

  return (
    <mesh>
      <bufferGeometry ref={geoRef}>
        {/* attach="attributes-position" tells R3F this is vertex position data */}
        <bufferAttribute
          attach="attributes-position"
          array={vertices}
          count={vertices.length / 3} // 3 values per vertex → 3 vertices total
          itemSize={3} // xyz = 3 values each
        />
      </bufferGeometry>
      <meshNormalMaterial side={THREE.DoubleSide} />
    </mesh>
  );
};
```

> 💡 Every 3 numbers in `Float32Array` = one vertex `[x, y, z]`. Three vertices = one triangle face.

---

### 3. 🎥 Scene Helpers

Visual guides to understand 3D space orientation during development.

```tsx
import { Canvas } from "@react-three/fiber";

export const SceneWithHelpers = () => {
  return (
    <Canvas>
      {/* ✅ Axes Helper
          Red   = X axis
          Green = Y axis
          Blue  = Z axis
          args[0] = length of each axis line */}
      <axesHelper args={[5]} />

      {/* ✅ Grid Helper
          args = [size, divisions, centerLineColor, gridColor] */}
      <gridHelper args={[20, 20, "red", "cyan"]} />

      {/* Your scene objects go here */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>
    </Canvas>
  );
};
```

> 💡 Remove helpers before production — they're dev-only visual aids.

---

### 4. 🔄 Animation with `useFrame`

`useFrame` fires **every single rendered frame** (60fps). Use `delta` to keep animations smooth regardless of framerate.

```tsx
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

export const AnimatedBox = () => {
  // ✅ useRef — NOT useState. useState triggers re-render, useRef doesn't.
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    // delta = seconds since last frame (~0.016 at 60fps)
    // Multiplying by delta makes speed framerate-independent

    // ✅ Rotate the box
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 2; // 2 rad/sec on Y
      meshRef.current.rotation.x += delta * 0.5; // 0.5 rad/sec on X
    }

    // ✅ Move camera in a circle using elapsed time
    // state.clock.elapsedTime = total seconds since scene started
    state.camera.position.x = Math.sin(state.clock.elapsedTime) * 5;
    state.camera.position.z = Math.cos(state.clock.elapsedTime) * 5;
    state.camera.lookAt(0, 0, 0); // always point at the center
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshNormalMaterial />
    </mesh>
  );
};
```

> ⚠️ **Never use `useState` for values you update inside `useFrame`** — every state change causes a re-render, breaking the animation loop. Always use `useRef`.

> 💡 `delta` = time since last frame. `state.clock.elapsedTime` = total time since scene start.

---

### 5. 🖱️ Orbit Controls

Gives the user mouse/touch control over the camera — drag to rotate, scroll to zoom.

```tsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei"; // ✅ Drei version (recommended)

// ❌ OLD WAY — manual setup, verbose
// import { extend, useThree } from "@react-three/fiber";
// import { OrbitControls } from "three/examples/jsm/Addons.js";
// extend({ OrbitControls });
// const { gl, camera } = useThree();
// <orbitControls args={[camera, gl.domElement]} />

export const SceneWithOrbit = () => {
  return (
    <Canvas camera={{ position: [3, 3, 3] }}>
      {/* ✅ Just drop it in — Drei handles all the Three.js wiring */}
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        autoRotate={false} // set true for automatic spin
        autoRotateSpeed={1.0} // speed when autoRotate is on
        minDistance={2} // how close the camera can zoom in
        maxDistance={20} // how far out the camera can zoom
      />

      <mesh>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>

      <gridHelper args={[10, 10]} />
      <axesHelper args={[3]} />
    </Canvas>
  );
};
```

---

### 6. 🖼️ Textures with `useLoader`

Apply real images as textures onto any material using `useLoader` + `THREE.TextureLoader`.

```tsx
import { useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

const TexturedMesh = () => {
  // ✅ useLoader suspends the component until the image is ready
  // "./" prefix means the file lives inside the /public folder
  const colorMap = useLoader(THREE.TextureLoader, "./img/simpleImg.png");

  // ✅ Load multiple textures at once using an array
  // const [colorMap, normalMap] = useLoader(THREE.TextureLoader, [
  //   "./img/color.png",
  //   "./img/normal.png",
  // ]);

  return (
    <>
      <OrbitControls />

      {/* ✅ Plane with image texture */}
      <mesh>
        <planeGeometry args={[4, 4]} />
        <meshBasicMaterial
          side={THREE.DoubleSide}
          map={colorMap} // ← this is where texture connects to material
        />
      </mesh>

      {/* ✅ Box with the same texture wrapped around it */}
      <mesh position={[5, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshBasicMaterial map={colorMap} />
      </mesh>
    </>
  );
};

// ✅ Wrap with <Suspense> — useLoader is async and needs a fallback
export const TextureScene = () => (
  <Canvas>
    <Suspense fallback={null}>
      <TexturedMesh />
    </Suspense>
  </Canvas>
);
```

> 💡 `useLoader` uses React Suspense under the hood. Always wrap the component that calls it with `<Suspense fallback={...}>` in the parent.

---

### 7. ✨ Particles

Render thousands of points efficiently using `BufferGeometry` + `<points>` instead of individual meshes.

```tsx
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Points } from "three";

const PARTICLE_COUNT = 5000;

export const Particles = () => {
  const pointsRef = useRef<Points>(null);

  // ✅ Generate random positions once with useMemo (not on every render)
  const positions = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3); // x, y, z per particle

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 20; // x → spread across -10 to 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20; // z
    }

    return pos;
  }, []);

  // ✅ Slowly rotate the entire particle system each frame
  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    // <points> = THREE.Points — renders geometry as individual dots
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={PARTICLE_COUNT}
          itemSize={3} // x, y, z = 3 values per point
        />
      </bufferGeometry>

      {/* pointsMaterial controls how each dot looks */}
      <pointsMaterial
        size={0.05}
        color="white"
        sizeAttenuation={true} // dots shrink as they get farther away
        transparent={true}
        opacity={0.8}
      />
    </points>
  );
};
```

> 💡 Never use individual `<mesh>` for thousands of objects — use `<points>` + `BufferGeometry` for a massive performance gain.

---

### 8. 🤖 Loading 3D Models

Load `.glb` / `.gltf` models exported from Blender, Sketchfab, etc.

```tsx
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

// ✅ Separate component for the model — needed because useGLTF is async
const Model = () => {
  // Path is relative to the /public folder
  const { scene } = useGLTF("./models/myModel.glb");

  return (
    <primitive
      object={scene}
      position={[0, 0, 0]}
      scale={[1, 1, 1]} // scale up/down if model is too big or small
      rotation={[0, Math.PI, 0]} // rotate if the model faces the wrong direction
    />
  );
};

// ✅ Preload the model before the component mounts (reduces loading delay)
useGLTF.preload("./models/myModel.glb");

export const ThreeDModelScene = () => {
  return (
    <Canvas camera={{ position: [0, 2, 5] }}>
      <OrbitControls />

      {/* ⚠️ Lights are required! meshStandardMaterial (from Blender) is black without them */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* ✅ Suspense shows fallback null while the .glb file downloads */}
      <Suspense fallback={null}>
        <Model />
      </Suspense>
    </Canvas>
  );
};
```

> ⚠️ Models exported from Blender use `meshStandardMaterial` (PBR). This material needs lights — without `<ambientLight>` or `<directionalLight>` the model will appear completely black.

---

### 9. 🎛️ Debug GUI with `leva`

`leva` creates a live control panel to tweak values in real-time — no more hardcoding and re-saving to find the right number.

```bash
npm install leva
```

```tsx
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useControls, folder, button } from "leva";

export const LevaExample = () => {
  // ✅ useControls returns live-updating values bound to the Leva panel
  const { color, wireframe, posX, posY, posZ, rotSpeed, metalness, roughness } =
    useControls({
      // 🎨 Color picker — pass a hex string as the default
      color: "#7c3aed",

      // ✅ Toggle / checkbox
      wireframe: false,

      // 📁 folder() groups related controls together in the panel
      Position: folder({
        posX: { value: 0, min: -5, max: 5, step: 0.1 },
        posY: { value: 0, min: -5, max: 5, step: 0.1 },
        posZ: { value: 0, min: -5, max: 5, step: 0.1 },
      }),

      Animation: folder({
        rotSpeed: {
          value: 1,
          min: 0,
          max: 5,
          step: 0.1,
          label: "Rotation Speed",
        },
      }),

      Material: folder({
        metalness: { value: 0.5, min: 0, max: 1, step: 0.01 },
        roughness: { value: 0.5, min: 0, max: 1, step: 0.01 },
      }),

      // ✅ Button control — runs a function when clicked
      Reset: button(() => console.log("reset clicked")),
    });

  return (
    <Canvas>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />

      {/* ✅ All values update live as you drag sliders in the panel */}
      <mesh position={[posX, posY, posZ]}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial
          color={color}
          wireframe={wireframe}
          metalness={metalness}
          roughness={roughness}
        />
      </mesh>
    </Canvas>
  );
};
```

**Common `leva` control types at a glance:**

| Control         | Syntax                                    | Panel Widget        |
| --------------- | ----------------------------------------- | ------------------- |
| Number slider   | `{ value: 1, min: 0, max: 5, step: 0.1 }` | Draggable range     |
| Color picker    | `"#ff0000"`                               | Color swatch        |
| Toggle          | `false`                                   | Checkbox            |
| Select dropdown | `{ value: "a", options: ["a","b","c"] }`  | Dropdown            |
| Vector3         | `{ value: [0, 0, 0] }`                    | XYZ inputs          |
| Button          | `button(() => doSomething())`             | Clickable button    |
| Grouped         | `folder({ ... })`                         | Collapsible section |

> 📖 Full docs and all control types → [github.com/pmndrs/leva](https://github.com/pmndrs/leva)

---

## 🗂️ Project Structure (Summary)

```
src/
├── components/
│   ├── Scene.tsx          # Main scene — OrbitControls, useFrame, mesh animation
│   ├── Custom.tsx         # Custom geometry component
│   ├── Particles.tsx      # Particle system
│   ├── ThreeDModel.tsx    # 3D model loader
│   └── LevaExample.tsx    # Leva debug GUI demo
└── App.tsx                # Canvas setup with R3F <Canvas>

public/
├── img/                   # Textures (referenced as "./img/...")
└── models/                # GLTF/GLB files (referenced as "./models/...")
```

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

---

## 📌 Key Takeaways

- 🔁 Use `useRef` for animation values, **not** `useState`
- 📐 `args` order matches Three.js constructor docs — always verify there
- 🧹 Prefer `@react-three/drei` helpers over manual Three.js wiring
- ⏱️ Use `delta` in `useFrame` for smooth, framerate-independent animations
- 💡 Models need lights — `meshStandardMaterial` is invisible without them
- ⚡ Use `<points>` + `BufferGeometry` for particles — never individual meshes
- 🌀 Wrap async things (`useLoader`, `useGLTF`) with `<Suspense>`
- 🛠️ Use `leva` early — it saves massive time finding the right values

---

_Study in progress — more topics coming soon_ 🌱
