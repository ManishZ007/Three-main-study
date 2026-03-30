import { Suspense } from "react";

// import { BikeModel } from "./Models/Bike";
import { DogModel } from "./Models/dogModel";

export const ThreeDModel = () => {
  return (
    <>
      <ambientLight intensity={2} />
      <directionalLight />
      <Suspense
        fallback={
          <mesh scale-y={2}>
            <boxGeometry />
            <meshBasicMaterial wireframe={true} />
          </mesh>
        }
      >
        {/* <BikeModel scale={0.95} position={[-0.5, 0.75, 0]} /> */}

        <DogModel />
      </Suspense>
    </>
  );
};

// docs

// 1. we import the useLoader for loading the GLTF
// 2. we import the GLTFLoader that we use in useLoader Three hook
// 3. then we create one model const that contain useLoader
// that useLoader contain GLTFLoader as a 1st and second path of model
// imp if your using glb, gltf file then use GLTFLoader otherwise look the documentation
// 4. to add the model in scene we use special tag called <primitive /> tag
// 5. and adding the model in that we use object attribute in primitive tag
// 6. and model variable and .scene that we did in object attribute
// imp when any model comes that come's with meshStandardMaterial so we need a light to see that model properly
// 7. we did light thing latter but now see that ambientLight tag that give a light to all in the scene just like a sun-light

//*****************************************************
// now we understand what is lazy loading
// the lazy loading use for when
// some model is big in size and that take lots of time to load we do not give a bad experience about aur website
// so that we use tha lazy loading thing that make aur website experience better

// so to use the lazy loading we use <suspense> tag
// so import the main model from different component Models->dogModel
// and add in Scene now we import Suspense from react
// and the we wrap the DogModel component with Suspense
// now the main thing i want to show something until the model is not gone a fully load
// so that thing we add in fallback attribute in Suspense
// so we add one bog that render before the heavy model

// *******************************************************
// now we learn the most imp thing that is help to load the model just not as a model
// but as a Component it self
// 1. install the model as a gld or gltf file in user public -> model folder
// 2. then open the terminal of point that model folder
// 3. then write this command
// cmd --> npx gltfjsx <--filename--> like bike.gltf
//  it take some time  depends on model and if asking any permission then say yes

// once that complete there is jsx file is created if you are using tsx file then convert that jsx -> tsx and move that file to your Components -> Model folder
// use this cmd -> npx gltfjsx@6.5.3 bike.gltf -t
// that creates the proper tsx file you just need to change the inside model path

// now just move the file to the main Model folder and render the model in Scene

// Adv:-
// by doing this way we targeting the mesh individually and doing different operation on that
// go to the BikeModel and see what i did

// now imp thing how to display the model animation using dogModel
// if you want to check is any model contain the animation or not
// just console.log() that model and i that object you can see there is one animation key that
// contain all the animation you want

// for understanding go to the DogModel and see the code and learn
