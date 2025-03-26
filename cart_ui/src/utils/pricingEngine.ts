// src/utils/pricingEngine.ts
import type { Product } from '../types';

export function applyPricingRules(product: Product, quantity: number): number {
  const price = Number(product.price);

  switch (product.code) {
    case 'GR1': {
      const payable = Math.ceil(quantity / 2);
      return price * payable;
    }
    case 'SR1': {
      const unitPrice = quantity >= 3 ? 4.5 : price;
      return unitPrice * quantity;
    }
    case 'CF1': {
      const discountPrice = quantity >= 3 ? price * (2 / 3) : price;
      return discountPrice * quantity;
    }
    default:
      return price * quantity;
  }
}

export function calculateDiscount(product: Product, quantity: number): number {
  const original = Number(product.price) * quantity;
  const discounted = applyPricingRules(product, quantity);
  return original - discounted;
}

