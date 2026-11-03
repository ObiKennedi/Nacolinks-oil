import { ShieldCheck, Gauge, HeartHandshake, Users, BadgeCheck } from 'lucide-react';
import mark from '../../assets/nacolinks-mark.png';
import { STATIONS } from '../../data/stations';
import { PUMP_PRICES } from '../../data/prices';
import './index.scss';

// TODO (client): replace the story paragraphs with Nacolinks' own history (founding year, founder, milestones).
const STORY = [
  'Nacolinks Oil and Gas Ltd. is an Imo State fuel retailer serving motorists, transporters, businesses and households from our stations in Owerri West and Oru-East.',
  'We started with a simple promise: the right product, the right quantity and the right price — every time you pull up to our pumps. That promise still guides everything we do.',
];

const VALUES = [
  {
    Icon: ShieldCheck,
    title: 'Quality you can trust',
    text: 'Fuel sourced from approved depots and checked before it reaches your tank.',
  },
  {
    Icon: Gauge,
    title: 'Honest measure',
    text: 'Calibrated, regularly inspected pumps. What you pay for is what you get.',
  },
  {
    Icon: HeartHandshake,
    title: 'Friendly service',
    text: 'Trained attendants who treat every customer with respect — keke or truck.',
  },
  {
    Icon: Users,
    title: 'Rooted in community',
    text: 'Local people, local jobs and a business that grows with Imo State.',
  },
];

const STATS = [
  { value: STATIONS.length, label: STATIONS.length === 1 ? 'Station' : 'Stations' },
  { value: PUMP_PRICES.length, label: 'Products' },
  { value: '7', label: 'Days a week' },
];

export default function About() {
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="about__container">
        {/* Brand panel */}
        <div className="about__visual">
          <div className="about__panel">
            <svg className="about__bands" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <polygon className="about__band about__band--blue" points="-40,500 0,500 260,0 220,0" />
              <polygon className="about__band about__band--green" points="30,500 90,500 350,0 290,0" />
              <polygon className="about__band about__band--gold" points="115,500 145,500 405,0 375,0" />
            </svg>
            <div className="about__mark-wrap">
              <img src={mark} alt="" className="about__mark" width="546" height="495" />
            </div>
          </div>

          <div className="about__badge">
            <span className="about__badge-icon">
              <BadgeCheck size={22} aria-hidden="true" />
            </span>
            <span>
              <strong>RC 1075987</strong>
              Registered with the CAC
            </span>
          </div>
        </div>

        {/* Story */}
        <div className="about__content">
          <p className="about__eyebrow">About Nacolinks</p>
          <h2 id="about-title" className="about__title">
            Rooted in Imo. <span className="about__title-accent">Built on trust.</span>
          </h2>

          {STORY.map((p, i) => (
            <p key={i} className="about__text">
              {p}
            </p>
          ))}

          <dl className="about__stats">
            {STATS.map(({ value, label }) => (
              <div key={label} className="about__stat">
                <dt className="about__stat-label">{label}</dt>
                <dd className="about__stat-value">{value}</dd>
              </div>
            ))}
          </dl>

          <ul className="about__values">
            {VALUES.map(({ Icon, title, text }) => (
              <li key={title} className="about__value">
                <span className="about__value-icon">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="about__value-title">{title}</h3>
                  <p className="about__value-text">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}