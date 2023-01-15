import React from 'react';
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  size: {
    width: '200px!important',
  },
}));

export default function Select(props) {
  const classes = useStyles();
  const {
    name,
    label,
    value,
    error = null,
    onChange,
    options,
    ...other
  } = props;

  return (
    <FormControl
      {...other}
      classes={{ root: classes.size }}
      fullWidth
      variant="outlined"
      {...(error && { error: true })}
    >
      <InputLabel>{label}</InputLabel>
      <MuiSelect label={label} name={name} value={value} onChange={onChange}>
        <MenuItem value="">None</MenuItem>
        {options.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.displayName ? item.displayName : item.productName}
          </MenuItem>
        ))}
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
}
