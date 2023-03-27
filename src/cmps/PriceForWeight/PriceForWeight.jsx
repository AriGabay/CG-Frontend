import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/styles';
import { PlusMinus } from '../PlusMinus';
const useStyles = makeStyles({
  marginTop: {
    marginTop: 20,
    marginBottom: 0,
    padding: 0,
  },
  addToCartBtn: {
    background:
      'linear-gradient(90deg, hsla(36, 50%, 30%, 1) 0%, hsla(36, 35%, 56%, 0.8) 90%)',
    borderRadius: 3,
    color: 'white',
    height: 48,
    padding: 30,
    paddingTop: 0,
    paddingBottom: 0,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
  Grid: {
    display: 'flex',
    flexDirection: 'row',
    direction: 'row',
    justify: 'space-evenly',
    alignItems: 'center',
    paddingRight: 30,
    paddingLeft: 30,
  },
  buttonPlusMinus: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 0,
    padding: 0,
  },
  inputDisableUpDown: {
    '& input[type=number]': {
      '-moz-appearance': 'textfield',
    },
    '& input[type=number]::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
    '& input[type=number]::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0,
    },
  },
});

export const PriceForWeight = ({ product, setProductOrder }) => {
  const [priceToShow, setPriceToShow] = useState(0);
  const [weightInput, setWeightInput] = useState(0);
  const shekel = '₪';
  const classes = useStyles();
  const updateOrder = (weight) => {
    if (!weight && weight === '0') return;
    setWeightInput(weight);
    const calc = product.Price.SizePrices[0].amount * (weight / 100);
    setPriceToShow(calc.toFixed(2));
    setProductOrder({
      sizeToOrder: Number(weight),
      product,
      priceToShow: Number(calc.toFixed(2)),
    });
  };
  useEffect(() => {
    return () => {
      setPriceToShow(0);
      setWeightInput(0);
    };
  }, [product?.id]);
  return product ? (
    <Grid>
      <Grid className={classes.buttonPlusMinus}>
        <TextField
          required
          autoFocus
          type="number"
          InputProps={{
            inputProps: {
              step: 100,
              max: 4000,
              min: 100,
            },
          }}
          label="גרם"
          value={weightInput}
          className={classes.inputDisableUpDown}
          disabled={true}
          onChange={(event) => updateOrder(event.target.value)}
          onKeyDown={(event) =>
            (event.target.value === '0' || event.target.value === 0) ??
            event.preventDefault()
          }
          onKeyPress={(event) => event.preventDefault()}
        />
        {product.Price && (
          <PlusMinus
            type="weight"
            size={product.Price}
            input={weightInput}
            updateOrder={updateOrder}
          ></PlusMinus>
        )}
      </Grid>
      <Typography>לשינוי כמות המוצר יש להשתמש בחצים</Typography>
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
