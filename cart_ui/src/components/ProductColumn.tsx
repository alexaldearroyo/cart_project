import { FiPackage, FiShoppingCart, FiTag } from 'react-icons/fi';
import { Product } from '../types';
import Header from './Header';

type ProductColumnProps = {
  products: Product[];
  addToCart: (product: Product) => void;
};

export default function ProductColumn({
  products,
  addToCart,
}: ProductColumnProps) {
  return (
    <section className="product-section">
      <Header title="Products" icon={<FiPackage className="icon" />} />
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
  );
}
