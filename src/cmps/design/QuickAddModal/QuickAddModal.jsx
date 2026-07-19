import React, { useState, useEffect, useMemo } from 'react';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/CloseOutlined';
import { makeStyles } from '@mui/styles';
import _ from 'lodash';
import { ImageCloud } from '../../ImageCloud/ImageCloud';
import { cartService } from '../../../services/cartService';
import { eventBus } from '../../../services/event-bus';
import {
  priceInfo,
  priceForSelection,
  money,
} from '../../../services/viewModel.service';
import {
  colors,
  radii,
  fonts,
  shadows,
  gradientFor,
} from '../../../styles/designTokens';

const useStyles = makeStyles({
  paper: {
    borderRadius: `${radii.xl} !important`,
    background: colors.surface,
    maxWidth: 460,
    width: '100%',
  },
  head: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '18px 20px 0',
  },
  thumb: {
    width: 68,
    height: 68,
    borderRadius: radii.md,
    flex: 'none',
    overflow: 'hidden',
    '& img': { width: '100%', height: '100%', objectFit: 'cover' },
  },
  title: {
    fontWeight: 800,
    fontSize: 19,
    color: colors.text,
    lineHeight: 1.25,
  },
  cat: { fontSize: 13, color: colors.textFaint, fontWeight: 600 },
  close: { marginInlineStart: 'auto !important', alignSelf: 'flex-start' },
  body: { padding: '16px 20px 20px' },
  label: {
    fontWeight: 700,
    fontSize: 14,
    color: colors.textSoft,
    marginBottom: 10,
  },
  sizeGrid: { display: 'flex', flexDirection: 'column', gap: 10 },
  sizeBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    border: `1.5px solid ${colors.borderInput}`,
    background: colors.surfaceAlt,
    borderRadius: radii.sm,
    padding: '13px 16px',
    fontSize: 15,
    fontWeight: 600,
    color: colors.text,
    cursor: 'pointer',
    transition: 'all .13s',
    '&:hover': { borderColor: colors.green },
  },
  sizeBtnActive: {
    borderColor: colors.green,
    background: colors.greenPale,
    color: colors.greenInk,
  },
  stepper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    background: colors.bg,
    borderRadius: radii.pill,
    padding: '10px 12px',
  },
  stepBtn: {
    width: 42,
    height: 42,
    borderRadius: '50%',
    border: `1px solid ${colors.borderInput}`,
    background: '#fff',
    fontSize: 22,
    color: colors.text,
    cursor: 'pointer',
    '&:disabled': { opacity: 0.4, cursor: 'not-allowed' },
  },
  amount: {
    fontWeight: 800,
    fontSize: 20,
    minWidth: 96,
    textAlign: 'center',
    color: colors.text,
  },
  totalRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    paddingTop: 14,
    borderTop: `1px solid ${colors.border}`,
  },
  totalLabel: { fontWeight: 700, color: colors.textSoft, fontSize: 15 },
  total: { fontFamily: fonts.display, fontSize: 28, color: colors.greenLink },
  cta: {
    width: '100%',
    marginTop: 16,
    background: colors.green,
    color: '#fff',
    border: 'none',
    borderRadius: radii.md,
    padding: 16,
    fontWeight: 800,
    fontSize: 18,
    cursor: 'pointer',
    boxShadow: shadows.btnGreen,
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
  },
  hint: {
    marginTop: 10,
    fontSize: 13,
    color: colors.textFaint,
    textAlign: 'center',
  },
  unavailable: {
    padding: '10px 0 4px',
    fontSize: 15,
    color: colors.danger,
    fontWeight: 600,
  },
});

/**
 * Lets the shopper pick a size / weight / unit count without leaving the grid.
 * The maths is delegated to viewModel.service so it stays identical to the
 * product page and to the server-side total in cg-backend cart.service.
 */
