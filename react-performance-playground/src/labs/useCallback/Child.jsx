import { memo } from "react";

function Child({ onIncrement }) {
  console.log("Child rendered");

  return (
    <div>
      <h3>Child Component</h3>

      <button onClick={onIncrement}>Increment from Child</button>
    </div>
  );
}

export default memo(Child);
