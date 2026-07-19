import React, { Fragment } from 'react';
import { makeStyles } from '@mui/styles';
import { Helmet } from 'react-helmet';
import { colors, fonts, radii, shadows } from '../../styles/designTokens';

const useStyles = makeStyles({
  '@keyframes gbContactFade': {
    from: { opacity: 0, transform: 'translateY(14px)' },
    to: { opacity: 1, transform: 'none' },
  },
  page: {
    background: colors.bg,
    padding: '36px 0 60px',
    animation: '$gbContactFade .5s cubic-bezier(.2,.7,.2,1) both',
    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
  },
  container: {
    maxWidth: 760,
    margin: '0 auto',
    padding: '0 22px',
  },
  card: {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.xl,
    boxShadow: shadows.cardSoft,
    padding: '42px 38px 36px',
    '@media (max-width:640px)': { padding: '28px 20px 24px' },
  },
  title: {
    fontFamily: fonts.display,
    fontWeight: 400,
    fontSize: 'clamp(32px,6vw,46px)',
    lineHeight: 1.15,
    color: colors.text,
    margin: '0 0 24px',
    textAlign: 'center',
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '16px 2px',
    fontSize: 18,
    lineHeight: 1.6,
    color: colors.textSoft,
    borderBottom: `1px solid ${colors.border}`,
    '&:last-child': { borderBottom: 'none' },
  },
  icon: {
    flex: 'none',
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: colors.greenPale,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
  },
  link: {
    color: colors.greenLink,
    fontWeight: 700,
    textDecoration: 'none',
    borderRadius: 4,
    '&:hover': { color: colors.greenDark, textDecoration: 'underline' },
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDeep}`,
      outlineOffset: 3,
    },
  },
  note: {
    marginTop: 26,
    background: colors.cream,
    border: `1px solid ${colors.borderInput}`,
    borderRadius: radii.lg,
    padding: '20px 22px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
  },
  noteBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    paddingTop: 6,
  },
  noteText: {
    margin: 0,
    maxWidth: 'none',
    fontSize: 17,
    lineHeight: 1.6,
    color: colors.textSoft,
    fontWeight: 500,
  },
});

export const Contact = () => {
  const classes = useStyles();
  return (
    <Fragment>
      <Helmet>
        <title>Catering Gabay - Contact</title>
        <meta name="contact" content="contact" />
        <meta name="robots" content="all" />
      </Helmet>
      <main className={classes.page}>
        <div className={`${classes.container} gb-pad`}>
          <section className={classes.card}>
            <h1 className={classes.title} aria-label="צור קשר">
              צור קשר
            </h1>

            <ul className={classes.list}>
              <li className={classes.row}>
                <span className={classes.icon} aria-hidden="true">
                  📍
                </span>
                <span>כתובת: המברג 10,טבריה.</span>
              </li>
              <li className={classes.row}>
                <span className={classes.icon} aria-hidden="true">
                  ☎️
                </span>
                <span>
                  טלפון :{' '}
                  <a
                    className={classes.link}
                    href="tel:04-6734949"
                    aria-label="חיוג לטלפון 04-6734949"
                  >
                    04-6734949
                  </a>
                </span>
              </li>
              <li className={classes.row}>
                <span className={classes.icon} aria-hidden="true">
                  ✉️
                </span>
                <span>
                  מייל :{' '}
                  <a
                    className={classes.link}
                    href="mailto:gabay.catering@gmail.com"
                    aria-label="שליחת דואר אלקטרוני לכתובת gabay.catering@gmail.com"
                  >
                    gabay.catering@gmail.com
                  </a>
                </span>
              </li>
            </ul>

            <div className={classes.note}>
              <span className={classes.icon} aria-hidden="true">
                🕒
              </span>
              <div className={classes.noteBody}>
                <p className={classes.noteText}>
                  להזמנות מראש ניתן לבצע בפלאפון
                </p>
                <p className={classes.noteText}>בין 10:00-18:00.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </Fragment>
  );
};
