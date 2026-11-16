// The one file the Traveler globe and the trip cards both read from.
//
//   id      ISO 3166-1 numeric code; matches the country shapes in world-atlas
//   slug    used for photo file names: <slug>-1.webp, <slug>-2.webp, ...
//   center  [longitude, latitude] of the middle of the country, where the globe spins to
//
// Deliberately no towns, dates or precise places: the site shows the country name and a photo only.
//
// Malta and Vatican City are too small to have a shape on the map, so the globe
// draws them as dots; their cards are the real tap target.

export type Status = 'visited' | 'upcoming';

export interface Country {
  id: string;
  slug: string;
  iso2: string;
  name: string;
  status: Status;
  center: [number, number];
}

export const countries: Country[] = [
  { id: '840', slug: 'united-states', iso2: 'US', name: 'United States', status: 'visited', center: [-98, 39] },
  { id: '124', slug: 'canada', iso2: 'CA', name: 'Canada', status: 'visited', center: [-96, 56] },
  { id: '380', slug: 'italy', iso2: 'IT', name: 'Italy', status: 'visited', center: [12.5, 42.8] },
  { id: '191', slug: 'croatia', iso2: 'HR', name: 'Croatia', status: 'visited', center: [16, 45.2] },
  { id: '276', slug: 'germany', iso2: 'DE', name: 'Germany', status: 'visited', center: [10.4, 51] },
  { id: '470', slug: 'malta', iso2: 'MT', name: 'Malta', status: 'visited', center: [14.4, 35.9] },
  { id: '203', slug: 'czech-republic', iso2: 'CZ', name: 'Czech Republic', status: 'visited', center: [15.5, 49.8] },
  { id: '620', slug: 'portugal', iso2: 'PT', name: 'Portugal', status: 'visited', center: [-8.2, 39.6] },
  { id: '724', slug: 'spain', iso2: 'ES', name: 'Spain', status: 'visited', center: [-3.7, 40.2] },
  { id: '504', slug: 'morocco', iso2: 'MA', name: 'Morocco', status: 'visited', center: [-6.5, 32] },
  { id: '826', slug: 'united-kingdom', iso2: 'GB', name: 'United Kingdom', status: 'visited', center: [-2, 54] },
  { id: '336', slug: 'vatican-city', iso2: 'VA', name: 'Vatican City', status: 'visited', center: [12.45, 41.9] },
  { id: '348', slug: 'hungary', iso2: 'HU', name: 'Hungary', status: 'visited', center: [19.4, 47.2] },
  { id: '756', slug: 'switzerland', iso2: 'CH', name: 'Switzerland', status: 'visited', center: [8.2, 46.8] },
  { id: '372', slug: 'ireland', iso2: 'IE', name: 'Ireland', status: 'visited', center: [-8, 53.3] },
  { id: '352', slug: 'iceland', iso2: 'IS', name: 'Iceland', status: 'visited', center: [-18.7, 65] },
  { id: '578', slug: 'norway', iso2: 'NO', name: 'Norway', status: 'visited', center: [9, 61.5] },
  { id: '604', slug: 'peru', iso2: 'PE', name: 'Peru', status: 'visited', center: [-75, -10] },

  { id: '320', slug: 'guatemala', iso2: 'GT', name: 'Guatemala', status: 'upcoming', center: [-90.3, 15.6] },
  { id: '208', slug: 'denmark', iso2: 'DK', name: 'Denmark', status: 'upcoming', center: [10, 56] },
  { id: '752', slug: 'sweden', iso2: 'SE', name: 'Sweden', status: 'upcoming', center: [15.5, 61] },
  { id: '764', slug: 'thailand', iso2: 'TH', name: 'Thailand', status: 'upcoming', center: [101, 15] },
  { id: '634', slug: 'qatar', iso2: 'QA', name: 'Qatar', status: 'upcoming', center: [51.2, 25.3] },
  { id: '704', slug: 'vietnam', iso2: 'VN', name: 'Vietnam', status: 'upcoming', center: [106, 16] },
];

export const stats = {
  // Fixed at 19 on Tyler's instruction: one visited country is counted but deliberately not shown.
  countries: 19,
  states: 32,
  upcoming: countries.filter((c) => c.status === 'upcoming').length,
};
