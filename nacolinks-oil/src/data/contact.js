// Contact details from the official letterhead.
export const CONTACT = {
  phone: '+234 813 318 7315',
  phoneHref: 'tel:+2348133187315',
  whatsapp: 'https://wa.me/2348133187315',
  email: 'contact@nacolinksoil.com',
  headOffice: 'No 1A Papa William’s Avenue, Umuguma, Owerri West L.G.A, Imo State, Nigeria.',
  branch: 'Umuokwe / Okwudor Road, Awo Omamma, Oru-East L.G.A, Imo State.',
  hours: 'Open daily · 6:00 AM – 10:00 PM', // TODO (client): confirm
};

// Form submissions: set VITE_CONTACT_ENDPOINT in .env to a Formspree / Web3Forms /
// your-own-API URL that accepts JSON POSTs. Leave it empty and the form opens WhatsApp instead.
export const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || '';

export const ENQUIRY_TYPES = [
  'General enquiry',
  'Fleet account',
  'Bulk diesel / supply',
  'Feedback or complaint',
  'Partnership',
];