import React from 'react';
import { Button as MuiButton, makeStyles } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import getCostumeTheme from '../../hooks/getCostumeTheme';
const costumeTheme = getCostumeTheme();
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: costumeTheme.palette.primary.light + '!important',
  },
  label: {
    color: costumeTheme.palette.primary.contrastText,
    textTransform: 'none',
  },
  NavLink: {
    textDecoration: 'none',
    marginBottom: theme.spacing(1) + '!important',
  },
  marginBottom: {},
}));

export default function Button(props) {
  const { text, size, color, variant, to } = props;
  const classes = useStyles();

  return (
    <NavLink className={classes.NavLink} to={to}>
      <MuiButton
        variant={variant || 'contained'}
        size={size || 'large'}
        color={color || 'primary'}
        classes={{ root: classes.root, label: classes.label }}
      >
        {text}
      </MuiButton>
    </NavLink>
  );
}
