import React, { Fragment } from 'react';
import { makeStyles } from '@mui/styles';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { colors, fonts, radii, shadows } from '../../styles/designTokens';

const useStyles = makeStyles({
  '@keyframes gbNotFoundFade': {
    from: { opacity: 0, transform: 'translateY(14px)' },
    to: { opacity: 1, transform: 'none' },
  },
  page: {
    background: colors.bg,
    minHeight: '72vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 22px 60px',
  },
  card: {
    width: '100%',
    maxWidth: 560,
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.xl,
    boxShadow: shadows.card,
    padding: '48px 40px 44px',
    textAlign: 'center',
    animation: '$gbNotFoundFade .5s cubic-bezier(.2,.7,.2,1) both',
    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
    '@media (max-width:640px)': { padding: '36px 22px 32px' },
  },
  emoji: {
    fontSize: 56,
    lineHeight: 1,
    marginBottom: 16,
  },
  title: {
    fontFamily: fonts.display,
    fontWeight: 400,
    fontSize: 'clamp(56px,13vw,84px)',
    lineHeight: 1,
    color: colors.green,
    margin: '0 0 12px',
  },
  subtitle: {
    fontFamily: fonts.display,
    fontWeight: 400,
    fontSize: 'clamp(20px,4.5vw,27px)',
    lineHeight: 1.3,
    color: colors.text,
    margin: '0 0 30px',
  },
  cta: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: colors.green,
    color: '#fff',
    borderRadius: radii.pill,
    padding: '15px 36px',
    minHeight: 44,
    fontFamily: fonts.body,
    fontWeight: 800,
    fontSize: 18,
    textDecoration: 'none',
    boxShadow: shadows.btnGreen,
    transition: 'background .15s, transform .15s',
    // greenDeep (#5F8262) is only 4.32:1 against white — below the 4.5:1 this
    // 18px/800 label needs (it is under the 18.66px "large text" threshold).
    // greenInk is 5.92:1 and still reads as a darker press of the same green.
    '&:hover': {
      background: colors.greenInk,
      color: '#fff',
      transform: 'translateY(-2px)',
    },
    '&:focus-visible': {
      outline: `3px solid ${colors.greenDark}`,
      outlineOffset: 3,
    },
  },
});

export const NotFound = () => {
  const classes = useStyles();
  return (
    <Fragment>
      <Helmet>
        <title>Catering Gabay - 404 Not Found</title>
        <meta name="notFound" content="notFound" />
        <meta name="robots" content="noindex" />
      </Helmet>
      <main className={classes.page}>
        <section className={classes.card}>
          <div className={classes.emoji} aria-hidden="true">
            🍽️
          </div>
          <h1 className={classes.title}>404</h1>
          <p className={classes.subtitle}>עמוד זה לא נמצא</p>
          <Link className={classes.cta} to="/" aria-label="חזור לדף הבית">
            חזור לדף הבית
          </Link>
        </section>
      </main>
    </Fragment>
  );
};
