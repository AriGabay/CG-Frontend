import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import Dialog from '@mui/material/Dialog';

import { colors, fonts, radii, shadows } from '../../styles/designTokens';

// What each holiday menu offers, and how it is reached. `tishray` is a PDF the
// customer reads; `pesach` is orderable. The copy has to say which, or the
// modal promises something the page does not deliver.
const HOLIDAYS = {
  tishray: {
    emoji: '🍎',
    title: 'תפריט חגי תשרי פורסם',
    // Deliberately says nothing about how it is sold. This used to claim
    // orders were taken by phone; the menu is in fact bought in person, and
    // the arrangement changes per holiday. The details are on the menu page,
    // where the admin's own text is shown.
    body: 'התפריט המלא לראש השנה מוכן לצפייה, יחד עם פרטי הרכישה.',
    cta: 'לצפייה בתפריט',
    to: '/menu/tishray',
  },
  pesach: {
    emoji: '✨',
    title: 'תפריט פסח פתוח להזמנות',
    body: 'אפשר לעבור על התפריט ולהזמין אונליין.',
    cta: 'להזמנת מנות',
    to: '/menu/pesach',
  },
};

// Once per browser session PER MENU. Storing a bare "seen" flag meant that
// anyone already browsing when the admin published a menu never saw it
// announced at all, and that switching from one holiday menu to another went
// unannounced to everyone mid-session. Recording which menu was announced
// keeps the no-nagging behaviour while letting a genuinely new announcement
// through.
const SEEN_KEY = 'cg_holiday_notice_seen';

const useStyles = makeStyles({
  paper: {
    borderRadius: `${radii.xl}!important`,
    background: `${colors.surface}!important`,
    boxShadow: `${shadows.card}!important`,
    overflow: 'hidden',
    maxWidth: '440px!important',
  },
  band: {
    background: `linear-gradient(120deg, ${colors.green}, ${colors.greenDark})`,
    padding: '26px 28px 22px',
    textAlign: 'center',
  },
  emoji: {
    fontSize: 40,
    lineHeight: 1,
    display: 'block',
    marginBottom: 10,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 25,
    color: '#fff',
    margin: 0,
    lineHeight: 1.25,
  },
  body: {
    padding: '22px 28px 6px',
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textSoft,
    lineHeight: 1.65,
    textAlign: 'center',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: '18px 28px 26px',
  },
  cta: {
    display: 'block',
    textAlign: 'center',
    textDecoration: 'none',
    background: colors.green,
    color: '#fff',
    borderRadius: radii.pill,
    padding: '13px 24px',
    minHeight: 46,
    fontFamily: fonts.body,
    fontSize: 16.5,
    fontWeight: 700,
    '&:hover': { background: colors.greenDeep, color: '#fff' },
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 2,
    },
  },
  dismiss: {
    border: 'none',
    background: 'transparent',
    color: colors.textFaint,
    fontFamily: fonts.body,
    fontSize: 15,
    fontWeight: 600,
    minHeight: 44,
    cursor: 'pointer',
    borderRadius: radii.pill,
    '&:hover': { color: colors.text },
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 2,
    },
  },
});

/**
 * Announces an open holiday menu when someone lands on the site.
 *
 * `menuEnables` comes from the caller so this does not fire a second request
 * for something the home page has already loaded — and so the modal cannot
 * appear before the page knows which menus are actually open.
 */
export const HolidayWelcomeModal = ({ menuEnables, ready }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const active = Object.keys(HOLIDAYS).filter((key) => !!menuEnables?.[key]);
  // Both open at once is not a real scenario today, but if it ever is, the
  // orderable menu is the more useful thing to point at.
  const holiday = HOLIDAYS[active.includes('pesach') ? 'pesach' : active[0]];

  const holidayKey = active.includes('pesach') ? 'pesach' : active[0];

  useEffect(() => {
    if (!ready || !holidayKey) return;
    let seen = null;
    try {
      seen = sessionStorage.getItem(SEEN_KEY);
    } catch (err) {
      // Private mode and blocked storage throw on access. Showing the notice
      // is better than crashing the home page over it.
      seen = null;
    }
    if (seen !== holidayKey) setOpen(true);
  }, [ready, holidayKey]);

  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(SEEN_KEY, holidayKey);
    } catch (err) {
      /* nothing to do — the notice simply shows again next navigation */
    }
  };

  if (!holiday) return null;

  return (
    <Dialog
      open={open}
      onClose={close}
      classes={{ paper: classes.paper }}
      aria-labelledby="holiday-notice-title"
    >
      <div className={classes.band}>
        <span className={classes.emoji} aria-hidden="true">
          {holiday.emoji}
        </span>
        <h2 className={classes.title} id="holiday-notice-title">
          {holiday.title}
        </h2>
      </div>
      <div className={classes.body}>{holiday.body}</div>
      <div className={classes.actions}>
        <Link to={holiday.to} className={classes.cta} onClick={close}>
          {holiday.cta}
        </Link>
        <button type="button" className={classes.dismiss} onClick={close}>
          אולי אחר כך
        </button>
      </div>
    </Dialog>
  );
};
