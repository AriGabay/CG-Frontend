import React from 'react';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import DatePickerComp from '@material-ui/lab/DatePicker';
import TextField from '@material-ui/core/TextField';
import isBefore from 'date-fns/isBefore';
import startOfToday from 'date-fns/startOfToday';
import isFriday from 'date-fns/isFriday';
export default function DatePicker(props) {
  const { name, label, value, onChange, required = false } = props;

  const convertToDefEventPara = (name, value) => ({
    target: {
      name,
      value,
    },
  });
  const dateToStr = (date) => {
    date = date + '';
    return date.slice(0, 16);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePickerComp
        variant="inline"
        inputVariant="outlined"
        label={label}
        format="dd/MM/yyyy"
        name={name}
        value={value}
        required={required}
        shouldDisableDate={(day) => isBefore(day, startOfToday()) || !isFriday(day)}
        renderInput={(params) => <TextField {...params} />}
        onChange={(date) => {
          onChange(convertToDefEventPara(name, dateToStr(date)));
        }}
      />
    </LocalizationProvider>
  );
}
