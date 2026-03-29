import { useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

// when you use this Particle class in side the Scene there is snow effect going to render
export const Particle = () => {
  const particles = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (particles.current) {
      particles.current.rotation.y += delta;
    }
  });

  // so now we use texture on this and create one simple project that look like snow fall
  const texture = useLoader(THREE.TextureLoader, "./img/simpleImg.png");

  const verticesAmount = 2000;
  const positionArray = new Float32Array(verticesAmount * 3);

  for (let i = 0; i < verticesAmount * 3; i++) {
    positionArray[i] = (Math.random() - 0.5) * 10.0;
  }

  return (
    <>
      <points ref={particles}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positionArray.length}
            itemSize={3}
            array={positionArray}
          />
        </bufferGeometry>
        {/* the alphaMap attribute only show the white part of
         image and ignore that black part */}
        <pointsMaterial
          size={0.02}
          map={texture}
          transparent
          depthTest={false}
        />
      </points>
    </>
  );
};

// 1.
//  // for using particles we use point material and points tag
//     // and if we change that points tag to mesh tag the points will be gone
//     // in sort we create any geometry in points way with points tag and PointMaterial
//     <points>
//       <sphereGeometry />
//       <PointMaterial size={0.02}  />
//     </points>
