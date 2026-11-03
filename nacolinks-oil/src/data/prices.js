// =============================================================================
// Nacolinks Oil & Gas Ltd. - Pump Prices Data
// PMS (Petrol) is ₦1,400 per litre.
// =============================================================================

export const PUMP_PRICES = [
  {
    code: 'PMS',
    name: 'Petrol',
    fullName: 'Premium Motor Spirit',
    price: 1400,
    previous: 1450,
    unit: 'litre',
    bestFor: 'Cars, motorcycles, private & commercial generators',
  },
  {
    code: 'AGO',
    name: 'Diesel',
    fullName: 'Automotive Gas Oil',
    price: 1380,
    previous: 1380,
    unit: 'litre',
    bestFor: 'Heavy trucks, logistics haulage, manufacturing power',
  },
  {
    code: 'DPK',
    name: 'Kerosene',
    fullName: 'Dual Purpose Kerosene',
    price: 1420,
    previous: 1420,
    unit: 'litre',
    bestFor: 'Household cooking, domestic heating, industrial cleaning',
  },
  {
    code: 'LPG',
    name: 'Cooking Gas',
    fullName: 'Liquefied Petroleum Gas',
    price: 1450,
    previous: 1400,
    unit: 'kg',
    bestFor: 'Safe kitchen cooking, commercial bakeries, auto-gas conversion',
  },
];

export const PRICES_UPDATED = 'Today, 6:00 AM';

export function priceChange(product) {
  if (!product || typeof product.price !== 'number') return 'same';
  const prev = typeof product.previous === 'number' ? product.previous : product.price;
  if (product.price < prev) return 'down';
  if (product.price > prev) return 'up';
  return 'same';
}

export function naira(n) {
  return `₦${Number(n || 0).toLocaleString('en-NG')}`;
}

