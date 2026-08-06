import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import CircularProgress from '@mui/material/CircularProgress';
import { getDay, setHours, setMinutes } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

import BasicModal from '../../cmps/BasicModal/BasicModal';
import { ImageCloud } from '../../cmps/ImageCloud/ImageCloud';
import { PdfViewerPopup } from '../../cmps/PdfViewerPopup';
import { ProductCard } from '../../cmps/design/ProductCard';
import { QuickAddModal } from '../../cmps/design/QuickAddModal';
import { useCatalog } from '../../hooks/useCatalog';
import { isMenuEnableService } from '../../services/isMenuEnableService';
import {
  categoriesPresent,
  filterByMenu,
  priceInfo,
  toCardVM,
} from '../../services/viewModel.service';
import {
  colors,
  fonts,
  gradientFor,
  layout,
  radii,
  shadows,
} from '../../styles/designTokens';

// Real business facts, taken from the previous home page copy and the logo
// artwork. Nothing here is invented — keep it that way.
const PHONE = '04-6734949';
const PHONE_HREF = 'tel:046734949';
const PICKUP_HOURS = 'ימי שישי, 7:00-14:00';
const ADDRESS = '״גני איילון״, כביש פוריה - טבריה';

// The four categories the featured strip leads with, in order. Chosen for
// spread across the menu, not from sales data.
const FEATURED_CATEGORY_ORDER = [1, 5, 6, 9];

// Decorative hero tiles. Positions are the physical ones from the approved
// mock (which was already authored RTL) — logical properties would mirror the
// composition. Labels/gradients are real categories, not invented ones.
const HERO_TILES = [
  {
    label: 'מרקים',
    emoji: '🍲',
    catId: 10,
    steam: true,
    style: { top: 42, right: 54, width: 154 },
    animation: 'gbBobA 6s ease-in-out infinite',
    size: 154,
  },
  {
    label: 'סלטים',
    emoji: '🥗',
    catId: 1,
    steam: false,
    style: { bottom: 56, right: 128, width: 132 },
    animation: 'gbBobC 7.2s ease-in-out infinite',
    size: 132,
  },
  {
    label: 'מטוגנים',
    emoji: '🍗',
    catId: 3,
    steam: false,
    style: { top: 64, left: 60, width: 140 },
    animation: 'gbBobB 6.6s ease-in-out infinite',
    size: 140,
  },
  {
    label: 'פשטידות',
    emoji: '🥘',
    catId: 9,
    steam: false,
    style: { bottom: 64, left: 96, width: 124 },
    animation: 'gbBobA 7.6s ease-in-out infinite',
    size: 124,
  },
];

const VALUE_PROPS = [
  {
    icon: '🍲',
    title: 'בישול ביתי',
    text: 'כל מנה מבושלת במטבח שלנו, בדיוק כמו בבית.',
  },
  {
    icon: '🥬',
    title: 'חומרי גלם טריים',
    text: 'קונים טרי ומבשלים קרוב ליום האיסוף.',
  },
  {
    icon: '🥡',
    title: 'איסוף בימי שישי',
    text: `${PICKUP_HOURS} — ההזמנה ארוזה ומחכה לכם.`,
  },
  {
    icon: '✡️',
    title: 'כשר למהדרין',
    text: 'בהשגחת הרבנות טבריה.',
  },
];

// WCAG 2.2 (2.5.8) puts the floor for a pointer target at 24x24 CSS px, and
// 44x44 is the practical norm on touch. The links this is applied to render as
// a single ~24px line of text, so grow the *hit area* only: 10px of padding on
// each side of the block axis takes 24 -> 44, and the matching negative margin
// pulls the layout back so nothing moves and no glyph changes size.
// Deliberately block-axis (top/bottom) and symmetric, so there is nothing for
// RTL to mirror; minWidth covers the inline axis for the short "עוד ←" link.
// Check spacing before reusing this — the padding is real box area and would
// otherwise steal clicks from a neighbour within 10px.
const TAP_TARGET_44 = {
  display: 'inline-block',
  minWidth: 44,
  paddingTop: 10,
  paddingBottom: 10,
  marginTop: -10,
  marginBottom: -10,
};

