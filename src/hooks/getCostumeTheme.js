import createMuiTheme from '@material-ui/core/styles/createMuiStrictModeTheme';
const getCostumeTheme = () => {
  const costumeTheme = createMuiTheme({
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
  });
  return costumeTheme;
};

export default getCostumeTheme;
