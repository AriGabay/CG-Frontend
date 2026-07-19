import React from 'react';
import { makeStyles } from '@mui/styles';
import { ImageCloud } from '../../ImageCloud/ImageCloud';
import { colors, radii, shadows, fonts } from '../../../styles/designTokens';

const useStyles = makeStyles({
  card: {
    position: 'relative',
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.lg,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform .15s, box-shadow .15s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: shadows.card,
    },
    // Focus lives on the real <button> inside, but the ring is drawn around
    // the whole card so it reads as one target.
    '&:focus-within': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 2,
    },
  },
  // "Stretched button": the accessible name and click target for opening the
  // product. Its ::after covers the card so the whole card stays clickable,
  // without nesting the quick-add <button> inside another interactive element.
  titleBtn: {
    all: 'unset',
    cursor: 'pointer',
    fontWeight: 800,
    fontSize: 17,
    color: colors.text,
    lineHeight: 1.3,
    display: 'block',
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      zIndex: 1,
    },
  },
  media: {
    position: 'relative',
    height: 170,
    overflow: 'hidden',
    '& img': {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
  },
  // Both overlays are decoration, not controls. Without pointerEvents:'none'
  // they sit at zIndex 2 — above the title button's ::after (zIndex 1) — and
  // swallow clicks aimed at the card, which on a narrow card is a sizeable
  // dead zone right next to the quick-add button.
  badge: {
    position: 'absolute',
    top: 12,
    insetInlineEnd: 12,
    background: colors.text,
    color: colors.cream,
    fontWeight: 700,
    fontSize: 12,
    borderRadius: radii.pill,
    padding: '5px 12px',
    zIndex: 2,
    pointerEvents: 'none',
  },
  catChip: {
    position: 'absolute',
    bottom: 10,
    insetInlineEnd: 12,
    background: 'rgba(255,255,255,.9)',
    color: colors.text,
    fontWeight: 700,
    fontSize: 12,
    borderRadius: radii.pill,
    padding: '4px 10px',
    zIndex: 2,
    pointerEvents: 'none',
  },
  addBtn: {
    position: 'absolute',
    bottom: 12,
    insetInlineStart: 12,
    width: 42,
    height: 42,
    borderRadius: '50%',
    border: 'none',
    background: '#fff',
    color: colors.greenLink,
    fontSize: 24,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 14px -6px rgba(0,0,0,.35)',
    zIndex: 3,
    transition: 'transform .12s',
    // The painted circle stays 42px so the design is unchanged; an invisible
    // 1px ring lifts the hit area to 44x44 (WCAG 2.2 AA 2.5.8 floors at 24, 44
    // is the mobile norm). It inherits the button's zIndex 3, so it still sits
    // above the title button's ::after (zIndex 1) and the two stay
    // independently clickable. `inset` keeps this direction-agnostic under RTL.
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: '-1px',
    },
    '&:hover': { transform: 'scale(1.08)' },
    '&:disabled': { opacity: 0.45, cursor: 'not-allowed' },
  },
  body: {
    padding: '14px 16px 16px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  name: {
    fontWeight: 800,
    fontSize: 17,
    color: colors.text,
    marginBottom: 4,
    lineHeight: 1.3,
  },
  desc: {
    fontSize: 13.5,
    color: colors.textFaint,
    lineHeight: 1.4,
    // Two lines, clamped with an ellipsis instead of the old hard
    // maxHeight/overflow cut, so a long description degrades legibly.
    // The reserved height is in em, not px: under text-only zoom (Firefox, and
    // OS-level font scaling) the font grows but px lengths do not, so the old
    // maxHeight:38 would have sliced through the first line at 200%. 2.8em is
    // exactly 2 x lineHeight, so it renders identically to the previous 38px
    // at the default size and grows with the text. WCAG 2.0 AA 1.4.4.
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    minHeight: '2.8em',
    margin: 0,
    maxWidth: 'none',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 10,
  },
  serving: {
    fontSize: 13,
    color: colors.textFaint,
    fontWeight: 600,
    marginBottom: 2,
  },
  price: {
    fontFamily: fonts.display,
    fontSize: 21,
    color: colors.greenLink,
  },
  outOfStock: {
    fontSize: 13,
    fontWeight: 700,
    color: colors.danger,
  },
});

/**
 * Product card for the home and menu grids.
 *
 * @param {object}   vm       view model from viewModel.service#toCardVM
 * @param {boolean}  showCat  render the category chip over the image
 */
export const ProductCard = ({ vm, showCat = false, badge = '' }) => {
  const classes = useStyles();
  if (!vm) return null;

  // `priceType` alone is not enough: a product can be typed `weight` and still
  // have zero price tiers, in which case the card shows "לפרטים בטלפון" and the
  // quick-add dialog has nothing to sell. Gate on real availability.
  const addable = vm.inStock && vm.available !== false && !!vm.onAdd;

  return (
    <article className={classes.card}>
      <div className={classes.media} style={{ background: vm.grad }}>
        {/* ImageCloud coerces an empty imageId to the company logo, which reads
            as a real product photo. Several products have imgUrl: "" — show the
            category gradient on its own for those. */}
        {vm.imgUrl ? (
          <ImageCloud
            imageId={vm.imgUrl}
            maxWidth={400}
            maxHeight={340}
            alt={`תמונה של ${vm.name}`}
          />
        ) : null}
        {badge ? <span className={classes.badge}>{badge}</span> : null}
        {showCat && vm.catLabel ? (
          <span className={classes.catChip}>{vm.catLabel}</span>
        ) : null}
        {addable ? (
          <button
            type="button"
            className={classes.addBtn}
            onClick={vm.onAdd}
            aria-label={`הוספת ${vm.name} לעגלה`}
          >
            +
          </button>
        ) : null}
      </div>
      <div className={classes.body}>
        <div className={classes.name}>
          <button
            type="button"
            className={classes.titleBtn}
            onClick={vm.onOpen}
            aria-label={`${vm.name}, ${vm.priceLabel}`}
          >
            {vm.name}
          </button>
        </div>
        {vm.desc ? <p className={classes.desc}>{vm.desc}</p> : null}
        <div className={classes.footer}>
          {vm.inStock ? (
            <>
              {vm.serving ? (
                <div className={classes.serving}>{vm.serving}</div>
              ) : null}
              <div className={classes.price}>{vm.priceLabel}</div>
            </>
          ) : (
            <div className={classes.outOfStock}>אזל מהמלאי</div>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
