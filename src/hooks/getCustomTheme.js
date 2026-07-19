import { createTheme } from '@mui/material/styles';
import { colors, fonts, radii } from '../styles/designTokens';

const customTheme = createTheme({
  typography: {
    fontFamily: ['Heebo', 'Assistant', 'sans-serif'].join(','),
    h1: { fontFamily: fonts.display },
    h2: { fontFamily: fonts.display },
    h3: { fontFamily: fonts.display },
  },
  palette: {
    background: {
      default: colors.bg,
      paper: colors.surface,
    },
    text: {
      primary: colors.text,
      secondary: colors.textMuted,
    },
    primary: {
      light: colors.greenPale,
      main: colors.green,
      dark: colors.greenDark,
      contrastText: '#FFFFFF',
    },
    secondary: {
      light: colors.cream,
      main: colors.text,
      dark: '#2E211B',
      contrastText: '#FFFFFF',
    },
    error: {
      main: colors.danger,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: radii.pill,
          fontWeight: 700,
          textTransform: 'none',
        },
        containedPrimary: {
          backgroundColor: colors.green,
          color: '#FFFFFF',
          '&:hover': { backgroundColor: colors.greenDeep },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: radii.sm,
          backgroundColor: colors.surfaceAlt,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: radii.lg },
      },
    },
  },
  direction: 'rtl',
});

const getCustomTheme = () => {
  return customTheme;
};

export default getCustomTheme;
