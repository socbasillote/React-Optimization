import { selectCartTotal } from "./cart";

function Checkout({ cart }) {
  const total = selectCartTotal(cart);

  return (
    <>
      <h2>Checkout</h2>

      <p>Total: ${total}</p>
    </>
  );
}
export default Checkout;
