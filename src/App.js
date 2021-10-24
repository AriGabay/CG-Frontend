import './App.scss';
import React from 'react';
import { HomePage } from './pages/HomePage/HomePage';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { ProductPreview } from './pages/ProductPreview';
import { AppHeader } from './cmps/AppHeader/AppHeader';
import SimpleSnackbar from './cmps/Snackbar/Snackbar';
import { AdminPage } from './pages/AdminPage/AdminPage';
import { About } from './pages/About/About';
import { Contact } from './pages/Contact/Contact';
import { CheckoutOrder } from './pages/CheckoutOrder/CheckoutOrder';
import { Route, HashRouter } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import getCustomTheme from './hooks/getCustomTheme';
import dotenv from 'dotenv';
import Loadable from 'react-loadable';
import CircularProgress from '@material-ui/core/CircularProgress';

dotenv.config();
const customTheme = getCustomTheme();

const Loading = (props) => {
  console.log('props.error:', props);
  if (props.error) {
    return (
      <div>
        Error! <button onClick={props.retry}>Retry</button>
      </div>
    );
  } else {
    return <CircularProgress />;
  }
};

const Menu = Loadable({
  loader: async () => await import('./pages/Menu/Menu'),
  loading: Loading,
  render(loader, props) {
    const { Menu } = loader;
    return <Menu {...props} />;
  }
});

const ProductsList = Loadable({
  loader: async () => await import('./pages/ProductsList/ProductsList'),
  loading: Loading,
  render(loader, props) {
    const { ProductsList } = loader;
    return <ProductsList {...props} />;
  }
});

function App() {
  return (
    <CssBaseline>
      <ThemeProvider theme={customTheme}>
        <div className="App">
          <HashRouter>
            <AppHeader />
            <Route path="/menu/weekend">
              <Menu menuType="weekend" />
            </Route>
            <Route path="/menu/tishray">
              <Menu menuType="tishray" />
            </Route>
            <Route path="/menu/pesach">
              <Menu menuType="pesach" />
            </Route>
            <Route path="/products/:categoryId/weekend/">
              <ProductsList productsType="weekend" />
            </Route>
            <Route path="/products/:categoryId/tishray/">
              <ProductsList productsType="tishray" />
            </Route>
            <Route path="/products/:categoryId/pesach/">
              <ProductsList productsType="pesach" />
            </Route>
            <Route component={ProductPreview} path="/product/:productId/" />
            <Route exact component={AdminPage} path="/adminPage" />
            <Route exact component={LoginPage} path="/login" />
            <Route exact component={CheckoutOrder} path="/checkout" />
            <Route exact component={About} path="/about" />
            <Route exact component={Contact} path="/contact" />
            <Route exact component={HomePage} path="/" />
            <SimpleSnackbar></SimpleSnackbar>
          </HashRouter>
        </div>
      </ThemeProvider>
    </CssBaseline>
  );
}

export default App;
