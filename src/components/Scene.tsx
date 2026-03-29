import { OrbitControls } from "@react-three/drei";
import { ThreeDModel } from "./ThreeDModel";

export const Scene = () => {
  return (
    <>
      <OrbitControls />
      <ThreeDModel />
    </>
  );
};

// ****************************************************************
// important one
// create Custom Geometry see Custom component

// import * as THREE from "three";
// import { useFrame } from "@react-three/fiber";
// // import {extend} from "@react-three/fiber"
// import { useRef } from "react";
// import type { Mesh } from "three";
// // import { OrbitControls } from "three/examples/jsm/Addons.js";
// import { OrbitControls } from "@react-three/drei";

// // the most important thing is use orbit control in your scene so we use
// // OrbitControl and extend from three so that we use this camera rotation properly
// // how to use check it

// // the 1st one is tech name that we use in jsm
// // but we not directly use that in jsx we need 1st object and then domElement
// // so we get this way using useThree hook from fiber
// // to avoid this extend thing use @rect-three/drei library and import OrbitControl
// // extend({ OrbitControls });

// export const Scene = () => {
//   // now we are doing some animation on that mesh for that we use
//   // useFrame hook from react-three-fiber

//   //   now that animate is printed on each frame
//   //   useFrame(() => {
//   //     console.log("animate");
//   //   });

//   // do not use useState hook inside this component cause when we use that this particular
//   // think rerender again and again
//   // so we use useRef hook for that

//   //   give the type if you are using typescript
//   const cubeRef = useRef<Mesh>(null);
//   const planRef = useRef<Mesh>(null);

//   //   this is the use of useThree hook and we get as we want
//   //   if you are not using drei OrbitControl then you need this one thing
//   //   const { gl, camera } = useThree();

//   //   if you know the concept of time that help then use delta
//   useFrame((state, delta) => {
//     // if (cubeRef.current) {
//     //   cubeRef.current.rotation.y += delta * 2;
//     // }
//     // if (planRef.current) {
//     //   planRef.current.rotation.z += delta * 2;
//     //   planRef.current.rotation.y += delta * 2;
//     // }

//     // the state is use for modify the camera thing and many more thing

//     state.camera.position.x = Math.sin(state.clock.elapsedTime);
//   });

//   return (
//     <>
//       {/* so using that gl.domElement as a domElement and camera as a object we use args */}
//       {/* <orbitControls args={[camera, gl.domElement]} /> */}
//       {/* use this drei way */}
//       <OrbitControls />
//       <mesh ref={planRef} position={[-2, 0, 0]}>
//         <planeGeometry args={[2, 5]} />
//         <meshBasicMaterial color="red" side={THREE.DoubleSide} />
//       </mesh>

//       <mesh ref={cubeRef} position={[2, 0, 0]}>
//         <boxGeometry />
//         <meshBasicMaterial color="purple" />
//       </mesh>
//     </>
//   );
// };

// ****************************************************************
// // important things 1....
// // {/* <mesh>
// //   {/* by changing the dimension of any geometry we use args property and then in
// //         array we assign the values like below */}

// //   {/*       1. width
// //             2. hight
// //             ** and you want more thing go to the three.js
// //             docs and see the any geometry arguments and there order */}

// //   <planeGeometry args={[2, 5]} />

// //   {/* and if you want to change the color of the material and any part of it
// //       then there is simple direct property are define over there like this */}
// //   <meshBasicMaterial color="red" wireframe={true} />
// // </mesh> */}

// ****************************************************************
// Scenes

// {/* this way we add the axes helper in any where in object but they must be children one */}
//       {/* this is way we increase the length of the axes using args property*/}
//       {/* <axesHelper args={[3]} /> */}
//       {/* and this is an grid helper that is use for checking the bonder of visible project */}
//       {/*
//         args are
//         1. size  -> 20
//         2. division -> 20
//         3. color center line -> red
//         4. grid color -> cyan

//       */}
//       {/* <gridHelper args={[20, 20, "red", "cyan"]} /> */}
//       <mesh position={[0, 0, -10]}>
//         <boxGeometry />
//         <meshNormalMaterial />
//       </mesh>

//       <mesh>
//         <boxGeometry />
//         <meshNormalMaterial />
//       </mesh>

//       <Custom />

// ****************************************************************
// useLoader use

//  // this is how we use useLoader class and we need texture
//   // so that we get from THREE.TextureLoader
//   // and 2nd argument is image path when we do ./ we are in public folder
//   // then we access the inside folder and image
//   const texture = useLoader(THREE.TextureLoader, "./img/simpleImg.png");

//   return (
//     <>
//       <OrbitControls />
//       {/* useLoader from three that help to add texture on material */}
//       <mesh>
//         <planeGeometry args={[4, 4]} />
//         {/* once you get image in texture variable the map with material */}
//         <meshBasicMaterial side={THREE.DoubleSide} map={texture} />
//       </mesh>
//     </>
//   );

// ****************************************************************
// Particles
// for that see the Particles container
// import this and read the inside docs for understanding what is particles

// {
//   /* <Particle /> */
// }

// ****************************************************************
// now loading the 3d model in Scene that is the one of the most important thing we are
// doing here

// see the ThreeDModel container
// that container contain all the imp things that
// is use for loading 3d model in Scene
