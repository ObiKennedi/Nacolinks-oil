import { useState, useEffect } from 'react';
import { ArrowRight, MapPin, Clock, ShieldCheck, Gauge, TrendingDown, TrendingUp, Minus, RefreshCw } from 'lucide-react';
import { getLiveFuelPrices, DEFAULT_PUMP_PRICES } from '../../services/fuelPrices';
import './index.scss';

const TRUST_POINTS = [
  { Icon: Clock, label: 'Open every day' },
  { Icon: ShieldCheck, label: 'Quality-tested fuel' },
  { Icon: Gauge, label: 'Accurately metered pumps' },
];

const naira = (n) => `₦${Number(n || 0).toLocaleString('en-NG')}`;

const CHANGE = {
  down: { Icon: TrendingDown, label: 'Price dropped' },
  up: { Icon: TrendingUp, label: 'Price increased' },
  same: { Icon: Minus, label: 'No change' },
};

export default function Hero() {
  const [prices, setPrices] = useState(DEFAULT_PUMP_PRICES);
  const [updatedTime, setUpdatedTime] = useState('Today, 6:00 AM');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch prices on mount & listen for live updates
  useEffect(() => {
    let isMounted = true;

    async function loadPrices(force = false) {
      if (force) setIsRefreshing(true);
      try {
        const res = await getLiveFuelPrices(force);
        if (isMounted && res?.prices?.length) {
          setPrices(res.prices);
          if (res.updatedText) setUpdatedTime(res.updatedText);
        }
      } catch (err) {
        console.error('[Nacolinks] Failed to load live prices:', err);
      } finally {
        if (isMounted) setIsRefreshing(false);
      }
    }

    loadPrices();

    // Recheck live prices every 10 minutes
    const interval = setInterval(() => {
      loadPrices(true);
    }, 10 * 60 * 1000);

    // Listen for manual price broadcast
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
    <section id="home" className="hero" aria-labelledby="hero-title">
      {/* Decorative swoosh bands from the letterhead */}
      <svg className="hero__bands" viewBox="0 0 600 700" preserveAspectRatio="xMaxYMid slice" aria-hidden="true">
        <polygon className="hero__band hero__band--blue" points="40,0 80,0 360,700 320,700" />
        <polygon className="hero__band hero__band--green" points="105,0 165,0 445,700 385,700" />
        <polygon className="hero__band hero__band--gold" points="190,0 220,0 500,700 470,700" />
        <polygon className="hero__band hero__band--slab" points="245,0 600,0 600,700 525,700" />
      </svg>

      <div className="hero__container">
        <div className="hero__content">
          <p className="hero__eyebrow">
            <MapPin size={16} aria-hidden="true" />
            Owerri West &amp; Awo Omamma, Imo State
          </p>

          <h1 id="hero-title" className="hero__title">
            Dependable fuel,
            <span className="hero__title-accent"> close to home.</span>
          </h1>

          <p className="hero__lead">
            Clean petrol, diesel, kerosene and cooking gas at honest prices — with fast service
            and pumps you can trust, every day of the week.
          </p>

          <div className="hero__actions">
            <a href="#stations" className="hero__btn hero__btn--primary">
              <MapPin size={18} aria-hidden="true" />
              Find a station
            </a>
            <a href="#prices" className="hero__btn hero__btn--ghost">
              Today’s prices
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>

          <ul className="hero__trust">
            {TRUST_POINTS.map(({ Icon, label }) => (
              <li key={label} className="hero__trust-item">
                <span className="hero__trust-icon">
                  <Icon size={18} aria-hidden="true" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <aside className="hero__board" aria-labelledby="price-board-title" id="prices">
          <div className="hero__board-head">
            <div>
              <p className="hero__board-label">Pump prices</p>
              <h2 id="price-board-title" className="hero__board-title">Today at Nacolinks</h2>
            </div>
            <button
              type="button"
              className="hero__live"
              onClick={handleManualRefresh}
              title="Click to check live price feed"
              style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}
            >
              <span className={`hero__live-dot ${isRefreshing ? 'hero__live-dot--spinning' : ''}`} aria-hidden="true" />
              <span>{isRefreshing ? 'Updating...' : 'Live'}</span>
              {isRefreshing && <RefreshCw size={12} className="spin-icon" style={{ marginLeft: 4 }} />}
            </button>
          </div>

          <ul className="hero__prices">
            {prices.map(({ code, name, price, unit, change }) => {
              const changeInfo = CHANGE[change] || CHANGE.same;
              const { Icon, label } = changeInfo;
              return (
                <li key={code} className="hero__price">
                  <span className="hero__price-code">{code}</span>
                  <span className="hero__price-name">{name}</span>
                  <span className="hero__price-value">
                    {naira(price)}
                    <small>/{unit}</small>
                  </span>
                  <span className={`hero__price-change hero__price-change--${change || 'same'}`} title={label}>
                    <Icon size={16} aria-hidden="true" />
                    <span className="hero__sr">{label}</span>
                  </span>
                </li>
              );
            })}
          </ul>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p className="hero__board-foot">Updated {updatedTime}</p>
            <button
              onClick={handleManualRefresh}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--nl-gray-600)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: '0.75rem',
                marginTop: 'var(--nl-space-4)',
                paddingTop: 'var(--nl-space-4)',
              }}
              title="Refresh prices"
            >
              <RefreshCw size={13} style={{ transform: isRefreshing ? 'rotate(180deg)' : 'none', transition: 'transform 0.4s ease' }} />
              <span>Refresh</span>
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
