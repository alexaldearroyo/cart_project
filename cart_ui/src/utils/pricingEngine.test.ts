import { applyPricingRules } from './pricingEngine';
import type { Product } from '../types';

const products: Record<string, Product> = {
  GR1: { id: 1, code: 'GR1', name: 'Green Tea', price: 3.11 },
  SR1: { id: 2, code: 'SR1', name: 'Strawberries', price: 5.00 },
  CF1: { id: 3, code: 'CF1', name: 'Coffee', price: 11.23 },
};

const scan = (basket: string[]): number => {
  const grouped: Record<string, number> = {};
  basket.forEach((code) => {
    grouped[code] = (grouped[code] || 0) + 1;
  });

  return basket.reduce((sum, code) => {
    if (!grouped[code]) return sum;
    const subtotal = applyPricingRules(products[code], grouped[code]);
    grouped[code] = 0; // avoid re-counting
    return sum + subtotal;
  }, 0);
};

describe('Checkout pricing rules', () => {
  it('GR1,GR1 → 3.11€', () => {
    expect(scan(['GR1', 'GR1']).toFixed(2)).toBe('3.11');
  });

  it('SR1,SR1,GR1,SR1 → 16.61€', () => {
    expect(scan(['SR1', 'SR1', 'GR1', 'SR1']).toFixed(2)).toBe('16.61');
  });

  it('GR1,CF1,SR1,CF1,CF1 → 30.57€', () => {
    expect(scan(['GR1', 'CF1', 'SR1', 'CF1', 'CF1']).toFixed(2)).toBe('30.57');
  });
});

