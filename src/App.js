import './App.scss';
import { HomePage } from './pages/HomePage/HomePage';
import { Menu } from './pages/Menu/Menu';
import { ProductsList } from './pages/ProductsList/ProductsList';
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
const customTheme = getCustomTheme();

function App() {
  return (
    <CssBaseline>
      <ThemeProvider theme={customTheme}>
        <div className="App">
          <HashRouter>
            <AppHeader />
            {/* <Route component={Menu} path="/menu/" /> */}
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
            {/* <Route component={ProductsList} path="/products/:categoryId/" /> */}
            <Route component={ProductPreview} path="/product/:productId/" />
            <Route exact component={AdminPage} path="/admin" />
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
