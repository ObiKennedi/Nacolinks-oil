// Nacolinks stations. Addresses are from the official letterhead.
// TODO (client to confirm): opening hours, products per station, services and exact map pins.
// `mapQuery` drives both the embedded map and the "Get directions" link —
// swap in "lat,lng" for a precise pin once you have coordinates.

export const STATIONS = [
  {
    id: 'umuguma',
    name: 'Nacolinks Umuguma',
    type: 'Head office',
    address: 'No 1A Papa William’s Avenue, Umuguma',
    area: 'Owerri West L.G.A, Imo State',
    mapQuery: 'Papa William Avenue, Umuguma, Owerri West, Imo State, Nigeria',
    phone: '+234 813 318 7315',
    hours: { open: '06:00', close: '22:00' },
    hoursLabel: 'Mon – Sun · 6:00 AM – 10:00 PM',
    products: ['PMS', 'AGO', 'DPK', 'LPG'],
    services: ['Fleet accounts', 'POS & transfer', 'Gas refills'],
  },
  {
    id: 'awo-omamma',
    name: 'Nacolinks Awo Omamma',
    type: 'Branch',
    address: 'Umuokwe / Okwudor Road, Awo Omamma',
    area: 'Oru-East L.G.A, Imo State',
    mapQuery: 'Umuokwe Okwudor Road, Awo Omamma, Oru East, Imo State, Nigeria',
    phone: '+234 813 318 7315',
    hours: { open: '06:00', close: '22:00' },
    hoursLabel: 'Mon – Sun · 6:00 AM – 10:00 PM',
    products: ['PMS', 'AGO', 'DPK'],
    services: ['POS & transfer', 'Bulk diesel'],
  },
];