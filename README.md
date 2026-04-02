# 🎮 fiber-forge

> A personal study repo covering core **React Three Fiber** concepts — from basic geometry to 3D model animations — built entirely in **TypeScript**.

---

## 🧰 Tech Stack

| Library | Purpose |
|---|---|
| `three` | Core 3D engine |
| `@react-three/fiber` | React renderer for Three.js |
| `@react-three/drei` | Handy helpers (`OrbitControls`, `useGLTF`, `useAnimations`) |
| `leva` | Live debug GUI panel |
| `r3f-perf` | GPU/performance monitor |
| `TypeScript` | Full type safety |

---

## 🗂️ Project Structure

```
src/
├── App.tsx                        # Canvas setup — camera, antiAlias, r3f-perf
├── components/
│   ├── Scene.tsx                  # Main scene entry — switches between all studies
│   ├── Custome.tsx                # Custom buffer geometry from scratch
│   ├── LevaExample.tsx            # Leva debug GUI demo
│   ├── MouseUse.tsx               # Mouse & pointer events (raycasting)
│   ├── Particle.tsx               # Particle system with texture + animation
│   ├── ThreeDModel.tsx            # 3D model loader with Suspense fallback
│   └── Models/
│       ├── Bike.tsx               # gltfjsx-generated component, individual mesh animation
│       └── dogModel.tsx           # GLTF model with animation playback

public/
├── img/                           # Textures (referenced as "./img/...")
└── model/                         # GLTF/GLB files (referenced as "./model/...")
```

---

## 📚 Concepts Covered

### 1. 🏗️ Canvas Setup — `App.tsx`

The `<Canvas>` is the root of every R3F scene. Configured with camera options and WebGL settings.

```tsx
import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";

function App() {
  return (
    <Canvas
      // orthographic  ← uncomment for isometric-style camera
      gl={{
        antialias: true,  // smooth edges (false = see jagged steps)
        alpha: true,      // transparent background (false = black)
      }}
      camera={{
        fov: 75,    // field of view
        near: 0.1,  // closest visible distance
        far: 100,   // farthest visible distance
        // zoom: 127,           // use with orthographic
        // position: [2, 3, 4], // starting camera position
      }}
    >
      <Scene />

      {/* Performance monitor — shows GPU/CPU usage */}
      {/* position can be: "top-left" | "top-right" | "bottom-left" | "bottom-right" */}
      <Perf position="top-left" />
    </Canvas>
  );
}
```

> 💡 `r3f-perf` is only needed during development to catch performance issues — remove before production.

---

### 2. 🔷 Mesh, Geometry & Material — `Scene.tsx`

Every visible object in R3F is a `<mesh>` — it always needs a **geometry** (shape) and a **material** (appearance).

```tsx
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

export const Scene = () => {
  return (
    <>
      <OrbitControls />

      {/* Plane visible from both sides */}
      <mesh position={[-2, 0, 0]}>
        <planeGeometry args={[2, 5]} />
        {/*               ↑  ↑
                        width height — args map to Three.js constructor params */}
        <meshBasicMaterial color="red" side={THREE.DoubleSide} />
      </mesh>

      {/* Box with wireframe */}
      <mesh position={[2, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="purple" wireframe={true} />
      </mesh>

      {/* meshNormalMaterial — color driven by face normals, no light needed */}
      <mesh>
        <torusKnotGeometry />
        <meshNormalMaterial />
      </mesh>
    </>
  );
};
```

> 💡 `args` order matches the Three.js constructor docs exactly — always check there for geometry parameters.

---

### 3. 🔧 Custom Geometry — `Custome.tsx`

Build a shape from scratch using a raw `Float32Array` of vertex positions fed into a `<bufferGeometry>`.

```tsx
import * as THREE from "three";

export const Custom = () => {
  // Every 3 values = one vertex [x, y, z]
  // 9 values = 3 vertices = 1 triangle face
  const positionArray = new Float32Array([
    0, 0, 0,  // vertex 1 — bottom left
    0, 1, 0,  // vertex 2 — top
    1, 0, 0,  // vertex 3 — bottom right
  ]);

  return (
    <mesh>
      <bufferGeometry>
        {/* attach="attributes-position" tells R3F this array is vertex position data */}
        <bufferAttribute
          attach="attributes-position"
          count={3}             // 3 vertices
          itemSize={3}          // 3 values per vertex (x, y, z)
          array={positionArray}
        />
      </bufferGeometry>
      <meshBasicMaterial color="purple" side={THREE.DoubleSide} />
    </mesh>
  );
};

// Steps to create custom geometry:
// 1. Create a Float32Array with vertex positions
// 2. Put values in the array (every 3 = one vertex)
// 3. Create a bufferAttribute using the Float32Array
// 4. Attach bufferAttribute to bufferGeometry with attach="attributes-position"
```

---

### 4. 🔄 Animation & `useFrame` — `Scene.tsx`

`useFrame` runs a callback on every rendered frame. Use `delta` for framerate-independent animation.

