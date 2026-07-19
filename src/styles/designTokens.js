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

  // Text ramp. Every value here clears WCAG 2.0 AA (4.5:1) on both `surface`
  // and `bg` — IS 5568, the Israeli accessibility standard, adopts AA.
  // Verify with the ratios in the comments before changing any of these.
  text: '#43312A', //  12.27 on white
  textSoft: '#54453B', //  9.16 on white
  textMuted: '#7A6A60', //  5.17 on white / 4.60 on bg
  // was #A0917F — only 3.07 on white and 2.72 on bg, a real AA failure on
  // product descriptions, serving labels and section eyebrows.
  textFaint: '#766B5E', //  5.20 on white / 4.62 on bg

  // Brand greens. `green` is used as a button background under white text, so
  // it must itself clear 4.5:1 against white. The original #6E9271 was 3.49.
  green: '#5F7E61', //  4.52 with white text
  // `greenDeep` is the hover state for green buttons, so it must be DARKER than
  // `green` and clear 4.5:1 itself. The old #5F8262 was tuned against the old
  // #6E9271; once `green` was darkened it became *lighter* than the resting
  // state (luminance .1928 vs .1822), so hover lit the button up and dropped it
  // to 4.32:1. Keep this strictly darker than `green` if either is retuned.
  greenDeep: '#546F55', //  5.55 with white text, luminance .1391
  greenLink: '#52704F',
  greenDark: '#3B5340',
  greenPale: '#DCE7D5',
  greenInk: '#4E6B52',

  // accents
  blue: '#4E6480', //  6.07 with white text
  // was #6C82A0 — 3.93 with white text. This is the light end of the Shabbat
  // band gradient, so it is the worst case for any text sitting on the band.
  blueLight: '#5C6E88', //  5.20 with white text
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
