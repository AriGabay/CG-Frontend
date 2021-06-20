import './PriceForWeight.scss';
import { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles({
  marginTop: {
    marginTop: 20,
    marginBottom: 0,
    padding: 0,
  },
  addToCartBtn: {
    background:
      'linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(9, 38, 121, 0.919502835313813) 0%, rgba(0, 212, 255, 1) 100%)',
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

export const PriceForWeight = ({ product, productOrder, setProductOrder }) => {
  const [priceToShow, setPriceToShow] = useState(0);
  const shekel = '₪';
  const classes = useStyles();
  const updateOrder = (weight) => {
    weight = weight / 10;
    const calc = product.Price.SizePrices[0].amount * weight;
    setPriceToShow(calc.toFixed(2));
    setProductOrder({ sizeToOrder: Number(weight * 10), product, priceToShow: Number(calc.toFixed(2)) });
  };

  return product ? (
    <div>
      <Typography>
        מחיר לקילו : {product.Price.SizePrices[0].amount * 100}
        {shekel}
      </Typography>
      <Container className={classes.marginTop}>
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
          onChange={(event) => updateOrder(event.target.value)}
        />
      </Container>
      {priceToShow !== 0
        ? priceToShow && (
            <Typography>
              מחיר: {priceToShow}
              {shekel}
            </Typography>
          )
        : 'נא לבחור גודל מוצר'}
    </div>
  ) : (
    <CircularProgress></CircularProgress>
  );
};
