import './App.scss';
import { HomePage } from './pages/HomePage/HomePage';
import { Menu } from './pages/Menu/Menu';
import { ProductsList } from './pages/ProductsList/ProductsList';
import { ProductPreview } from './pages/ProductPreview';
import { AppHeader } from './cmps/AppHeader/AppHeader';
import SimpleSnackbar from './cmps/Snackbar/Snackbar';
import { AdminPage } from './pages/AdminPage/AdminPage';
import { CheckoutOrder } from './pages/CheckoutOrder/CheckoutOrder';
import { Route, BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@material-ui/core';

function App() {
  return (
    <CssBaseline>
      <div className="App">
        <BrowserRouter>
          <AppHeader />
          {/* <Route render={(props) => <RobotEdit number={number} {...props} />} path='/robot/edit/:id?' /> */}
          <Route component={Menu} path="/menu/" />
          <Route exact={true} component={ProductsList} path="/products/:categoryId/" />
          <Route component={ProductPreview} path="/product/:productId/" />
          {/* <Route component={About} path='/about' /> */}
          {/* <PrivateRoute component={About} isAdmin={true} path='/about' /> */}
          <Route exact component={AdminPage} path="/admin" />
          <Route exact component={CheckoutOrder} path="/checkout" />
          <Route exact component={HomePage} path="/" />
          <SimpleSnackbar></SimpleSnackbar>
        </BrowserRouter>
      </div>
    </CssBaseline>
  );
}

export default App;
