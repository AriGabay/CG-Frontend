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
import { colors } from '../../styles/designTokens';

const useStyles = makeStyles(() => ({
  // Was `red` (#FF0000): 4.00:1 on #FFFFFF and 3.80:1 on the checkout form's
  // #FBF9F4 panel — both under the 4.5:1 that IS 5568 / WCAG 2.0 AA 1.4.3
  // requires for normal text. #B5361F measures 5.98:1 and 5.68:1.
  error: {
    color: colors.danger,
  },
  // WCAG 2.2 AA 2.5.8 target size. The Radio icon keeps its 24px font-size —
  // only the padding around it grows from 9 to 10, which takes the hit box
  // from 42x42 to 44x44 without changing how the control looks. Neighbours
  // stay clear: FormControlLabel keeps its default 16px / -11px margins, so
  // consecutive targets are still 5px apart, and wrapped rows only touch.
  group: {
    '& .MuiRadio-root': {
      padding: 10,
    },
    '& .MuiFormControlLabel-root': {
      minHeight: 44,
    },
    // 2.4.7 Focus visible — MUI only paints a faint ripple by default.
    '& .MuiRadio-root.Mui-focusVisible': {
      outline: `3px solid ${colors.greenDark}`,
      outlineOffset: -3,
    },
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
  const labelId = `radio-label-${name}`;
  const errorId = `radio-error-${name}`;
  return (
    <FormControl required={required}>
      {/* This used to render as `h2`, which injected a heading into the middle
          of the checkout form and broke the page's heading outline. `span` is
          still a FormLabel and, because FormControl is a column flex
          container, it is blockified exactly as the h2 was — the 0.83em block
          margins the h2 got from the UA stylesheet are restored explicitly so
          nothing moves. The group keeps an accessible name via
          aria-labelledby. */}
      <FormLabel
        id={labelId}
        style={{ fontWeight: 700, margin: '0.83em 0' }}
        component="span"
      >
        {label}
      </FormLabel>
      <MuiRadioGroup
        row
        className={classes.group}
        aria-labelledby={labelId}
        aria-describedby={error ? errorId : undefined}
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
          <Typography
            id={errorId}
            className={classes.error}
            // Logical, so it is still the leading edge in Hebrew RTL. Inline
            // because @mui/styles (JSS) is outside the emotion RTL cache and
            // Typography's own `margin: 0` would otherwise win on order.
            style={{ marginInlineStart: 32 }}
          >
            {error}
          </Typography>
        )}
      </MuiRadioGroup>
    </FormControl>
  );
}
