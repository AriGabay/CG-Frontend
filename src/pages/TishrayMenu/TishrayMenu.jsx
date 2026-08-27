import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CircularProgress from '@mui/material/CircularProgress';

import { isMenuEnableService } from '../../services/isMenuEnableService';
import {
  SETTING_KEYS,
  siteSettingService,
} from '../../services/siteSettingService';
import { PdfMenuPages } from '../../cmps/PdfMenuLock/PdfMenuPages';
import { colors, fonts, radii } from '../../styles/designTokens';
import { PDF_MENUS } from '../../services/pdfMenus';

const MENU = PDF_MENUS.tishray;

// Says nothing about how the menu is sold — the admin owns that sentence.
const DEFAULT_NOTICE = 'לפרטים נוספים חייגו אלינו.';

const PHONE = '04-6734949';
const PHONE_HREF = 'tel:046734949';

const useStyles = makeStyles({
  page: {
    background: colors.bg,
    minHeight: '72vh',
  },
  title: {
    fontFamily: fonts.display + '!important',
    fontSize: '26px!important',
    color: colors.text,
    paddingBottom: '4px!important',
  },
  note: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textSoft,
    lineHeight: 1.7,
    padding: '0 24px 8px',
  },
  notice: {
    // The admin writes several lines; keep them.
    whiteSpace: 'pre-line',
    marginBottom: 10,
  },
  phone: {
    color: colors.greenLink,
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  frame: {
    width: '100%',
    height: '70vh',
    minHeight: 420,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.sm,
  },
  // An <iframe> of a PDF does not render on iOS Safari and on several Android
  // browsers — they show a blank box. The link is always visible, so the menu
  // is reachable even where the embed silently fails.
  fallback: {
    display: 'block',
    marginTop: 10,
    fontFamily: fonts.body,
    fontSize: 15,
    fontWeight: 700,
    color: colors.greenLink,
  },
  btn: {
    border: `1px solid ${colors.borderInput}`,
    background: colors.surface,
    color: colors.text,
    borderRadius: radii.pill,
    padding: '10px 22px',
    minHeight: 44,
    fontFamily: fonts.body,
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    '&:hover': { borderColor: colors.text },
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 2,
    },
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: '80px 0',
  },
});

/**
 * The חגי תשרי menu is shown as a PDF rather than as an orderable grid: the
 * dishes are quoted by phone, so there is nothing to add to a cart here.
 *
 * Closing the dialog goes home rather than revealing an empty page — this route
 * has no content of its own, the dialog IS the page. That also means the
 * orderable tishray grid is not reachable through the UI at all, which is the
 * point.
 *
 * Products keep their tishray flag and stay orderable wherever else they
 * appear (a dish that is also on the weekend menu is unaffected).
 */
export const TishrayMenu = () => {
  const classes = useStyles();
  const history = useHistory();
  const [checking, setChecking] = useState(true);
  // Same text the lock screen shows. This page had its own hard-coded line
  // claiming orders were taken by phone, which was wrong and, worse, meant
  // the admin's text never appeared unless the site lock happened to be on.
  const [notice, setNotice] = useState(undefined);

  // Same gate the orderable menus use: a menu the admin has switched off is not
  // reachable, and asking for it goes to /notEnable.
  useEffect(() => {
    let alive = true;
    Promise.all([
      isMenuEnableService.getAllMenuEnables(),
      siteSettingService.getSettings(),
    ])
      .then(([menus, settings]) => {
        if (!alive) return;
        const enabled = (menus || []).some(
          (menu) => menu.menuType === 'tishray' && menu.enable
        );
        if (!enabled) {
          history.replace('/notEnable');
          return;
        }
        setNotice(settings?.[SETTING_KEYS.pdfMenuNotice]);
        setChecking(false);
      })
      .catch((err) => {
        // Fail open, exactly as pages/Menu/Menu.jsx does: a flaky settings call
        // should not hide a menu that is actually open.
        console.error('Error fetching menu enables:', err);
        if (alive) setChecking(false);
      });
    return () => {
      alive = false;
    };
  }, [history]);

  // An empty string is a deliberate "show nothing".
  const noticeText =
    notice === undefined || notice === null ? DEFAULT_NOTICE : notice;

  const close = () => history.push('/');

  return (
    <main className={classes.page}>
      <Helmet>
        <title>קייטרינג גבאי - תפריט חגי תשרי</title>
        <meta name="robots" content="all" />
      </Helmet>

      {checking ? (
        <div className={classes.loading}>
          <CircularProgress aria-label="טוען את התפריט" />
        </div>
      ) : (
        <Dialog
          open
          onClose={close}
          maxWidth="lg"
          fullWidth
          aria-labelledby="tishray-menu-title"
        >
          <DialogTitle id="tishray-menu-title" className={classes.title}>
            תפריט חגי תשרי
          </DialogTitle>
          <div className={classes.note}>
            {noticeText ? <div className={classes.notice}>{noticeText}</div> : null}
            <div>
              לפרטים:{' '}
              <a className={classes.phone} href={PHONE_HREF}>
                {PHONE}
              </a>
            </div>
          </div>
          <DialogContent>
            <PdfMenuPages menu={MENU} />
          </DialogContent>
          <DialogActions>
            <button type="button" className={classes.btn} onClick={close}>
              סגור
            </button>
          </DialogActions>
        </Dialog>
      )}
    </main>
  );
};
