import { Phone, Mail, MapPin, Clock, ArrowUp, ShieldCheck } from 'lucide-react';
import { FaWhatsapp, FaFacebookF, FaInstagram } from 'react-icons/fa6';
import logo from '../../assets/nacolinks-logo.png';
import { CONTACT } from '../../data/contact';
import { STATIONS } from '../../data/stations';
import './index.scss';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Today’s Fuel Prices', href: '#prices' },
  { label: 'Our Stations', href: '#stations' },
  { label: 'About Nacolinks', href: '#about' },
  { label: 'Contact Us', href: '#contact' },
];

const PRODUCTS = [
  { label: 'Petrol (PMS)', href: '#prices' },
  { label: 'Diesel (AGO)', href: '#prices' },
  { label: 'Kerosene (DPK)', href: '#prices' },
  { label: 'Cooking Gas (LPG)', href: '#prices' },
  { label: 'Bulk Supply & Haulage', href: '#contact' },
];

const SOCIAL_LINKS = [
  { label: 'WhatsApp', href: CONTACT.whatsapp || 'https://wa.me/2348133187315', Icon: FaWhatsapp },
  { label: 'Facebook', href: 'https://facebook.com/nacolinksoil', Icon: FaFacebookF },
  { label: 'Instagram', href: 'https://instagram.com/nacolinksoil', Icon: FaInstagram },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer" role="contentinfo">
      {/* Signature letterhead stripe */}
      <div className="footer__stripe" aria-hidden="true" />

      <div className="footer__container">
        {/* Forecourt trust banner */}
        <div className="footer__banner">
          <div className="footer__banner-text">
            <h3>Need bulk diesel or business fleet fueling?</h3>
            <p>We deliver certified, accurately metered fuel direct to your site or facility across Imo State.</p>
          </div>
          <a href="#contact" className="footer__banner-action">
            <Phone size={16} aria-hidden="true" />
            <span>Speak with commercial sales</span>
          </a>
        </div>

        {/* 4-column layout */}
        <div className="footer__grid">
          {/* Column 1: Brand & Profile */}
          <div className="footer__col footer__col--brand">
            <a href="#home" className="footer__logo-link" aria-label="Nacolinks Oil and Gas — Home">
              <img
                src={logo}
                alt="Nacolinks Oil and Gas Ltd."
                width={1002}
                height={720}
                className="footer__logo"
                loading="lazy"
              />
            </a>
            <p className="footer__desc">
              Independent downstream petroleum marketer delivering clean, accurately metered fuels and cooking gas to motorists, businesses, and homes across Imo State.
            </p>
            <div className="footer__rc-badge">
              <ShieldCheck size={14} aria-hidden="true" />
              <span>RC NUMBER: 1075987</span>
            </div>
            <ul className="footer__socials" aria-label="Social media profiles">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    className="footer__social"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Nacolinks on ${label}`}
                  >
                    <Icon aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Navigation */}
          <div className="footer__col">
            <h4 className="footer__title">Navigation</h4>
            <ul className="footer__links">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="footer__link">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Products */}
          <div className="footer__col">
            <h4 className="footer__title">Products</h4>
            <ul className="footer__links">
              {PRODUCTS.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="footer__link">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Stations & Contacts */}
          <div className="footer__col">
            <h4 className="footer__title">Stations &amp; Contact</h4>
            <div className="footer__contacts">
              {STATIONS.map((station) => (
                <div key={station.id} className="footer__station">
                  <span className="footer__station-name">
                    <MapPin size={14} aria-hidden="true" />
                    {station.name} ({station.type})
                  </span>
                  <p className="footer__station-addr">{station.address}, {station.area}</p>
                </div>
              ))}

              <div style={{ paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <a className="footer__contact-line" href={CONTACT.phoneHref}>
                  <Phone size={14} aria-hidden="true" />
                  <span>{CONTACT.phone}</span>
                </a>
                <a className="footer__contact-line" href={`mailto:${CONTACT.email}`}>
                  <Mail size={14} aria-hidden="true" />
                  <span>{CONTACT.email}</span>
                </a>
                <span className="footer__contact-line" style={{ color: '#94a3b8' }}>
                  <Clock size={14} aria-hidden="true" />
                  <span>{CONTACT.hours}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-bar */}
      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <p className="footer__copy">
            &copy; {currentYear} <strong>Nacolinks Oil and Gas Ltd.</strong> (RC 1075987). All rights reserved.
          </p>
          <p className="footer__motto">
            Honest Measure &bull; Quality-Tested Fuel &bull; Close to Home
          </p>
          <a href="#home" onClick={scrollToTop} className="footer__top-btn" aria-label="Back to top">
            <span>Back to top</span>
            <ArrowUp size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}

