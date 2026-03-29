import { useGLTF } from "@react-three/drei";
// import { useLoader } from "@react-three/fiber";
// import { GLTFLoader } from "three/examples/jsm/Addons.js";

export const DogModel = () => {
  // const model = useLoader(GLTFLoader, "./model/dog.glb");
  const model = useGLTF("./model/dog.glb");

  return (
    <>
      <primitive object={model.scene} />
    </>
  );
};
