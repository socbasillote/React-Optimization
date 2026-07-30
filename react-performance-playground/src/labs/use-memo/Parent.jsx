import { useMemo, useState } from "react";
import Child from "./Child";

function Parent() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("React");

  const data = useMemo(() => {
    return {
      count,
    };
  }, [count]);

  console.log("Parent rendred");

  return (
    <>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      <button onClick={() => setName("Frontend")}>Change Name</button>

      <p>Count: {data.count}</p>
      <p>Name: {name}</p>

      <Child data={data} />
    </>
  );
}

export default Parent;