```tsx
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Mesh } from "three";

export const AnimatedScene = () => {
  // ✅ useRef — NOT useState
  // useState inside useFrame causes an infinite re-render loop
  const cubeRef = useRef<Mesh>(null);
  const planRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    // delta = seconds since last frame (~0.016 at 60fps)
    // multiplying by delta keeps speed consistent at any framerate

    if (cubeRef.current) {
      cubeRef.current.rotation.y += delta * 2;
    }

    if (planRef.current) {
      planRef.current.rotation.z += delta * 2;
      planRef.current.rotation.y += delta * 2;
    }

    // state gives access to camera, clock, renderer and more
    // here we move the camera along a sine wave over time
    state.camera.position.x = Math.sin(state.clock.elapsedTime);
  });

  return (
    <>
      <mesh ref={planRef} position={[-2, 0, 0]}>
        <planeGeometry args={[2, 5]} />
        <meshBasicMaterial color="red" />
      </mesh>

      <mesh ref={cubeRef} position={[2, 0, 0]}>
        <boxGeometry />
        <meshBasicMaterial color="purple" />
      </mesh>
    </>
  );
};
```

> ⚠️ **Never use `useState` for values updated in `useFrame`** — it causes re-renders on every frame, completely breaking animation. Always use `useRef`.

> 💡 `state.clock.elapsedTime` = total seconds since scene start. Great for sine/cosine wave motion.

---

### 5. 🖱️ Mouse Events & Raycasting — `MouseUse.tsx`

In plain Three.js you'd need to manually set up a `Raycaster`. R3F handles this automatically — just add event handlers directly to `<mesh>` like regular HTML elements.

```tsx
export const MouseUse = () => {
  const onClickHandler = () => {
    console.log("hello from red");
  };

  return (
    <>
      {/* onClick automatically uses raycasting under the hood */}
      <mesh position={[1, 0, 0]} onClick={onClickHandler}>
        <boxGeometry />
        <meshBasicMaterial color="red" />
      </mesh>

      <mesh position={[-1, 0, 0]}>
        <boxGeometry />
        <meshBasicMaterial color="yellow" />
      </mesh>
    </>
  );
};

// All available pointer events on a mesh:
// onClick          — left click
// onContextMenu    — right click
// onDoubleClick    — double click
// onWheel          — mouse wheel
// onPointerUp      — pointer released
// onPointerDown    — pointer pressed
// onPointerOver    — pointer enters (bubbles)
// onPointerOut     — pointer leaves (bubbles)
// onPointerEnter   — pointer enters (no bubble)
// onPointerLeave   — pointer leaves (no bubble)
// onPointerMove    — pointer moving over mesh
// onPointerMissed  — click that missed all meshes
// onUpdate         — fires when props change

// 📖 Docs: https://r3f.docs.pmnd.rs/api/events
```

> 💡 You don't need to understand raycasting to use events in R3F — it's all wired up automatically behind the scenes.

---

### 6. ✨ Particles — `Particle.tsx`

Render thousands of points efficiently using `<points>` + `<pointsMaterial>`. Uses `useLoader` for a texture and `useFrame` for animation.

```tsx
import { useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export const Particle = () => {
  const particles = useRef<THREE.Mesh>(null);

  // Slowly rotate the entire particle system each frame
  useFrame((state, delta) => {
    if (particles.current) {
      particles.current.rotation.y += delta;
    }
  });

  // Load a texture to use as the particle shape
  const texture = useLoader(THREE.TextureLoader, "./img/simpleImg.png");

  // Generate 2000 random positions (x, y, z per particle = 6000 values)
  const verticesAmount = 2000;
  const positionArray = new Float32Array(verticesAmount * 3);
  for (let i = 0; i < verticesAmount * 3; i++) {
    positionArray[i] = (Math.random() - 0.5) * 10.0; // spread in -5 to 5 range
  }

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positionArray.length} // total values / 3 = point count
          itemSize={3}                 // x, y, z
          array={positionArray}
        />
      </bufferGeometry>

      <pointsMaterial
        size={0.02}
        map={texture}
        transparent
        depthTest={false}  // prevents particles behind others from being culled
        // alphaMap only renders white parts of the texture, ignoring black
      />
    </points>
  );
};

// Key concept:
// - Use <points> tag (not <mesh>) for particle systems
// - Use <pointsMaterial> (not meshBasicMaterial)
// - Switching <points> → <mesh> will make all particles disappear
```

---

### 7. 🎛️ Debug GUI — `LevaExample.tsx`

`leva` adds a live control panel to the page for tweaking mesh values in real-time — no more hardcoding and re-saving to find the right number.

```bash
npm install leva
```

