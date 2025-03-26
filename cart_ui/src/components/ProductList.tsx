// src/components/ProductList.tsx
import { useEffect, useState } from 'react';
import { Product } from '../types';
import { applyPricingRules, calculateDiscount } from '../utils/pricingEngine';
import axios from 'axios';

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

  const handleCheckout = () => {
    if (Object.keys(cart).length === 0) {
      alert('The cart is empty.');
      return;
    }

    let summary = 'Order summary:\n\n';

    Object.values(cart).forEach(({ product, quantity }) => {
      const subtotal = applyPricingRules(product, quantity);
      const discount = calculateDiscount(product, quantity);
      summary += `${product.name} x${quantity} → ${subtotal.toFixed(2)} €`;
      if (discount > 0) {
        summary += ` (−${discount.toFixed(2)} € discount)`;
      }
      summary += '\n';
    });

    summary += `\nTOTAL: ${total.toFixed(2)} €`;

    alert(summary);

    setCart({});
    localStorage.removeItem('cart');
  };

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} ({p.code}) - {Number(p.price).toFixed(2)} €
            <button onClick={() => addToCart(p)} style={{ marginLeft: '1rem' }}>
              Add to Cart
            </button>
          </li>
        ))}
      </ul>

      <h2>Cart</h2>
      <ul>
        {Object.values(cart).map(({ product, quantity }) => {
          const subtotal = applyPricingRules(product, quantity);
          const discount = calculateDiscount(product, quantity);
          return (
            <li key={product.code}>
              {product.name} ({product.code}) x {quantity} →{' '}
              {subtotal.toFixed(2)} €
              {discount > 0 && (
                <span style={{ color: 'green', marginLeft: '0.5rem' }}>
                  (−{discount.toFixed(2)} € discount)
                </span>
              )}
              <button
                onClick={() => removeFromCart(product)}
                style={{ marginLeft: '1rem' }}
              >
                −
              </button>
            </li>
          );
        })}
      </ul>

      <h3>Total: {total.toFixed(2)} €</h3>
      <button onClick={clearCart} style={{ marginTop: '1rem' }}>
        Clear Cart
      </button>
      <button
        onClick={handleCheckout}
        style={{ marginTop: '1rem', marginLeft: '1rem' }}
      >
        Checkout
      </button>
    </div>
  );
}
