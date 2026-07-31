import { selectCartTotal } from "./cart";

function CartSummary({ cart }) {
  const total = selectCartTotal(cart);

  return <p>Total: ${total}</p>;
}

export default CartSummary;
