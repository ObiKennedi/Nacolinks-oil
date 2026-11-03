import { useId, useMemo, useState, useEffect } from 'react';
import {
  Fuel,
  Truck,
  FlameKindling,
  Flame,
  TrendingDown,
  TrendingUp,
  Minus,
  Calculator,
  RefreshCw,
  Info,
} from 'lucide-react';
import {
  getLiveFuelPrices,
  DEFAULT_PUMP_PRICES,
  PRICES_UPDATED,
  priceChange,
  naira,
} from '../../services/fuelPrices';
import './index.scss';

const PRODUCT_ICONS = { PMS: Fuel, AGO: Truck, DPK: FlameKindling, LPG: Flame };

const QUICK_AMOUNTS = [5000, 10000, 20000, 50000];
const QUICK_QUANTITIES = [5, 10, 25, 50];

function ChangeBadge({ product }) {
  const change = priceChange(product);
  const prevPrice = typeof product.previous === 'number' ? product.previous : product.price;
  const diff = Math.abs(product.price - prevPrice);

  const config = {
    down: { Icon: TrendingDown, text: `${naira(diff)} lower` },
    up: { Icon: TrendingUp, text: `${naira(diff)} higher` },
    same: { Icon: Minus, text: 'No change' },
  }[change] || { Icon: Minus, text: 'Stable' };

  return (
    <span className={`prices__change prices__change--${change}`}>
      <config.Icon size={14} aria-hidden="true" />
      {config.text}
    </span>
  );
}

function PriceCard({ product }) {
  const Icon = PRODUCT_ICONS[product.code] ?? Fuel;

  return (
    <li className="prices__card">
      <div className="prices__card-top">
        <span className="prices__card-icon">
          <Icon size={22} aria-hidden="true" />
        </span>
        <span className="prices__code">{product.code}</span>
      </div>

      <h3 className="prices__name">{product.name}</h3>
      <p className="prices__full-name">{product.fullName}</p>

      <p className="prices__amount">
        {naira(product.price)}
        <span className="prices__unit">/{product.unit}</span>
      </p>

      <ChangeBadge product={product} />

      <p className="prices__best-for">
        <strong>Best for:</strong> {product.bestFor}
      </p>
    </li>
  );
}

