import * as THREE from "three";

export const Custom = () => {
  const positionArray = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]);

  return (
    <mesh>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={3}
          itemSize={3}
          array={positionArray}
        />
      </bufferGeometry>
      <meshBasicMaterial color="purple" side={THREE.DoubleSide} />
    </mesh>
  );
};

// 1. Create a Float32Array
// 2. put a values in the array
// 3. create a BufferAttribute using the Float32Array
// 4. add the BufferAttribute to the attributes of BufferGeometry
