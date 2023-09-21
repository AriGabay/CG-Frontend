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
    fontSize: '6rem',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '2rem',
    marginBottom: '20px',
  },
  link: {
    textDecoration: 'none',
  },
  button: {
    marginTop: '20px',
  },
}));

export const NotFound = () => {
  const classes = useStyles();
  return (
    <Fragment>
      <Helmet>
        <title>Catering Gabay - 404 Not Found</title>
        <meta name="notFound" content="notFound" />
        <meta name="robots" content="noindex" />
      </Helmet>
      <Grid className={classes.root}>
        <Typography className={classes.title} variant="h1">
          404
        </Typography>
        <Typography className={classes.subtitle} variant="h2">
          עמוד זה לא נמצא
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