function FuelCalculator({ prices = DEFAULT_PUMP_PRICES }) {
  const id = useId();
  const [code, setCode] = useState(prices[0]?.code || 'PMS');
  const [mode, setMode] = useState('amount'); // 'amount' (₦ → litres) | 'quantity' (litres → ₦)
  const [value, setValue] = useState('10000');

  // Find active product from live prices
  const product = prices.find((p) => p.code === code) || prices[0] || DEFAULT_PUMP_PRICES[0];
  const unitLabel = product.unit === 'kg' ? 'kg' : 'litres';
  const numeric = Number(String(value).replace(/,/g, '')) || 0;

  const result = useMemo(() => {
    if (!numeric || !product.price) return null;
    return mode === 'amount'
      ? { label: `You’ll get about`, value: `${(numeric / product.price).toFixed(2)} ${unitLabel}` }
      : { label: 'You’ll pay', value: naira(numeric * product.price) };
  }, [numeric, mode, product, unitLabel]);

  const switchMode = (next) => {
    setMode(next);
    setValue(next === 'amount' ? '10000' : '10');
  };

  const quick = mode === 'amount' ? QUICK_AMOUNTS : QUICK_QUANTITIES;

  return (
    <div className="prices__calc" aria-labelledby={`${id}-title`}>
      <div className="prices__calc-head">
        <span className="prices__calc-icon">
          <Calculator size={20} aria-hidden="true" />
        </span>
        <div>
          <h3 id={`${id}-title`} className="prices__calc-title">Fuel cost calculator</h3>
          <p className="prices__calc-sub">Plan your fill-up before you get to the pump.</p>
        </div>
      </div>

      {/* Product */}
      <fieldset className="prices__field">
        <legend className="prices__label">Product</legend>
        <div className="prices__segment prices__segment--products">
          {prices.map((p) => (
            <label key={p.code} className="prices__segment-option">
              <input
                type="radio"
                name={`${id}-product`}
                value={p.code}
                checked={code === p.code}
                onChange={() => setCode(p.code)}
              />
              <span>{p.name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Mode */}
      <fieldset className="prices__field">
        <legend className="prices__label">I want to enter</legend>
        <div className="prices__segment">
          <label className="prices__segment-option">
            <input
              type="radio"
              name={`${id}-mode`}
              checked={mode === 'amount'}
              onChange={() => switchMode('amount')}
            />
            <span>Amount (₦)</span>
          </label>
          <label className="prices__segment-option">
            <input
              type="radio"
              name={`${id}-mode`}
              checked={mode === 'quantity'}
              onChange={() => switchMode('quantity')}
            />
            <span>{product.unit === 'kg' ? 'Kilograms' : 'Litres'}</span>
          </label>
        </div>
      </fieldset>

      {/* Value */}
      <div className="prices__field">
        <label className="prices__label" htmlFor={`${id}-value`}>
          {mode === 'amount' ? 'How much do you want to spend?' : `How many ${unitLabel}?`}
        </label>
        <div className="prices__input-wrap">
          {mode === 'amount' && <span className="prices__input-affix">₦</span>}
          <input
            id={`${id}-value`}
            className="prices__input"
            type="number"
            inputMode="decimal"
            min="0"
            step={mode === 'amount' ? 500 : 1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          {mode === 'quantity' && <span className="prices__input-affix">{product.unit === 'kg' ? 'kg' : 'L'}</span>}
        </div>
        <div className="prices__chips">
          {quick.map((q) => (
            <button
              key={q}
              type="button"
              className={`prices__chip${numeric === q ? ' prices__chip--active' : ''}`}
              onClick={() => setValue(String(q))}
            >
              {mode === 'amount' ? naira(q) : `${q}${product.unit === 'kg' ? 'kg' : 'L'}`}
            </button>
          ))}
        </div>
      </div>

      <div className="prices__result" aria-live="polite">
        {result ? (
          <>
            <span className="prices__result-label">{result.label}</span>
            <span className="prices__result-value">{result.value}</span>
            <span className="prices__result-note">
              {product.name} at {naira(product.price)}/{product.unit}
            </span>
          </>
        ) : (
          <span className="prices__result-label">Enter a value to see your estimate</span>
        )}
      </div>
    </div>
  );
}

export default function Prices() {
  const [prices, setPrices] = useState(DEFAULT_PUMP_PRICES);
  const [updatedTime, setUpdatedTime] = useState(PRICES_UPDATED);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load live prices from API on mount + recheck periodically
  useEffect(() => {
    let isMounted = true;

    async function fetchPrices(force = false) {
      if (force) setIsRefreshing(true);
      try {
        const res = await getLiveFuelPrices(force);
        if (isMounted && res?.prices?.length) {
          setPrices(res.prices);
          if (res.updatedText) setUpdatedTime(res.updatedText);
        }
      } catch (err) {
        console.error('[Nacolinks Prices] Failed to load live prices:', err);
      } finally {
        if (isMounted) setIsRefreshing(false);
      }
    }

    fetchPrices();

    // Recheck live API every 10 minutes
    const interval = setInterval(() => {
      fetchPrices(true);
    }, 10 * 60 * 1000);

    // Sync across other components (e.g. Hero board)
    const onPricesUpdated = (e) => {
      if (e?.detail?.prices) {
        setPrices(e.detail.prices);
        if (e.detail.updatedText) setUpdatedTime(e.detail.updatedText);
      }
    };
    window.addEventListener('nacolinks-prices-updated', onPricesUpdated);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('nacolinks-prices-updated', onPricesUpdated);
    };
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await getLiveFuelPrices(true);
      if (res?.prices?.length) {
        setPrices(res.prices);
        if (res.updatedText) setUpdatedTime(res.updatedText);
      }
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  return (
    <section id="prices" className="prices" aria-labelledby="prices-title">
      <div className="prices__container">
        <header className="prices__header">
          <div>
            <p className="prices__eyebrow">Fuel prices</p>
            <h2 id="prices-title" className="prices__title">
              Honest prices, updated every morning.
            </h2>
            <p className="prices__lead">
              The same fair price at every Nacolinks pump. No hidden charges, no short measures.
            </p>
          </div>
          <button
            type="button"
            className="prices__updated"
            onClick={handleManualRefresh}
            title="Click to check for live price updates"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              font: 'inherit',
              padding: 0,
            }}
          >
            <RefreshCw
              size={16}
              aria-hidden="true"
              style={{
                transform: isRefreshing ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.5s ease',
              }}
            />
            <span>{isRefreshing ? 'Checking feed...' : `Updated ${updatedTime}`}</span>
          </button>
        </header>

        <div className="prices__layout">
          <ul className="prices__grid">
            {prices.map((p) => (
              <PriceCard key={p.code} product={p} />
            ))}
          </ul>

          <FuelCalculator prices={prices} />
        </div>

        <p className="prices__note">
          <Info size={16} aria-hidden="true" />
          Prices may change in line with national supply. Changes are compared with the previous price.
        </p>
      </div>
    </section>
  );
}
