import React from 'react';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { AirlineSeatIndividualSuite } from '@material-ui/icons';

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
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        disableToolbar
        required={required}
        variant="inline"
        inputVariant="outlined"
        label={label}
        format="dd/MM/yyyy"
        name={name}
        value={value}
        disablePast={true}
        onChange={(date) => {
          onChange(convertToDefEventPara(name, dateToStr(date)));
        }}
      />
    </MuiPickersUtilsProvider>
  );
}
