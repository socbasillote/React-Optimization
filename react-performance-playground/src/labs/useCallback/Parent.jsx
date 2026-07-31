import { useCallback, useState } from "react";
import Child from "./Child";

function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("React");

  console.log("Parent rendered");

  const handleIncrement = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  return (
    <>
      <button onClick={() => setName("Frontend")}>Change Name</button>

      <p>Count: {count}</p>
      <p>Name: {name}</p>

      <Child onIncrement={handleIncrement} />
    </>
  );
}

export default Parent;
