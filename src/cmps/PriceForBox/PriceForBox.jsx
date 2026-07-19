import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';
import {
  priceInfo,
  money,
  measureUnitFor,
} from '../../services/viewModel.service';
import { colors, radii, fonts } from '../../styles/designTokens';

const useStyles = makeStyles({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  label: {
    fontWeight: 700,
    fontSize: 14,
    color: colors.textSoft,
  },
  options: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
    // Floor for the 44px tap target. Inert at the current metrics (15px text +
    // 26px padding + 3px border = 47px) — it only matters if the font changes.
    minHeight: 44,
    border: `1.5px solid ${colors.borderInput}`,
    background: colors.surfaceAlt,
    borderRadius: radii.sm,
    padding: '13px 16px',
    fontSize: 15,
    fontWeight: 600,
    fontFamily: fonts.body,
    color: colors.text,
    cursor: 'pointer',
    transition: 'border-color .13s, background .13s, color .13s',
    '&:hover': { borderColor: colors.green },
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 2,
    },
  },
  optionActive: {
    borderColor: colors.green,
    background: colors.greenPale,
    color: colors.greenInk,
  },
  optionPrice: {
    fontWeight: 800,
    whiteSpace: 'nowrap',
  },
  totalRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    paddingTop: 12,
    borderTop: `1px solid ${colors.border}`,
  },
  totalLabel: {
    fontWeight: 700,
    fontSize: 15,
    color: colors.textSoft,
  },
  total: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.greenLink,
  },
  hint: {
    fontSize: 14,
    fontWeight: 600,
    color: colors.textFaint,
  },
  unavailable: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    fontSize: 15,
    fontWeight: 600,
    color: colors.textSoft,
  },
  unavailableTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.greenLink,
  },
  phone: {
    color: colors.greenLink,
    fontWeight: 800,
  },
});

/**
 * Discrete box sizes: every SizePrice is its own option and the shopper pays
 * that option's `amount`. Sizes are millilitres for סלטים, grams elsewhere.
 */
export const PriceForBox = ({ product, setProductOrder }) => {
  const classes = useStyles();
  const [selectedKey, setSelectedKey] = useState(null);
  const [priceToShow, setPriceToShow] = useState(0);

  useEffect(() => {
    setSelectedKey(null);
    setPriceToShow(0);
  }, [product?.id]);

  if (!product) return <CircularProgress />;

  const info = priceInfo(product);
  const unit = measureUnitFor(product);
  const labelId = `box-size-label-${product.id}`;

  const keyOf = (option) => String(option.id ?? option.size);

  const updateOrder = (option) => {
    setSelectedKey(keyOf(option));
    setPriceToShow(option.amount);
    setProductOrder({
      sizeToOrder: Number(option.size),
      product,
      priceToShow: option.amount,
    });
  };

  if (!info.available) {
    return (
      <div className={classes.unavailable}>
        <span className={classes.unavailableTitle}>לפרטים בטלפון</span>
        <span>
          למוצר זה אין מחיר מוגדר באתר. להזמנה חייגו{' '}
          <a className={classes.phone} href="tel:04-6734949">
            04-6734949
          </a>
        </span>
      </div>
    );
  }

  return (
    <div className={classes.wrap}>
      <div className={classes.label} id={labelId}>
        בחרו גודל קופסה
      </div>
      <div className={classes.options} role="group" aria-labelledby={labelId}>
        {info.options.map((option) => {
          const active = selectedKey === keyOf(option);
          return (
            <button
              type="button"
              key={keyOf(option)}
              className={`${classes.option} ${
                active ? classes.optionActive : ''
              }`}
              aria-pressed={active}
              onClick={() => updateOrder(option)}
            >
              <span>
                קופסה {option.size} {unit}
              </span>
              <span className={classes.optionPrice}>{money(option.amount)}</span>
            </button>
          );
        })}
      </div>
      <div className={classes.totalRow}>
        {priceToShow ? (
          <>
            <span className={classes.totalLabel}>{'סה"כ'}</span>
            <span className={classes.total}>{money(priceToShow)}</span>
          </>
        ) : (
          <span className={classes.hint}>נא לבחור גודל מוצר</span>
        )}
      </div>
    </div>
  );
};
