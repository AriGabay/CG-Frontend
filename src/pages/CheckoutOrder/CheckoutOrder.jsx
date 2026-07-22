import React, { useState, useEffect, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { cartService } from '../../services/cartService';
import { ImageCloud } from '../../cmps/ImageCloud/ImageCloud';
import { UserDetailsForm } from '../../cmps/UserDetailsForm/UserDetailsForm';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';
import { Helmet } from 'react-helmet';
import { money } from '../../services/viewModel.service';
import {
  colors,
  fonts,
  radii,
  shadows,
  layout,
  gradientFor,
} from '../../styles/designTokens';

const EMPTY_ORDER = { products: [], totalPrice: 0, Tax: 0, unTax: 0 };

// The size wording differs per priceType. Mirrors the logic the page has
// always used, so the label matches the PDF the backend mails out.
const sizeLabelFor = (product) => {
  const type = product?.Price?.priceType;
  const size = product?.sizeToOrder;
  if (size === undefined || size === null) return '';
  if (type === 'weight') return `${size} גרם`;
  if (type === 'unit') return `${size} יחידות`;
  if (type === 'box') {
    const unit =
      product.categoryId === 1 || product.categoryId === '1'
        ? 'מליליטר'
        : 'גרם';
    return `קופסה בגודל ${size} ${unit}`;
  }
  return '';
};

const useStyles = makeStyles({
  page: {
    maxWidth: layout.maxWidth,
    margin: '0 auto',
    padding: '30px 22px 60px',
  },
  h1: {
    fontFamily: fonts.display,
    fontSize: 'clamp(28px, 5vw, 40px)',
    fontWeight: 400,
    lineHeight: 1.25,
    margin: '0 0 24px',
    color: colors.text,
  },
  h2: {
    fontFamily: fonts.display,
    fontSize: 'clamp(20px, 3vw, 24px)',
    fontWeight: 400,
    margin: '0 0 18px',
    color: colors.text,
  },
  card: {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.xl,
    padding: '28px 30px',
    '@media (max-width: 640px)': {
      padding: '22px 18px',
    },
  },
  // ---- pickup callout ----
  pickup: {
    display: 'flex',
    gap: 14,
    alignItems: 'flex-start',
    background: colors.greenPale,
    borderRadius: radii.md,
    padding: '16px 18px',
    marginBottom: 22,
  },
  pickupIcon: {
    fontSize: 24,
    lineHeight: 1,
    flex: 'none',
  },
  pickupTitle: {
    fontWeight: 800,
    color: colors.greenDark,
    fontSize: 15,
    marginBottom: 2,
  },
  pickupTxt: {
    fontSize: 14,
    color: colors.greenInk,
    lineHeight: 1.6,
    margin: 0,
  },
  pickupLink: {
    color: colors.greenDark,
    fontWeight: 700,
    // The phone number sat in a 22.4px line box (14px / 1.6), under the 24px
    // floor. It stays `display: inline` on purpose: vertical padding on an
    // inline box is hit-tested but does not touch the line box, so the
    // paragraph does not move and the number still wraps where it always did.
    // The negative inline margin cancels the only padding that would shift
    // text. 22.4 -> 34.4px tall, 75 -> 87px wide. Not taken to 44px because a
    // 44px focus ring would swallow the lines above and below, and 2.5.8
    // exempts targets inline in a sentence anyway.
    padding: '6px 6px',
    margin: '0 -6px',
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDark}`,
      outlineOffset: 1,
    },
  },
  // ---- summary ----
  summary: {
    padding: 26,
    position: 'sticky',
    top: 96,
    // A sticky box taller than the viewport can never be scrolled to its end,
    // so its last lines — here the totals — become unreachable. That happens
    // at roughly 8 cart lines on a 900px viewport, and at 3 once text is
    // zoomed to the 200% that WCAG 1.4.4 requires. Cap it and let it scroll
    // internally; shorter carts are unaffected.
    maxHeight: 'calc(100vh - 116px)',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    // Chrome does not make scroll containers keyboard focusable on their own,
    // so the aside carries tabIndex={0} (2.1.1) and needs a focus ring (2.4.7).
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDark}`,
      outlineOffset: 2,
    },
    '@media (max-width: 860px)': {
      position: 'static',
      maxHeight: 'none',
      overflowY: 'visible',
    },
    '@media (max-width: 640px)': {
      padding: '22px 18px',
    },
  },
  lines: {
    listStyle: 'none',
    margin: '0 0 18px',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  line: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 14,
    flex: 'none',
    overflow: 'hidden',
    display: 'block',
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    },
  },
  lineBody: {
    flex: 1,
    minWidth: 0,
  },
  lineName: {
    fontWeight: 700,
    fontSize: 15,
    color: colors.text,
    margin: 0,
  },
  lineMeta: {
    fontSize: 13,
    color: colors.textFaint,
    margin: 0,
  },
  linePrice: {
    fontWeight: 800,
    fontSize: 15,
    color: colors.text,
    minWidth: 64,
    // Logical: @mui/styles is outside the emotion RTL cache, so a physical
    // `left` is never flipped. In Hebrew RTL `end` resolves to the same edge.
    textAlign: 'end',
    flex: 'none',
  },
  totals: {
    borderTop: `1px solid ${colors.border}`,
    paddingTop: 16,
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    fontSize: 15,
    color: colors.textMuted,
    marginBottom: 8,
  },
  grandRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    fontWeight: 800,
    fontSize: 20,
    color: colors.text,
    marginTop: 4,
  },
  grandValue: {
    color: colors.greenLink,
  },
  note: {
    fontSize: 13,
    color: colors.textFaint,
    lineHeight: 1.6,
    margin: '10px 0 0',
  },
  // ---- empty ----
  empty: {
    textAlign: 'center',
    padding: '70px 20px',
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.lg,
  },
  emptyIcon: {
    fontSize: 52,
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: colors.text,
    margin: '0 0 8px',
  },
  emptyTxt: {
    fontSize: 16,
    color: colors.textFaint,
    margin: '0 0 22px',
  },
  emptyCta: {
    display: 'inline-block',
    background: colors.green,
    color: colors.surface,
    border: 'none',
    borderRadius: radii.pill,
    padding: '15px 34px',
    fontWeight: 800,
    fontSize: 17,
    textDecoration: 'none',
    cursor: 'pointer',
    boxShadow: shadows.btnGreen,
    '&:hover': { background: colors.greenDeep },
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDark}`,
      outlineOffset: 3,
    },
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    padding: '90px 20px',
  },
});

export const CheckoutOrder = () => {
  const classes = useStyles();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    const done = (data) => {
      if (!alive) return;
      setOrder(data);
      setLoading(false);
    };
    cartService
      .getCart()
      .then((cart) => {
        if (!cart || !cart.length) return done(EMPTY_ORDER);
        return cartService.checkOutOrder(cart).then((res) => {
          // checkOutOrder swallows network errors and resolves undefined.
          done(res && res.products ? res : EMPTY_ORDER);
        });
      })
      .catch(() => done(EMPTY_ORDER));
    return () => {
      alive = false;
    };
  }, []);

  const products = order?.products || [];
  const isEmpty = !products.length;

  return (
    <Fragment>
      <Helmet>
        <title>Catering Gabay - Checkout</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      {loading ? (
        <div className={classes.loader}>
          <CircularProgress aria-label="טוען את סיכום ההזמנה" />
        </div>
      ) : (
        <main className={`${classes.page} gbFade gb-pad`}>
          <h1 className={classes.h1}>סיום הזמנה · איסוף עצמי</h1>

          {isEmpty ? (
            <div className={classes.empty}>
              <div className={classes.emptyIcon} aria-hidden="true">
                🛒
              </div>
              <p className={classes.emptyTitle}>העגלה ריקה</p>
              <p className={classes.emptyTxt}>
                הוסיפו מנות מהתפריט כדי להתחיל
              </p>
              <Link
                to="/menu/weekend"
                className={classes.emptyCta}
                aria-label="מעבר לתפריט סוף שבוע"
              >
                לתפריט ←
              </Link>
            </div>
          ) : (
            <div className="gb-checkout">
              {/* ---------- details + form (right column in RTL) ---------- */}
              <section
                className={classes.card}
                aria-labelledby="checkout-details-title"
              >
                <h2 id="checkout-details-title" className={classes.h2}>
                  פרטי ההזמנה
                </h2>

                <div className={classes.pickup}>
                  <span className={classes.pickupIcon} aria-hidden="true">
                    🏠
                  </span>
                  <div>
                    <p className={classes.pickupTitle}>איסוף עצמי מהמטבח</p>
                    <p className={classes.pickupTxt}>
                      רחוב המברג 10, טבריה · איסוף בימי שישי בין 8:30 ל-13:00.
                      <br />
                      הזמנות ליום שישי נסגרות ב-10:00 בבוקר. לשאלות:{' '}
                      <a href="tel:04-6734949" className={classes.pickupLink}>
                        04-6734949
                      </a>
                    </p>
                  </div>
                </div>

                <UserDetailsForm checkOutTotal={cartService.checkOutTotal} />
              </section>

              {/* ---------- order summary (left column in RTL) ---------- */}
              {/* `summary` caps this card's height, so it is a scroll
                  container for a long cart. Chrome gives a keyboard user no
                  way to scroll it without a tab stop (axe flags exactly this
                  as scrollable-region-focusable). The lint rule does not model
                  scroll containers, so it is silenced for this attribute. */}
              {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
              <aside tabIndex={0}
                className={`${classes.card} ${classes.summary}`}
                aria-labelledby="checkout-summary-title"
              >
                <h2 id="checkout-summary-title" className={classes.h2}>
                  ההזמנה שלך
                </h2>

                <ul className={classes.lines}>
                  {products.map((product, index) => {
                    const name = product.displayName || `מוצר ${product.id}`;
                    return (
                      <li
                        className={classes.line}
                        key={`${product.id}-${product.sizeToOrder}-${index}`}
                      >
                        <span
                          className={classes.thumb}
                          style={{ background: gradientFor(product.categoryId) }}
                        >
                          <ImageCloud
                            imageId={product.imgUrl}
                            maxWidth={120}
                            maxHeight={120}
                            alt={`תמונה של ${name}`}
                          />
                        </span>
                        <div className={classes.lineBody}>
                          <p className={classes.lineName}>{name}</p>
                          <p className={classes.lineMeta}>
                            {sizeLabelFor(product)}
                          </p>
                        </div>
                        <span className={classes.linePrice}>
                          {money(product.pricePerSize)}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className={classes.totals}>
                  <div className={classes.totalRow}>
                    <span>לפני מע&quot;מ</span>
                    <span>{money(order.unTax)}</span>
                  </div>
                  <div className={classes.totalRow}>
                    <span>מע&quot;מ</span>
                    <span>{money(order.Tax)}</span>
                  </div>
                  <div className={classes.grandRow}>
                    <span>סה&quot;כ משוער</span>
                    <span className={classes.grandValue}>
                      {money(order.totalPrice)}
                    </span>
                  </div>
                  <p className={classes.note}>
                    המחיר משוער — מנות הנמכרות במשקל מתומחרות לפי 100 גרם.
                  </p>
                </div>
              </aside>
            </div>
          )}
        </main>
      )}
    </Fragment>
  );
};
