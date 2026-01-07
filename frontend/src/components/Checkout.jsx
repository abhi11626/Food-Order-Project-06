import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import { useContext, useState, useEffect } from "react";
import { formatCurrency } from "../util.js/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import { UserProgressContext } from "../store/UserProgress";
import { API_BASE_URL } from "../config/api";

export default function Checkout() {
  const ctx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const cartTotal = ctx.items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  function closeCheckoutHandler() {
    userProgressCtx.hideCheckout();
  }
  async function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const userData = Object.fromEntries(fd.entries());

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order: {
            items: ctx.items,
            customer: userData,
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to submit order");

      // Clear the cart after successful order submission
      ctx.clearCart();
      
      setDidSubmit(true);
      setIsSubmitting(false);

      // auto-close after a short delay and return to main page
      setTimeout(() => {
        userProgressCtx.hideCheckout();
      }, 10000);
    } catch (err) {
      console.error(err);
      setSubmitError(err.message || "Submission failed");
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (userProgressCtx.progress === "checkout") {
      setDidSubmit(false);
      setIsSubmitting(false);
      setSubmitError(null);
    }
  }, [userProgressCtx.progress]);
  return (
    <Modal
      open={userProgressCtx.progress === "checkout"}
      onClose={closeCheckoutHandler}
    >
      {didSubmit ? (
        <div>
          <h2>Success</h2>
          <p>Your order has been submitted successfully.</p>
          <p>Returning to main page…</p>
          <p className="modal-actions">
            <Button
              type="button"
              onClick={() => {
                userProgressCtx.hideCheckout();
              }}
            >
              OK
            </Button>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>Checkout</h2>
          <p>Total Amount : {formatCurrency(cartTotal)}</p>
          <Input label="Your Name" type="text" id="name" />
          <Input label="Your Email" type="email" id="email" />
          <Input label="Your Address" type="text" id="street" />
          <div className="control-row">
            <Input label="City" type="text" id="city" />
            <Input label="Postal Code" type="text" id="postal-code" />
          </div>
          {isSubmitting && <p>Submitting…</p>}
          {submitError && <p className="error">{submitError}</p>}
          <p className="modal-actions">
            <Button type="submit" disabled={isSubmitting}>
              Confirm
            </Button>
            <Button type="button" textOnly onClick={closeCheckoutHandler}>
              Cancel
            </Button>
          </p>
        </form>
      )}
    </Modal>
  );
}
