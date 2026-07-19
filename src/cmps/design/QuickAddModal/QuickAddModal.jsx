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
    // Scroll the middle, not the whole sheet. MUI puts `overflow-y: auto` on
    // the paper, which on a short phone scrolls the header and the CTA out of
    // view together. Turning it off here and moving the scroll to `.body`
    // keeps the close button and the total/CTA reachable at any height.
    // The `!important` is deliberate: these JSS rules and MUI's own emotion
    // rules are both single-class selectors, and MUI's are injected later —
    // that is why `borderRadius` above already needed it.
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'hidden !important',
    // MUI's default 32px margin costs 64px of width. That is fine at 375px but
    // painful once a 200% zoom drops the layout viewport near 190 CSS px.
    '@media (max-width:480px)': {
      margin: '16px !important',
      width: 'calc(100% - 32px)',
      maxHeight: 'calc(100% - 32px) !important',
    },
  },
  head: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '18px 20px 0',
    flex: 'none',
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
  // 44x44 hit area. The CloseIcon itself stays 24px — only the (transparent)
  // button box and its ripple grow, from MUI's default 40x40.
  close: {
    marginInlineStart: 'auto !important',
    alignSelf: 'flex-start',
    flex: 'none',
    width: 44,
    height: 44,
  },
  // The scroll container. `minHeight: 0` is load-bearing: without it a flex
  // item refuses to shrink below its content and the paper overflows instead
  // of this scrolling.
  body: {
    padding: '16px 20px 0',
    flex: '1 1 auto',
    minHeight: 0,
    overflowY: 'auto',
    overscrollBehavior: 'contain',
  },
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
    // Already ~51px from padding + line box; the floor makes it independent of
    // the font metrics rather than incidentally tall enough.
    minHeight: 44,
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
    // Only bites below any real phone width (320px devices, and any viewport
    // shrunk by page zoom): the row's intrinsic width is otherwise ~240px and
    // would push the dialog into horizontal scroll.
    '@media (max-width:340px)': { gap: 10 },
  },
  stepBtn: {
    position: 'relative',
    width: 42,
    height: 42,
    borderRadius: '50%',
    border: `1px solid ${colors.borderInput}`,
    background: '#fff',
    fontSize: 22,
    color: colors.text,
    cursor: 'pointer',
    // Same trick as the card's quick-add button: the drawn circle stays 42px,
    // an invisible 1px ring takes the hit area to 44x44. The 18px gap either
    // side means it never reaches a neighbouring control.
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: '-1px',
    },
    '&:disabled': { opacity: 0.4, cursor: 'not-allowed' },
  },
  amount: {
    fontWeight: 800,
    fontSize: 20,
    // Reserved width so the -/+ buttons do not jump as the number changes.
    minWidth: 96,
    textAlign: 'center',
    color: colors.text,
    '@media (max-width:340px)': { minWidth: 64 },
  },
  // Pinned to the bottom of the scrolling body, so the price and the CTA stay
  // on screen while a long size list scrolls underneath. With content short
  // enough to fit, a sticky box sits in normal flow and nothing looks
  // different. The opaque background is what the scrolled content hides behind,
  // and it matches the paper exactly (both colors.surface). The 20px bottom
  // padding is the gap the body's old `padding-bottom` used to provide.
  foot: {
    position: 'sticky',
    bottom: 0,
    marginTop: 18,
    background: colors.surface,
    paddingBottom: 20,
  },
  totalRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    // 24px at the foot, previously 4px here plus the body's 20px padding-bottom
    // which now lives on `.foot` (which this branch does not render).
    padding: '10px 0 24px',
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

            <div className={classes.foot}>
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
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
};

export default QuickAddModal;
