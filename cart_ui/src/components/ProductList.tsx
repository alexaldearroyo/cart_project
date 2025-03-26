// src/components/ProductList.tsx
import { useEffect, useState } from 'react';
import { Product } from '../types';
import { applyPricingRules, calculateDiscount } from '../utils/pricingEngine';
import axios from 'axios';
import './ProductList.css';
import ProductColumn from './ProductColumn';
import CartColumn from './CartColumn';

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

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/products`)
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
      await axios.post(`${process.env.REACT_APP_API_URL}/orders`, {
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
      <ProductColumn products={products} addToCart={addToCart} />
      <CartColumn
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        handleCheckout={handleCheckout}
      />
    </div>
  );
}
