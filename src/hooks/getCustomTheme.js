import { createTheme } from '@mui/material/styles';

const customTheme = createTheme({
  typography: {
    fontFamily: ['Assistant', 'assistant'].join(','),
  },
  palette: {
    primary: {
      light: '#543912',
      main: '#937446',
      dark: '#8C6F44',
      contrastText: '#FFFFFF',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {},
        containedPrimary: {
          backgroundColor: '#937446',
          color: '#FFFFFF',
        },
      },
    },
  },
  direction: 'rtl',
});

const getCustomTheme = () => {
  return customTheme;
};

export default getCustomTheme;
