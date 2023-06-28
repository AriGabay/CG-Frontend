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
    color: customTheme.palette.primary.contrastText + '!important',
    textTransform: 'none',
  },
  NavLink: {
    textDecoration: 'none',
    marginBottom: theme.spacing(1),
  },
  menuButton: {
    width: '100px',
    '@media (max-width: 510px)': {
      fontSize: '12px !important',
    },
    '@media (max-width: 350px)': {
      fontSize: '10px !important',
      height: '50px',
    },
  },
  center: {
    display: 'flex !important',
    justifyContent: 'center !important',
    alignItems: 'center !important',
    margin: '0 auto !important',
  },
  blackFont: {
    color: 'black !important',
  },
}));

export default function Button(props) {
  const { text, size, color, variant, to, classProp, style = {} } = props;
  const classes = useStyles();
  return (
    <NavLink className={classes.NavLink} to={to} style={style}>
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
