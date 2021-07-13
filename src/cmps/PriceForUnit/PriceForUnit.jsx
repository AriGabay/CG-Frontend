import './PriceForUnit.scss';
import { useEffect, useState, useCallback } from 'react';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles({
  marginTop: {
    marginTop: '25px',
  },
  addToCartBtn: {
    background: 'linear-gradient(90deg, hsla(36, 50%, 30%, 1) 0%, hsla(36, 35%, 56%, 0.8) 90%)',
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
});

export const PriceForUnit = ({ productProps, productOrder, setProductOrder }) => {
  const [product, setProduct] = useState();
  const [priceToShow, setPriceToShow] = useState(0);
  const shekel = '₪';
  const classes = useStyles();
  const setProps = useCallback(() => {
    setProduct(productProps);
    setProductOrder(productOrder);
  }, [setProductOrder, setProduct, productOrder, productProps]);
  useEffect(() => {
    setProps();
  }, [setProps]);
  const updateOrder = (size) => {
    const calc = size * product.Price.SizePrices[0].amount;
    setPriceToShow(calc);
    setProductOrder({ sizeToOrder: Number(size), product, priceToShow: calc });
  };

  return product ? (
    <div>
      <Typography mt={2}>
        מחיר ליחידה :{product.Price.SizePrices[0].amount}
        {shekel}{' '}
      </Typography>
      <Grid className={classes.marginTop}>
        <TextField
          required
          type="number"
          InputProps={{
            inputProps: {
              max: 100,
              min: 1,
            },
          }}
          label="יחידות"
          onChange={(event) => updateOrder(event.target.value)}
        />
      </Grid>
      <Box>
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
      </Box>
    </div>
  ) : (
    <CircularProgress></CircularProgress>
  );
};
