// Single source of content for Home and the nav.
// Anything marked `placeholder: true` is not final and renders with a PLACEHOLDER tag.

export const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export const url = (path: string) => `${base}${path}`;

export const email = 'tymartin34@gmail.com';
export const resumePdf = '/resume/Tyler-Martin-Resume.pdf';

export const pillars = [
  {
    n: '01',
    slug: 'investor',
    name: 'Investor',
    theme: 'Capital markets',
    stat: '5',
    statLabel: 'memos written',
    placeholder: false,
  },
  {
    n: '02',
    slug: 'builder',
    name: 'Builder',
    theme: 'Artificial intelligence',
    stat: '0',
    statLabel: 'projects shipped',
    placeholder: false,
  },
  {
    n: '03',
    slug: 'athlete',
    name: 'Athlete',
    theme: 'Endurance sports',
    stat: '2,740',
    statLabel: 'miles in 2026',
    placeholder: false,
  },
  {
    n: '04',
    slug: 'traveler',
    name: 'Traveler',
    theme: 'Travel',
    stat: '19',
    statLabel: 'countries',
    placeholder: false,
  },
];

// Secondary pages, shown in the nav after the four pillars.
export const pages = [
  { slug: 'experience', name: 'Experience' },
  { slug: 'principles', name: 'Principles' },
];

// Tyler's bio, merged with the resume summary. `intro` sits in the hero, `about` in the About section.
export const bio = {
  intro:
    'Curious thinker drawn to hard problems and good conversations. I’m especially interested in where entrepreneurship, global economics, and emerging technology meet.',
  about: [
    'Currently, I’m an Investment Analyst at HIMCO, where I support the management of a $120B portfolio spanning fixed income, securitized products, real estate, and private equity. My focus is the market implications of emerging technology and geopolitics, and I lead AI initiatives through internal tool development.',
    'Previously, I graduated from the University of Connecticut in 2025 with degrees in Economics and Political Science. Along the way, I won national case competitions, led programming for TEDxHarvardSquare, spoke at TEDxUConn, and helped lead a $2.1M fundraiser for Connecticut Children’s.',
    'Outside of work, Ironman training, solo backpacking, and volunteering reflect a bias toward challenge, resilience, and lifelong learning.',
  ],
};

export const resume = {
  // One entry per company; roles newest first. The Experience page draws the
  // roles on a single timeline so a promotion reads as one employer.
  work: [
    {
      org: 'Hartford Investment Management Company (HIMCO)',
      place: 'Hartford, CT',
      dates: '2024 — Present',
      roles: [
        {
          role: 'Investment Analyst, Portfolio Management',
          dates: '2025 — Present',
          bullets: [
            'Support insurance portfolio management at a top-decile asset manager overseeing $120B+ in AUM.',
            'Assess macroeconomic and geopolitical themes (inflation, AI, labor market, geopolitics) to inform portfolio positioning.',
            'Participate in 100+ investment committees across asset classes, gaining a thorough ability to stress-test investment theses.',
            'Led various AI initiatives, including Copilot Studio and 3 custom Power BI dashboards distributed to 80+ employees daily.',
          ],
        },
        {
          role: 'Intern, Strategy',
          dates: '2024',
          bullets: [
            'Researched private market–insurance asset convergence and delivered a 10-year industry outlook for traditional and alternative managers.',
            'Developed familiarity across all teams, including Private Equity, Infrastructure, Real Estate, IG/HY, and structured products.',
          ],
        },
      ],
    },
  ],
  education: [
    {
      org: 'University of Connecticut',
      role: 'BA, Economics and Political Science',
      place: 'Storrs, CT',
      dates: 'May 2025',
      bullets: [
        'Cumulative GPA: 3.86 / 4.00.',
        'Teaching Assistant for Corporate Strategy, Policy, and Planning (Spring 2025).',
        'Studied abroad in Florence, Italy (2024).',
      ],
    },
  ],
  competitions: [
    {
      title: 'Honors Strategy Consulting Case Competition',
      host: 'UConn School of Business',
      result: 'Team Leader · 1st place',
      year: '2025',
      note: 'Consulted Amphenol (Fortune 200) on M&A integration, culture, and re/nearshoring; presented to 3 C-suite members.',
    },
    {
      title: 'Kogod National Strategy Case Competition',
      host: 'American University',
      result: 'Team Leader · 1st place',
      year: '2025',
      note: 'Led a team of 5 analysing the economics and incentive structure of the EV infrastructure industry.',
    },
    {
      title: 'Honors Leveraged Finance Case Competition',
      host: 'UConn School of Business',
      result: 'Team Member · 1st place',
      year: '2024',
      note: 'Pitched a $5.7B leveraged buyout to a panel of 5 alumni.',
    },
  ],
  leadership: [
    {
      title: 'TEDxHarvardSquare',
      host: 'Cambridge, MA',
      result: 'Director of Programming',
      year: '2025',
      note: 'Programmed a ~150-attendee conference on climate finance, AI, and community building; later gave my own talk at TEDxUConn.',
    },
    {
      title: 'HuskyTHON',
      host: 'Storrs, CT',
      result: 'Morale Leadership Board',
      year: '2023 — 2025',
      note: 'Helped raise over $2.1M (+18% YoY) for Connecticut Children’s Hospital.',
    },
  ],
  skills: ['Excel', 'Power BI', 'Power Automate', 'Copilot Studio', 'PowerPoint', 'Aladdin'],
};

export const principles = {
  asOf: 'Sep 2026',
  items: [
    'Go One More.',
    'Pursue discomfort daily.',
    'Obsession will always beat talent.',
    'Chase leverage & non-linearity.',
    'Build a stack of undeniable proof that you are who you say you are.',
    'Surround yourself with people who make you better.',
    'Do not underestimate the impact of your environment.',
    'Be curious, not judgmental.',
    'Talk to strangers.',
    'Be a traveler – not a tourist.',
    'Embrace imperfections – they make you human.',
    'Be a paradox.',
    'Life is finite – be present.',
    'Approach all aspects of life with radiating enthusiasm.',
    'Learn to dance in the rain.',
  ],
};

// Investor page. Titles and subtitles only: no memo text, no downloads.
// These are working placeholders until Tyler confirms the final list.
export const memos = {
  placeholder: true,
  items: [
    {
      title: 'Who Pays for the Road?',
      subtitle: 'Debt-funded AI capex on assets that depreciate in five years.',
    },
    {
      title: 'Tollbooths and Toll-Takers',
      subtitle: 'Where value actually accrues in the AI chain.',
    },
    {
      title: 'France Isn’t Greece. That’s the Problem.',
      subtitle: 'Too big to bail out, too stuck to fix.',
    },
    {
      title: 'Data Center Slowdown. What Happens Now?',
      subtitle: 'Winners, losers, and the AI IPO window.',
    },
    {
      title: 'Open vs. Closed: Who Keeps the Moat?',
      subtitle: 'What near-frontier open models do to AI pricing power.',
    },
  ],
};
