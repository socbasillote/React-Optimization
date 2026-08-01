import { useMemo, useState } from "react";

function Cart() {
  const [cart, setCart] = useState(() =>
    Array.from({ length: 10000 }, (_, index) => ({
      id: index,
      name: `Item ${index}`,
      price: Math.floor(Math.random() * 100),
      quantity: 1,
    })),
  );

  const total = useMemo(() => {
    console.log("Calculating total...");

    return cart.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  }, [cart]);

  const [theme, setTheme] = useState("light");

  return (
    <>
      <h1>Total: {total}</h1>
      <button
        onClick={() =>
          setTheme((theme) => (theme === "light" ? "dark" : "light"))
        }
      >
        Toggle Theme
      </button>
    </>
  );
}

export default Cart;
