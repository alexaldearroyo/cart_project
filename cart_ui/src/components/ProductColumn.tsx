import { FiPackage, FiShoppingCart, FiTag, FiPercent } from 'react-icons/fi';
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
  // Function to get the offer description based on product code
  const getOfferInfo = (code: string): string | null => {
    switch (code) {
      case 'GR1':
        return 'Buy one, get one free';
      case 'SR1':
        return 'Buy 3 or more: 4.50€ each';
      case 'CF1':
        return 'Buy 3 or more: 2/3 price';
      default:
        return null;
    }
  };

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
              {getOfferInfo(p.code) && (
                <div className="product-offer">
                  <FiPercent className="icon-sm" /> {getOfferInfo(p.code)}
                </div>
              )}
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
