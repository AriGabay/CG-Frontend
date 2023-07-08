import React, { useState, useEffect } from 'react';
import Button from '../../cmps/Controls/Button';
import { Category as AdminPageCategory } from '../../cmps/AdminPage/Category';
import { Price as AdminPagePrice } from '../../cmps/AdminPage/Price';
import { SizePrice as AdminPageSizePrice } from '../../cmps/AdminPage/SizePrice';
import { Product as AdminPageProduct } from '../../cmps/AdminPage/Product';
import { Menu as AdminMenu } from '../../cmps/AdminPage/Menu';
import { Orders as AdminPageOrders } from '../../cmps/AdminPage/Orders';
import { OrderByDate as AdminPageOrderByDate } from '../../cmps/AdminPage/OrderByDate';
import { GetOrdersByData as AdminPageGetOrdersByData } from '../../cmps/AdminPage/GetOrdersByData';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import { eventBus } from '../../services/event-bus';
import { authService } from '../../services/authService';
import { GnCategory } from '../../cmps/AdminPage/GannayEyalon/GnCategory/GnCategory';
import { GnProduct } from '../../cmps/AdminPage/GannayEyalon/GnProduct';

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
        <Button
          className={classes.marginLeft}
          text="הזמנות לתאריך ספציפי"
          onClick={() => handleClick('OrderByDate')}
        />
        <Button
          className={classes.marginLeft}
          text="קטגוריות - גני איילון"
          onClick={() => handleClick('GnCategory')}
        />
        <Button
          className={classes.marginLeft}
          text="מוצר - גני איילון"
          onClick={() => handleClick('GnProduct')}
        />
        <Button
          className={classes.marginLeft}
          text="ענן תמונות"
          onClick={() => handleClick('GetCloudinaryDetails')}
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
        {status && status === 'OrderByDate' ? (
          <Grid mt={2}>
            <AdminPageOrderByDate eventBus={eventBus}></AdminPageOrderByDate>
          </Grid>
        ) : null}
        {status && status === 'GnCategory' ? (
          <Grid mt={2}>
            <GnCategory eventBus={eventBus}></GnCategory>
          </Grid>
        ) : null}
        {status && status === 'GnProduct' ? (
          <Grid mt={2}>
            <GnProduct eventBus={eventBus}></GnProduct>
          </Grid>
        ) : null}
        {status && status === 'GetOrdersByData' ? (
          <Grid mt={2}>
            <AdminPageGetOrdersByData
              eventBus={eventBus}
            ></AdminPageGetOrdersByData>
          </Grid>
        ) : null}
        {status && status === 'GetCloudinaryDetails' ? (
          <Grid mt={2}>
            <h1>פרטי התחברות :</h1>
            <a
              title="link"
              target="_blank"
              rel="noopener noreferrer"
              href="https://cloudinary.com/users/login"
            >
              קישור
            </a>
            <h4>שם משתמש : arigabay199875@gmail.com </h4>
          </Grid>
        ) : null}
      </Grid>
    )
  );
};
