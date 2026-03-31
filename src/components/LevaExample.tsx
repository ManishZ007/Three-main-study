import { useControls } from "leva";

export const LevaExample = () => {
  const levaControls = useControls({
    XPosition: {
      value: 0,
      min: -10,
      max: 10,
    },
  });

  return (
    <>
      <mesh position-x={levaControls.XPosition}>
        <boxGeometry />
        <meshBasicMaterial color="orange" />
      </mesh>
    </>
  );
};

// now we use the useControls from leva so that useControls use to creating the penal
// that contain all the things that we want to set
// like we provide XPosition and many more things
// look into the levaControls object we use all the thing on XPosition array
// value :- starting value
// min :- minimum value
// max :- maximum value
// steps :- how the increase by that provided value

// and look how we use that in attribute of mesh
