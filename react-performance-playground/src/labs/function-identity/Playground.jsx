import { useState } from "react";

function Playground() {
  const [count, setCount] = useState(0);

  const fnA = () => {};
  const fnB = () => {};

  const sharedFn = () => {};

  const fnC = sharedFn;
  const fnD = sharedFn;

  return (
    <>
      <button onClick={() => setCount((c) => c + 1)}>
        Re-render ({count})
      </button>

      <h3>Different Functions</h3>

      <p>{String(fnA === fnB)}</p>

      <h3>Shared Function</h3>

      <p>{String(fnC === fnD)}</p>
    </>
  );
}

export default Playground;
