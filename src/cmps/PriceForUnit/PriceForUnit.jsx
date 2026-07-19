import React, { useEffect, useState, useCallback } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';
import _ from 'lodash';
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
  // items here and can be ordered around the read-out: [−] [units] [+].
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
 * Sold by unit: SizePrices[0] means "`size` units cost `amount`", and the
 * order steps by `size`.
 */
export const PriceForUnit = ({ productOrder, setProductOrder }) => {
  const classes = useStyles();
  let product = useSelector((state) => _.cloneDeep(state.product));
  if (!Object.keys(product).length) product = { ...productOrder };
  const [unitInput, setUnitInput] = useState(0);
  const [priceToShow, setPriceToShow] = useState(0);

  const setProps = useCallback(() => {
    setProductOrder(productOrder);
  }, [setProductOrder, productOrder]);

  useEffect(() => {
    setProps();
  }, [setProps]);

  useEffect(() => {
    setPriceToShow(0);
    setUnitInput(0);
  }, [product?.id]);

  if (!product || !Object.keys(product).length) return <CircularProgress />;

  const info = priceInfo(product);
  const base = product.Price?.SizePrices?.[0];
  const step = Number(base?.size) || 1;

  const updateOrder = (size) => {
    if (size === 0 || size === '0' || !size) return;
    if (!base) return;
    setUnitInput(size);
    const calc = (size / base.size) * base.amount;
    setPriceToShow(calc);
    setProductOrder({ sizeToOrder: Number(size), product, priceToShow: calc });
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
      <div className={classes.label}>בחרו כמות</div>
      <div className={classes.stepper}>
        <span className={classes.amount} aria-live="polite">
          {unitInput} יחידות
        </span>
        <PlusMinus
          type="unit"
          size={product.Price}
          input={unitInput}
          updateOrder={updateOrder}
        />
      </div>
      <div className={classes.hint}>
        לשינוי הכמות יש להשתמש בכפתורי הפלוס והמינוס, בכפולות של {step} יחידות
      </div>
      <div className={classes.totalRow}>
        {Number(priceToShow) ? (
          <>
            <span className={classes.totalLabel}>{'סה"כ'}</span>
            <span className={classes.total}>{money(priceToShow)}</span>
          </>
        ) : (
          <span className={classes.empty}>נא לבחור כמות יחידות</span>
        )}
      </div>
    </div>
  );
};
