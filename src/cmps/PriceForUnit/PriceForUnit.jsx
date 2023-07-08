import React, { useEffect, useState, useCallback } from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import CircularProgress from '@mui/material/CircularProgress';
import { PlusMinus } from '../PlusMinus';
import { useSelector } from 'react-redux';
import _ from 'lodash';

const useStyles = makeStyles({
  marginTop: {
    marginTop: '25px',
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
});

export const PriceForUnit = ({ productOrder, setProductOrder }) => {
  let product = useSelector((state) => _.cloneDeep(state.product));
  if (!Object.keys(product).length) product = { ...productOrder };
  const [unitInput, setUnitInput] = useState(0);
  const [priceToShow, setPriceToShow] = useState(0);
  const shekel = '₪';
  const classes = useStyles();
  const setProps = useCallback(() => {
    setProductOrder(productOrder);
  }, [setProductOrder, productOrder]);
  useEffect(() => {
    setProps();
  }, [setProps]);
  useEffect(() => {
    return () => {
      setPriceToShow(0);
      setUnitInput(0);
    };
  }, [productOrder?.id]);
  const updateOrder = (size) => {
    if (size === 0 || size === '0' || !size) return;
    setUnitInput(size);
    const calc =
      (size / product.Price.SizePrices[0].size) *
      product.Price.SizePrices[0].amount;
    setPriceToShow(calc);
    setProductOrder({ sizeToOrder: Number(size), product, priceToShow: calc });
  };
  return product && !!Object.keys(product).length ? (
    <Grid>
      <Grid className={classes.buttonPlusMinus}>
        <TextField
          required
          type="number"
          style={{ width: '150px' }}
          aria-label="יחידות"
          InputProps={{
            inputProps: {
              max: 100,
              min: product.Price.SizePrices[0].size,
              step: product.Price.SizePrices[0].size,
            },
          }}
          label="יחידות"
          value={unitInput}
          onChange={(event) => updateOrder(event.target.value)}
          onKeyDown={(event) =>
            (event.target.value === '0' || event.target.value === 0) ??
            event.preventDefault()
          }
          onKeyPress={(event) => event.preventDefault()}
        />
        {product.Price && (
          <PlusMinus
            type="unit"
            size={product.Price}
            input={unitInput}
            updateOrder={updateOrder}
          ></PlusMinus>
        )}
      </Grid>
      <Typography>לשינוי כמות המוצר יש להשתמש בחצים</Typography>
      <Grid>
        {priceToShow !== 0 ? (
          priceToShow && (
            <Typography mt={2} mb={2}>
              מחיר: {priceToShow}
              {shekel}
            </Typography>
          )
        ) : (
          <Typography mt={2} mb={2}>
            נא לבחור כמות יחידות
          </Typography>
        )}
      </Grid>
    </Grid>
  ) : (
    <CircularProgress></CircularProgress>
  );
};
