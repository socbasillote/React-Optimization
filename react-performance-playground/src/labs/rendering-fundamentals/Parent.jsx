import { useState } from "react";
import Child from "./Child";

function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("React");

  console.log("Parent rendred");

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      <button onClick={() => setName("Frontend")}>Change Name</button>

      <p>Count: {count}</p>
      <p>Name: {name}</p>

      <Child count={count} />
    </>
  );
}

export default Parent;