export const QuickAddModal = ({ product, open, onClose, onAdded }) => {
  const classes = useStyles();
  const info = useMemo(() => (product ? priceInfo(product) : null), [product]);
  const [selection, setSelection] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!product || !info) return;
    if (info.type === 'box') setSelection(info.options[0]?.size ?? null);
    else if (info.type === 'unit') setSelection(info.min || 1);
    else if (info.type === 'weight') setSelection(info.min || 100);
    else setSelection(null);
    setBusy(false);
  }, [product, info]);

  if (!product || !info) return null;

  const total = priceForSelection(product, selection);
  const canAdd = info.available && !!selection && total > 0 && !busy;

  const step = (dir) => {
    const s = info.step || 1;
    const next = Number(selection || 0) + dir * s;
    const min = info.min || s;
    const max = info.max || Number.MAX_SAFE_INTEGER;
    setSelection(Math.min(max, Math.max(min, next)));
  };

  const handleAdd = () => {
    if (!canAdd) return;
    setBusy(true);
    // cartService.addToCart strips keys off the product it is handed, so give
    // it a clone — the catalogue objects are cached and shared across pages.
    cartService
      .addToCart({
        sizeToOrder: Number(selection),
        product: _.cloneDeep(product),
        priceToShow: total,
      })
      .then(() => {
        eventBus.dispatch('addProductToCart', { message: 'נוסף לעגלה' });
        if (onAdded) onAdded();
        onClose();
      })
      .catch(() => {
        eventBus.dispatch('error', { message: 'לא הצלחנו להוסיף לעגלה' });
        setBusy(false);
      });
  };

  const unitWord = info.unitLabel || '';

  return (
    <Dialog
      open={!!open}
      onClose={onClose}
      classes={{ paper: classes.paper }}
      dir="rtl"
      aria-labelledby="quick-add-title"
      aria-modal="true"
    >
      <div className={classes.head}>
        <div
          className={classes.thumb}
          style={{ background: gradientFor(product.categoryId) }}
        >
          {/* Empty imageId would render the company logo — see ProductCard. */}
          {product.imgUrl ? (
            <ImageCloud
              imageId={product.imgUrl}
              maxWidth={140}
              maxHeight={140}
              alt={`תמונה של ${product.displayName}`}
            />
          ) : null}
        </div>
        <div>
          <div className={classes.title} id="quick-add-title">
            {product.displayName}
          </div>
          {product.Category?.displayName ? (
            <div className={classes.cat}>{product.Category.displayName}</div>
          ) : null}
        </div>
        <IconButton
          className={classes.close}
          onClick={onClose}
          aria-label="סגירה"
        >
          <CloseIcon />
        </IconButton>
      </div>

      <div className={classes.body}>
        {!info.available ? (
          <div className={classes.unavailable}>
            למוצר זה אין מחיר מוגדר — נא ליצור קשר טלפוני להזמנה.
          </div>
        ) : (
          <>
            {info.type === 'box' && (
              <>
                <div className={classes.label}>בחרו גודל קופסה</div>
                <div className={classes.sizeGrid}>
                  {info.options.map((o) => (
                    <button
                      type="button"
                      key={o.id ?? o.size}
                      className={`${classes.sizeBtn} ${
                        Number(selection) === Number(o.size)
                          ? classes.sizeBtnActive
                          : ''
                      }`}
                      onClick={() => setSelection(o.size)}
                      aria-pressed={Number(selection) === Number(o.size)}
                    >
                      <span>
                        קופסה {o.size} {unitWord}
                      </span>
                      <span>{money(o.amount)}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {(info.type === 'unit' || info.type === 'weight') && (
              <>
                <div className={classes.label}>
                  {info.type === 'unit' ? 'כמה יחידות?' : 'כמה גרם?'}
                </div>
                <div className={classes.stepper}>
                  <button
                    type="button"
                    className={classes.stepBtn}
                    onClick={() => step(-1)}
                    disabled={Number(selection) <= (info.min || 0)}
                    aria-label="הפחתה"
                  >
                    −
                  </button>
                  <span className={classes.amount} aria-live="polite">
                    {selection} {unitWord}
                  </span>
                  <button
                    type="button"
                    className={classes.stepBtn}
                    onClick={() => step(1)}
                    disabled={
                      !!info.max && Number(selection) >= Number(info.max)
                    }
                    aria-label="הוספה"
                  >
                    +
                  </button>
                </div>
                <div className={classes.hint}>
                  {`הזמנה בכפולות של ${info.step} ${unitWord}`}
                </div>
              </>
            )}

            <div className={classes.totalRow}>
              <span className={classes.totalLabel}>{'סה"כ'}</span>
              <span className={classes.total}>{money(total)}</span>
            </div>

            <button
              type="button"
              className={classes.cta}
              onClick={handleAdd}
              disabled={!canAdd}
            >
              {busy ? 'מוסיף...' : 'הוספה לעגלה'}
            </button>
          </>
        )}
      </div>
    </Dialog>
  );
};

export default QuickAddModal;
