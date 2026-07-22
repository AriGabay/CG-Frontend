import React, { useEffect, useMemo, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  size: {
    width: '200px!important',
  },
}));

// Module-scope so its identity is stable across renders (an inline function
// re-triggers MUI's inputValue-sync effect on every render — part of the bug
// this component had).
const labelOf = (opt) =>
  opt && typeof opt === 'object'
    ? String(opt.displayName ?? opt.productName ?? '')
    : '';

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
 *
 * Two things here are load-bearing for correct filtering — see the bug where
 * typing a product name returned unrelated results:
 *   1. `inputValue` is CONTROLLED. Left uncontrolled, MUI's internal input state
 *      desynced from the box (this component's inline renderInput changes
 *      identity every render, retriggering MUI's reset effect), so the filter
 *      ran on a stale string and kept stale, non-matching options in the list.
 *   2. options are de-duplicated by id and keyed by id (`getOptionKey`). MUI
 *      keys options by their label when no getOptionKey is given; the catalogue
 *      has repeated names/ids, so the labels collided and React could not
 *      reconcile the list as it narrowed.
 */
export default function Select(props) {
  const classes = useStyles();
  const {
    name,
    label,
    value,
    error = null,
    onChange,
    options: rawOptions = [],
    className,
    // eslint-disable-next-line no-unused-vars
    variant, // absorbed: the old API accepted it, Autocomplete sets its own
    ...other
  } = props;

  const options = useMemo(() => {
    const seen = new Set();
    return (rawOptions || []).filter((o) => {
      const k = String(o && o.id);
      if (!o || seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, [rawOptions]);

  // The form state stores an id; Autocomplete wants the matching option object.
  const selected =
    value === '' || value === null || value === undefined
      ? null
      : options.find((o) => String(o.id) === String(value)) ?? null;

  const [inputValue, setInputValue] = useState('');
  // Sync the text box to the externally-controlled value (an id). Depending on
  // `value`/`options` only — never on `inputValue` — so it can't fight typing:
  // while the user types, only local inputValue changes, so this stays put.
  useEffect(() => {
    const opt =
      value === '' || value === null || value === undefined
        ? null
        : (rawOptions || []).find((o) => String(o.id) === String(value));
    setInputValue(opt ? labelOf(opt) : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, rawOptions]);

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
      inputValue={inputValue}
      onInputChange={(_e, v) => setInputValue(v)}
      getOptionLabel={labelOf}
      getOptionKey={(o) => o.id}
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
