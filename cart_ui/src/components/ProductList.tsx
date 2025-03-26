// src/components/ProductList.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';

type Product = {
  id: number;
  code: string;
  name: string;
  price: number;
};

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<
    Record<string, { product: Product; quantity: number }>
  >({});

  const calculateItemTotal = (product: Product, quantity: number): number => {
    switch (product.code) {
      case 'GR1': {
        const payable = Math.ceil(quantity / 2);
        return Number(product.price) * payable;
      }
      case 'SR1': {
        const pricePerUnit = quantity >= 3 ? 4.5 : Number(product.price);
        return pricePerUnit * quantity;
      }
      case 'CF1': {
        const discountPrice =
          quantity >= 3
            ? Number(product.price) * (2 / 3)
            : Number(product.price);
        return discountPrice * quantity;
      }
      default:
        return Number(product.price) * quantity;
    }
  };

  const total = Object.values(cart).reduce(
    (sum, { product, quantity }) => sum + calculateItemTotal(product, quantity),
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
        {Object.values(cart).map(({ product, quantity }) => (
          <li key={product.code}>
            {product.name} ({product.code}) x {quantity} →{' '}
            {calculateItemTotal(product, quantity).toFixed(2)} €
            <button
              onClick={() => removeFromCart(product)}
              style={{ marginLeft: '1rem' }}
            >
              −
            </button>
          </li>
        ))}
      </ul>
      <h3>Total: {total.toFixed(2)} €</h3>
    </div>
  );
}
