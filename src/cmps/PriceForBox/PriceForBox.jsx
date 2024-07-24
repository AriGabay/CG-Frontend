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
    border: '2px solid !important',
    color: '#674e31 !important',
  },
  typography: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
    width: '350px',
    '&:hover': {
      transform: 'scale(1.05)',
    },
    '& > *': {
      fontWeight: 600 + '!important',
    },
  },
});

export const PriceForBox = ({ product, setProductOrder }) => {
  const [priceToShow, setPriceToShow] = useState(0);
  const [label, setLabel] = useState('גרם');
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
    if (product.categoryId === 1 || product.categoryId == '1') {
      setLabel('ליטר');
    }
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
              {label.length && (
                <Typography>
                  קופסה בגודל של {price.size} {label}
                </Typography>
              )}
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
