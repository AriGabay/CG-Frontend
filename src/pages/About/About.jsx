import React, { Fragment } from 'react';
import { makeStyles } from '@mui/styles';
import { Helmet } from 'react-helmet';
import GoogleMaps from '../../cmps/GoogleMaps/GoogleMaps';
import {
  colors,
  fonts,
  layout,
  radii,
  shadows,
} from '../../styles/designTokens';

const useStyles = makeStyles({
  '@keyframes gbAboutFade': {
    from: { opacity: 0, transform: 'translateY(14px)' },
    to: { opacity: 1, transform: 'none' },
  },
  page: {
    background: colors.bg,
    padding: '36px 0 60px',
    animation: '$gbAboutFade .5s cubic-bezier(.2,.7,.2,1) both',
    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
  },
  container: {
    maxWidth: layout.maxWidth,
    margin: '0 auto',
    padding: layout.pad,
    display: 'flex',
    flexDirection: 'column',
    gap: 22,
  },
  card: {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.xl,
    boxShadow: shadows.cardSoft,
    padding: '42px 38px',
    '@media (max-width:640px)': { padding: '28px 20px' },
  },
  intro: {
    textAlign: 'center',
  },
  title: {
    fontFamily: fonts.display,
    fontWeight: 400,
    fontSize: 'clamp(32px,6vw,46px)',
    lineHeight: 1.15,
    color: colors.text,
    margin: '0 0 16px',
  },
  lede: {
    fontSize: 19,
    lineHeight: 1.75,
    color: colors.textSoft,
    maxWidth: '46ch',
    margin: '0 auto',
  },
  mapCard: {
    background: colors.surface,
    border: `1px solid ${colors.border}`,
    borderRadius: radii.xl,
    boxShadow: shadows.cardSoft,
    padding: '18px 18px 30px',
    '@media (max-width:640px)': { padding: '14px 14px 26px' },
  },
  mapFrame: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    border: `1px solid ${colors.border}`,
    background: colors.surfaceAlt,
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '100%',
    // GoogleMaps sets its own inline percentage width (90% / 50%). Force the
    // embed to fill the framed card instead, so it can never resolve against
    // anything but this container and push the page wider than the viewport.
    '& > div': { width: '100% !important', maxWidth: '100% !important' },
    // design.css sets a global `img { max-width: 100% }`. Google's tile images
    // must stay unconstrained or the map renders skewed; scope the reset off
    // inside the embed only.
    '& img': { maxWidth: 'none' },
  },
  addressBlock: {
    marginTop: 24,
    textAlign: 'center',
  },
  addressLabel: {
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: '.6px',
    color: colors.textMuted,
    margin: '0 0 6px',
    maxWidth: 'none',
  },
  address: {
    fontFamily: fonts.display,
    fontSize: 'clamp(20px,3.4vw,26px)',
    lineHeight: 1.3,
    color: colors.greenLink,
    margin: 0,
    maxWidth: 'none',
  },
});

export const About = () => {
  const classes = useStyles();
  return (
    <Fragment>
      <Helmet>
        <title>Catering Gabay - About</title>
        <meta name="about" content="about" />
        <meta name="robots" content="all" />
      </Helmet>
      <main className={classes.page}>
        <div className={`${classes.container} gb-pad`}>
          <section className={`${classes.card} ${classes.intro}`}>
            <h1 className={classes.title} aria-label="אודות">
              אודות
            </h1>
            <p className={classes.lede}>
              קייטרינג גבאי פועל כבר יותר מעשור. אוכל בתוצרת ביתית משובח ועשיר
              בטעמים.
            </p>
          </section>

          <section className={classes.mapCard}>
            <div
              className={classes.mapFrame}
              role="region"
              aria-label="מפת הגעה למעדנייה"
            >
              <GoogleMaps />
            </div>
            <div className={classes.addressBlock}>
              <p className={classes.addressLabel}>כתובתנו :</p>
              <p className={classes.address}>רחוב המברג 10, טבריה</p>
            </div>
          </section>
        </div>
      </main>
    </Fragment>
  );
};
