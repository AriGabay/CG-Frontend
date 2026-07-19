import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useSelector, useDispatch } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';
import _ from 'lodash';

import { productService } from '../../services/productService';
import { cartService } from '../../services/cartService';
import { eventBus } from '../../services/event-bus';
import { ImageCloud } from '../../cmps/ImageCloud/ImageCloud';
import { PriceForUnit } from '../../cmps/PriceForUnit/PriceForUnit';
import { PriceForBox } from '../../cmps/PriceForBox/PriceForBox';
import { PriceForWeight } from '../../cmps/PriceForWeight/PriceForWeight';
import { ProductCard } from '../../cmps/design/ProductCard';
import { QuickAddModal } from '../../cmps/design/QuickAddModal';
import { useCatalog } from '../../hooks/useCatalog';
import {
  priceInfo,
  toCardVM,
  menuFlagFor,
} from '../../services/viewModel.service';
import {
  colors,
  radii,
  shadows,
  fonts,
  gradientFor,
} from '../../styles/designTokens';

const useStyles = makeStyles({
  page: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '26px 22px 40px',
  },
  back: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: 'none',
    border: 'none',
    color: colors.textMuted,
    fontFamily: fonts.body,
    fontWeight: 700,
    fontSize: 16,
    textDecoration: 'none',
    padding: 0,
    marginBottom: 20,
    cursor: 'pointer',
    position: 'relative',
    // The link box is only ~26px tall (16px text x the inherited 1.6
    // line-height). This overlay lifts the hit area to 44px without moving the
    // text or reflowing anything: it grows ~9px past each edge, well inside the
    // 20px margin below and the page's 26px top padding, so it cannot swallow a
    // click meant for a neighbouring control.
    '&::after': {
      content: '""',
      position: 'absolute',
      insetInlineStart: 0,
      insetInlineEnd: 0,
      top: '50%',
      transform: 'translateY(-50%)',
      height: 44,
    },
    '&:hover': { color: colors.greenLink },
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 3,
      borderRadius: 6,
    },
  },
  media: {
    position: 'relative',
    borderRadius: radii.xl,
    height: 'clamp(280px, 40vw, 440px)',
    overflow: 'hidden',
    boxShadow: '0 24px 44px -24px rgba(67,49,42,.45)',
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  },
  catChip: {
    position: 'absolute',
    bottom: 18,
    insetInlineEnd: 18,
    background: 'rgba(255,255,255,.92)',
    color: colors.text,
    fontWeight: 700,
    fontSize: 14,
    borderRadius: radii.pill,
    padding: '6px 14px',
    zIndex: 2,
  },
  stockChip: {
    position: 'absolute',
    top: 18,
    insetInlineEnd: 18,
    background: colors.danger,
    color: '#fff',
    fontWeight: 700,
    fontSize: 14,
    borderRadius: radii.pill,
    padding: '7px 16px',
    zIndex: 2,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 'clamp(30px, 4.6vw, 42px)',
    lineHeight: 1.15,
    color: colors.text,
    margin: '0 0 12px',
  },
  desc: {
    fontSize: 18,
    lineHeight: 1.65,
    color: colors.textSoft,
    margin: '0 0 20px',
    maxWidth: 'none',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 10,
    marginBottom: 22,
  },
  chip: {
    background: colors.cream,
    // textMuted on cream is only 4.18:1 — an AA failure for 14px text. The
    // kitniyot chip is the one place these two tokens meet. textSoft = 7.40:1.
    color: colors.textSoft,
    fontWeight: 600,
    fontSize: 14,
    borderRadius: radii.pill,
    padding: '7px 15px',
  },
  chipGreen: {
    background: colors.greenPale,
    color: colors.greenInk,
    fontWeight: 700,
    fontSize: 14,
    borderRadius: radii.pill,
    padding: '7px 15px',
  },
  fromPrice: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: colors.greenLink,
  },
  selector: {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.lg,
    padding: '18px 22px',
    marginBottom: 16,
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
  cta: {
    width: '100%',
    background: colors.green,
    color: '#fff',
    border: 'none',
    borderRadius: radii.md,
    padding: 19,
    fontFamily: fonts.body,
    fontWeight: 800,
    fontSize: 20,
    cursor: 'pointer',
    boxShadow: shadows.btnGreen,
    transition: 'background .14s, transform .12s',
    '&:hover:enabled': { background: colors.greenDeep },
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDark}`,
      outlineOffset: 3,
    },
    '&:disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
      boxShadow: 'none',
    },
  },
  ctaNote: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 600,
    color: colors.textFaint,
    textAlign: 'center',
  },
  relatedSection: {
    marginTop: 52,
  },
  relatedTitle: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.text,
    margin: '0 0 18px',
  },
  center: {
    minHeight: 460,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.textSoft,
    fontWeight: 600,
  },
});

const EMPTY_ORDER = { sizeToOrder: null, product: null, priceToShow: null };

function menuTypeOf(product, fallback) {
  if (fallback) return fallback;
  if (product?.isMenuWeekend) return 'weekend';
  if (product?.isMenuTishray) return 'tishray';
  if (product?.isMenuPesach) return 'pesach';
  return 'weekend';
}

export const ProductPreview = () => {
  const classes = useStyles();
  const { productId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product);
  const menuType = useSelector((state) => state.menuType);
  const { products } = useCatalog();

  const [productOrder, setProductOrder] = useState(EMPTY_ORDER);
  const [loadError, setLoadError] = useState(false);
  const [quickAdd, setQuickAdd] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setProductOrder(EMPTY_ORDER);
    setLoadError(false);
    const isLoaded =
      !!Object.keys(product || {}).length &&
      String(productId) === String(product.id);
    if (!isLoaded) {
      productService
        .getProductById(productId)
        .then((res) => {
          if (!res || !res.id) {
            setLoadError(true);
            return;
          }
          dispatch({ type: 'SET_PRODUCT', payload: res });
        })
        .catch((error) => {
          console.error(error);
          setLoadError(true);
        });
    }
  }, [productId]);

  const isReady =
    !!product &&
    !!Object.keys(product || {}).length &&
    String(product.id) === String(productId);

  const backState = history.location.state;
  const backTo = typeof backState === 'string' && backState ? backState : '/';

  const openProduct = (p) =>
    history.push({
      pathname: `/product/${p.id}`,
      state: history.location.pathname,
    });

  const related = useMemo(() => {
    if (!isReady || !products.length) return [];
    const flag = menuFlagFor(menuTypeOf(product, menuType));
    return products
      .filter(
        (p) =>
          String(p.id) !== String(product.id) &&
          Number(p.categoryId) === Number(product.categoryId) &&
          !!p[flag] &&
          p.inStock !== false
      )
      .slice(0, 4);
  }, [products, product, menuType, isReady]);

  const addToCart = () => {
    if (!productOrder?.sizeToOrder) {
      eventBus.dispatch('error', { message: 'לא נבחרה כמות' });
      return;
    }
    // cartService.addToCart deletes keys off the product it is handed, so it
    // must never see the object that lives in the redux store.
    cartService
      .addToCart({
        sizeToOrder: Number(productOrder.sizeToOrder),
        product: _.cloneDeep(productOrder.product || product),
        priceToShow: productOrder.priceToShow,
      })
      .then(() => {
        eventBus.dispatch('addProductToCart', { message: 'נוסף לעגלה' });
      });
  };

  if (loadError) {
    return (
      <div className={classes.center}>
        <p>לא הצלחנו לטעון את פרטי המוצר.</p>
        <Link className={classes.back} to={backTo}>
          <span aria-hidden="true">→</span> חזרה
        </Link>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className={classes.center}>
        <CircularProgress aria-label="טוען מוצר" />
      </div>
    );
  }

  const info = priceInfo(product);
  const priceType = product.Price?.priceType;
  const inStock = product.inStock !== false;
  const canAdd = info.available && inStock;

  return (
    <Fragment>
      <Helmet>
        <title>{`קייטרינג גבאי - ${product.displayName}`}</title>
        <meta
          name="description"
          content={
            product.description
              ? product.description
              : `${product.displayName} - קייטרינג גבאי, טבריה.`
          }
        />
        <meta name="products-preview" content="products preview" />
        <meta name="robots" content="all" />
      </Helmet>

      <main className={`gbFade ${classes.page}`}>
        <Link className={classes.back} to={backTo} aria-label="חזרה לעמוד הקודם">
          <span aria-hidden="true">→</span> חזרה
        </Link>

        <div className="gb-prod">
          <div
            className={classes.media}
            style={{ background: gradientFor(product.categoryId) }}
          >
            {/* An empty imageId makes ImageCloud fall back to the company
                logo, which looks like a real photo of the dish. */}
            {product.imgUrl ? (
              <ImageCloud
                imageId={product.imgUrl}
                maxWidth={900}
                maxHeight={760}
                alt={`תמונה של ${
                  product.displayName?.length ? product.displayName : product.id
                }`}
              />
            ) : null}
            {!inStock && <span className={classes.stockChip}>אזל מהמלאי</span>}
            {product.Category?.displayName && (
              <span className={classes.catChip}>
                {product.Category.displayName}
              </span>
            )}
          </div>

          <div>
            <h1 className={classes.title}>{product.displayName}</h1>

            {product.description ? (
              <p className={classes.desc}>{product.description}</p>
            ) : null}

            <div className={classes.chips}>
              {info.servingLabel ? (
                <span className={classes.chipGreen}>{info.servingLabel}</span>
              ) : null}
              {product.isMenuPesach === true && (
                <span className={classes.chip}>
                  {product.kitniyot ? 'מכיל קיטניות' : 'ללא חשש קיטניות'}
                </span>
              )}
              {info.available ? (
                <span className={classes.fromPrice}>{info.priceLabel}</span>
              ) : null}
            </div>

            <div className={classes.selector}>
              {info.available ? (
                <>
                  {priceType === 'unit' && (
                    <PriceForUnit
                      productOrder={productOrder}
                      setProductOrder={setProductOrder}
                    />
                  )}
                  {priceType === 'box' && (
                    <PriceForBox
                      product={product}
                      setProductOrder={setProductOrder}
                    />
                  )}
                  {priceType === 'weight' && (
                    <PriceForWeight
                      product={product}
                      setProductOrder={setProductOrder}
                    />
                  )}
                </>
              ) : (
                <div className={classes.unavailable}>
                  <span className={classes.unavailableTitle}>
                    לפרטים בטלפון
                  </span>
                  <span>
                    למוצר זה אין מחיר מוגדר באתר. להזמנה חייגו{' '}
                    <a className={classes.phone} href="tel:04-6734949">
                      04-6734949
                    </a>
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              className={classes.cta}
              onClick={addToCart}
              disabled={!canAdd}
            >
              הוסף לעגלת הקניות
            </button>
            {!inStock && (
              <div className={classes.ctaNote}>
                המוצר אזל מהמלאי כרגע ולא ניתן להזמינו.
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <section className={classes.relatedSection}>
            <h2 className={classes.relatedTitle}>אולי תאהבו גם</h2>
            <div className="gb-grid4">
              {related.map((p) => (
                <ProductCard
                  key={p.id}
                  vm={toCardVM(p, {
                    onOpen: openProduct,
                    onAdd: setQuickAdd,
                  })}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <QuickAddModal
        product={quickAdd}
        open={!!quickAdd}
        onClose={() => setQuickAdd(null)}
      />
    </Fragment>
  );
};
