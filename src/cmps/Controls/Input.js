import React from 'react';
import { TextField } from '@material-ui/core';

export default function Input(props) {
  const { name, label, value, error = null, onChange, required = false, ...other } = props;
  return (
    <TextField
      variant="outlined"
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      {...(error && { error: true, helperText: error })}
      {...other}
      margin="dense"
    />
  );
}
