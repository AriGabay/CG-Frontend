import React from 'react';
import { TextField } from '@material-ui/core';

export default function Input(props) {
  const {
    name,
    label,
    value,
    error = null,
    onChange,
    required = false,
    ...other
  } = props;
  return (
    <>
      <label style={{ display: 'none' }} htmlFor={`id-label-${label}`}>
        {label}
      </label>
      <TextField
        id={`id-label-${label}`}
        style={{ width: '80%!important' }}
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
    </>
  );
}
