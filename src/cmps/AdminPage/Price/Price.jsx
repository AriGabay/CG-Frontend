import './Price.scss';
import Grid from '@material-ui/core/Grid';
import Controls from '../../Controls/Controls';
import { useForm } from '../../../hooks/useForm';
import { pricesService } from '../../../services/pricesService';
import { useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
const useStyles = makeStyles(() => ({
  gridTag: {
    marginTop: '15px!important',
    marginRight: '15px!important',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'column!important',
  },
  marginTop: {
    marginTop: '10px!important',
  },
}));

const val = {
  selectPriceType: '',
  displayName: '',
  removePrice: '',
};
export const Price = () => {
  const classes = useStyles();
  const [prices, setPrices] = useState();
  const { values, handleInputChange } = useForm(val, false);
  const items = [
    { id: 1, title: 'קופסה' },
    {
      id: 2,
      title: 'משקל',
    },
    {
      id: 3,
      title: 'יחידה',
    },
  ];
  useEffect(() => {
    pricesService.getPrices({ include: true }).then((data) => {
      const concatenateStrings = (sizePrices) => {
        return sizePrices
          .map((sizePrice) => {
            return `Size: ${sizePrice.size}, Amount: ${sizePrice.amount}.`;
          })
          .join(' ');
      };

      const arr = data.map((price) => {
        const displayName = `${price.displayName} ${concatenateStrings(price.SizePrices)}`;
        return { ...price, displayName };
      });

      setPrices(arr);
    });
  }, []);
  const addPrice = () => {
    const data = {
      priceType: values.selectPriceType,
      displayName: values.displayName,
    };
    pricesService.addPrice(data);
  };
  const removePrice = () => {
    pricesService
      .removePrice(values.removePrice)
      .then(() => console.log('end remove Price'))
      .catch((error) => console.error('can not remove Price', error));
  };
  return (
    <Grid>
      <Grid className={classes.gridTag}>
        <Typography variant="h5">הוספה</Typography>
        <Controls.RadioGroup
          className={classes.marginTop}
          name="selectPriceType"
          label="בחר סוג מחיר"
          value={values.selectPriceType}
          items={items}
          onChange={handleInputChange}
        ></Controls.RadioGroup>
        <Controls.Input
          className={classes.marginTop}
          label="שם המחירון"
          value={values.displayName}
          onChange={handleInputChange}
          name="displayName"
        ></Controls.Input>
        <Controls.Button className={classes.marginTop} text="הוסף מחירון" onClick={() => addPrice()}></Controls.Button>
      </Grid>
      {prices && (
        <Grid className={classes.gridTag}>
          <Typography variant="h5">מחיקה</Typography>
          <Controls.Select
            className={classes.marginTop}
            label="מחירון למחיקה"
            name="removePrice"
            value={values.removePrice}
            options={prices}
            onChange={handleInputChange}
          />
          <Controls.Button
            className={classes.marginTop}
            text="מחק מחירון"
            onClick={() => removePrice()}
          ></Controls.Button>
        </Grid>
      )}
    </Grid>
  );
};
