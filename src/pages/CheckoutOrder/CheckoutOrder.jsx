import './CheckoutOrder.scss';
import React, { useState, useEffect } from 'react';
import { cartService } from '../../services/cartService';
import { ImageCloud } from '../../cmps/ImageCloud/ImageCloud';
import { UserDetailsForm } from '../../cmps/UserDetailsForm/UserDetailsForm';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles, Paper } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    '@media (max-width: 700px)': {
      flexDirection: 'column',
    },
  },
  Paper: {
    minWidth: '250px',
    minHeight: '450px',
  },
  formSide: {
    position: 'sticky',
    bottom: 0,
    '@media (max-width: 700px)': {
      position: 'unset',

      marginRight: '20px!important',
      marginLeft: '20px!important',
    },
  },
  productCard: {
    // mr={8}
    // mb={3}
    marginRight: '64px',
    marginBottom: '24px!important',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
    '@media (max-width: 700px)': {
      marginRight: '20px!important',
      marginLeft: '20px!important',
    },
  },
  title: {},
}));

export const CheckoutOrder = () => {
  const [cart, setCart] = useState();
  const [totalPrice, setTotalPrice] = useState();
  const [tax, setTax] = useState();
  const [unTax, setUnTax] = useState();
  const classes = useStyles();
  const shekel = '₪';
  useEffect(() => {
    cartService.getCart().then((data) => {
      cartService.checkOutOrder(data).then((res) => {
        setCart(res.products);
        setTotalPrice(res.totalPrice);
        setTax(res.Tax);
        setUnTax(res.unTax);
      });
    });
  }, []);

  return cart ? (
    <Grid mt={6} className={classes.root}>
      <Grid item sm={6}>
        <Container>
          <Typography textAlign="center" variant="h4" component="h2">
            סיכום הזמנה:
          </Typography>
        </Container>
        {cart.map((product, index) => {
          return (
            <Grid mt={2} item key={index} className={classes.productCard}>
              <Paper variant="outlined" className={classes.Paper}>
                <Typography variant="h6" component="h2">
                  {product.displayName}
                </Typography>
                <Typography>
                  {product.Price.priceType === 'weight' && <span> {product.sizeToOrder} גרם</span>}
                  {product.Price.priceType === 'unit' && <span>{product.sizeToOrder} יחידות </span>}
                  {product.Price.priceType === 'box' && <span>קופסה בגודל {product.sizeToOrder} גרם</span>}
                </Typography>
                <Typography>
                  מחיר : {product.pricePerSize.toFixed(2)}
                  {shekel}
                </Typography>
                <ImageCloud imageId={product.imgUrl} maxWidth={350} maxHeight={300}></ImageCloud>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
      {totalPrice && cart && tax && unTax && (
        <Grid item sm={3} className={classes.formSide}>
          <UserDetailsForm
            totalPrice={totalPrice}
            tax={tax}
            unTax={unTax}
            checkOutTotal={cartService.checkOutTotal}
            cart={cart}
          ></UserDetailsForm>
        </Grid>
      )}
    </Grid>
  ) : (
    <CircularProgress />
  );
};
