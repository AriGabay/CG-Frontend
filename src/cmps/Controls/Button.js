import React from 'react';
import { Button as MuiButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import getCustomTheme from '../../hooks/getCustomTheme';
const customTheme = getCustomTheme();

const useStyles = makeStyles((theme) => ({
  root: {
    margin: customTheme.spacing(0.5),
    backgroundColor: customTheme.palette.primary.light + '!important',
  },
  label: {
    textTransform: 'none',
    color: customTheme.palette.primary.contrastText,
  },
}));

export default function Button(props) {
  const { text, size, color, variant, onClick, ...other } = props;
  const classes = useStyles();

  return (
    <MuiButton
      variant={variant || 'contained'}
      size={size || 'large'}
      color={color || 'primary'}
      onClick={onClick}
      {...other}
      classes={{ root: classes.root, label: classes.label }}
    >
      {text}
    </MuiButton>
  );
}
