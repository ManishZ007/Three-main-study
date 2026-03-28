import { Canvas } from "@react-three/fiber";
import { Scene } from "./components/Scene";

// create geometry
// then create material
// after that create one mesh with that geometry and material at last
// add in to the scene

// 2. now if we want multiple object at once then we need to use Group
// then we add two mesh in that group and
// add that group in scene
// when we move the group all mesh inside the group also move

function App() {
  return (
    // if we use the orthographic camera the size of the object lock same
    <>
      <Canvas
        // orthographic
        gl={{
          // if we do this antialias false we can the steps
          // on edges
          antialias: false,
          // when the alpha property is true the background will be transparent
          // otherwise if we turn it into false the background color are going to black
          alpha: true,
        }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 100,
          // for using orthographic we need zoom property
          // zoom: 127,
          position: [2, 3, 4],
        }}
      >
        <Scene />
      </Canvas>
    </>
  );
}

// important points
// {/* <Canvas>
// {/* this is how we create group class in react-three-fiber */}
// {/* now we try to move the group */}

// <group position={0}>
//   {/* this is who we create the mesh first in react-three-fiber */}

//   {/* and rotating the mesh we use rotation */}

//   <mesh position-x={-2} rotation-x={Math.PI * 0.5}>
//     {/* then first we gave one geometry */}
//     <torusKnotGeometry />

//     {/* after geometry we give material */}
//     <meshNormalMaterial />
//   </mesh>

//   {/* this below mesh is above to this upper mesh so move we use position attribute in below one*/}

//   {/* first one is x axis second one is y axis and last one is z */}

//   {/*  and if we want to scale up i do with scale property and if we only give one value
//       whiteout any [] in {} so that single value apply to the all 3 axis */}

//   <mesh position={[2, 0, 0]} scale={1.5}>
//     {/* then first we gave one geometry */}
//     <torusKnotGeometry />
//     {/* after geometry we give material */}
//     <meshNormalMaterial />
//   </mesh>
// </group>
// </Canvas>
//  */}

export default App;
