function Child({ count }) {
  console.log("Child rendered");
  return (
    <div>
      <h3>Child Component</h3>
      <p>Received count: {count}</p>
    </div>
  );
}

export default Child;
