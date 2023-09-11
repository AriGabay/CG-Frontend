import React, { Fragment } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Helmet } from 'react-helmet';

export const Contact = () => {
  return (
    <Fragment>
      <Helmet>
        <title>Catering Gabay - Content</title>
        <meta name="content" content="content" />
      </Helmet>
      <Grid
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Typography aria-label="צור קשר" fontSize={'4rem'} variant="h1">
          צור קשר
        </Typography>
        <Typography variant="h7">כתובת: המברג 10,טבריה.</Typography>
        <Typography variant="h7">
          טלפון :
          <Typography component="a" href="tel:04-6734949">
            {/* eslint-disable-next-line*/}
            {' ' + '04-6734949'}
          </Typography>
        </Typography>
        <Typography variant="h7">
          מייל :
          <Typography component="a" href="mailto:gabay.catering@gmail.com">
            {/* eslint-disable-next-line*/}
            {' ' + 'gabay.catering@gmail.com'}
          </Typography>
        </Typography>
        <Typography variant="h7">להזמנות מראש ניתן לבצע בפלאפון</Typography>
        <Typography variant="h7"> בין 10:00-18:00.</Typography>
      </Grid>
    </Fragment>
  );
};
