import './PriceForBox.scss';
import { useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Stack from '@material-ui/core/Stack';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  optionsBtn: {
    maxWidth: 175,
  },
  typography: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
  },
});

export const PriceForBox = ({ product, productOrder, setProductOrder }) => {
  const [priceToShow, setPriceToShow] = useState(0);
  const shekel = '₪';
  const classes = useStyles();
  const updateOrder = (price) => {
    setPriceToShow(price.amount);
    setProductOrder({ sizeToOrder: Number(price.size), product, priceToShow: price.amount });
  };

  return product ? (
    <div>
      {product.Price.SizePrices.map((price) => (
        <Stack key={price.id} direction="row" spacing={1} my={2}>
          <Button
            className={classes.optionsBtn}
            variant="outlined"
            onClick={() => {
              updateOrder(price);
            }}
          >
            <Box className={classes.typography}>
              <Typography>קופסה בגודל של {price.size} גרם</Typography>
              <Typography>
                מחיר: {price.amount}
                {shekel}
              </Typography>
            </Box>
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
    </div>
  ) : (
    <CircularProgress></CircularProgress>
  );
};
