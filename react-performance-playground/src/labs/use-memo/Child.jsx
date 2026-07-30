import { memo } from "react";

function Child({ data }) {
  console.log("Child rendered");
  return (
    <div>
      <h3>Child Component</h3>
      <p>Received count: {data.count}</p>
    </div>
  );
}

export default memo(Child);
