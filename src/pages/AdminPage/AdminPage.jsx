import './AdminPage.scss';
import { useState } from 'react';
import Button from '../../cmps/Controls/Button';
import { Category as AdminPageCategory } from '../../cmps/AdminPage/Category';
import { Price as AdminPagePrice } from '../../cmps/AdminPage/Price';
import { SizePrice as AdminPageSizePrice } from '../../cmps/AdminPage/SizePrice';
import { Product as AdminPageProduct } from '../../cmps/AdminPage/Product';
import { Orders as AdminPageOrders } from '../../cmps/AdminPage/Orders';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import { eventBus } from '../../services/event-bus';
const useStyles = makeStyles(() => ({
  marginLeft: {
    marginLeft: '10px!important'
  },
  marginTop: {
    '@media (max-width: 700px)': {
      marginTop: '10px!important'
    }
  }
}));

export const AdminPage = (props) => {
  const classes = useStyles();
  const [status, setStatus] = useState();
  const handleClick = (status) => {
    setStatus(status);
  };

  return (
    <Grid mt={2} mr={2}>
      <Button className={classes.marginLeft} text="קטגוריה" onClick={() => handleClick('Category')} />
      <Button className={classes.marginLeft} text="מחירון" onClick={() => handleClick('Price')} />
      <Button className={classes.marginLeft} text="מחיר למחירון" onClick={() => handleClick('SizePrice')} />
      <Button className={classes.marginLeft} text="מוצר" onClick={() => handleClick('Product')} />
      <Button className={classes.marginLeft} text="הזמנות" onClick={() => handleClick('Orders')} />
      {status && status === 'Category' ? (
        <Grid mt={2}>
          <AdminPageCategory eventBus={eventBus}></AdminPageCategory>
        </Grid>
      ) : null}
      {status && status === 'Price' ? (
        <Grid mt={2}>
          <AdminPagePrice eventBus={eventBus}></AdminPagePrice>
        </Grid>
      ) : null}
      {status && status === 'SizePrice' ? (
        <Grid mt={2}>
          <AdminPageSizePrice eventBus={eventBus}></AdminPageSizePrice>
        </Grid>
      ) : null}
      {status && status === 'Product' ? (
        <Grid mt={2}>
          <AdminPageProduct eventBus={eventBus}></AdminPageProduct>
        </Grid>
      ) : null}
      {status && status === 'Orders' ? (
        <Grid mt={2}>
          <AdminPageOrders eventBus={eventBus}></AdminPageOrders>
        </Grid>
      ) : null}
    </Grid>
  );
};
