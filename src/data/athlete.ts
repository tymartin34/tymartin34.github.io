import routeShapes from './routes.json';

// Athlete page data. Hard-coded on purpose: numbers are typed in (or pulled once
// from Garmin later) and never refreshed live.

// 2026 totals, as supplied by Tyler. Time is stored in minutes.
export const wrapped = {
  year: 2026,
  sports: [
    { key: 'run', label: 'Run', distance: '850', unit: 'mi', minutes: 121 * 60 + 14 },
    { key: 'bike', label: 'Bike', distance: '1,848', unit: 'mi', minutes: 116 * 60 + 46 },
    { key: 'swim', label: 'Swim', distance: '74,116', unit: 'yd', minutes: 22 * 60 + 11 },
  ],
};

export const hm = (minutes: number) => `${Math.floor(minutes / 60)} h ${minutes % 60} m`;

// kind decides the drawing on the card:
//   run   -> one route line
//   tri   -> swim, bike and run lines overlaid in three colours
//   hyrox -> 8 runs + 8 stations (it is indoors, so there is no route)
// The lines are sketches for now; real GPS tracks replace them later (race routes only).
export type RaceKind = 'run' | 'tri' | 'hyrox';

export interface Race {
  name: string;
  kind: RaceKind;
  format: string;
  result: string; // finish time, or 'TBD'
  note?: string; // e.g. 'Cancelled'
  date?: string;
  // Finish position within the age group, as 'top N%'. `estimated` marks a figure
  // that is NOT from official results and must be shown as an estimate.
  ageGroup?: { top: number; estimated: boolean };
  // Course outline(s), already scaled to the card's 200 x 110 drawing box. They hold
  // shapes only, no coordinates. Keyed by leg: run, or swim/bike/run for a triathlon.
  //   gps       Tyler's own recording of the race
  //   published the organiser's course, from a public course file (2024 edition)
  //   traced    drawn by hand from the organiser's course-map PDFs, so approximate
  routes?: Record<string, string>;
  routeSource?: 'gps' | 'published' | 'traced';
}

const shapes = routeShapes as Record<string, Record<string, string>>;

export const pastRaces: Race[] = [
  {
    name: 'Hartford Marathon',
    kind: 'run',
    format: 'Marathon',
    result: '3:51:54',
    ageGroup: { top: 45, estimated: true },
    routes: shapes.hartford,
    routeSource: 'gps',
  },
  { name: 'Hyrox NYC', kind: 'hyrox', format: 'Hyrox', result: '1:00:45', ageGroup: { top: 3, estimated: false } },
  { name: 'Hyrox DC', kind: 'hyrox', format: 'Hyrox', result: '1:02:56', ageGroup: { top: 5, estimated: false } },
  { name: 'Hyrox Dallas', kind: 'hyrox', format: 'Hyrox', result: '1:01:55', ageGroup: { top: 4, estimated: false } },
  { name: 'IRONMAN 70.3 Jones Beach', kind: 'tri', format: '70.3 triathlon', result: 'est. 5:15:00', note: 'Cancelled', ageGroup: { top: 30, estimated: true }, routes: shapes['jones-beach'], routeSource: 'traced' },
];

export const upcomingRaces: Race[] = [
  { name: 'Philadelphia Marathon', kind: 'run', format: 'Marathon', result: 'TBD', date: '22 Nov 2026', routes: shapes.philadelphia, routeSource: 'published' },
  { name: 'Copenhagen Marathon', kind: 'run', format: 'Marathon', result: 'TBD', date: '9 May 2027', routes: shapes.copenhagen, routeSource: 'published' },
  { name: 'IRONMAN 70.3 Lake George', kind: 'tri', format: '70.3 triathlon', result: 'TBD', routes: shapes['jones-beach'] }, // stand-in: Jones Beach shapes until this course is published
  { name: 'IRONMAN 140.3 Montana', kind: 'tri', format: '140.3 triathlon', result: 'TBD', routes: shapes['jones-beach'] }, // stand-in: Jones Beach shapes until this course is published
];

// Data-driven insights: thesis, one or two data points, and what I do about it.
// Sources: Garmin history Jun 2025 – Nov 2026 (scripts/garmin) and the per-run VO2max analysis of Apr – Nov 2026.
export const insights = [
  {
    stat: '15 of 16',
    statLabel: 'track sessions raised my VO2max',
    thesis:
      'Four Wednesday 5:45 am track sessions did more for my engine than every other run that month combined. The grinding middle did the opposite.',
    evidence: [
      '97 runs: a track session moved VO2max +0.45 on average; every other run, −0.10',
      'July: 57.0 → 58.8. The four track sessions added +1.92; the other 12 runs, −0.51',
    ],
    implication:
      'One track session a week, non-negotiable. Retire the 158 bpm steady run and flip a run split that is 48% zones 4–5.',
  },
  {
    stat: '85 → 73',
    statLabel: 'HRV in ms, after an easy day vs a hard day',
    thesis:
      'Recovery is decided at night. My HRV follows two things I control: how hard the day was and when I get to bed.',
    evidence: [
      '506 nights: HRV 85 ms after 7.5 – 8.5 h of sleep, 76 after under 6.5 h. Asleep by 10:30 pm: 84. After 11:30 pm: 77',
      'The night after 30+ minutes in zones 4–5: 73 ms. Runs after a short night were 15 s/mi slower at 150 bpm',
    ],
    implication:
      'Asleep by 10:30 the night before and the night after a hard session, and never two hard days back to back.',
  },
  {
    stat: '2.1×',
    statLabel: 'a run hour vs a bike or swim hour',
    thesis:
      'Bike and swim hours count toward running, but at half price. I spent a summer paying full price for them.',
    evidence: [
      '110 steady runs: +1.1 VO2max points per extra weekly run hour, +0.5 per bike or swim hour',
      'Summer 2026: bike and swim tripled while running sat flat at 11 – 13 hours per 4 weeks',
    ],
    implication:
      'In the 70.3 build the run hours go up with the bike and swim hours. Bike and swim are added volume, never a swap.',
  },
];
