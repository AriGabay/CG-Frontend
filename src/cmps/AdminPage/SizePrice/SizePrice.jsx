import './SizePrice.scss';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Controls from '../../Controls/Controls';
import { useForm } from '../../../hooks/useForm';
import { pricesService } from '../../../services/pricesService';
import { sizePriceService } from '../../../services/sizePriceService';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
const useStyles = makeStyles(() => ({
  gridTag: {
    marginTop: '15px!important',
    marginRight: '15px!important',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'column!important'
  },
  marginTop: {
    marginTop: '10px!important'
  }
}));

const val = {
  amount: '',
  size: '',
  priceForSizePrice: '',
  removeSizePrice: '',
  editSizePrice: ''
};
// idToEdit: '',
// editSizePrice: {
//   amount: '',
//   size: '',
//   priceForSizePrice: '',
// }

export const SizePrice = () => {
  const classes = useStyles();
  const [prices, setPrices] = useState();
  const [sizePrices, setSizePrices] = useState();
  const [sizePriceToEdit, setSizePriceToEdit] = useState();
  const { values, handleInputChange } = useForm(val, false);
  useEffect(() => {
    async function start() {
      const prices = await pricesService.getPrices({ include: false });
      setPrices(prices);
      const data = await sizePriceService.getSizePrices();
      const arr = [];
      if (data && data.length) {
        data.forEach((sizePrice) => {
          prices.forEach((price) => {
            if (sizePrice.priceId === price.id) {
              arr.push({
                ...sizePrice,
                displayName: `${price.displayName} , מחיר : ${sizePrice.amount}, כמות : ${sizePrice.size}`
              });
            }
          });
        });
      }
      setSizePrices(arr);
    }
    start();
  }, []);
  const addSizePrice = () => {
    const data = {
      size: values.size,
      amount: values.amount,
      priceId: values.priceForSizePrice
    };
    sizePriceService.addSizePrice(data).then(() => {
      console.log('add Size Price');
    });
  };
  const removeSizePrice = () => {
    sizePriceService.removeSizePrice(values.removeSizePrice).then(() => {
      console.log('remove size price');
    });
  };
  const getSizePriceById = ({ target }) => {
    sizePriceService.getSizePriceById(target.value, false).then((res) => {
      setSizePriceToEdit(res[0]);
    });
  };
  const editSizePrice = (e) => {
    const { target } = e;
    const { name, value } = target;
    const newSizePrice = { ...sizePriceToEdit, [name]: Number(value) };
    setSizePriceToEdit(newSizePrice);
  };
  const updateSizePrice = () => {
    sizePriceService
      .updateSizePrice(sizePriceToEdit)
      .then(() => console.log(`complete edit: ${sizePriceToEdit.displayName}`));
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
        <Typography>משקל - לפי 100 גרם</Typography>
        <Typography> יחידה- דוגמה : אם מוסיפים מחיר לפי 2 יחידות המינימום הזמנה של המוצר הזה יהיה 2 יחידות </Typography>
        <Controls.Button
          className={classes.marginTop}
          text="הוסף מחיר"
          onClick={() => addSizePrice()}
        ></Controls.Button>
      </Grid>
      <Grid className={classes.gridTag}>
        <Typography variant="h5">מחיקה</Typography>
        {sizePrices && prices && (
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
      <Grid className={classes.gridTag}>
        <Typography variant="h5">עריכה</Typography>
        {sizePrices && (
          <Controls.Select
            label="מחירון לעריכה"
            name="editSizePrice"
            value={values.editSizePrice}
            options={sizePrices}
            onChange={(event) => getSizePriceById(event)}
          />
        )}
        {sizePriceToEdit && (
          <Grid className={classes.gridTag}>
            <Controls.Input
              className={classes.marginTop}
              label="מחיר"
              value={sizePriceToEdit.amount}
              onChange={(event) => editSizePrice(event)}
              name="amount"
            ></Controls.Input>
            <Controls.Input
              className={classes.marginTop}
              label="כמות"
              value={sizePriceToEdit.size}
              onChange={(event) => editSizePrice(event)}
              name="size"
            ></Controls.Input>
            {prices && (
              <Controls.Select
                className={classes.marginTop}
                label="שיוך מחיר למחירון"
                name="priceId"
                value={sizePriceToEdit.priceId}
                options={prices}
                onChange={(event) => editSizePrice(event)}
              />
            )}
            <Controls.Button
              className={classes.marginTop}
              text="עדכן מוצר"
              onClick={() => updateSizePrice()}
            ></Controls.Button>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};