const useStyles = makeStyles({
  page: {
    background: colors.bg,
    paddingBottom: 40,
  },
  section: {
    maxWidth: layout.maxWidth,
    margin: '0 auto',
    padding: '38px 22px 8px',
  },
  sectionHead: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 18,
  },
  h2: {
    fontFamily: fonts.display,
    fontSize: 30,
    lineHeight: 1.2,
    margin: 0,
    color: colors.text,
    fontWeight: 400,
  },
  moreLink: {
    ...TAP_TARGET_44,
    color: colors.greenLink,
    fontWeight: 700,
    fontSize: 16,
    whiteSpace: 'nowrap',
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 3,
      borderRadius: 6,
    },
  },

  /* ---------------- promo ---------------- */
  promoWrap: {
    maxWidth: layout.maxWidth,
    margin: '16px auto 0',
    padding: '0 22px',
  },
  promo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    background: `linear-gradient(120deg, ${colors.green}, ${colors.greenDark})`,
    color: '#fff',
    borderRadius: 18,
    padding: '16px 26px',
    fontWeight: 700,
    fontSize: 17,
    // Deepen on hover by swapping the gradient, NOT with `filter`. A filter
    // applies to the element as a group, so it repaints the white label too:
    // brightness(1.05) lifted the light stop to #648466 and left the label
    // white (it clips at 255) -> 4.16:1, and brightness(.94) darkened the
    // stop to #59765B but also dimmed the label to #F0F0F0 -> 4.42:1. Both
    // fail the 4.5:1 that 17px/700 normal text needs. Repainting the
    // background leaves the label at pure #fff: greenInk is the lightest
    // stop here, and white on it is 5.92:1.
    '&:hover': {
      color: '#fff',
      background: `linear-gradient(120deg, ${colors.greenInk}, ${colors.greenDark})`,
    },
    '&:focus-visible': {
      outline: `3px solid ${colors.text}`,
      outlineOffset: 3,
    },
  },

  /* ---------------- hero ---------------- */
  heroSection: {
    maxWidth: layout.maxWidth,
    margin: '22px auto 8px',
    padding: '0 22px',
  },
  hero: {
    position: 'relative',
    borderRadius: 32,
    overflow: 'hidden',
    minHeight: 'clamp(460px, 68vw, 580px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    background:
      'radial-gradient(120% 92% at 50% 4%, #F4EFE2 0%, #E9EDDC 46%, #D4E1CC 100%)',
  },
  blob: {
    position: 'absolute',
    borderRadius: '50%',
    pointerEvents: 'none',
  },
  tileInner: {
    position: 'relative',
    borderRadius: 26,
    boxShadow: shadows.float,
    display: 'flex',
    alignItems: 'flex-end',
    padding: 14,
    overflow: 'hidden',
  },
  tileLabel: {
    position: 'relative',
    zIndex: 2,
    // The label sits at the bottom of the tile, i.e. over the *dark* end of
    // the category gradient. #33291C hit only 4.08:1 on the darkest of them
    // (מטוגנים, #A5835F) and this is 16px text, so AA wants 4.5:1.
    // #211A11 reads the same near-black brown and clears 4.93:1 there.
    color: '#211A11',
    fontWeight: 800,
    fontSize: 16,
  },
  heroContent: {
    position: 'relative',
    zIndex: 3,
    padding: 'clamp(30px, 5vw, 56px)',
    maxWidth: 640,
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(255,255,255,.7)',
    border: '1px solid rgba(67,49,42,.12)',
    color: colors.greenInk,
    borderRadius: radii.pill,
    padding: '8px 16px',
    fontWeight: 700,
    fontSize: 14,
    marginBottom: 22,
    backdropFilter: 'blur(4px)',
  },
  h1: {
    fontFamily: fonts.display,
    fontSize: 'clamp(38px, 8vw, 68px)',
    lineHeight: 1.04,
    margin: 0,
    color: '#3A2C22',
    fontWeight: 400,
  },
  // greenDeep (#5F8262) only reached 3.18:1 on the dark edge of the hero
  // gradient, and 2.47:1 where the decorative green blob drifts under the
  // headline — below the 3:1 large-text floor. greenInk is the same family and
  // never drops under 3.38:1 anywhere on the hero.
  h1Accent: { color: colors.greenInk },
  heroText: {
    fontSize: 'clamp(16px, 2.4vw, 20px)',
    lineHeight: 1.55,
    margin: '22px auto 30px',
    color: '#5A4A3E',
    maxWidth: 440,
    fontWeight: 500,
  },
  ctaRow: {
    display: 'flex',
    gap: 14,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  ctaPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 9,
    // At the low end of the clamp below this label is 17px — under the
    // 18.66px+bold threshold for "large text", so it needs the full 4.5:1.
    // White on greenDeep is only 4.32:1; `green` is the token meant for
    // white-on-green surfaces and clears 4.52:1 at a visually identical hue.
    background: colors.green,
    color: '#fff',
    border: 'none',
    borderRadius: radii.pill,
    padding: '16px 34px',
    fontWeight: 800,
    fontSize: 'clamp(17px, 2.2vw, 19px)',
    boxShadow: shadows.btnGreen,
    '&:hover': { background: colors.greenDark, color: '#fff' },
    '&:focus-visible': {
      outline: `3px solid ${colors.text}`,
      outlineOffset: 3,
    },
  },
  ctaSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 9,
    background: 'rgba(255,255,255,.8)',
    color: colors.text,
    border: '1.5px solid rgba(67,49,42,.18)',
    borderRadius: radii.pill,
    padding: '16px 30px',
    fontWeight: 700,
    fontSize: 'clamp(16px, 2.2vw, 18px)',
    backdropFilter: 'blur(4px)',
    '&:hover': { background: '#fff', color: colors.text },
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 3,
    },
  },
  heroFacts: {
    display: 'flex',
    gap: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 26,
    color: '#6B5A4E',
    fontWeight: 600,
    fontSize: 14,
    listStyle: 'none',
    padding: 0,
  },

  /* ---------------- categories ---------------- */
  catTile: {
    display: 'block',
    textAlign: 'center',
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: 20,
    padding: '16px 8px',
    color: colors.text,
    transition: 'transform .15s, box-shadow .15s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: shadows.cardSoft,
      color: colors.text,
    },
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 2,
    },
  },
  catCircle: {
    width: 60,
    height: 60,
    borderRadius: '50%',
    margin: '0 auto 10px',
    overflow: 'hidden',
    // cloudinary-react overlays its blur placeholder as an absolutely
    // positioned <img>. Without a positioned ancestor that <img> resolves its
    // 100% against the viewport instead of this circle, so it rendered at the
    // full 375x812 and dragged the whole page sideways on a phone. `overflow`
    // alone cannot clip it, because clipping only reaches descendants whose
    // containing block sits inside the clipper.
    position: 'relative',
    '& img': { width: '100%', height: '100%', objectFit: 'cover' },
  },
  catLabel: { fontWeight: 700, fontSize: 15, color: colors.text },

  /* ---------------- shabbat band ---------------- */
  bandSection: {
    maxWidth: layout.maxWidth,
    margin: '34px auto 8px',
    padding: '0 22px',
  },
  band: {
    borderRadius: 30,
    background: `linear-gradient(115deg, ${colors.blueLight}, ${colors.blue})`,
    color: '#fff',
    padding: '48px 52px',
    position: 'relative',
    overflow: 'hidden',
  },
  bandBlob: {
    position: 'absolute',
    top: -40,
    left: -30,
    width: 220,
    height: 220,
    borderRadius: '50%',
    // This blob sits over the *light* end of the band gradient, and in RTL it
    // lands squarely behind the stat column (and behind the kicker once
    // .gb-band collapses to one column at 860px). At .08 it lifted the
    // background to #697A92, where even pure white text is 4.38:1 — a fail no
    // text colour could rescue. At .05 the worst spot is #64758E (white =
    // 4.69:1) and the sheen is still visible.
    background: 'rgba(255,255,255,.05)',
    pointerEvents: 'none',
  },
  bandKicker: {
    fontWeight: 700,
    fontSize: 15,
    letterSpacing: 1,
    // 15px/700 is normal text, so it needs 4.5:1 against the lightest point of
    // the band. The old #D5DEEC managed 3.83:1 on the plain gradient and
    // 3.23:1 over the blob. The de-emphasis now comes from size and weight.
    color: '#FFFFFF',
    marginBottom: 12,
    position: 'relative',
  },
  bandTitle: {
    fontFamily: fonts.display,
    fontSize: 'clamp(28px, 4.5vw, 40px)',
    lineHeight: 1.1,
    marginBottom: 14,
    fontWeight: 400,
    position: 'relative',
  },
  bandText: {
    fontSize: 18,
    // 18px/500 is still normal text (large needs >=24px, or >=18.66px at
    // weight >=700), so 4.26:1 from #E3E9F2 was not enough.
    color: '#FFFFFF',
    maxWidth: 460,
    margin: '0 0 26px',
    fontWeight: 500,
    position: 'relative',
  },
  bandBtn: {
    display: 'inline-block',
    background: '#fff',
    color: colors.blue,
    border: 'none',
    borderRadius: radii.pill,
    padding: '16px 32px',
    fontWeight: 800,
    fontSize: 18,
    position: 'relative',
    '&:hover': { background: colors.cream, color: colors.blue },
    '&:focus-visible': { outline: '3px solid #fff', outlineOffset: 3 },
  },
  bandStat: { textAlign: 'center', position: 'relative' },
  // Both stat labels are 15px/600 = normal text, and they are the copy sitting
  // directly under the blob, so they were the worst offenders at 3.23:1.
  bandStatTop: { fontSize: 15, color: '#FFFFFF', fontWeight: 600 },
  bandStatNum: {
    fontFamily: fonts.display,
    fontSize: 'clamp(52px, 10vw, 76px)',
    lineHeight: 1,
  },
  bandStatBottom: { fontSize: 15, color: '#FFFFFF', fontWeight: 600 },

  /* ---------------- values / info ---------------- */
  tile: {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: 20,
    padding: '26px 22px',
    textAlign: 'center',
  },
  tileIcon: { fontSize: 34, marginBottom: 10 },
  tileTitle: {
    fontWeight: 800,
    fontSize: 18,
    color: colors.text,
    marginBottom: 6,
  },
  tileText: { fontSize: 14, color: colors.textFaint, lineHeight: 1.5 },
  infoCard: {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: 22,
    padding: 26,
  },
  infoTitle: {
    fontFamily: fonts.display,
    fontSize: 20,
    color: colors.text,
    margin: '0 0 10px',
    fontWeight: 400,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 1.6,
    color: colors.textSoft,
    margin: 0,
  },
  // The phone number is a real tap target on mobile but rendered as a plain
  // inline link: 16px x 1.6 line-height = 25.6px tall. Same hit-area trick as
  // the section links, plus an explicit focus ring (it was relying on the UA
  // default, which every other control on this page overrides).
  phoneLink: {
    ...TAP_TARGET_44,
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 3,
      borderRadius: 6,
    },
  },

  /* ---------------- misc ---------------- */
  centerRow: { textAlign: 'center', marginTop: 26 },
  fullMenuBtn: {
    display: 'inline-block',
    background: colors.text,
    color: '#fff',
    border: 'none',
    borderRadius: radii.pill,
    padding: '16px 40px',
    fontWeight: 800,
    fontSize: 18,
    '&:hover': { background: '#2F221C', color: '#fff' },
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 3,
    },
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    padding: '48px 0',
  },
  loadError: {
    textAlign: 'center',
    color: colors.danger,
    fontWeight: 600,
    padding: '32px 0',
  },
});

