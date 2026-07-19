import React, { useCallback, useEffect, useRef, useState } from 'react';
import { makeStyles } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link, NavLink, useHistory, useLocation } from 'react-router-dom';
import { ImageCloud } from '../ImageCloud/ImageCloud';
import { Cart } from '../Cart';
import { cartService } from '../../services/cartService';
import { eventBus } from '../../services/event-bus';
import { colors, radii, layout } from '../../styles/designTokens';

/** Real business details — sourced from src/pages/Contact and src/pages/About. */
export const BUSINESS = {
  phoneDisplay: '04-6734949',
  phoneHref: 'tel:04-6734949',
  email: 'gabay.catering@gmail.com',
  address: 'המברג 10, טבריה',
};

/**
 * Every claim in this strip must be traceable to existing site copy, so no
 * invented hours / certifications / addresses reach a real customer:
 *   hours    -> HomePage.jsx ("הקייטרינג פתוח בימי שישי מהשעה 7:00 עד 14:00")
 *   address  -> Contact.jsx / About.jsx ("המברג 10, טבריה")
 *   kashrut  -> HomePage.jsx logo alt ("בהשגחת הרבנות, כשר למהדרין טבריה")
 */
const ANNOUNCEMENT =
  'איסוף בימי שישי 7:00–14:00 · המברג 10, טבריה · כשר למהדרין בהשגחת הרבנות טבריה';

const DEFAULT_MENU_PATH = '/menu/weekend';

const NAV_LINKS = [
  { to: '/', label: 'בית', exact: true },
  { to: DEFAULT_MENU_PATH, label: 'התפריט', exact: false },
  { to: '/about', label: 'עלינו', exact: false },
  { to: '/contact', label: 'צור קשר', exact: false },
];

const MOBILE_EXTRA_LINKS = [
  { to: '/AccessibilityAnnouncement', label: 'הצהרת נגישות' },
];

/**
 * WCAG 2.2 AA (2.5.8) puts a 24x24 CSS px floor under pointer targets, and
 * 44x44 is the mobile norm. Several header controls are small by design, so we
 * grow only the *hit* area with a transparent overlay and leave the rendered
 * icon/text untouched.
 *
 * `left` + `translate` are deliberately physical rather than logical: a
 * perfectly centred overlay is symmetric, so it lands identically in RTL and
 * LTR, whereas `insetInlineStart` would need the translate flipped to match.
 */
const hitArea = (minWidth = 44) => ({
  content: '""',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  minWidth,
  height: 44,
});

