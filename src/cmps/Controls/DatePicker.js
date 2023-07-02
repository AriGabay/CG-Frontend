import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DatePickerComp from '@material-ui/lab/DatePicker';
import PickersDay from '@material-ui/lab/PickersDay';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import isBefore from 'date-fns/isBefore';
import startOfToday from 'date-fns/startOfToday';
import isFriday from 'date-fns/isFriday';
import nextFriday from 'date-fns/nextFriday';

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

  const color = (day) => {
    return validateDate(day)
      ? { opacity: 0.25 }
      : { backgroundColor: '#937446' };
  };
  const validateDate = (day) => {
    if (!day) return;
    return (
      ((isBefore(day, startOfToday()) || !isFriday(day)) &&
        !day.toString().includes('Apr 05')) ||
      day.toString().includes('Apr 07')
    );
  };
  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePickerComp
          open={isOpen}
          variant="inline"
          inputVariant="outlined"
          label={label}
          inputFormat="dd/MM/yyyy"
          name={name}
          value={
            isFriday(value) || value.toString().includes('Apr 05')
              ? value
              : nextFriday(value)
          }
          required={required}
          renderInput={(params) => (
            <TextField
              aria-label="בחר תאריך"
              onKeyDown={(event) => {
                event.preventDefault();
              }}
              onClick={() => setIsOpen(!isOpen)}
              inputProps={{ ...params.inputProps, readOnly: true }}
              {...params}
            />
          )}
          onChange={(day) => {
            onChange(convertToDefEventPara(name, dateToStr(day)));
            setIsOpen(false);
          }}
          renderDay={(day, _, moreDetailsForDay) => {
            return (
              <PickersDay
                day={day}
                key={moreDetailsForDay.key}
                outsideCurrentMonth={false}
                disabled={validateDate(day)}
                style={color(day)}
                onDaySelect={() => {
                  onChange(convertToDefEventPara(name, dateToStr(day)));
                  setIsOpen(false);
                }}
              />
            );
          }}
        />
        {error && <FormHelperText>{error}</FormHelperText>}
      </LocalizationProvider>
    </div>
  );
}
DatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
};
