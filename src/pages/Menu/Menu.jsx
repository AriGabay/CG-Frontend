import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';
import { getDay, setHours, setMinutes } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import _ from 'lodash';

import BasicModal from '../../cmps/BasicModal/BasicModal';
import { ProductCard } from '../../cmps/design/ProductCard';
import { QuickAddModal } from '../../cmps/design/QuickAddModal';
import { useCatalog } from '../../hooks/useCatalog';
import { isMenuEnableService } from '../../services/isMenuEnableService';
import {
  MENU_LABEL,
  categoriesPresent,
  filterByMenu,
  searchProducts,
  toCardVM,
} from '../../services/viewModel.service';
import { colors, fonts, layout, radii } from '../../styles/designTokens';

// Display order of the seasonal menus in the tab strip.
const MENU_ORDER = ['weekend', 'tishray', 'pesach'];

// Pointer-target floor. WCAG 2.2 AA (2.5.8) asks for 24x24 CSS px and 44x44 is
// the mobile norm; the menu tabs render at 40px and the category chips at 42px.
// The fix expands only the hit area with a transparent overlay — the pill keeps
// the size it was designed at. `height: 100%` keeps the overlay from ever being
// smaller than the control itself (e.g. at 200% text zoom), and `minHeight`
// raises it to 44 when the control is shorter. Logical insets keep it correct
// under RTL.
const tapTarget = {
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    insetInlineStart: 0,
    insetInlineEnd: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    height: '100%',
    minHeight: 44,
  },
};

const useStyles = makeStyles({
  page: {
    maxWidth: layout.maxWidth,
    margin: '0 auto',
    padding: '34px 22px 40px',
  },
  head: {
    marginBottom: 18,
  },
  eyebrow: {
    fontSize: 14,
    color: colors.textFaint,
    fontWeight: 600,
    marginBottom: 6,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 44,
    fontWeight: 400,
    lineHeight: 1.2,
    margin: 0,
    color: colors.text,
    '@media (max-width: 640px)': {
      fontSize: 30,
    },
  },
  tabs: {
    display: 'flex',
    // Wraps instead of overflowing once a third seasonal menu is open and the
    // viewport is very narrow. At normal widths the strip still fits one line,
    // so nothing moves.
    flexWrap: 'wrap',
    gap: 8,
    background: colors.surfaceSunken,
    borderRadius: 14,
    padding: 5,
    marginBottom: 22,
    width: 'fit-content',
    maxWidth: '100%',
  },
  tab: {
    ...tapTarget,
    border: 'none',
    background: 'transparent',
    borderRadius: 10,
    padding: '9px 18px',
    fontFamily: fonts.body,
    fontSize: 15,
    fontWeight: 700,
    color: colors.textSoft,
    cursor: 'pointer',
    '&:hover': {
      color: colors.text,
    },
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 2,
    },
  },
  tabActive: {
    background: colors.surface,
    color: colors.text,
    boxShadow: '0 4px 10px -6px rgba(67,49,42,.5)',
  },
  searchWrap: {
    position: 'relative',
    maxWidth: 520,
    marginBottom: 20,
  },
  searchIcon: {
    position: 'absolute',
    top: '50%',
    insetInlineStart: 16,
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    // An <input> cannot carry a ::after overlay, so the field itself has to
    // clear the 44px pointer-target floor.
    minHeight: 44,
    border: `1px solid ${colors.borderInput}`,
    background: colors.surface,
    borderRadius: radii.pill,
    padding: '14px 18px',
    paddingInlineStart: 48,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.text,
    outline: 'none',
    '&::placeholder': {
      color: colors.textFaint,
    },
    '&:focus': {
      borderColor: colors.greenDeep,
      boxShadow: `0 0 0 3px ${colors.greenPale}`,
    },
    // The greenPale ring is only 1.14:1 against the page background, so on its
    // own it is not a focus indicator anyone can see (2.4.7). Match the outline
    // the tabs and chips already use.
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 2,
    },
  },
  chips: {
    display: 'flex',
    // Row gap has to stay clear of the 44px hit areas: the chips render at 42px
    // so each overlay grows by 1px per side, leaving 8px between the hit areas
    // of chips on adjacent rows. No overlap, so the gap stays as designed.
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 26,
    padding: 0,
    listStyle: 'none',
  },
  chip: {
    ...tapTarget,
    background: colors.surface,
    border: `1px solid ${colors.borderInput}`,
    borderRadius: radii.pill,
    padding: '9px 18px',
    fontFamily: fonts.body,
    fontSize: 15,
    fontWeight: 600,
    color: colors.text,
    cursor: 'pointer',
    transition: 'background .15s, color .15s, border-color .15s',
    '&:hover': {
      borderColor: colors.text,
    },
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 2,
    },
  },
  chipActive: {
    background: colors.text,
    borderColor: colors.text,
    color: '#fff',
  },
  state: {
    textAlign: 'center',
    padding: '70px 20px',
    color: colors.textFaint,
  },
  stateIcon: {
    fontSize: 46,
    marginBottom: 12,
  },
  stateTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: colors.text,
    marginBottom: 6,
  },
  stateText: {
    fontSize: 16,
  },
  srOnly: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0 0 0 0)',
    whiteSpace: 'nowrap',
    border: 0,
  },
});

