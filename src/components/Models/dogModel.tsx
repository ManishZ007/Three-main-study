import { useGLTF, useAnimations } from "@react-three/drei";
// import { useEffect } from "react";
// import { useLoader } from "@react-three/fiber";
// import { GLTFLoader } from "three/examples/jsm/Addons.js";

export const DogModel = () => {
  // const model = useLoader(GLTFLoader, "./model/dog.glb");
  const model = useGLTF("./model/dog.glb");

  // this is how you check model contain the animations or not
  // console.log(model);

  // to use animation we use useAnimations from drei
  // and we give the model.animations and model.scene
  // and do console.log for checking that is animation variable is working or not
  const animation = useAnimations(model.animations, model.scene);
  console.log(animation);

  // imp do the animation after first render that way use that think in useEffect hook
  // so to pay that you need to call actions and you know the what are the name of the actions
  // that we get from console.log of animation
  // in this case we use Idle and .play() method that use to play the animation
  // and this animation runs in loop
  // useEffect(() => {
  //   animation.actions.Hide?.play();
  // }, []);

  // when you use the 3d model and to some animation so takes some gpu power
  // so the monitoring that we use one library that show stats about gpu
  // library is r3f-pref
  // install :- npm i r3f-perf@6.6
  // and we are use this in canvas directly
  // so go to the App.tsx file and see the implementation

  return (
    <>
      <primitive object={model.scene} />
    </>
  );
};
