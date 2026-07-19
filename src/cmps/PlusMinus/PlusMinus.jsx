import React from 'react';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/AddOutlined';
import RemoveIcon from '@mui/icons-material/RemoveOutlined';
import { makeStyles } from '@mui/styles';
import { colors } from '../../styles/designTokens';

const useStyles = makeStyles({
  buttons: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column !important',
    // The document is RTL (`dir="rtl"` on <html>), where `margin-right` is the
    // INLINE-START side. Both call sites dissolve this wrapper with
    // `display: contents`, so the margin never renders today — but keep the
    // side faithful to the original in case that ever changes.
    marginInlineStart: '10px',
  },
  // 44x44 hit area (WCAG 2.2 AA 2.5.8 floors at 24x24; 44x44 is the mobile
  // norm). `& svg` pins the glyph at the 22px it has always rendered at, so
  // the icon is untouched; the circle itself is 2px wider/taller than the old
  // 42px button — the minimum growth needed to reach a 44px target.
  btn: {
    width: 44,
    height: 44,
    minWidth: 44,
    minHeight: 44,
    padding: 0,
    border: 0,
    borderRadius: '50%',
    background: colors.surface,
    color: colors.text,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    '& svg': { width: 22, height: 22 },
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 2,
    },
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
  // onClick lives on the <button>, not on the icon: a native button then fires
  // it for mouse, Enter and Space alike, and the whole 44px control is the
  // click target rather than just the glyph.
  return (
    <Grid className={classes.buttons}>
      <button
        type="button"
        className={classes.btn}
        aria-label="הוסף כמות"
        onClick={plus}
      >
        <AddIcon />
      </button>
      <button
        type="button"
        className={classes.btn}
        aria-label="הורד כמות"
        onClick={minus}
      >
        <RemoveIcon />
      </button>
    </Grid>
  );
};
