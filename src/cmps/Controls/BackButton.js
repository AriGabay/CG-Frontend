import React from 'react';
import { Button as MuiButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { NavLink } from 'react-router-dom';
import getCustomTheme from '../../hooks/getCustomTheme';
const customTheme = getCustomTheme();
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: customTheme.palette.primary.light + '!important',
    '&:hover': {
      transform: 'scale(1.1) !important',
    },
  },
  label: {
    textTransform: 'none',
    '&:hover': {
      transform: 'scale(1.1) !important',
    },
  },
  NavLink: {
    textDecoration: 'none',
    marginBottom: theme.spacing(1),
    '&:hover': {
      transform: 'scale(1.1) !important',
    },
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

    color: 'black' + '!important',
    fontWeight: 600 + '!important',
    backgroundColor: '#93764ce3' + '!important',
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
  const {
    text,
    size,
    color,
    variant,
    to,
    classProp,
    style = {},
    ...other
  } = props;
  const classes = useStyles();
  return (
    <NavLink className={classes.NavLink} to={to} style={style}>
      <MuiButton
        className={classes[classProp]}
        variant={variant || 'contained'}
        size={size || 'large'}
        color={color || 'primary'}
        classes={{ label: classes.label }}
        aria-label={text}
        {...other}
      >
        {text}
      </MuiButton>
    </NavLink>
  );
}
