import React from 'react';
import { makeStyles } from '@mui/styles';
import Dialog from '@mui/material/Dialog';
import { Helmet } from 'react-helmet';

import { ImageCloud } from '../ImageCloud/ImageCloud';
import { PdfMenuPages } from './PdfMenuPages';
import { colors, fonts, radii, shadows } from '../../styles/designTokens';

const PHONE = '04-6734949';
const PHONE_HREF = 'tel:046734949';

// Shown only until the admin sets their own text. Says nothing about HOW the
// menu is sold: hard-coded claims here have been wrong twice (pickup hours,
// then "orders by phone" when the menu is in fact sold in person), and only
// the admin knows the arrangement for a given holiday.
const DEFAULT_NOTICE = 'לפרטים נוספים חייגו אלינו.';

const useStyles = makeStyles({
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: colors.bg,
  },
  paper: {
    borderRadius: `${radii.xl}!important`,
    background: `${colors.surface}!important`,
    boxShadow: `${shadows.card}!important`,
    overflow: 'hidden',
    margin: '16px!important',
    width: 'calc(100% - 32px)!important',
    maxWidth: '820px!important',
  },
  band: {
    background: `linear-gradient(120deg, ${colors.green}, ${colors.greenDark})`,
    padding: '22px 28px 20px',
    textAlign: 'center',
  },
  logo: {
    display: 'inline-block',
    borderRadius: radii.sm,
    overflow: 'hidden',
    marginBottom: 12,
    background: '#fff',
    padding: 4,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 26,
    color: '#fff',
    margin: 0,
    lineHeight: 1.25,
    '@media (max-width: 600px)': { fontSize: 22 },
  },
  sub: {
    color: colors.greenPale,
    fontFamily: fonts.body,
    fontSize: 15.5,
    marginTop: 8,
    lineHeight: 1.6,
  },
  phoneWrap: {
    padding: '18px 24px 4px',
    textAlign: 'center',
  },
  phoneBtn: {
    display: 'inline-block',
    textDecoration: 'none',
    background: colors.green,
    color: '#fff',
    borderRadius: radii.pill,
    padding: '14px 34px',
    minHeight: 48,
    fontFamily: fonts.body,
    fontSize: 19,
    fontWeight: 800,
    letterSpacing: '.3px',
    '&:hover': { background: colors.greenDeep, color: '#fff' },
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 3,
    },
  },
  hours: {
    fontFamily: fonts.body,
    fontSize: 15.5,
    color: colors.textSoft,
    marginTop: 14,
    lineHeight: 1.75,
    // The admin writes this as several lines; without this they collapse into
    // one run-on paragraph.
    whiteSpace: 'pre-line',
    textAlign: 'center',
  },
  frameWrap: {
    padding: '16px 20px 22px',
  },
  frame: {
    width: '100%',
    height: '58vh',
    minHeight: 340,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.sm,
    display: 'block',
  },
  // An iframed PDF is a blank box on iOS Safari and some Android browsers. With
  // no way to close this dialog, that would leave the customer with nothing to
  // read at all — so the link is always rendered, not a fallback.
  openLink: {
    display: 'block',
    marginTop: 12,
    textAlign: 'center',
    fontFamily: fonts.body,
    fontSize: 16,
    fontWeight: 700,
    color: colors.greenLink,
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 2,
    },
  },
});

/**
 * Takes the site over while a PDF-only menu is open.
 *
 * There is no close control, no backdrop dismissal and no Escape handler: the
 * menu it announces cannot be ordered online at all, so letting someone past it
 * would only lead them to a shop they cannot use. The way out is the admin
 * switching that menu off.
 */
export const PdfMenuLock = ({ menu, notice }) => {
  const classes = useStyles();
  if (!menu) return null;

  // An empty string is a deliberate "show nothing", so only a missing value
  // falls back to the default.
  const noticeText =
    notice === undefined || notice === null ? DEFAULT_NOTICE : notice;

  return (
    <>
      <Helmet>
        <title>{`קייטרינג גבאי - תפריט ${menu.label}`}</title>
        <meta name="robots" content="all" />
      </Helmet>
      <div className={classes.backdrop} />
      <Dialog
        open
        // No onClose: clicking the backdrop and pressing Escape both go through
        // it, so omitting it is what makes the dialog genuinely non-dismissible.
        disableEscapeKeyDown
        maxWidth={false}
        scroll="body"
        classes={{ paper: classes.paper }}
        aria-labelledby="pdf-lock-title"
      >
        <div className={classes.band}>
          <span className={classes.logo}>
            <ImageCloud
              imageId="old_logo_rssqwk"
              maxWidth={92}
              maxHeight={46}
              alt="קייטרינג גבאי"
            />
          </span>
          <h1 className={classes.title} id="pdf-lock-title">
            {`תפריט ${menu.label}`}
          </h1>
          <div className={classes.sub}>התפריט מוצג כאן לצפייה.</div>
        </div>

        <div className={classes.phoneWrap}>
          <a className={classes.phoneBtn} href={PHONE_HREF}>
            {`לפרטים: ${PHONE}`}
          </a>
          {noticeText ? (
            <div className={classes.hours}>{noticeText}</div>
          ) : null}
        </div>

        <div className={classes.frameWrap}>
          <PdfMenuPages menu={menu} />
        </div>
      </Dialog>
    </>
  );
};
