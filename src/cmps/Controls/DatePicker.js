import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker as DatePickerMui } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import isFriday from 'date-fns/isFriday';
import nextFriday from 'date-fns/nextFriday';
import he from 'date-fns/locale/he';

export default function DatePicker(props) {
  const { name, label, value, onChange, required = false, error } = props;

  const [isOpen, setIsOpen] = useState(false);
  const convertToDefEventPara = (name, value) => {
    const e = {
      target: {
        name,
        value,
      },
    };
    return e;
  };

  const dateToStr = (date) => {
    date = date + '';
    return date.slice(0, 16);
  };

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={he}>
        <DatePickerMui
          variant="inline"
          disablePast
          inputVariant="outlined"
          label={label}
          style={{ width: '200px' }}
          DialogProps={{ className: 'mui-datepicker' }}
          inputFormat="dd/MM/yyyy"
          name={name}
          value={
            isFriday(value) || value.toString().includes('Apr 05')
              ? value
              : nextFriday(value)
          }
          required={required}
          slotProps={{ textField: { readOnly: true } }}
          renderInput={(params) => (
            <TextField
              aria-label="בחר תאריך"
              onKeyDown={(e) => e.preventDefault()}
              onClick={() => setIsOpen(!isOpen)}
              {...params}
              inputProps={{ ...params.inputProps }}
            />
          )}
          onChange={(day) => {
            onChange(convertToDefEventPara(name, dateToStr(day)));
            setIsOpen(false);
          }}
          shouldDisableDate={(date) => date.getDay() !== 5}
        />
        {error && <FormHelperText>{error}</FormHelperText>}
      </LocalizationProvider>
    </div>
  );
}
DatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
};
