import React, { useState, useEffect, Fragment } from 'react';
import { cartService } from '../../services/cartService';
import { ImageCloud } from '../../cmps/ImageCloud/ImageCloud';
import { UserDetailsForm } from '../../cmps/UserDetailsForm/UserDetailsForm';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import { Helmet } from 'react-helmet';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    flexDirection: 'row',
    '@media (max-width: 700px)': {
      flexDirection: 'column!important',
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
    marginRight: '64px!important',
    marginLeft: '20px!important',

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
    <Fragment>
      <Helmet>
        <title>Catering Gabay - Checkout</title>
        <meta name="robots" content="noindex" />
        <meta name="robots" content="all" />
      </Helmet>
      <Grid mt={6} className={classes.root}>
        <Grid item sm={6} style={{ width: '100%' }}>
          <Container>
            <Typography
              mr={'20px'}
              textAlign="start"
              aria-label={'סיכום הזמנה'}
              fontSize={'4rem'}
              variant="h1"
            >
              סיכום הזמנה:
            </Typography>
          </Container>
          {cart.map((product, index) => {
            return (
              <Grid mt={2} item key={index} className={classes.productCard}>
                <Paper variant="outlined" className={classes.Paper}>
                  <Typography
                    variant="h2"
                    component="h2"
                    style={{ fontSize: '1.25rem', fontWeight: 400 }}
                  >
                    {product.displayName}
                  </Typography>
                  <Typography>
                    {product.Price.priceType === 'weight' && (
                      <span> {product.sizeToOrder} גרם</span>
                    )}
                    {product.Price.priceType === 'unit' && (
                      <span>{product.sizeToOrder} יחידות </span>
                    )}
                    {product.Price.priceType === 'box' && (
                      <span>
                        קופסה בגודל {product.sizeToOrder}{' '}
                        {product.categoryId === 1 || product.categoryId === '1'
                          ? 'מליליטר'
                          : 'גרם'}
                      </span>
                    )}
                  </Typography>
                  <Typography>
                    מחיר : {product.pricePerSize.toFixed(2)}
                    {shekel}
                  </Typography>
                  <ImageCloud
                    imageId={product.imgUrl}
                    maxWidth={350}
                    maxHeight={300}
                    alt={`תמונה של מוצר ${
                      product.displayName ? product.displayName : product.id
                    }`}
                  ></ImageCloud>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
        {totalPrice && cart && tax && unTax && (
          <Grid item sm={3} className={classes.formSide}>
            <Typography
              aria-label={'פרטי ההזמנה'}
              fontSize={'2rem'}
              variant="h2"
            >
              פרטי הזמנה:
            </Typography>
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
    </Fragment>
  ) : (
    <CircularProgress />
  );
};
