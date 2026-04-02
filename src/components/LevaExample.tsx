import { button, useControls } from "leva";

export const LevaExample = () => {
  const { position, color, doWireFrame, scale } = useControls("Box Geometry", {
    position: {
      value: {
        x: 0,
        y: 0,
        z: 0,
      },
      min: -10,
      max: 10,
    },
    color: "#ffffff",
    doWireFrame: false,
    click: button(() => {
      // here you call the event that change the action of the model
      console.log("hello my iam click");
    }),
    scale: {
      options: [1, 2, 3, 4],
    },
  });

  const sphereTweak = useControls("sphere", {
    XRotation: 0,
  });

  return (
    <>
      <mesh position={[position.x, position.y, position.z]} scale={scale}>
        <boxGeometry />
        <meshBasicMaterial color={color} wireframe={doWireFrame} />
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

// we can also use folder that handle different mesh for that we need to give the 1st argument as a name of the folder

// if you want to directly use 3 axis of this mesh so you need to give a 3 axis like we did

// we can add color penal also in this session, it provides the color when you give one color that is the initial color of the
// color session

// like wise we use true and false property in this session that we use in wireframe
// that session provides the check marks

// and we also create the button the and do some operation in that see the click session

// we can also create the selection in the sessions for that we need options that contain
// one array and we specify aur values in that and use it accordingly so for that see the scale session

// so this all the think for only one geometry but you can also cerate multiples session like we cerate sphereTweak
// like this you can add more session in sphereTweak and use it as Box Geometry
