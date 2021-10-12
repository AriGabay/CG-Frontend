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

export default function DatePicker(props) {
  const { name, label, value, onChange, required = false, error } = props;

  const convertToDefEventPara = (name, value) => ({
    target: {
      name,
      value
    }
  });

  const dateToStr = (date) => {
    date = date + '';
    return date.slice(0, 16);
  };

  const color = (day) => {
    return isBefore(day, startOfToday()) || !isFriday(day) ? { opacity: 0.25 } : { backgroundColor: '#937446' };
  };

  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePickerComp
          variant="inline"
          inputVariant="outlined"
          label={label}
          format="dd/MM/yyyy"
          name={name}
          value={value}
          required={required}
          renderInput={(params) => <TextField {...params} />}
          onChange={(day) => {
            onChange(convertToDefEventPara(name, dateToStr(day)));
          }}
          renderDay={(day, _, moreDetailsForDay) => {
            return (
              <PickersDay
                day={day}
                key={moreDetailsForDay.key}
                outsideCurrentMonth={false}
                disabled={isBefore(day, startOfToday()) || !isFriday(day)}
                style={color(day)}
                onDaySelect={() => {
                  onChange(convertToDefEventPara(name, dateToStr(day)));
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
  onChange: PropTypes.func.isRequired
};