export const Menu = ({ menuType }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const { products, loading, error } = useCatalog();
  const [menuEnables, setMenuEnables] = useState({});
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState(null);
  const [quickAddProduct, setQuickAddProduct] = useState(null);

  // ---- menu availability -------------------------------------------------
  // The admin can switch a seasonal menu off; a request for a menu that is not
  // currently open goes to /notEnable. `menuEnables` doubles as the source for
  // the maintenance banner and the menu tab strip.
  useEffect(() => {
    let alive = true;
    isMenuEnableService
      .getAllMenuEnables()
      .then((menus) => {
        if (!alive) return;
        const map = {};
        (menus || []).forEach((menu) => {
          map[menu.menuType] = menu.enable;
        });
        setMenuEnables(map);
        if (!map[menuType]) history.push('/notEnable');
      })
      .catch((err) => {
        // Fail open: a flaky settings call should not lock customers out of a
        // menu that is actually open.
        console.error('Error fetching menu enables:', err);
      });
    return () => {
      alive = false;
    };
  }, [menuType, history]);

  // Other pages (CategoryCard, ProductsList) read the active menu from redux.
  useEffect(() => {
    dispatch({ type: 'SET_MENU_TYPE', payload: menuType || '' });
  }, [dispatch, menuType]);

  // ---- deep links --------------------------------------------------------
  // ?q= comes from the header search box, ?cat= from the home category strip.
  // Re-running on `location.search` also covers a second header search while
  // already standing on this page. Typing never rewrites the URL, so this
  // never fights the user's input.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get('q') || '');
    const cat = params.get('cat');
    const catId = Number(cat);
    setActiveCat(cat && !Number.isNaN(catId) ? catId : null);
  }, [location.search]);

  // ---- ordering window ---------------------------------------------------
  // Thursday 18:00 -> Saturday 05:00 Asia/Jerusalem the shop takes no orders.
  const isTimeAfter = (date, hours, minutes) => {
    const targetTime = setMinutes(setHours(date, hours), minutes);
    return date >= targetTime;
  };

  const isTimeBefore = (date, hours, minutes) => {
    const targetTime = setMinutes(setHours(date, hours), minutes);
    return date < targetTime;
  };

  const isThursdayAndTime = () => {
    const now = new Date();
    const timeZone = 'Asia/Jerusalem';
    const nowInIsrael = utcToZonedTime(now, timeZone);
    const day = getDay(nowInIsrael);

    if (day === 4 && isTimeAfter(nowInIsrael, 18, 0)) {
      return true;
    }

    if (day >= 5) {
      return true;
    }

    if (day === 0 && isTimeBefore(nowInIsrael, 5, 0)) {
      return true;
    }

    return false;
  };

  // ---- data --------------------------------------------------------------
  const menuProducts = useMemo(
    () => filterByMenu(products, menuType),
    [products, menuType]
  );

  // Chips are derived from the menu, not from the current search, so they stay
  // put while the customer types.
  const categories = useMemo(
    () => categoriesPresent(menuProducts),
    [menuProducts]
  );

  const visible = useMemo(() => {
    const byCat =
      activeCat === null
        ? menuProducts
        : menuProducts.filter(
            (p) => Number(p.Category?.id ?? p.categoryId) === activeCat
          );
    return searchProducts(byCat, query);
  }, [menuProducts, activeCat, query]);

  const handleOpen = useCallback(
    (product) => {
      // ProductPreview renders from state.product immediately, then refetches.
      dispatch({ type: 'SET_PRODUCT', payload: _.cloneDeep(product) });
      history.push({
        pathname: `/product/${product.id}`,
        state: `${location.pathname}${location.search}`,
      });
    },
    [dispatch, history, location.pathname, location.search]
  );

  const handleAdd = useCallback((product) => {
    setQuickAddProduct(product);
  }, []);

  const cards = useMemo(
    () =>
      visible.map((product) =>
        toCardVM(product, { onOpen: handleOpen, onAdd: handleAdd })
      ),
    [visible, handleOpen, handleAdd]
  );

  const enabledMenus = useMemo(
    () => MENU_ORDER.filter((type) => !!menuEnables[type]),
    [menuEnables]
  );
  const showTabs = enabledMenus.length > 1;

  const menuLabel = MENU_LABEL[menuType] || '';
  const titlePage = menuLabel ? `תפריט ${menuLabel}` : 'תפריט';

  return (
    <main className={`${classes.page} gb-pad gbFade`}>
      <Helmet>
        <title>קייטרינג גבאי - תפריט</title>
        <meta name="menu-list" content="menu list" />
        <meta name="robots" content="all" />
      </Helmet>

      <div className={classes.head}>
        <div className={classes.eyebrow}>התפריט שלנו</div>
        <h1 className={classes.title} aria-label={titlePage}>
          {titlePage}
        </h1>
      </div>

      {showTabs && (
        <nav className={classes.tabs} aria-label="בחירת תפריט">
          {enabledMenus.map((type) => (
            <button
              key={type}
              type="button"
              className={`${classes.tab} ${
                type === menuType ? classes.tabActive : ''
              }`}
              aria-current={type === menuType ? 'page' : undefined}
              onClick={() => history.push(`/menu/${type}`)}
            >
              {MENU_LABEL[type]}
            </button>
          ))}
        </nav>
      )}

      <div className={classes.searchWrap}>
        <svg
          className={classes.searchIcon}
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke={colors.textFaint}
          strokeWidth="2"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.5" y2="16.5" />
        </svg>
        <input
          type="search"
          className={classes.searchInput}
          value={query}
          onChange={(ev) => setQuery(ev.target.value)}
          placeholder="חיפוש מנה..."
          aria-label="חיפוש מנה בתפריט"
        />
      </div>

      {categories.length > 0 && (
        <ul className={classes.chips} aria-label="סינון לפי קטגוריה">
          <li>
            <button
              type="button"
              className={`${classes.chip} ${
                activeCat === null ? classes.chipActive : ''
              }`}
              aria-pressed={activeCat === null}
              onClick={() => setActiveCat(null)}
            >
              הכל
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                type="button"
                className={`${classes.chip} ${
                  activeCat === Number(cat.id) ? classes.chipActive : ''
                }`}
                aria-pressed={activeCat === Number(cat.id)}
                onClick={() => setActiveCat(Number(cat.id))}
              >
                {cat.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className={classes.srOnly} role="status" aria-live="polite">
        {loading ? 'טוען את התפריט' : `נמצאו ${visible.length} מנות`}
      </div>

      {loading && (
        <div className={classes.state}>
          <CircularProgress aria-label="טוען את התפריט" />
        </div>
      )}

      {!loading && error && (
        <div className={classes.state}>
          <div className={classes.stateIcon}>😕</div>
          <div className={classes.stateTitle}>לא הצלחנו לטעון את התפריט</div>
          <div className={classes.stateText}>
            נסו לרענן את העמוד, או התקשרו אלינו: 04-6734949
          </div>
        </div>
      )}

      {!loading && !error && cards.length > 0 && (
        <div className="gb-grid4">
          {cards.map((vm) => (
            <ProductCard key={vm.id} vm={vm} showCat />
          ))}
        </div>
      )}

      {!loading && !error && cards.length === 0 && (
        <div className={classes.state}>
          <div className={classes.stateIcon} aria-hidden="true">
            🔍
          </div>
          <div className={classes.stateTitle}>לא מצאנו מנות שמתאימות</div>
          <div className={classes.stateText}>נסו חיפוש אחר או בחרו קטגוריה</div>
        </div>
      )}

      <QuickAddModal
        product={quickAddProduct}
        open={!!quickAddProduct}
        onClose={() => setQuickAddProduct(null)}
        onAdded={() => setQuickAddProduct(null)}
      />

      {menuType === 'pesach' ? (
        <BasicModal
          contnentLineOne={'הזמנות לחג הפסח מתבצעות בכפולות של חמש מנות.'}
          contnentLineTow={'שיהיה חג שמח וכשר'}
          type="pesach"
          withCloseBtn={true}
        />
      ) : null}

      {menuEnables['message_home_page'] && (
        <BasicModal
          contnentLineOne={`האתר סגור להזמנות חדשות, עקב עבודת תחזוקה באתר.
              `}
          contnentLineTow={' '}
          lockScreen={true}
          type="pesach"
          withCloseBtn={
            menuEnables['withCloseBtn'] ? menuEnables['withCloseBtn'] : false
          }
        />
      )}

      {isThursdayAndTime() && (
        <BasicModal
          contnentLineOne={`האתר סגור להזמנות חדשות, עד יום שבת בשעה 8:00.`}
          contnentLineTow={`הקייטרינג פתוח בימי שישי מהשעה 7:00 עד 14:00.
              מספר טלפון לפרטים 04-6734949
              `}
          lockScreen={true}
          type="pesach"
          withCloseBtn={
            menuEnables['withCloseBtn'] ? menuEnables['withCloseBtn'] : false
          }
        />
      )}
    </main>
  );
};
