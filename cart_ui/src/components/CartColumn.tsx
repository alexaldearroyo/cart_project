import {
  FiShoppingCart,
  FiTag,
  FiMinus,
  FiPlus,
  FiTrash2,
  FiCheckCircle,
} from 'react-icons/fi';
import { Product } from '../types';
import { applyPricingRules, calculateDiscount } from '../utils/pricingEngine';
import Header from './Header';

type CartItem = {
  product: Product;
  quantity: number;
};

type CartColumnProps = {
  cart: Record<string, CartItem>;
  addToCart: (product: Product) => void;
  removeFromCart: (product: Product) => void;
  clearCart: () => void;
  handleCheckout: () => void;
};

export default function CartColumn({
  cart,
  addToCart,
  removeFromCart,
  clearCart,
  handleCheckout,
}: CartColumnProps) {
  const total = Object.values(cart).reduce(
    (sum, { product, quantity }) => sum + applyPricingRules(product, quantity),
    0,
  );

  return (
    <section className="cart-section">
      <Header
        title="Shopping Cart"
        icon={<FiShoppingCart className="icon" />}
      />

      {Object.keys(cart).length === 0 ? (
        <div className="empty-cart">Your cart is empty</div>
      ) : (
        <>
          <ul className="cart-list">
            {Object.values(cart).map(({ product, quantity }) => {
              const subtotal = applyPricingRules(product, quantity);
              const discount = calculateDiscount(product, quantity);
              return (
                <li key={product.code} className="cart-item">
                  <div className="cart-item-info">
                    <div className="cart-item-name">{product.name}</div>
                    <div className="cart-item-details">
                      <span className="cart-item-code">
                        <FiTag className="icon-sm" /> {product.code}
                      </span>
                      <span className="cart-item-quantity">{quantity}</span>
                    </div>
                  </div>
                  <div>
                    <div className="cart-item-price">
                      {subtotal.toFixed(2)} €
                    </div>
                    {discount > 0 && (
                      <div className="discount">
                        −{discount.toFixed(2)} € discount
                      </div>
                    )}
                  </div>
                  <div className="cart-actions">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeFromCart(product)}
                    >
                      <FiMinus />
                    </button>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => addToCart(product)}
                    >
                      <FiPlus />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="cart-summary">
            <div className="cart-total">Total: {total.toFixed(2)} €</div>
            <div className="cart-buttons">
              <button className="btn btn-danger" onClick={clearCart}>
                <FiTrash2 className="icon-sm" /> Clear Cart
              </button>
              <button className="btn btn-success" onClick={handleCheckout}>
                <FiCheckCircle className="icon-sm" /> Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
