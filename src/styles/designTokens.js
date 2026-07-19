// Design tokens for the 2026 redesign.
// Source of truth: the Claude Design project "קייטרינג גבאי".
// Everything visual in the new pages should read from here rather than
// hard-coding hex values, so a palette change stays a one-file change.

export const colors = {
  // surfaces
  bg: '#F5F1EA',
  surface: '#FFFFFF',
  surfaceAlt: '#FBF9F4',
  surfaceSunken: '#EAE1D3',

  // text
  text: '#43312A',
  textSoft: '#54453B',
  textMuted: '#7A6A60',
  textFaint: '#A0917F',

  // brand greens
  green: '#6E9271',
  greenDeep: '#5F8262',
  greenLink: '#52704F',
  greenDark: '#3B5340',
  greenPale: '#DCE7D5',
  greenInk: '#4E6B52',

  // accents
  blue: '#4E6480',
  blueLight: '#6C82A0',
  cream: '#EFE6D6',
  border: '#E9E0D3',
  borderInput: '#E4DAC9',
  danger: '#B5361F',
};

export const fonts = {
  display: "'Suez One', serif",
  body: "'Heebo', sans-serif",
};

export const radii = {
  sm: '12px',
  md: '16px',
  lg: '22px',
  xl: '28px',
  pill: '999px',
};

export const shadows = {
  card: '0 20px 34px -20px rgba(67,49,42,.4)',
  cardSoft: '0 14px 26px -16px rgba(67,49,42,.35)',
  btnGreen: '0 14px 30px -12px rgba(71,98,74,.55)',
  float: '0 22px 42px -20px rgba(67,49,42,.5)',
};

export const layout = {
  maxWidth: 1200,
  pad: '0 22px',
};

// Gradient fallbacks, keyed by the real Category ids in the database.
// Used behind product imagery while it loads and for categories with no photo.
export const categoryGradients = {
  1: 'linear-gradient(140deg,#B9D6BE,#8ABF9C)', // סלטים
  3: 'linear-gradient(140deg,#CDB49A,#A5835F)', // מטוגנים
  4: 'linear-gradient(140deg,#D8CFAE,#B0A472)', // פחמימות וירקות
  5: 'linear-gradient(140deg,#E0C9A6,#BE9A66)', // עופות
  6: 'linear-gradient(140deg,#C9A794,#A2715A)', // בשרים
  7: 'linear-gradient(140deg,#AFD0C9,#7BA69C)', // דגים
  8: 'linear-gradient(140deg,#B8CCA4,#8AA377)', // צמחוני/טבעוני
  9: 'linear-gradient(140deg,#D3C3A5,#AC9268)', // פשטידות
  10: 'linear-gradient(140deg,#E2C7B0,#C09578)', // מרקים
  12: 'linear-gradient(140deg,#BEC9E0,#93A3C4)', // רטבים מיוחדים
};

export const fallbackGradient = 'linear-gradient(140deg,#B8CCA4,#8AA377)';

export function gradientFor(categoryId) {
  return categoryGradients[categoryId] || fallbackGradient;
}

const tokens = {
  colors,
  fonts,
  radii,
  shadows,
  layout,
  categoryGradients,
  fallbackGradient,
  gradientFor,
};

export default tokens;
