import { useId, useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import { CONTACT, CONTACT_ENDPOINT, WEB3FORMS_ACCESS_KEY, ENQUIRY_TYPES } from '../../data/contact';
import './index.scss';

const CHANNELS = [
  {
    Icon: Phone,
    label: 'Call us',
    value: CONTACT.phone,
    href: CONTACT.phoneHref,
  },
  {
    Icon: FaWhatsapp,
    label: 'WhatsApp',
    value: 'Chat with us',
    href: CONTACT.whatsapp,
    external: true,
  },
  {
    Icon: Mail,
    label: 'Email',
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
  },
];

const INITIAL = { name: '', phone: '', email: '', type: ENQUIRY_TYPES[0], message: '', company: '' };

function validate(v) {
  const errors = {};
  if (!v.name.trim()) errors.name = 'Please enter your name.';
  const digits = v.phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 14) errors.phone = 'Enter a valid phone number, e.g. 0813 318 7315.';
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errors.email = 'That email doesn’t look right.';
  if (v.message.trim().length < 10) errors.message = 'Tell us a little more (at least 10 characters).';
  return errors;
}

function whatsappLink(v) {
  const text = [
    `Hello Nacolinks, I’m ${v.name.trim()}.`,
    `Enquiry: ${v.type}`,
    '',
    v.message.trim(),
    '',
    `Phone: ${v.phone}${v.email ? ` · Email: ${v.email}` : ''}`,
  ].join('\n');
  return `${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
}

function Field({ id, label, error, optional, children }) {
  return (
    <div className={`contact__field${error ? ' contact__field--error' : ''}`}>
      <label className="contact__label" htmlFor={id}>
        {label}
        {optional && <span className="contact__optional"> (optional)</span>}
      </label>
      {children}
      {error && (
        <p className="contact__error" id={`${id}-error`}>
          <AlertCircle size={14} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

function ContactForm() {
  const id = useId();
  const [values, setValues] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const fieldProps = (key) => ({
    id: `${id}-${key}`,
    name: key,
    value: values[key],
    onChange: set(key),
    'aria-invalid': Boolean(errors[key]),
    'aria-describedby': errors[key] ? `${id}-${key}-error` : undefined,
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (values.company) return; // honeypot — bots fill hidden fields

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`${id}-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    // No endpoint or key configured → hand off to WhatsApp
    if (!CONTACT_ENDPOINT || !WEB3FORMS_ACCESS_KEY) {
      window.open(whatsappLink(values), '_blank', 'noopener,noreferrer');
      setStatus('success');
      setValues(INITIAL);
      return;
    }

    setStatus('submitting');
    try {
      const { company, ...payload } = values;
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          from_name: 'Nacolinks Oil & Gas Website',
          subject: `New Enquiry from ${values.name} (${values.type})`,
          ...payload,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) {
        throw new Error(data.message || `HTTP ${res.status}`);
      }
      setStatus('success');
      setValues(INITIAL);
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="contact__form contact__form--done" role="status">
        <span className="contact__done-icon">
          <CheckCircle2 size={32} aria-hidden="true" />
        </span>
        <h3 className="contact__form-title">Thank you — we’ve got your message.</h3>
        <p className="contact__form-sub">
          {CONTACT_ENDPOINT && WEB3FORMS_ACCESS_KEY
            ? 'Our team will get back to you within one working day.'
            : 'Finish sending it in WhatsApp and our team will reply shortly.'}
        </p>
        <button type="button" className="contact__btn contact__btn--ghost" onClick={() => setStatus('idle')}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="contact__form" onSubmit={onSubmit} noValidate aria-labelledby={`${id}-title`}>
      <h3 id={`${id}-title`} className="contact__form-title">Send us a message</h3>
      <p className="contact__form-sub">Fleet accounts, bulk supply, feedback — we reply within one working day.</p>

      <div className="contact__grid">
        <Field id={`${id}-name`} label="Full name" error={errors.name}>
          <input className="contact__input" type="text" autoComplete="name" {...fieldProps('name')} />
        </Field>

        <Field id={`${id}-phone`} label="Phone number" error={errors.phone}>
          <input className="contact__input" type="tel" autoComplete="tel" inputMode="tel" placeholder="0813 318 7315" {...fieldProps('phone')} />
        </Field>

        <Field id={`${id}-email`} label="Email" optional error={errors.email}>
          <input className="contact__input" type="email" autoComplete="email" {...fieldProps('email')} />
        </Field>

        <Field id={`${id}-type`} label="What’s it about?">
          <select className="contact__input contact__select" {...fieldProps('type')}>
            {ENQUIRY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

        <div className="contact__span">
          <Field id={`${id}-message`} label="Message" error={errors.message}>
            <textarea className="contact__input contact__textarea" rows={5} {...fieldProps('message')} />
          </Field>
        </div>
      </div>

      {/* Honeypot */}
      <div className="contact__hp" aria-hidden="true">
        <label>
          Company
          <input type="text" tabIndex={-1} autoComplete="off" {...fieldProps('company')} />
        </label>
      </div>

      {status === 'error' && (
        <p className="contact__alert" role="alert">
          <AlertCircle size={18} aria-hidden="true" />
          <span>
            Something went wrong sending your message. Please try again, or{' '}
            <a href={whatsappLink(values)} target="_blank" rel="noopener noreferrer">
              send it on WhatsApp
            </a>
            .
          </span>
        </p>
      )}

      <button type="submit" className="contact__btn contact__btn--primary" disabled={status === 'submitting'}>
        {status === 'submitting' ? (
          <>
            <Loader2 size={18} className="contact__spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            <Send size={18} aria-hidden="true" />
            {CONTACT_ENDPOINT && WEB3FORMS_ACCESS_KEY ? 'Send message' : 'Send via WhatsApp'}
          </>
        )}
      </button>
    </form>
  );
}

export default function Contact() {
  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <div className="contact__container">
        <div className="contact__info">
          <p className="contact__eyebrow">Contact us</p>
          <h2 id="contact-title" className="contact__title">
            We’re here to help.
          </h2>
          <p className="contact__lead">
            Questions about prices, fleet accounts or bulk supply? Reach us the way that suits you.
          </p>

          <ul className="contact__channels">
            {CHANNELS.map(({ Icon, label, value, href, external }) => (
              <li key={label}>
                <a
                  className="contact__channel"
                  href={href}
                  {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                >
                  <span className="contact__channel-icon">
                    <Icon aria-hidden="true" />
                  </span>
                  <span>
                    <span className="contact__channel-label">{label}</span>
                    <span className="contact__channel-value">{value}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <ul className="contact__addresses">
            <li>
              <MapPin size={18} aria-hidden="true" />
              <span>
                <strong>Head office</strong>
                {CONTACT.headOffice}
              </span>
            </li>
            <li>
              <MapPin size={18} aria-hidden="true" />
              <span>
                <strong>Branch</strong>
                {CONTACT.branch}
              </span>
            </li>
            <li>
              <Clock size={18} aria-hidden="true" />
              <span>
                <strong>Hours</strong>
                {CONTACT.hours}
              </span>
            </li>
          </ul>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
