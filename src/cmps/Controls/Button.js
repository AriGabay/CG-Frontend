import React from 'react';
import { Button as MuiButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import getCustomTheme from '../../hooks/getCustomTheme';
const customTheme = getCustomTheme();

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(0.5),
    '&:hover': {
      transform: 'scale(1.1)',
    },
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
      aria-label={text}
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
