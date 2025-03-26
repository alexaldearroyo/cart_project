// src/components/ProductList.tsx
import { useEffect, useState } from 'react';
import { Product } from '../types';
import { applyPricingRules, calculateDiscount } from '../utils/pricingEngine';
import axios from 'axios';
import './ProductList.css';
import {
  FiShoppingCart,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiCheckCircle,
  FiPackage,
  FiTag,
} from 'react-icons/fi';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<
    Record<string, { product: Product; quantity: number }>
  >(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const total = Object.values(cart).reduce(
    (sum, { product, quantity }) => sum + applyPricingRules(product, quantity),
    0,
  );

  useEffect(() => {
    axios
      .get('http://localhost:3000/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Error fetching products', err));
  }, []);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart[product.code];
      return {
        ...prevCart,
        [product.code]: existing
          ? { product, quantity: existing.quantity + 1 }
          : { product, quantity: 1 },
      };
    });
  };

  const removeFromCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart[product.code];
      if (!existing) return prevCart;

      if (existing.quantity === 1) {
        const updated = { ...prevCart };
        delete updated[product.code];
        return updated;
      }

      return {
        ...prevCart,
        [product.code]: {
          product,
          quantity: existing.quantity - 1,
        },
      };
    });
  };

  const clearCart = () => {
    setCart({});
    localStorage.removeItem('cart');
  };

  const handleCheckout = async () => {
    if (Object.keys(cart).length === 0) {
      alert('The cart is empty.');
      return;
    }

    let summary = 'Order summary:\n\n';

    const orderItems = Object.values(cart).map(({ product, quantity }) => {
      const subtotal = applyPricingRules(product, quantity);
      const discount = calculateDiscount(product, quantity);
      summary += `${product.name} x${quantity} → ${subtotal.toFixed(2)} €`;
      if (discount > 0) {
        summary += ` (−${discount.toFixed(2)} € discount)`;
      }
      summary += '\n';
      return { code: product.code, quantity };
    });

    const total = Object.values(cart).reduce(
      (sum, { product, quantity }) =>
        sum + applyPricingRules(product, quantity),
      0,
    );

    summary += `\nTOTAL: ${total.toFixed(2)} €`;
    alert(summary);

    try {
      await axios.post('http://localhost:3000/orders', {
        order: {
          items: JSON.stringify(orderItems),
          total: total.toFixed(2),
        },
      });
      alert('Order saved successfully.');
    } catch (err) {
      console.error('Failed to save order', err);
      alert('Error saving order.');
    }

    setCart({});
    localStorage.removeItem('cart');
  };

  return (
    <div className="product-container">
      <section className="product-section">
        <h2 className="section-title">
          <FiPackage className="icon" /> Products
        </h2>
        <ul className="product-list">
          {products.map((p) => (
            <li key={p.id} className="product-item">
              <div className="product-info">
                <div className="product-name">{p.name}</div>
                <div className="product-code">
                  <FiTag className="icon-sm" /> {p.code}
                </div>
                <div className="product-price">
                  {Number(p.price).toFixed(2)} €
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => addToCart(p)}>
                <FiShoppingCart className="icon-sm" /> Add to Cart
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="cart-section">
        <h2 className="section-title">
          <FiShoppingCart className="icon" /> Shopping Cart
        </h2>

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
    </div>
  );
}
