// Design tokens for Mindful AI
// Per PRD §9.2 palette — can be overridden by Tweaks
export const MindfulTokens = {
  // Colors (light mode)
  bg: '#FAF7F2',          // warm off-white
  bgRaised: '#FFFFFF',
  bgSunken: '#F3EEE6',
  ink: '#2A2A2B',         // charcoal
  inkSoft: '#55524D',
  inkMuted: '#8B867E',
  line: '#E8E1D5',
  lineSoft: '#F0EADF',

  primary: '#5DCAA5',      // teal lembut
  primaryDeep: '#3FA886',
  primarySoft: '#D8F0E5',

  accent: '#F0997B',       // coral hangat
  accentDeep: '#D97B5C',
  accentSoft: '#FBE3D8',

  warn: '#C89B3C',
  crisis: '#B85C4A',

  // Dark mode variants (activated by .dark)
  dark: {
    bg: '#1A1B1A',
    bgRaised: '#232523',
    bgSunken: '#121312',
    ink: '#EDE6D8',
    inkSoft: '#B8B1A3',
    inkMuted: '#7A7569',
    line: '#2E302D',
    lineSoft: '#262826',
    primarySoft: '#1E3830',
    accentSoft: '#3A2821',
  },

  // Radius, shadow
  r: { sm: 8, md: 14, lg: 22, xl: 34, pill: 999 },
};
