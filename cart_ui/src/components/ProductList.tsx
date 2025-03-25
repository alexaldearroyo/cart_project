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
  const [cart, setCart] = useState<Product[]>([]);
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
    axios
      .get('http://localhost:3000/products')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Error fetching products', err));
  }, []);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
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
        {cart.map((item, index) => (
          <li key={index}>
            {item.name} ({item.code}) - {item.price.toFixed(2)} €
          </li>
        ))}
      </ul>
      <h3>Total: {total.toFixed(2)} €</h3>
    </div>
  );
}
