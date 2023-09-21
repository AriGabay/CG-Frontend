import React, { Fragment } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import { Helmet } from 'react-helmet';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  root: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column !important',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: '4rem',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '1.5rem',
    marginBottom: '20px',
  },
  link: {
    textDecoration: 'none',
  },
  button: {
    marginTop: '20px',
  },
}));

export const NotEnable = () => {
  const classes = useStyles();
  return (
    <Fragment>
      <Helmet>
        <title>Catering Gabay - Menu Not Available</title>
        <meta name="menuNotAvailable" content="menuNotAvailable" />
        <meta name="robots" content="noindex" />
      </Helmet>
      <Grid className={classes.root}>
        <Typography className={classes.title} variant="h1">
          תפריט לא פעיל
        </Typography>
        <Typography className={classes.subtitle} variant="h2">
          אנו מצטערים, התפריט שאתה מחפש אינו פעיל כרגע.
        </Typography>
        <Link className={classes.link} to="/">
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            aria-label="חזור לדף הבית"
          >
            חזור לדף הבית
          </Button>
        </Link>
      </Grid>
    </Fragment>
  );
};
