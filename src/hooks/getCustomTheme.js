import { createTheme } from '@material-ui/core';

const customTheme = createTheme({
  palette: {
    primary: {
      light: '#ecdfbc',
      main: '#b9ad8c',
      dark: '#897e5f',
      contrastText: '#000000',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
  direction: 'rtl',
});

const getCustomTheme = () => {
  return customTheme;
};

export default getCustomTheme;
