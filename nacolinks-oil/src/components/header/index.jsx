import { useEffect, useRef, useState } from 'react';
import { Phone, MapPin, ChevronRight, Menu, X, Clock } from 'lucide-react';
import { FaWhatsapp, FaFacebookF, FaInstagram } from 'react-icons/fa6';
import logo from '../../assets/nacolinks-logo.png';
import './index.scss';

// Each href must match a section id on the page
const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Fuel Prices', href: '#prices' },
  { label: 'Stations', href: '#stations' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

// Highlights the link whose section is currently in view
function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

const SECTION_IDS = NAV_LINKS.map((l) => l.href.slice(1));

const PHONE_DISPLAY = '+234 813 318 7315';
const PHONE_HREF = 'tel:+2348133187315';

// Replace with the real handles
const SOCIAL_LINKS = [
  { label: 'WhatsApp', href: 'https://wa.me/2348133187315', Icon: FaWhatsapp },
  { label: 'Facebook', href: 'https://facebook.com/nacolinksoil', Icon: FaFacebookF },
  { label: 'Instagram', href: 'https://instagram.com/nacolinksoil', Icon: FaInstagram },
];

function Socials({ className = '' }) {
  return (
    <ul className={`header__socials ${className}`.trim()}>
      {SOCIAL_LINKS.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            className="header__social"
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
  );
}

export default function Header() {
  const activeId = useActiveSection(SECTION_IDS);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const toggleRef = useRef(null);

  const isActive = (href) => href === `#${activeId}`;

  // Shadow once the page scrolls
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll + close on Escape while the mobile menu is open
  useEffect(() => {
    if (!isOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  // Close if the viewport grows past the mobile breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e) => e.matches && setIsOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <header
      className={[
        'header',
        isScrolled && 'header--scrolled',
        isOpen && 'header--open',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="header__stripe" aria-hidden="true" />

      {/* Top bar — desktop only */}
      <div className="header__topbar">
        <div className="header__container header__topbar-inner">
          <p className="header__topbar-text">
            <Clock className="header__icon" size={14} aria-hidden="true" />
            Open daily · Owerri West &amp; Awo Omamma, Imo State
          </p>
          <div className="header__topbar-right">
            <a className="header__topbar-phone" href={PHONE_HREF}>
              <Phone className="header__icon" size={14} aria-hidden="true" />
              {PHONE_DISPLAY}
            </a>
            <Socials className="header__socials--topbar" />
          </div>
        </div>
      </div>

      <div className="header__container header__bar">
        <a href="#home" className="header__brand" aria-label="Nacolinks Oil and Gas — Home">
          <img
            src={logo}
            alt="Nacolinks Oil and Gas Ltd."
            width={1002}
            height={720}
            className="header__logo"
            fetchPriority="high"
          />
        </a>

        <nav className="header__nav" aria-label="Primary">
          <ul className="header__list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href} className="header__item">
                <a
                  href={href}
                  className={`header__link${isActive(href) ? ' header__link--active' : ''}`}
                  aria-current={isActive(href) ? 'page' : undefined}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__actions">
          <a href="#stations" className="header__cta">
            <MapPin className="header__icon" size={18} aria-hidden="true" />
            <span>Find a station</span>
          </a>

          <button
            ref={toggleRef}
            type="button"
            className="header__toggle"
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsOpen((o) => !o)}
          >
            {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className="header__overlay"
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
      />
      <div
        id="mobile-menu"
        className="header__drawer"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <nav aria-label="Mobile">
          <ul className="header__drawer-list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a
                  href={href}
                  className={`header__drawer-link${isActive(href) ? ' header__drawer-link--active' : ''}`}
                  aria-current={isActive(href) ? 'page' : undefined}
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                  <ChevronRight className="header__icon header__icon--chevron" size={18} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header__drawer-footer">
          <a href="#stations" className="header__cta header__cta--block" onClick={() => setIsOpen(false)}>
            <MapPin className="header__icon" size={18} aria-hidden="true" />
            <span>Find a station</span>
          </a>
          <a className="header__drawer-phone" href={PHONE_HREF}>
            <Phone className="header__icon" size={16} aria-hidden="true" />
            {PHONE_DISPLAY}
          </a>
          <Socials className="header__socials--drawer" />
        </div>
      </div>
    </header>
  );
}