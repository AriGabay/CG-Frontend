import React, { useState } from 'react';
import './LoginPage.scss';
import { TextField, Typography, Grid, Button } from '@material-ui/core';
import { authService } from '../../services/authService';
import { useHistory } from 'react-router';

export const LoginPage = (props) => {
  const history = useHistory();
  const [userDetails, setUserDetails] = useState({ userName: null, password: null });

  const handelChange = ({ target }) => {
    const { value, name } = target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const login = async () => {
    const res = await authService.login(userDetails);
    if (res.token) {
      history.push(`/adminPage`);
    }
  };

  return (
    <Grid>
      <Typography>Login</Typography>
      <TextField label="User Name" name="userName" onChange={(event) => handelChange(event)}></TextField>
      <TextField label="Password" type="password" name="password" onChange={(event) => handelChange(event)}></TextField>
      <Button type="submit" onClick={() => login()}>
        submit
      </Button>
    </Grid>
  );
};
