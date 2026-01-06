import Modal from "./UI/Modal";
import { useContext } from "react";
import CartContext from "../store/CartContext";
import { formatCurrency } from "../util.js/formatting";
import Button from "./UI/Button";
import { UserProgressContext } from "../store/UserProgress";
import CartItem from "./CartItem";

export default function Cart() {
  const ctx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const cartTotal = ctx.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  function closeCartHandler() {
    userProgressCtx.hideCart("browsing");
  }
  function handleGoToCheckout() {
    userProgressCtx.showCheckout();
  }

  return (
    <Modal
      className="cart"
      open={userProgressCtx.progress === "cart"}
      onClose={userProgressCtx.progress === "cart" ? closeCartHandler : null}
    >
      <h2>Your Shopping Cart</h2>
      <p>Cart is empty!</p>
      <ul>
        {ctx.items.map((item) => (
          <CartItem
            key={item.id}
            name={item.name}
            quantity={item.quantity}
            price={item.price}
            onAdd={() => ctx.addItem({ ...item, quantity: 1 })}
            onRemove={() => ctx.removeItem(item.id)}
          />
        ))}
      </ul>
      <p className="cart-total">{formatCurrency(cartTotal)}</p>
      <p className="modal-actions">
        <Button onClick={closeCartHandler} textOnly>
          Close
        </Button>
        {ctx.items.length > 0 && (
          <Button onClick={handleGoToCheckout}>Checkout</Button>
        )}
      </p>
    </Modal>
  );
}
