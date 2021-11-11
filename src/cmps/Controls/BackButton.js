import React from 'react';
import { Button as MuiButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { NavLink } from 'react-router-dom';
import getCustomTheme from '../../hooks/getCustomTheme';
const customTheme = getCustomTheme();
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: customTheme.palette.primary.light + '!important'
  },
  label: {
    color: customTheme.palette.primary.contrastText + '!important',
    textTransform: 'none'
  },
  NavLink: {
    textDecoration: 'none',
    marginBottom: theme.spacing(1) + '!important'
  },
  menuButton: {
    width: '100px'
  },
  center: {
    display: 'flex !important',
    justifyContent: 'center !important',
    alignItems: 'center !important',
    margin: '0 auto !important'
  }
}));

export default function Button(props) {
  const { text, size, color, variant, to, classProp } = props;
  const classes = useStyles();
  return (
    <NavLink className={classes.NavLink} to={to}>
      <MuiButton
        className={classes[classProp]}
        variant={variant || 'contained'}
        size={size || 'large'}
        color={color || 'primary'}
        classes={{ label: classes.label }}
      >
        {text}
      </MuiButton>
    </NavLink>
  );
}
