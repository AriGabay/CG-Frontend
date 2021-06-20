import React from 'react';
import { Button as MuiButton, makeStyles } from '@material-ui/core';
import getCostumeTheme from '../../hooks/getCostumeTheme';
const costumeTheme = getCostumeTheme();

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(0.5),
    backgroundColor: costumeTheme.palette.primary.light + '!important',
  },
  label: {
    textTransform: 'none',
    color: costumeTheme.palette.primary.contrastText,
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