/* -------------------------------------------------------------------------
   Product picking. There is no popularity/sales data in the API, so the
   selections below are deterministic (sorted by id) and spread across
   categories — never presented as "best sellers".
   ------------------------------------------------------------------------- */
function isOfferable(product) {
  return product.inStock !== false && priceInfo(product).available;
}

function pickFeatured(weekendProducts) {
  const pool = [...weekendProducts].sort((a, b) => a.id - b.id);
  const picked = [];
  const used = new Set();

  FEATURED_CATEGORY_ORDER.forEach((catId) => {
    const hit = pool.find(
      (p) => Number(p.categoryId) === catId && !used.has(p.id) && isOfferable(p)
    );
    if (hit) {
      picked.push(hit);
      used.add(hit.id);
    }
  });

  pool.forEach((p) => {
    if (picked.length >= 4 || used.has(p.id) || !isOfferable(p)) return;
    picked.push(p);
    used.add(p.id);
  });

  return picked.slice(0, 4);
}

/** Round-robin across categories so the grid does not show eight salads. */
function pickKitchenGrid(weekendProducts, excludeIds, count = 8) {
  const buckets = new Map();
  [...weekendProducts]
    .sort((a, b) => a.id - b.id)
    .forEach((p) => {
      if (excludeIds.has(p.id) || !isOfferable(p)) return;
      const key = Number(p.categoryId);
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(p);
    });

  const lists = [...buckets.values()];
  const picked = [];
  let round = 0;
  while (picked.length < count && lists.some((l) => l.length > round)) {
    lists.forEach((list) => {
      if (picked.length < count && list[round]) picked.push(list[round]);
    });
    round += 1;
  }
  return picked.slice(0, count);
}

