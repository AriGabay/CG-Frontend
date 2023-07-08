import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  optionsBtn: {
    maxWidth: '270px',
  },
  typography: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
    width: '350px',
  },
});

export const PriceForBox = ({ product, setProductOrder }) => {
  const [priceToShow, setPriceToShow] = useState(0);
  const shekel = '₪';
  const classes = useStyles();
  const updateOrder = (price) => {
    setPriceToShow(price.amount);
    setProductOrder({
      sizeToOrder: Number(price.size),
      product,
      priceToShow: price.amount,
    });
  };
  useEffect(() => {
    return () => {
      setPriceToShow(0);
    };
  }, [product?.id]);

  return product ? (
    <Grid>
      {product.Price.SizePrices.map((price) => (
        <Stack key={price.id} direction="row" spacing={1} my={2}>
          <Button
            className={classes.optionsBtn}
            variant="outlined"
            onClick={() => {
              updateOrder(price);
            }}
          >
            <Grid className={classes.typography}>
              <Typography>קופסה בגודל של {price.size} גרם</Typography>
              <Typography>|</Typography>
              <Typography>
                מחיר: {price.amount}
                {shekel}
              </Typography>
            </Grid>
          </Button>
        </Stack>
      ))}
      {priceToShow !== 0
        ? priceToShow && (
            <Typography>
              מחיר: {priceToShow}
              {shekel}
            </Typography>
          )
        : 'נא לבחור גודל מוצר'}
    </Grid>
  ) : (
    <CircularProgress></CircularProgress>
  );
};
