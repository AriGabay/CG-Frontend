import './Price.scss';
import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Controls from '../../Controls/Controls';
import { useForm } from '../../../hooks/useForm';
import { pricesService } from '../../../services/pricesService';
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
  editPrice: '',
  priceTypeEdit: '',
};
export const Price = () => {
  const classes = useStyles();
  const [prices, setPrices] = useState();
  const [priceToEdit, setPriceToEdit] = useState();
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
      if (data && data.length) {
        const arr = data.map((price) => {
          const displayName = `${price.displayName} ${concatenateStrings(
            price.SizePrices
          )}`;
          return { ...price, displayName };
        });
        setPrices(arr);
      }
    });
  }, []);
  const addPrice = () => {
    const priceData = {
      priceType: values.selectPriceType,
      displayName: values.displayName,
    };
    pricesService.addPrice(priceData);
  };
  const removePrice = () => {
    pricesService
      .removePrice(values.removePrice)
      .then(() => console.log('end remove Price'))
      .catch((error) => console.error('can not remove Price', error));
  };
  const getPriceById = ({ target }) => {
    pricesService.getPriceById(target.value, false).then((res) => {
      setPriceToEdit(res[0]);
    });
  };
  const editPrice = ({ target }) => {
    const { name, value } = target;
    const newPrice = { ...priceToEdit, [name]: value };
    setPriceToEdit(newPrice);
  };
  const updatePrice = () => {
    pricesService
      .updatePrice(priceToEdit)
      .then(() => console.log(`complete edit: ${priceToEdit.displayName}`));
  };
  const idToPriceType = ({ target }) => {
    const { value } = target;
    if (Number(value) === 1) priceToEdit.priceType = 'box';
    else if (Number(value) === 2) priceToEdit.priceType = 'weight';
    else if (Number(value) === 3) priceToEdit.priceType = 'unit';
  };
  const priceTypeToId = () => {
    if (priceToEdit.priceType === 'box') return 1;
    else if (priceToEdit.priceType === 'weight') return 2;
    else if (priceToEdit.priceType === 'unit') return 3;
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
        <Controls.Button
          className={classes.marginTop}
          text="הוסף מחירון"
          onClick={() => addPrice()}
        ></Controls.Button>
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
      {prices && (
        <Grid className={classes.gridTag}>
          <Typography variant="h5">עריכה</Typography>
          <Controls.Select
            className={classes.marginTop}
            label="עריכה מחירון"
            name="priceToEdit"
            value={''}
            options={prices}
            onChange={(event) => getPriceById(event)}
          />
        </Grid>
      )}
      {priceToEdit && (
        <Grid className={classes.gridTag}>
          <Controls.RadioGroup
            className={classes.marginTop}
            name="priceTypeEdit"
            label="בחר סוג מחיר"
            value={priceTypeToId()}
            items={items}
            onChange={(event) => idToPriceType(event)}
          ></Controls.RadioGroup>
          <Controls.Input
            className={classes.marginTop}
            label="שם המחירון"
            value={priceToEdit.displayName}
            onChange={(event) => editPrice(event)}
            name="displayName"
          ></Controls.Input>
          <Controls.Button
            className={classes.marginTop}
            text="עריכת מחיר"
            onClick={() => updatePrice()}
          ></Controls.Button>
        </Grid>
      )}
    </Grid>
  );
};
