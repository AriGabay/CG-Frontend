import { createTheme } from '@material-ui/core/styles';

const customTheme = createTheme({
  palette: {
    primary: {
      light: '#543912',
      main: '#937446',
      dark: '#8C6F44',
      contrastText: '#FFFFFF',
    },
    // primary: {
    //   light: '#ecdfbc',
    //   main: '#b9ad8c',
    //   dark: '#897e5f',
    //   contrastText: '#000000',
    // },
    // secondary: {
    //   light: '#ff7961',
    //   main: '#f44336',
    //   dark: '#ba000d',
    //   contrastText: '#000',
    // },
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
