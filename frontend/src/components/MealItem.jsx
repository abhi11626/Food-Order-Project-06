import { useContext } from "react";
import { formatCurrency } from "../util.js/formatting.js";
import Button from "./UI/Button.jsx";
import CartContext from "../store/CartContext.jsx";
import { API_BASE_URL } from "../config/api";

export default function MealItem({ meal }) {
  const ctx = useContext(CartContext);

  function addToCartHandler() {
    ctx.addItem(meal);
  }

  return (
    <li className="meal-item">
      <article>
        <img src={`${API_BASE_URL}/${meal.image}`} alt={meal.name} />
        <div>
          <h3>{meal.name}</h3>
          <p className="meal-item-description">{meal.description}</p>
          <p className="meal-item-price">{formatCurrency(meal.price)}</p>
        </div>
        <p className="meal-item-actions">
          <Button onClick={addToCartHandler}>Add to Cart</Button>
        </p>
      </article>
    </li>
  );
}
