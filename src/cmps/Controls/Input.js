import React from 'react';
import { TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  size: {
    width: '50%!important',
  },
}));
export default function Input(props) {
  const {
    name,
    label,
    value,
    error = null,
    onChange,
    required = false,
    withStyle = false,
    ...other
  } = props;
  const classes = useStyles();

  return (
    <TextField
      aria-label={label}
      id={`id-label-${label}`}
      className={withStyle ? classes.size : ''}
      variant="outlined"
      label={label}
      name={name}
      value={value}
      onChange={(event) => onChange(event)}
      required={required}
      {...(error && { error: true, helperText: error })}
      {...other}
      margin="dense"
      InputLabelProps={{ shrink: true }}
    />
  );
}
