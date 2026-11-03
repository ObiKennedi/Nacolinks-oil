// Contact details from the official letterhead.
export const CONTACT = {
  phone: '+234 813 318 7315',
  phoneHref: 'tel:+2348133187315',
  whatsapp: 'https://wa.me/2348133187315',
  email: 'contact@nacolinks.com',
  headOffice: 'No 1A Papa William’s Avenue, Umuguma, Owerri West L.G.A, Imo State, Nigeria.',
  branch: 'Umuokwe / Okwudor Road, Awo Omamma, Oru-East L.G.A, Imo State.',
  hours: 'Open daily · 6:00 AM – 10:00 PM',
};

// Web3Forms endpoint & Access Key
export const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT || 'https://api.web3forms.com/submit';
export const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || '0e478724-2214-4807-bfc9-0111b29153d7';

export const ENQUIRY_TYPES = [
  'General enquiry',
  'Fleet account',
  'Bulk diesel / supply',
  'Feedback or complaint',
  'Partnership',
];
