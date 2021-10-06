import './Contact.scss';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
// import { makeStyles } from '@material-ui/styles';

export const Contact = () => {
  return (
    <Grid display="flex" justifyContent="center" alignItems="center" flexDirection="column">
      {/* <Grid display="flex" justifyContent="center" alignItems="center" flexDirection="column"> */}
      <Typography variant="h2">צור קשר</Typography>
      <Typography>כתובת: המברג 10,טבריה</Typography>
      <Typography>טלפון : 04-6734949</Typography>
      <Typography>להזמנות מראש דרך הטלפון</Typography>
      <Typography> נא להתקשר בין 10:00-18:00</Typography>
      {/* </Grid> */}
    </Grid>
  );
};
