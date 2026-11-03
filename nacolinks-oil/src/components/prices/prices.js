// Single source of truth for pump prices — used by <Hero /> and <Prices />.
// Replace with live data (CMS / API) when available. Prices in naira.

export const PRICES_UPDATED = 'Today, 6:00 AM';

export const PUMP_PRICES = [
  {
    code: 'PMS',
    name: 'Petrol',
    fullName: 'Premium Motor Spirit',
    price: 945,
    previous: 960,
    unit: 'litre',
    bestFor: 'Cars, keke, okada and small generators',
  },
  {
    code: 'AGO',
    name: 'Diesel',
    fullName: 'Automotive Gas Oil',
    price: 1120,
    previous: 1120,
    unit: 'litre',
    bestFor: 'Trucks, buses, heavy machinery and large generators',
  },
  {
    code: 'DPK',
    name: 'Kerosene',
    fullName: 'Dual Purpose Kerosene',
    price: 1250,
    previous: 1250,
    unit: 'litre',
    bestFor: 'Kerosene stoves and lanterns',
  },
  {
    code: 'LPG',
    name: 'Cooking gas',
    fullName: 'Liquefied Petroleum Gas',
    price: 1350,
    previous: 1300,
    unit: 'kg',
    bestFor: 'Home and restaurant cylinders — 3kg to 50kg refills',
  },
];

/** 'up' | 'down' | 'same' */
export const priceChange = ({ price, previous }) =>
  price > previous ? 'up' : price < previous ? 'down' : 'same';

export const naira = (n, opts = {}) =>
  `₦${Number(n).toLocaleString('en-NG', { maximumFractionDigits: 0, ...opts })}`;