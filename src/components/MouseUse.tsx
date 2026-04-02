export const MouseUse = () => {
  const onClickHandler = () => {
    console.log("hello from red");
  };

  return (
    <>
      <mesh position={[1, 0, 0]} onClick={onClickHandler}>
        <boxGeometry />
        <meshBasicMaterial color={"red"} />
      </mesh>

      <mesh position={[-1, 0, 0]}>
        <boxGeometry />
        <meshBasicMaterial color={"yellow"} />
      </mesh>
    </>
  );
};

// so in this example we create the two box side by side
// and for using the mouse event we use onClick function inside the mesh tag so
// that will be directly call the raycasting features
// and in that onClick function we create the one onClickHandler that handle the click event

// eg : -

//  const onClickHandler = () => {
//    console.log("hello from red");
//  };
{
  /* <mesh position={[1, 0, 0]} onClick={onClickHandler}>
  <boxGeometry />
  <meshBasicMaterial color={"red"} />
</mesh>; */
}

// this is the simple one we did
// but know i need to change color when we click the mesh like one toggler effect

// here we simply say that this are the some important events that we use in the project
{
  /* <mesh
  onClick={(e) => console.log("click")}
  onContextMenu={(e) => console.log("context menu")}
  onDoubleClick={(e) => console.log("double click")}
  onWheel={(e) => console.log("wheel spins")}
  onPointerUp={(e) => console.log("up")}
  onPointerDown={(e) => console.log("down")}
  onPointerOver={(e) => console.log("over")}
  onPointerOut={(e) => console.log("out")}
  onPointerEnter={(e) => console.log("enter")} // see note 1
  onPointerLeave={(e) => console.log("leave")} // see note 1
  onPointerMove={(e) => console.log("move")}
  onPointerMissed={() => console.log("missed")}
  onUpdate={(self) => console.log("props have been updated")}
/>; */
}
// this are some thinks that we use in that
// docs link :- https://r3f.docs.pmnd.rs/api/events
