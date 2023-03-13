import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup as MuiRadioGroup,
  FormControlLabel,
  Radio,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  error: {
    color: 'red',
  },
}));

export default function RadioGroup(props) {
  const {
    name,
    label,
    value,
    onChange,
    items,
    required = false,
    error,
  } = props;
  const classes = useStyles();
  return (
    <FormControl required={required}>
      <FormLabel>{label}</FormLabel>
      <MuiRadioGroup
        row
        name={name}
        value={value}
        required={required}
        onChange={onChange}
      >
        {items.map((item) => (
          <FormControlLabel
            required={required}
            key={item.id}
            value={item.id}
            control={<Radio />}
            label={item.title}
          />
        ))}
        {error && (
          <Typography style={{ marginRight: '32px' }} className={classes.error}>
            {error}
          </Typography>
        )}
      </MuiRadioGroup>
    </FormControl>
  );
}
