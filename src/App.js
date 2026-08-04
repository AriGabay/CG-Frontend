import React from 'react';
import { HomePage } from './pages/HomePage/HomePage';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { ProductPreview } from './pages/ProductPreview';
import { AppHeader } from './cmps/AppHeader/AppHeader';
import { PageViewTracker } from './cmps/PageViewTracker/PageViewTracker';
import { Footer } from './cmps/design/Footer';
import SimpleSnackbar from './cmps/Snackbar/Snackbar';
import { AdminPage } from './pages/AdminPage/AdminPage';
import { About } from './pages/About/About';
import { Contact } from './pages/Contact/Contact';
import { CheckoutOrder } from './pages/CheckoutOrder/CheckoutOrder';
import {
  Route,
  Switch,
  Redirect,
  BrowserRouter,
  useParams,
} from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import getCustomTheme from './hooks/getCustomTheme';
import Loadable from 'react-loadable';
import CircularProgress from '@mui/material/CircularProgress';
import { AccessibilityAnnouncement } from './pages/AccessibilityAnnouncement';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { NotFound } from './pages/NotFound';
import { NotEnable } from './pages/NotEnable';
const customTheme = getCustomTheme();

const Loading = (props) => {
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
  },
});

/**
 * The redesigned menu is a single flat, filterable grid, so the old
 * per-category product pages no longer exist. Keep their URLs alive and send
 * them to the menu with that category pre-selected, rather than 404ing links
 * that are already indexed or bookmarked.
 */
const LegacyCategoryRedirect = () => {
  const { categoryId, menuType } = useParams();
  return <Redirect to={`/menu/${menuType}?cat=${categoryId}`} />;
};

function App() {
  return (
    <CssBaseline>
      <ThemeProvider theme={customTheme}>
        <BrowserRouter>
          <PageViewTracker />
          <AppHeader />
          <div className="App">
            <Switch>
              <Route exact path="/">
                <HomePage />
              </Route>
              <Route path="/404">
                <NotFound />
              </Route>
              <Route path="/notEnable">
                <NotEnable />
              </Route>

              <Route path="/menu/weekend">
                <Menu menuType="weekend" />
              </Route>
              <Route path="/menu/tishray">
                <Menu menuType="tishray" />
              </Route>
              <Route path="/menu/pesach">
                <Menu menuType="pesach" />
              </Route>

              <Route path="/products/:categoryId/:menuType">
                <LegacyCategoryRedirect />
              </Route>

              <Route path="/product/:productId">
                <ProductPreview />
              </Route>
              <Route exact path="/adminPage">
                <AdminPage />
              </Route>
              <Route exact path="/login">
                <LoginPage />
              </Route>
              <Route exact path="/checkout">
                <CheckoutOrder />
              </Route>
              <Route exact path="/about">
                <About />
              </Route>
              <Route exact path="/contact">
                <Contact />
              </Route>
              <Route exact path="/AccessibilityAnnouncement">
                <AccessibilityAnnouncement />
              </Route>
              <Route exact path="/privacy">
                <PrivacyPolicy />
              </Route>

              <Route path="*">
                <NotFound />
              </Route>
            </Switch>
          </div>
          <Footer />
          <SimpleSnackbar></SimpleSnackbar>
        </BrowserRouter>
      </ThemeProvider>
    </CssBaseline>
  );
}

export default App;

