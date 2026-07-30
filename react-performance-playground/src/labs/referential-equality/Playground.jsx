import { useState } from "react";

function Playground() {
  const [value, setValue] = useState(0);

  const primitiveA = 1;
  const primitiveB = 1;

  const sharedObject = { value: 1 };

  const objectA = { value: 1 };
  const objectB = { value: 1 };

  const objectC = sharedObject;
  const objectD = sharedObject;

  return (
    <>
      <button onClick={() => setValue((v) => v + 1)}>
        Re-render ({value})
      </button>

      <h3>Primitive Comparison</h3>

      <p>{String(primitiveA === primitiveB)}</p>

      <h3>Object Comparison</h3>

      <p>{String(objectA === objectB)}</p>

      <h3>Shared Object</h3>

      <p>{String(objectC === objectD)}</p>

      <h3>Created During Render</h3>

      <p>Every click creates a brand new object.</p>

      <pre>{`const renderObject = {
  value: 1,
};`}</pre>
    </>
  );
}

export default Playground;
