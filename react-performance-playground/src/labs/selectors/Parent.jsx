import { useState } from "react";

import CartSummary from "./CartSummary";
import Checkout from "./Checkout";

function Parent() {
  const [cart, setCart] = useState(() =>
    Array.from({ length: 10000 }, (_, index) => ({
      id: index,
      name: `Item ${index}`,
      price: Math.floor(Math.random() * 100),
      quantity: 1,
    })),
  );
  return (
    <>
      <Checkout cart={cart} />
      <CartSummary cart={cart} />
    </>
  );
}

export default Parent;
