import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup as MuiRadioGroup,
  FormControlLabel,
  Radio,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

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
      <FormLabel style={{ fontWeight: 700 }} component={'h2'}>
        {label}
      </FormLabel>
      <MuiRadioGroup
        row
        name={name}
        value={value}
        required={required}
        onChange={onChange}
        onKeyDown={(e) => e.key === 'Enter' ?? onChange(e)}
      >
        {items.map((item) => (
          <FormControlLabel
            required={required}
            key={item.id}
            value={item.id}
            control={<Radio aria-label={item.title} />}
            label={item.title}
            aria-label={item.title}
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
