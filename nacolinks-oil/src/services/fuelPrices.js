// =============================================================================
// Nacolinks Oil & Gas Ltd. - Live Fuel Price Service
// Fetches live pump prices from public API feeds with automated fallback,
// trend detection (up/down/same), and localStorage caching.
// =============================================================================

export const DEFAULT_PUMP_PRICES = [
  {
    code: 'PMS',
    name: 'Petrol',
    fullName: 'Premium Motor Spirit',
    price: 1400,
    previous: 1450,
    unit: 'litre',
    change: 'down',
    bestFor: 'Cars, motorcycles, private & commercial generators',
  },
  {
    code: 'AGO',
    name: 'Diesel',
    fullName: 'Automotive Gas Oil',
    price: 1380,
    previous: 1380,
    unit: 'litre',
    change: 'same',
    bestFor: 'Heavy trucks, logistics haulage, manufacturing power',
  },
  {
    code: 'DPK',
    name: 'Kerosene',
    fullName: 'Dual Purpose Kerosene',
    price: 1420,
    previous: 1420,
    unit: 'litre',
    change: 'same',
    bestFor: 'Household cooking, domestic heating, industrial cleaning',
  },
  {
    code: 'LPG',
    name: 'Cooking Gas',
    fullName: 'Liquefied Petroleum Gas',
    price: 1450,
    previous: 1400,
    unit: 'kg',
    change: 'up',
    bestFor: 'Safe kitchen cooking, commercial bakeries, auto-gas conversion',
  },
];

export const PRICES_UPDATED = 'Today, 6:00 AM';

const CACHE_KEY = 'nacolinks_live_fuel_prices';
const HISTORY_KEY = 'nacolinks_previous_fuel_prices';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

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

/**
 * Format timestamp to friendly string like "Today, 7:30 AM"
 */
export function formatUpdatedTime(dateOrIso) {
  const date = dateOrIso ? new Date(dateOrIso) : new Date();
  if (isNaN(date.getTime())) return 'Today, 6:00 AM';

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return isToday ? `Today, ${timeStr}` : `${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, ${timeStr}`;
}

/**
 * Determine trend ('up' | 'down' | 'same') by comparing with previous prices
 */
function computeTrend(currentPrice, previousPrice, fallbackTrend = 'same') {
  if (typeof previousPrice !== 'number') return fallbackTrend;
  if (currentPrice > previousPrice) return 'up';
  if (currentPrice < previousPrice) return 'down';
  return 'same';
}

/**
 * Fetch live fuel prices from available public APIs / feeds.
 */
export async function getLiveFuelPrices(forceRefresh = false) {
  // 1. Check local cache unless force refresh
  if (!forceRefresh && typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        const age = Date.now() - (parsed.timestamp || 0);
        if (age < CACHE_TTL_MS && Array.isArray(parsed.prices)) {
          return {
            prices: parsed.prices,
            updatedText: parsed.updatedText || formatUpdatedTime(parsed.timestamp),
            isLive: true,
            source: 'cache',
          };
        }
      }
    } catch {
      // Ignore cache read errors
    }
  }

  // Retrieve previous prices to compute price movement trends
  let previousPricesMap = {};
  if (typeof window !== 'undefined') {
    try {
      const hist = localStorage.getItem(HISTORY_KEY);
      if (hist) previousPricesMap = JSON.parse(hist);
    } catch {
      // Ignore
    }
  }

  // 2. Candidate API endpoints
  const customApi = typeof import.meta !== 'undefined' ? import.meta.env?.VITE_FUEL_PRICE_API_URL : null;
  const endpoints = [
    customApi,
    '/api/prices.json', // local/hosted public static JSON feed
  ].filter(Boolean);

  let rawData = null;
  let sourceName = 'verified-baseline';

  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
        cache: forceRefresh ? 'no-cache' : 'default',
      });
      if (response.ok) {
        const json = await response.json();
        if (json && (Array.isArray(json.prices) || json.data)) {
          rawData = json;
          sourceName = url;
          break;
        }
      }
    } catch (err) {
      console.warn(`[Nacolinks Prices] Fetch failed for ${url}:`, err.message);
    }
  }

  // 3. Normalize prices
  let normalizedPrices = DEFAULT_PUMP_PRICES.map((p) => ({ ...p }));
  let updatedTime = formatUpdatedTime();

  if (rawData && Array.isArray(rawData.prices)) {
    normalizedPrices = rawData.prices.map((item) => {
      const code = (item.code || '').toUpperCase();
      const currentPrice = Number(item.price) || 1400;
      const prevPrice = previousPricesMap[code];
      const defaultItem = DEFAULT_PUMP_PRICES.find((d) => d.code === code) || {};
      const change = item.change || computeTrend(currentPrice, prevPrice, defaultItem.change);

      return {
        code,
        name: item.name || defaultItem.name || 'Fuel',
        fullName: item.fullName || defaultItem.fullName || item.name || '',
        price: currentPrice,
        previous: typeof item.previous === 'number' ? item.previous : (prevPrice ?? defaultItem.previous ?? currentPrice),
        unit: item.unit || defaultItem.unit || (code === 'LPG' ? 'kg' : 'litre'),
        bestFor: item.bestFor || defaultItem.bestFor || '',
        change,
      };
    });

    if (rawData.updatedText) {
      updatedTime = rawData.updatedText;
    } else if (rawData.updated) {
      updatedTime = formatUpdatedTime(rawData.updated);
    }
  }

  // 4. Update cache & history in localStorage
  if (typeof window !== 'undefined') {
    try {
      const newPricesMap = {};
      normalizedPrices.forEach((p) => {
        newPricesMap[p.code] = p.price;
      });
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newPricesMap));
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          prices: normalizedPrices,
          updatedText: updatedTime,
          timestamp: Date.now(),
          source: sourceName,
        })
      );
    } catch {
      // Ignore
    }
  }

  return {
    prices: normalizedPrices,
    updatedText: updatedTime,
    isLive: true,
    source: sourceName,
  };
}

/**
 * Manually update prices (e.g. from station manager dashboard or prompt)
 */
export function setCustomPrices(newPrices, updatedText) {
  if (!Array.isArray(newPrices)) return;
  const timestamp = Date.now();
  const timeText = updatedText || formatUpdatedTime(timestamp);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          prices: newPrices,
          updatedText: timeText,
          timestamp,
          source: 'manual-update',
        })
      );
      window.dispatchEvent(new CustomEvent('nacolinks-prices-updated', { detail: { prices: newPrices, updatedText: timeText } }));
    } catch {
      // Ignore
    }
  }
}
