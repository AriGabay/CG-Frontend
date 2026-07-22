import React, { useCallback, useEffect, useRef, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';
import { BUSINESS } from '../../AppHeader/AppHeader';
import { isMenuEnableService } from '../../../services/isMenuEnableService';
import { MENU_LABEL } from '../../../services/viewModel.service';
import { colors, fonts, layout } from '../../../styles/designTokens';

const MENU_TYPES = ['weekend', 'tishray', 'pesach'];

const INFO_LINKS = [
  { to: '/about', label: 'עלינו' },
  { to: '/contact', label: 'צור קשר' },
  { to: '/AccessibilityAnnouncement', label: 'הצהרת נגישות' },
];

const useStyles = makeStyles({
  footer: {
    background: colors.text,
    color: '#E4D6C4',
    marginTop: 20,
  },
  grid: {
    maxWidth: layout.maxWidth,
    margin: '0 auto',
    padding: '44px 22px 30px',
  },
  brandName: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: '#fff',
    marginBottom: 10,
  },
  blurb: {
    fontSize: 15,
    lineHeight: 1.6,
    color: '#BEAD98',
    maxWidth: 280,
    margin: '0 0 14px',
  },
  kosher: {
    fontSize: 14,
    color: '#BEAD98',
  },
  colTitle: {
    fontWeight: 800,
    color: '#fff',
    marginBottom: 12,
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    fontSize: 15,
  },
  link: {
    color: '#BEAD98',
    textDecoration: 'none',
    // 15px text alone renders a ~24px-tall link: it clears the WCAG 2.2 24px
    // floor but not the 44px touch norm. Below 640px the footer stacks to a
    // single column and these become the primary touch targets, so lift them
    // there only — desktop keeps the designed rhythm untouched. inline-flex
    // (not flex) keeps the box hugging the text so the focus ring is unchanged.
    '@media (max-width: 640px)': {
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: 44,
    },
    '&:hover': {
      color: '#fff',
      textDecoration: 'underline',
    },
    '&:focus-visible': {
      outline: '3px solid #DCE7D5',
      outlineOffset: 3,
      color: '#fff',
    },
  },
  detail: {
    color: '#BEAD98',
  },
  bottom: {
    borderTop: '1px solid rgba(255,255,255,.1)',
    padding: '16px 22px',
    textAlign: 'center',
    fontSize: 13,
    // #9A8974 on the #43312A footer was 3.63:1 — a fail for 13px body text,
    // which needs 4.5:1. #BEAD98 is 5.62:1 and is already the colour used by
    // the footer's blurb, links and details, so the palette stays at one tone.
    color: '#BEAD98',
  },
});

export const Footer = () => {
  const classes = useStyles();
  const isMountedRef = useRef(true);
  // Fall back to the weekend menu so the column is never empty if the
  // isMenuEnable request fails.
  const [enabledMenus, setEnabledMenus] = useState(['weekend']);

  const loadEnabledMenus = useCallback(async () => {
    try {
      const menus = await isMenuEnableService.getAllMenuEnables();
      if (!isMountedRef.current || !Array.isArray(menus) || !menus.length) return;
      const enabled = MENU_TYPES.filter((type) =>
        menus.some((menu) => menu.menuType === type && menu.enable)
      );
      if (enabled.length) setEnabledMenus(enabled);
    } catch (error) {
      console.error('Footer: could not load enabled menus', error);
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    loadEnabledMenus();
    return () => {
      isMountedRef.current = false;
    };
  }, [loadEnabledMenus]);

  return (
    <footer className={classes.footer}>
      <div className={`gb-footer gb-pad ${classes.grid}`}>
        <div>
          <div className={classes.brandName}>קייטרינג גבאי</div>
          <p className={classes.blurb}>
            קייטרינג גבאי פועל כבר יותר מעשור. אוכל בתוצרת ביתית משובח ועשיר
            בטעמים.
          </p>
          {/* Wording taken verbatim from the logo alt text in HomePage.jsx. */}
          <div className={classes.kosher}>
            כשר למהדרין בהשגחת הרבנות טבריה
          </div>
        </div>

        <div>
          <h2 className={classes.colTitle}>תפריט</h2>
          <ul className={classes.list}>
            {enabledMenus.map((type) => (
              <li key={type}>
                <Link className={classes.link} to={`/menu/${type}`}>
                  {MENU_LABEL[type]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={classes.colTitle}>מידע</h2>
          <ul className={classes.list}>
            {INFO_LINKS.map((link) => (
              <li key={link.to}>
                <Link className={classes.link} to={link.to}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className={classes.colTitle}>צרו קשר</h2>
          <ul className={classes.list}>
            <li>
              <a
                className={classes.link}
                href={BUSINESS.phoneHref}
                aria-label={`חיוג לקייטרינג גבאי בטלפון ${BUSINESS.phoneDisplay}`}
              >
                {BUSINESS.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                className={classes.link}
                href={`mailto:${BUSINESS.email}`}
                aria-label={`שליחת מייל לכתובת ${BUSINESS.email}`}
              >
                {BUSINESS.email}
              </a>
            </li>
            <li className={classes.detail}>איסוף: {BUSINESS.address}</li>
            <li className={classes.detail}>איסוף בימי שישי: 7:00-14:00</li>
            <li className={classes.detail}>מענה טלפוני להזמנות: 10:00-18:00</li>
          </ul>
        </div>
      </div>

      <div className={classes.bottom}>
        © {new Date().getFullYear()} קייטרינג גבאי · כל הזכויות שמורות
      </div>
    </footer>
  );
};

export default Footer;
