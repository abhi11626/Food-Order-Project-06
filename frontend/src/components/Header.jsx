import logoImg from "../assets/logo.jpg";
import Button from "./UI/Button";
import CartContext from "../store/CartContext.jsx";
import { useContext } from "react";
import { UserProgressContext } from "../store/UserProgress.jsx";

export default function Header() {
  const ctx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const totalCartItems = ctx.items.reduce((totalNumberOfItems, item) => {
    return totalNumberOfItems + item.quantity;
  }, 0);

  function cartButtonClickHandler() {
    userProgressCtx.showCart();
  }

  return (
    <header id="main-header">
      <div id="title">
        <img src={logoImg} alt="Logo" />
        <h1>React Foods</h1>
      </div>
      <nav>
        <Button textOnly onClick={cartButtonClickHandler}>
          Cart({totalCartItems})
        </Button>
      </nav>
    </header>
  );
}
