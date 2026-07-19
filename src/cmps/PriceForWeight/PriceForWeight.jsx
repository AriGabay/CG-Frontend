import React, { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';
import { PlusMinus } from '../PlusMinus';
import { priceInfo, money } from '../../services/viewModel.service';
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
  // The +/- controls come from <PlusMinus>, which renders its own wrapper div.
  // `display:contents` dissolves that wrapper so the two buttons become flex
  // items here and can be ordered around the read-out: [−] [weight] [+].
  stepper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
    alignSelf: 'flex-start',
    background: colors.bg,
    borderRadius: radii.pill,
    padding: '8px 12px',
    '& > div': { display: 'contents' },
    '& > span': { order: 2 },
    '& > div > button': {
      order: 1,
      width: 44,
      height: 44,
      minWidth: 44,
      minHeight: 44,
      padding: 0,
      borderRadius: '50%',
      border: `1px solid ${colors.borderInput} !important`,
      background: `${colors.surface} !important`,
      color: `${colors.text} !important`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'transform .12s, border-color .12s',
      '&:hover': {
        borderColor: `${colors.green} !important`,
        transform: 'scale(1.06)',
      },
      '&:focus-visible': {
        outline: `3px solid ${colors.greenDeep}`,
        outlineOffset: 2,
      },
      // The glyph keeps its previous 22px; only the hit area around it grew.
      '& svg': { width: 22, height: 22 },
    },
    '& > div > button:first-child': { order: 3 },
  },
  amount: {
    fontWeight: 800,
    fontSize: 20,
    minWidth: 110,
    textAlign: 'center',
    color: colors.text,
  },
  hint: {
    fontSize: 13,
    color: colors.textFaint,
    fontWeight: 600,
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
  empty: {
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
 * Sold by weight: SizePrices[0].amount is the price per 100 grams.
 */
export const PriceForWeight = ({ product, setProductOrder }) => {
  const classes = useStyles();
  const [priceToShow, setPriceToShow] = useState(0);
  const [weightInput, setWeightInput] = useState(0);

  useEffect(() => {
    setPriceToShow(0);
    setWeightInput(0);
  }, [product?.id]);

  if (!product) return <CircularProgress />;

  const info = priceInfo(product);
  const base = product.Price?.SizePrices?.[0];
  const step = Number(base?.size) || 100;

  const updateOrder = (weight) => {
    if (!weight && weight === '0') return;
    if (!base) return;
    setWeightInput(weight);
    const calc = base.amount * (weight / 100);
    setPriceToShow(calc.toFixed(2));
    setProductOrder({
      sizeToOrder: Number(weight),
      product,
      priceToShow: Number(calc.toFixed(2)),
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
      <div className={classes.label}>בחרו משקל</div>
      <div className={classes.stepper}>
        <span className={classes.amount} aria-live="polite">
          {weightInput} גרם
        </span>
        <PlusMinus
          type="weight"
          size={product.Price}
          input={weightInput}
          updateOrder={updateOrder}
        />
      </div>
      <div className={classes.hint}>
        לשינוי הכמות יש להשתמש בכפתורי הפלוס והמינוס, בכפולות של {step} גרם
      </div>
      <div className={classes.totalRow}>
        {Number(priceToShow) ? (
          <>
            <span className={classes.totalLabel}>{'סה"כ'}</span>
            <span className={classes.total}>{money(priceToShow)}</span>
          </>
        ) : (
          <span className={classes.empty}>נא לבחור כמות</span>
        )}
      </div>
    </div>
  );
};
