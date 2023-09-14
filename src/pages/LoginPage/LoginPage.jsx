import React, { useState } from 'react';
import { TextField, Typography, Grid, Button } from '@mui/material';
import { authService } from '../../services/authService';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { Helmet } from 'react-helmet';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column !important',
    minHeight: '80%',
  },
  marginBottom: {
    marginBottom: '10px !important',
  },
  grid: {
    height: '100%',
  },
}));

export const LoginPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const [userDetails, setUserDetails] = useState({
    userName: null,
    password: null,
  });

  const handelChange = ({ target }) => {
    const { value, name } = target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const login = async (e) => {
    e.preventDefault();
    const userLogin = await authService.login(userDetails);
    if (userLogin.token) {
      history.push('/adminPage');
    }
  };

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Grid className={classes.grid}>
        <form className={classes.root}>
          <Typography className={classes.marginBottom}>התחברות</Typography>
          <TextField
            className={classes.marginBottom}
            label="שם משתמש"
            name="userName"
            onChange={(event) => handelChange(event)}
          ></TextField>
          <TextField
            className={classes.marginBottom}
            label="סיסמה"
            type="password"
            name="password"
            onChange={(event) => handelChange(event)}
          ></TextField>
          <Button
            type="submit"
            onSubmit={(event) => login(event)}
            onClick={(event) => login(event)}
          >
            התחבר
          </Button>
        </form>
      </Grid>
    </>
  );
};
