import React, { Fragment } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import GoogleMaps from '../../cmps/GoogleMaps/GoogleMaps';
import { Helmet } from 'react-helmet';
const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column !important',
    padding: '10px',
  },
  gridMap: {
    marginTop: '10px',
    width: '100%',
    height: '100%',
  },
}));

export const About = () => {
  const classes = useStyles();
  return (
    <Fragment>
      <Helmet>
        <title>Catering Gabay - About</title>
        <meta name="about" content="about" />
      </Helmet>
      <Grid classes={{ root: classes.root }}>
        <Grid classes={{ root: classes.root }}>
          <Typography aria-label="אודות" fontSize={'4rem'} variant="h1">
            אודות
          </Typography>
          <Typography variant="p" fontSize={'1.2rem'}>
            קייטרינג גבאי פועל כבר יותר מעשור. אוכל בתוצרת ביתית משובח ועשיר
            בטעמים.
          </Typography>
        </Grid>
        <Grid className={`${classes.gridMap} ${classes.root}`}>
          <GoogleMaps />
        </Grid>
        <Typography variant="p">כתובתנו :</Typography>
        <Typography variant="p">רחוב המברג 10, טבריה</Typography>
      </Grid>
    </Fragment>
  );
};
