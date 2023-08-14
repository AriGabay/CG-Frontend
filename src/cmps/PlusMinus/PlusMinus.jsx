import React from 'react';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/AddOutlined';
import RemoveIcon from '@mui/icons-material/RemoveOutlined';
import { makeStyles } from '@mui/styles';
const useStyles = makeStyles({
  buttons: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column !important',
    marginRight: '10px',
  },
});

export const PlusMinus = ({ type, size, input, updateOrder }) => {
  const classes = useStyles();
  const minus = () => {
    if (
      input - size.SizePrices[0].size < 0 ||
      input - size.SizePrices[0].size === 0
    )
      return;
    if (type === 'weight') {
      const weight = Number(input) - Number(size.SizePrices[0].size);
      updateOrder(weight);
    } else if (type === 'unit') {
      const unit = Number(input) - Number(size.SizePrices[0].size);
      updateOrder(unit);
    }
  };
  const plus = () => {
    if (type === 'weight') {
      const weight = Number(input) + Number(size.SizePrices[0].size);
      updateOrder(weight);
    } else if (type === 'unit') {
      const unit = Number(input) + Number(size.SizePrices[0].size);
      updateOrder(unit);
    }
  };
  return (
    <Grid className={classes.buttons}>
      <button
        aria-label="הוסף כמות"
        style={{ background: 'white', color: 'black', border: 0 }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            plus();
          }
        }}
      >
        <AddIcon onClick={() => plus()}></AddIcon>
      </button>
      <button
        aria-label="הורד כמות"
        style={{ background: 'white', color: 'black', border: 0 }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            minus();
          }
        }}
      >
        <RemoveIcon onClick={() => minus()}></RemoveIcon>
      </button>
    </Grid>
  );
};