const useStyles = makeStyles({
  announcement: {
    background: colors.text,
    color: colors.cream,
    fontSize: 14,
    fontWeight: 500,
    textAlign: 'center',
    padding: '9px 16px',
    letterSpacing: '.2px',
    lineHeight: 1.5,
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    background: 'rgba(245,241,234,.92)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderBottom: `1px solid ${colors.border}`,
  },
  bar: {
    maxWidth: layout.maxWidth,
    margin: '0 auto',
    padding: '12px 22px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
    // Trimmed on phones so the enlarged 44px controls still fit on one row
    // rather than pushing the burger onto a line of its own, which also keeps
    // the sticky header from eating more vertical space than it did before.
    '@media (max-width: 640px)': {
      padding: '10px 16px',
    },
  },
  logoLink: {
    display: 'inline-flex',
    alignItems: 'center',
    flex: 'none',
    lineHeight: 0,
    // The logo image drops to 42px tall at <=640px; hold the target at 44.
    minHeight: 44,
    borderRadius: radii.sm,
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 3,
    },
  },
  logoImg: {
    height: 52,
    width: 'auto',
    maxWidth: 120,
    objectFit: 'contain',
    '@media (max-width: 640px)': {
      height: 42,
    },
  },
  navLinks: {
    display: 'flex',
    gap: 26,
    fontWeight: 600,
    fontSize: 16,
    marginInlineStart: 8,
  },
  navLink: {
    position: 'relative',
    color: colors.text,
    textDecoration: 'none',
    padding: '4px 2px',
    borderRadius: 6,
    transition: 'color .15s',
    // Rendered at ~29-59 x 32. The overlay lifts every link to >=44x44 while
    // the text and the active underline stay exactly where they were. The
    // narrowest link ("בית") overhangs 7.5px per side into a 26px gap, so
    // neighbouring hit areas keep ~11px of clearance and never overlap.
    '&::after': hitArea(),
    '&:hover': { color: colors.greenLink },
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 3,
    },
  },
  navLinkActive: {
    color: colors.greenLink,
    boxShadow: `inset 0 -2px 0 ${colors.green}`,
  },
  searchForm: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    minWidth: 0,
  },
  searchWrap: {
    position: 'relative',
    width: '100%',
    maxWidth: 360,
  },
  searchIcon: {
    position: 'absolute',
    top: '50%',
    insetInlineStart: 14,
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    border: `1px solid ${colors.borderInput}`,
    background: colors.surface,
    borderRadius: radii.pill,
    // minHeight rather than height so the field grows with the text at 200%
    // zoom instead of clipping (WCAG 1.4.4). 11px padding + a 15px line box
    // left this at 42px.
    minHeight: 44,
    padding: '11px 16px',
    paddingInlineStart: 44,
    paddingInlineEnd: 16,
    fontSize: 15,
    color: colors.text,
    outline: 'none',
    '&::placeholder': { color: colors.textFaint },
    '&:focus': {
      borderColor: colors.green,
      boxShadow: `0 0 0 3px ${colors.greenPale}`,
    },
  },
  phoneLink: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    color: colors.text,
    fontWeight: 700,
    fontSize: 15,
    flex: 'none',
    textDecoration: 'none',
    borderRadius: 6,
    // Below 900px `.gb-phone-txt` is hidden and the link collapses to the bare
    // 17x17 icon. The overlay restores a 44x44 target there and a full-width
    // 44px-tall one on desktop. Its 13.5px per-side overhang on mobile sits
    // inside the bar's 16px flex gap, leaving 2.5px clear of the logo and cart.
    '&::after': hitArea(),
    '&:hover': { color: colors.greenLink },
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 3,
    },
  },
  cartBtn: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: colors.green,
    color: '#fff',
    border: 'none',
    borderRadius: radii.pill,
    padding: '11px 20px',
    // 11px padding around an 18px icon rendered a 40px-tall button; the pill
    // grows 2px top and bottom to clear 44 with the label staying centred.
    minHeight: 44,
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
    flex: 'none',
    boxShadow: '0 8px 18px -8px rgba(94,124,79,.7)',
    transition: 'background .15s, transform .12s',
    // greenDeep has since been retuned to #546F55 (5.55:1, genuinely darker
    // than `green`), so the standard hover token is correct here again and
    // matches the other green CTAs.
    // and genuinely darker. Same swap NotFound/NotEnable made for this pair.
    '&:hover': { background: colors.greenDeep },
    '&:active': { transform: 'translateY(1px)' },
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDark}`,
      outlineOffset: 2,
    },
  },
  cartBadge: {
    background: '#fff',
    color: colors.greenLink,
    fontWeight: 800,
    fontSize: 13,
    borderRadius: radii.pill,
    minWidth: 22,
    height: 22,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 6px',
  },
  burger: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    // 42 -> 44; the 22px icon inside is unchanged.
    width: 44,
    height: 44,
    flex: 'none',
    border: `1px solid ${colors.borderInput}`,
    background: colors.surface,
    color: colors.text,
    borderRadius: radii.sm,
    cursor: 'pointer',
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 2,
    },
  },
  mobileNav: {
    borderTop: `1px solid ${colors.border}`,
    background: colors.bg,
    // Bottom padding trimmed by the 8px the phone link below gained when its
    // tap target grew, so the panel keeps its original overall height.
    padding: '10px 22px 8px',
  },
  mobileList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  mobileLink: {
    display: 'block',
    padding: '13px 4px',
    fontSize: 17,
    fontWeight: 700,
    color: colors.text,
    textDecoration: 'none',
    borderBottom: `1px solid ${colors.border}`,
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: -2,
    },
  },
  mobilePhone: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    // Was a ~24px-tall target. minHeight lifts it to 44 and the smaller
    // marginTop absorbs the 10px that grows above the text, so the number
    // stays visually where it was relative to the last menu link.
    minHeight: 44,
    marginTop: 4,
    fontWeight: 700,
    fontSize: 16,
    color: colors.greenLink,
    borderRadius: 6,
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 3,
    },
  },
});

const IconSearch = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke={colors.textFaint}
    strokeWidth="2"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.5" y2="16.5" />
  </svg>
);

const IconPhone = () => (
  <svg
    viewBox="0 0 24 24"
    width="17"
    height="17"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.8.6a2 2 0 0 1 1.7 2Z" />
  </svg>
);

const IconCart = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.5 3h2l2.6 12.4a2 2 0 0 0 2 1.6h8.5a2 2 0 0 0 2-1.6L23 6H6" />
  </svg>
);

const IconBurger = ({ open }) => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
    focusable="false"
  >
    {open ? (
      <>
        <line x1="5" y1="5" x2="19" y2="19" />
        <line x1="19" y1="5" x2="5" y2="19" />
      </>
    ) : (
      <>
        <line x1="4" y1="7" x2="20" y2="7" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="17" x2="20" y2="17" />
      </>
    )}
  </svg>
);

export const AppHeader = () => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:900px)');

  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [query, setQuery] = useState('');

  const isMountedRef = useRef(true);
  const burgerRef = useRef(null);
  // Last query string this component itself put into the URL. Used so the
  // URL -> input sync below ignores our own navigations.
  const lastPushedRef = useRef('');

  const isMenuRoute = location.pathname.startsWith('/menu/');

  /* ---------------- cart count (live, via eventBus) ---------------- */

  const refreshCart = useCallback(async () => {
    const cartData = await cartService.getCart();
    if (!isMountedRef.current) return;
    const items = Array.isArray(cartData) ? cartData : [];
    setCart(items);
    setCartCount(items.length);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    refreshCart();
    eventBus.on('addProductToCart', refreshCart);
    eventBus.on('removeProductToCart', refreshCart);
    eventBus.on('checkOutOrder', refreshCart);
    return () => {
      isMountedRef.current = false;
    };
  }, [refreshCart]);

  const openCart = (event) => {
    setAnchorEl(event.currentTarget);
    setIsMobileNavOpen(false);
    refreshCart();
  };

  /* ---------------- search -> /menu/:type?q= ---------------- */

  const goSearch = useCallback(
    (value) => {
      const trimmed = value.trim();
      const onMenu = location.pathname.startsWith('/menu/');
      const base = onMenu ? location.pathname : DEFAULT_MENU_PATH;
      // Only keep sibling query params when we are already on the menu page.
      const params = new URLSearchParams(onMenu ? location.search : '');
      if (trimmed) params.set('q', trimmed);
      else params.delete('q');
      const qs = params.toString();
      const target = qs ? `${base}?${qs}` : base;

      lastPushedRef.current = trimmed;
      if (onMenu) history.replace(target);
      else history.push(target);
    },
    [history, location.pathname, location.search]
  );

  // Debounced search-as-you-type.
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed === lastPushedRef.current) return undefined;
    // Do not yank the visitor off another page for a single character.
    if (!isMenuRoute && trimmed.length < 2) return undefined;
    const timeoutId = setTimeout(() => goSearch(query), 400);
    return () => clearTimeout(timeoutId);
  }, [query, isMenuRoute, goSearch]);

  // Keep the input in sync with the URL (deep links, back/forward, nav away).
  useEffect(() => {
    const urlQuery = new URLSearchParams(location.search).get('q') || '';
    if (urlQuery !== lastPushedRef.current) {
      lastPushedRef.current = urlQuery;
      setQuery(urlQuery);
    }
  }, [location.search]);

  const onSubmitSearch = (event) => {
    event.preventDefault();
    goSearch(query);
  };

  /* ---------------- mobile nav ---------------- */

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMobile) setIsMobileNavOpen(false);
  }, [isMobile]);

  // Escape closes the panel and hands focus back to the button that opened it,
  // so a keyboard user is never left with the caret inside a hidden panel.
  useEffect(() => {
    if (!isMobileNavOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      setIsMobileNavOpen(false);
      if (burgerRef.current) burgerRef.current.focus();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isMobileNavOpen]);

  const closeMobileNav = () => setIsMobileNavOpen(false);

  return (
    <>
      <div className={classes.announcement}>{ANNOUNCEMENT}</div>

      <header className={classes.header}>
        <div className={classes.bar}>
          <Link
            to="/"
            className={classes.logoLink}
            aria-label="קייטרינג גבאי — מעבר לדף הבית"
          >
            <ImageCloud
              ClassName={classes.logoImg}
              imageId="old_logo_rssqwk"
              maxHeight={104}
              alt="הלוגו של קייטרינג גבאי"
            />
          </Link>

          <nav className={`gb-navlinks ${classes.navLinks}`} aria-label="ניווט ראשי">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                exact={link.exact}
                className={classes.navLink}
                activeClassName={classes.navLinkActive}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <form
            className={`gb-navsearch ${classes.searchForm}`}
            role="search"
            onSubmit={onSubmitSearch}
          >
            <div className={classes.searchWrap}>
              <span className={classes.searchIcon}>
                <IconSearch />
              </span>
              <input
                type="search"
                className={classes.searchInput}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="חיפוש מנה, קטגוריה..."
                aria-label="חיפוש מנה או קטגוריה בתפריט"
              />
            </div>
          </form>

          <a
            href={BUSINESS.phoneHref}
            className={classes.phoneLink}
            aria-label={`חיוג לקייטרינג גבאי בטלפון ${BUSINESS.phoneDisplay}`}
          >
            <IconPhone />
            <span className="gb-phone-txt">{BUSINESS.phoneDisplay}</span>
          </a>

          <button
            type="button"
            className={classes.cartBtn}
            onClick={openCart}
            aria-haspopup="true"
            aria-expanded={Boolean(anchorEl)}
            aria-label={
              cartCount
                ? `עגלת קניות, ${cartCount} פריטים`
                : 'עגלת קניות, ריקה'
            }
          >
            <IconCart />
            העגלה
            {cartCount > 0 && (
              <span className={classes.cartBadge}>{cartCount}</span>
            )}
          </button>

          {isMobile && (
            <button
              type="button"
              ref={burgerRef}
              className={classes.burger}
              onClick={() => setIsMobileNavOpen((prev) => !prev)}
              aria-expanded={isMobileNavOpen}
              aria-controls="gb-mobile-nav"
              aria-label={isMobileNavOpen ? 'סגירת התפריט' : 'פתיחת התפריט'}
            >
              <IconBurger open={isMobileNavOpen} />
            </button>
          )}
        </div>

        {isMobile && isMobileNavOpen && (
          <nav
            id="gb-mobile-nav"
            className={classes.mobileNav}
            aria-label="ניווט ראשי לנייד"
          >
            <ul className={classes.mobileList}>
              {[...NAV_LINKS, ...MOBILE_EXTRA_LINKS].map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    exact={link.exact}
                    className={classes.mobileLink}
                    activeClassName={classes.navLinkActive}
                    onClick={closeMobileNav}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
            <a href={BUSINESS.phoneHref} className={classes.mobilePhone}>
              <IconPhone />
              {BUSINESS.phoneDisplay}
            </a>
          </nav>
        )}
      </header>

      {anchorEl && (
        <Cart
          cart={cart}
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          setCart={setCart}
          setIsOpenMenu={setIsMobileNavOpen}
        />
      )}
    </>
  );
};
