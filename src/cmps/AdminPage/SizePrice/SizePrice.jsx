import './SizePrice.scss';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Controls from '../../Controls/Controls';
import { useForm } from '../../../hooks/useForm';
import { pricesService } from '../../../services/pricesService';
import { sizePriceService } from '../../../services/sizePriceService';
import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles(() => ({
  gridTag: {
    marginTop: '15px!important',
    marginRight: '15px!important',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  marginTop: {
    marginTop: '10px!important',
  },
}));

const val = {
  amount: '',
  size: '',
  priceForSizePrice: '',
  removeSizePrice: '',
};
// idToEdit: '',
// editSizePrice: {
//   amount: '',
//   size: '',
//   priceForSizePrice: '',
// }

export const SizePrice = (props) => {
  const classes = useStyles();
  const [prices, setPrices] = useState();
  const [sizePrices, setSizePrices] = useState();
  const { values, handleInputChange } = useForm(val, false);
  useEffect(() => {
    pricesService.getPrices({ include: false }).then((res) => {
      setPrices(res);
    });
    sizePriceService.getSizePrices().then((data) => {
      var arr = [];
      data.map((sizePrice) => {
        const newObj = { ...sizePrice, displayName: 'מחיר:  ' + sizePrice.amount + ' ' + 'כמות: ' + sizePrice.size };
        arr.push(newObj);
      });
      setSizePrices(arr);
    });
  }, []);
  const addSizePrice = () => {
    const data = {
      size: values.size,
      amount: values.amount,
      priceId: values.priceForSizePrice,
    };
    sizePriceService.addSizePrice(data).then((res) => {
      console.log('add Size Price');
    });
  };
  const removeSizePrice = () => {
    sizePriceService.removeSizePrice(values.removeSizePrice).then((res) => {
      console.log('remove size price');
    });
  };
  return (
    <Grid>
      <Grid className={classes.gridTag}>
        <Typography variant="h5">הוספה</Typography>
        <Controls.Input
          className={classes.marginTop}
          label="מחיר"
          value={values.amount}
          onChange={handleInputChange}
          name="amount"
        ></Controls.Input>
        <Controls.Input
          className={classes.marginTop}
          label="כמות"
          value={values.size}
          onChange={handleInputChange}
          name="size"
        ></Controls.Input>
        {prices && (
          <Controls.Select
            className={classes.marginTop}
            label="שיוך מחיר למחירון"
            name="priceForSizePrice"
            value={values.priceForSizePrice}
            options={prices}
            onChange={handleInputChange}
          />
        )}
        <Controls.Button
          className={classes.marginTop}
          text="הוסף מחיר"
          onClick={() => addSizePrice()}
        ></Controls.Button>
      </Grid>
      <Grid className={classes.gridTag}>
        <Typography variant="h5">מחיקה</Typography>
        {sizePrices && (
          <Controls.Select
            className={classes.marginTop}
            label="מחיר למחיקה"
            name="removeSizePrice"
            value={values.removeSizePrice}
            options={sizePrices}
            onChange={handleInputChange}
          />
        )}
        <Controls.Button
          className={classes.marginTop}
          text="מחק מחיר"
          onClick={() => removeSizePrice()}
        ></Controls.Button>
      </Grid>
    </Grid>
  );
};
