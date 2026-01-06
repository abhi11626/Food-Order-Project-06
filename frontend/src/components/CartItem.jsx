import { formatCurrency } from "../util.js/formatting";

export default function CartItem({ name, quantity, price, onAdd, onRemove }) {
  return (
    <li className="cart-item">
      <p>
        {name} - {quantity} x {formatCurrency(price)}
      </p>
      <p className="cart-item-actions">
        <button onClick={onRemove}>-</button>
        <span> {quantity}</span>
        <button onClick={onAdd}>+</button>
      </p>
    </li>
  );
}
