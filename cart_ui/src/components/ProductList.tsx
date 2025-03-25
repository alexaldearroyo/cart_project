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
  const total = Object.values(cart).reduce(
    (sum, { product, quantity }) => sum + Number(product.price) * quantity,
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
            {(product.price * quantity).toFixed(2)} €
          </li>
        ))}
      </ul>
      <h3>Total: {total.toFixed(2)} €</h3>
    </div>
  );
}
