import React from 'react';
import { Button as MuiButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { NavLink } from 'react-router-dom';
import getCustomTheme from '../../hooks/getCustomTheme';
const customTheme = getCustomTheme();
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: customTheme.palette.primary.light + '!important',
  },
  label: {
    color: customTheme.palette.primary.contrastText,
    textTransform: 'none',
  },
  NavLink: {
    textDecoration: 'none',
    marginBottom: customTheme.spacing(1) + '!important',
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
