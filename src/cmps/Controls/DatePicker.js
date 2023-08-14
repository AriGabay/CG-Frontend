import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker as DatePickerMui } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider, PickersDay } from '@mui/x-date-pickers';
import TextField from '@mui/material/TextField';
import FormHelperText from '@mui/material/FormHelperText';
import isFriday from 'date-fns/isFriday';
import he from 'date-fns/locale/he';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  '.Mui-selected': {
    backgroundColor: 'red !important',
  },

  focusedCell: {
    backgroundColor: 'red !important',
  },
});

export default function DatePicker(props) {
  let { name, label, value, onChange, required = false, error } = props;
  const [selectedDate] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const classes = useStyles();
  const convertToDefEventPara = (name, value) => ({
    target: { name, value },
  });

  const dateToStr = (date) => String(date).slice(0, 16);

  const daysPreview = ({ day, outsideCurrentMonth, ...other }) => {
    const isSelected = isFriday(day);
    return (
      <PickersDay
        {...other}
        tabIndex={isSelected ? 1 : 0}
        selected={isSelected}
        focusRipple={true}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
      />
    );
  };

  return (
    <div
      style={{ width: 'auto', maxWidth: '250px' }}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        event.stopPropagation();
        if (event.key === 'Enter') {
          setIsOpen(true);
        }
      }}
      onClick={() => setIsOpen(!isOpen)}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={he}>
        <DatePickerMui
          className={classes.root}
          variant="inline"
          role="dialog"
          aria-labelledby={label}
          aria-describedby={label}
          disablePast={true}
          inputVariant="outlined"
          label={label}
          style={{ width: '200px' }}
          DialogProps={{ className: 'mui-datepicker' }}
          inputFormat="dd/MM/yyyy"
          name={name}
          value={selectedDate}
          required={required}
          slotProps={{
            textField: {
              readOnly: true,
              InputLabelProps: { style: { fontWeight: 700, color: 'black' } },
            },
          }}
          slots={{
            day: daysPreview,
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              aria-label="בחר תאריך"
              onKeyDown={(e) => e.preventDefault()}
              onClick={() => setIsOpen(!isOpen)}
              inputProps={{ ...params.inputProps }}
              style={{ cursor: 'pointer' }}
            />
          )}
          onChange={(day) => {
            setIsOpen(false);
            onChange(convertToDefEventPara(name, dateToStr(day)));
          }}
          shouldDisableDate={(date) => date.getDay() !== 5}
          open={isOpen}
        />
        {error?.pickUpDate && (
          <FormHelperText>{error.pickUpDate}</FormHelperText>
        )}
      </LocalizationProvider>
    </div>
  );
}
DatePicker.propTypes = {
  onChange: PropTypes.func.isRequired,
};
