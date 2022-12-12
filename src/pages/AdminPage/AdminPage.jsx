import React, { useState, useEffect } from 'react';
import Button from '../../cmps/Controls/Button';
import { Category as AdminPageCategory } from '../../cmps/AdminPage/Category';
import { Price as AdminPagePrice } from '../../cmps/AdminPage/Price';
import { SizePrice as AdminPageSizePrice } from '../../cmps/AdminPage/SizePrice';
import { Product as AdminPageProduct } from '../../cmps/AdminPage/Product';
import { Menu as AdminMenu } from '../../cmps/AdminPage/Menu';
import { Orders as AdminPageOrders } from '../../cmps/AdminPage/Orders';
import { GetOrdersByData as AdminPageGetOrdersByData } from '../../cmps/AdminPage/GetOrdersByData';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import { eventBus } from '../../services/event-bus';
import { authService } from '../../services/authService';

const useStyles = makeStyles(() => ({
  marginLeft: {
    marginLeft: '10px!important',
  },
  marginTop: {
    '@media (max-width: 700px)': {
      marginTop: '10px!important',
    },
  },
}));

export const AdminPage = () => {
  const classes = useStyles();
  const [status, setStatus] = useState();
  const [userAuth, setUserAuth] = useState({});

  const handleClick = (status) => {
    setStatus(status);
  };

  useEffect(() => {
    const token = sessionStorage.getItem('user');
    if (token) {
      authService.verifyToken(token).then((res) => {
        setUserAuth(res);
      });
    }
  }, []);

  return (
    Object.keys(userAuth).length && (
      <Grid mt={2} mr={2}>
        <Button
          className={classes.marginLeft}
          text="קטגוריה"
          onClick={() => handleClick('Category')}
        />
        <Button
          className={classes.marginLeft}
          text="מחירון"
          onClick={() => handleClick('Price')}
        />
        <Button
          className={classes.marginLeft}
          text="מחיר למחירון"
          onClick={() => handleClick('SizePrice')}
        />
        <Button
          className={classes.marginLeft}
          text="מוצר"
          onClick={() => handleClick('Product')}
        />
        <Button
          className={classes.marginLeft}
          text="הזמנות"
          onClick={() => handleClick('Orders')}
        />
        <Button
          className={classes.marginLeft}
          text="נעילת תפריט"
          onClick={() => handleClick('Menu')}
        />
        <Button
          className={classes.marginLeft}
          text="הזמנות על פי תאריך"
          onClick={() => handleClick('GetOrdersByData')}
        />
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
        {status && status === 'Menu' ? (
          <Grid mt={2}>
            <AdminMenu eventBus={eventBus}></AdminMenu>
          </Grid>
        ) : null}
        {status && status === 'GetOrdersByData' ? (
          <Grid mt={2}>
            <AdminPageGetOrdersByData
              eventBus={eventBus}
            ></AdminPageGetOrdersByData>
          </Grid>
        ) : null}
      </Grid>
    )
  );
};
