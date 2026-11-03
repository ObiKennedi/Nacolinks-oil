import { useEffect, useState } from 'react';
import { MapPin, Clock, Phone, Navigation, Check, Building2 } from 'lucide-react';
import { STATIONS } from '../../data/stations';
import { PUMP_PRICES } from '../../data/prices';
import './index.scss';

const PRODUCT_NAMES = Object.fromEntries(PUMP_PRICES.map((p) => [p.code, p.name]));

const mapEmbedUrl = (q) =>
  `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed`;

const directionsUrl = (q) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;

const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, '')}`;

// Open/closed in Nigerian time, whatever the visitor's device timezone
function isOpenNow({ open, close }) {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' }));
  const mins = now.getHours() * 60 + now.getMinutes();
  const toMins = (t) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  return mins >= toMins(open) && mins < toMins(close);
}

function useOpenStatus() {
  const [, tick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 60_000);
    return () => clearInterval(t);
  }, []);
  return isOpenNow;
}

function StationCard({ station, selected, onSelect, open }) {
  return (
    <li className={`stations__card${selected ? ' stations__card--selected' : ''}`}>
      <button
        type="button"
        className="stations__card-select"
        aria-pressed={selected}
        aria-label={`Show ${station.name} on the map`}
        onClick={() => onSelect(station.id)}
      />

      <div className="stations__card-head">
        <span className="stations__type">
          <Building2 size={14} aria-hidden="true" />
          {station.type}
        </span>
        <span className={`stations__status stations__status--${open ? 'open' : 'closed'}`}>
          <span className="stations__status-dot" aria-hidden="true" />
          {open ? 'Open now' : 'Closed'}
        </span>
      </div>

      <h3 className="stations__name">{station.name}</h3>

      <ul className="stations__meta">
        <li>
          <MapPin size={16} aria-hidden="true" />
          <span>
            {station.address}
            <br />
            {station.area}
          </span>
        </li>
        <li>
          <Clock size={16} aria-hidden="true" />
          <span>{station.hoursLabel}</span>
        </li>
      </ul>

      <div className="stations__products" aria-label="Products available">
        {station.products.map((code) => (
          <span key={code} className="stations__product" title={PRODUCT_NAMES[code]}>
            {code}
          </span>
        ))}
      </div>

      {station.services?.length > 0 && (
        <ul className="stations__services">
          {station.services.map((s) => (
            <li key={s}>
              <Check size={14} aria-hidden="true" />
              {s}
            </li>
          ))}
        </ul>
      )}

      <div className="stations__actions">
        <a
          className="stations__btn stations__btn--primary"
          href={directionsUrl(station.mapQuery)}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Navigation size={16} aria-hidden="true" />
          Get directions
        </a>
        <a className="stations__btn stations__btn--ghost" href={telHref(station.phone)}>
          <Phone size={16} aria-hidden="true" />
          Call
        </a>
      </div>
    </li>
  );
}

export default function Stations() {
  const [selectedId, setSelectedId] = useState(STATIONS[0].id);
  const getOpen = useOpenStatus();
  const selected = STATIONS.find((s) => s.id === selectedId);

  return (
    <section id="stations" className="stations" aria-labelledby="stations-title">
      <div className="stations__container">
        <header className="stations__header">
          <p className="stations__eyebrow">Our stations</p>
          <h2 id="stations-title" className="stations__title">
            Find a Nacolinks station near you.
          </h2>
          <p className="stations__lead">
            Serving Owerri West and Oru-East with clean fuel, accurate pumps and friendly attendants.
          </p>
        </header>

        <div className="stations__layout">
          <ul className="stations__list">
            {STATIONS.map((station) => (
              <StationCard
                key={station.id}
                station={station}
                selected={station.id === selectedId}
                onSelect={setSelectedId}
                open={getOpen(station.hours)}
              />
            ))}
          </ul>

          <div className="stations__map">
            <iframe
              key={selected.id}
              className="stations__map-frame"
              title={`Map showing ${selected.name}`}
              src={mapEmbedUrl(selected.mapQuery)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="stations__map-label">
              <MapPin size={16} aria-hidden="true" />
              <span>
                <strong>{selected.name}</strong>
                {selected.area}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}