export const HomePage = () => {
  const classes = useStyles();
  const history = useHistory();
  const { products, loading, error } = useCatalog();

  const [menuEnables, setMenuEnables] = useState({});
  const [isMenuEnablesLoaded, setIsMenuEnablesLoaded] = useState(false);
  const [quickAddProduct, setQuickAddProduct] = useState(null);

  // getAllMenuEnables re-throws on failure; swallow it here so a flaky API
  // leaves the page usable (and quiet) instead of raising an unhandled
  // rejection. The promo/notice blocks simply stay hidden.
  const checkMenuEnables = useCallback(async () => {
    try {
      const menus = await isMenuEnableService.getAllMenuEnables();
      if (!menus || !menus.length) return;
      const next = {};
      menus.forEach((menu) => {
        next[menu.menuType] = menu.enable;
      });
      setMenuEnables(next);
      setIsMenuEnablesLoaded(true);
    } catch (err) {
      console.error('failed to load menu enables', err);
    }
  }, []);

  useEffect(() => {
    checkMenuEnables();
  }, [checkMenuEnables]);

  /* ---------- the site-closed notices, preserved from the old page ---------- */
  const isTimeAfter = (date, hours, minutes) =>
    date >= setMinutes(setHours(date, hours), minutes);

  const isTimeBefore = (date, hours, minutes) =>
    date < setMinutes(setHours(date, hours), minutes);

  const isThursdayAndTime = () => {
    const nowInIsrael = utcToZonedTime(new Date(), 'Asia/Jerusalem');
    const day = getDay(nowInIsrael);
    if (day === 4 && isTimeAfter(nowInIsrael, 18, 0)) return true;
    if (day >= 5) return true;
    if (day === 0 && isTimeBefore(nowInIsrael, 5, 0)) return true;
    return false;
  };

  /* ---------------------------- derived data ---------------------------- */
  const weekendProducts = useMemo(
    () => filterByMenu(products, 'weekend'),
    [products]
  );

  const categories = useMemo(
    () => categoriesPresent(weekendProducts),
    [weekendProducts]
  );

  const featured = useMemo(
    () => pickFeatured(weekendProducts),
    [weekendProducts]
  );

  const kitchenGrid = useMemo(
    () => pickKitchenGrid(weekendProducts, new Set(featured.map((p) => p.id))),
    [weekendProducts, featured]
  );

  const openProduct = useCallback(
    (product) => history.push(`/product/${product.id}`),
    [history]
  );

  const cardHandlers = useMemo(
    () => ({ onOpen: openProduct, onAdd: setQuickAddProduct }),
    [openProduct]
  );

  const showPesachPromo = isMenuEnablesLoaded && !!menuEnables['pesach'];
  const showTishrayPromo = isMenuEnablesLoaded && !!menuEnables['tishray'];

  const renderGrid = (list, gridClass, showCat) => {
    if (loading) {
      return (
        <div className={classes.loader}>
          <CircularProgress aria-label="טוען מנות" />
        </div>
      );
    }
    if (error) {
      return (
        <p className={classes.loadError}>
          לא הצלחנו לטעון את התפריט כרגע. נסו לרענן את העמוד או חייגו {PHONE}.
        </p>
      );
    }
    if (!list.length) return null;
    return (
      <div className={gridClass}>
        {list.map((p) => (
          <ProductCard
            key={p.id}
            vm={toCardVM(p, cardHandlers)}
            showCat={showCat}
          />
        ))}
      </div>
    );
  };

  return (
    <main className={classes.page}>
      <Helmet>
        <title>קייטרינג גבאי - דף בית</title>
        <meta name="home-page" content="homePage" />
        <meta name="robots" content="all" />
        <meta
          name="description"
          content={`קייטרינג גבאי טבריה — אוכל ביתי כשר למהדרין בהשגחת הרבנות טבריה. הזמנה אונליין ואיסוף ${PICKUP_HOURS}. טלפון ${PHONE}.`}
        />
      </Helmet>

      {/* ---------------- holiday promo (only for a non-weekend menu) --------------- */}
      {showPesachPromo && (
        <div className={classes.promoWrap}>
          <Link
            to="/menu/pesach"
            className={classes.promo}
            aria-label="מעבר לתפריט פסח"
          >
            <span>✨ תפריט פסח פתוח להזמנות</span>
            <span aria-hidden="true">הזמינו עכשיו ←</span>
          </Link>
        </div>
      )}
      {showTishrayPromo && (
        <div className={classes.promoWrap}>
          <PdfViewerPopup />
        </div>
      )}

      {/* ------------------------------- hero ------------------------------- */}
      <section className={`${classes.heroSection} gbFade`}>
        <div className={classes.hero}>
          <div
            className={`${classes.blob} gbAnim`}
            aria-hidden="true"
            style={{
              width: 380,
              height: 380,
              top: -130,
              right: -90,
              background:
                'radial-gradient(circle at 40% 40%, #B8CCA4, #8AA377)',
              opacity: 0.38,
              filter: 'blur(10px)',
              animation: 'gbDrift 16s ease-in-out infinite',
            }}
          />
          <div
            className={`${classes.blob} gbAnim`}
            aria-hidden="true"
            style={{
              width: 300,
              height: 300,
              bottom: -120,
              left: -80,
              background:
                'radial-gradient(circle at 40% 40%, #E4DCC8, #C9B694)',
              opacity: 0.42,
              filter: 'blur(8px)',
              animation: 'gbDrift 21s ease-in-out infinite reverse',
            }}
          />

          {/* Decorative only — the accessible route to these categories is the
              category strip below, so these tiles stay out of the a11y tree. */}
          {HERO_TILES.map((tile) => (
            <div
              key={tile.label}
              className="gb-float gbAnim"
              aria-hidden="true"
              style={{
                position: 'absolute',
                ...tile.style,
                animation: tile.animation,
              }}
            >
              {tile.steam && (
                <>
                  <div
                    style={{
                      position: 'absolute',
                      top: -26,
                      right: 32,
                      width: 8,
                      height: 30,
                      borderRadius: 99,
                      background: '#fff',
                      filter: 'blur(3px)',
                      animation: 'gbSteam 3.4s ease-in-out infinite',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: -26,
                      right: 54,
                      width: 8,
                      height: 30,
                      borderRadius: 99,
                      background: '#fff',
                      filter: 'blur(3px)',
                      animation: 'gbSteam 3.4s ease-in-out infinite .9s',
                    }}
                  />
                </>
              )}
              <div
                className={classes.tileInner}
                style={{
                  height: tile.size,
                  background: `radial-gradient(circle at 32% 26%, rgba(255,255,255,.55), transparent 55%), ${gradientFor(
                    tile.catId
                  )}`,
                }}
              >
                <span className={classes.tileLabel}>
                  {tile.emoji} {tile.label}
                </span>
              </div>
            </div>
          ))}

          <div className={classes.heroContent}>
            <p className={classes.heroBadge}>
              ✡️ כשר למהדרין · בהשגחת הרבנות טבריה
            </p>
            {/* Tagline is the company's own, verbatim from the logo artwork
                ("אוכל של אמא" - להתפנק ליהנות). Do not paraphrase it. */}
            <h1 className={classes.h1}>
              אוכל של אמא,
              <br />
              <span className={classes.h1Accent}>להתפנק ליהנות.</span>
            </h1>
            <p className={classes.heroText}>
              מטעמים ביתיים מבושלים במטבח שלנו, נארזים ומוכנים לאיסוף בימי שישי.
              מזמינים אונליין בשתי דקות.
            </p>
            <div className={classes.ctaRow}>
              <Link to="/menu/weekend" className={classes.ctaPrimary}>
                להזמנת מנות <span aria-hidden="true">←</span>
              </Link>
              <a
                href={PHONE_HREF}
                className={classes.ctaSecondary}
                aria-label={`חיוג לקייטרינג גבאי בטלפון ${PHONE}`}
              >
                לבירורים {PHONE}
              </a>
            </div>
            <ul className={classes.heroFacts}>
              <li>🍲 בישול ביתי</li>
              <li>🥡 איסוף {PICKUP_HOURS}</li>
              <li>📍 טבריה</li>
            </ul>
          </div>
        </div>
      </section>

      {/* --------------------------- categories --------------------------- */}
      {!loading && categories.length > 0 && (
        <section className={classes.section} aria-labelledby="home-cats">
          <div className={classes.sectionHead}>
            <h2 id="home-cats" className={classes.h2}>
              מה מזמינים היום?
            </h2>
            <Link to="/menu/weekend" className={classes.moreLink}>
              לכל התפריט <span aria-hidden="true">←</span>
            </Link>
          </div>
          <div className="gb-cats">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/menu/weekend?cat=${cat.id}`}
                className={classes.catTile}
                aria-label={`מעבר לקטגוריית ${cat.label} בתפריט`}
              >
                <span
                  className={classes.catCircle}
                  style={{ background: gradientFor(cat.id), display: 'block' }}
                >
                  {/* ImageCloud falls back to the site logo for an empty id,
                      so only render it when the category really has a photo. */}
                  {cat.imgUrl ? (
                    <ImageCloud
                      imageId={cat.imgUrl}
                      maxWidth={120}
                      maxHeight={120}
                      alt=""
                    />
                  ) : null}
                </span>
                <span className={classes.catLabel}>{cat.label}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---------------------------- featured ---------------------------- */}
      <section className={classes.section} aria-labelledby="home-featured">
        <div className={classes.sectionHead}>
          <h2 id="home-featured" className={classes.h2}>
            מומלץ להתחיל מכאן
          </h2>
          <Link to="/menu/weekend" className={classes.moreLink}>
            עוד <span aria-hidden="true">←</span>
          </Link>
        </div>
        {renderGrid(featured, 'gb-grid4', false)}
      </section>

      {/* -------------------------- shabbat band -------------------------- */}
      <section className={classes.bandSection} aria-labelledby="home-band">
        <div className={`${classes.band} gb-band`}>
          <span className={classes.bandBlob} aria-hidden="true" />
          <div>
            <p className={classes.bandKicker}>תפריט סוף השבוע</p>
            <h2 id="home-band" className={classes.bandTitle}>
              בונים את השבת שלכם,
              <br />
              מנה-מנה
            </h2>
            <p className={classes.bandText}>
              בוחרים מהתפריט בדיוק את מה שאתם רוצים ובכמות שמתאימה לכם — סלטים,
              מרקים, עופות, בשרים, תוספות ופשטידות. ההזמנה נארזת ומחכה לאיסוף
              {` ${PICKUP_HOURS}`}.
            </p>
            <Link to="/menu/weekend" className={classes.bandBtn}>
              לתפריט סוף השבוע <span aria-hidden="true">←</span>
            </Link>
          </div>
          <div className={classes.bandStat}>
            {!loading && weekendProducts.length > 0 && (
              <>
                <div className={classes.bandStatTop}>בתפריט</div>
                <div className={classes.bandStatNum}>
                  {weekendProducts.length}
                </div>
                <div className={classes.bandStatBottom}>
                  מנות ב-{categories.length} קטגוריות
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* --------------------------- menu preview --------------------------- */}
      <section className={classes.section} aria-labelledby="home-kitchen">
        <div className={classes.sectionHead}>
          <h2 id="home-kitchen" className={classes.h2}>
            מהמטבח שלנו
          </h2>
        </div>
        {renderGrid(kitchenGrid, 'gb-grid4', true)}
        {!loading && !error && (
          <div className={classes.centerRow}>
            <Link to="/menu/weekend" className={classes.fullMenuBtn}>
              לתפריט המלא <span aria-hidden="true">←</span>
            </Link>
          </div>
        )}
      </section>

      {/* ---------------------------- value props ---------------------------- */}
      <section className={classes.section} aria-labelledby="home-values">
        <h2 id="home-values" className={classes.h2} style={{ marginBottom: 18 }}>
          למה קייטרינג גבאי
        </h2>
        <div className="gb-values">
          {VALUE_PROPS.map((v) => (
            <div key={v.title} className={classes.tile}>
              <div className={classes.tileIcon} aria-hidden="true">
                {v.icon}
              </div>
              <h3 className={classes.tileTitle}>{v.title}</h3>
              <p className={classes.tileText}>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* -------- practical info (replaces the mock's invented reviews) -------- */}
      <section className={classes.section} aria-labelledby="home-info">
        <h2
          id="home-info"
          className={classes.h2}
          style={{ marginBottom: 20, textAlign: 'center' }}
        >
          מה שחשוב לדעת לפני שמזמינים
        </h2>
        <div className="gb-grid3">
          <div className={classes.infoCard}>
            <h3 className={classes.infoTitle}>כשרות</h3>
            <p className={classes.infoText}>
              כשר למהדרין, בהשגחת הרבנות טבריה.
            </p>
          </div>
          <div className={classes.infoCard}>
            <h3 className={classes.infoTitle}>איסוף ההזמנה</h3>
            <p className={classes.infoText}>
              {PICKUP_HOURS}
              <br />
              {ADDRESS}
            </p>
          </div>
          <div className={classes.infoCard}>
            <h3 className={classes.infoTitle}>הזמנות ובירורים</h3>
            <p className={classes.infoText}>
              <a
                href={PHONE_HREF}
                className={classes.phoneLink}
                aria-label={`חיוג לטלפון ${PHONE}`}
              >
                {PHONE}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* --------------------------- notices / modals --------------------------- */}
      {isMenuEnablesLoaded && menuEnables['message_home_page'] && (
        <BasicModal
          contnentLineOne={'האתר סגור להזמנות חדשות, עקב עבודות תחזוקה באתר..'}
          contnentLineTow={`להזמנות חייגו ${PHONE}`}
          lockScreen={true}
          type="pesach"
          withCloseBtn={
            menuEnables['withCloseBtn'] ? menuEnables['withCloseBtn'] : false
          }
        />
      )}
      {isThursdayAndTime() && (
        <BasicModal
          contnentLineOne={'האתר סגור להזמנות חדשות, עד יום שבת בשעה 8:00.'}
          contnentLineTow={`הקייטרינג פתוח בימי שישי מהשעה 7:00 עד 14:00.
              מספר טלפון לפרטים ${PHONE}
              `}
          lockScreen={true}
          type="pesach"
          withCloseBtn={
            menuEnables['withCloseBtn'] ? menuEnables['withCloseBtn'] : false
          }
        />
      )}

      <QuickAddModal
        product={quickAddProduct}
        open={!!quickAddProduct}
        onClose={() => setQuickAddProduct(null)}
        onAdded={() => setQuickAddProduct(null)}
      />
    </main>
  );
};

export default HomePage;
