import React from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  size: {
    width: '200px!important',
  },
}));

/**
 * Admin combobox. The admin manages hundreds of products / prices, so the old
 * plain <select> meant scrolling a long list by hand. This renders a
 * type-to-filter Autocomplete instead, while keeping the EXACT external API the
 * admin forms already rely on:
 *
 *   props:  { name, label, value (an id or ''), options: [{id, displayName|productName}], onChange, error }
 *   onChange: still called with a synthetic { target: { name, value } } so every
 *             existing handler — handleInputChange and the custom ones in
 *             SizePrice/Category — keeps working unchanged. Clearing the field
 *             sends value: '' (the old "None" option).
 *
 * Used only under AdminPage; no customer-facing screen renders it.
 */
export default function Select(props) {
  const classes = useStyles();
  const {
    name,
    label,
    value,
    error = null,
    onChange,
    options = [],
    className,
    // eslint-disable-next-line no-unused-vars
    variant, // absorbed: the old API accepted it, Autocomplete sets its own
    ...other
  } = props;

  const getOptionLabel = (opt) =>
    opt && typeof opt === 'object'
      ? String(opt.displayName ?? opt.productName ?? '')
      : '';

  // The form state stores an id; Autocomplete wants the matching option object.
  const selected =
    value === '' || value === null || value === undefined
      ? null
      : options.find((o) => String(o.id) === String(value)) ?? null;

  const handleChange = (_event, newValue) => {
    if (!onChange) return;
    onChange({ target: { name, value: newValue ? newValue.id : '' } });
  };

  return (
    <Autocomplete
      className={`${classes.size} ${className || ''}`}
      options={options}
      value={selected}
      onChange={handleChange}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(opt, val) => String(opt.id) === String(val.id)}
      noOptionsText="לא נמצאו תוצאות"
      clearText="ניקוי"
      openText="פתיחה"
      closeText="סגירה"
      fullWidth
      {...other}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          name={name}
          variant="outlined"
          error={!!error}
          helperText={error || ''}
        />
      )}
    />
  );
}