```tsx
import { button, useControls } from "leva";

export const LevaExample = () => {
  // First argument to useControls is the panel folder name
  const { position, color, doWireFrame, scale } = useControls("Box Geometry", {
    // Vector3 control — gives X, Y, Z sliders
    position: {
      value: { x: 0, y: 0, z: 0 },
      min: -10,
      max: 10,
    },

    // Color picker — pass a hex string as the default
    color: "#ffffff",

    // Toggle / checkbox
    doWireFrame: false,

    // Button — runs a function when clicked
    click: button(() => {
      console.log("hello my iam click");
    }),

    // Dropdown select — options array
    scale: {
      options: [1, 2, 3, 4],
    },
  });

  // Multiple panels — just call useControls again with a different name
  const sphereTweak = useControls("sphere", {
    XRotation: 0,
  });

  return (
    <mesh position={[position.x, position.y, position.z]} scale={scale}>
      <boxGeometry />
      <meshBasicMaterial color={color} wireframe={doWireFrame} />
    </mesh>
  );
};
```

**All `leva` control types:**

| Control | Syntax | Panel Widget |
|---|---|---|
| Number slider | `{ value: 1, min: 0, max: 5, step: 0.1 }` | Draggable range |
| Color | `"#ff0000"` | Color swatch |
| Toggle | `false` | Checkbox |
| Dropdown | `{ options: [1, 2, 3] }` | Select menu |
| Vector3 | `{ value: { x:0, y:0, z:0 } }` | XYZ inputs |
| Button | `button(() => fn())` | Clickable button |
| Grouped | Call `useControls("name", {...})` again | Separate panel |

> 📖 Full docs → [github.com/pmndrs/leva](https://github.com/pmndrs/leva)

---

### 8. 🤖 3D Model Loading — `ThreeDModel.tsx` + `Models/`

Three approaches to loading 3D models, from basic to advanced.

#### Basic — `useLoader` + `GLTFLoader`
```tsx
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

const model = useLoader(GLTFLoader, "./model/dog.glb");

// Render using the special <primitive> tag
<primitive object={model.scene} />
```

#### Better — `useGLTF` from Drei (used in `dogModel.tsx`)
```tsx
import { useGLTF, useAnimations } from "@react-three/drei";
import { useEffect } from "react";

export const DogModel = () => {
  const model = useGLTF("./model/dog.glb");

  // useAnimations hooks into the model's built-in animation clips
  const animation = useAnimations(model.animations, model.scene);

  // Play animation after first render using useEffect
  // animation.actions contains all named clips from the .glb file
  useEffect(() => {
    animation.actions.Show?.play(); // "Show" is the clip name from the model
  }, []);

  return <primitive object={model.scene} />;
};
```

#### Best — `gltfjsx` generated component (used in `Bike.tsx`)

This tool converts a `.glb`/`.gltf` file into a full React component where every mesh is individually accessible.

```bash
# Run from inside the folder containing your model file
npx gltfjsx@6.5.3 bike.gltf -t   # -t flag = TypeScript output
```

This generates a `.tsx` file with every mesh typed and named — letting you attach `ref`s and animate individual parts:

```tsx
// Individual mesh refs for animating specific parts
const frontOuterMesh = useRef<THREE.Mesh>(null);
const backInnerMesh  = useRef<THREE.Mesh>(null);

useFrame((state, delta) => {
  // Spin just the front wheel independently
  if (frontOuterMesh.current) {
    frontOuterMesh.current.rotation.y -= delta;
  }
});

// Then in JSX, attach the ref to the specific mesh node:
<mesh ref={frontOuterMesh} geometry={nodes.Torus002.geometry} material={materials.Pneu} />
```

#### Lazy loading with `<Suspense>` — `ThreeDModel.tsx`
```tsx
import { Suspense } from "react";

export const ThreeDModel = () => {
  return (
    <>
      {/* Models use meshStandardMaterial — lights are required! */}
      <ambientLight intensity={2} />
      <directionalLight />

      {/* Suspense shows a fallback while the .glb file is downloading */}
      <Suspense
        fallback={
          // Show a wireframe box while the real model loads
          <mesh scale-y={2}>
            <boxGeometry />
            <meshBasicMaterial wireframe={true} />
          </mesh>
        }
      >
        <DogModel />
      </Suspense>
    </>
  );
};
```

> ⚠️ Models from Blender use `meshStandardMaterial` — they appear **completely black** without lights. Always add `<ambientLight>` and `<directionalLight>`.

> 💡 To check if a model has animations: `console.log(model)` and look for the `animations` key in the output.

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

---

## 📌 Key Takeaways

- 🔁 Use `useRef` for animation values — **never `useState`** inside `useFrame`
- 📐 `args` order matches Three.js constructor docs — always verify there
- 🖱️ R3F handles raycasting automatically — add events directly on `<mesh>`
- ⚡ Use `<points>` + `BufferGeometry` for particles — never individual meshes
- 💡 PBR models need lights — `meshStandardMaterial` is invisible without them
- 🌀 Wrap async loaders (`useGLTF`, `useLoader`) in `<Suspense>`
- 🛠️ Use `leva` early — saves massive time finding the right values
- 🎬 Use `gltfjsx` to convert models into components for per-mesh control
- 📊 Use `r3f-perf` to monitor GPU usage during development

---

*Study in progress — more topics coming soon* 🌱
